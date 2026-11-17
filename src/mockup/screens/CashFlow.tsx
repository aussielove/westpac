import { ArrowDownLeft, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { CASHFLOW, CATEGORIES, money } from '../data'
import { Screen } from '../components/Phone'
import { Card, cx, NavHeader } from '../components/ui'
import { useStore } from '../store'

const MAX = 8000

export function CashFlow() {
  const { notify } = useStore()
  const [sel, setSel] = useState(3)
  const [eligibleOnly, setEligibleOnly] = useState(true)
  const factor = eligibleOnly ? 1 : 1.08
  const m = CASHFLOW[sel]
  const inc = m.income * factor
  const exp = m.expenses * factor
  const totalIn = CASHFLOW.reduce((s, x) => s + x.income, 0) * 2 * factor
  const totalOut = CASHFLOW.reduce((s, x) => s + x.expenses, 0) * 2 * factor

  return (
    <Screen className="anim-slide bg-mist">
      <NavHeader
        title="Cash flow"
        action="Filter"
        onAction={() => {
          setEligibleOnly((v) => !v)
          notify(eligibleOnly ? 'Showing all accounts incl. Altitude Black' : 'Showing eligible accounts only')
        }}
      />
      <div className="bg-white px-4 pb-5">
        <div className="relative h-[210px]">
          {[0, 4000, 8000].map((v) => (
            <div key={v} className="absolute inset-x-0 border-t border-dashed border-line" style={{ bottom: `${(v / MAX) * 170 + 26}px` }}>
              <span className="absolute -top-4 left-0 text-[10px] text-muted">{v ? `$${v / 1000}k` : '$0'}</span>
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-0 flex h-full items-end justify-around pl-6">
            {CASHFLOW.map((x, i) => (
              <button key={x.key} onClick={() => setSel(i)} className="group flex flex-col items-center" aria-label={x.label}>
                <div className="flex h-[170px] items-end">
                  <span
                    className={cx('w-[17px] rounded-t-[3px] bg-navy transition-all duration-500', sel !== i && 'opacity-35 group-hover:opacity-60')}
                    style={{ height: `${((x.income * factor) / MAX) * 170}px` }}
                  />
                  <span
                    className={cx('-ml-1 w-[17px] rounded-t-[3px] bg-violet transition-all duration-500', sel !== i && 'opacity-35 group-hover:opacity-60')}
                    style={{ height: `${((x.expenses * factor) / MAX) * 170}px` }}
                  />
                </div>
                <span className={cx('mt-1.5 text-[11px]', sel === i ? 'font-semibold text-ink' : 'text-muted')}>{x.short}</span>
                <span className={cx('mt-1 h-0.5 w-8 rounded-full', sel === i ? 'bg-wred' : 'bg-transparent')} />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button aria-label="Previous month" disabled={sel === 0} onClick={() => setSel(sel - 1)} className="text-wred disabled:opacity-30">
            <ChevronLeft className="size-5" />
          </button>
          <div className="text-center">
            <div className="text-[16px] font-semibold text-ink">{m.label}</div>
            <div key={sel} className="anim-fade text-[32px] font-bold tracking-tight text-navy">
              {money(inc - exp)}
            </div>
            <div className="text-[12px] text-muted">{eligibleOnly ? 'From eligible accounts' : 'From all accounts'}</div>
          </div>
          <button
            aria-label="Next month"
            disabled={sel === CASHFLOW.length - 1}
            onClick={() => setSel(sel + 1)}
            className="text-wred disabled:opacity-30"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="mt-5 divide-y divide-line border-y border-line">
          <div className="flex items-center gap-3 py-3">
            <span className="grid size-9 place-items-center rounded-full bg-navy text-white">
              <ArrowDownLeft className="size-4" />
            </span>
            <span className="flex-1 text-[15px]">Income</span>
            <span className="text-[15px] font-semibold text-money">{money(inc)}</span>
          </div>
          <div className="flex items-center gap-3 py-3">
            <span className="grid size-9 place-items-center rounded-full bg-violet text-white">
              <ArrowUpRight className="size-4" />
            </span>
            <span className="flex-1 text-[15px]">Expenses</span>
            <span className="text-[15px] font-semibold text-ink">{money(-exp)}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h2 className="mb-3 text-[18px] font-bold text-navy">Highlights</h2>
        <Card className="p-4">
          <div className="text-[15px] font-semibold text-navy">Last 12 months</div>
          <div className="text-[12px] text-muted">December 2025 to November 2026</div>
          <div className="mt-2 text-[28px] font-bold text-ink">{money(totalIn - totalOut)}</div>
          <div className="mt-2 flex gap-6 text-[13px]">
            <span>
              <span className="text-muted">Income </span>
              <span className="font-semibold text-money">{money(totalIn, { cents: false })}</span>
            </span>
            <span>
              <span className="text-muted">Expenses </span>
              <span className="font-semibold">{money(-totalOut, { cents: false })}</span>
            </span>
          </div>
        </Card>
        <Card className="mt-3 p-4">
          <div className="text-[15px] font-semibold text-navy">Top spending in {m.short}</div>
          <div className="mt-3 space-y-3">
            {CATEGORIES.slice(0, 4).map((c) => {
              const amt = (c.amount * exp) / 3946.18
              return (
                <div key={c.name}>
                  <div className="flex justify-between text-[13px]">
                    <span>{c.name}</span>
                    <span className="font-medium">{money(-amt)}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-mist">
                    <div className="h-full rounded-full" style={{ width: `${(c.amount / 1420) * 100}%`, background: c.color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </Screen>
  )
}
