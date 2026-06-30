import { ChatBotComposer, ChatBotInput, ChatBotSubmitButton } from './ChatBotComposer';
import { ChatBotFaqOptions } from './ChatBotFaqOptions';
import { ChatBotHeader, ChatBotTitle } from './ChatBotHeader';
import { ChatBotMessageItem } from './ChatBotMessageItem';
import { ChatBotMessages } from './ChatBotMessages';
import { ChatBotPreset } from './ChatBotPreset';
import { ChatBotRoot } from './ChatBotRoot';
import { ChatBotEmpty, ChatBotError, ChatBotLoading } from './ChatBotState';
import type { ChatBotCompoundComponent } from './ChatBot.types';

export const ChatBot = Object.assign(ChatBotPreset, {
  Root: ChatBotRoot,
  Header: ChatBotHeader,
  Title: ChatBotTitle,
  Messages: ChatBotMessages,
  FaqOptions: ChatBotFaqOptions,
  MessageItem: ChatBotMessageItem,
  Empty: ChatBotEmpty,
  Loading: ChatBotLoading,
  Error: ChatBotError,
  Composer: ChatBotComposer,
  Input: ChatBotInput,
  SubmitButton: ChatBotSubmitButton,
}) satisfies ChatBotCompoundComponent;

export * from './ChatBot.types';
export { ChatBotRoot } from './ChatBotRoot';
export { ChatBotHeader, ChatBotTitle } from './ChatBotHeader';
export { ChatBotMessages } from './ChatBotMessages';
export { ChatBotFaqOptions, ChatBotPresetFaqOptions } from './ChatBotFaqOptions';
export { ChatBotMessageItem } from './ChatBotMessageItem';
export { ChatBotEmpty, ChatBotError, ChatBotLoading } from './ChatBotState';
export { ChatBotComposer, ChatBotInput, ChatBotSubmitButton } from './ChatBotComposer';
