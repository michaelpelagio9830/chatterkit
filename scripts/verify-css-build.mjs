import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const stylesheetPath = resolve('dist/style.css');
const css = readFileSync(stylesheetPath, 'utf8');
const jsEntryPath = resolve('dist/index.js');
const jsEntry = readFileSync(jsEntryPath, 'utf8');

const forbiddenPreflightPatterns = [
  {
    name: 'Tailwind universal border reset',
    pattern: /\*,::before,::after[^{}]*\{[^{}]*(?:box-sizing:border-box|border-width:0|border-style:solid)/,
  },
  {
    name: 'Tailwind global variable reset',
    pattern: /(?:^|})(?:\*,(?:::before|:before|::after|:after)[^{]*|\*,(?:::after|:after),(?:::before|:before)[^{]*)\{[^{}]*--tw-(?:blur|shadow|ring-shadow|translate-x):/,
  },
  {
    name: 'Tailwind global backdrop variable reset',
    pattern: /(?:^|})::backdrop\{[^{}]*--tw-(?:blur|shadow|ring-shadow|backdrop-blur):/,
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
    name: 'Tailwind container component utility',
    pattern: /(?:^|})\.(?:\\!)?container\{/,
  },
  {
    name: 'unprefixed Tailwind flex utility',
    pattern: /(?:^|})\.flex\{/,
  },
  {
    name: 'unprefixed Tailwind fixed utility',
    pattern: /(?:^|})\.fixed\{/,
  },
  {
    name: 'unprefixed Tailwind grid utility',
    pattern: /(?:^|})\.grid\{/,
  },
  {
    name: 'unprefixed Tailwind hidden utility',
    pattern: /(?:^|})\.hidden\{/,
  },
  {
    name: 'unprefixed Tailwind bg-white utility',
    pattern: /(?:^|})\.bg-white\{/,
  },
  {
    name: 'unprefixed Tailwind text-sm utility',
    pattern: /(?:^|})\.text-sm\{/,
  },
  {
    name: 'unprefixed Tailwind rounded-full utility',
    pattern: /(?:^|})\.rounded-full\{/,
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
    name: 'cascade layer order declaration',
    pattern: /@layer base,\s*base\.chatterkit,\s*components,\s*components\.chatterkit,\s*utilities;/,
  },
  {
    name: 'base ChatterKit sublayer wrapping scoped reset output',
    pattern: /@layer base\.chatterkit\{\s*:where\(\.chatterkit-root,\.chatterkit-root \*,\.chatterkit-root (?:\*)?:{1,2}before,\.chatterkit-root (?:\*)?:{1,2}after\)\{[^{}]*box-sizing:border-box/,
  },
  {
    name: 'components ChatterKit sublayer wrapping ChatterKit helpers',
    pattern: /@layer components\.chatterkit\{.*\.chatbot-panel-enter\{[^{}]*animation:chatbot-panel-enter/s,
  },
  {
    name: 'zero-specificity scoped box-sizing reset',
    pattern: /:where\(\.chatterkit-root,\.chatterkit-root \*,\.chatterkit-root (?:\*)?:{1,2}before,\.chatterkit-root (?:\*)?:{1,2}after\)\{[^{}]*box-sizing:border-box/,
  },
  {
    name: 'scoped Tailwind variable defaults',
    pattern: /:where\(\.chatterkit-root,\.chatterkit-root \*,\.chatterkit-root (?:\*)?:{1,2}before,\.chatterkit-root (?:\*)?:{1,2}after\)\{[^{}]*--tw-blur:/,
  },
  {
    name: 'zero-specificity scoped margin reset',
    pattern: /:where\(\.chatterkit-root \*\)\{margin:0\}/,
  },
  {
    name: 'zero-specificity scoped form reset',
    pattern: /:where\(\.chatterkit-root button,\.chatterkit-root input,\.chatterkit-root textarea,\.chatterkit-root select\)\{font:inherit\}/,
  },
  {
    name: 'prefixed component flex utility output',
    pattern: /\.ck-flex\{display:flex\}/,
  },
  {
    name: 'prefixed component rounded utility output',
    pattern: /\.ck-rounded-(?:2xl|3xl|full)\{/,
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

const forbiddenJsEntryPatterns = [
  {
    name: 'automatic package stylesheet import from JS entry',
    pattern: /style\.css/,
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

for (const check of forbiddenJsEntryPatterns) {
  if (check.pattern.test(jsEntry)) {
    failures.push(`Found forbidden JS entry behavior in ${jsEntryPath}: ${check.name}`);
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