import { defineConfig } from 'vite'
import WindiCSS from 'vite-plugin-windicss'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    brotliSize: false,
    assetsInlineLimit: 0,
  },
  plugins: [reactRefresh(), WindiCSS()],
})
