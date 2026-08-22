import { useRef, useState } from 'react'
import { useMedia, formatBytes } from '../useMedia.js'

export default function MediaLibrary() {
  const { files, loading, busy, error, upload, remove } = useMedia()
  const [message, setMessage] = useState(null)
  const [copied, setCopied] = useState(null)
  const inputRef = useRef(null)
  const replaceRef = useRef(null)
  const [replacing, setReplacing] = useState(null)

  const handleUpload = async (event, replacePath) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      await upload(file, { replacePath })
      setMessage({ type: 'success', message: replacePath ? 'Image replaced.' : 'Image uploaded.' })
    } catch (err) {
      setMessage({ type: 'error', message: err.message })
    } finally {
      event.target.value = ''
      setReplacing(null)
    }
  }

  const handleDelete = async (path) => {
    if (!window.confirm('Delete this image permanently? Any section still using it will break.')) return
    try {
      await remove(path)
      setMessage({ type: 'success', message: 'Image deleted.' })
    } catch (err) {
      setMessage({ type: 'error', message: err.message })
    }
  }

  const copyPath = async (path) => {
    try {
      await navigator.clipboard.writeText(path)
      setCopied(path)
      setTimeout(() => setCopied(null), 1600)
    } catch {
      setMessage({ type: 'error', message: 'Could not copy to clipboard.' })
    }
  }

  return (
    <div className="apage">
      <header className="apage__head">
        <h1 className="apage__title">Media</h1>
        <p className="apage__desc">Images and files used across the site. Stored in Supabase Storage.</p>
      </header>

      <div className="apage__body">
        <div className="amedia__toolbar">
          <button type="button" className="abtn" onClick={() => inputRef.current?.click()} disabled={busy}>
            {busy ? 'Working…' : 'Upload image'}
          </button>
          <input ref={inputRef} type="file" accept="image/*,.pdf" hidden onChange={(e) => handleUpload(e)} />
          <input
            ref={replaceRef}
            type="file"
            accept="image/*,.pdf"
            hidden
            onChange={(e) => handleUpload(e, replacing)}
          />
          <span className="af__hint">PNG, JPG, SVG, WebP or PDF · up to 8 MB</span>
        </div>

        {(message || error) && (
          <p className={`astatus astatus--${message?.type ?? 'error'}`}>
            {message?.message ?? error}
          </p>
        )}

        <div className="amedia">
          {loading && <p className="amedia__empty">Loading…</p>}
          {!loading && files.length === 0 && (
            <p className="amedia__empty">No files yet. Upload one to get started.</p>
          )}

          {files.map((file) => (
            <figure className="amedia__item" key={file.path}>
              <div className="amedia__thumb amedia__thumb--static">
                <img src={file.url} alt={file.name} loading="lazy" />
              </div>
              <figcaption>
                <span className="amedia__name" title={file.name}>
                  {file.name}
                </span>
                <span className="amedia__meta">{formatBytes(file.size)}</span>
              </figcaption>
              <div className="amedia__actions">
                <button type="button" onClick={() => copyPath(file.path)}>
                  {copied === file.path ? 'Copied' : 'Copy path'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReplacing(file.path)
                    replaceRef.current?.click()
                  }}
                >
                  Replace
                </button>
                <button type="button" className="amedia__delete" onClick={() => handleDelete(file.path)}>
                  Delete
                </button>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}
