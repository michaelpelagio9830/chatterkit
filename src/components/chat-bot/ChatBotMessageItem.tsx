import { cn } from '../../utils/cn';
import { ChatMarkdown, markdownNode } from '../../utils/markdown';
import { useChatBotContext } from './ChatBot.context';
import type { ChatBotMessageItemProps } from './ChatBot.types';

export function ChatBotMessageItem({ message, children, className, bubbleClassName, ...itemProps }: ChatBotMessageItemProps) {
  const { classNames } = useChatBotContext('ChatBot.MessageItem');
  const isUser = message.role === 'user';

  return (
    <li {...itemProps} className={cn('flex', isUser ? 'justify-end' : 'justify-start', classNames?.message, className)}>
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-6 shadow-sm',
          isUser
            ? 'rounded-br-sm bg-slate-900 text-white'
            : 'rounded-bl-sm bg-white text-slate-900 ring-1 ring-slate-200',
          isUser ? classNames?.userMessage : classNames?.botMessage,
          bubbleClassName,
        )}
      >
        {children != null ? markdownNode(children) : <ChatMarkdown content={message.content} />}
      </div>
    </li>
  );
}
