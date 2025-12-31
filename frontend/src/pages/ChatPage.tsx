import { type FormEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ConversationList from "../components/ConversationList";
import ChatWindow, { type ChatMessage } from "../components/ChatWindow";

type ConversationMeta = {
  id: number;
  createdAt: string;
  updatedAt: string;
};

const ACTIVE_CONVERSATION_KEY = "active_conversation_id";
const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(
    /\/message$/,
    ""
  ) || "http://localhost:3000/chat";

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
  const initializedRef = useRef(false);

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
      const response = await fetch(`${API_BASE}/conversations`);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = (await response.json()) as {
        conversations?: ConversationMeta[];
      };

      const list = data.conversations ?? [];
      setConversations(list);

      if (list.length === 0) {
        const created = await createConversationRemote();
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

  const createConversationRemote = async (): Promise<ConversationMeta> => {
    const response = await fetch(`${API_BASE}/conversation`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = (await response.json()) as {
      conversationId?: number;
      createdAt?: string;
      updatedAt?: string;
    };

    if (!data.conversationId) {
      throw new Error("Missing conversationId in response");
    }

    return {
      id: data.conversationId,
      createdAt: data.createdAt ?? new Date().toISOString(),
      updatedAt: data.updatedAt ?? data.createdAt ?? new Date().toISOString(),
    };
  };

  const fetchMessages = async (conversationId: number) => {
    setIsLoadingMessages(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE}/conversation/${conversationId}/messages`
      );

      if (response.status === 404) {
        setError("Conversation not found.");
        setActiveConversationId(null);
        setMessages([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = (await response.json()) as {
        messages?: { sender: string; text: string; createdAt: string }[];
      };

      const normalized: ChatMessage[] = (data.messages ?? []).map(
        (message, index) => ({
          id: `${conversationId}-${index}-${message.createdAt ?? Date.now()}`,
          sender: message.sender === "user" ? "user" : "ai",
          text: message.text,
          createdAt: message.createdAt,
        })
      );

      setMessages(normalized);
    } catch (err) {
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
      const created = await createConversationRemote();

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

    // Optimistic user message with temporary timestamp.
    // When messages are re-fetched, this will be replaced with the server timestamp.
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);

    try {
      const response = await fetch(`${API_BASE}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          conversationId,
        }),
      });

      if (response.status === 404) {
        setError("Conversation not found.");
        return;
      }

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = (await response.json()) as {
        reply?: string;
        createdAt?: string;
      };

      const replyText =
        data.reply?.trim() ||
        "I had trouble generating a response. Please try again.";

      const replyCreatedAt = data.createdAt || new Date().toISOString();

      if (activeConversationId === conversationId) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender: "ai",
            text: replyText,
            createdAt: replyCreatedAt,
          },
        ]);
      }
    } catch (err) {
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
          <div className='text-2xl font-semibold'>Support Chat</div>
          <div className='text-sm text-slate-300 mt-1'>
            Ask about shipping, returns, or hours.
          </div>
        </div>
      </header>

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
          onInputChange={setInput}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default ChatPage;
