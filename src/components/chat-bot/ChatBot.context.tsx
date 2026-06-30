import { createContext, useContext, type ReactNode } from 'react';
import type { ChatBotClassNames, FaqItem, UseChatbotResult } from '../../types';

export interface ChatBotContextValue extends UseChatbotResult {
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

export const ChatBotContext = createContext<ChatBotContextValue | null>(null);

export function useChatBotContext(componentName: string) {
  const context = useContext(ChatBotContext);

  if (!context) {
    throw new Error(
      `${componentName} must be used within ChatBot.Root or ChatBotWidget.ChatBot. ` +
        `When composing a widget panel, place ChatBot slots inside <ChatBotWidget.ChatBot>...</ChatBotWidget.ChatBot>, not directly inside ChatBotWidget.Panel.`,
    );
  }

  return context;
}
