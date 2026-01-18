import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    strictPort: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom'],
          // Routing
          'router': ['react-router-dom'],
          // UI libraries
          'ui': ['@headlessui/react', 'lucide-react', 'react-hot-toast'],
          // State management
          'state': ['zustand', '@tanstack/react-query'],
          // Utils
          'utils': ['axios', 'i18next', 'react-i18next'],
          // AI (loaded only when needed)
          'ai': ['@google/generative-ai'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1000kb
  },
})
