import { useCallback, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import type { ChatMessage } from '../types';

export interface SerializedChatMessage extends Omit<ChatMessage, 'createdAt'> {
  createdAt: string;
}

export interface UseChatSessionOptions {
  /** Stable id for the conversation/session owned by the consuming app. */
  sessionId?: string;
  /** Messages used when the session has no restored state. */
  initialMessages?: ChatMessage[];
}

export interface UseChatSessionResult {
  /** Stable id for this conversation/session, when supplied by the app. */
  sessionId?: string;
  /** Current externally-owned message history. */
  messages: ChatMessage[];
  /** Sets message history. Pass this to ChatBot's `onMessagesChange`. */
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  /** Clears the externally-owned message history. */
  clearMessages: () => void;
  /** Restores the hook back to its configured initial messages. */
  resetMessages: () => void;
}

export function serializeChatMessages(messages: ChatMessage[]): SerializedChatMessage[] {
  return messages.map((message) => ({
    ...message,
    createdAt: message.createdAt.toISOString(),
  }));
}

export function deserializeChatMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((message): ChatMessage[] => {
    if (!isSerializedChatMessageLike(message)) {
      return [];
    }

    return [
      {
        ...message,
        createdAt: new Date(message.createdAt),
      },
    ];
  });
}

export function useChatSession(options: UseChatSessionOptions = {}): UseChatSessionResult {
  const initialMessages = useMemo(() => options.initialMessages ?? [], [options.initialMessages]);
  const [messages, setMessages] = useState<ChatMessage[]>(() => initialMessages);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const resetMessages = useCallback(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  return {
    sessionId: options.sessionId,
    messages,
    setMessages,
    clearMessages,
    resetMessages,
  };
}

function isSerializedChatMessageLike(value: unknown): value is SerializedChatMessage {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const message = value as Partial<SerializedChatMessage>;
  const createdAt = typeof message.createdAt === 'string' ? new Date(message.createdAt) : null;

  return (
    typeof message.id === 'string' &&
    (message.role === 'user' || message.role === 'bot' || message.role === 'system') &&
    typeof message.content === 'string' &&
    !!createdAt &&
    !Number.isNaN(createdAt.getTime())
  );
}