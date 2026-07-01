import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { ChatBot } from "./ChatBot";
import { ChatBotWidget } from "./ChatBotWidget";

const DEFAULT_VIEWPORT = {
  width: window.innerWidth,
  height: window.innerHeight,
};

function setViewport(width: number, height: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  });
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    writable: true,
    value: height,
  });
}

function installPointerCapture(element: Element) {
  const pointerElement = element as Element & {
    setPointerCapture: (pointerId: number) => void;
    releasePointerCapture: (pointerId: number) => void;
    hasPointerCapture: (pointerId: number) => boolean;
  };

  pointerElement.setPointerCapture = () => undefined;
  pointerElement.releasePointerCapture = () => undefined;
  pointerElement.hasPointerCapture = () => true;
}

function dragLauncherTo(
  element: Element,
  target: { x: number; y: number },
  start = { x: 100, y: 100 },
) {
  const launcher = element as HTMLElement;
  const startLeft = Number.parseFloat(launcher.style.left || "0");
  const startTop = Number.parseFloat(launcher.style.top || "0");

  firePointerEvent(element, "pointerdown", {
    pointerId: 1,
    clientX: start.x,
    clientY: start.y,
  });
  firePointerEvent(element, "pointermove", {
    pointerId: 1,
    clientX: start.x + target.x - startLeft,
    clientY: start.y + target.y - startTop,
  });
  firePointerEvent(element, "pointerup", {
    pointerId: 1,
    clientX: start.x + target.x - startLeft,
    clientY: start.y + target.y - startTop,
  });
}

function firePointerEvent(
  element: Element,
  type: "pointerdown" | "pointermove" | "pointerup",
  init: { pointerId: number; clientX: number; clientY: number },
) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    pointerId: { value: init.pointerId },
    clientX: { value: init.clientX },
    clientY: { value: init.clientY },
  });

  fireEvent(element, event);
}

describe("ChatBotWidget", () => {
  afterEach(() => {
    setViewport(DEFAULT_VIEWPORT.width, DEFAULT_VIEWPORT.height);
  });
  it("renders a collapsed lower-right launcher by default", () => {
    render(<ChatBotWidget mode="faq" faqItems={[]} title="Support bot" />);

    const launcher = screen.getByRole("button", { name: "Open chat" });

    expect(launcher).toBeInTheDocument();
    expect(launcher).toHaveClass(
      "fixed",
      "bottom-6",
      "right-6",
      "rounded-full",
    );
    expect(
      screen.queryByRole("region", { name: "Support bot" }),
    ).not.toBeInTheDocument();
  });

  it("opens and closes the chat panel from the launcher controls", () => {
    render(<ChatBotWidget mode="faq" faqItems={[]} title="Support bot" />);

    fireEvent.click(screen.getByRole("button", { name: "Open chat" }));

    expect(
      screen.getByRole("region", { name: "Support bot" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close chat" }));

    expect(
      screen.queryByRole("region", { name: "Support bot" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open chat" }),
    ).toBeInTheDocument();
  });

  it("preserves conversation state when the chat panel is closed and reopened", async () => {
    render(
      <ChatBotWidget
        mode="faq"
        faqItems={[{ question: "Status", answer: "All systems operational." }]}
        title="Support bot"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Status" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(
      await screen.findByText("All systems operational."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close chat" }));
    expect(
      screen.queryByText("All systems operational."),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open chat" }));

    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("All systems operational.")).toBeInTheDocument();
  });

  it("preserves draft text when the chat panel is closed and reopened", () => {
    render(<ChatBotWidget mode="faq" faqItems={[]} title="Support bot" />);

    fireEvent.click(screen.getByRole("button", { name: "Open chat" }));
    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Uns sent draft" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Close chat" }));
    fireEvent.click(screen.getByRole("button", { name: "Open chat" }));

    expect(screen.getByLabelText("Message")).toHaveValue("Uns sent draft");
  });

  it("can render the chat panel open initially", () => {
    render(
      <ChatBotWidget
        mode="faq"
        faqItems={[]}
        title="Support bot"
        defaultOpen
      />,
    );

    expect(
      screen.getByRole("region", { name: "Support bot" }),
    ).toBeInTheDocument();
  });

  it("renders deterministic draggable coordinates before client effects run", () => {
    const markup = renderToString(
      <ChatBotWidget mode="faq" faqItems={[]} title="Support bot" draggable />,
    );

    expect(markup).toContain("left:24px");
    expect(markup).toContain("top:24px");
  });

  it("supports custom launcher labels and icons", () => {
    render(
      <ChatBotWidget
        mode="faq"
        faqItems={[]}
        launcherLabel="Open support"
        closeLabel="Minimize support"
        launcherIcon="?"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Open support" }),
    ).toHaveTextContent("?");
  });

  it("supports custom composed widget designs", () => {
    render(
      <ChatBotWidget.Root
        mode="faq"
        faqItems={[]}
        title="Composed support"
        defaultOpen
      >
        <ChatBotWidget.Panel className="custom-panel">
          <div className="custom-header">
            <span>Custom Support</span>
            <ChatBotWidget.CloseButton className="custom-close">
              Minimize
            </ChatBotWidget.CloseButton>
          </div>
          <ChatBotWidget.ChatBot
            className="custom-chat"
            classNames={{
              header: "hidden",
              messages: "custom-messages",
            }}
          />
        </ChatBotWidget.Panel>
        <ChatBotWidget.Launcher className="custom-launcher">
          ✨
        </ChatBotWidget.Launcher>
      </ChatBotWidget.Root>,
    );

    const panel = screen.getByTestId("chatbot-widget-panel");
    expect(panel).toHaveClass("custom-panel");
    expect(screen.getByText("Custom Support")).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Composed support" }),
    ).toHaveClass("custom-chat");

    fireEvent.click(screen.getByRole("button", { name: "Close chat" }));

    expect(
      screen.queryByRole("region", { name: "Composed support" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open chat" })).toHaveClass(
      "custom-launcher",
    );
    expect(screen.getByRole("button", { name: "Open chat" })).toHaveTextContent(
      "✨",
    );
  });

  it("bridges widget mode props into custom ChatBot children", async () => {
    render(
      <ChatBotWidget.Root
        mode="faq"
        faqItems={[{ question: "Status", answer: "All systems operational." }]}
        title="Widget custom bot"
        defaultOpen
      >
        <ChatBotWidget.Panel>
          <ChatBotWidget.ChatBot>
            <ChatBot.Header className="hidden" />
            <ChatBot.Messages>
              {(message) => (
                <ChatBot.MessageItem message={message}>
                  <span>{message.role === "bot" ? "🤖" : "🧑"}</span>
                  {message.content}
                </ChatBot.MessageItem>
              )}
            </ChatBot.Messages>
            <ChatBot.Composer>
              <ChatBot.Input />
              <ChatBot.SubmitButton>Send ✨</ChatBot.SubmitButton>
            </ChatBot.Composer>
          </ChatBotWidget.ChatBot>
        </ChatBotWidget.Panel>
        <ChatBotWidget.Launcher />
      </ChatBotWidget.Root>,
    );

    fireEvent.change(screen.getByLabelText("Message"), {
      target: { value: "Status" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send ✨" }));

    expect(
      await screen.findByText("All systems operational."),
    ).toBeInTheDocument();
    expect(screen.getByText("🤖")).toBeInTheDocument();
  });

  it("moves a draggable launcher without opening the panel", () => {
    render(
      <ChatBotWidget mode="faq" faqItems={[]} title="Support bot" draggable />,
    );

    const launcher = screen.getByRole("button", { name: "Open chat" });
    installPointerCapture(launcher);

    firePointerEvent(launcher, "pointerdown", {
      pointerId: 1,
      clientX: 100,
      clientY: 100,
    });
    firePointerEvent(launcher, "pointermove", {
      pointerId: 1,
      clientX: -2000,
      clientY: -2000,
    });
    firePointerEvent(launcher, "pointerup", {
      pointerId: 1,
      clientX: -2000,
      clientY: -2000,
    });
    fireEvent.click(launcher);

    expect(
      screen.queryByRole("region", { name: "Support bot" }),
    ).not.toBeInTheDocument();
    expect(launcher).toHaveStyle({ left: "24px", top: "24px" });
  });

  it("opens a draggable panel from the dragged launcher position", () => {
    render(
      <ChatBotWidget mode="faq" faqItems={[]} title="Support bot" draggable />,
    );

    const launcher = screen.getByRole("button", { name: "Open chat" });
    installPointerCapture(launcher);

    firePointerEvent(launcher, "pointerdown", {
      pointerId: 1,
      clientX: 100,
      clientY: 100,
    });
    firePointerEvent(launcher, "pointermove", {
      pointerId: 1,
      clientX: -2000,
      clientY: -2000,
    });
    firePointerEvent(launcher, "pointerup", {
      pointerId: 1,
      clientX: -2000,
      clientY: -2000,
    });
    fireEvent.click(launcher);
    fireEvent.click(launcher);

    expect(
      screen.getByRole("region", { name: "Support bot" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("chatbot-widget-panel")).toHaveStyle({
      left: "92px",
      top: "92px",
    });
  });

  it("smart positions a draggable panel adjacent to a centered launcher", () => {
    setViewport(1200, 900);
    render(
      <ChatBotWidget mode="faq" faqItems={[]} title="Support bot" draggable />,
    );

    const launcher = screen.getByRole("button", { name: "Open chat" });
    installPointerCapture(launcher);

    dragLauncherTo(launcher, { x: 500, y: 300 });
    fireEvent.click(launcher);
    fireEvent.click(launcher);

    const panel = screen.getByTestId("chatbot-widget-panel");
    expect(panel).toHaveStyle({ left: "568px", top: "292px" });
    expect(panel.style.transformOrigin).toBe("0px 36px");
    expect(panel).toHaveStyle({
      maxWidth: "calc(100vw - 48px)",
      maxHeight: "calc(100vh - 48px)",
    });
  });

  it("clamps smart draggable panel placement near viewport edges", () => {
    setViewport(1024, 768);
    render(
      <ChatBotWidget mode="faq" faqItems={[]} title="Support bot" draggable />,
    );

    const launcher = screen.getByRole("button", { name: "Open chat" });
    installPointerCapture(launcher);

    dragLauncherTo(launcher, { x: 24, y: 24 });
    fireEvent.click(launcher);
    fireEvent.click(launcher);

    const panel = screen.getByTestId("chatbot-widget-panel");
    expect(panel).toHaveStyle({ left: "92px", top: "92px" });
    expect(panel.style.transformOrigin).toBe("0px 0px");
  });

  it("keeps draggable panel placement inside a small viewport", () => {
    setViewport(360, 360);
    render(
      <ChatBotWidget mode="faq" faqItems={[]} title="Support bot" draggable />,
    );

    const launcher = screen.getByRole("button", { name: "Open chat" });
    installPointerCapture(launcher);

    dragLauncherTo(launcher, { x: 280, y: 280 });
    fireEvent.click(launcher);
    fireEvent.click(launcher);

    const panel = screen.getByTestId("chatbot-widget-panel");
    expect(panel).toHaveStyle({
      left: "24px",
      top: "24px",
      maxWidth: "calc(100vw - 48px)",
    });
  });

  it("adds default panel animation classes while preserving custom panel overrides", () => {
    render(
      <ChatBotWidget.Root
        mode="faq"
        faqItems={[]}
        title="Animated support"
        defaultOpen
        widgetClassNames={{ panel: "panel-token" }}
      >
        <ChatBotWidget.Panel className="custom-panel" style={{ opacity: 0.95 }}>
          <ChatBotWidget.CloseButton />
          <ChatBotWidget.ChatBot />
        </ChatBotWidget.Panel>
        <ChatBotWidget.Launcher />
      </ChatBotWidget.Root>,
    );

    const panel = screen.getByTestId("chatbot-widget-panel");
    expect(panel).toHaveClass(
      "chatbot-panel-enter",
      "panel-token",
      "custom-panel",
    );
    expect(panel).toHaveStyle({ opacity: "0.95" });
  });
});
