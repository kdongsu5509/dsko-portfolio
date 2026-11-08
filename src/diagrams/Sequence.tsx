import { Children, isValidElement, type ReactElement, type ReactNode } from 'react'

type Tone = 'default' | 'bad' | 'good'

type MsgProps = { from: string; to: string; label: ReactNode; tone?: Tone; reply?: boolean }
type NoteProps = { at: string; to?: string; label: ReactNode; tone?: Tone }
type PhaseProps = { label: ReactNode; tone?: Tone }

/** 한 레인에서 다른 레인으로 가는 호출이나 응답 */
export function Msg(_: MsgProps) {
  return null
}
/** 한 레인 위, 또는 at부터 to까지 걸친 설명 상자 */
export function Note(_: NoteProps) {
  return null
}
/** 구간 구분선. 예: 요청 트랜잭션, 장애 */
export function Phase(_: PhaseProps) {
  return null
}

export function Sequence({ lanes, caption, children }: { lanes: string[]; caption?: ReactNode; children: ReactNode }) {
  const n = lanes.length
  const idx = (name: string) => {
    const i = lanes.indexOf(name)
    if (i < 0) throw new Error(`Sequence: 알 수 없는 레인 "${name}"`)
    return i
  }
  const rows = Children.toArray(children).filter(isValidElement) as ReactElement[]

  return (
    <figure className="dg dg-seq" style={{ ['--lanes' as string]: n }}>
      {n > 3 && <p className="dg-hint">옆으로 밀어 전체를 볼 수 있음</p>}
      <div className="dg-seq__grid">
        {lanes.map((lane, i) => (
          <div key={lane} className="dg-seq__head" style={{ gridColumn: i + 1 }}>
            {lane}
          </div>
        ))}
        {lanes.map((lane, i) => (
          <div key={`life-${lane}`} className="dg-seq__life" style={{ gridColumn: i + 1, gridRow: `2 / span ${rows.length + 1}` }} />
        ))}
        {rows.map((el, r) => {
          const row = r + 2
          if (el.type === Phase) {
            const p = el.props as PhaseProps
            return (
              <div key={r} className={`dg-seq__phase tone-${p.tone ?? 'default'}`} style={{ gridColumn: `1 / span ${n}`, gridRow: row }}>
                <span>{p.label}</span>
              </div>
            )
          }
          if (el.type === Note) {
            const p = el.props as NoteProps
            const a = idx(p.at)
            const b = p.to ? idx(p.to) : a
            const lo = Math.min(a, b)
            const span = Math.abs(a - b) + 1
            return (
              <div key={r} className={`dg-seq__note tone-${p.tone ?? 'default'}`} style={{ gridColumn: `${lo + 1} / span ${span}`, gridRow: row }}>
                {p.label}
              </div>
            )
          }
          const p = el.props as MsgProps
          const a = idx(p.from)
          const b = idx(p.to)
          const lo = Math.min(a, b)
          const span = Math.abs(a - b) + 1
          const inset = `${50 / span}%`
          return (
            <div key={r} className={`dg-seq__msg tone-${p.tone ?? 'default'}${p.reply ? ' is-reply' : ''}`} style={{ gridColumn: `${lo + 1} / span ${span}`, gridRow: row }}>
              <span className="dg-seq__label">{p.label}</span>
              <span className={`dg-seq__arrow ${a < b ? 'to-right' : 'to-left'}`} style={{ left: inset, right: inset }} />
            </div>
          )
        })}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
