import { useId } from 'react'

/** Small, dependency-free form primitives shared by every editor screen. */

export function Field({ label, hint, children, id }) {
  return (
    <div className="af">
      {label && (
        <label className="af__label" htmlFor={id}>
          {label}
        </label>
      )}
      {children}
      {hint && <p className="af__hint">{hint}</p>}
    </div>
  )
}

export function TextInput({ label, hint, value, onChange, placeholder, type = 'text' }) {
  const id = useId()
  return (
    <Field label={label} hint={hint} id={id}>
      <input
        id={id}
        className="af__input"
        type={type}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  )
}

export function TextArea({ label, hint, value, onChange, rows = 3, placeholder }) {
  const id = useId()
  return (
    <Field label={label} hint={hint} id={id}>
      <textarea
        id={id}
        className="af__input af__input--area"
        rows={rows}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  )
}

export function Select({ label, hint, value, onChange, options }) {
  const id = useId()
  return (
    <Field label={label} hint={hint} id={id}>
      <select
        id={id}
        className="af__input"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </Field>
  )
}

export function Toggle({ label, checked, onChange }) {
  return (
    <label className="af-toggle">
      <input type="checkbox" checked={Boolean(checked)} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  )
}

export function Row({ children, cols = 2 }) {
  return (
    <div className="af-row" style={{ '--cols': cols }}>
      {children}
    </div>
  )
}

export function Panel({ title, description, children, id }) {
  return (
    <section className="apanel" id={id}>
      <header className="apanel__head">
        <h2 className="apanel__title">{title}</h2>
        {description && <p className="apanel__desc">{description}</p>}
      </header>
      <div className="apanel__body">{children}</div>
    </section>
  )
}

/**
 * Generic list editor: add, remove and reorder items of any shape.
 * `renderItem(item, onItemChange, index)` renders the fields for one entry.
 */
export function Repeater({ items = [], onChange, renderItem, newItem, addLabel = 'Add item', max }) {
  const update = (index, next) => {
    const copy = [...items]
    copy[index] = next
    onChange(copy)
  }
  const remove = (index) => onChange(items.filter((_, i) => i !== index))
  const move = (index, delta) => {
    const target = index + delta
    if (target < 0 || target >= items.length) return
    const copy = [...items]
    ;[copy[index], copy[target]] = [copy[target], copy[index]]
    onChange(copy)
  }

  return (
    <div className="arep">
      {items.map((item, index) => (
        <div className="arep__item" key={index}>
          <div className="arep__bar">
            <span className="arep__index">{String(index + 1).padStart(2, '0')}</span>
            <div className="arep__actions">
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up">
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label="Move down"
              >
                ↓
              </button>
              <button type="button" className="arep__remove" onClick={() => remove(index)}>
                Remove
              </button>
            </div>
          </div>
          <div className="arep__fields">{renderItem(item, (next) => update(index, next), index)}</div>
        </div>
      ))}

      {(!max || items.length < max) && (
        <button type="button" className="abtn abtn--ghost" onClick={() => onChange([...items, newItem()])}>
          + {addLabel}
        </button>
      )}
    </div>
  )
}

/** Comma/newline separated list of short strings (tags, bullet points). */
export function StringList({ label, hint, values = [], onChange }) {
  const id = useId()
  return (
    <Field label={label} hint={hint ?? 'One per line.'} id={id}>
      <textarea
        id={id}
        className="af__input af__input--area"
        rows={Math.max(3, values.length + 1)}
        value={values.join('\n')}
        onChange={(e) =>
          onChange(
            e.target.value
              .split('\n')
              .map((v) => v.trim())
              .filter(Boolean)
          )
        }
      />
    </Field>
  )
}
