import { normalizeBotResponse } from '../message';
import type { BotResponse, ChatContext, ChatProvider, MaybePromise, UserMessage } from '../types';

export type OpenApiHttpMethod = 'POST' | 'PUT' | 'PATCH';

export interface OpenApiProviderConfig<TRequest = unknown, TResponse = unknown> {
  endpoint: string;
  method?: OpenApiHttpMethod;
  headers?: HeadersInit | ((input: UserMessage, context: ChatContext) => MaybePromise<HeadersInit>);
  credentials?: RequestCredentials;
  fetcher?: typeof fetch;
  mapRequest?: (input: UserMessage, context: ChatContext) => MaybePromise<TRequest>;
  mapResponse?: (
    response: TResponse,
    input: UserMessage,
    context: ChatContext,
  ) => MaybePromise<BotResponse | string>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function mergeHeaders(base: HeadersInit, override?: HeadersInit) {
  const headers = new Headers(base);

  if (override) {
    new Headers(override).forEach((value, key) => headers.set(key, value));
  }

  return headers;
}

async function resolveHeaders(
  config: Pick<OpenApiProviderConfig, 'headers'>,
  input: UserMessage,
  context: ChatContext,
) {
  const configuredHeaders =
    typeof config.headers === 'function' ? await config.headers(input, context) : config.headers;

  return mergeHeaders({ 'Content-Type': 'application/json' }, configuredHeaders);
}

function defaultRequestMapper(input: UserMessage, context: ChatContext) {
  return {
    message: input.content,
    messages: context.messages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
    metadata: context.metadata,
  };
}

async function parseResponse<TResponse>(response: Response): Promise<TResponse> {
  const text = await response.text();

  if (!text) {
    return {} as TResponse;
  }

  try {
    return JSON.parse(text) as TResponse;
  } catch {
    return text as TResponse;
  }
}

function defaultResponseMapper(response: unknown): BotResponse {
  if (typeof response === 'string') {
    return { content: response };
  }

  if (isRecord(response)) {
    const content = response.content ?? response.message ?? response.answer ?? response.text ?? response.response;

    if (typeof content === 'string') {
      return {
        content,
        metadata: { raw: response },
      };
    }
  }

  return {
    content: JSON.stringify(response),
    metadata: { raw: response },
  };
}

export function createOpenApiProvider<TRequest = unknown, TResponse = unknown>(
  config: OpenApiProviderConfig<TRequest, TResponse>,
): ChatProvider {
  return {
    async sendMessage(input, context) {
      const fetchImpl = config.fetcher ?? globalThis.fetch;

      if (!fetchImpl) {
        throw new Error('No fetch implementation is available for the OpenAPI provider.');
      }

      const requestPayload = config.mapRequest
        ? await config.mapRequest(input, context)
        : defaultRequestMapper(input, context);

      const response = await fetchImpl(config.endpoint, {
        method: config.method ?? 'POST',
        headers: await resolveHeaders(config, input, context),
        credentials: config.credentials,
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`OpenAPI provider request failed with status ${response.status}.`);
      }

      const parsedResponse = await parseResponse<TResponse>(response);
      const mappedResponse = config.mapResponse
        ? await config.mapResponse(parsedResponse, input, context)
        : defaultResponseMapper(parsedResponse);

      return normalizeBotResponse(mappedResponse);
    },
  };
}