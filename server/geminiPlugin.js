// Vite plugin that adds a POST /api/chat endpoint backed by Google Gemini.
// The API key stays on the server (Node) and is never sent to the browser.
import { GoogleGenAI } from '@google/genai'

const SYSTEM_PROMPT = `You are the Cashflow IQ Assistant, a friendly personal finance companion inside a
banking app prototype. You are talking to Olivia. Use ONLY the fictional demo data below when
discussing her finances; never invent other balances or transactions.

DEMO DATA (fictional, November):
- Monthly budget: $4,800. Spent so far: $4,150. Remaining: $650 (about 86% used).
- Spending by category: Housing $1,800, Food & Dining $1,050, Shopping $650, other categories make up the rest.
- Subscriptions (3, total $68.97/month): Netflix $25.99 (no activity in the last 30 days, marked for review),
  Spotify $13.99, iCloud+ $28.99.
- Savings goal "Japan Holiday": target $10,000, saved $4,000, remaining $6,000, planned contribution $300/month
  (about 20 months to go, 40% complete).
- Security alert: an $850 payment to an unfamiliar online store was flagged as high risk (simulated).

RULES:
- Be concise (under 150 words), warm and practical. Use plain text, no markdown headings.
- Show simple maths when it helps (e.g. months to reach a goal).
- This is a demonstration prototype: you cannot lock cards, move money or contact the bank.
  For card or fraud issues, tell her to use her bank's official app or phone line.
- Never ask for or accept PINs, passwords or full card numbers.
- Give general information only, not personal financial advice.`

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk
      if (body.length > 100_000) reject(new Error('Request too large'))
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'))
      } catch {
        reject(new Error('Invalid JSON'))
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

export default function geminiPlugin({ apiKey, model }) {
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null

  const handler = async (req, res, next) => {
    if (req.url !== '/api/chat') return next()
    if (req.method !== 'POST') return sendJson(res, 405, { error: 'Use POST' })

    if (!ai) {
      return sendJson(res, 503, {
        error: 'GEMINI_API_KEY is not set. Add it to .env.local and restart the dev server.'
      })
    }

    try {
      const { messages } = await readJsonBody(req)
      if (!Array.isArray(messages) || messages.length === 0) {
        return sendJson(res, 400, { error: 'messages must be a non-empty array' })
      }

      // Convert the chat history to Gemini's format (last 20 turns only).
      const contents = messages.slice(-20).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(m.text).slice(0, 4000) }]
      }))

      const response = await ai.models.generateContent({
        model,
        contents,
        config: { systemInstruction: SYSTEM_PROMPT }
      })

      sendJson(res, 200, { reply: response.text ?? '' })
    } catch (err) {
      console.error('[gemini]', err)
      sendJson(res, 500, { error: err.message || 'Gemini request failed' })
    }
  }

  return {
    name: 'gemini-api',
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    }
  }
}
