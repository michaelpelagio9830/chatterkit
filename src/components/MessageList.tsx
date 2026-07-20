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
      <div className={cn('ck-flex ck-flex-1 ck-items-center ck-justify-center ck-p-6 ck-text-sm ck-text-slate-500', classNames?.empty)}>
        {emptyState ?? 'No messages yet. Start the conversation below.'}
      </div>
    );
  }

  return (
    <ul className={cn('ck-flex ck-flex-1 ck-flex-col ck-gap-3 ck-overflow-y-auto ck-p-4', classNames?.messages)}>
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} classNames={classNames} />
      ))}
    </ul>
  );
}