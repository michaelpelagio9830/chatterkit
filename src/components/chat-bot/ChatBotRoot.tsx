import { useState } from 'react';
import { useChatbot } from '../../hooks/useChatbot';
import { cn } from '../../utils/cn';
import { ChatBotContext } from './ChatBot.context';
import type { ChatBotRootProps } from './ChatBot.types';

export function ChatBotRoot(props: ChatBotRootProps) {
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
    initialMessages: _initialMessages,
    metadata: _metadata,
    onMessagesChange: _onMessagesChange,
    onError: _onError,
    mode: _mode,
    faqItems: _faqItems,
    faqResolver: _faqResolver,
    provider: _provider,
    fallbackResponse: _fallbackResponse,
    children,
    ...sectionProps
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
        {...sectionProps}
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
