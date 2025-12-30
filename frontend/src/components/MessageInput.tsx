import { type FormEvent } from "react";

type MessageInputProps = {
  value: string;
  isSending: boolean;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function MessageInput({
  value,
  isSending,
  onChange,
  onSubmit,
}: MessageInputProps) {
  const isEmpty = value.trim() === "";

  return (
    <form
      className='grid grid-cols-[1fr_auto] gap-3 items-center'
      onSubmit={onSubmit}
    >
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Type your message'
        disabled={isSending}
        aria-label='Message'
        className='w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'
      />
      <button
        type='submit'
        disabled={isSending || isEmpty}
        className='px-4 py-3 rounded-xl border border-indigo-500 bg-indigo-600 text-slate-50 font-semibold min-w-[96px] disabled:opacity-60 disabled:cursor-not-allowed'
      >
        {isSending ? "Sending…" : "Send"}
      </button>
    </form>
  );
}

export default MessageInput;
