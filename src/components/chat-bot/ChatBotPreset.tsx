import type { ChatBoxProps } from '../../types';
import { ChatBotComposer } from './ChatBotComposer';
import { ChatBotPresetFaqOptions } from './ChatBotFaqOptions';
import { ChatBotHeader } from './ChatBotHeader';
import { ChatBotMessages } from './ChatBotMessages';
import { ChatBotRoot } from './ChatBotRoot';
import { ChatBotError, ChatBotLoading } from './ChatBotState';

export function DefaultChatBotContent() {
  return (
    <>
      <ChatBotHeader />
      <ChatBotMessages />
      <ChatBotPresetFaqOptions />
      <ChatBotLoading />
      <ChatBotError />
      <ChatBotComposer />
    </>
  );
}

export function ChatBotPreset(props: ChatBoxProps) {
  return <ChatBotRoot {...props}>{props.children ?? <DefaultChatBotContent />}</ChatBotRoot>;
}
