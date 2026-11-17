import { CircleDollarSign, Coins, LayoutGrid, Lightbulb } from 'lucide-react'
import type { ReactNode } from 'react'
import { useStore, type TabName } from '../store'
import { cx, WestpacMark } from './ui'

const TABS: { id: TabName; label: string; icon: (on: boolean) => ReactNode }[] = [
  { id: 'home', label: 'Home', icon: (on) => <WestpacMark className="h-[15px] w-[26px]" outline={!on} /> },
  { id: 'accounts', label: 'Accounts', icon: () => <Coins className="size-[21px]" strokeWidth={1.7} /> },
  { id: 'payments', label: 'Payments', icon: () => <CircleDollarSign className="size-[21px]" strokeWidth={1.7} /> },
  { id: 'insights', label: 'Insights', icon: () => <Lightbulb className="size-[21px]" strokeWidth={1.7} /> },
  { id: 'more', label: 'More', icon: () => <LayoutGrid className="size-[21px]" strokeWidth={1.7} /> },
]

const TAB_OF: Record<string, TabName> = {
  home: 'home',
  accounts: 'accounts',
  account: 'accounts',
  payments: 'payments',
  pay: 'payments',
  insights: 'insights',
  cashflow: 'insights',
  bills: 'insights',
  iq: 'insights',
  more: 'more',
}

const HIDE_TABS = new Set(['pay', 'saferpay', 'paid', 'search', 'cashflow', 'bills'])

function StatusBar({ light }: { light: boolean }) {
  return (
    <div
      className={cx(
        'pointer-events-none absolute inset-x-0 top-0 z-40 flex h-11 items-center justify-between px-8 pt-1 text-[15px] font-semibold',
        light ? 'text-white' : 'text-ink',
      )}
    >
      <span>9:41</span>
      <span className="flex items-center gap-1.5">
        <svg viewBox="0 0 18 12" className="h-3 w-[18px]" fill="currentColor" aria-hidden>
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 16 12" className="h-3 w-4" fill="currentColor" aria-hidden>
          <path d="M8 2.2c2.4 0 4.6.9 6.2 2.5l1.3-1.3A10.6 10.6 0 0 0 8 .4 10.6 10.6 0 0 0 .5 3.4l1.3 1.3A8.8 8.8 0 0 1 8 2.2Zm0 3.5c1.4 0 2.7.5 3.7 1.4L13 5.8A7.1 7.1 0 0 0 8 3.9a7.1 7.1 0 0 0-5 1.9l1.3 1.3A5.3 5.3 0 0 1 8 5.7Zm0 3.5c.5 0 .9.1 1.2.4L8 11.6 6.8 9.6c.3-.3.7-.4 1.2-.4Z" />
        </svg>
        <span className="relative ml-0.5 h-[12px] w-[24px] rounded-[3.5px] border border-current/40 p-[1.5px]">
          <span className="block h-full w-[80%] rounded-[1.5px] bg-current" />
        </span>
      </span>
    </div>
  )
}

export function Phone({ children, lightStatus, overlay }: { children: ReactNode; lightStatus: boolean; overlay?: ReactNode }) {
  const { route, reset, toast } = useStore()
  const activeTab = TAB_OF[route.name]
  const showTabs = !HIDE_TABS.has(route.name)

  return (
    <div className="relative h-[844px] w-[390px] rounded-[62px] bg-[#1b1b1f] p-[13px] shadow-[0_40px_80px_-20px_rgb(20_10_40/0.55),inset_0_0_0_2px_#3a3a40,inset_0_0_0_6px_#0d0d10]">
      {/* side buttons */}
      <span className="absolute -left-[3px] top-[150px] h-8 w-[3px] rounded-l bg-[#2a2a30]" />
      <span className="absolute -left-[3px] top-[200px] h-14 w-[3px] rounded-l bg-[#2a2a30]" />
      <span className="absolute -left-[3px] top-[268px] h-14 w-[3px] rounded-l bg-[#2a2a30]" />
      <span className="absolute -right-[3px] top-[220px] h-20 w-[3px] rounded-r bg-[#2a2a30]" />

      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[49px] bg-mist">
        {/* notch */}
        <div className="absolute left-1/2 top-0 z-50 h-[30px] w-[160px] -translate-x-1/2 rounded-b-[20px] bg-[#1b1b1f]">
          <span className="absolute right-9 top-[9px] size-[9px] rounded-full bg-[#15152a] ring-1 ring-[#2c2c44]" />
        </div>
        <StatusBar light={lightStatus} />

        <div key={route.name} className="relative min-h-0 flex-1 overflow-hidden">
          {children}
        </div>

        {showTabs && (
          <nav className="relative z-30 flex h-[82px] shrink-0 items-start justify-around border-t border-line bg-white px-2 pt-2">
            {TABS.map((t) => {
              const on = t.id === activeTab
              return (
                <button
                  key={t.id}
                  onClick={() => reset([{ name: t.id }])}
                  className={cx(
                    'flex w-16 flex-col items-center gap-1 text-[11px] transition',
                    on ? 'font-semibold text-wred' : 'text-ink/70 hover:text-ink',
                  )}
                >
                  <span className="grid h-6 place-items-center">{t.icon(on)}</span>
                  {t.label}
                </button>
              )
            })}
          </nav>
        )}

        {overlay}

        {toast && (
          <div className="anim-rise absolute inset-x-5 bottom-28 z-[60] rounded-lg bg-navy px-4 py-3 text-[13px] font-medium text-white shadow-xl">
            {toast}
          </div>
        )}

        {/* home indicator */}
        <div className="pointer-events-none absolute bottom-2 left-1/2 z-[70] h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-ink/85" />
      </div>
    </div>
  )
}

/** Scrollable screen body. */
export function Screen({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={cx('no-scrollbar anim-fade h-full overflow-y-auto pb-10', className)}>{children}</div>
}
