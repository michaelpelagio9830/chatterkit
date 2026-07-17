import type { ButtonHTMLAttributes, Dispatch, HTMLAttributes, ReactNode, SetStateAction } from 'react';

/** Supported chatbot behavior modes. */
export type ChatbotMode = 'faq' | 'adapter';

/** Role used to determine how a chat message is rendered and handled. */
export type MessageRole = 'user' | 'bot' | 'system';

/** Free-form metadata that can be attached to messages, FAQ items, or chat context. */
export type Metadata = Record<string, unknown>;

export type MaybePromise<T> = T | Promise<T>;

/** A single message rendered in the chatbot conversation. */
export interface ChatMessage {
  /** Stable unique identifier for the message. */
  id: string;
  /** Identifies whether the message came from the user, bot, or system. */
  role: MessageRole;
  /** Text content displayed in the chat bubble. */
  content: string;
  /** Timestamp used by consumers that need ordering or display metadata. */
  createdAt: Date;
  /** Optional custom data associated with the message. */
  metadata?: Metadata;
}

export interface UserMessage extends ChatMessage {
  role: 'user';
}

export interface BotMessage extends ChatMessage {
  role: 'bot';
}

export interface BotResponse {
  /** Text content returned by the bot/provider and displayed to the user. */
  content: string;
  /** Optional response id. If omitted, the chatbot generates one. */
  id?: string;
  /** Optional creation timestamp. If omitted, the chatbot uses the current date. */
  createdAt?: Date;
  /** Optional custom data to attach to the bot message. */
  metadata?: Metadata;
}

/** Context passed to FAQ resolvers and adapter providers for each submitted user message. */
export interface ChatContext {
  /** Current chatbot mode. */
  mode: ChatbotMode;
  /** Messages already present in the conversation before the current response is added. */
  messages: ChatMessage[];
  /** Optional custom context supplied through ChatBot props. */
  metadata?: Metadata;
}

/** Adapter interface for custom backend, LLM, or API-powered chat behavior. */
export interface ChatProvider {
  /**
   * Sends the user message to an external provider and returns the bot response.
   * Use this for adapter mode integrations such as an API route, OpenAPI client, or LLM backend.
   */
  sendMessage(input: UserMessage, context: ChatContext): Promise<BotResponse>;
}

/** A predefined FAQ entry used by FAQ mode matching and optional quick-pick buttons. */
export interface FaqItem {
  /** Optional stable id used as the React key for FAQ option buttons. */
  id?: string;
  /** User-facing question text. Also submitted when the FAQ option button is clicked. */
  question: string;
  /** Bot response shown when this FAQ item matches the user's message. */
  answer: string;
  /** Optional extra terms that help the default FAQ matcher find this item. */
  keywords?: string[];
  /** Optional custom data associated with the FAQ item. */
  metadata?: Metadata;
}

/** Return shape supported by a custom FAQ resolver. */
export type FaqResolverResult = BotResponse | FaqItem | string | null | undefined;

/** Custom matcher for FAQ mode. Return a bot response, FAQ item, string, or nullish value for fallback. */
export type FaqResolver = (
  input: UserMessage,
  context: ChatContext,
  faqItems: FaqItem[],
) => MaybePromise<FaqResolverResult>;

/** Tailwind/className overrides for the built-in ChatBox UI slots. */
export interface ChatBoxClassNames {
  /** Class for the root chat container. */
  root?: string;
  /** Class for the header wrapper. */
  header?: string;
  /** Class for the title element. */
  title?: string;
  /** Class for the message list container. */
  messages?: string;
  /** Class for the default new-message indicator button. */
  newMessageIndicator?: string;
  /** Class for the FAQ option section wrapper. */
  faqOptions?: string;
  /** Class for each FAQ option button. */
  faqOptionButton?: string;
  /** Class applied to every message row. */
  message?: string;
  /** Class applied to user message bubbles. */
  userMessage?: string;
  /** Class applied to bot message bubbles. */
  botMessage?: string;
  /** Class for the composer form. */
  composer?: string;
  /** Class for the text input. */
  input?: string;
  /** Class for the submit/send button. */
  sendButton?: string;
  /** Class for the loading/status text. */
  loading?: string;
  /** Class for the error text. */
  error?: string;
  /** Class for the empty conversation state. */
  empty?: string;
}

/** Backwards-compatible alias for the previous ChatBot naming. */
export type ChatBotClassNames = ChatBoxClassNames;

/** Tailwind/className overrides for ChatBoxWidget/ChatBotWidget preset slots. */
export interface ChatBotWidgetClassNames {
  /** Class for the fixed widget root overlay. */
  root?: string;
  /** Class for the floating launcher button. */
  launcher?: string;
  /** Class for the floating panel wrapper. */
  panel?: string;
  /** Class for the panel close/minimize button. */
  closeButton?: string;
  /** Class passed to the embedded ChatBox instance. */
  chatBot?: string;
}

/** Preferred ChatBox-aligned alias for widget slot class overrides. */
export type ChatBoxWidgetClassNames = ChatBotWidgetClassNames;

/** Shared props accepted by ChatBox and the ChatBotWidget's embedded chatbox. */
export interface ChatBoxBaseProps {
  /** Messages rendered when the chatbot first mounts. Useful for greetings or restored history. */
  initialMessages?: ChatMessage[];
  /** Custom metadata passed to FAQ resolvers and adapter providers on every request. */
  metadata?: Metadata;
  /** Accessible region label and default header title. Defaults to `Chat`. */
  title?: string;
  /** Placeholder text shown in the message input. */
  placeholder?: string;
  /** Disables message input, submit button, and FAQ option buttons. */
  disabled?: boolean;
  /** Class for the root ChatBox container. */
  className?: string;
  /** Fine-grained class overrides for built-in ChatBox slots. */
  classNames?: ChatBoxClassNames;
  /** Custom empty state shown before any messages exist. */
  emptyState?: ReactNode;
  /** Text displayed while a response is being generated. */
  loadingLabel?: string;
  /** Text displayed when message submission fails. */
  errorLabel?: string;
  /** Default submit button label. */
  sendLabel?: string;
  /** Shows clickable FAQ question badges in FAQ mode when using the preset layout. */
  showFaqOptions?: boolean;
  /** Label displayed above FAQ option badges. */
  faqOptionsLabel?: string;
  /** Called whenever the internal messages array changes. */
  onMessagesChange?: (messages: ChatMessage[]) => void;
  /** Called when message submission throws or the provider/resolver fails. */
  onError?: (error: Error) => void;
}

/** Backwards-compatible alias for the previous ChatBot naming. */
export type ChatBotBaseProps = ChatBoxBaseProps;

/** Props required when ChatBox runs in local FAQ matching mode. */
export interface FaqModeOptions {
  /** Enables FAQ mode, which matches user input against predefined FAQ items. */
  mode: 'faq';
  /** List of FAQ entries used by the default matcher and FAQ option buttons. */
  faqItems: FaqItem[];
  /** Optional custom resolver that controls how user messages map to FAQ responses. */
  faqResolver?: FaqResolver;
  /** Response shown when no FAQ item matches or the resolver returns nullish. */
  fallbackResponse?: string | BotResponse;
  /** Not available in FAQ mode. Use `mode="adapter"` to provide a chat provider. */
  provider?: never;
}

/** Props required when ChatBox delegates responses to an external adapter provider. */
export interface AdapterModeOptions {
  /** Enables adapter mode, which sends messages to the supplied provider. */
  mode: 'adapter';
  /** Provider responsible for returning bot responses from an API, backend, or LLM adapter. */
  provider: ChatProvider;
  /** Response shown when the adapter fails and no custom error handling overrides it. */
  fallbackResponse?: string | BotResponse;
  /** Not available in adapter mode. Use `mode="faq"` to provide FAQ items. */
  faqItems?: never;
  /** Not available in adapter mode. Use `mode="faq"` for FAQ resolvers. */
  faqResolver?: never;
}

/** Props for the `ChatBox` preset component and `ChatBox.Root` compound component. */
export type ChatBoxProps = ChatBoxBaseProps & {
  /** Optional compound slot content. If omitted, the default chatbox layout is rendered. */
  children?: ReactNode;
} & (FaqModeOptions | AdapterModeOptions);

/** Backwards-compatible alias for the previous ChatBot naming. */
export type ChatBotProps = ChatBoxProps;

/** Props for configuring the floating ChatBoxWidget/ChatBotWidget container and embedded chatbox. */
export interface ChatBotWidgetBaseProps extends Omit<ChatBoxBaseProps, 'className'> {
  /** Opens the widget panel on initial render. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Allows dragging the launcher and positions the open panel near the dragged location. */
  draggable?: boolean;
  /** Accessible label for the launcher button. */
  launcherLabel?: string;
  /** Accessible label for the close/minimize button. */
  closeLabel?: string;
  /** Icon/content rendered inside the default launcher button. */
  launcherIcon?: ReactNode;
  /** Class for the fixed widget root overlay. */
  className?: string;
  /** Fine-grained class overrides for widget slots. */
  widgetClassNames?: ChatBotWidgetClassNames;
}

export type ChatBotWidgetProps = ChatBotWidgetBaseProps & (FaqModeOptions | AdapterModeOptions);

/** Preferred ChatBox-aligned alias for floating widget props. */
export type ChatBoxWidgetProps = ChatBotWidgetProps;

export type ChatBotWidgetRootProps = ChatBotWidgetProps & {
  children: ReactNode;
};

export type ChatBoxWidgetRootProps = ChatBotWidgetRootProps;

export type ChatBotWidgetLauncherProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

export type ChatBoxWidgetLauncherProps = ChatBotWidgetLauncherProps;

export type ChatBotWidgetPanelProps = HTMLAttributes<HTMLDivElement>;

export type ChatBoxWidgetPanelProps = ChatBotWidgetPanelProps;

export type ChatBotWidgetCloseButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

export type ChatBoxWidgetCloseButtonProps = ChatBotWidgetCloseButtonProps;

export type ChatBotWidgetChatBotProps = Pick<ChatBoxBaseProps, 'className' | 'classNames'> &
  Omit<HTMLAttributes<HTMLElement>, keyof ChatBoxBaseProps> & {
    children?: ReactNode;
  };

export type ChatBoxWidgetChatBoxProps = ChatBotWidgetChatBotProps;

export type UseChatbotOptions = Pick<
  ChatBoxBaseProps,
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