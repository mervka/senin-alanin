import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Senin Alanın',
        short_name: 'Senin Alanın',
        description: 'Duygularını, günlüklerini ve isteklerini güvenle saklayabileceğin kişisel alan.',
        theme_color: '#9d5874',
        background_color: '#fff1f6',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
      },
    }),
  ],
})
