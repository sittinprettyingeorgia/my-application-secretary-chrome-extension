import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { terser } from 'rollup-plugin-terser';

// https://vitejs.dev/config/
// ORIGINAL
// export default defineConfig({
//   resolve: {
//     alias: {
//       './runtimeConfig': './runtimeConfig.browser'
//     }
//   },
//   plugins: [react()]
// });

export default defineConfig({
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser'
    }
  },
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: ['./src/index.tsx'],
      output: [
        {
          dir: 'dist',
          format: 'es'
        }
      ]
    }
  }
});
