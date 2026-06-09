# Modular React Chatbot

A reusable React chatbot component designed for two MVP modes:

- **FAQ mode** for predefined question/answer data.
- **Adapter mode** for developer-provided external services, including OpenAPI-compatible LLM backends.

The recommended stack is **React + TypeScript + Tailwind CSS + Vite + Vitest**.

## Installation

```bash
npm install modular-react-chatbot
```

Import the component and package CSS:

```tsx
import { ChatBot } from 'modular-react-chatbot';
import 'modular-react-chatbot/style.css';
```

## FAQ mode

Use FAQ mode when the chatbot should answer from local predefined content.

```tsx
import { ChatBot, type FaqItem } from 'modular-react-chatbot';
import 'modular-react-chatbot/style.css';

const faqItems: FaqItem[] = [
  {
    question: 'How much does it cost?',
    answer: 'Pricing depends on your selected plan.',
    keywords: ['pricing', 'price', 'cost'],
  },
];

export function SupportBot() {
  return (
    <ChatBot
      mode="faq"
      title="FAQ Assistant"
      faqItems={faqItems}
      fallbackResponse="I do not know that yet. Please contact support."
    />
  );
}
```

You can also provide a custom FAQ resolver:

```tsx
<ChatBot
  mode="faq"
  faqItems={faqItems}
  faqResolver={(message, context, items) => {
    return items.find((item) => message.content.toLowerCase().includes(item.question.toLowerCase()));
  }}
/>
```

## Adapter mode

Use adapter mode when the chatbot should call an external service. The package exposes a generic provider contract and an OpenAPI-friendly helper.

```tsx
import { ChatBot, createOpenApiProvider } from 'modular-react-chatbot';
import 'modular-react-chatbot/style.css';

const provider = createOpenApiProvider<{ message: string }, { answer: string }>({
  endpoint: '/api/chat',
  mapRequest: (message) => ({
    message: message.content,
  }),
  mapResponse: (response) => ({
    content: response.answer,
  }),
});

export function AiAssistant() {
  return (
    <ChatBot
      mode="adapter"
      title="AI Assistant"
      provider={provider}
      fallbackResponse="The assistant is unavailable right now."
    />
  );
}
```

You can also implement your own provider:

```ts
import type { ChatProvider } from 'modular-react-chatbot';

export const provider: ChatProvider = {
  async sendMessage(input, context) {
    return {
      content: `You said: ${input.content}`,
      metadata: { messageCount: context.messages.length },
    };
  },
};
```

## Security guidance

For production LLM/OpenAPI integrations, avoid exposing provider API keys directly in browser code. Prefer a developer-owned backend or proxy route that:

- stores secrets server-side,
- validates the user/session,
- forwards safe requests to the external service,
- maps the external response back to the chatbot provider contract.

## Tailwind setup

The package ships default Tailwind-generated CSS through `modular-react-chatbot/style.css`.

If you want to override styles with your own Tailwind classes, include your app and chatbot usage files in your Tailwind `content` configuration:

```ts
export default {
  content: ['./src/**/*.{ts,tsx}', './node_modules/modular-react-chatbot/dist/**/*.{js,cjs}'],
};
```

The component also accepts `className` and `classNames` props for targeted styling overrides.

## Local development

```bash
npm install
npm run dev
npm test
npm run build
```

## Current MVP boundaries

The first implementation focuses on explicit `faq` and `adapter` modes. Hybrid FAQ-to-adapter fallback, streaming responses, persistence, and package splitting can be added later.