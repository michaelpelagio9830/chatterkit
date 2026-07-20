import { type FormEvent } from 'react';
import { cn } from '../../utils/cn';
import { useChatBotContext } from './ChatBot.context';
import type { ChatBotComposerProps, ChatBotInputProps, ChatBotSubmitButtonProps } from './ChatBot.types';

export function ChatBotComposer({ children, className, onSubmit, ...formProps }: ChatBotComposerProps) {
  const { submitDraft, classNames } = useChatBotContext('ChatBox.Composer');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(event);
    await submitDraft();
  };

  return (
    <form {...formProps} className={cn('ck-flex ck-gap-2 ck-border-t ck-border-slate-200 ck-bg-white ck-p-3', classNames?.composer, className)} onSubmit={handleSubmit}>
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
  const { draft, setDraft, disabled, placeholder: defaultPlaceholder, classNames } = useChatBotContext('ChatBox.Input');

  return (
    <>
      <label className="ck-sr-only" htmlFor={id}>
        Message
      </label>
      <input
        {...inputProps}
        id={id}
        className={cn(
          'ck-appearance-none ck-min-w-0 ck-flex-1 ck-rounded-xl ck-border ck-bg-white ck-px-3 ck-py-2 ck-text-sm ck-text-slate-900 ck-outline-none ck-transition focus:ck-border-slate-500 focus:ck-ring-1 focus:ck-ring-slate-300 disabled:ck-cursor-not-allowed disabled:ck-bg-slate-100',
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
  const { draft, disabled: composerDisabled, sendLabel, classNames } = useChatBotContext('ChatBox.SubmitButton');
  const isDisabled = disabled ?? (composerDisabled || !draft.trim());

  return (
    <button
      {...buttonProps}
      className={cn(
        'ck-rounded-xl ck-bg-slate-900 ck-px-4 ck-py-2 ck-text-sm ck-font-medium ck-text-white ck-transition hover:ck-bg-slate-700 disabled:ck-cursor-not-allowed disabled:ck-bg-slate-400',
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
