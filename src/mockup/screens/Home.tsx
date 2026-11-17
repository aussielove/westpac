import { ChevronRight, Headset, Lock, Mic, Search, Sparkles, UserRound } from 'lucide-react'
import { ACCOUNTS, BILLS, money, TODAY } from '../data'
import { Screen } from '../components/Phone'
import { Card } from '../components/ui'
import { useStore } from '../store'

function HeroStripes() {
  return (
    <svg viewBox="0 0 390 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="hs1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b1fb8" />
          <stop offset="1" stopColor="#c02ad8" />
        </linearGradient>
        <linearGradient id="hs2" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#f43fc8" />
          <stop offset="1" stopColor="#7b22d6" />
        </linearGradient>
      </defs>
      <rect width="390" height="300" fill="#da1710" />
      <path d="M-40 40 L180 -40 L230 -40 L-40 120Z" fill="url(#hs1)" opacity=".95" />
      <path d="M-40 140 L300 -40 L340 -40 L-40 190Z" fill="url(#hs2)" opacity=".8" />
      <path d="M-40 210 L380 -40 L395 -40 L-40 225Z" fill="#2c1a78" opacity=".7" />
      <path d="M120 300 L430 70 L430 110 L180 300Z" fill="#b3120c" opacity=".55" />
    </svg>
  )
}

export function Home() {
  const { push, balances, notify, savings, openAi, reset } = useStore()
  const upcoming = BILLS.filter((b) => b.day > TODAY.getDate() && b.day <= TODAY.getDate() + 7)

  return (
    <Screen className="bg-mist">
      <div className="relative h-[268px] overflow-hidden">
        <HeroStripes />
        <div className="relative flex justify-end gap-2 px-5 pt-14">
          <button
            onClick={() => notify('Connecting you to a Westpac specialist…')}
            className="flex h-8 items-center gap-1.5 rounded-full border border-white/80 px-3 text-[13px] font-medium text-white backdrop-blur-sm hover:bg-white/10"
          >
            <Headset className="size-4" /> Contact us
          </button>
          <button
            aria-label="Profile"
            onClick={() => notify('Signed in as Alex Morgan')}
            className="grid size-8 place-items-center rounded-full border border-white/80 text-white hover:bg-white/10"
          >
            <UserRound className="size-4" />
          </button>
        </div>
        <h1 className="relative mt-8 px-6 text-center font-display text-[25px] uppercase leading-[1.05] tracking-wide text-white">
          How can we help you this afternoon?
        </h1>
        <button
          onClick={() => push({ name: 'search' })}
          className="relative mx-5 mt-6 flex h-12 w-[calc(100%-40px)] items-center gap-2 rounded-md bg-white px-4 text-left text-[15px] text-muted shadow-md"
        >
          <Search className="size-[18px] text-ink" /> Search
          <Mic className="ml-auto size-[18px] text-ink" />
        </button>
      </div>

      <div className="relative -mt-4 rounded-t-2xl bg-mist px-4 pt-5">
        <p className="px-1 text-[12px] font-medium uppercase tracking-wider text-muted">Alex Morgan</p>
        <Card className="mt-3 overflow-hidden p-0">
          <div className="flex items-center justify-between px-4 pb-2 pt-4">
            <h2 className="flex items-center gap-2 text-[16px] font-bold text-navy">
              <Lock className="size-4" strokeWidth={2.4} /> Accounts
            </h2>
            <button onClick={() => reset([{ name: 'more' }])} className="text-[13px] font-medium text-wred">
              New account
            </button>
          </div>
          <div className="space-y-2 px-3 pb-3">
            {ACCOUNTS.map((a) => (
              <button
                key={a.id}
                onClick={() => push({ name: 'account', id: a.id })}
                className="block w-full overflow-hidden rounded-md border border-line text-left transition hover:border-navy/25"
              >
                <div className="flex justify-between gap-3 px-3 py-3">
                  <div>
                    <div className="text-[15px] font-medium leading-tight text-ink">{a.name}</div>
                    <div className="mt-0.5 text-[12px] text-muted">{a.number}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[15px] font-bold text-navy">{money(balances[a.id])}</div>
                    {a.available && <div className="text-[12px] text-muted">avail {money(a.available)}</div>}
                  </div>
                </div>
                {a.kind === 'credit' && (
                  <div className="flex items-center justify-between border-t border-line bg-mist px-3 py-2 text-[12px] text-muted">
                    {a.note}
                    <span
                      role="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        push({ name: 'pay', mode: 'transfer' })
                      }}
                      className="rounded border border-wred px-2.5 py-1 font-medium text-wred hover:bg-wred/5"
                    >
                      Pay now
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </Card>

        <button
          onClick={() => push({ name: 'iq' })}
          className="anim-rise relative mt-4 block w-full overflow-hidden rounded-lg bg-navy p-4 text-left text-white shadow-lg"
        >
          <span className="absolute -right-10 -top-10 size-36 rounded-full bg-violet/40 blur-2xl" />
          <span className="absolute -bottom-12 right-10 size-28 rounded-full bg-wred/50 blur-2xl" />
          <div className="relative flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-blush">
            <Sparkles className="size-3.5" /> Cash Flow IQ · Shadow Private Banker
          </div>
          <div className="relative mt-2 font-display text-[34px] leading-none">{money(savings.total, { cents: false })}/yr</div>
          <div className="relative mt-1 text-[13px] text-white/75">money found across 5 leaks, your offset and LVR</div>
          <div className="relative mt-3 flex items-center gap-1 text-[13px] font-semibold text-white">
            Review moves <ChevronRight className="size-4" />
          </div>
        </button>

        <button
          onClick={() => openAi()}
          className="mt-3 flex h-12 w-full items-center gap-2 rounded-full border border-violet/30 bg-white px-4 text-[14px] text-muted shadow-sm"
        >
          <Sparkles className="size-4 text-violet" /> Ask Westpac AI anything about your money…
        </button>

        <Card className="mt-4 p-4" onClick={() => push({ name: 'bills' })}>
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-navy">Due in the next 7 days</h3>
            <ChevronRight className="size-4 text-muted" />
          </div>
          <div className="mt-3 space-y-2.5">
            {upcoming.map((b) => (
              <div key={b.id} className="flex items-center justify-between text-[14px]">
                <span className="text-ink">
                  {b.name}
                  <span className="ml-2 text-[12px] text-muted">{b.day} Nov</span>
                </span>
                <span className="font-semibold text-navy">{money(b.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Screen>
  )
}
