import { ArrowUp, Sparkles, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { money } from '../data'
import { useStore } from '../store'
import { cx } from './ui'

type Msg = { from: 'me' | 'ai'; text: string; action?: { label: string; run: () => void } }

export function AiSheet() {
  const s = useStore()
  const { aiOpen, closeAi } = s
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const list = useRef<HTMLDivElement>(null)
  const seeded = useRef<string | null>(null)

  const reply = (q: string): Msg => {
    const t = q.toLowerCase()
    if (/subscri|audit|leak|cancel|netflix|stream/.test(t))
      return {
        from: 'ai',
        text: `I found 5 leaks on Westpac Choice ••4821 worth $1,656/yr: a $7/mo Streaming Bundle hike, FitPulse (no logins in 94 days), a CloudVault trial converting in 48h, a $68/mo energy loyalty tax and a duplicate Daily News+ subscription.`,
        action: { label: 'Intercept all 5 leaks', run: () => (s.blockAll(), s.notify('All 5 leaks intercepted')) },
      }
    if (/float|offset|payday|paycheck|salary|allocate/.test(t))
      return {
        from: 'ai',
        text: `Your $1,100 in ring-fenced bills aren't due for 9 to 12 days. Floating it in your Rocket Repay offset at 6.49% until 2 hours before each debit is worth about +$412/yr. Safe-to-spend stays at $135/day.`,
        action: { label: 'Turn on offset float', run: () => (s.setFloatOn(true), s.setAllocated(true), s.notify('Offset float on')) },
      }
    if (/lvr|rate|home loan|mortgage|interest/.test(t))
      return {
        from: 'ai',
        text: `Your LVR just dropped to 69.8%, under the 70% tier. That qualifies for a -0.10% p.a. discount on Rocket Repay, about $1,840/yr. Over the life of the loan that's part of the $12K+ in interest savings.`,
        action: { label: 'Auto-apply LVR discount', run: () => (s.setLvrOn(true), s.notify('LVR discount requested')) },
      }
    if (/bonus|spend|save|tap|life/.test(t))
      return {
        from: 'ai',
        text: `You're at 17/20 debit taps this month. Auto-Micro-Split will make 3 small taps from your safe-to-spend so you keep the 5.00% p.a. Westpac Life bonus rate, about +$390/yr.`,
        action: { label: 'Enable Auto-Micro-Split', run: () => (s.setBonusOn(true), s.notify('Auto-Micro-Split on')) },
      }
    if (/virtual|trial|card/.test(t))
      return {
        from: 'ai',
        text: `I can make a single-use virtual card for free trials. It works once, then it's dead, so trials can't silently convert to paid.`,
        action: { label: 'Generate virtual card', run: () => (s.makeVirtualCard(), s.reset([{ name: 'iq', tab: 'shield' }])) },
      }
    if (/scam|fraud|safe/.test(t))
      return {
        from: 'ai',
        text: `SaferPay asks a few quick questions before paying new payees, and SafeBlock can lock any merchant. If anyone pressures you to pay fast or keep it secret, stop and call us on 132 032.`,
      }
    return {
      from: 'ai',
      text: `Here's your snapshot: ${money(s.savings.total, { cents: false })}/yr found so far, $135/day safe-to-spend, and 3 bills due this week. Try asking about subscriptions, your offset float, your LVR or bonus interest.`,
    }
  }

  const ask = (q: string) => {
    if (!q.trim()) return
    setMsgs((m) => [...m, { from: 'me', text: q }])
    setInput('')
    setTyping(true)
    window.setTimeout(() => {
      setTyping(false)
      setMsgs((m) => [...m, reply(q)])
    }, 750)
  }

  useEffect(() => {
    if (aiOpen === null) {
      seeded.current = null
      return
    }
    if (seeded.current === aiOpen) return
    seeded.current = aiOpen
    setMsgs([{ from: 'ai', text: 'Hi Alex, I’m your Shadow Private Banker. What would you like to sort out today?' }])
    if (aiOpen) ask(aiOpen)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiOpen])

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, typing])

  if (aiOpen === null) return null

  return (
    <div className="absolute inset-0 z-[55] flex flex-col justify-end">
      <button aria-label="Close" onClick={closeAi} className="anim-fade absolute inset-0 bg-navy/40" />
      <div className="anim-sheet relative flex h-[78%] flex-col rounded-t-3xl bg-white shadow-2xl">
        <div className="flex items-center gap-2 border-b border-line px-5 py-4">
          <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-violet to-magenta text-white">
            <Sparkles className="size-4" />
          </span>
          <div className="flex-1">
            <div className="text-[15px] font-bold text-navy">Westpac AI</div>
            <div className="text-[11px] text-muted">Shadow Private Banker · demo</div>
          </div>
          <button aria-label="Close" onClick={closeAi} className="grid size-8 place-items-center rounded-full hover:bg-mist">
            <X className="size-5" />
          </button>
        </div>
        <div ref={list} className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {msgs.map((m, i) => (
            <div key={i} className={cx('anim-rise flex', m.from === 'me' ? 'justify-end' : 'justify-start')}>
              <div
                className={cx(
                  'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug',
                  m.from === 'me' ? 'rounded-br-md bg-navy text-white' : 'rounded-bl-md bg-mist text-ink',
                )}
              >
                {m.text}
                {m.action && (
                  <button
                    onClick={() => {
                      m.action!.run()
                      setMsgs((all) => [...all.map((x, j) => (j === i ? { ...x, action: undefined } : x)), { from: 'ai', text: 'Done. I’ve updated your money found total.' }])
                    }}
                    className="mt-2.5 block rounded-full bg-wred px-3.5 py-1.5 text-[12px] font-semibold text-white hover:bg-wred-dark"
                  >
                    {m.action.label}
                  </button>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-1 rounded-2xl rounded-bl-md bg-mist px-4 py-3 w-fit">
              {[0, 1, 2].map((d) => (
                <span key={d} className="size-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${d * 120}ms` }} />
              ))}
            </div>
          )}
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
          {['Audit my subscriptions', 'Float my bills', 'Can I get a lower rate?', 'Bonus interest'].map((c) => (
            <button key={c} onClick={() => ask(c)} className="shrink-0 rounded-full border border-line px-3 py-1.5 text-[12px] text-navy hover:border-navy/30">
              {c}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            ask(input)
          }}
          className="flex items-center gap-2 px-4 pb-8 pt-1"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your money…"
            className="h-11 flex-1 rounded-full border border-line px-4 text-[14px] outline-none focus:border-navy"
          />
          <button aria-label="Send" className="grid size-11 place-items-center rounded-full bg-wred text-white disabled:opacity-40" disabled={!input.trim()}>
            <ArrowUp className="size-5" />
          </button>
        </form>
      </div>
    </div>
  )
}
