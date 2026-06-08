import { describe, expect, it, vi } from 'vitest';
import { createUserMessage } from '../message';
import type { ChatContext } from '../types';
import { createOpenApiProvider } from './openApiProvider';

const input = createUserMessage('Hello');
const context: ChatContext = {
  mode: 'adapter',
  messages: [input],
};

describe('createOpenApiProvider', () => {
  it('maps successful OpenAPI responses into bot responses', async () => {
    const fetcher = vi.fn(async () =>
      new Response(JSON.stringify({ answer: 'Hello from API' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ) as unknown as typeof fetch;
    const provider = createOpenApiProvider({ endpoint: 'https://api.example.test/chat', fetcher });

    const response = await provider.sendMessage(input, context);

    expect(response.content).toBe('Hello from API');
    expect(fetcher).toHaveBeenCalledWith(
      'https://api.example.test/chat',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('supports custom request and response mappers', async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ result: 'Mapped response' }), { status: 200 })) as unknown as typeof fetch;
    const provider = createOpenApiProvider<{ prompt: string }, { result: string }>({
      endpoint: 'https://api.example.test/chat',
      fetcher,
      mapRequest: (message) => ({ prompt: message.content }),
      mapResponse: (response) => ({ content: response.result }),
    });

    const response = await provider.sendMessage(input, context);
    const requestInit = (fetcher as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1] as RequestInit;

    expect(JSON.parse(requestInit.body as string)).toEqual({ prompt: 'Hello' });
    expect(response.content).toBe('Mapped response');
  });

  it('throws when the external service fails', async () => {
    const fetcher = vi.fn(async () => new Response('Failure', { status: 500 })) as unknown as typeof fetch;
    const provider = createOpenApiProvider({ endpoint: 'https://api.example.test/chat', fetcher });

    await expect(provider.sendMessage(input, context)).rejects.toThrow('status 500');
  });
});