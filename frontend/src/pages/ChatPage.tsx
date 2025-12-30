import { type FormEvent, useEffect, useState } from "react";
import ChatWindow, { type ChatMessage } from "../components/ChatWindow";

const SESSION_KEY = "chat_session_id";
const API_URL = import.meta.env.VITE_API_URL;

function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      const parsed = Number.parseInt(stored, 10);
      if (!Number.isNaN(parsed)) {
        setSessionId(parsed);
      }
    }
  }, []);

  const appendMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSending) return;

    const text = input.trim();
    if (!text) return;

    setError(null);
    setInput("");

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text,
    };

    appendMessage(userMessage);
    setIsSending(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = (await response.json()) as {
        reply?: string;
        sessionId?: number;
      };

      if (typeof data.sessionId === "number") {
        setSessionId(data.sessionId);
        localStorage.setItem(SESSION_KEY, String(data.sessionId));
      }

      const replyText =
        data.reply?.trim() ||
        "I had trouble generating a response. Please try again.";

      appendMessage({
        id: crypto.randomUUID(),
        sender: "ai",
        text: replyText,
      });
    } catch (err) {
      console.error("Failed to send message", err);
      setError("Unable to send message right now. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className='min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center px-4 py-8'>
      <header className='w-full max-w-4xl flex items-center justify-between mb-4'>
        <div>
          <div className='text-2xl font-semibold'>Support Chat</div>
          <div className='text-sm text-slate-300 mt-1'>
            Ask about shipping, returns, or hours.
          </div>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm border ${
            isSending
              ? "border-amber-400 text-amber-50 bg-amber-900/40"
              : "border-emerald-400 text-emerald-50 bg-emerald-900/40"
          }`}
        >
          {isSending ? "Thinking…" : "Online"}
        </div>
      </header>

      <ChatWindow
        messages={messages}
        error={error}
        input={input}
        isSending={isSending}
        onInputChange={setInput}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default ChatPage;
