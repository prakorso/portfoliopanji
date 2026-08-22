import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import yaml from '@rollup/plugin-yaml'

export default defineConfig({
  // .yml content files are imported as plain objects and bundled at build time.
  plugins: [yaml(), react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
