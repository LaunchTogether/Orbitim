import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  worker: {
    format: 'es'
  },
  build: {
    rollupOptions: {
      output: {
        // Split the three heavy, independently versioned libraries out of the
        // app bundle: they change far less often than the scene code, so a
        // rebuild does not invalidate two megabytes of cached vendor script.
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('astronomy-engine')) return 'astronomy'
          if (id.includes('satellite.js')) return 'orbital'
          if (id.includes('three') || id.includes('@react-three') || id.includes('postprocessing')) return 'three'
          return undefined
        }
      }
    }
  }
})
