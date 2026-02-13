import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Importante: barra al inicio y final
  server: {
    port: 5173,
    open: true
  }
})