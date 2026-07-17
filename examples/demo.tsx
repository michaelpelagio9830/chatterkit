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
      }, 100200);
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
    <main className="min-h-screen h-svh bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Chatterkit</h1>
          <p className="mt-2 text-slate-600">
            FAQ mode demo using the reusable ChatBox component and floating
            widget launcher.
          </p>
        </div>
        <FaqModeExample />
        <PersistentFaqSessionsExample />
        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Composed embedded chatbot</h2>
          <p className="mt-2 text-slate-600">
            This example customizes the header, message bubbles, empty state,
            composer, input, and submit button icon.
          </p>
          <div className="mt-4">
            <ChatBox.Root
              mode="faq"
              title="Composed FAQ Assistant"
              faqItems={faqItems}
              fallbackResponse="I do not know that yet. Please contact support for help."
              className="h-[30rem] border-purple-100 shadow-xl"
            >
              <ChatBox.Header className="bg-purple-600 text-white">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                    🤖
                  </span>
                  <div>
                    <ChatBox.Title className="text-white" />
                    <p className="text-xs text-purple-100">
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
                        ? "bg-white text-purple-950"
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
                        "flex min-w-40 flex-col rounded-2xl border border-purple-200 bg-white text-left text-purple-950 shadow-sm hover:bg-purple-100",
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
        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Basic chatbot w/o styles</h2>
          <p className="mt-2 text-slate-600">
            This example customizes the header, message bubbles, empty state,
            composer, input, and submit button icon.
          </p>
          <div className="mt-4">
            <ChatBox.Root
              mode="faq"
              title="Im basic chatbot without styles"
              faqItems={faqItems}
              fallbackResponse="I do not know that yet. Please contact support for help."
              // className=""
            >
              <ChatBox.Header
              // className="bg-purple-600 text-white"
              >
                <div
                //  className="flex items-center gap-3"
                >
                  <span
                  // className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20"
                  >
                    🤖
                  </span>
                  <div>
                    <ChatBox.Title
                    //  className="text-white"
                    />
                    <p
                    // className="text-xs text-purple-100"
                    >
                      Compound component demo
                    </p>
                  </div>
                </div>
              </ChatBox.Header>
              <ChatBox.Messages
              // className="bg-purple-50"
              >
                {(message) => (
                  <ChatBox.MessageItem
                    message={message}
                    // className="items-end gap-2"
                    // bubbleClassName={
                    //   message.role === "bot"
                    //     ? "bg-white text-purple-950"
                    //     : "bg-purple-600 text-white"
                    // }
                  >
                    <span
                    // className="mr-2"
                    >
                      {message.role === "bot" ? "🤖" : "🧑"}
                    </span>
                    {message.content}
                  </ChatBox.MessageItem>
                )}
              </ChatBox.Messages>
              <ChatBox.FaqOptions
              // className="border-purple-100 bg-purple-50/80"
              >
                {(item, option) => (
                  <button
                    {...option.getButtonProps({
                      className: "",
                      // "flex min-w-40 flex-col rounded-2xl border border-purple-200 bg-white text-left text-purple-950 shadow-sm hover:bg-purple-100",
                    })}
                  >
                    <span
                    //  className="text-sm font-semibold"
                    >
                      💬 {item.question}
                    </span>
                  </button>
                )}
              </ChatBox.FaqOptions>
              <ChatBox.Loading
              // className="text-purple-500"
              >
                Checking the FAQ...
              </ChatBox.Loading>
              <ChatBox.Error
              // className="text-rose-600"
              >
                The assistant hit a custom error state.
              </ChatBox.Error>
              <ChatBox.Composer
              // className="border-purple-100"
              >
                <ChatBox.Input
                // className="focus:border-purple-500 focus:ring-purple-100"
                />
                <ChatBox.SubmitButton
                  // className="bg-purple-600 hover:bg-purple-700"
                  aria-label="Send message"
                >
                  ➤
                </ChatBox.SubmitButton>
              </ChatBox.Composer>
            </ChatBox.Root>
          </div>
        </section>
        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">
            Provider mode API simulation
          </h2>
          <p className="mt-2 text-slate-600">
            This demo uses adapter/provider mode and simulates a successful API
            request. Send any message to see the loading state and delayed API
            response.
          </p>
          <div className="mt-4">
            <ChatBox.Root
              mode="adapter"
              title="API Provider Demo"
              provider={simulatedApiProvider}
              metadata={{ demo: "provider-api-simulation" }}
              className="h-[30rem] border-sky-100 shadow-xl"
            >
              <ChatBox.Header className="bg-sky-600 text-white">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                    🌐
                  </span>
                  <div>
                    <ChatBox.Title className="text-white" />
                    <p className="text-xs text-sky-100">
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
                          ? "bg-white text-sky-950"
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
        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">FastAPI provider chatbot</h2>
          <p className="mt-2 text-slate-600">
            This adapter-mode demo calls your local FastAPI chatbot at{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">
              POST http://localhost:8000/chatbot
            </code>{" "}
            using the request shape <code>{"{ input_text: string }"}</code> and
            response shape <code>{"{ response: string }"}</code>.
          </p>
          <div className="mt-4">
            <ChatBox.Root
              mode="adapter"
              title="Local FastAPI Assistant"
              provider={fastApiProvider}
              initialMessages={messages}
              onMessagesChange={setMessages}
              metadata={{ demo: "fastapi-local-provider", sessionId }}
              errorLabel="The FastAPI chatbot request failed. Check that localhost:8000 is running and allows CORS."
              className="h-[30rem] border-emerald-100 shadow-xl"
            >
              <ChatBox.Header className="bg-emerald-600 text-white">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                    🧠
                  </span>
                  <div>
                    <ChatBox.Title className="text-white" />
                    <p className="text-xs text-emerald-100">
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
                          ? "bg-white text-emerald-950"
                          : "bg-emerald-600 text-white"
                      }
                    >
                      {/* <span className="mr-2">
                        {message.role === "bot" ? "🧠" : "🧑"}
                      </span> */}
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
        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Loading and error states</h2>
          <p className="mt-2 text-slate-600">
            Type any message and send it. The fake adapter waits for 1.5 seconds
            so the loading state appears, then throws an error so the error
            state appears.
          </p>
          <div className="mt-4">
            <ChatBox.Root
              mode="adapter"
              title="Loading/Error Demo"
              provider={failingDemoProvider}
              errorLabel="The assistant hit a custom error state."
              className="h-[30rem] border-rose-100 shadow-xl"
            >
              <ChatBox.Header className="bg-rose-600 text-white">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                    ⚠️
                  </span>
                  <div>
                    <ChatBox.Title className="text-white" />
                    <p className="text-xs text-rose-100">
                      Demo provider intentionally fails
                    </p>
                  </div>
                </div>
              </ChatBox.Header>
              <ChatBox.Messages className="bg-rose-50" />
              <ChatBox.Loading className="flex items-center gap-2 px-4 pb-2 text-purple-500">
                <span className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />
                Checking the FAQ...
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
        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Floating widget</h2>
          <p className="mt-2 text-slate-600">
            Use the chat bubble in the lower-right corner to open the same FAQ
            assistant as a floating panel.
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
        <ChatBoxWidget.Panel className="chatbot-panel-enter  items-stretch overflow-hidden rounded-3xl border border-purple-200 bg-white shadow-2xl">
          <ChatBoxWidget.ChatBox className="h-[30rem] rounded-none border-0 shadow-none">
            <ChatBox.Header className="bg-purple-600 text-white">
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                  🤖
                </span>
                <div>
                  <ChatBox.Title className="text-white" />
                  <p className="text-xs text-purple-100">
                    Compound component demo
                  </p>
                </div>
                <ChatBoxWidget.CloseButton className="bg-white/20 px-3 text-white shadow-none hover:bg-white/30">
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
                      ? "bg-white text-purple-950"
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
                      "rounded-2xl border-purple-200 bg-white px-4 py-2 text-purple-900 shadow-sm hover:bg-purple-100",
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
        <ChatBoxWidget.Launcher className="chatbot-launcher-attention bottom-5 bg-white-600 shadow-purple-300 transition-transform duration-300 hover:scale-110 hover:rotate-6 hover:bg-white-700">
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
