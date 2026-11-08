import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

type Tone = 'default' | 'bad' | 'good' | 'muted'
export type GraphNode = { id: string; label: ReactNode; col: number; row: number; span?: number; tone?: Tone; sub?: ReactNode }
export type GraphEdge = { from: string; to: string; tone?: Tone; both?: boolean; dashed?: boolean }

type Line = { x1: number; y1: number; x2: number; y2: number; tone: Tone; both?: boolean; dashed?: boolean }

/** 상자의 중심에서 다른 상자의 중심으로 가는 선이 상자 테두리에서 끝나도록 잘라 낸다 */
function clip(ax: number, ay: number, bx: number, by: number, hw: number, hh: number) {
  const dx = bx - ax
  const dy = by - ay
  if (dx === 0 && dy === 0) return { x: ax, y: ay }
  const t = Math.min(hw / Math.abs(dx || 1e-9), hh / Math.abs(dy || 1e-9))
  return { x: ax + dx * t, y: ay + dy * t }
}

/** 칸 위치를 직접 정하는 상자-화살표 그림. 모듈 의존처럼 배치가 의미 있는 그림에 쓴다 */
export function Graph({ nodes, edges, cols, title, caption }: { nodes: GraphNode[]; edges: GraphEdge[]; cols?: number; title?: ReactNode; caption?: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null)
  const refs = useRef(new Map<string, HTMLDivElement>())
  const [lines, setLines] = useState<Line[]>([])
  const [size, setSize] = useState({ w: 0, h: 0 })
  const columns = cols ?? Math.max(...nodes.map((n) => n.col + (n.span ?? 1) - 1))

  useLayoutEffect(() => {
    const el = wrap.current
    if (!el) return
    const measure = () => {
      const base = el.getBoundingClientRect()
      const box = (id: string) => {
        const r = refs.current.get(id)?.getBoundingClientRect()
        if (!r) throw new Error(`Graph: 알 수 없는 노드 "${id}"`)
        return { cx: r.left - base.left + r.width / 2, cy: r.top - base.top + r.height / 2, hw: r.width / 2 + 6, hh: r.height / 2 + 6 }
      }
      setSize({ w: base.width, h: base.height })
      setLines(
        edges.map((e) => {
          const a = box(e.from)
          const b = box(e.to)
          const p = clip(a.cx, a.cy, b.cx, b.cy, a.hw, a.hh)
          const q = clip(b.cx, b.cy, a.cx, a.cy, b.hw, b.hh)
          return { x1: p.x, y1: p.y, x2: q.x, y2: q.y, tone: e.tone ?? 'default', both: e.both, dashed: e.dashed }
        }),
      )
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [edges])

  return (
    <figure className="dg dg-graph">
      {title && <div className="dg-graph__title">{title}</div>}
      <div ref={wrap} className="dg-graph__grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {nodes.map((n) => (
          <div
            key={n.id}
            ref={(el) => {
              if (el) refs.current.set(n.id, el)
            }}
            className={`dg-node tone-${n.tone ?? 'default'}`}
            style={{ gridColumn: `${n.col} / span ${n.span ?? 1}`, gridRow: n.row }}
          >
            <strong>{n.label}</strong>
            {n.sub && <span>{n.sub}</span>}
          </div>
        ))}
        <svg className="dg-graph__edges" width={size.w} height={size.h} aria-hidden="true">
          <defs>
            {(['default', 'bad', 'good', 'muted'] as Tone[]).map((t) => (
              <marker key={t} id={`dg-head-${t}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" className={`dg-head tone-${t}`} />
              </marker>
            ))}
          </defs>
          {lines.map((l, i) => (
            <line
              key={i}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              className={`dg-edge tone-${l.tone}${l.dashed ? ' is-dashed' : ''}`}
              markerEnd={`url(#dg-head-${l.tone})`}
              markerStart={l.both ? `url(#dg-head-${l.tone})` : undefined}
            />
          ))}
        </svg>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
