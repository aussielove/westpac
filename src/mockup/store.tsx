import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { ACCOUNTS, LEAKS, PAYEES, TRANSACTIONS, type Txn } from './data'

export type IqTab = 'safeblock' | 'payday' | 'products' | 'shield'
export type PayMode = 'someone' | 'transfer' | 'payid' | 'bpay'

export type Route =
  | { name: 'home' }
  | { name: 'accounts' }
  | { name: 'account'; id: string }
  | { name: 'payments' }
  | { name: 'pay'; mode: PayMode }
  | { name: 'saferpay' }
  | { name: 'paid' }
  | { name: 'insights' }
  | { name: 'cashflow' }
  | { name: 'bills' }
  | { name: 'search'; q?: string }
  | { name: 'more' }
  | { name: 'iq'; tab?: IqTab }

export type RouteName = Route['name']
export type TabName = 'home' | 'accounts' | 'payments' | 'insights' | 'more'

export type Draft = {
  mode: PayMode
  from: string
  to: string
  amount: number
  description: string
  purpose?: string
}

export type VirtualCard = { number: string; expiry: string; cvc: string; merchant: string }

export const FLOAT_YR = 412
export const LVR_YR = 1840
export const BONUS_YR = 390
export const BASE_FOUND = 2480

type Store = {
  route: Route
  depth: number
  push: (r: Route) => void
  back: () => void
  reset: (stack: Route[]) => void
  balances: Record<string, number>
  txns: Txn[]
  draft: Draft | null
  setDraft: (d: Draft | null) => void
  submitPayment: (d?: Draft) => void
  blocked: string[]
  toggleBlock: (id: string) => void
  blockAll: () => void
  swept: string[]
  toggleSweep: (id: string) => void
  counter: string[]
  acceptCounter: (id: string) => void
  floatOn: boolean
  setFloatOn: (v: boolean) => void
  lvrOn: boolean
  setLvrOn: (v: boolean) => void
  bonusOn: boolean
  setBonusOn: (v: boolean) => void
  allocated: boolean
  setAllocated: (v: boolean) => void
  virtualCard: VirtualCard | null
  makeVirtualCard: () => void
  billsPaid: string[]
  payBill: (id: string) => void
  aiOpen: string | null
  openAi: (prompt?: string) => void
  closeAi: () => void
  toast: string | null
  notify: (msg: string) => void
  savings: {
    blockedYr: number
    floatYr: number
    lvrYr: number
    bonusYr: number
    unlocked: number
    total: number
    sweepingMo: number
    lifeInterest: number
  }
}

const Ctx = createContext<Store | null>(null)

export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore outside provider')
  return s
}

const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id])

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Route[]>([{ name: 'home' }])
  const [balances, setBalances] = useState<Record<string, number>>(() =>
    Object.fromEntries(ACCOUNTS.map((a) => [a.id, a.balance])),
  )
  const [txns, setTxns] = useState<Txn[]>(TRANSACTIONS)
  const [currentDraft, setDraft] = useState<Draft | null>(null)
  const [blocked, setBlocked] = useState<string[]>([])
  const [swept, setSwept] = useState<string[]>(LEAKS.map((l) => l.id))
  const [counter, setCounter] = useState<string[]>([])
  const [floatOn, setFloatOn] = useState(false)
  const [lvrOn, setLvrOn] = useState(false)
  const [bonusOn, setBonusOn] = useState(false)
  const [allocated, setAllocated] = useState(false)
  const [virtualCard, setVirtualCard] = useState<VirtualCard | null>(null)
  const [billsPaid, setBillsPaid] = useState<string[]>([])
  const [aiOpen, setAiOpen] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  const notify = useCallback((msg: string) => {
    setToast(msg)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2600)
  }, [])

  const push = useCallback((r: Route) => setStack((s) => [...s, r]), [])
  const back = useCallback(() => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)), [])
  const reset = useCallback((next: Route[]) => setStack(next), [])

  const submitPayment = useCallback((explicit?: Draft) => {
    const draft = explicit ?? currentDraft
    if (!draft) return
    const payee = PAYEES.find((p) => p.id === draft.to)
    const target = ACCOUNTS.find((a) => a.id === draft.to)
    const title =
      draft.mode === 'transfer' ? `Transfer to ${target?.name ?? 'account'}` : `Payment to ${payee?.name ?? 'payee'}`
    setBalances((b) => {
      const next = { ...b, [draft.from]: b[draft.from] - draft.amount }
      if (draft.mode === 'transfer' && target) next[target.id] = b[target.id] + draft.amount
      return next
    })
    setTxns((t) => [
      {
        id: `n${Date.now()}`,
        account: draft.from,
        date: '2026-11-16',
        title,
        category: draft.mode === 'transfer' ? 'Transfer' : 'Payments',
        amount: -draft.amount,
      },
      ...t,
    ])
  }, [currentDraft])

  const makeVirtualCard = useCallback(() => {
    const block = () => String(Math.floor(1000 + Math.random() * 9000))
    setVirtualCard({
      number: `5163 ${block()} ${block()} ${block()}`,
      expiry: '12/26',
      cvc: String(Math.floor(100 + Math.random() * 900)),
      merchant: 'CloudVault Pro trial',
    })
  }, [])

  const savings = useMemo(() => {
    const blockedYr = LEAKS.filter((l) => blocked.includes(l.id)).reduce((s, l) => s + l.monthly * 12, 0)
    const sweepingMo = LEAKS.filter((l) => blocked.includes(l.id) && swept.includes(l.id)).reduce(
      (s, l) => s + l.monthly,
      0,
    )
    const floatYr = floatOn ? FLOAT_YR : 0
    const lvrYr = lvrOn ? LVR_YR : 0
    const bonusYr = bonusOn ? BONUS_YR : 0
    const unlocked = blockedYr + floatYr + lvrYr + bonusYr
    return {
      blockedYr,
      floatYr,
      lvrYr,
      bonusYr,
      unlocked,
      total: BASE_FOUND + unlocked,
      sweepingMo,
      lifeInterest: Math.round(sweepingMo * 12 * 0.05 * 100) / 100,
    }
  }, [blocked, swept, floatOn, lvrOn, bonusOn])

  const value: Store = {
    route: stack[stack.length - 1],
    depth: stack.length,
    push,
    back,
    reset,
    balances,
    txns,
    draft: currentDraft,
    setDraft,
    submitPayment,
    blocked,
    toggleBlock: (id) => setBlocked((b) => toggle(b, id)),
    blockAll: () => setBlocked(LEAKS.map((l) => l.id)),
    swept,
    toggleSweep: (id) => setSwept((s) => toggle(s, id)),
    counter,
    acceptCounter: (id) => setCounter((c) => (c.includes(id) ? c : [...c, id])),
    floatOn,
    setFloatOn,
    lvrOn,
    setLvrOn,
    bonusOn,
    setBonusOn,
    allocated,
    setAllocated,
    virtualCard,
    makeVirtualCard,
    billsPaid,
    payBill: (id) => setBillsPaid((p) => (p.includes(id) ? p : [...p, id])),
    aiOpen,
    openAi: (prompt) => setAiOpen(prompt ?? ''),
    closeAi: () => setAiOpen(null),
    toast,
    notify,
    savings,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
