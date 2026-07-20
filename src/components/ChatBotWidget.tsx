import {
  createContext,
  useContext,
  useState,
  type ComponentType,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { DefaultChatBotContent } from "./chat-bot/ChatBotPreset";
import { ChatBotRoot } from "./chat-bot/ChatBotRoot";
import {
  useChatBotWidget,
  type UseChatBotWidgetResult,
} from "../hooks/useChatBotWidget";
import { useChatbot } from "../hooks/useChatbot";
import type {
  ChatBotProps,
  ChatBotWidgetChatBotProps,
  ChatBotWidgetCloseButtonProps,
  ChatBotWidgetLauncherProps,
  ChatBotWidgetPanelProps,
  ChatBotWidgetProps,
  ChatBotWidgetRootProps,
} from "../types";
import { cn } from "../utils/cn";

interface ChatBotWidgetContextValue extends UseChatBotWidgetResult {
  chatBotProps: ChatBotProps;
  chatBotState: ReturnType<typeof useChatbot>;
  draftState: [string, Dispatch<SetStateAction<string>>];
  launcherLabel: string;
  closeLabel: string;
  launcherIcon: ReactNode;
  widgetClassNames: ChatBotWidgetProps["widgetClassNames"];
}

type ChatBotWidgetCompoundComponent = ComponentType<ChatBotWidgetProps> & {
  Root: ComponentType<ChatBotWidgetRootProps>;
  Launcher: ComponentType<ChatBotWidgetLauncherProps>;
  Panel: ComponentType<ChatBotWidgetPanelProps>;
  CloseButton: ComponentType<ChatBotWidgetCloseButtonProps>;
  ChatBox: ComponentType<ChatBotWidgetChatBotProps>;
  ChatBot: ComponentType<ChatBotWidgetChatBotProps>;
};

const ChatBotWidgetContext = createContext<ChatBotWidgetContextValue | null>(
  null,
);

function useChatBotWidgetContext(componentName: string) {
  const context = useContext(ChatBotWidgetContext);

  if (!context) {
    throw new Error(`${componentName} must be used within ChatBotWidget.Root.`);
  }

  return context;
}

function splitWidgetProps(props: ChatBotWidgetProps) {
  const {
    defaultOpen = false,
    draggable = false,
    launcherLabel = "Open chat",
    closeLabel = "Close chat",
    launcherIcon = "💬",
    className,
    widgetClassNames,
    ...chatBotProps
  } = props;

  return {
    defaultOpen,
    draggable,
    launcherLabel,
    closeLabel,
    launcherIcon,
    className,
    widgetClassNames,
    chatBotProps: chatBotProps as ChatBotProps,
  };
}

function ChatBotWidgetRoot(props: ChatBotWidgetRootProps) {
  const { children, ...widgetProps } = props;
  const {
    defaultOpen,
    draggable,
    launcherLabel,
    closeLabel,
    launcherIcon,
    className,
    widgetClassNames,
    chatBotProps,
  } = splitWidgetProps(widgetProps);
  const widget = useChatBotWidget({ defaultOpen, draggable });
  const chatBotState = useChatbot(chatBotProps);
  const draftState = useState("");

  return (
    <ChatBotWidgetContext.Provider
      value={{
        ...widget,
        chatBotProps,
        chatBotState,
        draftState,
        launcherLabel,
        closeLabel,
        launcherIcon,
        widgetClassNames,
      }}
    >
      <div
        className={cn(
          "chatterkit-root ck-fixed ck-inset-0 ck-z-50 ck-pointer-events-none ck-font-sans",
          className,
          widgetClassNames?.root,
        )}
      >
        {children}
      </div>
    </ChatBotWidgetContext.Provider>
  );
}

function ChatBotWidgetLauncher({
  children,
  className,
  style,
  onClick,
  ...buttonProps
}: ChatBotWidgetLauncherProps) {
  const {
    isOpen,
    draggable,
    launcherLabel,
    launcherIcon,
    launcherStyle,
    launcherHandlers,
    widgetClassNames,
  } = useChatBotWidgetContext("ChatBotWidget.Launcher");

  if (isOpen) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label={launcherLabel}
      {...buttonProps}
      {...launcherHandlers}
      onClick={(event) => {
        launcherHandlers.onClick();
        onClick?.(event);
      }}
      style={{ ...launcherStyle, ...style }}
      className={cn(
        "ck-pointer-events-auto ck-fixed ck-bottom-6 ck-right-6 ck-flex ck-h-14 ck-w-14 ck-items-center ck-justify-center ck-rounded-full ck-bg-slate-900 ck-text-2xl ck-text-white ck-shadow-xl ck-transition hover:ck-scale-105 hover:ck-bg-slate-700 focus:ck-outline-none focus:ck-ring-2 focus:ck-ring-slate-400 focus:ck-ring-offset-2",
        draggable &&
          "ck-bottom-auto ck-right-auto ck-cursor-grab ck-touch-none active:ck-cursor-grabbing",
        widgetClassNames?.launcher,
        className,
      )}
    >
      {children ?? launcherIcon}
    </button>
  );
}

function ChatBotWidgetPanel({
  children,
  className,
  style,
  ...divProps
}: ChatBotWidgetPanelProps) {
  const { isOpen, draggable, panelStyle, widgetClassNames } =
    useChatBotWidgetContext("ChatBotWidget.Panel");

  if (!isOpen) {
    return null;
  }

  return (
    <div
      data-testid="chatbot-widget-panel"
      {...divProps}
      style={{ ...panelStyle, ...style }}
      className={cn(
        "chatbot-panel-enter ck-pointer-events-auto ck-fixed ck-bottom-6 ck-right-6 ck-flex ck-w-[min(calc(100vw-3rem),28rem)] ck-flex-col ck-items-end ck-gap-2 ck-will-change-transform",
        draggable && "ck-bottom-auto ck-right-auto",
        widgetClassNames?.panel,
        className,
      )}
    >
      {children}
    </div>
  );
}

function ChatBotWidgetCloseButton({
  children,
  className,
  onClick,
  ...buttonProps
}: ChatBotWidgetCloseButtonProps) {
  const { close, closeLabel, widgetClassNames } = useChatBotWidgetContext(
    "ChatBotWidget.CloseButton",
  );

  return (
    <button
      type="button"
      aria-label={closeLabel}
      {...buttonProps}
      onClick={(event) => {
        close();
        onClick?.(event);
      }}
      className={cn(
        "ck-rounded-full ck-bg-slate-900 ck-px-3 ck-py-1 ck-text-sm ck-font-medium ck-text-white ck-shadow-lg ck-transition hover:ck-bg-slate-700 focus:ck-outline-none focus:ck-ring-2 focus:ck-ring-slate-400 focus:ck-ring-offset-2",
        widgetClassNames?.closeButton,
        className,
      )}
    >
      {children ?? "×"}
    </button>
  );
}

function ChatBotWidgetChatBot({
  children,
  className,
  classNames,
  ...sectionProps
}: ChatBotWidgetChatBotProps) {
  const { chatBotProps, chatBotState, draftState, widgetClassNames } =
    useChatBotWidgetContext("ChatBotWidget.ChatBot");

  return (
    <ChatBotRoot
      {...chatBotProps}
      {...sectionProps}
      chatbotState={chatBotState}
      draftState={draftState}
      className={cn(
        "ck-h-[min(32rem,calc(100vh-7rem))]",
        widgetClassNames?.chatBot,
        chatBotProps.className,
        className,
      )}
      classNames={{ ...chatBotProps.classNames, ...classNames }}
    >
      {children ?? <DefaultChatBotContent />}
    </ChatBotRoot>
  );
}

function ChatBotWidgetPreset(props: ChatBotWidgetProps) {
  return (
    <ChatBotWidgetRoot {...props}>
      <ChatBotWidgetPanel>
        <ChatBotWidgetCloseButton />
        <ChatBotWidgetChatBot />
      </ChatBotWidgetPanel>
      <ChatBotWidgetLauncher />
    </ChatBotWidgetRoot>
  );
}

export const ChatBotWidget = Object.assign(ChatBotWidgetPreset, {
  Root: ChatBotWidgetRoot,
  Launcher: ChatBotWidgetLauncher,
  Panel: ChatBotWidgetPanel,
  CloseButton: ChatBotWidgetCloseButton,
  ChatBox: ChatBotWidgetChatBot,
  ChatBot: ChatBotWidgetChatBot,
}) satisfies ChatBotWidgetCompoundComponent;

/** Preferred ChatBox-aligned name. `ChatBotWidget` remains available for backwards compatibility. */
export const ChatBoxWidget = ChatBotWidget;
