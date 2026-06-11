import { Fragment, type MouseEvent } from 'react';
import { cn } from '../../utils/cn';
import { useChatBotContext } from './ChatBot.context';
import type { ChatBotFaqOptionButtonProps, ChatBotFaqOptionRenderState, ChatBotFaqOptionsProps } from './ChatBot.types';

export function ChatBotFaqOptions({ children, className, label, ...containerProps }: ChatBotFaqOptionsProps) {
  const { faqItems = [], isFaqMode, disabled, submitMessage, faqOptionsLabel, classNames } =
    useChatBotContext('ChatBot.FaqOptions');
  const resolvedLabel = label ?? faqOptionsLabel;
  const defaultButtonClassName = cn(
    'shrink-0 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60',
    classNames?.faqOptionButton,
  );

  if (!isFaqMode || faqItems.length === 0) {
    return null;
  }

  return (
    <div
      {...containerProps}
      className={cn('border-t border-slate-200 bg-white px-4 py-3', classNames?.faqOptions, className)}
    >
      {label && <p className="mb-2 text-xs font-medium text-slate-500">{resolvedLabel}</p>}
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-color:theme(colors.slate.300)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent">
        {faqItems.map((item, index) => {
          const submit = () => void submitMessage(item.question);
          const getButtonProps = ({ className: buttonClassName, onClick, disabled: buttonDisabled, ...buttonProps }: ChatBotFaqOptionButtonProps = {}) => ({
            ...buttonProps,
            type: 'button' as const,
            className: cn(defaultButtonClassName, buttonClassName),
            disabled: buttonDisabled ?? disabled,
            onClick: (event: MouseEvent<HTMLButtonElement>) => {
              onClick?.(event);

              if (!event.defaultPrevented) {
                submit();
              }
            },
          });
          const renderState = { index, disabled, submit, getButtonProps } satisfies ChatBotFaqOptionRenderState;

          return children && children.length >= 2 ? (
            <Fragment key={item.id ?? item.question}>{children(item, renderState)}</Fragment>
          ) : (
            <button key={item.id ?? item.question} {...getButtonProps()}>
              {children ? children(item, renderState) : item.question}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ChatBotPresetFaqOptions() {
  const { faqOptionsLabel, isFaqMode, showFaqOptions } = useChatBotContext('ChatBot.FaqOptions');

  if (!isFaqMode || !showFaqOptions) {
    return null;
  }

  return <ChatBotFaqOptions label={faqOptionsLabel} />;
}
