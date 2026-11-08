import { useEffect, useState, type MouseEvent } from 'react'
import { cases, casesOf, projectOf, projects, type CaseEntry, type Project } from './content'
import { Sequence, Msg, Note, Phase } from './diagrams/Sequence'
import { Graph } from './diagrams/Graph'
import { Flow, Step, Compare, Panel } from './diagrams/Flow'

const mdxComponents = { Sequence, Msg, Note, Phase, Graph, Flow, Step, Compare, Panel }

type Go = (to: string) => (e: MouseEvent) => void

function usePath() {
  const [path, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  const go: Go = (to) => (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    window.history.pushState(null, '', to)
    setPath(to)
    window.scrollTo(0, 0)
  }
  return { path, go }
}

function useTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | 고동수` : '고동수 포트폴리오'
  }, [title])
}

export default function App() {
  const { path, go } = usePath()
  const projectSlug = path.match(/^\/projects\/([^/]+)\/?$/)?.[1]
  const caseSlug = path.match(/^\/cases\/([^/]+)/)?.[1]
  const project = projectSlug ? projects.find((p) => p.slug === projectSlug) : undefined
  const entry = caseSlug ? cases.find((c) => c.slug === caseSlug) : undefined

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a href="/" onClick={go('/')} className="brand">
            고동수
          </a>
          <nav className="main-nav">
            {projects.map((p) => (
              <a key={p.slug} href={`/projects/${p.slug}`} onClick={go(`/projects/${p.slug}`)}>
                {p.name}
              </a>
            ))}
            <a href="https://github.com/kdongsu5509">GitHub</a>
          </nav>
        </div>
      </header>
      <main>
        {entry ? <CasePage entry={entry} go={go} /> : project ? <ProjectPage project={project} go={go} /> : <Home go={go} />}
      </main>
      <footer className="footer">
        <div className="container">
          <span>kod66170@gmail.com</span>
        </div>
      </footer>
    </>
  )
}

function Home({ go }: { go: Go }) {
  useTitle()
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>
            하네스를 씌워도 널뛰는 AI,
            <br />
            아키텍처 테스트로 통제하는 백엔드 개발자
          </h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">프로젝트</h2>
          <ul className="project-list">
            {projects.map((p) => (
              <li key={p.slug}>
                <a href={`/projects/${p.slug}`} onClick={go(`/projects/${p.slug}`)} className="project-row">
                  <img src={p.logo} alt="" className="project-logo" />
                  <div className="project-row__body">
                    <h3>{p.name}</h3>
                    <p>{p.summary}</p>
                    <span className="project-row__meta">
                      {p.period} · {p.team} · {p.role}
                    </span>
                  </div>
                  <span className="project-row__count">문제 해결 {casesOf(p).length}개 →</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

function ProjectPage({ project, go }: { project: Project; go: Go }) {
  useTitle(project.name)
  const list = casesOf(project)
  return (
    <section className="project-page">
      <div className="container">
        <a href="/" onClick={go('/')} className="back-link">
          ← 프로젝트 목록
        </a>
        <header className="project-head">
          <img src={project.logo} alt={`${project.name} 로고`} className="project-logo is-large" />
          <div>
            <h1>{project.name}</h1>
            <p>{project.summary}</p>
          </div>
        </header>
        <dl className="project-facts">
          <div>
            <dt>기간</dt>
            <dd>{project.period}</dd>
          </div>
          <div>
            <dt>구성</dt>
            <dd>{project.team}</dd>
          </div>
          <div>
            <dt>맡은 범위</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>기술</dt>
            <dd>{project.stack}</dd>
          </div>
          <div>
            <dt>링크</dt>
            <dd className="project-links">
              {project.links.map((l) => (
                <a key={l.href} href={l.href} className="text-link">
                  {l.label}
                </a>
              ))}
            </dd>
          </div>
        </dl>

        <h2 className="section-title">문제 해결</h2>
        <ol className="case-list">
          {list.map((c) => (
            <li key={c.slug}>
              <a href={`/cases/${c.slug}`} onClick={go(`/cases/${c.slug}`)} className="case-row">
                <div className="case-row__body">
                  <h3>{c.title}</h3>
                  <p>{c.summary}</p>
                </div>
                {c.metrics[0] && (
                  <strong className="case-row__metric">
                    {c.metrics[0].value}
                    <small>{c.metrics[0].label}</small>
                  </strong>
                )}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function CasePage({ entry, go }: { entry: CaseEntry; go: Go }) {
  useTitle(entry.title)
  const { Content } = entry
  const project = projectOf(entry)
  const siblings = casesOf(project)
  const next = siblings[siblings.indexOf(entry) + 1]

  return (
    <article className="case-page">
      <div className="container">
        <a href={`/projects/${project.slug}`} onClick={go(`/projects/${project.slug}`)} className="back-link">
          ← {project.name} 문제 해결 목록
        </a>
        <header className="case-head">
          <span className="case-head__project">
            <img src={project.logo} alt="" />
            {project.name}
          </span>
          <h1>{entry.headline}</h1>
        </header>
        <div className="case-layout">
          <div className="prose">
            <Content components={mdxComponents} />
          </div>
          <aside className="case-facts">
            <dl>
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
        {next ? (
          <a href={`/cases/${next.slug}`} onClick={go(`/cases/${next.slug}`)} className="next-case">
            <span>{project.name} 다음 사례</span>
            <strong>{next.title}</strong>
          </a>
        ) : (
          <a href={`/projects/${project.slug}`} onClick={go(`/projects/${project.slug}`)} className="next-case">
            <span>{project.name}</span>
            <strong>문제 해결 목록으로 돌아가기</strong>
          </a>
        )}
      </div>
    </article>
  )
}
