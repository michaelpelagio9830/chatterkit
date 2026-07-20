import type { ChatBotClassNames, ChatMessage } from '../types';
import { cn } from '../utils/cn';
import { ChatMarkdown } from '../utils/markdown';

export interface MessageItemProps {
  message: ChatMessage;
  classNames?: ChatBotClassNames;
}

export function MessageItem({ message, classNames }: MessageItemProps) {
  const isUser = message.role === 'user';

  return (
    <li className={cn('ck-flex', isUser ? 'ck-justify-end' : 'ck-justify-start', classNames?.message)}>
      <div
        className={cn(
          'ck-max-w-[80%] ck-rounded-2xl ck-px-3 ck-py-2 ck-text-sm ck-leading-6 ck-shadow-sm',
          isUser
            ? 'ck-rounded-br-sm ck-bg-slate-900 ck-text-white'
            : 'ck-rounded-bl-sm ck-bg-white ck-text-slate-900 ck-ring-1 ck-ring-slate-200',
          isUser ? classNames?.userMessage : classNames?.botMessage,
        )}
      >
        <ChatMarkdown content={message.content} />
      </div>
    </li>
  );
}