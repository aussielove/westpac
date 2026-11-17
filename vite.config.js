import react from '@vitejs/plugin-react'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import geminiPlugin from './server/geminiPlugin.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load ALL env vars (empty prefix) for server-side use only.
  // GEMINI_API_KEY has no VITE_ prefix, so it is never exposed to the browser.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      geminiPlugin({
        apiKey: env.GEMINI_API_KEY,
        model: env.GEMINI_MODEL || 'gemini-3.8-flash'
      })
    ]
  }
})
