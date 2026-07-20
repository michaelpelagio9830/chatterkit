import { Fragment, useEffect, useRef, useState, type HTMLAttributes } from 'react';
import type { ChatMessage } from '../../types';
import { cn } from '../../utils/cn';
import { useChatBotContext } from './ChatBot.context';
import { ChatBotEmpty } from './ChatBotState';
import { ChatBotMessageItem } from './ChatBotMessageItem';
import { getNearestScrollableContainer, isNearScrollBottom, scrollNearestContainerToBottom } from './scroll';
import type { ChatBotMessagesProps, ChatBotNewMessageIndicatorState } from './ChatBot.types';

export function ChatBotMessages({ children, className, newMessageIndicator, ...containerProps }: ChatBotMessagesProps) {
  const { messages, classNames } = useChatBotContext('ChatBox.Messages');
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
      className={cn('ck-flex ck-flex-1 ck-flex-col ck-gap-3 ck-overflow-y-auto ck-p-4', classNames?.messages, className)}
    >
      {messages.map((message) =>
        children ? <Fragment key={message.id}>{children(message)}</Fragment> : <ChatBotMessageItem key={message.id} message={message} />,
      )}
      {unreadCount > 0 && (
        <li className="ck-sticky ck-bottom-0 ck-z-10 ck-flex ck-justify-center" aria-live="polite">
          {resolvedNewMessageIndicator ?? (
            <button
              type="button"
              className={cn(
                'ck-rounded-full ck-bg-slate-900 ck-px-3 ck-py-1 ck-text-xs ck-font-medium ck-text-white ck-shadow-lg ck-transition hover:ck-bg-slate-700 focus:ck-outline-none focus:ck-ring-2 focus:ck-ring-slate-400 focus:ck-ring-offset-2',
                classNames?.newMessageIndicator,
              )}
              onClick={scrollToBottom}
            >
              ↓
            </button>
          )}
        </li>
      )}
      <li ref={endRef} aria-hidden="true" className="ck-h-px ck-shrink-0" />
    </ul>
  );
}
