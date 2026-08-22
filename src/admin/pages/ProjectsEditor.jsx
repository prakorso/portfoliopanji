import { useState } from 'react'
import { isSupabaseConfigured } from '../../lib/supabase.js'
import { supabase } from '../../lib/supabaseClient.js'
import { useSectionsEditor } from '../useEditor.js'
import SaveBar from '../components/SaveBar.jsx'
import { Panel, TextInput, TextArea, Row, Repeater, StringList, Select, Toggle } from '../components/Fields.jsx'

const VISUALS = [
  { value: 'dashboard', label: 'Dashboard / campaign' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'devices', label: 'Devices / laptop' }
]

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

function ProjectForm({ project, onChange }) {
  const data = project.data ?? {}
  const setData = (field) => (value) => onChange({ ...project, data: { ...data, [field]: value } })

  return (
    <>
      <Row cols={3}>
        <TextInput label="Number" value={data.number} onChange={setData('number')} />
        <TextInput label="Title" value={data.title} onChange={setData('title')} />
        <TextInput
          label="Display title"
          hint="Shown in caps on the card."
          value={data.displayTitle}
          onChange={setData('displayTitle')}
        />
      </Row>

      <Row cols={2}>
        <TextInput label="Category" value={data.category} onChange={setData('category')} />
        <TextInput label="Short category" value={data.categoryShort} onChange={setData('categoryShort')} />
      </Row>

      <TextArea
        label="Card description"
        rows={2}
        value={data.shortDescription}
        onChange={setData('shortDescription')}
      />
      <TextArea
        label="Case study intro"
        rows={3}
        value={data.heroDescription}
        onChange={setData('heroDescription')}
      />

      <Row cols={2}>
        <Select label="Visual" value={data.visual} options={VISUALS} onChange={setData('visual')} />
        <TextInput
          label="Key learning"
          value={data.learning}
          onChange={setData('learning')}
        />
      </Row>

      <StringList label="Capability tags" values={data.tags ?? []} onChange={setData('tags')} />

      <Panel title="Card metrics" description="Leave empty to show capability tags on the card instead.">
        <Repeater
          items={data.cardMetrics ?? []}
          onChange={setData('cardMetrics')}
          addLabel="Add card metric"
          newItem={() => ({ value: '', label: '' })}
          renderItem={(item, onItemChange) => (
            <Row cols={2}>
              <TextInput
                label="Value"
                value={item.value}
                onChange={(v) => onItemChange({ ...item, value: v })}
              />
              <TextInput
                label="Label"
                value={item.label}
                onChange={(label) => onItemChange({ ...item, label })}
              />
            </Row>
          )}
        />
      </Panel>

      <Panel title="Case study chapters">
        <Repeater
          items={data.chapters ?? []}
          onChange={setData('chapters')}
          addLabel="Add chapter"
          newItem={() => ({ id: `chapter-${Date.now()}`, label: '', title: '', body: [] })}
          renderItem={(chapter, onChapterChange) => (
            <>
              <Row cols={2}>
                <TextInput
                  label="Label"
                  value={chapter.label}
                  onChange={(label) => onChapterChange({ ...chapter, label })}
                />
                <TextInput
                  label="Title"
                  value={chapter.title}
                  onChange={(title) => onChapterChange({ ...chapter, title })}
                />
              </Row>
              <StringList
                label="Paragraphs"
                hint="One paragraph per line."
                values={chapter.body ?? []}
                onChange={(body) => onChapterChange({ ...chapter, body })}
              />
              <StringList
                label="Bullet points"
                values={chapter.bullets ?? []}
                onChange={(bullets) => onChapterChange({ ...chapter, bullets })}
              />
            </>
          )}
        />
      </Panel>

      <Panel title="Impact" description="Use qualitative points instead of metrics where no verified number exists.">
        <Row cols={2}>
          <TextInput
            label="Impact label"
            value={data.impact?.label}
            onChange={(label) => setData('impact')({ ...(data.impact ?? {}), label })}
          />
          <TextInput
            label="Attribution"
            value={data.impact?.attribution}
            onChange={(attribution) => setData('impact')({ ...(data.impact ?? {}), attribution })}
          />
        </Row>
        <TextArea
          label="Attribution note"
          rows={3}
          value={data.impact?.note}
          onChange={(note) => setData('impact')({ ...(data.impact ?? {}), note })}
        />
        <Repeater
          items={data.impact?.items ?? []}
          onChange={(items) => setData('impact')({ ...(data.impact ?? {}), items })}
          addLabel="Add metric"
          newItem={() => ({ value: '', label: '' })}
          renderItem={(item, onItemChange) => (
            <Row cols={2}>
              <TextInput
                label="Value"
                value={item.value}
                onChange={(v) => onItemChange({ ...item, value: v })}
              />
              <TextInput
                label="Label"
                value={item.label}
                onChange={(label) => onItemChange({ ...item, label })}
              />
            </Row>
          )}
        />
        <StringList
          label="Qualitative points"
          values={data.impact?.qualitative ?? []}
          onChange={(qualitative) => setData('impact')({ ...(data.impact ?? {}), qualitative })}
        />
      </Panel>
    </>
  )
}

export default function ProjectsEditor() {
  const editor = useSectionsEditor(['projectsSection'], { withProjects: true })
  const [open, setOpen] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [notice, setNotice] = useState(null)

  const update = (index, next) => {
    const copy = [...editor.projects]
    copy[index] = next
    editor.updateProjects(copy)
  }

  const move = (index, delta) => {
    const target = index + delta
    if (target < 0 || target >= editor.projects.length) return
    const copy = [...editor.projects]
    ;[copy[index], copy[target]] = [copy[target], copy[index]]
    editor.updateProjects(copy)
  }

  const addProject = () => {
    const title = newTitle.trim()
    if (!title) return
    const slug = slugify(title)
    if (editor.projects.some((p) => p.slug === slug)) {
      setNotice('A project with that URL already exists.')
      return
    }
    editor.updateProjects([
      ...editor.projects,
      {
        slug,
        position: editor.projects.length,
        featured: true,
        data: {
          number: String(editor.projects.length + 1).padStart(2, '0'),
          title,
          displayTitle: title.toUpperCase(),
          category: '',
          categoryShort: '',
          shortDescription: '',
          heroDescription: '',
          visual: 'dashboard',
          tags: [],
          cardMetrics: [],
          chapters: [],
          impact: { label: 'Impact', attribution: '', note: '', items: [] },
          learning: ''
        }
      }
    ])
    setNewTitle('')
    setNotice(null)
    setOpen(slug)
  }

  const deleteProject = async (project) => {
    if (!window.confirm(`Delete "${project.data?.title ?? project.slug}" permanently?`)) return
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('projects').delete().eq('slug', project.slug)
      if (error) {
        setNotice(`Delete failed: ${error.message}`)
        return
      }
    }
    editor.updateProjects(editor.projects.filter((p) => p.slug !== project.slug))
    setNotice(null)
  }

  return (
    <div className="apage">
      <header className="apage__head">
        <h1 className="apage__title">Projects</h1>
        <p className="apage__desc">
          Case studies and the homepage carousel. Each project is published at /projects/&lt;url&gt;.
        </p>
      </header>

      {editor.loading ? (
        <p className="apage__loading">Loading projects…</p>
      ) : (
        <div className="apage__body">
          {notice && <p className="astatus astatus--error">{notice}</p>}

          {editor.projects.map((project, index) => (
            <div className="aproject" key={project.slug}>
              <div className="aproject__bar">
                <button
                  type="button"
                  className="aproject__toggle"
                  onClick={() => setOpen(open === project.slug ? null : project.slug)}
                  aria-expanded={open === project.slug}
                >
                  <span className="aproject__num">{project.data?.number ?? index + 1}</span>
                  <span>
                    <strong>{project.data?.title ?? project.slug}</strong>
                    <span className="aproject__slug">/projects/{project.slug}</span>
                  </span>
                </button>

                <div className="aproject__tools">
                  <Toggle
                    label="Featured"
                    checked={project.featured !== false}
                    onChange={(featured) => update(index, { ...project, featured })}
                  />
                  <button type="button" onClick={() => move(index, -1)} disabled={index === 0}>
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === editor.projects.length - 1}
                  >
                    ↓
                  </button>
                  <button type="button" className="aproject__delete" onClick={() => deleteProject(project)}>
                    Delete
                  </button>
                </div>
              </div>

              {open === project.slug && (
                <div className="aproject__body">
                  <ProjectForm project={project} onChange={(next) => update(index, next)} />
                </div>
              )}
            </div>
          ))}

          <Panel title="Add a project">
            <Row cols={2}>
              <TextInput label="Project title" value={newTitle} onChange={setNewTitle} />
              <div className="af">
                <span className="af__label">&nbsp;</span>
                <button type="button" className="abtn" onClick={addProject}>
                  Add project
                </button>
              </div>
            </Row>
          </Panel>
        </div>
      )}

      <SaveBar
        dirty={editor.dirty}
        saving={editor.saving}
        status={editor.status}
        onSave={editor.save}
        previewHref="/#projects"
      />
    </div>
  )
}
