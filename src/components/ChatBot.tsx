import {
  Fragment,
  createContext,
  useContext,
  useState,
  type ButtonHTMLAttributes,
  type ComponentType,
  type FormEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { useChatbot } from '../hooks/useChatbot';
import type { ChatBotClassNames, ChatBotProps, ChatMessage, FaqItem, UseChatbotResult } from '../types';
import { cn } from '../utils/cn';

type MessageRenderer = (message: ChatMessage) => ReactNode;
export type ChatBotFaqOptionButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  [dataAttribute: `data-${string}`]: string | number | boolean | undefined;
};
export type ChatBotFaqOptionRenderState = {
  index: number;
  disabled: boolean;
  submit: () => void;
  getButtonProps: (props?: ChatBotFaqOptionButtonProps) => ChatBotFaqOptionButtonProps & { type: 'button' };
};
type FaqOptionRenderer = (faqItem: FaqItem, state: ChatBotFaqOptionRenderState) => ReactNode;

export type ChatBotRootProps = ChatBotProps;
export type ChatBotHeaderProps = HTMLAttributes<HTMLElement>;
export type ChatBotTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type ChatBotMessagesProps = Omit<HTMLAttributes<HTMLUListElement | HTMLDivElement>, 'children'> & {
  children?: MessageRenderer;
};
export type ChatBotFaqOptionsProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children?: FaqOptionRenderer;
  label?: string;
};
export type ChatBotMessageItemProps = HTMLAttributes<HTMLLIElement> & {
  message: ChatMessage;
  bubbleClassName?: string;
};
export type ChatBotStateProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};
export type ChatBotComposerProps = HTMLAttributes<HTMLFormElement>;
export type ChatBotInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'disabled'>;
export type ChatBotSubmitButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

interface ChatBotContextValue extends UseChatbotResult {
  title: string;
  placeholder: string;
  disabled: boolean;
  emptyState?: ReactNode;
  loadingLabel: string;
  errorLabel: string;
  sendLabel: string;
  faqOptionsLabel: string;
  showFaqOptions: boolean;
  classNames?: ChatBotClassNames;
  faqItems?: FaqItem[];
  isFaqMode: boolean;
  draft: string;
  setDraft: (draft: string) => void;
  submitDraft: () => Promise<void>;
}

type ChatBotCompoundComponent = ComponentType<ChatBotProps> & {
  Root: ComponentType<ChatBotRootProps>;
  Header: ComponentType<ChatBotHeaderProps>;
  Title: ComponentType<ChatBotTitleProps>;
  Messages: ComponentType<ChatBotMessagesProps>;
  FaqOptions: ComponentType<ChatBotFaqOptionsProps>;
  MessageItem: ComponentType<ChatBotMessageItemProps>;
  Empty: ComponentType<ChatBotStateProps>;
  Loading: ComponentType<ChatBotStateProps>;
  Error: ComponentType<ChatBotStateProps>;
  Composer: ComponentType<ChatBotComposerProps>;
  Input: ComponentType<ChatBotInputProps>;
  SubmitButton: ComponentType<ChatBotSubmitButtonProps>;
};

const ChatBotContext = createContext<ChatBotContextValue | null>(null);

function useChatBotContext(componentName: string) {
  const context = useContext(ChatBotContext);

  if (!context) {
    throw new Error(
      `${componentName} must be used within ChatBot.Root or ChatBotWidget.ChatBot. ` +
        `When composing a widget panel, place ChatBot slots inside <ChatBotWidget.ChatBot>...</ChatBotWidget.ChatBot>, not directly inside ChatBotWidget.Panel.`,
    );
  }

  return context;
}

function ChatBotRoot(props: ChatBotRootProps) {
  const {
    title = 'Chatbot',
    placeholder = 'Type your message...',
    disabled = false,
    className,
    classNames,
    emptyState,
    loadingLabel = 'Thinking...',
    errorLabel = 'Something went wrong. Please try again.',
    sendLabel = 'Send',
    showFaqOptions = false,
    faqOptionsLabel = 'Choose a question:',
    children,
  } = props;
  const chatbot = useChatbot(props);
  const [draft, setDraft] = useState('');
  const isComposerDisabled = disabled || chatbot.isLoading;

  const submitDraft = async () => {
    const message = draft.trim();

    if (!message || isComposerDisabled) {
      return;
    }

    setDraft('');
    await chatbot.submitMessage(message);
  };

  return (
    <ChatBotContext.Provider
      value={{
        ...chatbot,
        title,
        placeholder,
        disabled: isComposerDisabled,
        emptyState,
        loadingLabel,
        errorLabel,
        sendLabel,
        faqOptionsLabel,
        showFaqOptions,
        classNames,
        faqItems: props.mode === 'faq' ? props.faqItems : undefined,
        isFaqMode: props.mode === 'faq',
        draft,
        setDraft,
        submitDraft,
      }}
    >
      <section
        aria-label={title}
        className={cn(
          'flex h-[32rem] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-lg',
          className,
          classNames?.root,
        )}
      >
        {children}
      </section>
    </ChatBotContext.Provider>
  );
}

function ChatBotHeader({ children, className, ...headerProps }: ChatBotHeaderProps) {
  const { classNames } = useChatBotContext('ChatBot.Header');

  return (
    <header {...headerProps} className={cn('border-b border-slate-200 bg-white px-4 py-3', classNames?.header, className)}>
      {children ?? <ChatBotTitle />}
    </header>
  );
}

function ChatBotTitle({ children, className, ...titleProps }: ChatBotTitleProps) {
  const { title, classNames } = useChatBotContext('ChatBot.Title');

  return (
    <h2 {...titleProps} className={cn('text-base font-semibold text-slate-900', classNames?.title, className)}>
      {children ?? title}
    </h2>
  );
}

function ChatBotMessages({ children, className, ...containerProps }: ChatBotMessagesProps) {
  const { messages, classNames } = useChatBotContext('ChatBot.Messages');

  if (messages.length === 0) {
    return <ChatBotEmpty className={className} {...(containerProps as HTMLAttributes<HTMLDivElement>)} />;
  }

  return (
    <ul {...(containerProps as HTMLAttributes<HTMLUListElement>)} className={cn('flex flex-1 flex-col gap-3 overflow-y-auto p-4', classNames?.messages, className)}>
      {messages.map((message) =>
        children ? <Fragment key={message.id}>{children(message)}</Fragment> : <ChatBotMessageItem key={message.id} message={message} />,
      )}
    </ul>
  );
}

function ChatBotFaqOptions({ children, className, label, ...containerProps }: ChatBotFaqOptionsProps) {
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
      {resolvedLabel && <p className="mb-2 text-xs font-medium text-slate-500">{resolvedLabel}</p>}
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

function ChatBotMessageItem({ message, children, className, bubbleClassName, ...itemProps }: ChatBotMessageItemProps) {
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
        {children ?? message.content}
      </div>
    </li>
  );
}

function ChatBotEmpty({ children, className, ...divProps }: ChatBotStateProps) {
  const { messages, emptyState, classNames } = useChatBotContext('ChatBot.Empty');

  if (messages.length > 0) {
    return null;
  }

  return (
    <div {...divProps} className={cn('flex flex-1 items-center justify-center p-6 text-sm text-slate-500', classNames?.empty, className)}>
      {children ?? emptyState ?? 'No messages yet. Start the conversation below.'}
    </div>
  );
}

function ChatBotLoading({ children, className, ...divProps }: ChatBotStateProps) {
  const { isLoading, loadingLabel, classNames } = useChatBotContext('ChatBot.Loading');

  if (!isLoading) {
    return null;
  }

  return (
    <div {...divProps} className={cn('px-4 pb-2 text-xs text-slate-500', classNames?.loading, className)} role="status">
      {children ?? loadingLabel}
    </div>
  );
}

function ChatBotError({ children, className, ...divProps }: ChatBotStateProps) {
  const { error, errorLabel, classNames } = useChatBotContext('ChatBot.Error');

  if (!error) {
    return null;
  }

  return (
    <div {...divProps} className={cn('px-4 pb-2 text-xs text-red-600', classNames?.error, className)} role="alert">
      {children ?? errorLabel}
    </div>
  );
}

function ChatBotComposer({ children, className, onSubmit, ...formProps }: ChatBotComposerProps) {
  const { submitDraft, classNames } = useChatBotContext('ChatBot.Composer');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit?.(event);
    await submitDraft();
  };

  return (
    <form {...formProps} className={cn('flex gap-2 border-t border-slate-200 bg-white p-3', classNames?.composer, className)} onSubmit={handleSubmit}>
      {children ?? (
        <>
          <ChatBotInput />
          <ChatBotSubmitButton />
        </>
      )}
    </form>
  );
}

function ChatBotInput({ className, id = 'chatbot-message-input', placeholder, ...inputProps }: ChatBotInputProps) {
  const { draft, setDraft, disabled, placeholder: defaultPlaceholder, classNames } = useChatBotContext('ChatBot.Input');

  return (
    <>
      <label className="sr-only" htmlFor={id}>
        Message
      </label>
      <input
        {...inputProps}
        id={id}
        className={cn(
          'min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100',
          classNames?.input,
          className,
        )}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder ?? defaultPlaceholder}
        disabled={disabled}
      />
    </>
  );
}

function ChatBotSubmitButton({ children, className, disabled, ...buttonProps }: ChatBotSubmitButtonProps) {
  const { draft, disabled: composerDisabled, sendLabel, classNames } = useChatBotContext('ChatBot.SubmitButton');
  const isDisabled = disabled ?? (composerDisabled || !draft.trim());

  return (
    <button
      {...buttonProps}
      className={cn(
        'rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400',
        classNames?.sendButton,
        className,
      )}
      type="submit"
      disabled={isDisabled}
    >
      {children ?? sendLabel}
    </button>
  );
}

function DefaultChatBotContent() {
  return (
    <>
      <ChatBotHeader />
      <ChatBotMessages />
      <ChatBotPresetFaqOptions />
      <ChatBotLoading />
      <ChatBotError />
      <ChatBotComposer />
    </>
  );
}

function ChatBotPresetFaqOptions() {
  const { isFaqMode, showFaqOptions } = useChatBotContext('ChatBot.FaqOptions');

  if (!isFaqMode || !showFaqOptions) {
    return null;
  }

  return <ChatBotFaqOptions />;
}

function ChatBotPreset(props: ChatBotProps) {
  return <ChatBotRoot {...props}>{props.children ?? <DefaultChatBotContent />}</ChatBotRoot>;
}

export const ChatBot = Object.assign(ChatBotPreset, {
  Root: ChatBotRoot,
  Header: ChatBotHeader,
  Title: ChatBotTitle,
  Messages: ChatBotMessages,
  FaqOptions: ChatBotFaqOptions,
  MessageItem: ChatBotMessageItem,
  Empty: ChatBotEmpty,
  Loading: ChatBotLoading,
  Error: ChatBotError,
  Composer: ChatBotComposer,
  Input: ChatBotInput,
  SubmitButton: ChatBotSubmitButton,
}) satisfies ChatBotCompoundComponent;
