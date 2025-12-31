import { type FormEvent, type KeyboardEvent } from "react";

type MessageInputProps = {
  value: string;
  isSending: boolean;
  canSend: boolean;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function MessageInput({
  value,
  isSending,
  canSend,
  onChange,
  onSubmit,
}: MessageInputProps) {
  const isEmpty = value.trim() === "";

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) {
        form.dispatchEvent(new Event("submit", { bubbles: true }));
      }
    }
  };

  return (
    <form
      className='grid grid-cols-[1fr_auto] gap-3 items-end'
      onSubmit={onSubmit}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Type your message (Shift+Enter for new line)'
        disabled={isSending || !canSend}
        aria-label='Message'
        className='w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none min-h-[44px] max-h-[120px]'
        rows={1}
      />
      <button
        type='submit'
        disabled={isSending || isEmpty || !canSend}
        className='px-4 py-3 rounded-xl border border-indigo-500 bg-indigo-600 text-slate-50 font-semibold min-w-[96px] disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {isSending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}

export default MessageInput;
