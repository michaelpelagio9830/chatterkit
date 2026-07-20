import type { Config } from 'tailwindcss';

declare const process: {
  env: Record<string, string | undefined>;
};

const isLibraryBuild = process.env.CHATTERKIT_LIBRARY_BUILD === 'true';

console.log('isLibraryBuild:', isLibraryBuild);
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', './examples/**/*.{ts,tsx}'],
  prefix: 'ck-',
  corePlugins: {
    preflight: !isLibraryBuild,
  },
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
