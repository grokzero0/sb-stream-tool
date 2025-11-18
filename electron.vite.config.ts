import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    build: {
      reportCompressedSize: true
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    build: {
      reportCompressedSize: true
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    build: {
      reportCompressedSize: true
    },
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react(), tailwindcss()]
  }
})
