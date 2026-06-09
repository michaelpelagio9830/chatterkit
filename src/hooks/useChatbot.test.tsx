import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useChatbot } from './useChatbot';

describe('useChatbot', () => {
  it('submits a message and resolves FAQ mode responses', async () => {
    const { result } = renderHook(() =>
      useChatbot({
        mode: 'faq',
        faqItems: [{ question: 'What is your pricing?', answer: 'Pricing is flexible.' }],
      }),
    );

    await act(async () => {
      await result.current.submitMessage('What is your pricing?');
    });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0].role).toBe('user');
    expect(result.current.messages[1].content).toBe('Pricing is flexible.');
    expect(result.current.isLoading).toBe(false);
  });

  it('routes adapter mode messages to the configured provider', async () => {
    const provider = {
      sendMessage: vi.fn(async () => ({ content: 'Adapter response' })),
    };
    const { result } = renderHook(() => useChatbot({ mode: 'adapter', provider }));

    await act(async () => {
      await result.current.submitMessage('Hello adapter');
    });

    expect(provider.sendMessage).toHaveBeenCalledOnce();
    expect(result.current.messages[1].content).toBe('Adapter response');
  });

  it('captures provider errors and uses fallback responses when configured', async () => {
    const onError = vi.fn();
    const provider = {
      sendMessage: vi.fn(async () => {
        throw new Error('Provider failed');
      }),
    };
    const { result } = renderHook(() =>
      useChatbot({
        mode: 'adapter',
        provider,
        fallbackResponse: 'Fallback response',
        onError,
      }),
    );

    await act(async () => {
      await result.current.submitMessage('Hello adapter');
    });

    expect(onError).toHaveBeenCalledOnce();
    expect(result.current.error?.message).toBe('Provider failed');
    expect(result.current.messages[1].content).toBe('Fallback response');
  });
});