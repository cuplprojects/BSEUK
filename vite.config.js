import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['jspdf', 'html2canvas']
  },
  build: {
    commonjsOptions: {
      include: [/jspdf/, /html2canvas/, /node_modules/]
    }
  }
})
