import { FormEvent, useState } from 'react';
import type { ChatBotClassNames } from '../types';
import { cn } from '../utils/cn';

export interface MessageInputProps {
  onSubmit: (message: string) => Promise<void> | void;
  disabled?: boolean;
  placeholder?: string;
  sendLabel?: string;
  classNames?: ChatBotClassNames;
}

export function MessageInput({
  onSubmit,
  disabled = false,
  placeholder = 'Type your message...',
  sendLabel = 'Send',
  classNames,
}: MessageInputProps) {
  const [draft, setDraft] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const message = draft.trim();

    if (!message || disabled) {
      return;
    }

    setDraft('');
    await onSubmit(message);
  };

  return (
    <form
      className={cn('flex gap-2 border-t border-slate-200 bg-white p-3', classNames?.composer)}
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="chatbot-message-input">
        Message
      </label>
      <input
        id="chatbot-message-input"
        className={cn(
          'min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100',
          classNames?.input,
        )}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
      <button
        className={cn(
          'rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400',
          classNames?.sendButton,
        )}
        type="submit"
        disabled={disabled || !draft.trim()}
      >
        {sendLabel}
      </button>
    </form>
  );
}