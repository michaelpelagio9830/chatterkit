import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
});