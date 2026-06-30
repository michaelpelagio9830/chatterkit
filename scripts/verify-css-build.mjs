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
];

const requiredChatterkitPatterns = [
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