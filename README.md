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
import { ChatBot, ChatBotWidget } from 'modular-react-chatbot';
import 'modular-react-chatbot/style.css';
```

## FAQ mode

Use FAQ mode when the chatbot should answer from local predefined content.

```tsx
import { ChatBot, type FaqItem } from 'modular-react-chatbot';
import 'modular-react-chatbot/style.css';

const faqItems: FaqItem[] = [
  {
    question: 'Contact Us',
    answer: 'You can reach us at support@example.com or through our contact form.',
    keywords: ['contact', 'support'],
  },
  {
    question: "How to's",
    answer: 'Browse our help center for step-by-step setup and troubleshooting guides.',
    keywords: ['how to', 'guide', 'tutorial'],
  },
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
      showFaqOptions
      faqOptionsLabel="Select a topic:"
      fallbackResponse="I do not know that yet. Please contact support."
    />
  );
}
```

When `showFaqOptions` is enabled, FAQ questions render as clickable badge buttons. A user can click **Contact Us**, **How to's**, or any other configured FAQ item instead of typing the question manually. Clicking a badge submits that question through the same FAQ matching flow and displays the predefined answer.

For custom layouts, render the badge list yourself with the compound slot:

```tsx
<ChatBot.Root mode="faq" title="Support" faqItems={faqItems}>
  <ChatBot.Header />
  <ChatBot.Messages />
  <ChatBot.FaqOptions label="What can we help with?">
    {(item) => `💬 ${item.question}`}
  </ChatBot.FaqOptions>
  <ChatBot.Composer />
</ChatBot.Root>
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

## Composable chatbot UI

Use the simple `<ChatBot />` preset when the default structure is enough. Use the compound API when you need full control over the chatbox content. In composed usage, the mode configuration belongs on `ChatBot.Root`.

```tsx
<ChatBot.Root mode="faq" title="Custom Support" faqItems={faqItems}>
  <ChatBot.Header className="bg-purple-600 text-white">
    <div className="flex items-center gap-3">
      <span className="rounded-full bg-white/20 p-2">🤖</span>
      <div>
        <ChatBot.Title className="text-white" />
        <p className="text-xs text-purple-100">Ask us anything</p>
      </div>
    </div>
  </ChatBot.Header>

  <ChatBot.Messages className="bg-purple-50">
    {(message) => (
      <ChatBot.MessageItem
        message={message}
        bubbleClassName={message.role === 'bot' ? 'bg-white text-purple-950' : 'bg-purple-600 text-white'}
      >
        <span className="mr-2">{message.role === 'bot' ? '🤖' : '🧑'}</span>
        {message.content}
      </ChatBot.MessageItem>
    )}
  </ChatBot.Messages>

  <ChatBot.Loading className="text-purple-500">Checking the FAQ...</ChatBot.Loading>
  <ChatBot.Error className="text-rose-600">The assistant is unavailable.</ChatBot.Error>

  <ChatBot.Composer className="border-purple-100">
    <ChatBot.Input className="focus:border-purple-500 focus:ring-purple-100" />
    <ChatBot.SubmitButton className="bg-purple-600 hover:bg-purple-700" aria-label="Send message">
      ➤
    </ChatBot.SubmitButton>
  </ChatBot.Composer>
</ChatBot.Root>
```

Available `ChatBot` slots:

- `ChatBot.Root` — owns `faq`/`adapter` mode props, calls `useChatbot`, and provides context.
- `ChatBot.Header` — header wrapper. Defaults to rendering `ChatBot.Title`.
- `ChatBot.Title` — renders the configured `title` unless custom children are provided.
- `ChatBot.Messages` — renders messages. Pass a function as children for per-message customization.
- `ChatBot.FaqOptions` — renders FAQ items as clickable badge buttons in FAQ mode.
- `ChatBot.MessageItem` — message row and bubble helper. Supports `bubbleClassName` and custom children.
- `ChatBot.Empty` — custom empty state when there are no messages.
- `ChatBot.Loading` — custom loading state.
- `ChatBot.Error` — custom error state.
- `ChatBot.Composer` — message form wrapper.
- `ChatBot.Input` — controlled input connected to chatbot context.
- `ChatBot.SubmitButton` — submit button that can render custom text or icons.

`ChatBot.Messages` uses the **render props** pattern, specifically **function as children**:

```tsx
<ChatBot.Messages>
  {(message) => (
    <ChatBot.MessageItem message={message}>
      <span className="mr-2">{message.role === 'bot' ? '🤖' : '🧑'}</span>
      {message.content}
    </ChatBot.MessageItem>
  )}
</ChatBot.Messages>
```

Use `classNames` for quick styling overrides. Use compound components when you need to change structure, icons, avatars, custom message rendering, or custom state UI.

### ChatBot slot nesting rules

`ChatBot.Header`, `ChatBot.Messages`, `ChatBot.Composer`, and the other `ChatBot.*` slots require chatbot context. They must be rendered inside either:

- `ChatBot.Root`, for embedded chatbots; or
- `ChatBotWidget.ChatBot`, when composing a widget panel.

Incorrect widget nesting:

```tsx
<ChatBotWidget.Panel>
  <ChatBot.Header /> {/* ❌ outside ChatBot context */}
  <ChatBotWidget.ChatBot />
</ChatBotWidget.Panel>
```

Correct widget nesting:

```tsx
<ChatBotWidget.Panel>
  <ChatBotWidget.ChatBot>
    <ChatBot.Header />
    <ChatBot.Messages />
    <ChatBot.Composer>
      <ChatBot.Input />
      <ChatBot.SubmitButton>➤</ChatBot.SubmitButton>
    </ChatBot.Composer>
  </ChatBotWidget.ChatBot>
</ChatBotWidget.Panel>
```

If a slot is used outside the correct context, the component throws a runtime error with guidance on where to move it. TypeScript cannot fully validate React component ancestry in normal JSX, so this runtime guard protects developers during local development and tests.

## Floating chat widget

Use `ChatBotWidget` when you want a lower-right floating bubble that opens the chat panel when clicked. It supports the same `faq` and `adapter` mode configuration as `ChatBot`.

```tsx
import { ChatBotWidget, type FaqItem } from 'modular-react-chatbot';
import 'modular-react-chatbot/style.css';

const faqItems: FaqItem[] = [
  {
    question: 'How do I contact support?',
    answer: 'Email support@example.com or open a ticket from your dashboard.',
    keywords: ['support', 'contact', 'help'],
  },
];

export function FloatingSupportBot() {
  return (
    <ChatBotWidget
      mode="faq"
      title="Support Assistant"
      faqItems={faqItems}
      launcherLabel="Open support chat"
      closeLabel="Minimize support chat"
      draggable
    />
  );
}
```

The widget is collapsed by default, shows a fixed lower-right launcher bubble, and keeps the launcher available after users close/minimize the chat panel. Pass `defaultOpen` to render the panel open initially, or `widgetClassNames` to customize the launcher, panel shell, close button, and embedded chatbot sizing.

For branded layouts, use the compound widget API. The root owns widget state, draggable behavior, and chat mode props; the slots let you compose custom markup and Tailwind classes. `ChatBotWidget.ChatBot` bridges the mode props from `ChatBotWidget.Root` into the underlying `ChatBot.Root`, so you do not repeat `faqItems` or `provider` inside the panel.

```tsx
<ChatBotWidget.Root mode="faq" title="Custom Support" faqItems={faqItems} draggable>
  <ChatBotWidget.Panel className="items-stretch overflow-hidden rounded-3xl border border-purple-200 bg-white shadow-2xl">
    <div className="flex items-center justify-between bg-purple-600 px-4 py-3 text-white">
      <span className="font-semibold">Custom Support</span>
      <ChatBotWidget.CloseButton className="bg-white/20 px-3 shadow-none hover:bg-white/30" />
    </div>

    <ChatBotWidget.ChatBot className="h-[30rem] rounded-none border-0 shadow-none">
      <ChatBot.Header className="hidden" />
      <ChatBot.Messages className="bg-purple-50">
        {(message) => (
          <ChatBot.MessageItem message={message}>
            <span className="mr-2">{message.role === 'bot' ? '🤖' : '🧑'}</span>
            {message.content}
          </ChatBot.MessageItem>
        )}
      </ChatBot.Messages>
      <ChatBot.Composer>
        <ChatBot.Input />
        <ChatBot.SubmitButton className="bg-purple-600 hover:bg-purple-700" aria-label="Send message">
          ➤
        </ChatBot.SubmitButton>
      </ChatBot.Composer>
    </ChatBotWidget.ChatBot>
  </ChatBotWidget.Panel>

  <ChatBotWidget.Launcher className="bg-purple-600 shadow-purple-300 hover:bg-purple-700">
    ✨
  </ChatBotWidget.Launcher>
</ChatBotWidget.Root>
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