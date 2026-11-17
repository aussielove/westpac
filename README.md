# Cashflow IQ

A personal finance companion prototype built for the Westpac Project Future competition (QUT). It uses React and Vite, and the AI Assistant is powered by Google Gemini.

> **Prototype notice:** all financial data in this app is fictional. It is not connected to real Westpac accounts and does not give financial advice.

## Features

| Page | What it does |
| --- | --- |
| Home | Overview dashboard of balances, budget and alerts |
| Smart Budgeting | Spending breakdown by category and budget progress |
| Savings Goals | Tracks goals such as the Japan Holiday fund |
| Fraud Protection | Simulated security alerts for suspicious transactions |
| Accounts | Demo account summaries |
| AI Assistant | A chat assistant (Google Gemini) that answers questions using the demo data |

## Getting started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer (includes npm)

### 2. Install dependencies

```bash
npm install
```

### 3. Add your Gemini API key

The AI Assistant needs a Google Gemini API key. Without one, the app still runs, but the assistant falls back to scripted demo replies and shows **● Demo mode**.

1. **Get a free key.** Go to <https://aistudio.google.com/apikey>, sign in with a Google account and click **Create API key**. Copy the key.

2. **Create your env file.** In the project root (the folder that contains `package.json`), copy the template:

   ```bash
   # macOS / Linux / Git Bash
   cp .env.example .env.local
   ```

   ```powershell
   # Windows PowerShell
   Copy-Item .env.example .env.local
   ```

3. **Paste your key.** Open `.env.local` and put the key directly after the `=` with no spaces or quotes:

   ```env
   GEMINI_API_KEY=paste-your-key-here
   ```

   Optional: to use a different Gemini model, uncomment and edit this line:

   ```env
   GEMINI_MODEL=gemini-3.8-flash
   ```

4. **Save the file.** If the dev server is already running, it restarts automatically when `.env.local` changes. If not, start it in the next step.

> **Keep your key secret.**
> - `.env.local` is listed in `.gitignore`, so never commit it and never paste your key into chat, screenshots or issues.
> - Do **not** rename the variable to `VITE_GEMINI_API_KEY` and do not put the key anywhere in `src/`. Anything there is bundled into the browser, where anyone can read it.
> - If a key leaks, delete it in Google AI Studio and create a new one.

### 4. Run the app

```bash
npm run dev
```

Open <http://localhost:5173>.

### 5. Check the AI is working

Go to **AI Assistant** and ask a question, such as *"Can I cancel my Netflix subscription?"*

- **● Gemini AI** in the chat header means replies come from Gemini.
- **● Demo mode** means the Gemini call failed and the app used scripted replies. Check the terminal running `npm run dev` for the error, then see Troubleshooting below.

## How the AI integration works

```
Browser (aiAssistant.jsx)  ──POST /api/chat──▶  Vite server (server/geminiPlugin.js)  ──▶  Google Gemini API
                                                 reads GEMINI_API_KEY from .env.local
```

- [`server/geminiPlugin.js`](server/geminiPlugin.js) adds a `POST /api/chat` endpoint to the Vite dev and preview servers. It sends the conversation to Gemini with a system prompt that contains Olivia's fictional financial data and the safety rules. To change the assistant's tone, rules or data, edit `SYSTEM_PROMPT` in that file.
- [`src/pages/aiAssistant.jsx`](src/pages/aiAssistant.jsx) is the chat UI. It calls `/api/chat` and falls back to the scripted replies in `getAssistantReply()` if the request fails.
- [`vite.config.js`](vite.config.js) loads the env vars and registers the plugin.

**Deployment note:** `/api/chat` only exists while `npm run dev` or `npm run preview` is running. If you deploy the built static files (`dist/`) to a host, move the endpoint to a serverless function (for example on Vercel or Netlify) and set `GEMINI_API_KEY` in the host's environment settings.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Badge shows **Demo mode**; terminal says `GEMINI_API_KEY is not set` | `.env.local` is missing, in the wrong folder, not saved, or has an empty key. Check that it sits next to `package.json`, then save it again. |
| Error mentions `API key not valid` or `403` | The key was copied incorrectly or has been deleted. Create a new key in AI Studio. |
| Error mentions `429` or quota | You hit the free-tier rate limit. Wait a minute and try again. |
| Error mentions the model not being found | Set `GEMINI_MODEL` in `.env.local` to a current model from the [Gemini models list](https://ai.google.dev/gemini-api/docs/models). |

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build locally (includes `/api/chat`) |
| `npm run lint` | Run ESLint |

## Project structure

```
├── server/
│   └── geminiPlugin.js     # /api/chat endpoint (Gemini, server-side)
├── src/
│   ├── App.jsx             # Navigation and page switching
│   ├── pages/              # One component per page
│   └── styles/             # Per-page CSS
├── .env.example            # Template for your .env.local
└── vite.config.js
```
