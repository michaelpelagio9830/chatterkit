import { useState } from 'react';
import { useChatbot } from '../../hooks/useChatbot';
import { cn } from '../../utils/cn';
import { ChatBotContext } from './ChatBot.context';
import type { ChatBotRootProps } from './ChatBot.types';

function getUtilityName(classToken: string) {
  return classToken.trim().replace(/^!/, '').split(':').pop() ?? '';
}

function hasUtilityOverride(classNames: Array<string | undefined>, utilityPrefixes: string[]) {
  return classNames
    .flatMap((className) => className?.split(/\s+/) ?? [])
    .some((classToken) => {
      const utilityName = getUtilityName(classToken);

      return utilityPrefixes.some(
        (prefix) => utilityName === prefix || utilityName.startsWith(`${prefix}-`),
      );
    });
}

export function ChatBotRoot(props: ChatBotRootProps) {
  const {
    title = 'Chat',
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
    chatbotState,
    draftState,
    children,
    ...sectionProps
  } = props;
  const internalChatbot = useChatbot(props);
  const chatbot = chatbotState ?? internalChatbot;
  const [internalDraft, setInternalDraft] = useState('');
  const [draft, setDraft] = draftState ?? [internalDraft, setInternalDraft];
  const isComposerDisabled = disabled || chatbot.isLoading;

  const submitDraft = async () => {
    const message = draft.trim();

    if (!message || isComposerDisabled) {
      return;
    }

    setDraft('');
    await chatbot.submitMessage(message);
  };

  const rootClassOverrideSources = [className, classNames?.root];
  const hasBackgroundOverride = hasUtilityOverride(rootClassOverrideSources, ['bg', 'ck-bg']);
  const hasBorderOverride = hasUtilityOverride(rootClassOverrideSources, ['border', 'ck-border']);
  const hasFontOverride = hasUtilityOverride(rootClassOverrideSources, ['font', 'ck-font']);
  const hasRoundedOverride = hasUtilityOverride(rootClassOverrideSources, ['rounded', 'ck-rounded']);
  const hasShadowOverride = hasUtilityOverride(rootClassOverrideSources, ['shadow', 'ck-shadow']);

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
          'chatterkit-root ck-flex ck-h-[32rem] ck-w-full ck-max-w-md ck-flex-col ck-overflow-hidden',
          !hasRoundedOverride && 'ck-rounded-2xl',
          !hasBorderOverride && 'ck-border ck-border-slate-200',
          !hasBackgroundOverride && 'ck-bg-slate-50',
          !hasFontOverride && 'ck-font-sans',
          !hasShadowOverride && 'ck-shadow-lg',
          className,
          classNames?.root,
        )}
      >
        {children}
      </section>
    </ChatBotContext.Provider>
  );
}
