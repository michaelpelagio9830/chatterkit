import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const stylesheetPath = resolve('dist/style.css');
const css = readFileSync(stylesheetPath, 'utf8');

const forbiddenPreflightPatterns = [
  {
    name: 'Tailwind universal border reset',
    pattern: /\*,::before,::after[^{}]*\{[^{}]*(?:box-sizing:border-box|border-width:0|border-style:solid)/,
  },
  {
    name: 'Tailwind html reset',
    pattern: /(?:^|})html(?:,:host)?[^{}]*\{[^{}]*(?:line-height:1\.5|-webkit-text-size-adjust:100%|tab-size:4)/,
  },
  {
    name: 'Tailwind body reset',
    pattern: /(?:^|})body[^{}]*\{[^{}]*(?:margin:0|line-height:inherit)/,
  },
  {
    name: 'Tailwind form element reset',
    pattern: /(?:^|})(?:button,input,optgroup,select,textarea|button,input)[^{}]*\{[^{}]*(?:font-family:inherit|font-feature-settings:inherit|font-size:100%)/,
  },
  {
    name: 'class-specific ChatterKit box-sizing reset',
    pattern: /\.chatterkit-root,\.chatterkit-root \*,\.chatterkit-root \*::before,\.chatterkit-root \*::after\{box-sizing:border-box\}/,
  },
  {
    name: 'class-specific ChatterKit margin reset',
    pattern: /\.chatterkit-root :where\(\*\)\{margin:0\}/,
  },
];

const requiredChatterkitPatterns = [
  {
    name: 'zero-specificity scoped box-sizing reset',
    pattern: /:where\(\.chatterkit-root,\.chatterkit-root \*,\.chatterkit-root \*:{1,2}before,\.chatterkit-root \*:{1,2}after\)\{box-sizing:border-box\}/,
  },
  {
    name: 'zero-specificity scoped margin reset',
    pattern: /:where\(\.chatterkit-root \*\)\{margin:0\}/,
  },
  {
    name: 'component flex utility output',
    pattern: /\.flex\{display:flex\}/,
  },
  {
    name: 'component rounded utility output',
    pattern: /\.rounded-(?:2xl|3xl|full)\{/,
  },
  {
    name: 'chatbot panel animation helper',
    pattern: /\.chatbot-panel-enter\{[^{}]*animation:chatbot-panel-enter/,
  },
  {
    name: 'chatbot typing dot helper',
    pattern: /\.chatbot-typing-dot\{[^{}]*animation:chatbot-typing-bounce/,
  },
];

const failures = [];

for (const check of forbiddenPreflightPatterns) {
  if (check.pattern.test(css)) {
    failures.push(`Found forbidden preflight/global reset CSS: ${check.name}`);
  }
}

for (const check of requiredChatterkitPatterns) {
  if (!check.pattern.test(css)) {
    failures.push(`Missing expected Chatterkit CSS output: ${check.name}`);
  }
}

if (failures.length > 0) {
  console.error(`CSS build verification failed for ${stylesheetPath}:`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`CSS build verification passed for ${stylesheetPath}.`);