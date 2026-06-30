import type { ChatBotClassNames, ChatMessage } from '../types';
import { cn } from '../utils/cn';
import { linkify } from '../utils/linkify';

export interface MessageItemProps {
  message: ChatMessage;
  classNames?: ChatBotClassNames;
}

export function MessageItem({ message, classNames }: MessageItemProps) {
  const isUser = message.role === 'user';

  return (
    <li className={cn('flex', isUser ? 'justify-end' : 'justify-start', classNames?.message)}>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-6 shadow-sm',
          isUser
            ? 'rounded-br-sm bg-slate-900 text-white'
            : 'rounded-bl-sm bg-white text-slate-900 ring-1 ring-slate-200',
          isUser ? classNames?.userMessage : classNames?.botMessage,
        )}
      >
        {linkify(message.content)}
      </div>
    </li>
  );
}