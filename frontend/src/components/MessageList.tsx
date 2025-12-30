import type { ChatMessage } from "./ChatWindow";

type MessageListProps = {
  messages: ChatMessage[];
};

function MessageList({ messages }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className='text-center text-slate-400 py-6'>
        No messages yet. Say hello to start.
      </div>
    );
  }

  return (
    <>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex flex-col gap-1 max-w-[80%] ${
            msg.sender === "user" ? "self-end text-right" : "self-start"
          }`}
        >
          <div className='text-xs text-slate-400'>
            {msg.sender === "user" ? "You" : "Support"}
          </div>
          <div
            className={`px-4 py-3 rounded-xl leading-relaxed border ${
              msg.sender === "user"
                ? "bg-indigo-600 border-indigo-500 text-slate-50"
                : "bg-slate-800 border-slate-700 text-slate-100"
            }`}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </>
  );
}

export default MessageList;
