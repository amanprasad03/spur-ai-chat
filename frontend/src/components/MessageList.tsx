import type { ChatMessage } from "./ChatWindow";
import { formatTime } from "../utils/formatTime";
import MarkdownRenderer from "./MarkdownRenderer";

type MessageListProps = {
  messages: ChatMessage[];
  isSending?: boolean;
};

const getAvatar = (sender: "user" | "ai"): string => {
  return sender === "user" ? "👤" : "🤖";
};

function MessageList({ messages, isSending = false }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className='text-center text-slate-400 py-6'>
        No messages yet. Say hello to start.
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-4'>
      {messages.map((msg, index) => {
        const prevMsg = index > 0 ? messages[index - 1] : null;
        const isFirstInGroup = !prevMsg || prevMsg.sender !== msg.sender;

        return (
          <div
            key={msg.id}
            className={`flex gap-2 max-w-[85%] ${
              msg.sender === "user" ? "self-end" : "self-start"
            }`}
          >
            {msg.sender === "ai" && isFirstInGroup && (
              <div className='text-2xl flex-shrink-0 mt-0.5'>
                {getAvatar("ai")}
              </div>
            )}
            {msg.sender === "ai" && !isFirstInGroup && (
              <div className='w-8 flex-shrink-0' />
            )}

            <div
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              {isFirstInGroup && (
                <div className='text-xs text-slate-400 mb-1'>
                  {msg.sender === "user" ? "You" : "Support"}
                  {msg.createdAt && (
                    <span className='ml-2 text-slate-500'>
                      {formatTime(msg.createdAt)}
                    </span>
                  )}
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-xl leading-relaxed border ${
                  msg.sender === "user"
                    ? "bg-indigo-600 border-indigo-500 text-slate-50"
                    : "bg-slate-800 border-slate-700 text-slate-100"
                }`}
              >
                {msg.sender === "ai" ? (
                  <MarkdownRenderer content={msg.text} />
                ) : (
                  msg.text
                )}
              </div>
            </div>

            {msg.sender === "user" && isFirstInGroup && (
              <div className='text-2xl flex-shrink-0 mt-0.5'>
                {getAvatar("user")}
              </div>
            )}
            {msg.sender === "user" && !isFirstInGroup && (
              <div className='w-8 flex-shrink-0' />
            )}
          </div>
        );
      })}

      {isSending && (
        <div className='flex gap-2 max-w-[85%] self-start'>
          <div className='text-2xl flex-shrink-0 mt-0.5'>🤖</div>
          <div className='flex flex-col items-start'>
            <div className='text-xs text-slate-400 mb-1'>Support</div>
            <div className='px-4 py-3 rounded-xl border bg-slate-800 border-slate-700 text-slate-100'>
              <div className='flex gap-1 items-center'>
                <span
                  className='animate-bounce'
                  style={{ animationDelay: "0ms" }}
                >
                  •
                </span>
                <span
                  className='animate-bounce'
                  style={{ animationDelay: "150ms" }}
                >
                  •
                </span>
                <span
                  className='animate-bounce'
                  style={{ animationDelay: "300ms" }}
                >
                  •
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageList;
