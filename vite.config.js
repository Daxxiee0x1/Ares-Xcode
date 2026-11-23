import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' supaya hasil build bisa dibuka dari folder mana pun (GitHub Pages, dsb.)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: { chunkSizeWarningLimit: 800 }, // CodeMirror cukup besar; tidak masalah untuk latihan
})
