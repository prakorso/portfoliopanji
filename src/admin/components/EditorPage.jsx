import { useSectionsEditor } from '../useEditor.js'
import SaveBar from './SaveBar.jsx'

/**
 * Loads a set of content sections, renders the supplied fields, and saves them
 * together. Every admin screen is built from this so save behaviour is identical.
 */
export default function EditorPage({
  title,
  description,
  sectionKeys,
  withProjects = false,
  previewHref = '/',
  children
}) {
  const editor = useSectionsEditor(sectionKeys, { withProjects })

  return (
    <div className="apage">
      <header className="apage__head">
        <h1 className="apage__title">{title}</h1>
        {description && <p className="apage__desc">{description}</p>}
      </header>

      {editor.loading ? (
        <p className="apage__loading">Loading content…</p>
      ) : (
        <div className="apage__body">
          {children({
            values: editor.values,
            projects: editor.projects,
            setSection: editor.setSection,
            setField: editor.setField,
            updateProjects: editor.updateProjects,
            section: (key) => ({
              value: editor.values[key] ?? {},
              onChange: (next) => editor.setSection(key, next)
            })
          })}
        </div>
      )}

      <SaveBar
        dirty={editor.dirty}
        saving={editor.saving}
        status={editor.status}
        onSave={editor.save}
        previewHref={previewHref}
      />
    </div>
  )
}
