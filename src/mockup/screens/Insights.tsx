import { ChartPie, ChevronRight, Coffee, Gauge, Sparkles, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useState } from 'react'
import { BILLS, CASHFLOW, CATEGORIES, money, TODAY } from '../data'
import { Screen } from '../components/Phone'
import { Card, LargeHeader, PillTabs, SectionTitle } from '../components/ui'
import { useStore } from '../store'

function BootcampArt() {
  return (
    <svg viewBox="0 0 340 130" className="h-full w-full" aria-hidden>
      <rect width="340" height="130" fill="#e9d3f6" />
      <g stroke="#c79be6" strokeWidth="2" fill="none">
        <path d="M210 0v130M250 0v130M290 0v130M330 0v130M200 40h140M200 80h140" />
      </g>
      <g stroke="#8b23e0" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M30 20h80M40 20v70M100 20v70M48 40v30M92 40v30" />
        <path d="M45 104h70M58 104l6-18h32l6 18" />
      </g>
      <circle cx="30" cy="112" r="9" fill="#da1710" />
      <circle cx="140" cy="112" r="7" fill="#da1710" />
      <rect x="128" y="105" width="24" height="5" fill="#1f1c4f" />
      <ellipse cx="248" cy="78" rx="44" ry="44" fill="#6a1bb8" />
      <ellipse cx="248" cy="78" rx="33" ry="33" fill="#8b23e0" />
      <text x="248" y="92" fontSize="40" fontWeight="800" fill="#fff" textAnchor="middle" fontFamily="Inter">
        $
      </text>
      <g fill="#1f1c4f">
        <circle cx="186" cy="38" r="8" fill="#f2b38c" />
        <path d="M178 48l-12 30 6 3 12-22 18 10 2-8z" />
        <path d="M172 78l-8 34h7l9-28zM180 78l10 34h7l-7-36z" fill="#3a3770" />
        <path d="M186 50l20 12" stroke="#f2b38c" strokeWidth="5" strokeLinecap="round" />
      </g>
      <path d="M0 122h340v8H0z" fill="#d6b4ee" />
    </svg>
  )
}

type Tab = 'overview' | 'insights' | 'budget'

const BUDGETS = [
  { name: 'Groceries', spent: 612.4, limit: 800 },
  { name: 'Dining, Bars & Cafe', spent: 284.5, limit: 300 },
  { name: 'Subscriptions', spent: 213.98, limit: 150 },
  { name: 'Transport', spent: 121.3, limit: 220 },
  { name: 'Utilities', spent: 182, limit: 260 },
]

export function Insights() {
  const { push, savings } = useStore()
  const [tab, setTab] = useState<Tab>('overview')
  const nov = CASHFLOW[CASHFLOW.length - 1]
  const nextBill = BILLS.find((b) => b.day > TODAY.getDate())!

  return (
    <Screen className="bg-mist">
      <LargeHeader title="Insights & tools">
        <PillTabs
          value={tab}
          onChange={setTab}
          tabs={[
            { id: 'overview', label: 'Overview', icon: <Gauge className="size-4 text-wred" /> },
            { id: 'insights', label: 'Insights', icon: <Sparkles className="size-4" /> },
            { id: 'budget', label: 'Budget', icon: <ChartPie className="size-4" /> },
          ]}
        />
      </LargeHeader>

      {tab === 'overview' && (
        <div className="anim-fade space-y-6 p-4">
          <Card className="overflow-hidden">
            <div className="h-[128px]">
              <BootcampArt />
            </div>
            <div className="p-4">
              <h3 className="text-[16px] font-bold text-navy">Money Bootcamp</h3>
              <p className="mt-1 text-[13px] leading-snug text-muted">
                Be the boss of your money and unlock your potential with our money tools
              </p>
              <button onClick={() => push({ name: 'iq' })} className="mt-2 text-[14px] font-medium text-wred">
                Get started
              </button>
            </div>
          </Card>

          <div>
            <SectionTitle>Money tools</SectionTitle>
            <div className="grid grid-cols-2 gap-2.5">
              <Card onClick={() => push({ name: 'cashflow' })} className="p-3.5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">Cash flow</div>
                <div className="mt-1 text-[19px] font-bold text-navy">{money(nov.income - nov.expenses)}</div>
                <div className="text-[11px] text-muted">So far this month</div>
                <div className="mt-3 flex justify-between text-[11px]">
                  <span>Expenses</span>
                  <span className="font-medium text-ink">{money(-nov.expenses)}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-mist">
                  <div className="h-full rounded-full bg-violet" style={{ width: `${(nov.expenses / nov.income) * 100}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-[11px]">
                  <span>Income</span>
                  <span className="font-medium text-ink">{money(nov.income)}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-navy" />
              </Card>
              <Card onClick={() => setTab('budget')} className="p-3.5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">Categories</div>
                <Coffee className="mt-3 size-6 text-navy" strokeWidth={1.8} />
                <div className="mt-2 text-[12px] text-ink">Dining, Bars & Cafe</div>
                <div className="text-[19px] font-bold text-navy">-$284.50</div>
                <div className="text-[11px] leading-tight text-muted">Largest category spend so far this month</div>
              </Card>
              <Card onClick={() => push({ name: 'bills' })} className="p-3.5">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted">Bills calendar</div>
                <div className="mt-2 text-[13px] text-ink">Next: {nextBill.name}</div>
                <div className="text-[19px] font-bold text-navy">{money(nextBill.amount)}</div>
                <div className="text-[11px] text-muted">Due {nextBill.day} Nov</div>
              </Card>
              <Card onClick={() => push({ name: 'iq' })} className="relative overflow-hidden bg-navy p-3.5 text-white">
                <span className="absolute -right-6 -top-6 size-20 rounded-full bg-violet/50 blur-xl" />
                <div className="relative text-[11px] font-semibold uppercase tracking-wider text-blush">Cash Flow IQ</div>
                <div className="relative mt-2 font-display text-[26px] leading-none">{money(savings.total, { cents: false })}</div>
                <div className="relative text-[11px] text-white/70">per year found by your Shadow Private Banker</div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {tab === 'insights' && (
        <div className="anim-fade space-y-2.5 p-4">
          {[
            {
              icon: <TrendingUp className="size-5 text-wred" />,
              title: 'Streaming Bundle went up $7/mo',
              body: 'That’s $84 more a year. SafeBlock can intercept it or accept a counter-offer.',
              go: () => push({ name: 'iq', tab: 'safeblock' }),
            },
            {
              icon: <Wallet className="size-5 text-violet" />,
              title: 'Salary landed: $3,600 ready to allocate',
              body: 'Payday Autopilot can ring-fence bills and float them in your offset.',
              go: () => push({ name: 'iq', tab: 'payday' }),
            },
            {
              icon: <TrendingDown className="size-5 text-money" />,
              title: 'Dining is 12% lower than October',
              body: 'You’ve spent $284.50 at cafes and restaurants so far this month.',
              go: () => setTab('budget'),
            },
            {
              icon: <Sparkles className="size-5 text-navy" />,
              title: 'Your LVR just crossed 69.8%',
              body: 'You may be eligible for a lower home loan rate.',
              go: () => push({ name: 'iq', tab: 'products' }),
            },
          ].map((x, i) => (
            <Card key={x.title} onClick={x.go} className="anim-rise flex gap-3 p-4" >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-mist" style={{ animationDelay: `${i * 50}ms` }}>
                {x.icon}
              </span>
              <span className="flex-1">
                <span className="block text-[15px] font-semibold text-ink">{x.title}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-muted">{x.body}</span>
              </span>
              <ChevronRight className="mt-2 size-4 text-muted" />
            </Card>
          ))}
        </div>
      )}

      {tab === 'budget' && (
        <div className="anim-fade p-4">
          <Card className="p-4">
            <div className="text-[13px] text-muted">November budget</div>
            <div className="text-[24px] font-bold text-navy">
              $1,414.18 <span className="text-[14px] font-medium text-muted">of $1,730</span>
            </div>
            <div className="mt-4 space-y-4">
              {BUDGETS.map((b) => {
                const pct = Math.min(100, (b.spent / b.limit) * 100)
                const over = b.spent > b.limit
                return (
                  <div key={b.name}>
                    <div className="flex justify-between text-[13px]">
                      <span className="font-medium">{b.name}</span>
                      <span className={over ? 'font-semibold text-wred' : 'text-muted'}>
                        {money(b.spent)} / {money(b.limit, { cents: false })}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-mist">
                      <div className={over ? 'h-full rounded-full bg-wred' : 'h-full rounded-full bg-violet'} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
          <Card className="mt-3 p-4">
            <h3 className="text-[15px] font-bold text-navy">Where it went</h3>
            <div className="mt-3 flex h-3 overflow-hidden rounded-full">
              {CATEGORIES.map((c) => (
                <span key={c.name} style={{ flex: c.amount, background: c.color }} />
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-y-1.5 text-[12px]">
              {CATEGORIES.map((c) => (
                <span key={c.name} className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full" style={{ background: c.color }} />
                  {c.name}
                </span>
              ))}
            </div>
          </Card>
        </div>
      )}
    </Screen>
  )
}
