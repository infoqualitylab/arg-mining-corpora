import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: 'https://anonymous.4open.science/w/arg-mining-corpora-4780/',
  plugins: [react()],
  optimizeDeps: {
    include: ['@mui/x-data-grid'],
  },
})
