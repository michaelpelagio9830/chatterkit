import { createContext, useContext, type ComponentType, type ReactNode } from 'react';
import { ChatBot as BaseChatBot } from './ChatBot';
import { useChatBotWidget, type UseChatBotWidgetResult } from '../hooks/useChatBotWidget';
import type {
  ChatBotProps,
  ChatBotWidgetChatBotProps,
  ChatBotWidgetCloseButtonProps,
  ChatBotWidgetLauncherProps,
  ChatBotWidgetPanelProps,
  ChatBotWidgetProps,
  ChatBotWidgetRootProps,
} from '../types';
import { cn } from '../utils/cn';

interface ChatBotWidgetContextValue extends UseChatBotWidgetResult {
  chatBotProps: ChatBotProps;
  launcherLabel: string;
  closeLabel: string;
  launcherIcon: ReactNode;
  widgetClassNames: ChatBotWidgetProps['widgetClassNames'];
}

type ChatBotWidgetCompoundComponent = ComponentType<ChatBotWidgetProps> & {
  Root: ComponentType<ChatBotWidgetRootProps>;
  Launcher: ComponentType<ChatBotWidgetLauncherProps>;
  Panel: ComponentType<ChatBotWidgetPanelProps>;
  CloseButton: ComponentType<ChatBotWidgetCloseButtonProps>;
  ChatBot: ComponentType<ChatBotWidgetChatBotProps>;
};

const ChatBotWidgetContext = createContext<ChatBotWidgetContextValue | null>(null);

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
    launcherLabel = 'Open chat',
    closeLabel = 'Close chat',
    launcherIcon = '💬',
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
  const { defaultOpen, draggable, launcherLabel, closeLabel, launcherIcon, className, widgetClassNames, chatBotProps } =
    splitWidgetProps(widgetProps);
  const widget = useChatBotWidget({ defaultOpen, draggable });

  return (
    <ChatBotWidgetContext.Provider
      value={{
        ...widget,
        chatBotProps,
        launcherLabel,
        closeLabel,
        launcherIcon,
        widgetClassNames,
      }}
    >
      <div className={cn('fixed inset-0 z-50 pointer-events-none', className, widgetClassNames?.root)}>{children}</div>
    </ChatBotWidgetContext.Provider>
  );
}

function ChatBotWidgetLauncher({ children, className, style, onClick, ...buttonProps }: ChatBotWidgetLauncherProps) {
  const { isOpen, draggable, launcherLabel, launcherIcon, launcherStyle, launcherHandlers, widgetClassNames } =
    useChatBotWidgetContext('ChatBotWidget.Launcher');

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
        'pointer-events-auto fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-2xl text-white shadow-xl transition hover:scale-105 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
        draggable && 'bottom-auto right-auto cursor-grab touch-none active:cursor-grabbing',
        widgetClassNames?.launcher,
        className,
      )}
    >
      {children ?? launcherIcon}
    </button>
  );
}

function ChatBotWidgetPanel({ children, className, style, ...divProps }: ChatBotWidgetPanelProps) {
  const { isOpen, draggable, panelStyle, widgetClassNames } = useChatBotWidgetContext('ChatBotWidget.Panel');

  if (!isOpen) {
    return null;
  }

  return (
    <div
      data-testid="chatbot-widget-panel"
      {...divProps}
      style={{ ...panelStyle, ...style }}
      className={cn(
        'pointer-events-auto fixed bottom-6 right-6 flex w-[min(calc(100vw-3rem),28rem)] flex-col items-end gap-2',
        draggable && 'bottom-auto right-auto',
        widgetClassNames?.panel,
        className,
      )}
    >
      {children}
    </div>
  );
}

function ChatBotWidgetCloseButton({ children, className, onClick, ...buttonProps }: ChatBotWidgetCloseButtonProps) {
  const { close, closeLabel, widgetClassNames } = useChatBotWidgetContext('ChatBotWidget.CloseButton');

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
        'rounded-full bg-slate-900 px-3 py-1 text-sm font-medium text-white shadow-lg transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
        widgetClassNames?.closeButton,
        className,
      )}
    >
      {children ?? '×'}
    </button>
  );
}

function ChatBotWidgetChatBot({ children, className, classNames }: ChatBotWidgetChatBotProps) {
  const { chatBotProps, widgetClassNames } = useChatBotWidgetContext('ChatBotWidget.ChatBot');

  return (
    <BaseChatBot
      {...chatBotProps}
      className={cn('h-[min(32rem,calc(100vh-7rem))]', widgetClassNames?.chatBot, chatBotProps.className, className)}
      classNames={{ ...chatBotProps.classNames, ...classNames }}
    >
      {children}
    </BaseChatBot>
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
  ChatBot: ChatBotWidgetChatBot,
}) satisfies ChatBotWidgetCompoundComponent;
