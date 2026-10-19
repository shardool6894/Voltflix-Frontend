import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Your existing API proxy
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // New Socket.IO proxy
      '/socket.io': {
        target: 'http://localhost:5000', // Points to your backend server
        ws: true,                        // Enables WebSocket proxying
        changeOrigin: true,
      },
    },
  }
})