import { useEffect, useState, type MouseEvent } from 'react'
import { cases, projects, type CaseEntry } from './content'
import { Sequence, Msg, Note, Phase } from './diagrams/Sequence'
import { Graph } from './diagrams/Graph'
import { Flow, Step, Compare, Panel } from './diagrams/Flow'

const mdxComponents = { Sequence, Msg, Note, Phase, Graph, Flow, Step, Compare, Panel }

function usePath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  const go = (to: string) => (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    window.history.pushState(null, '', to)
    setPath(to)
    window.scrollTo(0, 0)
  }
  return { path, go }
}

export default function App() {
  const { path, go } = usePath()
  const slug = path.match(/^\/cases\/([^/]+)/)?.[1]
  const current = slug ? cases.find((c) => c.slug === slug) : undefined

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a href="/" onClick={go('/')} className="brand">
            고동수
          </a>
          <nav className="main-nav">
            <a href="/#projects" onClick={go('/')}>
              프로젝트
            </a>
            <a href="/#cases" onClick={go('/')}>
              문제 해결
            </a>
            <a href="https://github.com/kdongsu5509">GitHub</a>
          </nav>
        </div>
      </header>
      <main>{current ? <CasePage entry={current} go={go} /> : <Home go={go} />}</main>
      <footer className="footer">
        <div className="container">
          <span>kod66170@gmail.com</span>
        </div>
      </footer>
    </>
  )
}

function Home({ go }: { go: (to: string) => (e: MouseEvent) => void }) {
  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="eyebrow">백엔드 개발자 고동수</span>
          <h1>
            하네스를 씌워도 널뛰는 AI,
            <br />
            아키텍처 테스트로 통제하는 백엔드 개발자
          </h1>
        </div>
      </section>

      <section id="projects" className="section">
        <div className="container">
          <h2 className="section-title">프로젝트</h2>
          <div className="project-grid">
            {projects.map((p) => (
              <article key={p.name} className="project-card">
                <h3>{p.name}</h3>
                <p>{p.summary}</p>
                <dl>
                  <div>
                    <dt>기간</dt>
                    <dd>{p.period}</dd>
                  </div>
                  <div>
                    <dt>구성</dt>
                    <dd>{p.team}</dd>
                  </div>
                  <div>
                    <dt>맡은 범위</dt>
                    <dd>{p.role}</dd>
                  </div>
                  <div>
                    <dt>기술</dt>
                    <dd>{p.stack}</dd>
                  </div>
                </dl>
                {p.links.map((l) => (
                  <a key={l.href} href={l.href} className="text-link">
                    {l.label}
                  </a>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="cases" className="section">
        <div className="container">
          <h2 className="section-title">문제 해결</h2>
          <div className="case-grid">
            {cases.map((c) => (
              <a key={c.slug} href={`/cases/${c.slug}`} onClick={go(`/cases/${c.slug}`)} className="case-card">
                <span className="case-card__project">{c.project}</span>
                <h3>{c.title}</h3>
                <p>{c.summary}</p>
                {c.metrics[0] && (
                  <strong className="case-card__metric">
                    {c.metrics[0].value}
                    <small>{c.metrics[0].label}</small>
                  </strong>
                )}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function CasePage({ entry, go }: { entry: CaseEntry; go: (to: string) => (e: MouseEvent) => void }) {
  const { Content } = entry
  useEffect(() => {
    document.title = `${entry.title} | 고동수`
    return () => {
      document.title = '고동수 포트폴리오'
    }
  }, [entry])
  const i = cases.indexOf(entry)
  const next = cases[i + 1]

  return (
    <article className="case-page">
      <div className="container">
        <a href="/#cases" onClick={go('/')} className="back-link">
          ← 문제 해결 목록
        </a>
        <header className="case-head">
          <span>{entry.project}</span>
          <h1>{entry.headline}</h1>
        </header>
        <div className="case-layout">
          <div className="prose">
            <Content components={mdxComponents} />
          </div>
          <aside className="case-facts">
            <dl>
              <div>
                <dt>프로젝트</dt>
                <dd>{entry.project}</dd>
              </div>
              <div>
                <dt>기간</dt>
                <dd>{entry.period}</dd>
              </div>
              <div>
                <dt>역할</dt>
                <dd>{entry.role}</dd>
              </div>
              <div>
                <dt>기술</dt>
                <dd>{entry.stack.join(' · ')}</dd>
              </div>
            </dl>
            <ul className="case-metrics">
              {entry.metrics.map((m) => (
                <li key={m.label}>
                  <strong>{m.value}</strong>
                  <span>{m.label}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
        {next && (
          <a href={`/cases/${next.slug}`} onClick={go(`/cases/${next.slug}`)} className="next-case">
            <span>다음 사례</span>
            <strong>{next.title}</strong>
          </a>
        )}
      </div>
    </article>
  )
}
