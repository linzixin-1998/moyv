import { defineConfig } from '@unocss/vite'
import presetUno from '@unocss/preset-wind3'
export default defineConfig({
  content: {
    pipeline: {
      exclude: ['node_modules', 'out', '.git', '.vscode', 'public', 'build']
    }
  },
  shortcuts: {
    'flex-center': 'flex justify-center items-center'
  },
  presets: [presetUno({ dark: 'class' })]
})
