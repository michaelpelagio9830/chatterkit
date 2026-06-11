import { Fragment, useEffect, useRef, useState, type HTMLAttributes } from 'react';
import type { ChatMessage } from '../../types';
import { cn } from '../../utils/cn';
import { useChatBotContext } from './ChatBot.context';
import { ChatBotEmpty } from './ChatBotState';
import { ChatBotMessageItem } from './ChatBotMessageItem';
import { getNearestScrollableContainer, isNearScrollBottom, scrollNearestContainerToBottom } from './scroll';
import type { ChatBotMessagesProps, ChatBotNewMessageIndicatorState } from './ChatBot.types';

export function ChatBotMessages({ children, className, newMessageIndicator, ...containerProps }: ChatBotMessagesProps) {
  const { messages, classNames } = useChatBotContext('ChatBot.Messages');
  const listRef = useRef<HTMLUListElement | null>(null);
  const endRef = useRef<HTMLLIElement | null>(null);
  const previousMessageCountRef = useRef(messages.length);
  const wasNearBottomRef = useRef(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestUnreadMessage, setLatestUnreadMessage] = useState<ChatMessage | null>(null);

  useEffect(() => {
    const container = getNearestScrollableContainer(endRef.current ?? listRef.current);

    if (!container) {
      return;
    }

    const updateNearBottom = () => {
      const isNearBottom = isNearScrollBottom(container);
      wasNearBottomRef.current = isNearBottom;

      if (isNearBottom) {
        setUnreadCount(0);
        setLatestUnreadMessage(null);
      }
    };

    updateNearBottom();
    container.addEventListener('scroll', updateNearBottom, { passive: true });

    return () => container.removeEventListener('scroll', updateNearBottom);
  }, [messages.length]);

  useEffect(() => {
    const previousMessageCount = previousMessageCountRef.current;
    const hasNewMessage = messages.length > previousMessageCount;
    previousMessageCountRef.current = messages.length;

    if (!hasNewMessage) {
      return;
    }

    const latestMessage = messages[messages.length - 1];

    if (latestMessage?.role === 'user') {
      scrollNearestContainerToBottom(endRef.current);
      wasNearBottomRef.current = true;
      setUnreadCount(0);
      setLatestUnreadMessage(null);
      return;
    }

    if (wasNearBottomRef.current) {
      scrollNearestContainerToBottom(endRef.current);
      setUnreadCount(0);
      setLatestUnreadMessage(null);
      return;
    }

    setUnreadCount((current) => current + 1);
    setLatestUnreadMessage(latestMessage ?? null);
  }, [messages]);

  const scrollToBottom = () => {
    scrollNearestContainerToBottom(endRef.current);
    wasNearBottomRef.current = true;
    setUnreadCount(0);
    setLatestUnreadMessage(null);
  };

  const indicatorState = {
    unreadCount,
    latestMessage: latestUnreadMessage,
    isUserNearBottom: wasNearBottomRef.current,
    scrollToBottom,
  } satisfies ChatBotNewMessageIndicatorState;

  const resolvedNewMessageIndicator =
    typeof newMessageIndicator === 'function' ? newMessageIndicator(indicatorState) : newMessageIndicator;

  if (messages.length === 0) {
    return <ChatBotEmpty className={className} {...(containerProps as HTMLAttributes<HTMLDivElement>)} />;
  }

  return (
    <ul
      {...(containerProps as HTMLAttributes<HTMLUListElement>)}
      ref={listRef}
      className={cn('flex flex-1 flex-col gap-3 overflow-y-auto p-4', classNames?.messages, className)}
    >
      {messages.map((message) =>
        children ? <Fragment key={message.id}>{children(message)}</Fragment> : <ChatBotMessageItem key={message.id} message={message} />,
      )}
      {unreadCount > 0 && (
        <li className="sticky bottom-0 z-10 flex justify-center" aria-live="polite">
          {resolvedNewMessageIndicator ?? (
            <button
              type="button"
              className={cn(
                'rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white shadow-lg transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
                classNames?.newMessageIndicator,
              )}
              onClick={scrollToBottom}
            >
              ↓
            </button>
          )}
        </li>
      )}
      <li ref={endRef} aria-hidden="true" className="h-px shrink-0" />
    </ul>
  );
}
