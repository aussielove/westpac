import { Clock, Mic, Plane, Search as SearchIcon, Sprout } from 'lucide-react'
import { useState } from 'react'
import { fmtDate, money, PAYEES, SELF_SERVE } from '../data'
import { Screen } from '../components/Phone'
import { cx, Highlight } from '../components/ui'
import { useStore, type Route } from '../store'

type Filter = 'top' | 'self' | 'txns' | 'payees'

const SELF_ROUTES: Record<string, Route> = {
  'Bills calendar': { name: 'bills' },
  'Cash flow': { name: 'cashflow' },
  'Digital card': { name: 'iq', tab: 'shield' },
  'Generate single-use virtual card': { name: 'iq', tab: 'shield' },
  'SafeBlock merchant controls': { name: 'iq', tab: 'safeblock' },
  'Payday Autopilot': { name: 'iq', tab: 'payday' },
  'Set up PayID': { name: 'pay', mode: 'payid' },
}

export function Search({ initial = '' }: { initial?: string }) {
  const { back, push, notify, txns } = useStore()
  const [q, setQ] = useState(initial)
  const [filter, setFilter] = useState<Filter>('top')
  const [showAllSelf, setShowAllSelf] = useState(false)
  const [showTxns, setShowTxns] = useState(false)
  const query = q.trim()
  const ql = query.toLowerCase()

  const self = query ? SELF_SERVE.filter((s) => s.toLowerCase().includes(ql)) : []
  const tx = query ? txns.filter((t) => t.title.toLowerCase().includes(ql) || t.category.toLowerCase().includes(ql)) : []
  const payees = query ? PAYEES.filter((p) => p.name.toLowerCase().includes(ql) || p.detail.toLowerCase().includes(ql)) : []
  const selfShown = filter === 'self' || showAllSelf ? self : self.slice(0, 3)

  const openSelf = (s: string) => {
    const r = SELF_ROUTES[s]
    if (r) push(r)
    else notify(`${s} · opening self-serve…`)
  }

  const show = (f: Filter) => filter === 'top' || filter === f

  return (
    <Screen className="anim-fade bg-white">
      <div className="flex items-center gap-3 px-4 pt-14">
        <label className="flex h-11 flex-1 items-center gap-2 rounded-md border border-line px-3 focus-within:border-navy">
          <SearchIcon className="size-[18px] text-ink" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-[16px] outline-none placeholder:text-muted"
          />
          <Mic className="size-[18px] text-ink" />
        </label>
        <button onClick={back} className="text-[15px] font-medium text-wred">
          Cancel
        </button>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
        {(
          [
            ['top', 'Top'],
            ['self', 'Self-serve'],
            ['txns', 'Transactions'],
            ['payees', 'Payees & billers'],
          ] as [Filter, string][]
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={cx(
              'h-7 shrink-0 rounded-[4px] border px-3 text-[13px] transition',
              filter === id ? 'border-navy bg-navy text-white' : 'border-ink/40 text-ink hover:border-navy',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {!query ? (
        <div className="px-5 pt-3">
          <h3 className="text-[16px] font-semibold text-navy">Recent searches</h3>
          <div className="mt-2">
            {['Card', 'Netflix', 'Bills calendar', 'Rocket Repay'].map((s) => (
              <button key={s} onClick={() => setQ(s)} className="flex w-full items-center gap-3 py-2.5 text-left text-[15px] text-ink">
                <Clock className="size-4 text-muted" /> {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-5 pb-6">
          {show('self') && (
            <section className="border-b border-line py-3">
              <h3 className="text-[17px] font-semibold text-navy">Self-serve</h3>
              {selfShown.map((s) => (
                <button key={s} onClick={() => openSelf(s)} className="block w-full py-2.5 text-left text-[15px] text-ink">
                  <Highlight text={s} q={query} />
                </button>
              ))}
              {self.length === 0 && <p className="py-2 text-[14px] text-muted">No self-serve matches</p>}
              {filter === 'top' && !showAllSelf && self.length > 3 && (
                <button onClick={() => setShowAllSelf(true)} className="py-2.5 text-[15px] font-medium text-wred">
                  Show {self.length - 3} more results
                </button>
              )}
            </section>
          )}
          {show('txns') && (
            <section className="border-b border-line py-3">
              <h3 className="text-[17px] font-semibold text-navy">Transactions</h3>
              {showTxns || filter === 'txns' ? (
                tx.length ? (
                  tx.map((t) => (
                    <div key={t.id} className="flex justify-between py-2.5 text-[14px]">
                      <span>
                        <Highlight text={t.title} q={query} />
                        <span className="block text-[12px] text-muted">{fmtDate(t.date)}</span>
                      </span>
                      <span className={t.amount > 0 ? 'font-semibold text-money' : 'font-semibold'}>{money(t.amount, { sign: true })}</span>
                    </div>
                  ))
                ) : (
                  <p className="py-2 text-[14px] text-muted">No transactions for ‘{query}’</p>
                )
              ) : (
                <button onClick={() => setShowTxns(true)} className="block py-2.5 text-[15px] font-medium text-wred">
                  Show transactions for ‘{query}’
                </button>
              )}
              <button onClick={() => push({ name: 'account', id: 'choice' })} className="block py-2.5 text-[15px] font-medium text-wred">
                Show all recent transactions
              </button>
            </section>
          )}
          {show('payees') && (
            <section className="py-3">
              <h3 className="text-[17px] font-semibold text-navy">Payees & billers</h3>
              {payees.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => push({ name: 'pay', mode: p.kind === 'biller' ? 'bpay' : 'someone' })}
                  className="block w-full py-2.5 text-left"
                >
                  <span className="flex items-center gap-1.5 text-[15px] text-ink">
                    {i % 2 ? <Sprout className="size-4 text-money" /> : <Plane className="size-4 text-wred" />}
                    Pay{' '}
                    <span className="font-semibold text-wred">
                      <Highlight text={p.name} q={query} />
                    </span>
                  </span>
                  <span className="block pl-5.5 text-[12px] text-muted">{p.detail}</span>
                </button>
              ))}
              {payees.length === 0 && <p className="py-2 text-[14px] text-muted">No payees match ‘{query}’</p>}
            </section>
          )}
        </div>
      )}
    </Screen>
  )
}
