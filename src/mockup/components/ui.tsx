import { ChevronLeft, Headset, Search, UserRound } from 'lucide-react'
import type { ReactNode } from 'react'
import { useStore } from '../store'

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ')
}

/** Simplified Westpac "W" mark. */
export function WestpacMark({ className = '', outline = false }: { className?: string; outline?: boolean }) {
  return (
    <svg viewBox="0 0 64 36" className={className} aria-hidden>
      <path
        d="M0 0h11.5l7 26.5L25.5 0h13l7 26.5L52.5 0H64l-9.6 36H38.9L32 10.6 25.1 36H9.6z"
        fill={outline ? 'none' : 'currentColor'}
        stroke={outline ? 'currentColor' : 'none'}
        strokeWidth={outline ? 3.6 : 0}
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconButton({ label, onClick, children }: { label: string; onClick?: () => void; children: ReactNode }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-full text-navy transition hover:bg-black/5 active:scale-95"
    >
      {children}
    </button>
  )
}

/** Root tab header: utility icons row + large title. */
export function LargeHeader({ title, children }: { title: string; children?: ReactNode }) {
  const { push, notify } = useStore()
  return (
    <div className="bg-white px-5 pt-12">
      <div className="flex justify-end gap-1">
        <IconButton label="Search" onClick={() => push({ name: 'search' })}>
          <Search className="size-[19px]" strokeWidth={2} />
        </IconButton>
        <IconButton label="Contact us" onClick={() => notify('Connecting you to a Westpac specialist…')}>
          <Headset className="size-[19px]" strokeWidth={2} />
        </IconButton>
        <IconButton label="Profile" onClick={() => notify('Signed in as Alex Morgan')}>
          <UserRound className="size-[19px]" strokeWidth={2} />
        </IconButton>
      </div>
      <h1 className="mt-1 text-[30px] font-bold tracking-tight text-ink">{title}</h1>
      {children}
    </div>
  )
}

/** Pushed screen header: back chevron, centered title, red text action. */
export function NavHeader({
  title,
  action,
  onAction,
  onBack,
  dark = false,
}: {
  title: string
  action?: string
  onAction?: () => void
  onBack?: () => void
  dark?: boolean
}) {
  const { back } = useStore()
  return (
    <div className={cx('relative flex h-[92px] items-end px-3 pb-3', dark ? 'text-white' : 'bg-white text-ink')}>
      <button
        aria-label="Back"
        onClick={onBack ?? back}
        className={cx('grid size-9 place-items-center rounded-full', dark ? 'text-white hover:bg-white/10' : 'text-wred hover:bg-black/5')}
      >
        <ChevronLeft className="size-6" strokeWidth={2.4} />
      </button>
      <div className="pointer-events-none absolute inset-x-0 bottom-[18px] text-center text-[16px] font-semibold">
        {title}
      </div>
      {action && (
        <button
          onClick={onAction}
          className={cx('ml-auto px-2 py-2 text-[15px] font-medium', dark ? 'text-white' : 'text-wred')}
        >
          {action}
        </button>
      )}
    </div>
  )
}

export function PillTabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: T; label: string; icon?: ReactNode }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-4 pt-3">
      {tabs.map((t) => {
        const on = t.id === value
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cx(
              'flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-4 text-[14px] font-medium transition',
              on ? 'border-navy border-2 text-navy' : 'border-line text-ink/80 hover:border-navy/30',
            )}
          >
            {t.icon}
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

export function Card({ className = '', children, onClick }: { className?: string; children: ReactNode; onClick?: () => void }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={cx(
        'block w-full rounded-lg bg-white text-left shadow-[0_1px_3px_rgb(20_20_60/0.08),0_0_0_1px_rgb(20_20_60/0.04)]',
        onClick && 'transition hover:shadow-[0_4px_14px_rgb(20_20_60/0.12)] active:scale-[0.99]',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

export function SectionTitle({ children, action, onAction }: { children: ReactNode; action?: string; onAction?: () => void }) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-[18px] font-bold text-navy">{children}</h2>
      {action && (
        <button onClick={onAction} className="text-[14px] font-medium text-wred">
          {action}
        </button>
      )}
    </div>
  )
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  className = '',
  tone = 'red',
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  tone?: 'red' | 'navy' | 'ghost'
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cx(
        'flex h-12 w-full items-center justify-center gap-2 rounded-md text-[15px] font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40',
        tone === 'red' && 'bg-wred text-white hover:bg-wred-dark',
        tone === 'navy' && 'bg-navy text-white hover:bg-navy-soft',
        tone === 'ghost' && 'border border-wred text-wred hover:bg-wred/5',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cx('relative h-6 w-10 shrink-0 rounded-full transition', on ? 'bg-money' : 'bg-black/15')}
    >
      <span className={cx('absolute top-0.5 size-5 rounded-full bg-white shadow transition-all', on ? 'left-[18px]' : 'left-0.5')} />
    </button>
  )
}

export function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-[2px] bg-wred/15 px-0.5 text-inherit">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  )
}
