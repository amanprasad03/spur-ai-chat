import { type FormEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AxiosError } from "axios";
import ConversationList from "../components/ConversationList";
import ChatWindow, { type ChatMessage } from "../components/ChatWindow";
import ApiKeyModal from "../components/ApiKeyModal";
import * as api from "../services/api";
import type { ConversationMeta } from "../types";

const ACTIVE_CONVERSATION_KEY = "active_conversation_id";
const API_KEY_STORAGE_KEY = "openai_api_key";

function ChatPage() {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState<ConversationMeta[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    number | null
  >(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Check if API key exists on mount
    const key = localStorage.getItem(API_KEY_STORAGE_KEY);
    setHasApiKey(!!key);
  }, []);

  const handleSaveApiKey = (key: string) => {
    if (key) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
      setHasApiKey(true);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      setHasApiKey(false);
    }
  };

  const parseId = (value: string | null): number | null => {
    if (!value) return null;
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const initializeConversations = async () => {
    setError(null);

    const routeId = parseId(searchParams.get("conversationId"));
    const storedId = parseId(localStorage.getItem(ACTIVE_CONVERSATION_KEY));

    try {
      const list = await api.getConversations();
      setConversations(list);

      if (list.length === 0) {
        const created = await api.createConversation();
        setConversations([created]);
        setActiveConversationId(created.id);
        setMessages([]);
        return;
      }

      const ids = new Set(list.map((c) => c.id));
      const candidates = [routeId, storedId, list[0]?.id ?? null];
      const nextActive =
        candidates.find((id) => id != null && ids.has(id)) ?? list[0].id;

      setActiveConversationId(nextActive);
    } catch (err) {
      console.error("Failed to load conversations", err);
      setError("Unable to load conversations. Please try again.");
    }
  };

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    void initializeConversations();
  }, []);

  useEffect(() => {
    if (activeConversationId == null) {
      localStorage.removeItem(ACTIVE_CONVERSATION_KEY);
      setMessages([]);
      return;
    }

    localStorage.setItem(ACTIVE_CONVERSATION_KEY, String(activeConversationId));
    setMessages([]);
    void fetchMessages(activeConversationId);
  }, [activeConversationId]);

  const fetchMessages = async (conversationId: number) => {
    setIsLoadingMessages(true);
    setError(null);

    try {
      const messages = await api.getMessages(conversationId);

      const normalized: ChatMessage[] = messages.map((message, index) => ({
        id: `${conversationId}-${index}-${message.createdAt ?? Date.now()}`,
        sender: message.sender === "user" ? "user" : "ai",
        text: message.text,
        createdAt: message.createdAt,
      }));

      setMessages(normalized);
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 404) {
        setError("Conversation not found.");
        setActiveConversationId(null);
        setMessages([]);
        return;
      }

      console.error("Failed to load messages", err);
      setError("Unable to load messages. Please try again.");
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleCreateConversation = async () => {
    setError(null);

    try {
      const created = await api.createConversation();
      setConversations((prev) => [created, ...prev]);
      setActiveConversationId(created.id);
      setMessages([]);
    } catch (err) {
      console.error("Failed to create conversation", err);
      setError("Unable to start a new conversation. Please try again.");
    }
  };

  const handleSelectConversation = (id: number) => {
    if (isSending) {
      setError(
        "Wait for the current message to finish before switching chats."
      );
      return;
    }

    if (id === activeConversationId) return;
    setActiveConversationId(id);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSending || isLoadingMessages) return;

    const text = input.trim();
    if (!text) return;

    if (!activeConversationId) {
      setError("Select or start a conversation first.");
      return;
    }

    const conversationId = activeConversationId;

    setError(null);
    setInput("");

    // Optimistic user message with temporary timestamp
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);

    try {
      const response = await api.sendMessage({
        message: text,
        conversationId,
      });

      if (activeConversationId === conversationId) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender: "ai",
            text: response.reply,
            createdAt: response.createdAt,
          },
        ]);
      }
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 404) {
        setError("Conversation not found.");
        return;
      }

      console.error("Failed to send message", err);
      setError("Unable to send message right now. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const canSend = Boolean(activeConversationId) && !isLoadingMessages;

  return (
    <div className='min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center px-4 py-8'>
      <header className='w-full max-w-5xl flex items-center justify-between mb-4'>
        <div>
          <div className='text-2xl font-semibold'>Customer Support</div>
          <div className='text-sm text-slate-400 mt-1'>
            Get instant help with orders, products, shipping, returns, and more.
          </div>
        </div>
        <button
          onClick={() => setShowApiKeyModal(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            hasApiKey
              ? "bg-green-900/30 text-green-400 border border-green-800 hover:bg-green-900/40"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          <span className="text-lg">{hasApiKey ? "🔑" : "⚙️"}</span>
          <span>{hasApiKey ? "API Key Set" : "Set API Key"}</span>
        </button>
      </header>

      {!hasApiKey && (
        <div className="w-full max-w-5xl mb-4 bg-amber-900/20 border border-amber-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <div className="font-medium text-amber-200 mb-1">
                OpenAI API Key Required
              </div>
              <div className="text-sm text-amber-300/90">
                To use this chat, please provide your OpenAI API key. Your key is stored locally and never saved on our servers.{" "}
                <button
                  onClick={() => setShowApiKeyModal(true)}
                  className="underline hover:text-amber-200 font-medium"
                >
                  Set it now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='w-full max-w-5xl grid gap-4 lg:grid-cols-[260px_1fr]'>
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleCreateConversation}
        />

        <ChatWindow
          messages={messages}
          error={error}
          input={input}
          isSending={isSending}
          canSend={canSend}
          conversationId={activeConversationId}
          onInputChange={setInput}
          onSubmit={handleSubmit}
        />
      </div>

      <ApiKeyModal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSave={handleSaveApiKey}
        currentKey={localStorage.getItem(API_KEY_STORAGE_KEY) || ""}
      />
    </div>
  );
}

export default ChatPage;
