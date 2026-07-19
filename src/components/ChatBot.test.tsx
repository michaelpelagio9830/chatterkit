import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ChatBox } from './ChatBot';

describe('ChatBox', () => {
  it('renders the default chatbot UI', () => {
    render(<ChatBox mode="faq" faqItems={[]} title="Support bot" />);

    expect(screen.getByRole('region', { name: 'Support bot' })).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  });

  it('lets consumer root classes override default visual classes', () => {
    render(
      <ChatBox
        mode="faq"
        faqItems={[]}
        title="Styled bot"
        className="rounded-none border-0 bg-zinc-950 font-serif shadow-none"
      />,
    );

    const root = screen.getByRole('region', { name: 'Styled bot' });

    expect(root).toHaveClass(
      'rounded-none',
      'border-0',
      'bg-zinc-950',
      'font-serif',
      'shadow-none',
    );
    expect(root).not.toHaveClass(
      'ck-rounded-2xl',
      'ck-border',
      'ck-border-slate-200',
      'ck-bg-slate-50',
      'ck-font-sans',
      'ck-shadow-lg',
    );
  });

  it('submits messages through the composer and displays FAQ responses', async () => {
    render(
      <ChatBox
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
      <ChatBox
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
      <ChatBox.Root
        mode="faq"
        faqItems={[{ question: 'Custom children', answer: '**Not parsed**' }]}
      >
        <ChatBox.Messages>
          {(message) => (
            <ChatBox.MessageItem message={message}>
              <span data-testid={`custom-${message.role}`}>{message.content}</span>
            </ChatBox.MessageItem>
          )}
        </ChatBox.Messages>
        <ChatBox.Composer />
      </ChatBox.Root>,
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
      <ChatBox.Root
        mode="faq"
        faqItems={[{ question: 'Direct markdown children', answer: '**Parsed child** with `code`' }]}
      >
        <ChatBox.Messages>
          {(message) => (
            <ChatBox.MessageItem message={message}>
              <span data-testid={`icon-${message.role}`}>{message.role === 'bot' ? '🤖' : '🧑'}</span>
              {message.content}
            </ChatBox.MessageItem>
          )}
        </ChatBox.Messages>
        <ChatBox.Composer />
      </ChatBox.Root>,
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
      <ChatBox
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
      <ChatBox.Root
        mode="faq"
        title="Composed bot"
        faqItems={[{ question: 'Hello', answer: 'Hi there! Visit www.example.com or email support@example.com.' }]}
      >
        <ChatBox.Header className="custom-header">
          <span>🤖</span>
          <ChatBox.Title className="custom-title" />
        </ChatBox.Header>
        <ChatBox.Messages className="custom-messages">
          {(message) => (
            <ChatBox.MessageItem message={message} className={`message-${message.role}`} bubbleClassName="custom-bubble">
              <span data-testid={`icon-${message.role}`}>{message.role === 'user' ? '🧑' : '🤖'}</span>
              <span>{message.content}</span>
            </ChatBox.MessageItem>
          )}
        </ChatBox.Messages>
        <ChatBox.FaqOptions className="custom-options" label="Quick picks">
          {(item) => `Ask: ${item.question}`}
        </ChatBox.FaqOptions>
        <ChatBox.Loading>Loading custom...</ChatBox.Loading>
        <ChatBox.Error>Custom error</ChatBox.Error>
        <ChatBox.Composer className="custom-composer">
          <ChatBox.Input className="custom-input" />
          <ChatBox.SubmitButton className="custom-submit">➤</ChatBox.SubmitButton>
        </ChatBox.Composer>
      </ChatBox.Root>,
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
      <ChatBox.Root mode="faq" title="Custom options bot" faqItems={[{ question: 'Billing', answer: 'Billing help is available.' }]}>
        <ChatBox.Messages />
        <ChatBox.FaqOptions label="Custom options">
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
        </ChatBox.FaqOptions>
      </ChatBox.Root>,
    );

    const optionButton = screen.getByRole('button', { name: 'Ask about Billing' });
    expect(optionButton).toHaveClass('custom-faq-button');
    expect(optionButton).toHaveAttribute('data-index', '0');

    fireEvent.click(optionButton);

    expect(await screen.findByText('Billing help is available.')).toBeInTheDocument();
  });

  it('throws a helpful error when a ChatBot slot is rendered outside ChatBox.Root', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<ChatBox.Header />)).toThrow(
      'ChatBox.Header must be used within ChatBox.Root or ChatBotWidget.ChatBot',
    );
    expect(() => render(<ChatBox.Header />)).toThrow('not directly inside ChatBotWidget.Panel');

    consoleError.mockRestore();
  });
});