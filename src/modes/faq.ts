import { normalizeBotResponse } from '../message';
import type { BotResponse, ChatContext, FaqItem, FaqResolver, FaqResolverResult, UserMessage } from '../types';

export const DEFAULT_FAQ_FALLBACK = "Sorry, I don't have an answer for that yet.";

const FAQ_MATCH_SCORES = {
  exactQuestion: 100,
  keywordPhrase: 70,
  keywordToken: 55,
  keywordFuzzyToken: 35,
  questionTokenOverlapMax: 40,
  questionFuzzyToken: 15,
} as const;

const MIN_FAQ_MATCH_SCORE = 35;
const MIN_FUZZY_TOKEN_LENGTH = 5;

export interface ResolveFaqOptions {
  faqItems: FaqItem[];
  resolver?: FaqResolver;
  fallbackResponse?: string | BotResponse;
}

interface NormalizedFaqInput {
  text: string;
  tokens: string[];
  tokenSet: Set<string>;
}

interface NormalizedFaqKeyword {
  text: string;
  tokens: string[];
}

interface NormalizedFaqCandidate {
  item: FaqItem;
  questionText: string;
  questionTokens: string[];
  keywords: NormalizedFaqKeyword[];
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

function tokenizeFaqText(value: string) {
  return normalizeFaqText(value).split(' ').filter(Boolean);
}

function createNormalizedFaqInput(question: string): NormalizedFaqInput {
  const text = normalizeFaqText(question);
  const tokens = tokenizeFaqText(text);

  return {
    text,
    tokens,
    tokenSet: new Set(tokens),
  };
}

function createFaqCandidate(item: FaqItem): NormalizedFaqCandidate {
  return {
    item,
    questionText: normalizeFaqText(item.question),
    questionTokens: tokenizeFaqText(item.question),
    keywords: item.keywords?.map((keyword) => ({
      text: normalizeFaqText(keyword),
      tokens: tokenizeFaqText(keyword),
    })) ?? [],
  };
}

export function findFaqMatch(question: string, faqItems: FaqItem[]) {
  const input = createNormalizedFaqInput(question);

  if (!input.text) {
    return undefined;
  }

  let bestMatch: { item: FaqItem; score: number } | undefined;

  for (const item of faqItems) {
    const candidate = createFaqCandidate(item);
    const score = scoreFaqCandidate(input, candidate);

    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { item, score };
    }
  }

  return bestMatch && bestMatch.score >= MIN_FAQ_MATCH_SCORE ? bestMatch.item : undefined;
}

function scoreFaqCandidate(input: NormalizedFaqInput, candidate: NormalizedFaqCandidate) {
  if (input.text === candidate.questionText) {
    return FAQ_MATCH_SCORES.exactQuestion;
  }

  return (
    scoreKeywordMatches(input, candidate) +
    scoreQuestionTokenOverlap(input, candidate) +
    scoreQuestionFuzzyTokenMatches(input, candidate)
  );
}

function scoreKeywordMatches(input: NormalizedFaqInput, candidate: NormalizedFaqCandidate) {
  return candidate.keywords.reduce((score, keyword) => {
    if (!keyword.text) {
      return score;
    }

    if (keyword.tokens.length > 1 && input.text.includes(keyword.text)) {
      return score + FAQ_MATCH_SCORES.keywordPhrase;
    }

    if (keyword.tokens.some((token) => input.tokenSet.has(token))) {
      return score + FAQ_MATCH_SCORES.keywordToken;
    }

    if (hasFuzzyTokenMatch(input.tokens, keyword.tokens)) {
      return score + FAQ_MATCH_SCORES.keywordFuzzyToken;
    }

    return score;
  }, 0);
}

function scoreQuestionTokenOverlap(input: NormalizedFaqInput, candidate: NormalizedFaqCandidate) {
  if (candidate.questionTokens.length === 0) {
    return 0;
  }

  const matchedTokens = candidate.questionTokens.filter((token) => input.tokenSet.has(token));
  const overlapRatio = matchedTokens.length / candidate.questionTokens.length;

  return Math.round(overlapRatio * FAQ_MATCH_SCORES.questionTokenOverlapMax);
}

function scoreQuestionFuzzyTokenMatches(input: NormalizedFaqInput, candidate: NormalizedFaqCandidate) {
  return hasFuzzyTokenMatch(input.tokens, candidate.questionTokens)
    ? FAQ_MATCH_SCORES.questionFuzzyToken
    : 0;
}

function hasFuzzyTokenMatch(inputTokens: string[], candidateTokens: string[]) {
  return candidateTokens.some((candidateToken) =>
    inputTokens.some((inputToken) => isFuzzyTokenMatch(inputToken, candidateToken)),
  );
}

function isFuzzyTokenMatch(inputToken: string, candidateToken: string) {
  const maxDistance = getMaxLevenshteinDistance(candidateToken);

  if (maxDistance === 0 || Math.abs(inputToken.length - candidateToken.length) > maxDistance) {
    return false;
  }

  return getLevenshteinDistance(inputToken, candidateToken) <= maxDistance;
}

function getMaxLevenshteinDistance(token: string) {
  if (token.length < MIN_FUZZY_TOKEN_LENGTH) {
    return 0;
  }

  return token.length <= 7 ? 1 : 2;
}

function getLevenshteinDistance(left: string, right: string) {
  const distances = Array.from({ length: left.length + 1 }, (_, index) => index);

  for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
    let previousDiagonal = distances[0];
    distances[0] = rightIndex;

    for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
      const previousDistance = distances[leftIndex];
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;

      distances[leftIndex] = Math.min(
        distances[leftIndex] + 1,
        distances[leftIndex - 1] + 1,
        previousDiagonal + substitutionCost,
      );
      previousDiagonal = previousDistance;
    }
  }

  return distances[left.length];
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