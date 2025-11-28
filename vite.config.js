import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://haven-drauhuadfhf9bjby.southafricanorth-01.azurewebsites.net/v3/haven-drauhuadfhf9bjby.southafricanorth-01.azurewebsites.net',
        changeOrigin: true,
      }
    }
  }
})