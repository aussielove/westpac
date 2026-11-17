import {
  ArrowLeftRight,
  Banknote,
  CalendarClock,
  Check,
  CircleCheck,
  CircleDollarSign,
  CreditCard,
  Ellipsis,
  Globe,
  IdCard,
  List,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
} from 'lucide-react'
import { useState } from 'react'
import { ACCOUNTS, money, PAYEES } from '../data'
import { Screen } from '../components/Phone'
import { Card, cx, LargeHeader, NavHeader, PillTabs, PrimaryButton } from '../components/ui'
import { useStore, type PayMode } from '../store'

function BpayIcon({ className = '' }: { className?: string }) {
  return (
    <span className={cx('grid place-items-center rounded-[4px] bg-navy text-[10px] font-black text-white', className)}>B</span>
  )
}

export function Payments() {
  const { push, notify, reset } = useStore()
  const [tab, setTab] = useState<'pay' | 'manage'>('pay')
  const tiles: { label: string; icon: React.ReactNode; go: () => void }[] = [
    { label: 'Transfer between accounts', icon: <ArrowLeftRight className="size-5" />, go: () => push({ name: 'pay', mode: 'transfer' }) },
    { label: 'Pay someone', icon: <UserPlus className="size-5" />, go: () => push({ name: 'pay', mode: 'someone' }) },
    { label: 'Pay to PayID', icon: <IdCard className="size-5" />, go: () => push({ name: 'pay', mode: 'payid' }) },
    { label: 'BPAY', icon: <BpayIcon className="size-5" />, go: () => push({ name: 'pay', mode: 'bpay' }) },
    { label: 'Pay overseas', icon: <Globe className="size-5" />, go: () => notify('International payments: 0 fees to 30+ currencies') },
    { label: 'Cardless Cash', icon: <Banknote className="size-5" />, go: () => notify('Cardless Cash code: 482 913 · valid 30 mins') },
    { label: 'View digital card', icon: <CreditCard className="size-5" />, go: () => reset([{ name: 'iq', tab: 'shield' }]) },
    { label: 'More ways to pay', icon: <Ellipsis className="size-5" />, go: () => notify('Apple Pay, Google Pay and Samsung Pay are ready') },
  ]

  return (
    <Screen className="bg-mist">
      <LargeHeader title="Payments">
        <PillTabs
          value={tab}
          onChange={setTab}
          tabs={[
            { id: 'pay', label: 'Pay', icon: <CircleDollarSign className="size-4 text-wred" /> },
            { id: 'manage', label: 'Manage', icon: <List className="size-4" /> },
          ]}
        />
      </LargeHeader>
      {tab === 'pay' ? (
        <div className="grid grid-cols-2 gap-2.5 p-4">
          {tiles.map((t) => (
            <Card key={t.label} onClick={t.go} className="anim-rise flex h-[86px] flex-col justify-between p-3.5">
              <span className="text-navy">
                {t.icon}
              </span>
              <span className="text-[14px] leading-tight text-ink">{t.label}</span>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-5 p-4">
          <div>
            <h3 className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-wider text-muted">Scheduled</h3>
            <Card className="divide-y divide-line">
              {[
                ['Rocket Repay micro-sweep', 'Every Thu · from Choice', 200],
                ['Westpac Life', 'Every Thu · from Choice', 400],
                ['Rent share · Sam Nguyen', '1st of month', 650],
              ].map(([n, d, a]) => (
                <div key={n as string} className="flex items-center gap-3 px-4 py-3">
                  <CalendarClock className="size-5 text-navy" />
                  <div className="flex-1">
                    <div className="text-[14px] font-medium">{n}</div>
                    <div className="text-[12px] text-muted">{d}</div>
                  </div>
                  <div className="text-[14px] font-semibold text-navy">{money(a as number)}</div>
                </div>
              ))}
            </Card>
          </div>
          <div>
            <h3 className="mb-2 px-1 text-[13px] font-semibold uppercase tracking-wider text-muted">Payees & billers</h3>
            <Card className="divide-y divide-line">
              {PAYEES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => push({ name: 'pay', mode: p.kind === 'biller' ? 'bpay' : 'someone' })}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-mist"
                >
                  <span className="grid size-8 place-items-center rounded-full bg-navy/[0.07] text-[12px] font-bold text-navy">
                    {p.name[0]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14px] font-medium">{p.name}</span>
                    <span className="block truncate text-[12px] text-muted">{p.detail}</span>
                  </span>
                </button>
              ))}
            </Card>
          </div>
        </div>
      )}
    </Screen>
  )
}

const TITLES: Record<PayMode, string> = {
  someone: 'Pay someone',
  transfer: 'Transfer',
  payid: 'Pay to PayID',
  bpay: 'BPAY',
}

export function PayForm({ mode }: { mode: PayMode }) {
  const { balances, setDraft, push, submitPayment } = useStore()
  const [from, setFrom] = useState('choice')
  const targets =
    mode === 'transfer'
      ? ACCOUNTS.filter((a) => a.id !== from).map((a) => ({ id: a.id, name: a.name, detail: a.number }))
      : PAYEES.filter((p) => (mode === 'bpay' ? p.kind === 'biller' : p.kind === 'person'))
  const [to, setTo] = useState(targets[0].id)
  const [amount, setAmount] = useState('')
  const [desc, setDesc] = useState('')
  const value = parseFloat(amount) || 0
  const toValid = targets.some((t) => t.id === to) ? to : targets[0].id
  const ok = value > 0 && value <= balances[from]

  const next = () => {
    const d = { mode, from, to: toValid, amount: value, description: desc }
    setDraft(d)
    if (mode === 'transfer') {
      // transfers between own accounts skip SaferPay
      submitPayment(d)
      push({ name: 'paid' })
    } else push({ name: 'saferpay' })
  }

  return (
    <Screen className="anim-slide bg-white">
      <NavHeader title={TITLES[mode]} />
      <div className="space-y-5 px-5 pt-2">
        <div>
          <label className="text-[13px] font-semibold text-muted">From</label>
          <div className="no-scrollbar -mx-5 mt-2 flex gap-2 overflow-x-auto px-5">
            {ACCOUNTS.filter((a) => a.kind === 'everyday' || a.kind === 'savings').map((a) => (
              <button
                key={a.id}
                onClick={() => setFrom(a.id)}
                className={cx(
                  'shrink-0 rounded-lg border px-3 py-2.5 text-left transition',
                  from === a.id ? 'border-2 border-navy' : 'border-line',
                )}
              >
                <div className="text-[14px] font-medium">{a.name}</div>
                <div className="text-[12px] text-muted">{money(balances[a.id])} available</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[13px] font-semibold text-muted">To</label>
          <div className="mt-2 divide-y divide-line rounded-lg border border-line">
            {targets.map((t) => (
              <button key={t.id} onClick={() => setTo(t.id)} className="flex w-full items-center gap-3 px-3 py-2.5 text-left">
                <span className="grid size-8 place-items-center rounded-full bg-navy/[0.07] text-[12px] font-bold text-navy">
                  {t.name[0]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium">{t.name}</span>
                  <span className="block truncate text-[12px] text-muted">{t.detail}</span>
                </span>
                {toValid === t.id && <Check className="size-4 text-wred" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="amt" className="text-[13px] font-semibold text-muted">
            Amount
          </label>
          <div className="mt-2 flex items-center border-b-2 border-navy pb-1">
            <span className="text-[30px] font-bold text-navy">$</span>
            <input
              id="amt"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="0.00"
              className="w-full bg-transparent pl-1 text-[30px] font-bold text-navy outline-none placeholder:text-navy/25"
            />
          </div>
          {value > balances[from] && <p className="mt-1 text-[12px] text-wred">Exceeds available balance</p>}
          <div className="mt-2 flex gap-2">
            {[20, 50, 250, 1000].map((v) => (
              <button
                key={v}
                onClick={() => setAmount(String(v))}
                className="rounded-full border border-line px-3 py-1 text-[13px] text-navy hover:border-navy/30"
              >
                ${v}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="desc" className="text-[13px] font-semibold text-muted">
            Description
          </label>
          <input
            id="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="e.g. Dinner"
            className="mt-2 h-11 w-full rounded-md border border-line px-3 text-[15px] outline-none focus:border-navy"
          />
        </div>
        <PrimaryButton disabled={!ok} onClick={next}>
          {mode === 'transfer' ? 'Transfer now' : 'Next'}
        </PrimaryButton>
        {mode !== 'transfer' && (
          <p className="flex items-center justify-center gap-1.5 pb-4 text-[12px] text-muted">
            <ShieldCheck className="size-3.5 text-navy" /> Protected by Westpac SaferPay
          </p>
        )}
      </div>
    </Screen>
  )
}

const PURPOSES = [
  'An investment',
  'Paying a friend or romantic partner',
  'Paying a family member',
  'Paying my account',
  'Paying for a service (invoice)',
  'Buying goods',
]

const QUESTIONS = [
  'Were you contacted out of the blue by phone, text, email or social media about this payment?',
  'Has anyone told you to lie to the bank, or rushed you to pay quickly?',
  'Have you been promised returns that sound too good to be true, or met this person only online?',
]

function ShieldLock() {
  return (
    <svg viewBox="0 0 48 56" className="h-14 w-12 shrink-0" aria-hidden>
      <path d="M24 2 4 9v16c0 13 8.6 24.4 20 28 11.4-3.6 20-15 20-28V9z" fill="#fff" stroke="#1f1c4f" strokeWidth="2.5" />
      <path d="M24 7 9 12.5V25c0 10 6.4 18.8 15 21.8 8.6-3 15-11.8 15-21.8V12.5z" fill="#e8e7f3" />
      <rect x="16" y="25" width="16" height="12" rx="2" fill="#1f1c4f" />
      <path d="M19 25v-3a5 5 0 0 1 10 0v3" fill="none" stroke="#1f1c4f" strokeWidth="2.5" />
      <circle cx="24" cy="31" r="1.8" fill="#da1710" />
    </svg>
  )
}

export function SaferPay() {
  const { draft, setDraft, reset, notify, push, submitPayment } = useStore()
  const [step, setStep] = useState(0)
  const [purpose, setPurpose] = useState<string | null>(null)
  const [answers, setAnswers] = useState<(boolean | null)[]>([null, null, null])
  const yesCount = answers.filter(Boolean).length
  const highRiskPurpose = purpose === PURPOSES[0] || purpose === PURPOSES[1]
  const risky = yesCount >= 2 || (highRiskPurpose && yesCount >= 1)
  const payee = PAYEES.find((p) => p.id === draft?.to)

  const cancel = () => {
    setDraft(null)
    reset([{ name: 'payments' }])
    notify('Payment cancelled. Nothing was sent.')
  }
  const pay = () => {
    if (draft) setDraft({ ...draft, purpose: purpose ?? undefined })
    submitPayment()
    push({ name: 'paid' })
  }

  return (
    <Screen className="anim-slide bg-white">
      <NavHeader title="Westpac SaferPay" action="Cancel" onAction={cancel} onBack={step > 0 ? () => setStep(step - 1) : undefined} />
      <div className="px-5">
        <div className="mb-4 flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className={cx('h-1 flex-1 rounded-full transition', i <= step ? 'bg-wred' : 'bg-line')} />
          ))}
        </div>

        {step === 0 && (
          <div className="anim-fade">
            <div className="flex gap-3 rounded-lg border border-line p-3.5">
              <ShieldLock />
              <div>
                <h3 className="text-[15px] font-bold text-navy">Potential scam activity</h3>
                <p className="mt-1 text-[12px] leading-snug text-muted">
                  To help protect you against common scams, we need to ask you a few questions before we can process the
                  payment. Make sure nobody is coaching you and answer honestly. If it's a scam, you may not get your money
                  back.
                </p>
              </div>
            </div>
            <h2 className="mt-6 text-[18px] font-bold text-ink">What's the payment for?</h2>
            <div className="mt-2 divide-y divide-line">
              {PURPOSES.map((p) => (
                <button key={p} onClick={() => setPurpose(p)} className="flex w-full items-center justify-between py-3.5 text-left text-[15px]">
                  {p}
                  {purpose === p && <Check className="size-5 text-wred" strokeWidth={2.4} />}
                </button>
              ))}
            </div>
            <PrimaryButton className="mt-5" disabled={!purpose} onClick={() => setStep(1)}>
              Next
            </PrimaryButton>
          </div>
        )}

        {step === 1 && (
          <div className="anim-fade">
            <h2 className="text-[18px] font-bold text-ink">A few quick checks</h2>
            <p className="mt-1 text-[13px] text-muted">Scammers often pretend to be banks, police, partners or investment advisers.</p>
            <div className="mt-4 space-y-3">
              {QUESTIONS.map((q, i) => (
                <div key={q} className="rounded-lg border border-line p-3.5">
                  <p className="text-[14px] leading-snug">{q}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {[true, false].map((v) => (
                      <button
                        key={String(v)}
                        onClick={() => setAnswers((a) => a.map((x, j) => (j === i ? v : x)))}
                        className={cx(
                          'h-9 rounded-md border text-[14px] font-medium transition',
                          answers[i] === v ? 'border-navy bg-navy text-white' : 'border-line text-navy hover:border-navy/30',
                        )}
                      >
                        {v ? 'Yes' : 'No'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <PrimaryButton className="mt-5" disabled={answers.includes(null)} onClick={() => setStep(2)}>
              Next
            </PrimaryButton>
          </div>
        )}

        {step === 2 && (
          <div className="anim-fade">
            {risky ? (
              <div className="rounded-xl bg-wred p-5 text-white">
                <ShieldAlert className="size-9" />
                <h2 className="mt-3 font-display text-[28px] uppercase leading-none">Stop. This looks like a scam.</h2>
                <p className="mt-3 text-[14px] leading-snug text-white/90">
                  Your answers match patterns we see in {highRiskPurpose ? 'investment and romance' : 'impersonation'} scams. Once
                  sent, this money may not be recoverable.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-line p-5">
                <CircleCheck className="size-9 text-money" />
                <h2 className="mt-3 text-[20px] font-bold text-navy">Thanks for checking</h2>
                <p className="mt-1 text-[14px] text-muted">No warning signs found. Review and confirm your payment.</p>
              </div>
            )}
            <dl className="mt-4 divide-y divide-line rounded-lg border border-line text-[14px]">
              {[
                ['To', payee?.name ?? '-'],
                ['Amount', money(draft?.amount ?? 0)],
                ['Purpose', purpose ?? '-'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between px-4 py-3">
                  <dt className="text-muted">{k}</dt>
                  <dd className="font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            {risky ? (
              <div className="mt-5 space-y-2">
                <PrimaryButton onClick={cancel}>Cancel payment</PrimaryButton>
                <PrimaryButton tone="ghost" onClick={pay}>
                  I understand the risk, pay anyway
                </PrimaryButton>
              </div>
            ) : (
              <PrimaryButton className="mt-5" onClick={pay}>
                Pay {money(draft?.amount ?? 0)}
              </PrimaryButton>
            )}
          </div>
        )}
      </div>
    </Screen>
  )
}

export function Paid() {
  const { draft, reset } = useStore()
  const name =
    draft?.mode === 'transfer'
      ? ACCOUNTS.find((a) => a.id === draft.to)?.name
      : PAYEES.find((p) => p.id === draft?.to)?.name

  return (
    <Screen className="anim-fade bg-white">
      <div className="flex min-h-full flex-col items-center px-6 pt-28 text-center">
        <span className="anim-pulse grid size-20 place-items-center rounded-full bg-wred text-white">
          <Check className="size-10" strokeWidth={3} />
        </span>
        <h1 className="mt-6 font-display text-[34px] uppercase leading-none text-navy">
          {draft?.mode === 'transfer' ? 'Transferred' : 'Paid'}
        </h1>
        <p className="mt-3 text-[32px] font-bold text-ink">{money(draft?.amount ?? 0)}</p>
        <p className="mt-1 text-[15px] text-muted">to {name}</p>
        <div className="mt-8 w-full rounded-lg bg-mist p-4 text-left text-[13px]">
          <div className="flex justify-between py-1">
            <span className="text-muted">Receipt</span>
            <span className="font-medium">WBC{String(Math.round((draft?.amount ?? 1) * 7919)).padStart(8, '0')}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted">When</span>
            <span className="font-medium">Today, 9:41am</span>
          </div>
          {draft?.description && (
            <div className="flex justify-between py-1">
              <span className="text-muted">Description</span>
              <span className="font-medium">{draft.description}</span>
            </div>
          )}
        </div>
        <PrimaryButton className="mt-8" onClick={() => reset([{ name: 'home' }])}>
          Done
        </PrimaryButton>
      </div>
    </Screen>
  )
}
