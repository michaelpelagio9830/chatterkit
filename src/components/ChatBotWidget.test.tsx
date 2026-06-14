import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ChatBot } from './ChatBot';
import { ChatBotWidget } from './ChatBotWidget';

function firePointerEvent(
  element: Element,
  type: 'pointerdown' | 'pointermove' | 'pointerup',
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

describe('ChatBotWidget', () => {
  it('renders a collapsed lower-right launcher by default', () => {
    render(<ChatBotWidget mode="faq" faqItems={[]} title="Support bot" />);

    const launcher = screen.getByRole('button', { name: 'Open chat' });

    expect(launcher).toBeInTheDocument();
    expect(launcher).toHaveClass('fixed', 'bottom-6', 'right-6', 'rounded-full');
    expect(screen.queryByRole('region', { name: 'Support bot' })).not.toBeInTheDocument();
  });

  it('opens and closes the chat panel from the launcher controls', () => {
    render(<ChatBotWidget mode="faq" faqItems={[]} title="Support bot" />);

    fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));

    expect(screen.getByRole('region', { name: 'Support bot' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close chat' }));

    expect(screen.queryByRole('region', { name: 'Support bot' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open chat' })).toBeInTheDocument();
  });

  it('preserves conversation state when the chat panel is closed and reopened', async () => {
    render(
      <ChatBotWidget
        mode="faq"
        faqItems={[{ question: 'Status', answer: 'All systems operational.' }]}
        title="Support bot"
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Status' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByText('All systems operational.')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close chat' }));
    expect(screen.queryByText('All systems operational.')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));

    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('All systems operational.')).toBeInTheDocument();
  });

  it('preserves draft text when the chat panel is closed and reopened', () => {
    render(<ChatBotWidget mode="faq" faqItems={[]} title="Support bot" />);

    fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));
    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Uns sent draft' } });
    fireEvent.click(screen.getByRole('button', { name: 'Close chat' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open chat' }));

    expect(screen.getByLabelText('Message')).toHaveValue('Uns sent draft');
  });

  it('can render the chat panel open initially', () => {
    render(<ChatBotWidget mode="faq" faqItems={[]} title="Support bot" defaultOpen />);

    expect(screen.getByRole('region', { name: 'Support bot' })).toBeInTheDocument();
  });

  it('renders deterministic draggable coordinates before client effects run', () => {
    const markup = renderToString(<ChatBotWidget mode="faq" faqItems={[]} title="Support bot" draggable />);

    expect(markup).toContain('left:24px');
    expect(markup).toContain('top:24px');
  });

  it('supports custom launcher labels and icons', () => {
    render(
      <ChatBotWidget
        mode="faq"
        faqItems={[]}
        launcherLabel="Open support"
        closeLabel="Minimize support"
        launcherIcon="?"
      />,
    );

    expect(screen.getByRole('button', { name: 'Open support' })).toHaveTextContent('?');
  });

  it('supports custom composed widget designs', () => {
    render(
      <ChatBotWidget.Root mode="faq" faqItems={[]} title="Composed support" defaultOpen>
        <ChatBotWidget.Panel className="custom-panel">
          <div className="custom-header">
            <span>Custom Support</span>
            <ChatBotWidget.CloseButton className="custom-close">Minimize</ChatBotWidget.CloseButton>
          </div>
          <ChatBotWidget.ChatBot
            className="custom-chat"
            classNames={{
              header: 'hidden',
              messages: 'custom-messages',
            }}
          />
        </ChatBotWidget.Panel>
        <ChatBotWidget.Launcher className="custom-launcher">✨</ChatBotWidget.Launcher>
      </ChatBotWidget.Root>,
    );

    const panel = screen.getByTestId('chatbot-widget-panel');
    expect(panel).toHaveClass('custom-panel');
    expect(screen.getByText('Custom Support')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Composed support' })).toHaveClass('custom-chat');

    fireEvent.click(screen.getByRole('button', { name: 'Close chat' }));

    expect(screen.queryByRole('region', { name: 'Composed support' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open chat' })).toHaveClass('custom-launcher');
    expect(screen.getByRole('button', { name: 'Open chat' })).toHaveTextContent('✨');
  });

  it('bridges widget mode props into custom ChatBot children', async () => {
    render(
      <ChatBotWidget.Root
        mode="faq"
        faqItems={[{ question: 'Status', answer: 'All systems operational.' }]}
        title="Widget custom bot"
        defaultOpen
      >
        <ChatBotWidget.Panel>
          <ChatBotWidget.ChatBot>
            <ChatBot.Header className="hidden" />
            <ChatBot.Messages>
              {(message) => (
                <ChatBot.MessageItem message={message}>
                  <span>{message.role === 'bot' ? '🤖' : '🧑'}</span>
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

    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Status' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send ✨' }));

    expect(await screen.findByText('All systems operational.')).toBeInTheDocument();
    expect(screen.getByText('🤖')).toBeInTheDocument();
  });

  it('moves a draggable launcher without opening the panel', () => {
    render(<ChatBotWidget mode="faq" faqItems={[]} title="Support bot" draggable />);

    const launcher = screen.getByRole('button', { name: 'Open chat' });
    launcher.setPointerCapture = () => undefined;
    launcher.releasePointerCapture = () => undefined;
    launcher.hasPointerCapture = () => true;

    firePointerEvent(launcher, 'pointerdown', { pointerId: 1, clientX: 100, clientY: 100 });
    firePointerEvent(launcher, 'pointermove', { pointerId: 1, clientX: -2000, clientY: -2000 });
    firePointerEvent(launcher, 'pointerup', { pointerId: 1, clientX: -2000, clientY: -2000 });
    fireEvent.click(launcher);

    expect(screen.queryByRole('region', { name: 'Support bot' })).not.toBeInTheDocument();
    expect(launcher).toHaveStyle({ left: '24px', top: '24px' });
  });

  it('opens a draggable panel from the dragged launcher position', () => {
    render(<ChatBotWidget mode="faq" faqItems={[]} title="Support bot" draggable />);

    const launcher = screen.getByRole('button', { name: 'Open chat' });
    launcher.setPointerCapture = () => undefined;
    launcher.releasePointerCapture = () => undefined;
    launcher.hasPointerCapture = () => true;

    firePointerEvent(launcher, 'pointerdown', { pointerId: 1, clientX: 100, clientY: 100 });
    firePointerEvent(launcher, 'pointermove', { pointerId: 1, clientX: -2000, clientY: -2000 });
    firePointerEvent(launcher, 'pointerup', { pointerId: 1, clientX: -2000, clientY: -2000 });
    fireEvent.click(launcher);
    fireEvent.click(launcher);

    expect(screen.getByRole('region', { name: 'Support bot' })).toBeInTheDocument();
    expect(screen.getByTestId('chatbot-widget-panel')).toHaveStyle({ left: '24px', top: '24px' });
  });
});