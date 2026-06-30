import { cn } from '../../utils/cn';
import { useChatBotContext } from './ChatBot.context';
import type { ChatBotHeaderProps, ChatBotTitleProps } from './ChatBot.types';

export function ChatBotHeader({ children, className, ...headerProps }: ChatBotHeaderProps) {
  const { classNames } = useChatBotContext('ChatBot.Header');

  return (
    <header {...headerProps} className={cn('border-b border-slate-200 bg-white px-4 py-3', classNames?.header, className)}>
      {children ?? <ChatBotTitle />}
    </header>
  );
}

export function ChatBotTitle({ children, className, ...titleProps }: ChatBotTitleProps) {
  const { title, classNames } = useChatBotContext('ChatBot.Title');

  return (
    <h2 {...titleProps} className={cn('text-base font-semibold text-slate-900', classNames?.title, className)}>
      {children ?? title}
    </h2>
  );
}
