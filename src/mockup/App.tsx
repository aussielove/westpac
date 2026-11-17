import {
  CalendarDays,
  ChartColumn,
  ChartLine,
  CircleDollarSign,
  Coins,
  LayoutGrid,
  Search as SearchIcon,
  ShieldHalf,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { AiSheet } from './components/AiSheet'
import { Decor, type DecorKind } from './components/Decor'
import { Phone } from './components/Phone'
import { cx, WestpacMark } from './components/ui'
import { AccountDetail, Accounts } from './screens/Accounts'
import { Bills } from './screens/Bills'
import { CashFlow } from './screens/CashFlow'
import { CashFlowIQ } from './screens/CashFlowIQ'
import { Home } from './screens/Home'
import { Insights } from './screens/Insights'
import { More } from './screens/More'
import { Paid, PayForm, Payments, SaferPay } from './screens/Payments'
import { Search } from './screens/Search'
import { StoreProvider, useStore, type Route, type RouteName } from './store'

type ThemeKey = 'home' | 'accounts' | 'iq' | 'payments' | 'saferpay' | 'insights' | 'cashflow' | 'bills' | 'search' | 'more'

type Theme = {
  bg: string
  lines: [string, string, string?]
  colors: [string, string, string?]
  icon: LucideIcon | 'mark'
  decor: DecorKind
  sub: string
  dark: boolean
}

const THEMES: Record<ThemeKey, Theme> = {
  home: {
    bg: '#da1710',
    lines: ['Take control of', 'your money'],
    colors: ['#fdd5f6', '#ffffff'],
    icon: 'mark',
    decor: 'network',
    sub: 'Every account, card and home loan in one place, with a Shadow Private Banker watching your back.',
    dark: true,
  },
  accounts: {
    bg: '#ffffff',
    lines: ['Your money,', 'your way.', 'Westpac app'],
    colors: ['#1f1c4f', '#1f1c4f', '#da1710'],
    icon: Coins,
    decor: 'confetti',
    sub: 'See what you have and what you owe at a glance. Tap any account for transactions.',
    dark: false,
  },
  iq: {
    bg: '#15133a',
    lines: ['Save over $12K', 'in interest'],
    colors: ['#ffffff', '#ff5a52'],
    icon: Sparkles,
    decor: 'glow',
    sub: 'Cash Flow IQ finds leaks, gives every dollar a job and sweeps the difference into your Rocket Repay home loan.',
    dark: true,
  },
  payments: {
    bg: '#e2bdf1',
    lines: ['Simple & safe', 'payments'],
    colors: ['#8b23e0', '#1f1c4f'],
    icon: CircleDollarSign,
    decor: 'rings',
    sub: 'Transfer, Pay someone, PayID and BPAY. New payees get a SaferPay check before money moves.',
    dark: false,
  },
  saferpay: {
    bg: '#da1710',
    lines: ['Keep your money', 'protected'],
    colors: ['#fdd5f6', '#ffffff'],
    icon: ShieldHalf,
    decor: 'hex',
    sub: 'Westpac SaferPay asks a few quick questions to stop investment, romance and impersonation scams.',
    dark: true,
  },
  insights: {
    bg: '#da1710',
    lines: ['Easy to follow', 'insights'],
    colors: ['#fdd5f6', '#ffffff'],
    icon: ChartLine,
    decor: 'sparkles',
    sub: 'Money tools that explain where it went and what to do next: cash flow, categories, bills and budgets.',
    dark: true,
  },
  cashflow: {
    bg: '#ffffff',
    lines: ['All in one', 'cash flow'],
    colors: ['#1f1c4f', '#8b23e0'],
    icon: ChartColumn,
    decor: 'confetti',
    sub: 'Money in versus money out, month by month. Tap a bar to dig into any month.',
    dark: false,
  },
  bills: {
    bg: '#e2bdf1',
    lines: ['Stay on top', 'bills calendar'],
    colors: ['#8b23e0', '#1f1c4f'],
    icon: CalendarDays,
    decor: 'circles',
    sub: 'Every bill on one calendar: what’s paid, what’s due, and what SafeBlock has already stopped.',
    dark: false,
  },
  search: {
    bg: '#fdd5f6',
    lines: ['Find it fast', 'smart search'],
    colors: ['#f43fc8', '#1f1c4f'],
    icon: SearchIcon,
    decor: 'bolts',
    sub: 'Search self-serve tasks, transactions and payees from one box.',
    dark: false,
  },
  more: {
    bg: '#fdd5f6',
    lines: ['Discover much', 'more'],
    colors: ['#f43fc8', '#1f1c4f'],
    icon: LayoutGrid,
    decor: 'stars',
    sub: 'Products, calculators, services, rewards and offers, all a tap away.',
    dark: false,
  },
}

const THEME_OF: Record<RouteName, ThemeKey> = {
  home: 'home',
  accounts: 'accounts',
  account: 'accounts',
  payments: 'payments',
  pay: 'payments',
  paid: 'payments',
  saferpay: 'saferpay',
  insights: 'insights',
  cashflow: 'cashflow',
  bills: 'bills',
  search: 'search',
  more: 'more',
  iq: 'iq',
}

const FEATURES: { key: ThemeKey; label: string; icon: LucideIcon | 'mark'; stack: Route[] }[] = [
  { key: 'home', label: 'Home', icon: 'mark', stack: [{ name: 'home' }] },
  { key: 'iq', label: 'Cash Flow IQ', icon: Sparkles, stack: [{ name: 'home' }, { name: 'iq' }] },
  { key: 'accounts', label: 'Accounts', icon: Coins, stack: [{ name: 'accounts' }] },
  { key: 'payments', label: 'Payments', icon: CircleDollarSign, stack: [{ name: 'payments' }] },
  {
    key: 'saferpay',
    label: 'SaferPay',
    icon: ShieldHalf,
    stack: [{ name: 'payments' }, { name: 'pay', mode: 'someone' }, { name: 'saferpay' }],
  },
  { key: 'insights', label: 'Insights', icon: ChartLine, stack: [{ name: 'insights' }] },
  { key: 'cashflow', label: 'Cash flow', icon: ChartColumn, stack: [{ name: 'insights' }, { name: 'cashflow' }] },
  { key: 'bills', label: 'Bills', icon: CalendarDays, stack: [{ name: 'insights' }, { name: 'bills' }] },
  { key: 'search', label: 'Search', icon: SearchIcon, stack: [{ name: 'home' }, { name: 'search', q: 'Card' }] },
  { key: 'more', label: 'More', icon: LayoutGrid, stack: [{ name: 'more' }] },
]

function ScreenFor({ route }: { route: Route }) {
  switch (route.name) {
    case 'home':
      return <Home />
    case 'accounts':
      return <Accounts />
    case 'account':
      return <AccountDetail id={route.id} />
    case 'payments':
      return <Payments />
    case 'pay':
      return <PayForm mode={route.mode} />
    case 'saferpay':
      return <SaferPay />
    case 'paid':
      return <Paid />
    case 'insights':
      return <Insights />
    case 'cashflow':
      return <CashFlow />
    case 'bills':
      return <Bills />
    case 'search':
      return <Search initial={route.q} />
    case 'more':
      return <More />
    case 'iq':
      return <CashFlowIQ initialTab={route.tab} />
  }
}

function usePhoneScale() {
  const calc = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    if (w >= 1024) return Math.min(1, (h - 56) / 872)
    return Math.min(1, (w - 40) / 400)
  }
  const [scale, setScale] = useState(calc)
  useEffect(() => {
    const on = () => setScale(calc())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return Math.max(0.55, scale)
}

function HeadlineIcon({ icon, className }: { icon: Theme['icon']; className?: string }) {
  if (icon === 'mark') return <WestpacMark className={cx(className, 'w-[1.5em]')} outline />
  const I = icon
  return <I className={className} strokeWidth={2.4} />
}

function Showcase() {
  const { route, reset, setDraft, draft, closeAi } = useStore()
  const key = THEME_OF[route.name]
  const t = THEMES[key]
  const scale = usePhoneScale()
  const lightStatus = route.name === 'home' || route.name === 'iq'

  const go = (f: (typeof FEATURES)[number]) => {
    closeAi()
    if (f.key === 'saferpay' && !draft)
      setDraft({ mode: 'someone', from: 'choice', to: 'p3', amount: 2500, description: 'Crypto opportunity' })
    reset(f.stack)
    history.replaceState(null, '', `#${f.key}`)
  }

  // Deep link: #iq, #payments, #bills… opens that feature on load.
  useEffect(() => {
    const f = FEATURES.find((x) => x.key === location.hash.slice(1))
    if (f) go(f)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative min-h-full overflow-hidden transition-colors duration-700" style={{ background: t.bg }}>
      <Decor kind={t.decor} />

      <header className={cx('relative z-10 flex items-center justify-between px-6 py-5 lg:px-12', t.dark ? 'text-white' : 'text-navy')}>
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-12 place-items-center rounded-md bg-white shadow-sm">
            <WestpacMark className="h-[18px] w-8 text-wred" />
          </span>
          <span className="text-[15px] font-bold tracking-tight">Westpac</span>
          <span className={cx('hidden text-[13px] sm:inline', t.dark ? 'text-white/70' : 'text-navy/60')}>App mockup · Cash Flow IQ</span>
        </div>
        <span
          className={cx(
            'rounded-full px-3 py-1 text-[12px] font-medium',
            t.dark ? 'bg-white/15 text-white' : 'bg-navy/[0.07] text-navy',
          )}
        >
          Interactive prototype
        </span>
      </header>

      <main className="relative z-10 mx-auto grid max-w-[1320px] items-center gap-10 px-6 pb-12 lg:min-h-[calc(100vh-80px)] lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16 lg:px-12 lg:pb-6">
        <section key={key} className="anim-rise max-w-[640px]">
          <h1 className="font-display text-[56px] uppercase leading-[0.95] tracking-[0.005em] sm:text-[78px] xl:text-[96px]">
            <span className="block" style={{ color: t.colors[0] }}>
              {t.lines[0]}
            </span>
            <span className="flex items-center gap-[0.18em]" style={{ color: t.colors[1] }}>
              {!t.lines[2] && <HeadlineIcon icon={t.icon} className="h-[0.78em] w-[0.78em] shrink-0" />}
              {t.lines[1]}
            </span>
            {t.lines[2] && (
              <span className="block" style={{ color: t.colors[2] }}>
                {t.lines[2]}
              </span>
            )}
          </h1>
          <p className={cx('mt-6 max-w-[480px] text-[17px] leading-relaxed', t.dark ? 'text-white/85' : 'text-navy/75')}>{t.sub}</p>

          <div className="mt-10">
            <div className={cx('mb-3 font-display text-[22px] uppercase tracking-wide', t.dark ? 'text-white' : 'text-navy')}>All in one</div>
            <nav aria-label="Jump to feature" className="flex max-w-[600px] flex-wrap gap-2">
              {FEATURES.map((f) => {
                const on = f.key === key
                return (
                  <button
                    key={f.key}
                    onClick={() => go(f)}
                    aria-current={on ? 'page' : undefined}
                    className={cx(
                      'flex h-10 items-center gap-2 rounded-full px-3.5 text-[13px] font-semibold transition',
                      on
                        ? t.dark
                          ? 'bg-white text-navy shadow-lg'
                          : 'bg-navy text-white shadow-lg'
                        : t.dark
                          ? 'bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20'
                          : 'bg-white/60 text-navy ring-1 ring-navy/15 hover:bg-white',
                    )}
                  >
                    <HeadlineIcon icon={f.icon} className="size-4" />
                    {f.label}
                  </button>
                )
              })}
            </nav>
            <p className={cx('mt-6 text-[12px]', t.dark ? 'text-white/55' : 'text-navy/50')}>
              Demo data and illustrative savings only. No live banking, merchant cancellation or rate approvals.
            </p>
          </div>
        </section>

        <div className="mx-auto" style={{ width: 390 * scale, height: 844 * scale }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            <Phone lightStatus={lightStatus} overlay={<AiSheet />}>
              <ScreenFor route={route} />
            </Phone>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Showcase />
    </StoreProvider>
  )
}
