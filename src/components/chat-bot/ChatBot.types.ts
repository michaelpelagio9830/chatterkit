import type {
  ButtonHTMLAttributes,
  ComponentType,
  Dispatch,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SetStateAction,
} from 'react';
import type { ChatBotProps, ChatMessage, FaqItem, UseChatbotResult } from '../../types';

export type MessageRenderer = (message: ChatMessage) => ReactNode;

export type ChatBotNewMessageIndicatorState = {
  unreadCount: number;
  latestMessage: ChatMessage | null;
  isUserNearBottom: boolean;
  scrollToBottom: () => void;
};

export type NewMessageIndicatorRenderer = (state: ChatBotNewMessageIndicatorState) => ReactNode;

export type ChatBotFaqOptionButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
  [dataAttribute: `data-${string}`]: string | number | boolean | undefined;
};

export type ChatBotFaqOptionRenderState = {
  index: number;
  disabled: boolean;
  submit: () => void;
  getButtonProps: (props?: ChatBotFaqOptionButtonProps) => ChatBotFaqOptionButtonProps & { type: 'button' };
};

export type FaqOptionRenderer = (faqItem: FaqItem, state: ChatBotFaqOptionRenderState) => ReactNode;

export type ChatBotRootProps = ChatBotProps &
  Omit<HTMLAttributes<HTMLElement>, keyof ChatBotProps> & {
    chatbotState?: UseChatbotResult;
    draftState?: [string, Dispatch<SetStateAction<string>>];
  };
export type ChatBotHeaderProps = HTMLAttributes<HTMLElement>;
export type ChatBotTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type ChatBotMessagesProps = Omit<HTMLAttributes<HTMLUListElement | HTMLDivElement>, 'children'> & {
  children?: MessageRenderer;
  newMessageIndicator?: ReactNode | NewMessageIndicatorRenderer;
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

export type ChatBotCompoundComponent = ComponentType<ChatBotProps> & {
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
