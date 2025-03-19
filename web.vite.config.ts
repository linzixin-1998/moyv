import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import UnoCSS from 'unocss/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  root: resolve(__dirname, 'src/renderer'), // 指定项目根目录
  publicDir: resolve(__dirname, 'public'), // 指定静态资源目录
  build: {
    outDir: resolve(__dirname, 'dist/web'),
    emptyOutDir: true
  },
  server: {
    port: 5174,
    strictPort: true,
    open: true
  }
})
