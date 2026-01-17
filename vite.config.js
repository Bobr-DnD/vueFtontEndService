import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      //vueDevTools(),
    ],
    server: {
      port: env.VITE_PORT,
      host: '0.0.0.0'
    },
    preview: {
      port: env.VITE_PORT,
      host: '0.0.0.0'
    },
    resolve: {
      alias: {
        '@http': fileURLToPath(new URL('./HTTPServices', import.meta.url)),
        "@ws": fileURLToPath(new URL('./WSServices', import.meta.url)),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@utils': fileURLToPath(new URL('./utils', import.meta.url)),
      },
    },
  }
})
