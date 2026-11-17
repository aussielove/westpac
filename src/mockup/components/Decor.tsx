import { CircleDollarSign, UserRound, Bell, CalendarDays, ShieldHalf } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

export type DecorKind = 'confetti' | 'hex' | 'rings' | 'bolts' | 'stars' | 'sparkles' | 'network' | 'circles' | 'glow'

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** Positions biased to the outer edges so headline copy stays legible. */
function edgePoints(n: number, seed: number) {
  const r = rng(seed)
  return Array.from({ length: n }, () => {
    const side = r()
    let x = r() * 100
    let y = r() * 100
    if (side < 0.35) x = 52 + r() * 48
    else if (side < 0.55) y = r() * 14
    else if (side < 0.75) y = 86 + r() * 14
    else x = r() * 5
    return { x, y, a: r(), b: r(), c: r() }
  })
}

function Piece({ x, y, children, style }: { x: number; y: number; children: ReactNode; style?: CSSProperties }) {
  return (
    <span className="absolute" style={{ left: `${x}%`, top: `${y}%`, ...style }}>
      {children}
    </span>
  )
}

const HEX = 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)'

export function Decor({ kind }: { kind: DecorKind }) {
  const body = (() => {
    switch (kind) {
      case 'confetti': {
        const cols = ['#f43fc8', '#d9a6ef', '#da1710', '#f43fc8', '#c8a2f0']
        return edgePoints(70, 7).map((p, i) => (
          <Piece key={i} x={p.x} y={p.y}>
            <span
              className={i % 3 === 0 ? 'anim-drift block' : 'block'}
              style={
                {
                  width: 6 + p.a * 14,
                  height: 6 + p.b * 12,
                  background: cols[i % cols.length],
                  transform: `rotate(${p.c * 180}deg) skew(${p.a * 20}deg)`,
                  '--r': `${p.c * 180}deg`,
                  animationDelay: `${p.b * -6}s`,
                  opacity: 0.85,
                } as CSSProperties
              }
            />
          </Piece>
        ))
      }
      case 'hex':
        return edgePoints(26, 3).map((p, i) => {
          const size = 14 + p.a * 30
          const icon = i % 7 === 0 ? <UserRound className="size-1/2" /> : i % 9 === 0 ? <ShieldHalf className="size-1/2" /> : null
          const bg = ['#ffffff', '#fdd5f6', '#1f1c4f', '#f2a6e4'][i % 4]
          return (
            <Piece key={i} x={p.x} y={p.y}>
              <span
                className="anim-drift grid place-items-center text-navy"
                style={{ width: icon ? size + 14 : size, height: icon ? size + 14 : size, background: bg, clipPath: HEX, animationDelay: `${p.b * -7}s`, opacity: 0.9 }}
              >
                {icon}
              </span>
            </Piece>
          )
        })
      case 'rings':
        return (
          <>
            {edgePoints(18, 11).map((p, i) => (
              <Piece key={i} x={p.x} y={p.y}>
                <span className="block rounded-full" style={{ width: 6 + p.a * 10, height: 6 + p.a * 10, background: i % 3 ? '#1f1c4f' : '#ffffff' }} />
              </Piece>
            ))}
            {[
              [1, 90, 130],
              [84, 22, 110],
              [88, 78, 150],
              [60, 4, 90],
            ].map(([x, y, s], i) => (
              <Piece key={`r${i}`} x={x} y={y}>
                <svg width={s} height={s} viewBox="0 0 100 100" className="anim-drift opacity-60" style={{ animationDelay: `${i * -2}s` }}>
                  {[46, 38, 30, 22, 14].map((r) => (
                    <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#fff" strokeWidth="2.4" strokeDasharray={`${r * 1.6} ${r * 0.5}`} />
                  ))}
                </svg>
              </Piece>
            ))}
          </>
        )
      case 'bolts':
        return [
          [56, 16, 1, '#f43fc8'],
          [60, 22, 1.4, '#ffffff'],
          [54, 26, 0.9, '#1f1c4f'],
          [88, 60, 1.2, '#f43fc8'],
          [91, 66, 1.6, '#ffffff'],
          [86, 72, 1, '#1f1c4f'],
          [6, 84, 1.1, '#f43fc8'],
          [10, 90, 0.8, '#1f1c4f'],
        ].map(([x, y, s, c], i) => (
          <Piece key={i} x={x as number} y={y as number}>
            <svg width={70 * (s as number)} height={34 * (s as number)} viewBox="0 0 70 34" className="anim-drift" style={{ animationDelay: `${i * -0.9}s` }}>
              <path d="M0 14 L40 0 L32 12 L70 6 L22 34 L32 20Z" fill={c as string} />
            </svg>
          </Piece>
        ))
      case 'stars':
        return (
          <>
            {edgePoints(16, 5).map((p, i) => (
              <Piece key={i} x={p.x} y={p.y}>
                <svg width={14 + p.a * 40} height={14 + p.a * 40} viewBox="0 0 40 40" className="anim-drift" style={{ animationDelay: `${p.b * -6}s` }}>
                  <path d="M20 0 L25 15 L40 20 L25 25 L20 40 L15 25 L0 20 L15 15Z" fill={['#1f1c4f', '#ffffff', '#f43fc8'][i % 3]} transform={`rotate(${p.c * 40} 20 20)`} />
                </svg>
              </Piece>
            ))}
            {edgePoints(14, 19).map((p, i) => (
              <Piece key={`s${i}`} x={p.x} y={p.y}>
                <span className="block h-[3px] w-6 rounded-full" style={{ background: i % 2 ? '#f43fc8' : '#ffffff', transform: `rotate(${p.c * 180}deg)` }} />
              </Piece>
            ))}
          </>
        )
      case 'sparkles':
        return (
          <>
            {edgePoints(14, 23).map((p, i) => (
              <Piece key={i} x={p.x} y={p.y}>
                <svg width={16 + p.a * 46} height={16 + p.a * 46} viewBox="0 0 40 40" className="anim-drift" style={{ animationDelay: `${p.b * -6}s` }}>
                  <path d="M20 0 C21 13 27 19 40 20 C27 21 21 27 20 40 C19 27 13 21 0 20 C13 19 19 13 20 0Z" fill={['#ffffff', '#fdd5f6', '#1f1c4f'][i % 3]} />
                </svg>
              </Piece>
            ))}
            {edgePoints(22, 29).map((p, i) => (
              <Piece key={`d${i}`} x={p.x} y={p.y}>
                <span className="block rounded-full" style={{ width: 5 + p.a * 9, height: 5 + p.a * 9, background: i % 3 ? '#fdd5f6' : '#1f1c4f' }} />
              </Piece>
            ))}
          </>
        )
      case 'network': {
        const nodes = [
          [58, 10, 'dollar'],
          [66, 4, ''],
          [72, 12, 'user'],
          [62, 20, ''],
          [96, 34, 'user'],
          [93, 48, ''],
          [98, 60, 'dollar'],
          [94, 74, ''],
          [36, 95, 'dollar'],
          [46, 90, ''],
          [28, 99, ''],
          [56, 97, 'user'],
        ] as const
        const edges = [
          [0, 1],
          [1, 2],
          [0, 3],
          [2, 3],
          [4, 5],
          [5, 6],
          [6, 7],
          [8, 9],
          [8, 10],
          [9, 11],
        ]
        return (
          <>
            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              {edges.map(([a, b], i) => (
                <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="#fdd5f6" strokeWidth="0.15" vectorEffect="non-scaling-stroke" style={{ strokeWidth: 1.5 }} />
              ))}
            </svg>
            {nodes.map(([x, y, k], i) => (
              <Piece key={i} x={x} y={y} style={{ transform: 'translate(-50%,-50%)' }}>
                <span
                  className="grid place-items-center rounded-full text-navy"
                  style={{ width: k ? 44 : 14, height: k ? 44 : 14, background: i % 3 === 2 ? '#d9a6ef' : k ? '#fdd5f6' : '#ffffff' }}
                >
                  {k === 'dollar' && <CircleDollarSign className="size-6" />}
                  {k === 'user' && <UserRound className="size-6" />}
                </span>
              </Piece>
            ))}
          </>
        )
      }
      case 'circles':
        return (
          <>
            {edgePoints(18, 13).map((p, i) => (
              <Piece key={i} x={p.x} y={p.y}>
                <span
                  className="anim-drift block rounded-full"
                  style={{
                    width: 10 + p.a * 18,
                    height: 10 + p.a * 18,
                    border: `${3 + p.b * 2}px solid ${i % 2 ? '#1f1c4f' : '#ffffff'}`,
                    animationDelay: `${p.c * -6}s`,
                  }}
                />
              </Piece>
            ))}
            {[
              [88, 30, <Bell key="b" className="size-5" />],
              [6, 80, <CircleDollarSign key="d" className="size-5" />],
              [90, 74, <CalendarDays key="c" className="size-5" />],
            ].map(([x, y, icon], i) => (
              <Piece key={`i${i}`} x={x as number} y={y as number}>
                <span className="anim-drift grid size-12 place-items-center rounded-full bg-blush text-navy" style={{ animationDelay: `${i * -2}s` }}>
                  {icon as ReactNode}
                </span>
              </Piece>
            ))}
          </>
        )
      case 'glow':
        return (
          <>
            <span className="absolute -right-40 -top-40 size-[640px] rounded-full bg-violet/40 blur-[120px]" />
            <span className="absolute -bottom-52 left-1/4 size-[560px] rounded-full bg-wred/45 blur-[120px]" />
            <span className="absolute right-1/4 top-1/3 size-[260px] rounded-full bg-magenta/25 blur-[90px]" />
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '56px 56px' }}
            />
          </>
        )
    }
  })()

  return (
    <div key={kind} className="anim-fade pointer-events-none absolute inset-0 overflow-hidden max-lg:opacity-45" aria-hidden>
      {body}
    </div>
  )
}
