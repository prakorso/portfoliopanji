import { TextInput, TextArea, Row, Repeater, StringList, Toggle, Select } from '../components/Fields.jsx'
import ImageField from '../components/ImageField.jsx'

const set = (value, onChange) => (field) => (next) => onChange({ ...value, [field]: next })

/* ---------------------------------------------------------------- Hero */

export function HeroFields({ value, onChange }) {
  const field = set(value, onChange)
  return (
    <>
      <TextInput label="Eyebrow" value={value.eyebrow} onChange={field('eyebrow')} />

      <Repeater
        items={value.headingLines ?? []}
        onChange={field('headingLines')}
        addLabel="Add heading line"
        newItem={() => ({ text: '', accent: false })}
        renderItem={(line, onLineChange) => (
          <Row cols={2}>
            <TextInput
              label="Line text"
              value={line.text}
              onChange={(text) => onLineChange({ ...line, text })}
            />
            <Toggle
              label="Highlight in blue"
              checked={line.accent}
              onChange={(accent) => onLineChange({ ...line, accent })}
            />
          </Row>
        )}
      />

      <TextArea label="Description" rows={3} value={value.description} onChange={field('description')} />

      <Row cols={2}>
        <TextInput label="Primary CTA text" value={value.primaryCtaLabel} onChange={field('primaryCtaLabel')} />
        <TextInput label="Primary CTA link" value={value.primaryCtaHref} onChange={field('primaryCtaHref')} />
      </Row>
      <Row cols={2}>
        <TextInput label="Secondary CTA text" value={value.secondaryCtaLabel} onChange={field('secondaryCtaLabel')} />
        <TextInput label="Secondary CTA link" value={value.secondaryCtaHref} onChange={field('secondaryCtaHref')} />
      </Row>

      <ImageField
        label="Hero image"
        hint="Portrait crop (4:5) works best."
        value={value.image}
        onChange={field('image')}
      />
      <Row cols={2}>
        <TextInput label="Image alt text" value={value.imageAlt} onChange={field('imageAlt')} />
        <TextInput label="Image badge" value={value.badge} onChange={field('badge')} />
      </Row>
    </>
  )
}

/* --------------------------------------------------------------- Stats */

export function StatsFields({ value, onChange }) {
  return (
    <Repeater
      items={value.items ?? []}
      onChange={(items) => onChange({ ...value, items })}
      addLabel="Add statistic"
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
  )
}

/* --------------------------------------------------------------- About */

export function AboutFields({ value, onChange }) {
  const field = set(value, onChange)
  return (
    <>
      <TextInput label="Section label" value={value.label} onChange={field('label')} />
      <Row cols={2}>
        <TextInput label="Heading" value={value.heading} onChange={field('heading')} />
        <TextInput
          label="Heading (highlighted part)"
          value={value.headingAccent}
          onChange={field('headingAccent')}
        />
      </Row>
      <TextArea label="Description" rows={3} value={value.description} onChange={field('description')} />
      <TextArea
        label="Supporting note"
        hint="Optional smaller paragraph under the description."
        rows={3}
        value={value.note}
        onChange={field('note')}
      />
      <ImageField
        label="About image"
        hint="Optional. The approved About layout does not display an image — this is stored for future use."
        value={value.image}
        onChange={field('image')}
      />
      <Row cols={2}>
        <TextInput label="CV button text" value={value.cvLabel} onChange={field('cvLabel')} />
        <TextInput
          label="CV download link"
          hint="Upload the PDF in Media, then paste its path."
          value={value.cvUrl}
          onChange={field('cvUrl')}
        />
      </Row>
    </>
  )
}

/* --------------------------------------------------------- Disciplines */

const ICON_OPTIONS = [
  { value: 'brand', label: 'Brand (hexagon)' },
  { value: 'digital', label: 'Digital (screen)' },
  { value: 'performance', label: 'Performance (target)' },
  { value: 'growth', label: 'Growth (trend line)' }
]

export function DisciplineFields({ value, onChange }) {
  return (
    <Repeater
      items={value.items ?? []}
      onChange={(items) => onChange({ ...value, items })}
      addLabel="Add discipline"
      newItem={() => ({ number: '', title: '', description: '', icon: 'growth', items: [] })}
      renderItem={(item, onItemChange) => (
        <>
          <Row cols={3}>
            <TextInput
              label="Number"
              value={item.number}
              onChange={(number) => onItemChange({ ...item, number })}
            />
            <TextInput
              label="Title"
              value={item.title}
              onChange={(title) => onItemChange({ ...item, title })}
            />
            <Select
              label="Icon"
              value={item.icon}
              options={ICON_OPTIONS}
              onChange={(icon) => onItemChange({ ...item, icon })}
            />
          </Row>
          <TextInput
            label="Short description"
            hint="Optional. Leave empty to keep the current card design (icon, title, points only)."
            value={item.description}
            onChange={(description) => onItemChange({ ...item, description })}
          />
          <StringList
            label="Points"
            values={item.items ?? []}
            onChange={(items) => onItemChange({ ...item, items })}
          />
        </>
      )}
    />
  )
}

/* ------------------------------------------------- Projects section head */

export function ProjectsHeadingFields({ value, onChange }) {
  const field = set(value, onChange)
  return (
    <>
      <Row cols={2}>
        <TextInput label="Section label" value={value.label} onChange={field('label')} />
        <TextInput label="Section title" value={value.title} onChange={field('title')} />
      </Row>
      <TextArea label="Subheadline" rows={2} value={value.lead} onChange={field('lead')} />
    </>
  )
}

/* ---------------------------------------------------- Featured projects */

export function FeaturedProjectsFields({ projects, onChange }) {
  const move = (index, delta) => {
    const target = index + delta
    if (target < 0 || target >= projects.length) return
    const copy = [...projects]
    ;[copy[index], copy[target]] = [copy[target], copy[index]]
    onChange(copy)
  }

  return (
    <div className="afeatured">
      {projects.map((project, index) => (
        <div className="afeatured__row" key={project.slug}>
          <Toggle
            label={project.data?.title ?? project.slug}
            checked={project.featured !== false}
            onChange={(featured) => {
              const copy = [...projects]
              copy[index] = { ...project, featured }
              onChange(copy)
            }}
          />
          <span className="afeatured__slug">/projects/{project.slug}</span>
          <div className="afeatured__order">
            <button type="button" onClick={() => move(index, -1)} disabled={index === 0}>
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === projects.length - 1}
            >
              ↓
            </button>
          </div>
        </div>
      ))}
      <p className="af__hint">
        Unticked projects stay published at their own URL but are hidden from the homepage carousel.
      </p>
    </div>
  )
}

/* -------------------------------------------------------------- Impact */

export function ImpactFields({ value, onChange }) {
  const field = set(value, onChange)
  return (
    <>
      <Row cols={2}>
        <TextInput label="Section label" value={value.label} onChange={field('label')} />
        <TextInput label="Section title" value={value.title} onChange={field('title')} />
      </Row>

      <Repeater
        items={value.items ?? []}
        onChange={field('items')}
        addLabel="Add metric"
        newItem={() => ({ value: '', label: '' })}
        renderItem={(item, onItemChange) => (
          <Row cols={2}>
            <TextInput
              label="Metric"
              value={item.value}
              onChange={(v) => onItemChange({ ...item, value: v })}
            />
            <TextInput
              label="Metric label"
              value={item.label}
              onChange={(label) => onItemChange({ ...item, label })}
            />
          </Row>
        )}
      />

      <TextInput label="Attribution" value={value.attribution} onChange={field('attribution')} />
      <TextArea
        label="Supporting / disclaimer text"
        hint="Shown under the metrics. Keep the attribution and time period explicit."
        rows={3}
        value={value.note}
        onChange={field('note')}
      />
    </>
  )
}

/* ---------------------------------------------------------- Milestones */

export function MilestonesFields({ value, onChange }) {
  const field = set(value, onChange)
  return (
    <>
      <Row cols={2}>
        <TextInput label="Section label" value={value.label} onChange={field('label')} />
        <TextInput label="Section title" value={value.title} onChange={field('title')} />
      </Row>
      <TextArea label="Intro" rows={2} value={value.lead} onChange={field('lead')} />

      <Repeater
        items={value.items ?? []}
        onChange={field('items')}
        addLabel="Add milestone"
        newItem={() => ({ year: '', title: '', description: '' })}
        renderItem={(item, onItemChange) => (
          <>
            <Row cols={2}>
              <TextInput
                label="Year"
                value={item.year}
                onChange={(year) => onItemChange({ ...item, year })}
              />
              <TextInput
                label="Title"
                value={item.title}
                onChange={(title) => onItemChange({ ...item, title })}
              />
            </Row>
            <TextArea
              label="Short description"
              rows={2}
              value={item.description}
              onChange={(description) => onItemChange({ ...item, description })}
            />
          </>
        )}
      />
    </>
  )
}

/* ----------------------------------------------------------- Framework */

export function FrameworkFields({ value, onChange }) {
  const field = set(value, onChange)
  return (
    <>
      <TextInput label="Section label" value={value.label} onChange={field('label')} />
      <Row cols={2}>
        <TextInput label="Title" value={value.title} onChange={field('title')} />
        <TextInput
          label="Title (highlighted part)"
          value={value.titleAccent}
          onChange={field('titleAccent')}
        />
      </Row>
      <TextArea label="Intro" rows={2} value={value.lead} onChange={field('lead')} />

      <Repeater
        items={value.items ?? []}
        onChange={field('items')}
        addLabel="Add step"
        newItem={() => ({ number: '', title: '', caption: '', items: [] })}
        renderItem={(item, onItemChange) => (
          <>
            <Row cols={2}>
              <TextInput
                label="Number"
                value={item.number}
                onChange={(number) => onItemChange({ ...item, number })}
              />
              <TextInput
                label="Title"
                value={item.title}
                onChange={(title) => onItemChange({ ...item, title })}
              />
            </Row>
            <TextInput
              label="Caption"
              value={item.caption}
              onChange={(caption) => onItemChange({ ...item, caption })}
            />
            <StringList
              label="Points"
              values={item.items ?? []}
              onChange={(items) => onItemChange({ ...item, items })}
            />
          </>
        )}
      />
    </>
  )
}

/* --------------------------------------------------------------- Tools */

export function ToolsFields({ value, onChange }) {
  const field = set(value, onChange)
  return (
    <>
      <Row cols={2}>
        <TextInput label="Section label" value={value.label} onChange={field('label')} />
        <TextInput label="Section title" value={value.title} onChange={field('title')} />
      </Row>

      <Repeater
        items={value.groups ?? []}
        onChange={field('groups')}
        addLabel="Add group"
        newItem={() => ({ group: '', tools: [] })}
        renderItem={(item, onItemChange) => (
          <>
            <TextInput
              label="Group name"
              value={item.group}
              onChange={(group) => onItemChange({ ...item, group })}
            />
            <StringList
              label="Tools"
              values={item.tools ?? []}
              onChange={(tools) => onItemChange({ ...item, tools })}
            />
          </>
        )}
      />
    </>
  )
}

/* ------------------------------------------------------------- Contact */

export function ContactFields({ value, onChange }) {
  const field = set(value, onChange)
  return (
    <>
      <TextInput label="Section label" value={value.label} onChange={field('label')} />
      <Row cols={2}>
        <TextInput label="Title" value={value.title} onChange={field('title')} />
        <TextInput
          label="Title (highlighted part)"
          value={value.titleAccent}
          onChange={field('titleAccent')}
        />
      </Row>
      <TextArea label="Supporting text" rows={2} value={value.lead} onChange={field('lead')} />
      <TextInput label="CTA text" value={value.ctaLabel} onChange={field('ctaLabel')} />

      <Row cols={2}>
        <TextInput label="Email" type="email" value={value.email} onChange={field('email')} />
        <TextInput
          label="Phone"
          hint="Optional. A phone row appears only when this is filled in."
          value={value.phone}
          onChange={field('phone')}
        />
      </Row>
      <TextInput label="Location" value={value.location} onChange={field('location')} />

      <Row cols={2}>
        <TextInput label="LinkedIn label" value={value.linkedinLabel} onChange={field('linkedinLabel')} />
        <TextInput label="LinkedIn URL" value={value.linkedinUrl} onChange={field('linkedinUrl')} />
      </Row>
      <Row cols={2}>
        <TextInput
          label="Instagram label"
          value={value.instagramLabel}
          onChange={field('instagramLabel')}
        />
        <TextInput label="Instagram URL" value={value.instagramUrl} onChange={field('instagramUrl')} />
      </Row>
    </>
  )
}

/* ------------------------------------------------------------- General */

export function GeneralFields({ value, onChange }) {
  const field = set(value, onChange)
  return (
    <Row cols={2}>
      <TextInput label="Name" value={value.name} onChange={field('name')} />
      <TextInput label="Tagline" value={value.tagline} onChange={field('tagline')} />
    </Row>
  )
}
