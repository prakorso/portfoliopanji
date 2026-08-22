import { useState } from 'react'
import MediaPicker from './MediaPicker.jsx'
import { mediaPublicUrl } from '../../lib/supabase.js'

/** Image chooser: pick from the media library, or point at any URL/path. */
export default function ImageField({ label, hint, value, onChange }) {
  const [picking, setPicking] = useState(false)
  const preview = mediaPublicUrl(value)

  return (
    <div className="af aimage">
      {label && <span className="af__label">{label}</span>}

      <div className="aimage__body">
        <div className="aimage__preview">
          {preview ? (
            <img src={preview} alt="" />
          ) : (
            <span className="aimage__placeholder">No image</span>
          )}
        </div>

        <div className="aimage__controls">
          <div className="aimage__buttons">
            <button type="button" className="abtn" onClick={() => setPicking(true)}>
              {value ? 'Replace image' : 'Choose image'}
            </button>
            {value && (
              <button type="button" className="abtn abtn--ghost" onClick={() => onChange('')}>
                Clear
              </button>
            )}
          </div>
          <input
            className="af__input"
            value={value ?? ''}
            placeholder="uploads/photo.jpg or /assets/portrait.svg"
            onChange={(e) => onChange(e.target.value)}
          />
          {hint && <p className="af__hint">{hint}</p>}
        </div>
      </div>

      {picking && <MediaPicker onSelect={onChange} onClose={() => setPicking(false)} />}
    </div>
  )
}
