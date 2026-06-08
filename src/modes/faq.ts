import { normalizeBotResponse } from '../message';
import type { BotResponse, ChatContext, FaqItem, FaqResolver, FaqResolverResult, UserMessage } from '../types';

export const DEFAULT_FAQ_FALLBACK = "Sorry, I don't have an answer for that yet.";

export interface ResolveFaqOptions {
  faqItems: FaqItem[];
  resolver?: FaqResolver;
  fallbackResponse?: string | BotResponse;
}

export function normalizeFaqText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function findFaqMatch(question: string, faqItems: FaqItem[]) {
  const normalizedQuestion = normalizeFaqText(question);

  if (!normalizedQuestion) {
    return undefined;
  }

  return (
    faqItems.find((item) => normalizeFaqText(item.question) === normalizedQuestion) ??
    faqItems.find((item) =>
      item.keywords?.some((keyword) => normalizedQuestion.includes(normalizeFaqText(keyword))),
    ) ??
    faqItems.find((item) => {
      const normalizedItemQuestion = normalizeFaqText(item.question);
      return (
        normalizedItemQuestion.length > 2 &&
        (normalizedItemQuestion.includes(normalizedQuestion) ||
          normalizedQuestion.includes(normalizedItemQuestion))
      );
    })
  );
}

function faqItemToResponse(item: FaqItem): BotResponse {
  return {
    content: item.answer,
    metadata: {
      faqItemId: item.id,
      faqQuestion: item.question,
      ...item.metadata,
    },
  };
}

function resolverResultToResponse(result: FaqResolverResult, fallbackResponse?: string | BotResponse) {
  if (!result) {
    return normalizeBotResponse(fallbackResponse ?? DEFAULT_FAQ_FALLBACK);
  }

  if (typeof result === 'string' || 'content' in result) {
    return normalizeBotResponse(result);
  }

  return faqItemToResponse(result);
}

export async function resolveFaqResponse(
  input: UserMessage,
  context: ChatContext,
  options: ResolveFaqOptions,
): Promise<BotResponse> {
  if (options.resolver) {
    const resolverResult = await options.resolver(input, context, options.faqItems);
    return resolverResultToResponse(resolverResult, options.fallbackResponse);
  }

  const match = findFaqMatch(input.content, options.faqItems);

  if (!match) {
    return normalizeBotResponse(options.fallbackResponse ?? DEFAULT_FAQ_FALLBACK);
  }

  return faqItemToResponse(match);
}