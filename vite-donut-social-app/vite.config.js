import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      BASE_URL : 'http://localhost:3001'}
  },
  server: {
    host: true
  }
})
