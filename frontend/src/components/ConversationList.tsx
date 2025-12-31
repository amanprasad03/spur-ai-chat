import { formatDateTime } from "../utils";

type ConversationMeta = {
  id: number;
  createdAt: string;
  updatedAt: string;
};

type ConversationListProps = {
  conversations: ConversationMeta[];
  activeConversationId: number | null;
  onSelectConversation: (id: number) => void;
  onNewChat: () => void;
};

function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
}: ConversationListProps) {
  return (
    <aside className='bg-slate-900 border border-slate-800 rounded-2xl p-4 h-fit'>
      <div className='flex items-center justify-between mb-3'>
        <div className='text-sm text-slate-300'>Conversations</div>
        <button
          type='button'
          onClick={onNewChat}
          className='px-3 py-1.5 rounded-lg border border-indigo-500 bg-indigo-600 text-slate-50 text-sm font-semibold hover:bg-indigo-500'
        >
          New Chat
        </button>
      </div>

      <div className='flex flex-col gap-2'>
        {conversations.length === 0 ? (
          <div className='text-sm text-slate-400'>
            No conversations yet. Start a new chat.
          </div>
        ) : (
          conversations.map((conversation) => (
            <button
              key={conversation.id}
              type='button'
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                activeConversationId === conversation.id
                  ? "border-indigo-400 bg-indigo-900/40 text-indigo-50"
                  : "border-slate-800 bg-slate-950 hover:border-slate-700"
              }`}
            >
              <div className='text-sm font-semibold'>
                Chat #{conversation.id}
              </div>
              <div className='text-xs text-slate-400'>
                {formatDateTime(conversation.updatedAt)}
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}

export default ConversationList;
