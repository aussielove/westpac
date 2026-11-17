import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import geminiPlugin from './server/geminiPlugin.js'

function fixCompactDashboard() {
  return {
    name: 'fix-compact-dashboard',
    enforce: 'pre',
    transform(code, id) {
      if (!id.endsWith('/src/mockup/FullCashFlowIQ.js')) return null
      return code.replace(
        ']})]})]})]}),e("footer"',
        ']})]})]})]})]}),e("footer"'
      )
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load ALL env vars (empty prefix) for server-side use only.
  // GEMINI_API_KEY has no VITE_ prefix, so it is never exposed to the browser.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      fixCompactDashboard(),
      react(),
      // Tailwind is only imported by the app mockup (src/mockup/index.css).
      tailwindcss(),
      geminiPlugin({
        apiKey: env.GEMINI_API_KEY,
        model: env.GEMINI_MODEL || 'gemini-3.8-flash'
      })
    ],
    build: {
      rolldownOptions: {
        input: {
          main: fileURLToPath(new URL('./index.html', import.meta.url)),
          mockup: fileURLToPath(new URL('./mockup.html', import.meta.url))
        }
      }
    }
  }
})
