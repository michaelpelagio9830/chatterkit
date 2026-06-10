import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChatBot, ChatBotWidget } from "../src";
import { FaqModeExample, faqItems } from "./faq-mode";
import "../src/style.css";

function Demo() {
  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Modular React Chatbot</h1>
          <p className="mt-2 text-slate-600">
            FAQ mode demo using the reusable ChatBot component and floating
            widget launcher.
          </p>
        </div>
        <FaqModeExample />
        <section className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-xl font-semibold">Composed embedded chatbot</h2>
          <p className="mt-2 text-slate-600">
            This example customizes the header, message bubbles, empty state,
            composer, input, and submit button icon.
          </p>
          <div className="mt-4">
            <ChatBot.Root
              mode="faq"
              title="Composed FAQ Assistant"
              faqItems={faqItems}
              fallbackResponse="I do not know that yet. Please contact support for help."
              className="h-[30rem] border-purple-100 shadow-xl"
            >
              <ChatBot.Header className="bg-purple-600 text-white">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                    🤖
                  </span>
                  <div>
                    <ChatBot.Title className="text-white" />
                    <p className="text-xs text-purple-100">
                      Compound component demo
                    </p>
                  </div>
                </div>
              </ChatBot.Header>
              <ChatBot.Messages className="bg-purple-50">
                {(message) => (
                  <ChatBot.MessageItem
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
                  </ChatBot.MessageItem>
                )}
              </ChatBot.Messages>
              <ChatBot.FaqOptions
                // label="Select a topic:"
                className="border-purple-100 bg-purple-50/80"
              >
                {(item) => `💬 ${item.question}`}
              </ChatBot.FaqOptions>
              <ChatBot.Loading className="text-purple-500">
                Checking the FAQ...
              </ChatBot.Loading>
              <ChatBot.Error className="text-rose-600">
                The assistant hit a custom error state.
              </ChatBot.Error>
              <ChatBot.Composer className="border-purple-100">
                <ChatBot.Input className="focus:border-purple-500 focus:ring-purple-100" />
                <ChatBot.SubmitButton
                  className="bg-purple-600 hover:bg-purple-700"
                  aria-label="Send message"
                >
                  ➤
                </ChatBot.SubmitButton>
              </ChatBot.Composer>
            </ChatBot.Root>
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

      <ChatBotWidget.Root
        mode="faq"
        title="Custom FAQ Assistant"
        faqItems={faqItems}
        fallbackResponse="I do not know that yet. Please contact support for help."
        launcherLabel="Open custom support chat"
        closeLabel="Minimize custom support chat"
        draggable
      >
        <ChatBotWidget.Panel className="items-stretch overflow-hidden rounded-3xl border border-purple-200 bg-white shadow-2xl">
          {/* <div className="flex items-center justify-between bg-purple-600 px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Custom Support</p>
              <p className="text-xs text-purple-100">Composed with ChatBotWidget slots</p>
            </div> */}
          {/* <ChatBotWidget.CloseButton className="bg-white/20 px-3 text-white shadow-none hover:bg-white/30">
              ×
            </ChatBotWidget.CloseButton> */}
          {/* </div> */}

          <ChatBotWidget.ChatBot className="h-[30rem] rounded-none border-0 shadow-none">
            <ChatBot.Header className="bg-purple-600 text-white">
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                  🤖
                </span>
                <div>
                  <ChatBot.Title className="text-white" />
                  <p className="text-xs text-purple-100">
                    Compound component demo
                  </p>
                </div>
                <ChatBotWidget.CloseButton className="bg-white/20 px-3 text-white shadow-none hover:bg-white/30">
                  ×
                </ChatBotWidget.CloseButton>
              </div>
            </ChatBot.Header>
            <ChatBot.Messages className="bg-purple-50">
              {(message) => (
                <ChatBot.MessageItem
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
                </ChatBot.MessageItem>
              )}
            </ChatBot.Messages>
            <ChatBot.FaqOptions
              label="Select a topic:"
              className="border-purple-100 bg-purple-50/80"
            >
              {(item) => `💬 ${item.question}`}
            </ChatBot.FaqOptions>
            <ChatBot.Composer>
              <ChatBot.Input className="focus:border-purple-500 focus:ring-purple-100" />
              <ChatBot.SubmitButton
                className="bg-purple-600 hover:bg-purple-700"
                aria-label="Send message"
              >
                ➤
              </ChatBot.SubmitButton>
            </ChatBot.Composer>
          </ChatBotWidget.ChatBot>
        </ChatBotWidget.Panel>
        <ChatBotWidget.Launcher className="bottom-24 bg-purple-600 shadow-purple-300 hover:bg-purple-700">
          ✨
        </ChatBotWidget.Launcher>
      </ChatBotWidget.Root>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
);
