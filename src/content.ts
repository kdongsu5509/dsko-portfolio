import type { ComponentType } from 'react'

export type Metric = { label: string; value: string }

export type CaseMeta = {
  project: 'ImHere' | '비비디'
  order: number
  title: string
  headline: string
  summary: string
  period: string
  role: string
  stack: string[]
  metrics: Metric[]
}

export type CaseEntry = CaseMeta & { slug: string; Content: ComponentType<{ components?: Record<string, unknown> }> }

type MdxModule = { default: CaseEntry['Content']; frontmatter: CaseMeta }

const modules = import.meta.glob<MdxModule>('../content/cases/*.mdx', { eager: true })

export const cases: CaseEntry[] = Object.entries(modules)
  .map(([path, mod]) => ({
    ...mod.frontmatter,
    slug: path.split('/').pop()!.replace(/^\d+-/, '').replace(/\.mdx$/, ''),
    Content: mod.default,
  }))
  .sort((a, b) => a.order - b.order)

export type Project = {
  slug: string
  logo: string
  name: 'ImHere' | '비비디'
  summary: string
  period: string
  team: string
  role: string
  stack: string
  links: { label: string; href: string }[]
}

export const projects: Project[] = [
  {
    slug: 'imhere',
    logo: '/logos/imhere.svg',
    name: 'ImHere',
    summary: '출발과 도착 같은 상태 변화를 친구와 가족에게 자동으로 알려 주는 서비스',
    period: '2025.12 – 현재',
    team: '1인 개발',
    role: '서버와 Flutter 앱 전체',
    stack: 'Kotlin 2.3 · Spring Boot 4.1 · Spring Modulith · MySQL · Flutter 3',
    links: [
      { label: '서버 저장소', href: 'https://github.com/ImHereOfRati/server' },
      { label: '서비스 소개', href: 'https://imhere.ratiko.co.kr' },
    ],
  },
  {
    slug: 'bibbidi',
    logo: '/logos/bibbidi.png',
    name: '비비디',
    summary: '결혼 준비 일정과 체크리스트를 AI 챗봇과 함께 관리하는 서비스',
    period: '2026.08 – 현재',
    team: 'FE 1 · BE 3',
    role: '일정 · AI 챗봇 기능, 배포 · CI/CD · 모니터링',
    stack: 'Java 25 · Spring Boot 4.1 · Spring AI · MySQL',
    links: [{ label: '저장소', href: 'https://github.com/woowacourse-teams/2026-bibbidi' }],
  },
]

export const casesOf = (p: Project) => cases.filter((c) => c.project === p.name)
export const projectOf = (c: CaseEntry) => projects.find((p) => p.name === c.project)!
