import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ChatBox, ChatBoxWidget } from "../src";
import type { FaqItem } from "../src";
import "../src/style.css";

const faqItems: FaqItem[] = [
  {
    question: "What is Chatterkit?",
    answer:
      "Chatterkit is a reusable React + TypeScript chatbox and floating chat widget library.",
    keywords: ["chatterkit", "what", "library"],
  },
  {
    question: "Can I customize the UI?",
    answer:
      "Yes. Use the compound components like `ChatBox.Root`, `ChatBox.Messages`, and `ChatBoxWidget.ChatBox` to customize the layout.",
    keywords: ["customize", "ui", "style", "compound"],
  },
  {
    question: "Does it support floating widgets?",
    answer:
      "Yes. Use `ChatBoxWidget` for a lower-right floating launcher and panel. The launcher can also be draggable.",
    keywords: ["widget", "floating", "launcher", "draggable"],
  },
];

function CodeSandboxDemo() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-950">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-600">
            Chatterkit Demo
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            React chatbox and floating widget components
          </h1>
          <p className="mx-auto max-w-2xl text-base text-slate-600">
            This CodeSandbox-ready demo imports directly from the local repo
            source. Try the embedded FAQ chatbox below, then open the floating
            widget in the lower-right corner.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold">Embedded ChatBox</h2>
              <p className="mt-1 text-sm text-slate-600">
                Use the preset when the default layout is enough.
              </p>
            </div>

            <ChatBox
              mode="faq"
              title="FAQ Assistant"
              faqItems={faqItems}
              showFaqOptions
              faqOptionsLabel="Try a question:"
              fallbackResponse="I do not know that yet. Try one of the FAQ buttons."
              className="h-[32rem]"
            />
          </div>

          <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-xl shadow-purple-100">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold">Composable API</h2>
              <p className="mt-1 text-sm text-slate-600">
                Use compound slots when you want custom structure and styles.
              </p>
            </div>

            <ChatBox.Root
              mode="faq"
              title="Custom Support"
              faqItems={faqItems}
              fallbackResponse="Please select one of the suggested topics."
              className="h-[32rem] overflow-hidden border-purple-100 shadow-none"
            >
              <ChatBox.Header className="bg-purple-600 text-white">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                    ✨
                  </span>
                  <div>
                    <ChatBox.Title className="text-white" />
                    <p className="text-xs text-purple-100">
                      Built with compound slots
                    </p>
                  </div>
                </div>
              </ChatBox.Header>
              <ChatBox.Messages className="bg-purple-50" />
              <ChatBox.FaqOptions className="border-purple-100 bg-purple-50/80" />
              <ChatBox.Composer className="border-purple-100">
                <ChatBox.Input className="focus:border-purple-500 focus:ring-purple-100" />
                <ChatBox.SubmitButton className="bg-purple-600 hover:bg-purple-700">
                  Send
                </ChatBox.SubmitButton>
              </ChatBox.Composer>
            </ChatBox.Root>
          </div>
        </section>
      </div>

      <ChatBoxWidget
        mode="faq"
        title="Floating Support"
        faqItems={faqItems}
        launcherLabel="Open Chatterkit demo chat"
        closeLabel="Close Chatterkit demo chat"
        launcherIcon="💬"
        showFaqOptions
        draggable
      />
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CodeSandboxDemo />
  </StrictMode>,
);