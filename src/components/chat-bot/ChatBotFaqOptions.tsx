import { Fragment, type MouseEvent } from 'react';
import { cn } from '../../utils/cn';
import { useChatBotContext } from './ChatBot.context';
import type { ChatBotFaqOptionButtonProps, ChatBotFaqOptionRenderState, ChatBotFaqOptionsProps } from './ChatBot.types';

export function ChatBotFaqOptions({ children, className, label, ...containerProps }: ChatBotFaqOptionsProps) {
  const { faqItems = [], isFaqMode, disabled, submitMessage, faqOptionsLabel, classNames } =
    useChatBotContext('ChatBox.FaqOptions');
  const resolvedLabel = label ?? faqOptionsLabel;
  const defaultButtonClassName = cn(
    'ck-shrink-0 ck-whitespace-nowrap ck-rounded-full ck-border ck-border-slate-200 ck-bg-slate-50 ck-px-3 ck-py-1.5 ck-text-xs ck-font-medium ck-text-slate-700 ck-transition hover:ck-border-slate-300 hover:ck-bg-slate-100 focus:ck-outline-none focus:ck-ring-2 focus:ck-ring-slate-300 disabled:ck-cursor-not-allowed disabled:ck-opacity-60',
    classNames?.faqOptionButton,
  );

  if (!isFaqMode || faqItems.length === 0) {
    return null;
  }

  return (
    <div
      {...containerProps}
      className={cn('ck-border-t ck-border-slate-200 ck-bg-white ck-px-4 ck-py-3', classNames?.faqOptions, className)}
    >
      {label && <p className="ck-mb-2 ck-text-xs ck-font-medium ck-text-slate-500">{resolvedLabel}</p>}
      <div className="ck-flex ck-gap-2 ck-overflow-x-auto ck-pb-1 ck-[scrollbar-color:theme(colors.slate.300)_transparent] ck-[scrollbar-width:thin] [&::-webkit-scrollbar]:ck-h-1.5 [&::-webkit-scrollbar-thumb]:ck-rounded-full [&::-webkit-scrollbar-thumb]:ck-bg-slate-300 [&::-webkit-scrollbar-track]:ck-bg-transparent">
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
  const { faqOptionsLabel, isFaqMode, showFaqOptions } = useChatBotContext('ChatBox.FaqOptions');

  if (!isFaqMode || !showFaqOptions) {
    return null;
  }

  return <ChatBotFaqOptions label={faqOptionsLabel} />;
}
