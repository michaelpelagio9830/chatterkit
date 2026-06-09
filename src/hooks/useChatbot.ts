import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';
import { createBotMessage, createUserMessage, toError } from '../message';
import { resolveAdapterResponse } from '../modes/adapter';
import { resolveFaqResponse } from '../modes/faq';
import type { ChatMessage, UseChatbotOptions, UseChatbotResult } from '../types';

export function useChatbot(options: UseChatbotOptions): UseChatbotResult {
  const [messages, setMessagesState] = useState<ChatMessage[]>(() => options.initialMessages ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const setMessages: Dispatch<SetStateAction<ChatMessage[]>> = useCallback(
    (value) => {
      setMessagesState((currentMessages) => {
        const nextMessages =
          typeof value === 'function'
            ? (value as (current: ChatMessage[]) => ChatMessage[])(currentMessages)
            : value;

        options.onMessagesChange?.(nextMessages);
        return nextMessages;
      });
    },
    [options.onMessagesChange],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, [setMessages]);

  const submitMessage = useCallback(
    async (rawContent: string) => {
      const content = rawContent.trim();

      if (!content || isLoading) {
        return;
      }

      const userMessage = createUserMessage(content);
      const nextMessages = [...messages, userMessage];
      const context = {
        mode: options.mode,
        messages: nextMessages,
        metadata: options.metadata,
      };

      setMessages(nextMessages);
      setIsLoading(true);
      setError(null);

      try {
        const response =
          options.mode === 'faq'
            ? await resolveFaqResponse(userMessage, context, {
                faqItems: options.faqItems,
                resolver: options.faqResolver,
                fallbackResponse: options.fallbackResponse,
              })
            : await resolveAdapterResponse(userMessage, context, options.provider);

        setMessages([...nextMessages, createBotMessage(response)]);
      } catch (caughtError) {
        const normalizedError = toError(caughtError);
        setError(normalizedError);
        options.onError?.(normalizedError);

        if (options.fallbackResponse) {
          setMessages([...nextMessages, createBotMessage(options.fallbackResponse)]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, options, setMessages],
  );

  return {
    messages,
    isLoading,
    error,
    submitMessage,
    clearMessages,
    setMessages,
  };
}