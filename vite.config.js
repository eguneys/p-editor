import glsl from 'vite-plugin-glsl'
import { defineConfig } from 'vite'

export default defineConfig({
  define: { __IS_DEV__: true },
  build: { modulePreload: { polyfill: false }, target: 'esnext' },
  plugins: [glsl()]
})
