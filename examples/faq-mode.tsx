import { ChatBox, useLocalChatSession, type FaqItem } from '../src';

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
    answer:
      'Visit the **help center** to browse step-by-step setup and troubleshooting guides.\n\n- Setup guides\n- Troubleshooting tips\n- Account best practices',
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
    answer: 'You can go to [Facebook](https://www.facebook.com) or read `README.md` for package details.',
    keywords: ['support', 'help', 'contact'],
  },
];

export function FaqModeExample() {
  return (
    <ChatBox
      mode="faq"
      title="FAQ Assistant"
      faqItems={faqItems}
      showFaqOptions
      faqOptionsLabel="Select a topic:"
      fallbackResponse="I do not know that yet. Please contact support for help."
    />
  );
}

export function PersistentFaqSessionsExample() {
  const billingSession = useLocalChatSession('demo-billing-faq');
  const supportSession = useLocalChatSession('demo-support-faq');

  return (
    <section className="ck-rounded-2xl ck-bg-white ck-p-6 ck-shadow">
      <h2 className="ck-text-xl ck-font-semibold">Persistent FAQ sessions</h2>
      <p className="ck-mt-2 ck-text-slate-600">
        These chat boxes use separate local browser sessions. Refresh the page after chatting to see each
        conversation restored independently.
      </p>
      <div className="ck-mt-4 ck-grid ck-gap-4 lg:ck-grid-cols-2">
        <ChatBox.Root
          mode="faq"
          title="Billing FAQ Session"
          faqItems={faqItems}
          initialMessages={billingSession.messages}
          onMessagesChange={billingSession.setMessages}
          metadata={{ sessionId: billingSession.sessionId }}
          showFaqOptions
          faqOptionsLabel="Billing quick picks:"
          fallbackResponse="Billing does not know that yet. Please contact support."
          className="ck-h-[30rem] ck-border-amber-100 ck-shadow-xl"
        >
          <ChatBox.Header className="ck-bg-amber-500 ck-text-white" />
          <ChatBox.Messages className="ck-bg-amber-50" />
          <ChatBox.FaqOptions className="ck-border-amber-100 ck-bg-amber-50/80" />
          <ChatBox.Composer className="ck-border-amber-100">
            <ChatBox.Input className="focus:ck-border-amber-500 focus:ck-ring-amber-100" />
            <ChatBox.SubmitButton className="ck-bg-amber-500 hover:ck-bg-amber-600">Send</ChatBox.SubmitButton>
          </ChatBox.Composer>
        </ChatBox.Root>

        <ChatBox.Root
          mode="faq"
          title="Support FAQ Session"
          faqItems={faqItems}
          initialMessages={supportSession.messages}
          onMessagesChange={supportSession.setMessages}
          metadata={{ sessionId: supportSession.sessionId }}
          showFaqOptions
          faqOptionsLabel="Support quick picks:"
          fallbackResponse="Support does not know that yet. Please contact support."
          className="ck-h-[30rem] ck-border-teal-100 ck-shadow-xl"
        >
          <ChatBox.Header className="ck-bg-teal-600 ck-text-white" />
          <ChatBox.Messages className="ck-bg-teal-50" />
          <ChatBox.FaqOptions className="ck-border-teal-100 ck-bg-teal-50/80" />
          <ChatBox.Composer className="ck-border-teal-100">
            <ChatBox.Input className="focus:ck-border-teal-500 focus:ck-ring-teal-100" />
            <ChatBox.SubmitButton className="ck-bg-teal-600 hover:ck-bg-teal-700">Send</ChatBox.SubmitButton>
          </ChatBox.Composer>
        </ChatBox.Root>
      </div>
    </section>
  );
}