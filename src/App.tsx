import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { cases, casesOf, projectOf, projects, type CaseEntry, type Project } from './content'
import { Sequence, Msg, Note, Phase } from './diagrams/Sequence'
import { Graph } from './diagrams/Graph'
import { Flow, Step, Compare, Panel } from './diagrams/Flow'

const mdxComponents = { Sequence, Msg, Note, Phase, Graph, Flow, Step, Compare, Panel }

type Go = (to: string) => (e: MouseEvent) => void
type TocEntry = { id: string; text: string; level: 2 | 3 | 4 }

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
            <a href="https://www.linkedin.com/in/ds-ko/">LinkedIn</a>
            <a href="https://github.com/kdongsu5509">GitHub</a>
          </nav>
        </div>
      </header>
      <main>
        {entry ? <CasePage entry={entry} go={go} /> : project ? <ProjectPage project={project} go={go} /> : <Home go={go} />}
      </main>
    </>
  )
}

function Home({ go }: { go: Go }) {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>
            하네스를 씌워도 널뛰는 AI,
            <br />
            아키텍처 테스트로 통제하는 백엔드 개발자
          </h1>
          <p className="hero__tagline">AI 시대에도 객체지향을 중심으로 설계하는 백엔드 개발자 고동수</p>
          <dl className="hero__contact">
            <div>
              <dt>PHONE</dt>
              <dd>
                <a href="tel:01073512781">010-7351-2781</a>
              </dd>
            </div>
            <div>
              <dt>EMAIL</dt>
              <dd>
                <a href="mailto:kod66170@gmail.com">kod66170@gmail.com</a>
              </dd>
            </div>
          </dl>
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
                  <span className="project-row__count">자세히 보기 →</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--edu">
        <div className="container">
          <h2 className="section-title">기술 스택</h2>
          <dl className="stack-list">
            <div className="stack-row">
              <dt>주력</dt>
              <dd>Java 25 · Spring Boot 4.1 · Spring Modulith · Spring AI · JPA · MySQL · Dart 3 · Flutter 3</dd>
            </div>
            <div className="stack-row">
              <dt>경험</dt>
              <dd>
                <p>Kotlin 2.3 · Spring Security · QueryDSL · Caffeine · Bucket4j</p>
                <p>AWS EC2 · ECR · CloudFormation · Docker · Nginx · GitHub Actions</p>
                <p>Prometheus · Grafana · Loki · Tempo · Alloy · k6 · ArchUnit</p>
                <p>Firebase FCM · Solapi</p>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section section--edu">
        <div className="container">
          <h2 className="section-title">Education</h2>
          <ul className="edu-list">
            <li className="edu-row">
              <div className="edu-row__body">
                <h3>경북대학교</h3>
                <p>학사 · 2027.02 졸업예정</p>
                <p>독어독문학전공 (주전공)</p>
                <p>컴퓨터학부 글로벌소프트웨어융합전공 (부전공)</p>
              </div>
              <span className="edu-row__period">2020.03 – 2027.02</span>
            </li>
            <li className="edu-row">
              <div className="edu-row__body">
                <h3>우아한테크코스 8기</h3>
                <p>백엔드 크루</p>
              </div>
              <span className="edu-row__period">2026.02 – 2026.12</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="section section--edu">
        <div className="container">
          <h2 className="section-title">활동 · 수상 · 자격증</h2>

          <h3 className="sub-title">활동</h3>
          <ul className="edu-list">
            <li className="edu-row">
              <div className="edu-row__body">
                <h3>해달 · 경북대 전자공학과 동아리</h3>
                <p>3년간 Java · Spring 스터디와 멘토링 진행</p>
              </div>
              <span className="edu-row__period">2023.03 – 2026.02</span>
            </li>
            <li className="edu-row">
              <div className="edu-row__body">
                <h3>Notion Campus Leader</h3>
                <p>무엇을 만들지 막막해하는 비개발자 학생을 위해 포트폴리오를 직접 만드는 강의로 구성</p>
              </div>
              <span className="edu-row__period">2024.09 – 2025.07</span>
            </li>
            <li className="edu-row">
              <div className="edu-row__body">
                <h3>GDG on Campus KNU</h3>
                <p>백엔드 세미나와 Solution Challenge 참여</p>
              </div>
              <span className="edu-row__period">2024.09 – 2025.07</span>
            </li>
          </ul>

          <h3 className="sub-title">수상</h3>
          <ul className="edu-list">
            <li className="edu-row">
              <div className="edu-row__body">
                <h3>2024 대구를 빛내는 SW 해커톤</h3>
                <p>최우수상</p>
                <p>경북대학교 IT대학 컴퓨터학부</p>
                <p>자취방 이어살기 매칭 앱 · 4인 팀에서 Flutter 앱 담당</p>
              </div>
              <span className="edu-row__period">수상일 2024.11.19</span>
            </li>
            <li className="edu-row">
              <div className="edu-row__body">
                <h3>2024 CO-SHOW 연계 AIM 챌린지</h3>
                <p>AICOSS 사업단장상 장려상</p>
                <p>인공지능혁신융합대학사업단</p>
                <p>무인 키오스크용 소형 언어 모델 개발 · sLLM과 Spring 서버 연동 담당</p>
              </div>
              <span className="edu-row__period">수상일 2024.11.22</span>
            </li>
          </ul>

          <h3 className="sub-title">자격증</h3>
          <ul className="edu-list">
            <li className="edu-row">
              <div className="edu-row__body">
                <h3>정보처리기사</h3>
                <p>한국산업인력공단</p>
              </div>
              <span className="edu-row__period">취득일 2025.06.13</span>
            </li>
            <li className="edu-row">
              <div className="edu-row__body">
                <h3>ADsP 데이터분석 준전문가</h3>
                <p>한국데이터산업진흥원</p>
              </div>
              <span className="edu-row__period">취득일 2025.09.05</span>
            </li>
            <li className="edu-row">
              <div className="edu-row__body">
                <h3>OPIc IM3</h3>
                <p>영어</p>
              </div>
              <span className="edu-row__period">취득일 2025.06.07</span>
            </li>
          </ul>
        </div>
      </section>
    </>
  )
}

function ProjectPage({ project, go }: { project: Project; go: Go }) {
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
          {list.map((c, index) => (
            <li key={c.slug}>
              <a href={`/cases/${c.slug}`} onClick={go(`/cases/${c.slug}`)} className="case-row">
                <div className="case-row__body">
                  <span className="case-row__number">{String(index + 1).padStart(2, '0')} / 문제 해결</span>
                  <h3>{c.title}</h3>
                  <p>{c.summary}</p>
                </div>
                <span className="case-row__action">자세히 보기 →</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function CasePage({ entry, go }: { entry: CaseEntry; go: Go }) {
  const { Content } = entry
  const project = projectOf(entry)
  const contentRef = useRef<HTMLDivElement>(null)
  const [toc, setToc] = useState<TocEntry[]>([])
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const headings = Array.from(contentRef.current?.querySelectorAll<HTMLHeadingElement>('h2, h3, h4') ?? [])
    const entries = headings.map((heading, index) => {
      if (!heading.id) heading.id = `${entry.slug}-section-${index}`
      return { id: heading.id, text: heading.textContent?.trim() ?? '', level: Number(heading.tagName[1]) as 2 | 3 | 4 }
    })
    setToc(entries)

    const updateActive = () => {
      const current = headings.filter((heading) => heading.getBoundingClientRect().top <= 110).at(-1)
      setActiveId(current?.id ?? headings[0]?.id ?? '')
    }
    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive)
    return () => {
      window.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', updateActive)
    }
  }, [entry.slug])

  return (
    <article className="case-page">
      <div className="container">
        <a href={`/projects/${project.slug}`} onClick={go(`/projects/${project.slug}`)} className="back-link">
          ← {project.name}
        </a>
        <header className="case-head">
          <span className="case-head__project">
            <img src={project.logo} alt="" />
            {project.name}
          </span>
          <h1>{entry.headline}</h1>
        </header>
        <div className="case-layout">
          <div className="prose" ref={contentRef}>
            <Content components={mdxComponents} />
          </div>
          <aside className="case-sidebar">
            {toc.length > 0 && (
              <nav className="project-toc" aria-label="글 목차">
                <p className="project-toc__title">목차</p>
                <ol className="project-toc__links">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={`project-toc__link project-toc__link--h${item.level}`}
                        aria-current={activeId === item.id ? 'location' : undefined}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </aside>
        </div>
      </div>
    </article>
  )
}
