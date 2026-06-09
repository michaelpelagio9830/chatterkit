import type { BotMessage, BotResponse, ChatMessage, MessageRole, Metadata, UserMessage } from './types';

const createId = () => {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

interface MessageOverrides {
  id?: string;
  createdAt?: Date;
  metadata?: Metadata;
}

export function createChatMessage(
  role: MessageRole,
  content: string,
  overrides: MessageOverrides = {},
): ChatMessage {
  return {
    id: overrides.id ?? createId(),
    role,
    content,
    createdAt: overrides.createdAt ?? new Date(),
    metadata: overrides.metadata,
  };
}

export function createUserMessage(content: string, overrides: MessageOverrides = {}): UserMessage {
  return createChatMessage('user', content, overrides) as UserMessage;
}

export function normalizeBotResponse(response: BotResponse | string): BotResponse {
  if (typeof response === 'string') {
    return { content: response };
  }

  return response;
}

export function createBotMessage(response: BotResponse | string): BotMessage {
  const normalized = normalizeBotResponse(response);

  return createChatMessage('bot', normalized.content, {
    id: normalized.id,
    createdAt: normalized.createdAt,
    metadata: normalized.metadata,
  }) as BotMessage;
}

export function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error(typeof error === 'string' ? error : 'Unknown chatbot error');
}