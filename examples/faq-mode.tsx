import { ChatBot, type FaqItem } from '../src';

export const faqItems: FaqItem[] = [
  {
    id: 'contact-us',
    question: 'Contact Us',
    answer: 'You can email support@example.com or submit the contact form on our website.',
    keywords: ['contact', 'support', 'email'],
  },
  {
    id: 'how-tos',
    question: "How to's",
    answer: 'Visit the help center to browse step-by-step setup and troubleshooting guides.',
    keywords: ['how to', 'guide', 'tutorial', 'help center'],
  },
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
  {
    id: 'get-to-know-us',
    question: 'Want to get to know us?',
    answer: 'You can go to www.facebook.com. ',
    keywords: ['support', 'help', 'contact'],
  },
];

export function FaqModeExample() {
  return (
    <ChatBot
      mode="faq"
      title="FAQ Assistant"
      faqItems={faqItems}
      showFaqOptions
      faqOptionsLabel="Select a topic:"
      fallbackResponse="I do not know that yet. Please contact support for help."
    />
  );
}