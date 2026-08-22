/** Sticky footer bar: save state, Save and Preview. */
export default function SaveBar({ dirty, saving, status, onSave, previewHref = '/' }) {
  return (
    <div className="asavebar">
      <div className="asavebar__state">
        {status ? (
          <span className={`astatus astatus--${status.type}`}>{status.message}</span>
        ) : dirty ? (
          <span className="astatus astatus--dirty">Unsaved changes</span>
        ) : (
          <span className="astatus">All changes saved</span>
        )}
      </div>

      <div className="asavebar__actions">
        <a
          className="abtn abtn--ghost"
          href={`${previewHref}?preview=${Date.now()}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          Preview
        </a>
        <button type="button" className="abtn" onClick={onSave} disabled={saving || !dirty}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}
