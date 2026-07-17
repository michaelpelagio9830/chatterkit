import { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import { useChatBotContext } from './ChatBot.context';
import { scrollNearestContainerToBottom } from './scroll';
import type { ChatBotStateProps } from './ChatBot.types';

export function ChatBotEmpty({ children, className, ...divProps }: ChatBotStateProps) {
  const { messages, emptyState, classNames } = useChatBotContext('ChatBox.Empty');

  if (messages.length > 0) {
    return null;
  }

  return (
    <div {...divProps} className={cn('flex flex-1 items-center justify-center p-6 text-sm text-slate-500', classNames?.empty, className)}>
      {children ?? emptyState ?? 'No messages yet. Start the conversation below.'}
    </div>
  );
}

export function ChatBotLoading({ children, className, ...divProps }: ChatBotStateProps) {
  const { isLoading, loadingLabel, classNames } = useChatBotContext('ChatBox.Loading');
  const loadingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isLoading) {
      scrollNearestContainerToBottom(loadingRef.current);
    }
  }, [isLoading]);

  if (!isLoading) {
    return null;
  }

  return (
    <div ref={loadingRef} {...divProps} className={cn('px-4 pb-2 text-xs text-slate-500', classNames?.loading, className)} role="status">
      {children ?? loadingLabel}
    </div>
  );
}

export function ChatBotError({ children, className, ...divProps }: ChatBotStateProps) {
  const { error, errorLabel, classNames } = useChatBotContext('ChatBox.Error');

  if (!error) {
    return null;
  }

  return (
    <div {...divProps} className={cn('px-4 pb-2 text-xs text-red-600', classNames?.error, className)} role="alert">
      {children ?? errorLabel}
    </div>
  );
}
