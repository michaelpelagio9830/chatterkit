import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.csb.app'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
    css: true,
  },
  // server:{
  //   proxy: {
  //       '/api/local-chatbot': {
  //         target: 'http://localhost:8000',
  //         changeOrigin: true,
  //         rewrite: (path) => path.replace(/^\/api\/local-chatbot/, '/chatbot'),
  //       },
  //   },
  // },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ModularReactChatbot',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});