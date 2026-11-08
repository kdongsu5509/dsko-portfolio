import { Children, Fragment, type ReactNode } from 'react'

type Tone = 'default' | 'bad' | 'good' | 'muted'

/** 단계 하나. title 아래 짧은 설명을 children으로 둔다 */
export function Step({ title, tone = 'default', children }: { title: ReactNode; tone?: Tone; children?: ReactNode }) {
  return (
    <div className={`dg-step tone-${tone}`}>
      <strong>{title}</strong>
      {children && <span>{children}</span>}
    </div>
  )
}

/** 단계를 화살표로 잇는 흐름. 좁은 화면에서는 세로로 쌓인다 */
export function Flow({ caption, children }: { caption?: ReactNode; children: ReactNode }) {
  const items = Children.toArray(children)
  return (
    <figure className="dg dg-flow">
      <div className="dg-flow__row">
        {items.map((child, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="dg-flow__arrow" aria-hidden="true" />}
            {child}
          </Fragment>
        ))}
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

/** 변경 전과 후를 나란히 놓는 틀 */
export function Compare({ children }: { children: ReactNode }) {
  return <div className="dg-compare">{children}</div>
}

export function Panel({ title, tone = 'default', children }: { title: ReactNode; tone?: Tone; children: ReactNode }) {
  return (
    <section className={`dg-panel tone-${tone}`}>
      <h4>{title}</h4>
      {children}
    </section>
  )
}
