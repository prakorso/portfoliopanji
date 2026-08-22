import EditorPage from '../components/EditorPage.jsx'
import { Panel } from '../components/Fields.jsx'
import {
  HeroFields,
  StatsFields,
  AboutFields,
  DisciplineFields,
  ProjectsHeadingFields,
  FeaturedProjectsFields,
  ImpactFields,
  ToolsFields,
  ContactFields
} from '../sections/SectionFields.jsx'

const KEYS = [
  'hero',
  'stats',
  'about',
  'disciplines',
  'projectsSection',
  'impact',
  'tools',
  'contact'
]

export default function HomepageEditor() {
  return (
    <EditorPage
      title="Homepage"
      description="Everything on the public homepage, in the order it appears."
      sectionKeys={KEYS}
      withProjects
    >
      {({ section, projects, updateProjects }) => (
        <>
          <Panel title="Hero" description="The first screen visitors see.">
            <HeroFields {...section('hero')} />
          </Panel>

          <Panel title="Statistics" description="The three credibility figures under the hero.">
            <StatsFields {...section('stats')} />
          </Panel>

          <Panel title="About">
            <AboutFields {...section('about')} />
          </Panel>

          <Panel title="Marketing disciplines" description="The four capability cards.">
            <DisciplineFields {...section('disciplines')} />
          </Panel>

          <Panel title="Featured projects" description="Which projects show in the homepage carousel, and in what order.">
            <ProjectsHeadingFields {...section('projectsSection')} />
            <FeaturedProjectsFields projects={projects} onChange={updateProjects} />
          </Panel>

          <Panel title="Impact">
            <ImpactFields {...section('impact')} />
          </Panel>

          <Panel title="Tools & technologies">
            <ToolsFields {...section('tools')} />
          </Panel>

          <Panel title="Contact">
            <ContactFields {...section('contact')} />
          </Panel>
        </>
      )}
    </EditorPage>
  )
}
