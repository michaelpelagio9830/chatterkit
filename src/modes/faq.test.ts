import { describe, expect, it } from 'vitest';
import { createUserMessage } from '../message';
import type { ChatContext, FaqItem } from '../types';
import { findFaqMatch, resolveFaqResponse } from './faq';

const faqItems: FaqItem[] = [
  {
    id: 'pricing',
    question: 'How much does it cost?',
    answer: 'Pricing depends on your plan.',
    keywords: ['price', 'cost'],
  },
];

const createContext = (message = createUserMessage('How much does it cost?')): ChatContext => ({
  mode: 'faq',
  messages: [message],
});

describe('faq mode', () => {
  it('matches exact normalized questions', () => {
    expect(findFaqMatch('how much does it cost', faqItems)?.id).toBe('pricing');
  });

  it('resolves a matched FAQ answer', async () => {
    const input = createUserMessage('What is the price?');
    const response = await resolveFaqResponse(input, createContext(input), { faqItems });

    expect(response.content).toBe('Pricing depends on your plan.');
    expect(response.metadata?.faqItemId).toBe('pricing');
  });

  it('uses fallback response when there is no match', async () => {
    const input = createUserMessage('Where are you located?');
    const response = await resolveFaqResponse(input, createContext(input), {
      faqItems,
      fallbackResponse: 'Please contact support.',
    });

    expect(response.content).toBe('Please contact support.');
  });

  it('uses a custom resolver when provided', async () => {
    const input = createUserMessage('Custom question');
    const response = await resolveFaqResponse(input, createContext(input), {
      faqItems,
      resolver: () => 'Custom answer',
    });

    expect(response.content).toBe('Custom answer');
  });
});