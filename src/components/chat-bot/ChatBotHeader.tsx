import { cn } from '../../utils/cn';
import { useChatBotContext } from './ChatBot.context';
import type { ChatBotHeaderProps, ChatBotTitleProps } from './ChatBot.types';

export function ChatBotHeader({ children, className, ...headerProps }: ChatBotHeaderProps) {
  const { classNames } = useChatBotContext('ChatBox.Header');

  return (
    <header {...headerProps} className={cn('ck-border-b ck-border-slate-200 ck-bg-white ck-px-4 ck-py-3', classNames?.header, className)}>
      {children ?? <ChatBotTitle />}
    </header>
  );
}

export function ChatBotTitle({ children, className, ...titleProps }: ChatBotTitleProps) {
  const { title, classNames } = useChatBotContext('ChatBox.Title');

  return (
    <h2 {...titleProps} className={cn('ck-text-base ck-font-semibold ck-text-slate-900', classNames?.title, className)}>
      {children ?? title}
    </h2>
  );
}
