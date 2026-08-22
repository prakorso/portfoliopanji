import EditorPage from '../components/EditorPage.jsx'
import { Panel } from '../components/Fields.jsx'
import { MilestonesFields, ImpactFields } from '../sections/SectionFields.jsx'

export default function ExperienceEditor() {
  return (
    <EditorPage
      title="Experience"
      description="Career milestones and the impact metrics band."
      sectionKeys={['milestones', 'impact']}
      previewHref="/#experience"
    >
      {({ section }) => (
        <>
          <Panel title="Career milestones">
            <MilestonesFields {...section('milestones')} />
          </Panel>
          <Panel title="Impact metrics">
            <ImpactFields {...section('impact')} />
          </Panel>
        </>
      )}
    </EditorPage>
  )
}
