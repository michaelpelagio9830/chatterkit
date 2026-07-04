import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import type { ChatMessage } from '../types';
import { serializeChatMessages } from './useChatSession';
import { useLocalChatSession } from './useLocalChatSession';

function createStorageMock(): Storage {
  const entries = new Map<string, string>();

  return {
    get length() {
      return entries.size;
    },
    clear: () => entries.clear(),
    getItem: (key) => entries.get(key) ?? null,
    key: (index) => Array.from(entries.keys())[index] ?? null,
    removeItem: (key) => {
      entries.delete(key);
    },
    setItem: (key, value) => {
      entries.set(key, value);
    },
  };
}

const billingMessage: ChatMessage = {
  id: 'billing-1',
  role: 'user',
  content: 'How do I update billing?',
  createdAt: new Date('2026-07-04T12:00:00.000Z'),
};

const supportMessage: ChatMessage = {
  id: 'support-1',
  role: 'bot',
  content: 'Support is available 24/7.',
  createdAt: new Date('2026-07-04T12:01:00.000Z'),
};

describe('useLocalChatSession', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: createStorageMock(),
    });
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      value: createStorageMock(),
    });

    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('restores saved messages from localStorage by session id', () => {
    window.localStorage.setItem(
      'chatterkit:session:billing-chat',
      JSON.stringify(serializeChatMessages([billingMessage])),
    );

    const { result } = renderHook(() => useLocalChatSession('billing-chat'));

    expect(result.current.sessionId).toBe('billing-chat');
    expect(result.current.storageKey).toBe('chatterkit:session:billing-chat');
    expect(result.current.messages).toEqual([billingMessage]);
    expect(result.current.messages[0].createdAt).toBeInstanceOf(Date);
  });

  it('uses initial messages when no saved session exists', () => {
    const { result } = renderHook(() =>
      useLocalChatSession('new-chat', { initialMessages: [supportMessage] }),
    );

    expect(result.current.messages).toEqual([supportMessage]);
    expect(window.localStorage.getItem('chatterkit:session:new-chat')).toBeNull();
  });

  it('persists message updates using the generated session key', () => {
    const { result } = renderHook(() => useLocalChatSession('billing-chat'));

    act(() => {
      result.current.setMessages([billingMessage]);
    });

    expect(JSON.parse(window.localStorage.getItem('chatterkit:session:billing-chat') ?? '[]')).toEqual(
      serializeChatMessages([billingMessage]),
    );
  });

  it('keeps separate chat boxes isolated by session id', () => {
    const { result: billingSession } = renderHook(() => useLocalChatSession('billing-chat'));
    const { result: supportSession } = renderHook(() => useLocalChatSession('support-chat'));

    act(() => {
      billingSession.current.setMessages([billingMessage]);
      supportSession.current.setMessages([supportMessage]);
    });

    expect(JSON.parse(window.localStorage.getItem('chatterkit:session:billing-chat') ?? '[]')).toEqual(
      serializeChatMessages([billingMessage]),
    );
    expect(JSON.parse(window.localStorage.getItem('chatterkit:session:support-chat') ?? '[]')).toEqual(
      serializeChatMessages([supportMessage]),
    );
  });

  it('clears messages and removes the saved storage entry', () => {
    const { result } = renderHook(() => useLocalChatSession('billing-chat'));

    act(() => {
      result.current.setMessages([billingMessage]);
    });

    expect(window.localStorage.getItem('chatterkit:session:billing-chat')).not.toBeNull();

    act(() => {
      result.current.clearMessages();
    });

    expect(result.current.messages).toEqual([]);
    expect(window.localStorage.getItem('chatterkit:session:billing-chat')).toBeNull();
  });

  it('can use sessionStorage and custom storage keys', () => {
    const { result } = renderHook(() =>
      useLocalChatSession('billing-chat', {
        storage: 'sessionStorage',
        storageKey: 'custom-chat-key',
      }),
    );

    act(() => {
      result.current.setMessages([billingMessage]);
    });

    expect(window.localStorage.getItem('custom-chat-key')).toBeNull();
    expect(JSON.parse(window.sessionStorage.getItem('custom-chat-key') ?? '[]')).toEqual(
      serializeChatMessages([billingMessage]),
    );
  });
});