import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';
import { useChatbot } from '../hooks/useChatbot';
import type { ChatBotProps } from '../types';
import { cn } from '../utils/cn';

export function ChatBot(props: ChatBotProps) {
  const {
    title = 'Chatbot',
    placeholder = 'Type your message...',
    disabled = false,
    className,
    classNames,
    emptyState,
    loadingLabel = 'Thinking...',
    errorLabel = 'Something went wrong. Please try again.',
    sendLabel = 'Send',
  } = props;
  const { messages, isLoading, error, submitMessage } = useChatbot(props);

  return (
    <section
      aria-label={title}
      className={cn(
        'flex h-[32rem] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-lg',
        className,
        classNames?.root,
      )}
    >
      <header className={cn('border-b border-slate-200 bg-white px-4 py-3', classNames?.header)}>
        <h2 className={cn('text-base font-semibold text-slate-900', classNames?.title)}>{title}</h2>
      </header>

      <MessageList messages={messages} classNames={classNames} emptyState={emptyState} />

      {isLoading ? (
        <div className={cn('px-4 pb-2 text-xs text-slate-500', classNames?.loading)} role="status">
          {loadingLabel}
        </div>
      ) : null}

      {error ? (
        <div className={cn('px-4 pb-2 text-xs text-red-600', classNames?.error)} role="alert">
          {errorLabel}
        </div>
      ) : null}

      <MessageInput
        onSubmit={submitMessage}
        disabled={disabled || isLoading}
        placeholder={placeholder}
        sendLabel={sendLabel}
        classNames={classNames}
      />
    </section>
  );
}