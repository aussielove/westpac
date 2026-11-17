export const TODAY = new Date(2026, 10, 16) // Mon 16 Nov 2026

export type Account = {
  id: string
  name: string
  number: string
  balance: number
  available?: number
  kind: 'everyday' | 'savings' | 'loan' | 'credit'
  note?: string
}

export const ACCOUNTS: Account[] = [
  { id: 'choice', name: 'Westpac Choice', number: '032-000 ••4821', balance: 4286.52, kind: 'everyday' },
  { id: 'life', name: 'Westpac Life', number: '032-000 ••7710', balance: 18940.1, kind: 'savings', note: '5.00% p.a. bonus rate' },
  {
    id: 'rocket',
    name: 'Rocket Repay Home Loan',
    number: '032-000 ••3302',
    balance: -486210.0,
    kind: 'loan',
    note: '6.49% p.a. · Offset linked',
  },
  {
    id: 'altitude',
    name: 'Altitude Black Mastercard',
    number: 'Card ending ••1234',
    balance: -1248.3,
    available: 13751.7,
    kind: 'credit',
    note: 'Min of $46.30 due tomorrow',
  },
]

export type Txn = {
  id: string
  account: string
  date: string
  title: string
  category: string
  amount: number
}

export const TRANSACTIONS: Txn[] = [
  { id: 't1', account: 'choice', date: '2026-11-16', title: 'Harris Farm Markets', category: 'Groceries', amount: -64.2 },
  { id: 't2', account: 'choice', date: '2026-11-16', title: 'Single O Surry Hills', category: 'Dining, Bars & Cafe', amount: -9.5 },
  { id: 't3', account: 'choice', date: '2026-11-15', title: 'Streaming Bundle', category: 'Subscriptions', amount: -31.99 },
  { id: 't4', account: 'choice', date: '2026-11-14', title: 'Opal Travel', category: 'Transport', amount: -18.4 },
  { id: 't5', account: 'choice', date: '2026-11-13', title: 'Salary · Northwind Pty Ltd', category: 'Income', amount: 3600 },
  { id: 't6', account: 'choice', date: '2026-11-12', title: 'FitPulse Fitness App', category: 'Subscriptions', amount: -29 },
  { id: 't7', account: 'choice', date: '2026-11-12', title: 'Chat Thai Haymarket', category: 'Dining, Bars & Cafe', amount: -58.0 },
  { id: 't8', account: 'choice', date: '2026-11-11', title: 'AGL Energy Plan', category: 'Utilities', amount: -136.0 },
  { id: 't9', account: 'choice', date: '2026-11-10', title: 'Woolworths Metro', category: 'Groceries', amount: -42.75 },
  { id: 't10', account: 'choice', date: '2026-11-09', title: 'Daily News+ Digital', category: 'Subscriptions', amount: -15 },
  { id: 't11', account: 'altitude', date: '2026-11-08', title: 'Qantas Airways', category: 'Travel', amount: -412.0 },
  { id: 't12', account: 'life', date: '2026-11-01', title: 'Bonus interest', category: 'Income', amount: 78.92 },
  { id: 't13', account: 'life', date: '2026-10-31', title: 'Transfer from Choice', category: 'Transfer', amount: 400 },
  { id: 't14', account: 'rocket', date: '2026-11-01', title: 'Loan repayment', category: 'Home loan', amount: 2840 },
  { id: 't15', account: 'altitude', date: '2026-11-06', title: 'JB Hi-Fi Broadway', category: 'Shopping', amount: -249.0 },
]

export type Month = { key: string; label: string; short: string; income: number; expenses: number }

export const CASHFLOW: Month[] = [
  { key: '2026-06', label: 'June 2026', short: 'Jun', income: 6420.0, expenses: 4980.4 },
  { key: '2026-07', label: 'July 2026', short: 'Jul', income: 7880.25, expenses: 5610.9 },
  { key: '2026-08', label: 'August 2026', short: 'Aug', income: 6950.0, expenses: 4720.15 },
  { key: '2026-09', label: 'September 2026', short: 'Sep', income: 6103.56, expenses: 3075.41 },
  { key: '2026-10', label: 'October 2026', short: 'Oct', income: 6240.0, expenses: 4410.62 },
  { key: '2026-11', label: 'November 2026', short: 'Nov', income: 5180.74, expenses: 3946.18 },
]

export const CATEGORIES = [
  { name: 'Home loan', amount: 1420.0, color: '#1f1c4f' },
  { name: 'Groceries', amount: 612.4, color: '#8b23e0' },
  { name: 'Dining, Bars & Cafe', amount: 284.5, color: '#f43fc8' },
  { name: 'Subscriptions', amount: 213.98, color: '#da1710' },
  { name: 'Utilities', amount: 182.0, color: '#c79be6' },
  { name: 'Transport', amount: 121.3, color: '#7c7c94' },
]

export type Bill = {
  id: string
  name: string
  amount: number
  day: number
  freq: 'Monthly' | 'Fortnightly' | 'Quarterly'
  leak?: string
}

export const BILLS: Bill[] = [
  { id: 'yt', name: 'YouTube Premium', amount: 18.99, day: 1, freq: 'Monthly' },
  { id: 'netflix', name: 'Netflix', amount: 10.99, day: 2, freq: 'Monthly' },
  { id: 'phone', name: 'Optus Mobile', amount: 55.0, day: 4, freq: 'Monthly' },
  { id: 'news', name: 'Daily News+ Digital', amount: 15.0, day: 9, freq: 'Monthly', leak: 'news' },
  { id: 'energy', name: 'AGL Energy Plan', amount: 136.0, day: 11, freq: 'Monthly', leak: 'energy' },
  { id: 'fit', name: 'FitPulse Fitness App', amount: 29.0, day: 12, freq: 'Monthly', leak: 'fit' },
  { id: 'stream', name: 'Streaming Bundle', amount: 31.99, day: 15, freq: 'Monthly', leak: 'stream' },
  { id: 'insure', name: 'Westpac Home Insurance', amount: 92.4, day: 18, freq: 'Monthly' },
  { id: 'cloud', name: 'CloudVault Pro', amount: 19.0, day: 18, freq: 'Monthly', leak: 'cloud' },
  { id: 'gym', name: 'Anytime Fitness', amount: 34.95, day: 21, freq: 'Fortnightly' },
  { id: 'water', name: 'Sydney Water', amount: 88.1, day: 25, freq: 'Quarterly' },
  { id: 'spotify', name: 'Spotify Duo', amount: 17.99, day: 28, freq: 'Monthly' },
]

export type Leak = {
  id: string
  letter: string
  name: string
  detail: string
  monthly: number
  tag: string
  tone: string
  counterOffer?: string
}

export const LEAKS: Leak[] = [
  {
    id: 'stream',
    letter: 'S',
    name: 'Streaming Bundle',
    detail: 'Price hike detected: +$7/mo',
    monthly: 7,
    tag: 'Price hike',
    tone: '#da1710',
    counterOffer: 'Merchant counter-offer: keep bundle at old price for 6 months',
  },
  { id: 'fit', letter: 'F', name: 'FitPulse Fitness App', detail: 'No logins in 94 days', monthly: 29, tag: 'Unused', tone: '#8b23e0' },
  { id: 'cloud', letter: 'C', name: 'CloudVault Pro Trial', detail: 'Converts to paid in 48h', monthly: 19, tag: 'Trial ending', tone: '#f43fc8' },
  {
    id: 'energy',
    letter: 'E',
    name: 'Energy Plan',
    detail: 'Loyalty tax vs. best market offer',
    monthly: 68,
    tag: 'Loyalty tax',
    tone: '#1f1c4f',
  },
  { id: 'news', letter: 'D', name: 'Daily News+ Digital', detail: 'Duplicate of bundled access', monthly: 15, tag: 'Duplicate', tone: '#6b6b80' },
]

export type Payee = { id: string; name: string; detail: string; kind: 'person' | 'biller' }

export const PAYEES: Payee[] = [
  { id: 'p1', name: 'Sam Nguyen', detail: 'BSB 062-000 · ••4417', kind: 'person' },
  { id: 'p2', name: 'Priya Shah', detail: 'PayID priya@mail.com', kind: 'person' },
  { id: 'p3', name: 'Bright Investments Group', detail: 'BSB 033-112 · ••9081', kind: 'person' },
  { id: 'p4', name: 'Mum', detail: 'PayID 0412 ••• 018', kind: 'person' },
  { id: 'b1', name: 'Qantas Credit Cards', detail: 'Biller code: 9799 Ref: 5488767812345678', kind: 'biller' },
  { id: 'b2', name: 'St George Cards', detail: 'Biller code: 1234 Ref: 1234567812345678', kind: 'biller' },
  { id: 'b3', name: 'Sydney Water', detail: 'Biller code: 22202 Ref: 7781 2291', kind: 'biller' },
]

export const SELF_SERVE = [
  'Increase credit card limit',
  'Digital card',
  'Close a PartPay Card',
  'Lock or unlock card',
  'Report a lost or stolen card',
  'Replace a damaged card',
  'Change card PIN',
  'Activate card',
  'Set up card spending limits',
  'Travel notifications',
  'Generate single-use virtual card',
  'Dispute a transaction',
  'Set up PayID',
  'Order a cheque book',
  'Statements and documents',
  'Update contact details',
  'Bills calendar',
  'Cash flow',
  'SafeBlock merchant controls',
  'Payday Autopilot',
]

export const money = (n: number, opts: { sign?: boolean; cents?: boolean } = {}) => {
  const { sign = false, cents = true } = opts
  const abs = Math.abs(n).toLocaleString('en-AU', {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  })
  if (n < 0) return `-$${abs}`
  return `${sign ? '+' : ''}$${abs}`
}

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

/** Locale-independent "Mon 16 Nov" style date. */
export const fmtDay = (d: Date, year = false) =>
  `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}${year ? ` ${d.getFullYear()}` : ''}`

export const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return fmtDay(new Date(y, m - 1, d))
}
