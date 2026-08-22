import EditorPage from '../components/EditorPage.jsx'
import { Panel } from '../components/Fields.jsx'
import { GeneralFields, AboutFields, DisciplineFields } from '../sections/SectionFields.jsx'

export default function AboutEditor() {
  return (
    <EditorPage
      title="About"
      description="The About section and the four marketing disciplines."
      sectionKeys={['general', 'about', 'disciplines']}
      previewHref="/#about"
    >
      {({ section }) => (
        <>
          <Panel title="Site identity" description="Used in the navigation bar and footer.">
            <GeneralFields {...section('general')} />
          </Panel>
          <Panel title="About section">
            <AboutFields {...section('about')} />
          </Panel>
          <Panel title="Marketing disciplines">
            <DisciplineFields {...section('disciplines')} />
          </Panel>
        </>
      )}
    </EditorPage>
  )
}
