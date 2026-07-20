import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './examples/**/*.{ts,tsx}'],
  prefix: 'ck-',
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;