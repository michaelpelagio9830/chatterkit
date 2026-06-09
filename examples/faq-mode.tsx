import { ChatBot, type FaqItem } from '../src';

export const faqItems: FaqItem[] = [
  {
    id: 'pricing',
    question: 'How much does it cost?',
    answer: 'Pricing depends on your selected plan.',
    keywords: ['pricing', 'price', 'cost'],
  },
  {
    id: 'support',
    question: 'How do I contact support?',
    answer: 'You can contact support through your dashboard or email support@example.com.',
    keywords: ['support', 'help', 'contact'],
  },
];

export function FaqModeExample() {
  return (
    <ChatBot
      mode="faq"
      title="FAQ Assistant"
      faqItems={faqItems}
      fallbackResponse="I do not know that yet. Please contact support for help."
    />
  );
}