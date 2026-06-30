import { type FormEvent } from 'react';
import { cn } from '../../utils/cn';
import { useChatBotContext } from './ChatBot.context';
import type { ChatBotComposerProps, ChatBotInputProps, ChatBotSubmitButtonProps } from './ChatBot.types';

export function ChatBotComposer({ children, className, onSubmit, ...formProps }: ChatBotComposerProps) {
  const { submitDraft, classNames } = useChatBotContext('ChatBot.Composer');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(event);
    await submitDraft();
  };

  return (
    <form {...formProps} className={cn('flex gap-2 border-t border-slate-200 bg-white p-3', classNames?.composer, className)} onSubmit={handleSubmit}>
      {children ?? (
        <>
          <ChatBotInput />
          <ChatBotSubmitButton />
        </>
      )}
    </form>
  );
}

export function ChatBotInput({ className, id = 'chatbot-message-input', placeholder, ...inputProps }: ChatBotInputProps) {
  const { draft, setDraft, disabled, placeholder: defaultPlaceholder, classNames } = useChatBotContext('ChatBot.Input');

  return (
    <>
      <label className="sr-only" htmlFor={id}>
        Message
      </label>
      <input
        {...inputProps}
        id={id}
        className={cn(
          'min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100',
          classNames?.input,
          className,
        )}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder ?? defaultPlaceholder}
        disabled={disabled}
      />
    </>
  );
}

export function ChatBotSubmitButton({ children, className, disabled, ...buttonProps }: ChatBotSubmitButtonProps) {
  const { draft, disabled: composerDisabled, sendLabel, classNames } = useChatBotContext('ChatBot.SubmitButton');
  const isDisabled = disabled ?? (composerDisabled || !draft.trim());

  return (
    <button
      {...buttonProps}
      className={cn(
        'rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400',
        classNames?.sendButton,
        className,
      )}
      type="submit"
      disabled={isDisabled}
    >
      {children ?? sendLabel}
    </button>
  );
}
