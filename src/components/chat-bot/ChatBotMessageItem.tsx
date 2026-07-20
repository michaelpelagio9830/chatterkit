import { cn } from '../../utils/cn';
import { ChatMarkdown, markdownNode } from '../../utils/markdown';
import { useChatBotContext } from './ChatBot.context';
import type { ChatBotMessageItemProps } from './ChatBot.types';

export function ChatBotMessageItem({ message, children, className, bubbleClassName, ...itemProps }: ChatBotMessageItemProps) {
  const { classNames } = useChatBotContext('ChatBox.MessageItem');
  const isUser = message.role === 'user';

  return (
    <li {...itemProps} className={cn('ck-flex', isUser ? 'ck-justify-end' : 'ck-justify-start', classNames?.message, className)}>
      <div
        className={cn(
          'ck-max-w-[80%] ck-rounded-2xl ck-px-3 ck-py-2 ck-text-sm ck-leading-6 ck-shadow-sm',
          isUser
            ? 'ck-rounded-br-sm ck-bg-slate-900 ck-text-white'
            : 'ck-rounded-bl-sm ck-bg-white ck-text-slate-900 ck-ring-1 ck-ring-slate-200',
          isUser ? classNames?.userMessage : classNames?.botMessage,
          bubbleClassName,
        )}
      >
        {children != null ? markdownNode(children) : <ChatMarkdown content={message.content} />}
      </div>
    </li>
  );
}
