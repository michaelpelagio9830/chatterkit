import type { BotResponse, ChatContext, ChatProvider, UserMessage } from '../types';

export const DEFAULT_ADAPTER_ERROR_RESPONSE = "Sorry, I couldn't get a response right now.";

export async function resolveAdapterResponse(
  input: UserMessage,
  context: ChatContext,
  provider: ChatProvider,
): Promise<BotResponse> {
  return provider.sendMessage(input, context);
}