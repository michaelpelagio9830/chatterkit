import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ChatBot } from './ChatBot';

describe('ChatBot', () => {
  it('renders the default chatbot UI', () => {
    render(<ChatBot mode="faq" faqItems={[]} title="Support bot" />);

    expect(screen.getByRole('region', { name: 'Support bot' })).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });

  it('submits messages through the composer and displays FAQ responses', async () => {
    render(
      <ChatBot
        mode="faq"
        faqItems={[{ question: 'What is your pricing?', answer: 'Pricing is flexible.' }]}
      />,
    );

    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'What is your pricing?' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByText('Pricing is flexible.')).toBeInTheDocument();
  });

  it('renders markdown message content with safe links and without executing raw HTML', async () => {
    render(
      <ChatBot
        mode="faq"
        faqItems={[
          {
            question: 'Markdown',
            answer:
              '## Markdown help\n\nUse **bold** text, `inline code`, and visit https://example.com.\n\n<script>alert("xss")</script>',
          },
        ]}
      />,
    );

    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Markdown' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByRole('heading', { name: 'Markdown help' })).toBeInTheDocument();
    expect(screen.getByText('bold').tagName).toBe('STRONG');
    expect(screen.getByText('inline code').tagName).toBe('CODE');

    const urlLink = screen.getByRole('link', { name: 'https://example.com' });
    expect(urlLink).toHaveAttribute('href', 'https://example.com');
    expect(urlLink).toHaveAttribute('target', '_blank');
    expect(urlLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(document.querySelector('script')).not.toBeInTheDocument();
  });

  it('preserves custom message children without markdown parsing arbitrary React nodes', async () => {
    render(
      <ChatBot.Root
        mode="faq"
        faqItems={[{ question: 'Custom children', answer: '**Not parsed**' }]}
      >
        <ChatBot.Messages>
          {(message) => (
            <ChatBot.MessageItem message={message}>
              <span data-testid={`custom-${message.role}`}>{message.content}</span>
            </ChatBot.MessageItem>
          )}
        </ChatBot.Messages>
        <ChatBot.Composer />
      </ChatBot.Root>,
    );

    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Custom children' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    const botMessage = await screen.findByTestId('custom-bot');
    expect(botMessage).toHaveTextContent('**Not parsed**');
    expect(botMessage.querySelector('strong')).not.toBeInTheDocument();
  });

  it('renders direct string children as markdown in custom message layouts', async () => {
    render(
      <ChatBot.Root
        mode="faq"
        faqItems={[{ question: 'Direct markdown children', answer: '**Parsed child** with `code`' }]}
      >
        <ChatBot.Messages>
          {(message) => (
            <ChatBot.MessageItem message={message}>
              <span data-testid={`icon-${message.role}`}>{message.role === 'bot' ? '🤖' : '🧑'}</span>
              {message.content}
            </ChatBot.MessageItem>
          )}
        </ChatBot.Messages>
        <ChatBot.Composer />
      </ChatBot.Root>,
    );

    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Direct markdown children' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByText('Parsed child')).toHaveTextContent('Parsed child');
    expect(screen.getByText('Parsed child').tagName).toBe('STRONG');
    expect(screen.getByText('code').tagName).toBe('CODE');
    expect(screen.getByTestId('icon-bot')).toHaveTextContent('🤖');
  });

  it('renders clickable FAQ option badges and submits the selected question', async () => {
    render(
      <ChatBot
        mode="faq"
        title="Support bot"
        showFaqOptions
        faqOptionsLabel="What do you need help with?"
        faqItems={[
          { id: 'contact', question: 'Contact Us', answer: 'Email support@example.com.' },
          { id: 'how-tos', question: "How to's", answer: 'Open the help center for step-by-step guides.' },
        ]}
      />,
    );

    expect(screen.getByText('What do you need help with?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Contact Us' }));

    const emailLink = await screen.findByRole('link', { name: 'support@example.com' });
    expect(emailLink.closest('div')).toHaveTextContent('Email support@example.com.');
    expect(emailLink).toHaveAttribute(
      'href',
      'mailto:support@example.com',
    );
    expect(screen.getAllByText('Contact Us')).toHaveLength(2);
  });

  it('supports compound customization with a custom submit icon and render-prop messages', async () => {
    render(
      <ChatBot.Root
        mode="faq"
        title="Composed bot"
        faqItems={[{ question: 'Hello', answer: 'Hi there! Visit www.example.com or email support@example.com.' }]}
      >
        <ChatBot.Header className="custom-header">
          <span>🤖</span>
          <ChatBot.Title className="custom-title" />
        </ChatBot.Header>
        <ChatBot.Messages className="custom-messages">
          {(message) => (
            <ChatBot.MessageItem message={message} className={`message-${message.role}`} bubbleClassName="custom-bubble">
              <span data-testid={`icon-${message.role}`}>{message.role === 'user' ? '🧑' : '🤖'}</span>
              <span>{message.content}</span>
            </ChatBot.MessageItem>
          )}
        </ChatBot.Messages>
        <ChatBot.FaqOptions className="custom-options" label="Quick picks">
          {(item) => `Ask: ${item.question}`}
        </ChatBot.FaqOptions>
        <ChatBot.Loading>Loading custom...</ChatBot.Loading>
        <ChatBot.Error>Custom error</ChatBot.Error>
        <ChatBot.Composer className="custom-composer">
          <ChatBot.Input className="custom-input" />
          <ChatBot.SubmitButton className="custom-submit">➤</ChatBot.SubmitButton>
        </ChatBot.Composer>
      </ChatBot.Root>,
    );

    expect(screen.getByRole('region', { name: 'Composed bot' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Composed bot' })).toHaveClass('custom-title');
    expect(screen.getByText('Quick picks')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ask: Hello' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '➤' })).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Hello' } });
    expect(screen.getByRole('button', { name: '➤' })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: '➤' }));

    expect(await screen.findByText(/Hi there!/)).toBeInTheDocument();
    expect(screen.getByTestId('icon-user')).toHaveTextContent('🧑');
    expect(screen.getByTestId('icon-bot')).toHaveTextContent('🤖');

    expect(screen.getByText('Hi there! Visit www.example.com or email support@example.com.')).toBeInTheDocument();
  });

  it('supports fully custom FAQ option buttons with helper props', async () => {
    render(
      <ChatBot.Root mode="faq" title="Custom options bot" faqItems={[{ question: 'Billing', answer: 'Billing help is available.' }]}>
        <ChatBot.Messages />
        <ChatBot.FaqOptions label="Custom options">
          {(item, option) => (
            <button
              {...option.getButtonProps({
                className: 'custom-faq-button',
                'aria-label': `Ask about ${item.question}`,
                'data-index': option.index,
              })}
            >
              <span>💬</span>
              <span>{item.question}</span>
            </button>
          )}
        </ChatBot.FaqOptions>
      </ChatBot.Root>,
    );

    const optionButton = screen.getByRole('button', { name: 'Ask about Billing' });
    expect(optionButton).toHaveClass('custom-faq-button');
    expect(optionButton).toHaveAttribute('data-index', '0');

    fireEvent.click(optionButton);

    expect(await screen.findByText('Billing help is available.')).toBeInTheDocument();
  });

  it('throws a helpful error when a ChatBot slot is rendered outside ChatBot.Root', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<ChatBot.Header />)).toThrow(
      'ChatBot.Header must be used within ChatBot.Root or ChatBotWidget.ChatBot',
    );
    expect(() => render(<ChatBot.Header />)).toThrow('not directly inside ChatBotWidget.Panel');

    consoleError.mockRestore();
  });
});