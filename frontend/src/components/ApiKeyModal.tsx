import { useState } from "react";

type ApiKeyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
};

function ApiKeyModal({
  isOpen,
  onClose,
  onSave,
  currentKey,
}: ApiKeyModalProps) {
  const [key, setKey] = useState(currentKey);
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(key);
    onClose();
  };

  const handleClear = () => {
    setKey("");
    onSave("");
    onClose();
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-lg w-full'>
        <h2 className='text-xl font-semibold text-slate-100 mb-4'>
          OpenAI API Key Settings
        </h2>

        <p className='text-sm text-slate-400 mb-4'>
          To use this chat, provide your own OpenAI API key. Your key is stored
          locally in your browser and sent directly to OpenAI - it's never saved
          on our servers.
        </p>

        <div className='mb-4'>
          <label className='block text-sm text-slate-300 mb-2'>API Key</label>
          <div className='relative'>
            <input
              type={showKey ? "text" : "password"}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder='sk-...'
              className='w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-indigo-500'
            />
            <button
              type='button'
              onClick={() => setShowKey(!showKey)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 text-sm'
            >
              {showKey ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className='text-xs text-slate-500 mb-4'>
          Get your API key from{" "}
          <a
            href='https://platform.openai.com/api-keys'
            target='_blank'
            rel='noopener noreferrer'
            className='text-indigo-400 hover:text-indigo-300 underline'
          >
            OpenAI Platform
          </a>
        </div>

        <div className='flex gap-3'>
          <button
            onClick={handleSave}
            className='flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors'
          >
            Save Key
          </button>
          {currentKey && (
            <button
              onClick={handleClear}
              className='px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium transition-colors'
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className='px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium transition-colors'
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyModal;
