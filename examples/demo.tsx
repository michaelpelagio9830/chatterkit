import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { FaqModeExample } from './faq-mode';
import '../src/style.css';

function Demo() {
  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Modular React Chatbot</h1>
          <p className="mt-2 text-slate-600">FAQ mode demo using the reusable ChatBot component.</p>
        </div>
        <FaqModeExample />
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
);