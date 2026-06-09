import { ChatBot, createOpenApiProvider } from '../src';

const provider = createOpenApiProvider<{ message: string }, { answer: string }>({
  endpoint: '/api/chat',
  headers: async () => ({
    // Prefer a backend/proxy that attaches production API secrets server-side.
    'X-Client': 'chatbot-demo',
  }),
  mapRequest: (message) => ({
    message: message.content,
  }),
  mapResponse: (response) => ({
    content: response.answer,
  }),
});

export function AdapterModeExample() {
  return (
    <ChatBot
      mode="adapter"
      title="AI Assistant"
      provider={provider}
      fallbackResponse="The assistant is unavailable right now. Please try again later."
    />
  );
}