import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  ChatBox,
  ChatBoxWidget,
  createOpenApiProvider,
  useLocalChatSession,
} from "../src";
import type { ChatProvider } from "../src";
import {
  FaqModeExample,
  PersistentFaqSessionsExample,
  faqItems,
} from "./faq-mode";
import "../src/style.css";

const sectionClassName =
  "rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-sm shadow-slate-200/70 ring-1 ring-white/70 backdrop-blur";
const sectionEyebrowClassName =
  "text-xs font-bold uppercase tracking-[0.28em] text-purple-600";
const sectionTitleClassName =
  "mt-2 text-2xl font-bold tracking-tight text-slate-950";
const sectionDescriptionClassName =
  "mt-2 max-w-3xl text-sm leading-6 text-slate-600";
const chatFrameClassName = "mt-5 overflow-hidden rounded-2xl";
const chatShellClassName = "h-[30rem] shadow-xl";

const failingDemoProvider = {
  async sendMessage() {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    throw new Error("Demo provider failed");
  },
} satisfies ChatProvider;

const simulatedApiProvider = {
  async sendMessage(input, context) {
    const apiRequest = {
      message: input.content,
      previousMessages: context.messages.length,
      metadata: context.metadata,
    };

    const apiResponse = await new Promise<{ answer: string }>((resolve) => {
      window.setTimeout(() => {
        resolve({
          answer:
            `Simulated API response for "${apiRequest.message}". ` +
            `The request included ${apiRequest.previousMessages} message(s) in context.`,
        });
      }, 1600);
    });

    return {
      content: apiResponse.answer,
      metadata: {
        source: "simulated-api",
        request: apiRequest,
      },
    };
  },
} satisfies ChatProvider;

const fastApiProvider = createOpenApiProvider<
  { input_text: string },
  { response: string }
>({
  endpoint: "http://localhost:8000/chatbot",
  mapRequest: (message) => ({
    input_text: message.content,
  }),
  mapResponse: (response) => ({
    content: response.response,
    metadata: {
      source: "fastapi-localhost",
      raw: response,
    },
  }),
});

function Demo() {
  const { messages, setMessages, sessionId } = useLocalChatSession(
    "demo-fastapi-provider-chat-sesssion",
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f3e8ff,_transparent_34rem),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-10 font-sans text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-sm shadow-slate-200/80 ring-1 ring-slate-100 backdrop-blur sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className={sectionEyebrowClassName}>React chat UI kit</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Chatterkit demos
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                A polished collection of embedded chatbots, FAQ flows, provider
                adapters, loading states, and a floating widget. Every example
                uses consistent spacing, typography, and card styling so the demo
                page is presentation-ready.
              </p>
            </div>
            <div className="rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm font-semibold text-purple-700">
              Uniform font • Clean cards • Ready to present
            </div>
          </div>
        </header>

        <section className="rounded-3xl border-2 border-purple-200 bg-white p-6 shadow-lg shadow-purple-100/70">
          <div className="mb-5">
            <p className={sectionEyebrowClassName}>CodeSandbox quick-start</p>
            <h2 className={sectionTitleClassName}>
              Simple embedded FAQ chatbot
            </h2>
            <p className={sectionDescriptionClassName}>
              Copy this pattern when you only need a working chatbot quickly.
              The rest of this page shows additional reference examples.
            </p>
          </div>

          <ChatBox
            mode="faq"
            title="FAQ Assistant"
            faqItems={faqItems}
            showFaqOptions
            faqOptionsLabel="Try asking:"
            fallbackResponse="I do not know that yet. Try one of the FAQ buttons."
            className="h-[30rem] shadow-xl"
          />
        </section>

        <div className="space-y-8 [&>section]:rounded-3xl [&>section]:border [&>section]:border-slate-200/80 [&>section]:bg-white/95 [&>section]:shadow-sm [&>section]:shadow-slate-200/70 [&>section]:ring-1 [&>section]:ring-white/70">
          <FaqModeExample />
          <PersistentFaqSessionsExample />
        </div>

        <section className={sectionClassName}>
          <p className={sectionEyebrowClassName}>Compound components</p>
          <h2 className={sectionTitleClassName}>Composed embedded chatbot</h2>
          <p className={sectionDescriptionClassName}>
            A fully composed FAQ assistant with customized header, message
            bubbles, FAQ chips, loading text, error state, composer, input, and
            submit button.
          </p>
          <div className={chatFrameClassName}>
            <ChatBox.Root
              mode="faq"
              title="Composed FAQ Assistant"
              faqItems={faqItems}
              fallbackResponse="I do not know that yet. Please contact support for help."
              className={`${chatShellClassName} border-purple-100`}
            >
              <ChatBox.Header className="bg-purple-600 text-white">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
                    🤖
                  </span>
                  <div>
                    <ChatBox.Title className="text-white" />
                    <p className="text-xs font-medium text-purple-100">
                      Compound component demo
                    </p>
                  </div>
                </div>
              </ChatBox.Header>
              <ChatBox.Messages className="bg-purple-50">
                {(message) => (
                  <ChatBox.MessageItem
                    message={message}
                    className="items-end gap-2"
                    bubbleClassName={
                      message.role === "bot"
                        ? "bg-white text-purple-950 shadow-sm"
                        : "bg-purple-600 text-white"
                    }
                  >
                    <span className="mr-2">
                      {message.role === "bot" ? "🤖" : "🧑"}
                    </span>
                    {message.content}
                  </ChatBox.MessageItem>
                )}
              </ChatBox.Messages>
              <ChatBox.FaqOptions className="border-purple-100 bg-purple-50/80">
                {(item, option) => (
                  <button
                    {...option.getButtonProps({
                      className:
                        "flex min-w-40 flex-col rounded-2xl border border-purple-200 bg-white text-left text-purple-950 shadow-sm transition hover:-translate-y-0.5 hover:bg-purple-100",
                    })}
                  >
                    <span className="text-sm font-semibold">
                      💬 {item.question}
                    </span>
                  </button>
                )}
              </ChatBox.FaqOptions>
              <ChatBox.Loading className="text-purple-500">
                Checking the FAQ...
              </ChatBox.Loading>
              <ChatBox.Error className="text-rose-600">
                The assistant hit a custom error state.
              </ChatBox.Error>
              <ChatBox.Composer className="border-purple-100">
                <ChatBox.Input className="focus:border-purple-500 focus:ring-purple-100" />
                <ChatBox.SubmitButton
                  className="bg-purple-600 hover:bg-purple-700"
                  aria-label="Send message"
                >
                  ➤
                </ChatBox.SubmitButton>
              </ChatBox.Composer>
            </ChatBox.Root>
          </div>
        </section>

        <section className={sectionClassName}>
          <p className={sectionEyebrowClassName}>Minimal styling</p>
          <h2 className={sectionTitleClassName}>Clean basic chatbot</h2>
          <p className={sectionDescriptionClassName}>
            A readable composition that stays intentionally minimal while still
            looking tidy enough for a demo or documentation page.
          </p>
          <div className={chatFrameClassName}>
            <ChatBox.Root
              mode="faq"
              title="Basic FAQ Assistant"
              faqItems={faqItems}
              fallbackResponse="I do not know that yet. Please contact support for help."
              className="h-[30rem] border-slate-200 bg-white shadow-xl"
            >
              <ChatBox.Header className="border-b border-slate-200 bg-slate-50 text-slate-950">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">
                    🤖
                  </span>
                  <div>
                    <ChatBox.Title />
                    <p className="text-xs font-medium text-slate-500">
                      Minimal compound component example
                    </p>
                  </div>
                </div>
              </ChatBox.Header>
              <ChatBox.Messages className="bg-slate-50">
                {(message) => (
                  <ChatBox.MessageItem
                    message={message}
                    className="items-end gap-2"
                    bubbleClassName={
                      message.role === "bot"
                        ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                        : "bg-slate-900 text-white"
                    }
                  >
                    <span className="mr-2">
                      {message.role === "bot" ? "🤖" : "🧑"}
                    </span>
                    {message.content}
                  </ChatBox.MessageItem>
                )}
              </ChatBox.Messages>
              <ChatBox.FaqOptions className="border-slate-200 bg-white">
                {(item, option) => (
                  <button
                    {...option.getButtonProps({
                      className:
                        "rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100",
                    })}
                  >
                    💬 {item.question}
                  </button>
                )}
              </ChatBox.FaqOptions>
              <ChatBox.Loading className="text-slate-500">
                Checking the FAQ...
              </ChatBox.Loading>
              <ChatBox.Error className="text-rose-600">
                The assistant hit a custom error state.
              </ChatBox.Error>
              <ChatBox.Composer className="border-slate-200">
                <ChatBox.Input className="focus:border-slate-500 focus:ring-slate-200" />
                <ChatBox.SubmitButton
                  className="bg-slate-900 hover:bg-slate-700"
                  aria-label="Send message"
                >
                  Send
                </ChatBox.SubmitButton>
              </ChatBox.Composer>
            </ChatBox.Root>
          </div>
        </section>

        <section className={sectionClassName}>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-600">
            Provider mode
          </p>
          <h2 className={sectionTitleClassName}>API simulation</h2>
          <p className={sectionDescriptionClassName}>
            This adapter-mode demo simulates a successful API request. Send any
            message to see the loading state and delayed response.
          </p>
          <div className={chatFrameClassName}>
            <ChatBox.Root
              mode="adapter"
              title="API Provider Demo"
              provider={simulatedApiProvider}
              metadata={{ demo: "provider-api-simulation" }}
              className={`${chatShellClassName} border-sky-100`}
            >
              <ChatBox.Header className="bg-sky-600 text-white">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
                    🌐
                  </span>
                  <div>
                    <ChatBox.Title className="text-white" />
                    <p className="text-xs font-medium text-sky-100">
                      Simulates POST /api/chat with a delayed response
                    </p>
                  </div>
                </div>
              </ChatBox.Header>
              <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-sky-50 p-4">
                <ChatBox.Messages
                  className="flex-none overflow-visible bg-transparent p-0"
                  newMessageIndicator={({ unreadCount, scrollToBottom }) => (
                    <button
                      type="button"
                      onClick={scrollToBottom}
                      className="rounded-full bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-sky-200 transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
                    >
                      {unreadCount} new API response{unreadCount > 1 ? "s" : ""}{" "}
                      ↓
                    </button>
                  )}
                >
                  {(message) => (
                    <ChatBox.MessageItem
                      message={message}
                      bubbleClassName={
                        message.role === "bot"
                          ? "bg-white text-sky-950 shadow-sm"
                          : "bg-sky-600 text-white"
                      }
                    >
                      <span className="mr-2">
                        {message.role === "bot" ? "🌐" : "🧑"}
                      </span>
                      {message.content}
                    </ChatBox.MessageItem>
                  )}
                </ChatBox.Messages>
                <ChatBox.Loading className="p-0">
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-sky-100">
                      <span className="sr-only">Calling simulated API...</span>
                      <div
                        className="flex items-center gap-1.5"
                        aria-hidden="true"
                      >
                        <span className="chatbot-typing-dot bg-sky-400" />
                        <span className="chatbot-typing-dot bg-sky-400 [animation-delay:150ms]" />
                        <span className="chatbot-typing-dot bg-sky-400 [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                </ChatBox.Loading>
              </div>
              <ChatBox.Error className="px-4 pb-2 text-rose-600">
                The simulated API request failed.
              </ChatBox.Error>
              <ChatBox.Composer className="border-sky-100">
                <ChatBox.Input
                  className="focus:border-sky-500 focus:ring-sky-100"
                  placeholder="Ask the simulated API anything..."
                />
                <ChatBox.SubmitButton
                  className="bg-sky-600 hover:bg-sky-700"
                  aria-label="Send message"
                >
                  Send
                </ChatBox.SubmitButton>
              </ChatBox.Composer>
            </ChatBox.Root>
          </div>
        </section>

        <section className={sectionClassName}>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-600">
            Local adapter
          </p>
          <h2 className={sectionTitleClassName}>FastAPI provider chatbot</h2>
          <p className={sectionDescriptionClassName}>
            This adapter-mode demo calls your local FastAPI chatbot at{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-semibold text-slate-800">
              POST http://localhost:8000/chatbot
            </code>{" "}
            using the request shape <code>{"{ input_text: string }"}</code> and
            response shape <code>{"{ response: string }"}</code>.
          </p>
          <div className={chatFrameClassName}>
            <ChatBox.Root
              mode="adapter"
              title="Local FastAPI Assistant"
              provider={fastApiProvider}
              initialMessages={messages}
              onMessagesChange={setMessages}
              metadata={{ demo: "fastapi-local-provider", sessionId }}
              errorLabel="The FastAPI chatbot request failed. Check that localhost:8000 is running and allows CORS."
              className={`${chatShellClassName} border-emerald-100`}
            >
              <ChatBox.Header className="bg-emerald-600 text-white">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
                    🧠
                  </span>
                  <div>
                    <ChatBox.Title className="text-white" />
                    <p className="text-xs font-medium text-emerald-100">
                      Real adapter provider connected to FastAPI
                    </p>
                  </div>
                </div>
              </ChatBox.Header>
              <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-emerald-50 p-4">
                <ChatBox.Messages className="flex-none overflow-visible bg-transparent p-0">
                  {(message) => (
                    <ChatBox.MessageItem
                      message={message}
                      bubbleClassName={
                        message.role === "bot"
                          ? "bg-white text-emerald-950 shadow-sm"
                          : "bg-emerald-600 text-white"
                      }
                    >
                      <span className="mr-2">
                        {message.role === "bot" ? "🧠" : "🧑"}
                      </span>
                      {message.content}
                    </ChatBox.MessageItem>
                  )}
                </ChatBox.Messages>
                <ChatBox.Loading className="p-0">
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-emerald-100">
                      <span className="sr-only">
                        Calling FastAPI chatbot...
                      </span>
                      <div
                        className="flex items-center gap-1.5"
                        aria-hidden="true"
                      >
                        <span className="chatbot-typing-dot bg-emerald-400" />
                        <span className="chatbot-typing-dot bg-emerald-400 [animation-delay:150ms]" />
                        <span className="chatbot-typing-dot bg-emerald-400 [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                </ChatBox.Loading>
              </div>
              <ChatBox.Error className="px-4 pb-2 text-rose-600">
                The FastAPI chatbot request failed. Check that localhost:8000 is
                running and allows CORS from the Vite dev server.
              </ChatBox.Error>
              <ChatBox.Composer className="border-emerald-100">
                <ChatBox.Input
                  className="focus:border-emerald-500 focus:ring-emerald-100"
                  placeholder="Ask your local FastAPI chatbot..."
                />
                <ChatBox.SubmitButton
                  className="bg-emerald-600 hover:bg-emerald-700"
                  aria-label="Send message"
                >
                  Send
                </ChatBox.SubmitButton>
              </ChatBox.Composer>
            </ChatBox.Root>
          </div>
        </section>

        <section className={sectionClassName}>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-rose-600">
            State handling
          </p>
          <h2 className={sectionTitleClassName}>Loading and error states</h2>
          <p className={sectionDescriptionClassName}>
            Type any message and send it. The fake adapter waits for 1.5 seconds
            so the loading state appears, then throws an error so the error
            state appears.
          </p>
          <div className={chatFrameClassName}>
            <ChatBox.Root
              mode="adapter"
              title="Loading/Error Demo"
              provider={failingDemoProvider}
              errorLabel="The assistant hit a custom error state."
              className={`${chatShellClassName} border-rose-100`}
            >
              <ChatBox.Header className="bg-rose-600 text-white">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
                    ⚠️
                  </span>
                  <div>
                    <ChatBox.Title className="text-white" />
                    <p className="text-xs font-medium text-rose-100">
                      Demo provider intentionally fails
                    </p>
                  </div>
                </div>
              </ChatBox.Header>
              <ChatBox.Messages className="bg-rose-50" />
              <ChatBox.Loading className="flex items-center gap-2 px-4 pb-2 text-rose-500">
                <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
                Calling the demo provider...
              </ChatBox.Loading>
              <ChatBox.Error className="rounded-lg bg-rose-50 px-4 pb-3 text-rose-600">
                The assistant hit a custom error state.
              </ChatBox.Error>
              <ChatBox.Composer className="border-rose-100">
                <ChatBox.Input
                  className="focus:border-rose-500 focus:ring-rose-100"
                  placeholder="Type anything to trigger loading/error..."
                />
                <ChatBox.SubmitButton
                  className="bg-rose-600 hover:bg-rose-700"
                  aria-label="Send message"
                >
                  Send
                </ChatBox.SubmitButton>
              </ChatBox.Composer>
            </ChatBox.Root>
          </div>
        </section>

        <section className={sectionClassName}>
          <p className={sectionEyebrowClassName}>Floating assistant</p>
          <h2 className={sectionTitleClassName}>Floating widget</h2>
          <p className={sectionDescriptionClassName}>
            Use the polished chat bubble in the lower-right corner to open the
            same FAQ assistant as a draggable floating panel.
          </p>
        </section>
      </div>

      <ChatBoxWidget.Root
        mode="faq"
        title="Custom FAQ Assistant"
        faqItems={faqItems}
        fallbackResponse="I do not know that yet. Please contact support for help."
        launcherLabel="Open custom support chat"
        closeLabel="Minimize custom support chat"
        draggable
      >
        <ChatBoxWidget.Panel className="chatbot-panel-enter items-stretch overflow-hidden rounded-3xl border border-purple-200 bg-white shadow-2xl shadow-purple-200/60">
          <ChatBoxWidget.ChatBox className="h-[30rem] rounded-none border-0 shadow-none">
            <ChatBox.Header className="bg-purple-600 text-white">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
                    🤖
                  </span>
                  <div>
                    <ChatBox.Title className="text-white" />
                    <p className="text-xs font-medium text-purple-100">
                      Floating FAQ assistant
                    </p>
                  </div>
                </div>
                <ChatBoxWidget.CloseButton className="bg-white/20 px-3 text-white shadow-none transition hover:bg-white/30">
                  ×
                </ChatBoxWidget.CloseButton>
              </div>
            </ChatBox.Header>
            <ChatBox.Messages className="bg-purple-50">
              {(message) => (
                <ChatBox.MessageItem
                  message={message}
                  bubbleClassName={
                    message.role === "bot"
                      ? "bg-white text-purple-950 shadow-sm"
                      : "bg-purple-600 text-white"
                  }
                >
                  <span className="mr-2">
                    {message.role === "bot" ? "🤖" : "🧑"}
                  </span>
                  {message.content}
                </ChatBox.MessageItem>
              )}
            </ChatBox.Messages>
            <ChatBox.FaqOptions
              label="Select a topic:"
              className="border-purple-100 bg-purple-50/80"
            >
              {(item, option) => (
                <button
                  {...option.getButtonProps({
                    className:
                      "rounded-2xl border-purple-200 bg-white px-4 py-2 text-purple-900 shadow-sm transition hover:bg-purple-100",
                  })}
                >
                  💬 {item.question}
                </button>
              )}
            </ChatBox.FaqOptions>
            <ChatBox.Composer>
              <ChatBox.Input className="focus:border-purple-500 focus:ring-purple-100" />
              <ChatBox.SubmitButton
                className="bg-purple-600 hover:bg-purple-700"
                aria-label="Send message"
              >
                ➤
              </ChatBox.SubmitButton>
            </ChatBox.Composer>
          </ChatBoxWidget.ChatBox>
        </ChatBoxWidget.Panel>
        <ChatBoxWidget.Launcher className="chatbot-launcher-attention bottom-5 bg-white shadow-xl shadow-purple-300/70 ring-1 ring-purple-100 transition duration-300 hover:scale-110 hover:rotate-6 hover:bg-purple-50">
          <img
            src="/chatterkit-icon.svg"
            alt="Open Chatterkit chat"
            className="h-7 w-7"
          />
        </ChatBoxWidget.Launcher>
      </ChatBoxWidget.Root>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
);
