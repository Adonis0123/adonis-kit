import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: false,
    minify: false,
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        client: path.resolve(__dirname, 'src/client.ts'),
        server: path.resolve(__dirname, 'src/server.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        dir: 'dist',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
      external: [/^react(\/.*)?$/, /^node:.*$/],
    },
    target: 'esnext',
  },
})
