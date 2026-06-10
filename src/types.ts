import type { ButtonHTMLAttributes, Dispatch, HTMLAttributes, ReactNode, SetStateAction } from 'react';

export type ChatbotMode = 'faq' | 'adapter';

export type MessageRole = 'user' | 'bot' | 'system';

export type Metadata = Record<string, unknown>;

export type MaybePromise<T> = T | Promise<T>;

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
  metadata?: Metadata;
}

export interface UserMessage extends ChatMessage {
  role: 'user';
}

export interface BotMessage extends ChatMessage {
  role: 'bot';
}

export interface BotResponse {
  content: string;
  id?: string;
  createdAt?: Date;
  metadata?: Metadata;
}

export interface ChatContext {
  mode: ChatbotMode;
  messages: ChatMessage[];
  metadata?: Metadata;
}

export interface ChatProvider {
  sendMessage(input: UserMessage, context: ChatContext): Promise<BotResponse>;
}

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  keywords?: string[];
  metadata?: Metadata;
}

export type FaqResolverResult = BotResponse | FaqItem | string | null | undefined;

export type FaqResolver = (
  input: UserMessage,
  context: ChatContext,
  faqItems: FaqItem[],
) => MaybePromise<FaqResolverResult>;

export interface ChatBotClassNames {
  root?: string;
  header?: string;
  title?: string;
  messages?: string;
  faqOptions?: string;
  faqOptionButton?: string;
  message?: string;
  userMessage?: string;
  botMessage?: string;
  composer?: string;
  input?: string;
  sendButton?: string;
  loading?: string;
  error?: string;
  empty?: string;
}

export interface ChatBotWidgetClassNames {
  root?: string;
  launcher?: string;
  panel?: string;
  closeButton?: string;
  chatBot?: string;
}

export interface ChatBotBaseProps {
  initialMessages?: ChatMessage[];
  metadata?: Metadata;
  title?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  classNames?: ChatBotClassNames;
  emptyState?: ReactNode;
  loadingLabel?: string;
  errorLabel?: string;
  sendLabel?: string;
  showFaqOptions?: boolean;
  faqOptionsLabel?: string;
  onMessagesChange?: (messages: ChatMessage[]) => void;
  onError?: (error: Error) => void;
}

export interface FaqModeOptions {
  mode: 'faq';
  faqItems: FaqItem[];
  faqResolver?: FaqResolver;
  fallbackResponse?: string | BotResponse;
  provider?: never;
}

export interface AdapterModeOptions {
  mode: 'adapter';
  provider: ChatProvider;
  fallbackResponse?: string | BotResponse;
  faqItems?: never;
  faqResolver?: never;
}

export type ChatBotProps = ChatBotBaseProps & {
  children?: ReactNode;
} & (FaqModeOptions | AdapterModeOptions);

export interface ChatBotWidgetBaseProps extends Omit<ChatBotBaseProps, 'className'> {
  defaultOpen?: boolean;
  draggable?: boolean;
  launcherLabel?: string;
  closeLabel?: string;
  launcherIcon?: ReactNode;
  className?: string;
  widgetClassNames?: ChatBotWidgetClassNames;
}

export type ChatBotWidgetProps = ChatBotWidgetBaseProps & (FaqModeOptions | AdapterModeOptions);

export type ChatBotWidgetRootProps = ChatBotWidgetProps & {
  children: ReactNode;
};

export type ChatBotWidgetLauncherProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

export type ChatBotWidgetPanelProps = HTMLAttributes<HTMLDivElement>;

export type ChatBotWidgetCloseButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

export type ChatBotWidgetChatBotProps = Pick<ChatBotBaseProps, 'className' | 'classNames'> & {
  children?: ReactNode;
};

export type UseChatbotOptions = Pick<
  ChatBotBaseProps,
  'initialMessages' | 'metadata' | 'onMessagesChange' | 'onError'
> &
  (FaqModeOptions | AdapterModeOptions);

export interface UseChatbotResult {
  messages: ChatMessage[];
  isLoading: boolean;
  error: Error | null;
  submitMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}