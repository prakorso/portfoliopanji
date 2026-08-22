import EditorPage from '../components/EditorPage.jsx'
import { Panel } from '../components/Fields.jsx'
import { ToolsFields, FrameworkFields } from '../sections/SectionFields.jsx'

export default function SkillsEditor() {
  return (
    <EditorPage
      title="Skills"
      description="Tools & technologies, and the four-step way of working."
      sectionKeys={['tools', 'framework']}
    >
      {({ section }) => (
        <>
          <Panel title="Tools & technologies">
            <ToolsFields {...section('tools')} />
          </Panel>
          <Panel title="How I think" description="The four-step marketing framework.">
            <FrameworkFields {...section('framework')} />
          </Panel>
        </>
      )}
    </EditorPage>
  )
}
