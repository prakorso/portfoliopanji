import EditorPage from '../components/EditorPage.jsx'
import { Panel } from '../components/Fields.jsx'
import { ContactFields } from '../sections/SectionFields.jsx'

export default function ContactEditor() {
  return (
    <EditorPage
      title="Contact"
      description="Contact details, shown in the final section and the footer."
      sectionKeys={['contact']}
      previewHref="/#contact"
    >
      {({ section }) => (
        <Panel title="Contact section">
          <ContactFields {...section('contact')} />
        </Panel>
      )}
    </EditorPage>
  )
}
