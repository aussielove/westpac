import {
  BadgeCheck,
  ChevronLeft,
  Copy,
  CreditCard,
  Lock,
  LockOpen,
  Rocket,
  ShieldCheck,
  Sparkles,
  Timer,
  TriangleAlert,
  Wand2,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { LEAKS, money } from '../data'
import { Screen } from '../components/Phone'
import { Card, cx, PrimaryButton, Toggle, WestpacMark } from '../components/ui'
import { useCountdown, useCountUp } from '../hooks'
import { BONUS_YR, FLOAT_YR, LVR_YR, useStore, type IqTab } from '../store'

const TABS: { id: IqTab; label: string }[] = [
  { id: 'safeblock', label: 'SafeBlock' },
  { id: 'payday', label: 'Payday' },
  { id: 'products', label: 'Products' },
  { id: 'shield', label: 'Shield' },
]

export function CashFlowIQ({ initialTab = 'safeblock' }: { initialTab?: IqTab }) {
  const { depth, back, savings, openAi } = useStore()
  const [tab, setTab] = useState<IqTab>(initialTab)
  const total = useCountUp(savings.total)
  const unlocked = useCountUp(savings.unlocked)

  return (
    <Screen className="bg-mist">
      <div className="relative overflow-hidden bg-navy px-5 pb-5 pt-12 text-white">
        <span className="absolute -right-16 top-6 size-56 rounded-full bg-violet/45 blur-3xl" />
        <span className="absolute -left-20 bottom-0 size-48 rounded-full bg-wred/40 blur-3xl" />
        <div className="relative flex items-center justify-between">
          {depth > 1 ? (
            <button aria-label="Back" onClick={back} className="-ml-2 grid size-9 place-items-center rounded-full hover:bg-white/10">
              <ChevronLeft className="size-6" strokeWidth={2.4} />
            </button>
          ) : (
            <WestpacMark className="h-4 w-7 text-wred" />
          )}
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium">
            <span className="size-1.5 animate-pulse rounded-full bg-[#3ee07a]" /> Shadow Private Banker active
          </span>
        </div>
        <p className="relative mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-blush">Powered by Westpac Cash Flow IQ</p>
        <h1 className="relative mt-1 font-display text-[40px] uppercase leading-[0.95]">
          Save over $12K
          <br />
          <span className="text-[#ff5a52]">in interest</span>
        </h1>
        <p className="relative mt-2 text-[12px] leading-snug text-white/70">Zero-Day Offset Float + LVR Auto-Repricing</p>

        <div className="relative mt-4 rounded-xl bg-white p-4 text-ink shadow-xl">
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Total annual money found</div>
          <div className="flex items-end justify-between">
            <div className="font-display text-[40px] leading-none text-navy">
              {money(Math.round(total), { cents: false })}
              <span className="text-[20px]">/yr</span>
            </div>
            <span className={cx('mb-1 rounded-full px-2 py-0.5 text-[11px] font-semibold', savings.unlocked ? 'bg-money/10 text-money' : 'bg-mist text-muted')}>
              +{money(Math.round(unlocked), { cents: false })} this session
            </span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3 text-center">
            {[
              ['Subscriptions blocked', savings.blockedYr],
              ['Offset float earned', savings.floatYr],
              ['LVR rate saved', savings.lvrYr],
            ].map(([k, v]) => (
              <div key={k as string}>
                <div className="text-[15px] font-bold text-navy">{money(v as number, { cents: false })}</div>
                <div className="text-[10px] leading-tight text-muted">{k}/yr</div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => openAi()}
          className="relative mt-3 flex h-11 w-full items-center gap-2 rounded-full bg-white/10 px-4 text-left text-[13px] text-white/80 ring-1 ring-white/20 hover:bg-white/15"
        >
          <Sparkles className="size-4 text-blush" /> Ask Westpac AI anything about your money…
        </button>
        <div className="no-scrollbar relative -mx-5 mt-3 flex gap-2 overflow-x-auto px-5">
          {['Subscription Audit (5 leaks found)', 'Zero-Day Paycheck Offset Float', 'Auto-Claim 70% LVR -0.10% Rate Drop', 'Spend&Save Bonus Unlocker'].map(
            (c) => (
              <button
                key={c}
                onClick={() => openAi(c)}
                className="shrink-0 rounded-full border border-white/25 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-white/10"
              >
                {c}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="relative z-20 flex border-b border-line bg-white px-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cx(
              'relative flex-1 py-3.5 text-[13px] font-semibold transition',
              tab === t.id ? 'text-navy' : 'text-muted hover:text-ink',
            )}
          >
            {t.label}
            {tab === t.id && <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-wred" />}
          </button>
        ))}
      </div>

      <div key={tab} className="anim-fade p-4">
        {tab === 'safeblock' && <SafeBlockTab />}
        {tab === 'payday' && <PaydayTab />}
        {tab === 'products' && <ProductsTab />}
        {tab === 'shield' && <ShieldTab />}
        <p className="mt-6 px-2 text-center text-[11px] leading-snug text-muted">
          Demo insights and illustrative savings. No live banking, merchant cancellation or rate approvals. Hackathon prototype by
          Future 404 Customer Advocates.
        </p>
      </div>
    </Screen>
  )
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-wred">{children}</div>
}

function SafeBlockTab() {
  const { blocked, toggleBlock, blockAll, swept, toggleSweep, counter, acceptCounter, savings, notify } = useStore()
  const all = blocked.length === LEAKS.length
  const totalYr = LEAKS.reduce((s, l) => s + l.monthly * 12, 0)

  return (
    <div>
      <Eyebrow>SafeBlock subscription & price-hike radar</Eyebrow>
      <p className="mt-1 text-[13px] text-muted">Westpac Choice ••4821 · 5 verified recurring charges · Simulated merchant controls</p>
      <PrimaryButton
        className="mt-3"
        disabled={all}
        onClick={() => {
          blockAll()
          notify(`All 5 leaks intercepted · ${money(totalYr, { cents: false })}/yr saved`)
        }}
      >
        <Zap className="size-4" />
        {all ? 'All 5 leaks intercepted' : `1-Tap Intercept All 5 Leaks (${money(totalYr, { cents: false })}/yr)`}
      </PrimaryButton>

      <div className="mt-3 space-y-2.5">
        {LEAKS.map((l) => {
          const isBlocked = blocked.includes(l.id)
          const countered = counter.includes(l.id)
          return (
            <Card key={l.id} className={cx('overflow-hidden transition', isBlocked && 'ring-1 ring-money/40')}>
              <div className="flex gap-3 p-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg text-[16px] font-bold text-white" style={{ background: l.tone }}>
                  {l.letter}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <span className={cx('text-[14px] font-semibold text-ink', isBlocked && 'line-through decoration-money/60')}>{l.name}</span>
                    <span className="text-right">
                      <span className="block text-[14px] font-bold text-navy">${l.monthly}/mo</span>
                    </span>
                  </div>
                  <div className="flex justify-between gap-2 text-[12px]">
                    <span className="text-muted">{l.detail}</span>
                    <span className="font-semibold text-wred">${l.monthly * 12}/yr</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="flex items-center gap-1 rounded bg-navy/[0.06] px-1.5 py-0.5 text-[10px] font-semibold text-navy">
                      <BadgeCheck className="size-3" /> Ethoca Verified Receipt
                    </span>
                    <span className="rounded bg-wred/10 px-1.5 py-0.5 text-[10px] font-semibold text-wred">{l.tag}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-line px-3.5 py-2.5">
                <span className="flex items-center gap-1.5 text-[12px] text-ink">
                  <Rocket className="size-3.5 text-violet" /> Sweep to Life / Rocket Repay
                </span>
                <Toggle label={`Sweep ${l.name}`} on={swept.includes(l.id)} onChange={() => toggleSweep(l.id)} />
              </div>
              <div className="flex gap-2 border-t border-line bg-mist/60 p-2.5">
                <button
                  onClick={() => {
                    toggleBlock(l.id)
                    notify(isBlocked ? `${l.name} unlocked` : `${l.name} locked via SafeBlock`)
                  }}
                  className={cx(
                    'flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md text-[12px] font-semibold transition',
                    isBlocked ? 'bg-money text-white' : 'bg-navy text-white hover:bg-navy-soft',
                  )}
                >
                  {isBlocked ? <Lock className="size-3.5" /> : <LockOpen className="size-3.5" />}
                  {isBlocked ? (countered ? 'Counter-offer locked · Undo' : 'Locked & cancelled · Undo') : 'Lock via SafeBlock & Cancel'}
                </button>
                {l.counterOffer && !isBlocked && (
                  <button
                    onClick={() => {
                      acceptCounter(l.id)
                      toggleBlock(l.id)
                      notify('Counter-offer accepted: old price locked for 6 months')
                    }}
                    className="h-9 rounded-md border border-navy/25 px-3 text-[12px] font-semibold text-navy hover:bg-white"
                  >
                    Counter-offer
                  </button>
                )}
              </div>
            </Card>
          )
        })}
      </div>
      <div className="mt-3 rounded-lg bg-navy px-4 py-3 text-[12px] text-white">
        Blocked: <b>{money(savings.blockedYr, { cents: false })}/yr</b> · Sweeping <b>{money(savings.sweepingMo, { cents: false })}/mo</b> ·{' '}
        <b>{money(savings.lifeInterest)}</b> illustrative extra Life interest.
      </div>
    </div>
  )
}

const ALLOC = [
  { key: 'bills', label: 'Ring-Fenced Bills & Direct Debits', amount: 1100, color: '#1f1c4f', note: 'Protected for upcoming direct debits' },
  { key: 'life', label: 'Westpac Life Bonus Interest Qualifier', amount: 400, color: '#8b23e0', note: 'Below demo bonus growth target', warn: true },
  { key: 'rocket', label: 'Rocket Repay Micro-Offset Sweep', amount: 200, color: '#da1710', note: 'Extra cash towards your home loan' },
  { key: 'safe', label: 'Daily Guilt-Free Safe-to-Spend', amount: 1900, color: '#f43fc8', note: '$135/day for 14 days' },
]

function Donut({ on }: { on: boolean }) {
  const R = 52
  const C = 2 * Math.PI * R
  let acc = 0
  return (
    <svg viewBox="0 0 140 140" className="size-[150px] -rotate-90">
      <circle cx="70" cy="70" r={R} fill="none" stroke="#eceef4" strokeWidth="16" />
      {ALLOC.map((a) => {
        const len = (a.amount / 3600) * C
        const el = (
          <circle
            key={a.key}
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke={a.color}
            strokeWidth="16"
            strokeDasharray={`${on ? len - 2 : 0} ${C}`}
            strokeDashoffset={-acc}
            style={{ transition: 'stroke-dasharray 0.9s cubic-bezier(.2,.8,.2,1)' }}
          />
        )
        acc += len
        return el
      })}
    </svg>
  )
}

function PaydayTab() {
  const { allocated, setAllocated, floatOn, setFloatOn, notify } = useStore()
  return (
    <div>
      <Eyebrow>Payday Autopilot & Zero-Day Offset Float</Eyebrow>
      <p className="mt-1 text-[13px] text-muted">Fortnightly salary · Westpac Choice → Life & Rocket Repay</p>

      <Card className="mt-3 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Incoming · Westpac Choice</div>
            <div className="text-[13px] text-ink">Fortnightly salary · Thursday</div>
          </div>
          <div className="text-[22px] font-bold text-money">+$3,600</div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <div className="relative">
            <Donut on={allocated} />
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-muted">{allocated ? 'Safe-to-spend' : 'Unallocated'}</div>
                <div className="font-display text-[24px] leading-none text-navy">{allocated ? '$135' : '$3,600'}</div>
                {allocated && <div className="text-[10px] font-semibold text-muted">/DAY</div>}
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-1.5 text-[12px]">
            {ALLOC.map((a) => (
              <div key={a.key} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full" style={{ background: a.color }} />
                  {a.key === 'safe' ? 'Safe-to-spend' : a.key === 'rocket' ? 'Rocket Repay' : a.key === 'life' ? 'Life' : 'Bills'}
                </span>
                <span className="font-semibold">${a.amount.toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-line pt-1.5 font-semibold text-navy">
              <span>{allocated ? 'Allocated' : 'To allocate'}</span>
              <span>$3,600</span>
            </div>
          </div>
        </div>
        <PrimaryButton
          className="mt-4"
          tone={allocated ? 'ghost' : 'red'}
          onClick={() => {
            setAllocated(!allocated)
            if (!allocated) notify('Paycheck allocated · $135/day safe-to-spend')
          }}
        >
          <Wand2 className="size-4" /> {allocated ? 'Reset allocation' : '1-Tap AI Allocate Paycheck'}
        </PrimaryButton>
      </Card>

      {allocated && (
        <div className="mt-3 space-y-2">
          {ALLOC.map((a, i) => (
            <Card key={a.key} className="anim-rise flex items-center gap-3 p-3.5">
              <span className="h-10 w-1.5 shrink-0 rounded-full" style={{ background: a.color, animationDelay: `${i * 80}ms` }} />
              <span className="flex-1">
                <span className="block text-[13px] font-semibold text-ink">{a.label}</span>
                <span className={cx('flex items-center gap-1 text-[12px]', a.warn ? 'text-wred' : 'text-muted')}>
                  {a.warn && <TriangleAlert className="size-3" />}
                  {a.note}
                </span>
              </span>
              <span className="text-[15px] font-bold text-navy">${a.amount.toLocaleString()}</span>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-3 overflow-hidden rounded-xl bg-gradient-to-br from-navy to-[#3b1a7a] p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-blush">Shadow Banker move</div>
          <div className="font-display text-[22px] leading-none text-[#7ff0a4]">+${FLOAT_YR}/YR</div>
        </div>
        <h3 className="mt-1 text-[17px] font-bold">11-Day Rocket Repay Offset Float</h3>
        <p className="mt-1.5 text-[13px] leading-snug text-white/80">
          Your $1,100 in Ring-Fenced Bills aren’t due for 9 to 12 days. Float this cash inside your Rocket Repay Offset (6.49% p.a.)
          until 2 hours before each direct debit hits?
        </p>
        <div className="mt-3 flex items-center justify-between rounded-lg bg-white/10 px-3 py-2.5">
          <span className="text-[13px] font-semibold">{floatOn ? 'Offset float active' : 'Turn on offset float'}</span>
          <Toggle
            label="Offset float"
            on={floatOn}
            onChange={(v) => {
              setFloatOn(v)
              if (v) notify(`Offset float on · +$${FLOAT_YR}/yr illustrative`)
            }}
          />
        </div>
        <p className="mt-2 text-[10px] text-white/55">Illustrative +$412/yr scenario; no money moves in this prototype.</p>
      </div>
    </div>
  )
}

type PFilter = 'all' | 'offers' | 'home' | 'bank' | 'safeblock'

function ProductsTab() {
  const { lvrOn, setLvrOn, bonusOn, setBonusOn, notify, blocked } = useStore()
  const [f, setF] = useState<PFilter>('all')
  const show = (k: PFilter) => f === 'all' || f === k
  const taps = bonusOn ? 20 : 17

  return (
    <div>
      <Eyebrow>Products working for you</Eyebrow>
      <div className="no-scrollbar -mx-4 mt-2 flex gap-2 overflow-x-auto px-4">
        {(
          [
            ['all', 'All'],
            ['offers', 'Cash Flow Offers'],
            ['home', 'Home loans'],
            ['bank', 'Bank accounts'],
            ['safeblock', 'SafeBlock AI'],
          ] as [PFilter, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setF(id)}
            className={cx(
              'h-8 shrink-0 rounded-full border px-3 text-[12px] font-medium transition',
              f === id ? 'border-navy bg-navy text-white' : 'border-line bg-white text-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-3">
        {show('home') && (
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Home loans · Rocket Repay</div>
                <div className="mt-1 font-display text-[34px] leading-none text-navy">
                  {lvrOn ? '6.39%' : '6.49%'} <span className="text-[16px]">P.A.</span>
                </div>
                <div className="text-[12px] text-muted">Owner Occupier · {lvrOn ? '6.40%' : '6.50%'} p.a. comparison rate*</div>
              </div>
              {lvrOn && <span className="rounded-full bg-money/10 px-2 py-0.5 text-[11px] font-semibold text-money">-0.10% applied</span>}
            </div>
            <div className="mt-4 rounded-lg bg-mist p-3">
              <p className="text-[12px] font-semibold text-navy">
                Shadow Banker LVR Monitor: your LVR just crossed 69.8% (under 70% threshold)!
              </p>
              <div className="relative mt-3 h-2 rounded-full bg-line">
                <div className="h-full rounded-full bg-gradient-to-r from-money to-[#7ad79a]" style={{ width: '69.8%' }} />
                <span className="absolute -top-1 h-4 w-0.5 bg-wred" style={{ left: '70%' }} />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-muted">
                <span>LVR 69.8%</span>
                <span className="text-wred">70% threshold</span>
              </div>
            </div>
            <PrimaryButton
              className="mt-3 text-[13px]"
              tone={lvrOn ? 'ghost' : 'navy'}
              onClick={() => {
                setLvrOn(!lvrOn)
                if (!lvrOn) notify(`LVR discount requested · +$${LVR_YR.toLocaleString()}/yr`)
              }}
            >
              {lvrOn ? 'Discount applied · Undo' : `Auto-Apply -0.10% p.a. LVR Discount (+$${LVR_YR.toLocaleString()}/yr saved)`}
            </PrimaryButton>
            <p className="mt-2 text-[10px] text-muted">*Illustrative comparison rate. Discount subject to bank approval.</p>
          </Card>
        )}

        {show('bank') && (
          <Card className="p-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Bank accounts · Spend&Save + Westpac Life</div>
            <div className="mt-1 font-display text-[34px] leading-none text-navy">
              5.00% <span className="text-[16px]">P.A.</span>
            </div>
            <div className="text-[12px] text-muted">Illustrative bonus rate</div>
            <div className="mt-4 flex items-center justify-between text-[12px]">
              <span className="font-semibold text-ink">{taps}/20 debit taps completed</span>
              <span className={taps === 20 ? 'font-semibold text-money' : 'text-wred'}>{taps === 20 ? 'Qualified' : `${20 - taps} to go`}</span>
            </div>
            <div className="mt-2 grid grid-cols-10 gap-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <span key={i} className={cx('h-2 rounded-full transition-colors duration-500', i < taps ? 'bg-violet' : 'bg-line')} />
              ))}
            </div>
            <p className="mt-3 text-[12px] text-muted">Shadow Banker spots {20 - 17} taps remaining to qualify this month.</p>
            <PrimaryButton
              className="mt-3 text-[13px]"
              tone={bonusOn ? 'ghost' : 'navy'}
              onClick={() => {
                setBonusOn(!bonusOn)
                if (!bonusOn) notify(`Auto-Micro-Split on · +$${BONUS_YR}/yr`)
              }}
            >
              {bonusOn ? 'Auto-Micro-Split on · Undo' : `Enable Auto-Micro-Split & Guarantee 5.00% p.a. (+$${BONUS_YR}/yr)`}
            </PrimaryButton>
            <p className="mt-2 text-[10px] text-muted">Demo only. Real bonus eligibility depends on account conditions.</p>
          </Card>
        )}

        {show('offers') && (
          <Card className="flex items-center gap-3 p-4">
            <span className="grid size-10 place-items-center rounded-full bg-violet/10 text-violet">
              <Rocket className="size-5" />
            </span>
            <span className="flex-1">
              <span className="block text-[14px] font-semibold">Zero-Day Paycheck Offset Float</span>
              <span className="block text-[12px] text-muted">Park bill money in your offset until it’s due · +${FLOAT_YR}/yr</span>
            </span>
          </Card>
        )}

        {show('safeblock') && (
          <Card className="flex items-center gap-3 p-4">
            <span className="grid size-10 place-items-center rounded-full bg-wred/10 text-wred">
              <ShieldCheck className="size-5" />
            </span>
            <span className="flex-1">
              <span className="block text-[14px] font-semibold">SafeBlock AI</span>
              <span className="block text-[12px] text-muted">
                {blocked.length}/{LEAKS.length} leaks locked · watching 5 recurring merchants
              </span>
            </span>
          </Card>
        )}
      </div>
    </div>
  )
}

function ShieldTab() {
  const { blocked, virtualCard, makeVirtualCard, notify } = useStore()
  const countdown = useCountdown(47 * 3600 + 59 * 60 + 12)
  const locked = LEAKS.filter((l) => blocked.includes(l.id))

  return (
    <div>
      <Eyebrow>SafeBlock & Scam Shield</Eyebrow>
      <Card className="mt-3 flex items-center gap-4 p-4">
        <span className="font-display text-[54px] leading-none text-navy">{locked.length}</span>
        <span className="flex-1">
          <span className="block text-[15px] font-semibold">merchants locked</span>
          <span className="block text-[12px] text-muted">Live Merchant Locks · Demo</span>
        </span>
        <ShieldCheck className="size-9 text-wred" strokeWidth={1.6} />
      </Card>
      {locked.length > 0 && (
        <Card className="mt-2 divide-y divide-line">
          {locked.map((l) => (
            <div key={l.id} className="flex items-center gap-3 px-4 py-2.5 text-[13px]">
              <Lock className="size-3.5 text-money" />
              <span className="flex-1">{l.name}</span>
              <span className="text-muted">${l.monthly}/mo blocked</span>
            </div>
          ))}
        </Card>
      )}

      <Card className="mt-3 p-4">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-wred">
          <Timer className="size-4" /> CloudVault Pro trial · {countdown} until conversion
        </div>
        <p className="mt-1 text-[12px] text-muted">
          Use a single-use card for free trials so they can’t silently convert to paid.
        </p>
        {virtualCard ? (
          <div className="anim-rise mt-3">
            <div className="relative aspect-[1.586] overflow-hidden rounded-xl bg-gradient-to-br from-navy via-[#3b1a7a] to-violet p-4 text-white shadow-lg">
              <span className="absolute -right-8 -top-10 size-36 rounded-full bg-magenta/40 blur-2xl" />
              <div className="relative flex items-center justify-between">
                <WestpacMark className="h-4 w-7 text-white" />
                <span className="rounded bg-white/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">Single-use</span>
              </div>
              <div className="relative mt-7 font-mono text-[17px] tracking-[0.12em]">{virtualCard.number}</div>
              <div className="relative mt-3 flex gap-6 text-[11px]">
                <span>
                  <span className="block text-white/60">EXP</span>
                  {virtualCard.expiry}
                </span>
                <span>
                  <span className="block text-white/60">CVC</span>
                  {virtualCard.cvc}
                </span>
                <span className="ml-auto self-end text-white/70">{virtualCard.merchant}</span>
              </div>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted">Simulated card, not valid for payments.</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <PrimaryButton tone="ghost" onClick={() => notify('Card number copied (demo)')}>
                <Copy className="size-4" /> Copy
              </PrimaryButton>
              <PrimaryButton tone="navy" onClick={makeVirtualCard}>
                <CreditCard className="size-4" /> New card
              </PrimaryButton>
            </div>
          </div>
        ) : (
          <PrimaryButton className="mt-3 text-[13px]" onClick={makeVirtualCard}>
            <CreditCard className="size-4" /> Generate Single-Use Virtual Card for Free Trials
          </PrimaryButton>
        )}
      </Card>

      <Card className="mt-3 p-4">
        <h3 className="text-[14px] font-semibold text-navy">Westpac SaferPay checks</h3>
        <p className="mt-1 text-[12px] text-muted">
          New payees get a quick scam check before money leaves your account. Try it from Payments → Pay someone.
        </p>
      </Card>
    </div>
  )
}
