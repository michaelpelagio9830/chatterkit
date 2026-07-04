import { useCallback, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import type { ChatMessage } from '../types';
import { deserializeChatMessages, serializeChatMessages } from './useChatSession';

export type ChatSessionStorageType = 'localStorage' | 'sessionStorage';

export interface UseLocalChatSessionOptions {
  /** Browser storage area used for persistence. Defaults to localStorage. */
  storage?: ChatSessionStorageType;
  /** Messages used when storage has no saved history. */
  initialMessages?: ChatMessage[];
  /** Overrides the generated `chatterkit:session:${sessionId}` storage key. */
  storageKey?: string;
}

export interface UseLocalChatSessionResult {
  /** Stable id for this local browser session. */
  sessionId: string;
  /** Actual browser storage key used by the hook. */
  storageKey: string;
  /** Current externally-owned message history. */
  messages: ChatMessage[];
  /** Sets message history and persists it. Pass this to ChatBot's `onMessagesChange`. */
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  /** Clears message history and removes the saved browser storage entry. */
  clearMessages: () => void;
  /** Restores configured initial messages and persists that reset value. */
  resetMessages: () => void;
}

export function useLocalChatSession(
  sessionId: string,
  options: UseLocalChatSessionOptions = {},
): UseLocalChatSessionResult {
  const storageKey = options.storageKey ?? `chatterkit:session:${sessionId}`;
  const initialMessages = useMemo(() => options.initialMessages ?? [], [options.initialMessages]);
  const storageType = options.storage ?? 'localStorage';
  const [messages, setMessagesState] = useState<ChatMessage[]>(() => {
    const restoredMessages = readMessagesFromStorage(storageType, storageKey);

    return restoredMessages ?? initialMessages;
  });

  const persistMessages = useCallback(
    (nextMessages: ChatMessage[]) => {
      writeMessagesToStorage(storageType, storageKey, nextMessages);
    },
    [storageKey, storageType],
  );

  const setMessages: Dispatch<SetStateAction<ChatMessage[]>> = useCallback(
    (value) => {
      setMessagesState((currentMessages) => {
        const nextMessages =
          typeof value === 'function'
            ? (value as (current: ChatMessage[]) => ChatMessage[])(currentMessages)
            : value;

        persistMessages(nextMessages);
        return nextMessages;
      });
    },
    [persistMessages],
  );

  const clearMessages = useCallback(() => {
    removeMessagesFromStorage(storageType, storageKey);
    setMessagesState([]);
  }, [storageKey, storageType]);

  const resetMessages = useCallback(() => {
    persistMessages(initialMessages);
    setMessagesState(initialMessages);
  }, [initialMessages, persistMessages]);

  return {
    sessionId,
    storageKey,
    messages,
    setMessages,
    clearMessages,
    resetMessages,
  };
}

function getStorage(storageType: ChatSessionStorageType): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window[storageType] ?? null;
  } catch {
    return null;
  }
}

function readMessagesFromStorage(storageType: ChatSessionStorageType, storageKey: string): ChatMessage[] | null {
  const storage = getStorage(storageType);

  if (!storage) {
    return null;
  }

  try {
    const rawValue = storage.getItem(storageKey);

    if (!rawValue) {
      return null;
    }

    return deserializeChatMessages(JSON.parse(rawValue));
  } catch {
    return null;
  }
}

function writeMessagesToStorage(storageType: ChatSessionStorageType, storageKey: string, messages: ChatMessage[]) {
  const storage = getStorage(storageType);

  if (!storage) {
    return;
  }

  try {
    storage.setItem(storageKey, JSON.stringify(serializeChatMessages(messages)));
  } catch {
    // Storage can fail in private mode, quota errors, or locked-down environments.
  }
}

function removeMessagesFromStorage(storageType: ChatSessionStorageType, storageKey: string) {
  const storage = getStorage(storageType);

  if (!storage) {
    return;
  }

  try {
    storage.removeItem(storageKey);
  } catch {
    // Ignore storage failures and keep the in-memory session usable.
  }
}