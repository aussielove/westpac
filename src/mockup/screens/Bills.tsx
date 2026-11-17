import { ChevronLeft, ChevronRight, CircleDollarSign, ShieldCheck } from 'lucide-react'
import { useMemo, useState } from 'react'
import { BILLS, fmtDay, money, MONTHS_LONG, TODAY, type Bill } from '../data'
import { Screen } from '../components/Phone'
import { cx, NavHeader } from '../components/ui'
import { useStore } from '../store'

type Status = 'paid' | 'overdue' | 'upcoming' | 'blocked'
type Entry = { bill: Bill; date: Date; status: Status; key: string }

const MONTHS = [9, 10, 11] // Oct, Nov, Dec 2026

function buildMonth(month: number, blocked: string[], paid: string[]): Entry[] {
  const out: Entry[] = []
  for (const b of BILLS) {
    const days = b.freq === 'Fortnightly' ? [b.day - 14, b.day] : [b.day]
    if (b.freq === 'Quarterly' && (month - 10) % 3 !== 0) continue
    for (const d of days) {
      if (d < 1) continue
      const date = new Date(2026, month, d)
      const key = `${b.id}-${month}-${d}`
      let status: Status
      if (b.leak && blocked.includes(b.leak) && date >= TODAY) status = 'blocked'
      else if (paid.includes(key)) status = 'paid'
      else if (date < TODAY) status = b.id === 'yt' && month === 10 ? 'overdue' : 'paid'
      else status = 'upcoming'
      out.push({ bill: b, date, status, key })
    }
  }
  return out.sort((a, b) => a.date.getTime() - b.date.getTime())
}

const DOT: Record<Status, string> = {
  paid: 'bg-navy',
  overdue: 'border-[1.5px] border-wred',
  upcoming: 'border-[1.5px] border-muted/70',
  blocked: 'bg-money',
}

export function Bills() {
  const { blocked, billsPaid, payBill, notify, push } = useStore()
  const [mi, setMi] = useState(1)
  const [day, setDay] = useState<number | null>(null)
  const month = MONTHS[mi]
  const entries = useMemo(() => buildMonth(month, blocked, billsPaid), [month, blocked, billsPaid])
  const first = new Date(2026, month, 1)
  const lead = (first.getDay() + 6) % 7
  const daysIn = new Date(2026, month + 1, 0).getDate()
  const left = entries.filter((e) => e.status === 'upcoming' || e.status === 'overdue').reduce((s, e) => s + e.bill.amount, 0)
  const total = entries.filter((e) => e.status !== 'blocked').reduce((s, e) => s + e.bill.amount, 0)
  const list = day ? entries.filter((e) => e.date.getDate() === day) : entries
  const groups = list.reduce<Record<string, Entry[]>>((g, e) => {
    const k = fmtDay(e.date, true)
    ;(g[k] ??= []).push(e)
    return g
  }, {})
  const isThisMonth = month === TODAY.getMonth()

  return (
    <Screen className="anim-slide bg-mist">
      <NavHeader title="Bills calendar" action="Manage" onAction={() => push({ name: 'iq', tab: 'safeblock' })} />
      <div className="bg-white px-4 pb-4">
        <div className="flex items-center justify-between">
          <button aria-label="Previous month" disabled={mi === 0} onClick={() => (setMi(mi - 1), setDay(null))} className="p-1 text-wred disabled:opacity-30">
            <ChevronLeft className="size-5" />
          </button>
          <div className="text-center">
            <div className="text-[15px] font-semibold text-ink">
              {MONTHS_LONG[month]} 2026
            </div>
            <div className="text-[28px] font-bold leading-tight tracking-tight text-navy">{money(left)}</div>
            <div className="text-[12px] text-muted">Left to pay</div>
          </div>
          <button
            aria-label="Next month"
            disabled={mi === MONTHS.length - 1}
            onClick={() => (setMi(mi + 1), setDay(null))}
            className="p-1 text-wred disabled:opacity-30"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 text-center text-[11px] font-medium text-muted">
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-y-0.5 text-center">
          {Array.from({ length: lead }).map((_, i) => (
            <span key={`l${i}`} />
          ))}
          {Array.from({ length: daysIn }).map((_, i) => {
            const d = i + 1
            const dots = entries.filter((e) => e.date.getDate() === d)
            const today = isThisMonth && d === TODAY.getDate()
            return (
              <button
                key={d}
                onClick={() => setDay(day === d ? null : d)}
                className={cx('flex h-11 flex-col items-center justify-start rounded-md pt-1.5 transition', day === d ? 'bg-navy/[0.07]' : 'hover:bg-mist')}
              >
                <span className={cx('text-[14px] leading-none', today ? 'font-bold text-ink' : 'text-ink/80')}>{d}</span>
                <span className="mt-1.5 flex gap-[2px]">
                  {dots.slice(0, 3).map((e) => (
                    <span key={e.key} className={cx('size-[6px] rounded-full', DOT[e.status])} />
                  ))}
                </span>
              </button>
            )
          })}
        </div>
        <div className="mt-2 flex justify-center gap-4 text-[11px] text-muted">
          {(['paid', 'upcoming', 'overdue', 'blocked'] as Status[]).map((s) => (
            <span key={s} className="flex items-center gap-1 capitalize">
              <span className={cx('size-[6px] rounded-full', DOT[s])} />
              {s === 'blocked' ? 'SafeBlocked' : s}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between border-y border-line bg-mist px-4 py-3">
        <span className="text-[16px] font-bold text-navy">{day ? `Bills on the ${day}` : 'Total bills'}</span>
        <span className="text-[16px] font-bold text-navy">{money(day ? list.reduce((s, e) => s + e.bill.amount, 0) : total)}</span>
      </div>

      <div className="bg-white px-4">
        {Object.entries(groups).map(([label, items]) => (
          <div key={label} className="border-b border-line py-2">
            <div className="py-1.5 text-[13px] text-muted">{label}</div>
            {items.map((e) => (
              <div key={e.key} className="flex items-center gap-3 py-2">
                <span className={cx('grid size-8 place-items-center rounded-full text-white', e.status === 'blocked' ? 'bg-money' : 'bg-muted')}>
                  {e.status === 'blocked' ? <ShieldCheck className="size-4" /> : <CircleDollarSign className="size-4" />}
                </span>
                <span className="flex-1">
                  <span className={cx('block text-[14px]', e.status === 'blocked' && 'text-muted line-through')}>{e.bill.name}</span>
                  <span className="block text-[12px] text-muted">{e.bill.freq}</span>
                </span>
                <span className="text-right">
                  <span className={cx('block text-[14px] font-medium', e.status === 'blocked' && 'text-muted line-through')}>
                    {money(e.bill.amount)}
                  </span>
                  {e.status === 'overdue' ? (
                    <button
                      onClick={() => {
                        payBill(e.key)
                        notify(`${e.bill.name} paid · ${money(e.bill.amount)}`)
                      }}
                      className="text-[12px] font-semibold text-wred underline-offset-2 hover:underline"
                    >
                      Overdue · Pay
                    </button>
                  ) : (
                    <span
                      className={cx(
                        'block text-[12px]',
                        e.status === 'paid' && 'text-muted',
                        e.status === 'upcoming' && 'text-navy',
                        e.status === 'blocked' && 'font-medium text-money',
                      )}
                    >
                      {e.status === 'blocked' ? 'SafeBlocked' : e.status === 'paid' ? 'Paid' : 'Upcoming'}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        ))}
        {list.length === 0 && <p className="py-8 text-center text-[14px] text-muted">No bills on this day</p>}
      </div>
    </Screen>
  )
}
