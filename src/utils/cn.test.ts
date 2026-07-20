import { describe, expect, it } from 'vitest';

import { cn } from './cn';

describe('cn', () => {
  it('merges prefixed background color utilities so consumer overrides win', () => {
    expect(cn('ck-bg-white', 'ck-bg-purple-600')).toBe('ck-bg-purple-600');
  });

  it('merges prefixed text color utilities so consumer overrides win', () => {
    expect(cn('ck-text-slate-900', 'ck-text-white')).toBe('ck-text-white');
  });

  it('merges prefixed variant utilities', () => {
    expect(cn('hover:ck-bg-slate-700', 'hover:ck-bg-purple-700')).toBe('hover:ck-bg-purple-700');
  });

  it('preserves non-Tailwind ChatterKit classes', () => {
    expect(cn('chatbot-panel-enter', 'ck-bg-white', 'ck-bg-purple-600')).toBe(
      'chatbot-panel-enter ck-bg-purple-600',
    );
  });
});