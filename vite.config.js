import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

// Each page is its own HTML entry (plain multi-page static site — no SPA router).
const page = (p) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: page('./index.html'),
        palette: page('./palette.html'),
        ports: page('./ports.html'),
        wallpapers: page('./wallpapers.html'),
        contribute: page('./contribute.html'),
        notfound: page('./404.html'),
      },
    },
  },
})
