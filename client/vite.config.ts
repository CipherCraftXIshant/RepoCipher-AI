import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiTarget = 'http://localhost:4000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': apiTarget,
      '/health': apiTarget,
      '/socket.io': { target: apiTarget, ws: true },
    },
  },
})
