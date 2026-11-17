import { ArrowLeftRight, ChevronRight, CreditCard, Home as HomeIcon, PiggyBank, Wallet } from 'lucide-react'
import { ACCOUNTS, fmtDate, money, type Account } from '../data'
import { Screen } from '../components/Phone'
import { Card, LargeHeader, NavHeader } from '../components/ui'
import { useStore } from '../store'

const ICON: Record<Account['kind'], typeof Wallet> = {
  everyday: Wallet,
  savings: PiggyBank,
  loan: HomeIcon,
  credit: CreditCard,
}

export function Accounts() {
  const { push, balances } = useStore()
  const cash = ACCOUNTS.filter((a) => a.kind === 'everyday' || a.kind === 'savings').reduce((s, a) => s + balances[a.id], 0)
  const owing = ACCOUNTS.filter((a) => a.kind === 'loan' || a.kind === 'credit').reduce((s, a) => s + balances[a.id], 0)

  return (
    <Screen className="bg-mist">
      <LargeHeader title="Accounts">
        <div className="grid grid-cols-2 gap-3 py-4">
          <div className="rounded-lg bg-mist p-3">
            <div className="text-[12px] text-muted">You have</div>
            <div className="text-[19px] font-bold text-navy">{money(cash)}</div>
          </div>
          <div className="rounded-lg bg-mist p-3">
            <div className="text-[12px] text-muted">You owe</div>
            <div className="text-[19px] font-bold text-navy">{money(Math.abs(owing))}</div>
          </div>
        </div>
      </LargeHeader>
      <div className="space-y-3 px-4 pt-4">
        {ACCOUNTS.map((a) => {
          const Icon = ICON[a.kind]
          return (
            <Card key={a.id} onClick={() => push({ name: 'account', id: a.id })} className="anim-rise flex items-center gap-3 p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-navy/[0.07] text-navy">
                <Icon className="size-5" strokeWidth={1.8} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-medium text-ink">{a.name}</span>
                <span className="block text-[12px] text-muted">{a.note ?? a.number}</span>
              </span>
              <span className="text-right">
                <span className="block text-[15px] font-bold text-navy">{money(balances[a.id])}</span>
                {a.available && <span className="block text-[11px] text-muted">avail {money(a.available)}</span>}
              </span>
              <ChevronRight className="size-4 text-muted" />
            </Card>
          )
        })}
        <button
          onClick={() => push({ name: 'pay', mode: 'transfer' })}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-navy/25 py-3 text-[14px] font-medium text-navy hover:bg-white"
        >
          <ArrowLeftRight className="size-4" /> Transfer between accounts
        </button>
      </div>
    </Screen>
  )
}

export function AccountDetail({ id }: { id: string }) {
  const { balances, txns, push } = useStore()
  const acct = ACCOUNTS.find((a) => a.id === id) ?? ACCOUNTS[0]
  const list = txns.filter((t) => t.account === acct.id)
  const groups = list.reduce<Record<string, typeof list>>((g, t) => {
    ;(g[t.date] ??= []).push(t)
    return g
  }, {})

  return (
    <Screen className="anim-slide bg-mist">
      <NavHeader title={acct.name} />
      <div className="bg-white px-5 pb-5 text-center">
        <div className="text-[12px] text-muted">{acct.number}</div>
        <div className="mt-1 text-[34px] font-bold tracking-tight text-navy">{money(balances[acct.id])}</div>
        <div className="text-[13px] text-muted">{acct.kind === 'loan' ? 'Loan balance' : 'Current balance'}</div>
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => push({ name: 'pay', mode: 'someone' })}
            className="h-9 rounded-full bg-wred px-5 text-[13px] font-semibold text-white hover:bg-wred-dark"
          >
            Pay
          </button>
          <button
            onClick={() => push({ name: 'pay', mode: 'transfer' })}
            className="h-9 rounded-full border border-line px-5 text-[13px] font-semibold text-navy hover:border-navy/30"
          >
            Transfer
          </button>
        </div>
      </div>
      <div className="px-4 pt-4">
        {Object.entries(groups).map(([date, items]) => (
          <div key={date} className="mb-4">
            <div className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-wider text-muted">{fmtDate(date)}</div>
            <Card className="divide-y divide-line">
              {items.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-medium text-ink">{t.title}</div>
                    <div className="text-[12px] text-muted">{t.category}</div>
                  </div>
                  <div className={t.amount > 0 ? 'text-[14px] font-semibold text-money' : 'text-[14px] font-semibold text-ink'}>
                    {money(t.amount, { sign: true })}
                  </div>
                </div>
              ))}
            </Card>
          </div>
        ))}
        {list.length === 0 && <p className="py-10 text-center text-[14px] text-muted">No recent transactions</p>}
      </div>
    </Screen>
  )
}
