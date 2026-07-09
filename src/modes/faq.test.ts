import { describe, expect, it } from 'vitest';
import { createUserMessage } from '../message';
import type { ChatContext, FaqItem } from '../types';
import { findFaqMatch, resolveFaqResponse } from './faq';

const faqItems: FaqItem[] = [
  {
    id: 'pricing',
    question: 'How much does it cost?',
    answer: 'Pricing depends on your plan.',
    keywords: ['pricing', 'price', 'cost'],
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

  it('matches keyword tokens without requiring an exact question match', () => {
    expect(findFaqMatch('Can you explain your pricing?', faqItems)?.id).toBe('pricing');
  });

  it('matches keyword typos with bounded Levenshtein distance', () => {
    expect(findFaqMatch('Can you explain your prcing?', faqItems)?.id).toBe('pricing');
  });

  it('matches normalized punctuation and accented text', () => {
    const accentedFaqItems: FaqItem[] = [
      {
        id: 'cafe',
        question: 'Do you support café orders?',
        answer: 'Yes, café orders are supported.',
      },
    ];

    expect(findFaqMatch('Do you support cafe orders???', accentedFaqItems)?.id).toBe('cafe');
  });

  it('does not match short keywords through substring or fuzzy matching', () => {
    const shortKeywordFaqItems: FaqItem[] = [
      {
        id: 'app',
        question: 'Do you have an app?',
        answer: 'Yes, we have an app.',
        keywords: ['app'],
      },
      {
        id: 'ai',
        question: 'Do you support AI?',
        answer: 'Yes, AI is supported.',
        keywords: ['ai'],
      },
    ];

    expect(findFaqMatch('happy customer', shortKeywordFaqItems)).toBeUndefined();
    expect(findFaqMatch('paid plan', shortKeywordFaqItems)).toBeUndefined();
  });

  it('selects the best-scoring FAQ instead of the first weak match', () => {
    const rankedFaqItems: FaqItem[] = [
      {
        id: 'plans',
        question: 'What plans do you offer?',
        answer: 'We offer several plans.',
        keywords: ['plans'],
      },
      {
        id: 'refund',
        question: 'What is your refund policy?',
        answer: 'Refunds are available within 30 days.',
        keywords: ['refund policy'],
      },
    ];

    expect(findFaqMatch('Can you explain your refund policy?', rankedFaqItems)?.id).toBe('refund');
  });

  it('uses fallback for empty or low-confidence questions', async () => {
    const input = createUserMessage('hello');
    const response = await resolveFaqResponse(input, createContext(input), {
      faqItems,
      fallbackResponse: 'Please contact support.',
    });

    expect(findFaqMatch('   ', faqItems)).toBeUndefined();
    expect(response.content).toBe('Please contact support.');
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

  it('uses fallback when a custom resolver returns no result', async () => {
    const input = createUserMessage('Custom question');
    const response = await resolveFaqResponse(input, createContext(input), {
      faqItems,
      resolver: () => undefined,
      fallbackResponse: 'Please contact support.',
    });

    expect(response.content).toBe('Please contact support.');
  });
});