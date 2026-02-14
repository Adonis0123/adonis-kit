import path from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  root: path.resolve(__dirname, 'demo'),
  plugins: [react()],
  resolve: {
    alias: {
      '@react-utils/layouts': path.resolve(__dirname, 'src/index.ts'),
    },
  },
  server: {
    port: 5174,
  },
})
