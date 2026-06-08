import type { ReactNode } from 'react';
import { MessageItem } from './MessageItem';
import type { ChatBotClassNames, ChatMessage } from '../types';
import { cn } from '../utils/cn';

export interface MessageListProps {
  messages: ChatMessage[];
  classNames?: ChatBotClassNames;
  emptyState?: ReactNode;
}

export function MessageList({ messages, classNames, emptyState }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className={cn('flex flex-1 items-center justify-center p-6 text-sm text-slate-500', classNames?.empty)}>
        {emptyState ?? 'No messages yet. Start the conversation below.'}
      </div>
    );
  }

  return (
    <ul className={cn('flex flex-1 flex-col gap-3 overflow-y-auto p-4', classNames?.messages)}>
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} classNames={classNames} />
      ))}
    </ul>
  );
}