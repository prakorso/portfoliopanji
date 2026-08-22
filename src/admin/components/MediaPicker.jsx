import { useRef, useState } from 'react'
import { useMedia, formatBytes } from '../useMedia.js'

/** Modal image browser — upload a new file or pick an existing one. */
export default function MediaPicker({ onSelect, onClose }) {
  const { files, loading, busy, error, upload, remove } = useMedia()
  const [message, setMessage] = useState(null)
  const inputRef = useRef(null)

  const handleUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const result = await upload(file)
      setMessage(null)
      onSelect(result.path)
      onClose()
    } catch (err) {
      setMessage(err.message)
    } finally {
      event.target.value = ''
    }
  }

  const handleDelete = async (path) => {
    if (!window.confirm('Delete this image permanently? Any section still using it will break.')) return
    try {
      await remove(path)
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div className="amodal" role="dialog" aria-modal="true" aria-label="Media library">
      <div className="amodal__backdrop" onClick={onClose} />
      <div className="amodal__panel">
        <header className="amodal__head">
          <h2>Media library</h2>
          <button type="button" className="abtn abtn--ghost" onClick={onClose}>
            Close
          </button>
        </header>

        <div className="amodal__toolbar">
          <button
            type="button"
            className="abtn"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            {busy ? 'Uploading…' : 'Upload image'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleUpload}
          />
          <span className="amodal__hint">PNG, JPG, SVG or WebP · up to 8 MB</span>
        </div>

        {(message || error) && <p className="astatus astatus--error">{message ?? error}</p>}

        <div className="amedia">
          {loading && <p className="amedia__empty">Loading…</p>}
          {!loading && files.length === 0 && (
            <p className="amedia__empty">No images yet. Upload one to get started.</p>
          )}
          {files.map((file) => (
            <figure className="amedia__item" key={file.path}>
              <button type="button" className="amedia__thumb" onClick={() => { onSelect(file.path); onClose() }}>
                <img src={file.url} alt={file.name} loading="lazy" />
              </button>
              <figcaption>
                <span className="amedia__name" title={file.name}>
                  {file.name}
                </span>
                <span className="amedia__meta">{formatBytes(file.size)}</span>
              </figcaption>
              <button type="button" className="amedia__delete" onClick={() => handleDelete(file.path)}>
                Delete
              </button>
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}
