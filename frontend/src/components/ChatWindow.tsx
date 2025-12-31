import { type FormEvent, useEffect, useRef } from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export type Sender = "user" | "ai";

export type ChatMessage = {
  id: string;
  sender: Sender;
  text: string;
  createdAt: string;
};

type ChatWindowProps = {
  messages: ChatMessage[];
  error: string | null;
  input: string;
  isSending: boolean;
  canSend: boolean;
  conversationId: number | null;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function ChatWindow({
  messages,
  error,
  input,
  isSending,
  canSend,
  conversationId,
  onInputChange,
  onSubmit,
}: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className='w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-xl'>
      <div className='flex items-center justify-between border-b border-slate-800 pb-3'>
        <div className='text-slate-300 font-semibold text-lg'>
          {conversationId ? `Chat #${conversationId}` : "New Chat"}
        </div>
      </div>

      <div
        className='min-h-[320px] max-h-[60vh] overflow-y-auto flex flex-col gap-3 pr-1'
        role='log'
        aria-live='polite'
      >
        <MessageList messages={messages} isSending={isSending} />
        <div ref={endRef} />
      </div>

      {error && (
        <div className='bg-rose-900/60 border border-rose-500 text-rose-50 px-3 py-2 rounded-lg text-sm'>
          {error}
        </div>
      )}

      <MessageInput
        value={input}
        isSending={isSending}
        canSend={canSend}
        onChange={onInputChange}
        onSubmit={onSubmit}
      />
    </main>
  );
}

export default ChatWindow;
