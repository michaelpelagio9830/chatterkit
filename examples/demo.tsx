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
  "ck-rounded-3xl ck-border ck-border-slate-200/80 ck-bg-white/95 ck-p-6 ck-shadow-sm ck-shadow-slate-200/70 ck-ring-1 ck-ring-white/70 ck-backdrop-blur";
const sectionEyebrowClassName =
  "ck-text-xs ck-font-bold ck-uppercase ck-tracking-[0.28em] ck-text-purple-600";
const sectionTitleClassName =
  "ck-mt-2 ck-text-2xl ck-font-bold ck-tracking-tight ck-text-slate-950";
const sectionDescriptionClassName =
  "ck-mt-2 ck-max-w-3xl ck-text-sm ck-leading-6 ck-text-slate-600";
const chatFrameClassName = "ck-mt-5 ck-overflow-hidden ck-rounded-2xl";
const chatShellClassName = "ck-h-[30rem] ck-shadow-xl";

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
    <main className="ck-min-h-screen ck-bg-[radial-gradient(circle_at_top_left,_#f3e8ff,_transparent_34rem),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] ck-px-4 ck-py-10 ck-font-sans ck-text-slate-900 sm:ck-px-6 lg:ck-px-8">
      <div className="ck-mx-auto ck-max-w-6xl ck-space-y-8">
        <header className="ck-overflow-hidden ck-rounded-[2rem] ck-border ck-border-white/80 ck-bg-white/90 ck-p-8 ck-shadow-sm ck-shadow-slate-200/80 ck-ring-1 ck-ring-slate-100 ck-backdrop-blur sm:ck-p-10">
          <div className="ck-flex ck-flex-col ck-gap-6 lg:ck-flex-row lg:ck-items-end lg:ck-justify-between">
            <div className="ck-max-w-3xl">
              <p className={sectionEyebrowClassName}>React chat UI kit</p>
              <h1 className="ck-mt-3 ck-text-4xl ck-font-black ck-tracking-tight ck-text-slate-950 sm:ck-text-5xl">
                Chatterkit demos
              </h1>
              <p className="ck-mt-4 ck-text-base ck-leading-7 ck-text-slate-600 sm:ck-text-lg">
                A polished collection of embedded chatbots, FAQ flows, provider
                adapters, loading states, and a floating widget. Every example
                uses consistent spacing, typography, and card styling so the demo
                page is presentation-ready.
              </p>
            </div>
            <div className="ck-rounded-2xl ck-border ck-border-purple-100 ck-bg-purple-50 ck-px-4 ck-py-3 ck-text-sm ck-font-semibold ck-text-purple-700">
              Uniform font • Clean cards • Ready to present
            </div>
          </div>
        </header>

        <section className="ck-rounded-3xl ck-border-2 ck-border-purple-200 ck-bg-white ck-p-6 ck-shadow-lg ck-shadow-purple-100/70">
          <div className="ck-mb-5">
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
            className="ck-h-[30rem] ck-shadow-xl"
          />
        </section>

        <div className="ck-space-y-8 [&>section]:ck-rounded-3xl [&>section]:ck-border [&>section]:ck-border-slate-200/80 [&>section]:ck-bg-white/95 [&>section]:ck-shadow-sm [&>section]:ck-shadow-slate-200/70 [&>section]:ck-ring-1 [&>section]:ck-ring-white/70">
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
              className={`${chatShellClassName} ck-border-purple-100`}
            >
              <ChatBox.Header className="ck-bg-purple-600 ck-text-white">
                <div className="ck-flex ck-items-center ck-gap-3">
                  <span className="ck-flex ck-h-9 ck-w-9 ck-items-center ck-justify-center ck-rounded-full ck-bg-white/20 ck-text-lg">
                    🤖
                  </span>
                  <div>
                    <ChatBox.Title className="ck-text-white" />
                    <p className="ck-text-xs ck-font-medium ck-text-purple-100">
                      Compound component demo
                    </p>
                  </div>
                </div>
              </ChatBox.Header>
              <ChatBox.Messages className="ck-bg-purple-50">
                {(message) => (
                  <ChatBox.MessageItem
                    message={message}
                    className="ck-items-end ck-gap-2"
                    bubbleClassName={
                      message.role === "bot"
                        ? "ck-bg-white ck-text-purple-950 ck-shadow-sm"
                        : "ck-bg-purple-600 ck-text-white"
                    }
                  >
                    <span className="ck-mr-2">
                      {message.role === "bot" ? "🤖" : "🧑"}
                    </span>
                    {message.content}
                  </ChatBox.MessageItem>
                )}
              </ChatBox.Messages>
              <ChatBox.FaqOptions className="ck-border-purple-100 ck-bg-purple-50/80">
                {(item, option) => (
                  <button
                    {...option.getButtonProps({
                      className:
                        "ck-flex ck-min-w-40 ck-flex-col ck-rounded-2xl ck-border ck-border-purple-200 ck-bg-white ck-text-left ck-text-purple-950 ck-shadow-sm ck-transition hover:-ck-translate-y-0.5 hover:ck-bg-purple-100",
                    })}
                  >
                    <span className="ck-text-sm ck-font-semibold">
                      💬 {item.question}
                    </span>
                  </button>
                )}
              </ChatBox.FaqOptions>
              <ChatBox.Loading className="ck-text-purple-500">
                Checking the FAQ...
              </ChatBox.Loading>
              <ChatBox.Error className="ck-text-rose-600">
                The assistant hit a custom error state.
              </ChatBox.Error>
              <ChatBox.Composer className="ck-border-purple-100">
                <ChatBox.Input className="focus:ck-border-purple-500 focus:ck-ring-purple-100" />
                <ChatBox.SubmitButton
                  className="ck-bg-purple-600 hover:ck-bg-purple-700"
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
              className="ck-h-[30rem] ck-border-slate-200 ck-bg-white ck-shadow-xl"
            >
              <ChatBox.Header className="ck-border-b ck-border-slate-200 ck-bg-slate-50 ck-text-slate-950">
                <div className="ck-flex ck-items-center ck-gap-3">
                  <span className="ck-flex ck-h-9 ck-w-9 ck-items-center ck-justify-center ck-rounded-full ck-bg-slate-900 ck-text-white">
                    🤖
                  </span>
                  <div>
                    <ChatBox.Title />
                    <p className="ck-text-xs ck-font-medium ck-text-slate-500">
                      Minimal compound component example
                    </p>
                  </div>
                </div>
              </ChatBox.Header>
              <ChatBox.Messages className="ck-bg-slate-50">
                {(message) => (
                  <ChatBox.MessageItem
                    message={message}
                    className="ck-items-end ck-gap-2"
                    bubbleClassName={
                      message.role === "bot"
                        ? "ck-bg-white ck-text-slate-900 ck-shadow-sm ck-ring-1 ck-ring-slate-200"
                        : "ck-bg-slate-900 ck-text-white"
                    }
                  >
                    <span className="ck-mr-2">
                      {message.role === "bot" ? "🤖" : "🧑"}
                    </span>
                    {message.content}
                  </ChatBox.MessageItem>
                )}
              </ChatBox.Messages>
              <ChatBox.FaqOptions className="ck-border-slate-200 ck-bg-white">
                {(item, option) => (
                  <button
                    {...option.getButtonProps({
                      className:
                        "ck-rounded-xl ck-border ck-border-slate-200 ck-bg-white ck-px-3 ck-py-2 ck-text-left ck-text-sm ck-font-medium ck-text-slate-700 ck-shadow-sm ck-transition hover:ck-bg-slate-100",
                    })}
                  >
                    💬 {item.question}
                  </button>
                )}
              </ChatBox.FaqOptions>
              <ChatBox.Loading className="ck-text-slate-500">
                Checking the FAQ...
              </ChatBox.Loading>
              <ChatBox.Error className="ck-text-rose-600">
                The assistant hit a custom error state.
              </ChatBox.Error>
              <ChatBox.Composer className="ck-border-slate-200">
                <ChatBox.Input className="focus:ck-border-slate-500 focus:ck-ring-slate-200" />
                <ChatBox.SubmitButton
                  className="ck-bg-slate-900 hover:ck-bg-slate-700"
                  aria-label="Send message"
                >
                  Send
                </ChatBox.SubmitButton>
              </ChatBox.Composer>
            </ChatBox.Root>
          </div>
        </section>

        <section className={sectionClassName}>
          <p className="ck-text-xs ck-font-bold ck-uppercase ck-tracking-[0.28em] ck-text-sky-600">
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
              className={`${chatShellClassName} ck-border-sky-100`}
            >
              <ChatBox.Header className="ck-bg-sky-600 ck-text-white">
                <div className="ck-flex ck-items-center ck-gap-3">
                  <span className="ck-flex ck-h-9 ck-w-9 ck-items-center ck-justify-center ck-rounded-full ck-bg-white/20 ck-text-lg">
                    🌐
                  </span>
                  <div>
                    <ChatBox.Title className="ck-text-white" />
                    <p className="ck-text-xs ck-font-medium ck-text-sky-100">
                      Simulates POST /api/chat with a delayed response
                    </p>
                  </div>
                </div>
              </ChatBox.Header>
              <div className="ck-flex ck-flex-1 ck-flex-col ck-gap-3 ck-overflow-y-auto ck-bg-sky-50 ck-p-4">
                <ChatBox.Messages
                  className="ck-flex-none ck-overflow-visible ck-bg-transparent ck-p-0"
                  newMessageIndicator={({ unreadCount, scrollToBottom }) => (
                    <button
                      type="button"
                      onClick={scrollToBottom}
                      className="ck-rounded-full ck-bg-sky-600 ck-px-4 ck-py-1.5 ck-text-xs ck-font-semibold ck-text-white ck-shadow-lg ck-shadow-sky-200 ck-transition hover:ck-bg-sky-700 focus:ck-outline-none focus:ck-ring-2 focus:ck-ring-sky-400 focus:ck-ring-offset-2"
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
                          ? "ck-bg-white ck-text-sky-950 ck-shadow-sm"
                          : "ck-bg-sky-600 ck-text-white"
                      }
                    >
                      <span className="ck-mr-2">
                        {message.role === "bot" ? "🌐" : "🧑"}
                      </span>
                      {message.content}
                    </ChatBox.MessageItem>
                  )}
                </ChatBox.Messages>
                <ChatBox.Loading className="ck-p-0">
                  <div className="ck-flex ck-justify-start">
                    <div className="ck-rounded-2xl ck-rounded-bl-sm ck-bg-white ck-px-4 ck-py-3 ck-shadow-sm ck-ring-1 ck-ring-sky-100">
                      <span className="ck-sr-only">Calling simulated API...</span>
                      <div
                        className="ck-flex ck-items-center ck-gap-1.5"
                        aria-hidden="true"
                      >
                        <span className="chatbot-typing-dot ck-bg-sky-400" />
                        <span className="chatbot-typing-dot ck-bg-sky-400 ck-[animation-delay:150ms]" />
                        <span className="chatbot-typing-dot ck-bg-sky-400 ck-[animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                </ChatBox.Loading>
              </div>
              <ChatBox.Error className="ck-px-4 ck-pb-2 ck-text-rose-600">
                The simulated API request failed.
              </ChatBox.Error>
              <ChatBox.Composer className="ck-border-sky-100">
                <ChatBox.Input
                  className="focus:ck-border-sky-500 focus:ck-ring-sky-100"
                  placeholder="Ask the simulated API anything..."
                />
                <ChatBox.SubmitButton
                  className="ck-bg-sky-600 hover:ck-bg-sky-700"
                  aria-label="Send message"
                >
                  Send
                </ChatBox.SubmitButton>
              </ChatBox.Composer>
            </ChatBox.Root>
          </div>
        </section>

        <section className={sectionClassName}>
          <p className="ck-text-xs ck-font-bold ck-uppercase ck-tracking-[0.28em] ck-text-emerald-600">
            Local adapter
          </p>
          <h2 className={sectionTitleClassName}>FastAPI provider chatbot</h2>
          <p className={sectionDescriptionClassName}>
            This adapter-mode demo calls your local FastAPI chatbot at{" "}
            <code className="ck-rounded ck-bg-slate-100 ck-px-1.5 ck-py-0.5 ck-text-sm ck-font-semibold ck-text-slate-800">
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
              className={`${chatShellClassName} ck-border-emerald-100`}
            >
              <ChatBox.Header className="ck-bg-emerald-600 ck-text-white">
                <div className="ck-flex ck-items-center ck-gap-3">
                  <span className="ck-flex ck-h-9 ck-w-9 ck-items-center ck-justify-center ck-rounded-full ck-bg-white/20 ck-text-lg">
                    🧠
                  </span>
                  <div>
                    <ChatBox.Title className="ck-text-white" />
                    <p className="ck-text-xs ck-font-medium ck-text-emerald-100">
                      Real adapter provider connected to FastAPI
                    </p>
                  </div>
                </div>
              </ChatBox.Header>
              <div className="ck-flex ck-flex-1 ck-flex-col ck-gap-3 ck-overflow-y-auto ck-bg-emerald-50 ck-p-4">
                <ChatBox.Messages className="ck-flex-none ck-overflow-visible ck-bg-transparent ck-p-0">
                  {(message) => (
                    <ChatBox.MessageItem
                      message={message}
                      bubbleClassName={
                        message.role === "bot"
                          ? "ck-bg-white ck-text-emerald-950 ck-shadow-sm"
                          : "ck-bg-emerald-600 ck-text-white"
                      }
                    >
                      <span className="ck-mr-2">
                        {message.role === "bot" ? "🧠" : "🧑"}
                      </span>
                      {message.content}
                    </ChatBox.MessageItem>
                  )}
                </ChatBox.Messages>
                <ChatBox.Loading className="ck-p-0">
                  <div className="ck-flex ck-justify-start">
                    <div className="ck-rounded-2xl ck-rounded-bl-sm ck-bg-white ck-px-4 ck-py-3 ck-shadow-sm ck-ring-1 ck-ring-emerald-100">
                      <span className="ck-sr-only">
                        Calling FastAPI chatbot...
                      </span>
                      <div
                        className="ck-flex ck-items-center ck-gap-1.5"
                        aria-hidden="true"
                      >
                        <span className="chatbot-typing-dot ck-bg-emerald-400" />
                        <span className="chatbot-typing-dot ck-bg-emerald-400 ck-[animation-delay:150ms]" />
                        <span className="chatbot-typing-dot ck-bg-emerald-400 ck-[animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                </ChatBox.Loading>
              </div>
              <ChatBox.Error className="ck-px-4 ck-pb-2 ck-text-rose-600">
                The FastAPI chatbot request failed. Check that localhost:8000 is
                running and allows CORS from the Vite dev server.
              </ChatBox.Error>
              <ChatBox.Composer className="ck-border-emerald-100">
                <ChatBox.Input
                  className="focus:ck-border-emerald-500 focus:ck-ring-emerald-100"
                  placeholder="Ask your local FastAPI chatbot..."
                />
                <ChatBox.SubmitButton
                  className="ck-bg-emerald-600 hover:ck-bg-emerald-700"
                  aria-label="Send message"
                >
                  Send
                </ChatBox.SubmitButton>
              </ChatBox.Composer>
            </ChatBox.Root>
          </div>
        </section>

        <section className={sectionClassName}>
          <p className="ck-text-xs ck-font-bold ck-uppercase ck-tracking-[0.28em] ck-text-rose-600">
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
              className={`${chatShellClassName} ck-border-rose-100`}
            >
              <ChatBox.Header className="ck-bg-rose-600 ck-text-white">
                <div className="ck-flex ck-items-center ck-gap-3">
                  <span className="ck-flex ck-h-9 ck-w-9 ck-items-center ck-justify-center ck-rounded-full ck-bg-white/20 ck-text-lg">
                    ⚠️
                  </span>
                  <div>
                    <ChatBox.Title className="ck-text-white" />
                    <p className="ck-text-xs ck-font-medium ck-text-rose-100">
                      Demo provider intentionally fails
                    </p>
                  </div>
                </div>
              </ChatBox.Header>
              <ChatBox.Messages className="ck-bg-rose-50" />
              <ChatBox.Loading className="ck-flex ck-items-center ck-gap-2 ck-px-4 ck-pb-2 ck-text-rose-500">
                <span className="ck-h-2 ck-w-2 ck-animate-pulse ck-rounded-full ck-bg-rose-500" />
                Calling the demo provider...
              </ChatBox.Loading>
              <ChatBox.Error className="ck-rounded-lg ck-bg-rose-50 ck-px-4 ck-pb-3 ck-text-rose-600">
                The assistant hit a custom error state.
              </ChatBox.Error>
              <ChatBox.Composer className="ck-border-rose-100">
                <ChatBox.Input
                  className="focus:ck-border-rose-500 focus:ck-ring-rose-100"
                  placeholder="Type anything to trigger loading/error..."
                />
                <ChatBox.SubmitButton
                  className="ck-bg-rose-600 hover:ck-bg-rose-700"
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
        <ChatBoxWidget.Panel className="chatbot-panel-enter ck-items-stretch ck-overflow-hidden ck-rounded-3xl ck-border ck-border-purple-200 ck-bg-white ck-shadow-2xl ck-shadow-purple-200/60">
          <ChatBoxWidget.ChatBox className="ck-h-[30rem] ck-rounded-none ck-border-0 ck-shadow-none">
            <ChatBox.Header className="ck-bg-purple-600 ck-text-white">
              <div className="ck-flex ck-items-center ck-justify-between ck-gap-3">
                <div className="ck-flex ck-items-center ck-gap-3">
                  <span className="ck-flex ck-h-9 ck-w-9 ck-items-center ck-justify-center ck-rounded-full ck-bg-white/20 ck-text-lg">
                    🤖
                  </span>
                  <div>
                    <ChatBox.Title className="ck-text-white" />
                    <p className="ck-text-xs ck-font-medium ck-text-purple-100">
                      Floating FAQ assistant
                    </p>
                  </div>
                </div>
                <ChatBoxWidget.CloseButton className="ck-bg-white/20 ck-px-3 ck-text-white ck-shadow-none ck-transition hover:ck-bg-white/30">
                  ×
                </ChatBoxWidget.CloseButton>
              </div>
            </ChatBox.Header>
            <ChatBox.Messages className="ck-bg-purple-50">
              {(message) => (
                <ChatBox.MessageItem
                  message={message}
                  bubbleClassName={
                    message.role === "bot"
                      ? "ck-bg-white ck-text-purple-950 ck-shadow-sm"
                      : "ck-bg-purple-600 ck-text-white"
                  }
                >
                  <span className="ck-mr-2">
                    {message.role === "bot" ? "🤖" : "🧑"}
                  </span>
                  {message.content}
                </ChatBox.MessageItem>
              )}
            </ChatBox.Messages>
            <ChatBox.FaqOptions
              label="Select a topic:"
              className="ck-border-purple-100 ck-bg-purple-50/80"
            >
              {(item, option) => (
                <button
                  {...option.getButtonProps({
                    className:
                      "ck-rounded-2xl ck-border-purple-200 ck-bg-white ck-px-4 ck-py-2 ck-text-purple-900 ck-shadow-sm ck-transition hover:ck-bg-purple-100",
                  })}
                >
                  💬 {item.question}
                </button>
              )}
            </ChatBox.FaqOptions>
            <ChatBox.Composer>
              <ChatBox.Input className="focus:ck-border-purple-500 focus:ck-ring-purple-100" />
              <ChatBox.SubmitButton
                className="ck-bg-purple-600 hover:ck-bg-purple-700"
                aria-label="Send message"
              >
                ➤
              </ChatBox.SubmitButton>
            </ChatBox.Composer>
          </ChatBoxWidget.ChatBox>
        </ChatBoxWidget.Panel>
        <ChatBoxWidget.Launcher className="chatbot-launcher-attention ck-bottom-5 ck-bg-white ck-shadow-xl ck-shadow-purple-300/70 ck-ring-1 ck-ring-purple-100 ck-transition ck-duration-300 hover:ck-scale-110 hover:ck-rotate-6 hover:ck-bg-purple-50">
          <img
            src="/chatterkit-icon.svg"
            alt="Open Chatterkit chat"
            className="ck-h-7 ck-w-7"
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
