import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import yaml from '@rollup/plugin-yaml'

export default defineConfig({
  // .yml content files are imported as plain objects and bundled at build time.
  plugins: [yaml(), react()],
  resolve: {
    alias: {
      // See src/lib/empty-module.js — jsPDF's screenshot and SVG paths, unused here.
      html2canvas: '/src/lib/empty-module.js',
      dompurify: '/src/lib/empty-module.js',
      canvg: '/src/lib/empty-module.js'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
