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
    <div {...divProps} className={cn('ck-flex ck-flex-1 ck-items-center ck-justify-center ck-p-6 ck-text-sm ck-text-slate-500 ck-relative  ck-h-[stretch]', classNames?.empty, className)}>
      <div className='ck-relative'>

      {children ?? emptyState ?? 'No messages yet. Start the conversation below.'}
      </div>
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
    <div ref={loadingRef} {...divProps} className={cn('ck-px-4 ck-pb-2 ck-text-xs ck-text-slate-500', classNames?.loading, className)} role="status">
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
    <div {...divProps} className={cn('ck-px-4 ck-pb-2 ck-text-xs ck-text-red-600', classNames?.error, className)} role="alert">
      {children ?? errorLabel}
    </div>
  );
}
