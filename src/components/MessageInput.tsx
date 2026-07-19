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
      className={cn('ck-flex ck-gap-2 ck-border-t ck-border-slate-200 ck-bg-white ck-p-3', classNames?.composer)}
      onSubmit={handleSubmit}
    >
      <label className="ck-sr-only" htmlFor="chatbot-message-input">
        Message
      </label>
      <input
        id="chatbot-message-input"
        className={cn(
          'ck-appearance-none ck-min-w-0 ck-flex-1 ck-rounded-xl ck-border ck-border-slate-300 ck-bg-white ck-px-3 ck-py-2 ck-text-sm ck-text-slate-900 ck-outline-none ck-transition focus:ck-border-slate-500 focus:ck-ring-1 focus:ck-ring-slate-300 disabled:ck-cursor-not-allowed disabled:ck-bg-slate-100',
          classNames?.input,
        )}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
      <button
        className={cn(
          'ck-rounded-xl ck-bg-slate-900 ck-px-4 ck-py-2 ck-text-sm ck-font-medium ck-text-white ck-transition hover:ck-bg-slate-700 disabled:ck-cursor-not-allowed disabled:ck-bg-slate-400',
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