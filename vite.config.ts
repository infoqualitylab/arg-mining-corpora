import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/arg-mining-corpora/',
  plugins: [react()],
  optimizeDeps: {
    include: ['@mui/x-data-grid'],
  },
})
