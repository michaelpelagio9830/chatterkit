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
    <main className="ck-min-h-screen ck-bg-slate-100 ck-px-6 ck-py-10 ck-text-slate-950">
      <div className="ck-mx-auto ck-max-w-5xl ck-space-y-8">
        <header className="ck-space-y-3 ck-text-center">
          <p className="ck-text-sm ck-font-semibold ck-uppercase ck-tracking-[0.3em] ck-text-purple-600">
            Chatterkit Demo
          </p>
          <h1 className="ck-text-4xl ck-font-bold ck-tracking-tight sm:ck-text-5xl">
            React chatbox and floating widget components
          </h1>
          <p className="ck-mx-auto ck-max-w-2xl ck-text-base ck-text-slate-600">
            This CodeSandbox-ready demo imports directly from the local repo
            source. Try the embedded FAQ chatbox below, then open the floating
            widget in the lower-right corner.
          </p>
        </header>

        <section className="ck-grid ck-gap-6 lg:ck-grid-cols-[1fr_0.9fr]">
          <div className="ck-rounded-3xl ck-bg-white ck-p-6 ck-shadow-xl ck-shadow-slate-200">
            <div className="ck-mb-4">
              <h2 className="ck-text-2xl ck-font-semibold">Embedded ChatBox</h2>
              <p className="ck-mt-1 ck-text-sm ck-text-slate-600">
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
              className="ck-h-[32rem]"
            />
          </div>

          <div className="ck-rounded-3xl ck-border ck-border-purple-100 ck-bg-white ck-p-6 ck-shadow-xl ck-shadow-purple-100">
            <div className="ck-mb-4">
              <h2 className="ck-text-2xl ck-font-semibold">Composable API</h2>
              <p className="ck-mt-1 ck-text-sm ck-text-slate-600">
                Use compound slots when you want custom structure and styles.
              </p>
            </div>

            <ChatBox.Root
              mode="faq"
              title="Custom Support"
              faqItems={faqItems}
              fallbackResponse="Please select one of the suggested topics."
              className="ck-h-[32rem] ck-overflow-hidden ck-border-purple-100 ck-shadow-none"
            >
              <ChatBox.Header className="ck-bg-purple-600 ck-text-white">
                <div className="ck-flex ck-items-center ck-gap-3">
                  <span className="ck-flex ck-h-9 ck-w-9 ck-items-center ck-justify-center ck-rounded-full ck-bg-white/20">
                    ✨
                  </span>
                  <div>
                    <ChatBox.Title className="ck-text-white" />
                    <p className="ck-text-xs ck-text-purple-100">
                      Built with compound slots
                    </p>
                  </div>
                </div>
              </ChatBox.Header>
              <ChatBox.Messages className="ck-bg-purple-50" />
              <ChatBox.FaqOptions className="ck-border-purple-100 ck-bg-purple-50/80" />
              <ChatBox.Composer className="ck-border-purple-100">
                <ChatBox.Input className="focus:ck-border-purple-500 focus:ck-ring-purple-100" />
                <ChatBox.SubmitButton className="ck-bg-purple-600 hover:ck-bg-purple-700">
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