/**
 * Desktop / Mobile toggle for the preview pane.
 *
 * Decap renders the preview inside an iframe, and the site's own media queries
 * respond to that iframe's width — so narrowing the iframe gives a true mobile
 * rendering rather than a scaled-down picture of the desktop one.
 *
 * Applied as a CSS class on <body> so it survives Decap re-rendering the pane.
 */
;(function () {
  var STYLE = [
    '#pv-viewport{position:fixed;right:18px;bottom:18px;z-index:9999;display:flex;gap:2px;padding:3px;',
    'border:1px solid rgba(148,163,184,.25);border-radius:999px;background:rgba(6,13,23,.94);',
    'box-shadow:0 8px 24px -10px rgba(0,0,0,.7);font-family:system-ui,sans-serif}',
    '#pv-viewport button{border:0;border-radius:999px;padding:.4rem .85rem;background:transparent;color:#94a3b8;',
    'font-size:.72rem;font-weight:600;cursor:pointer;transition:background .15s,color .15s}',
    '#pv-viewport button:hover{color:#e8eef6}',
    '#pv-viewport button.is-active{background:#2563eb;color:#fff}',
    'body.pv-mobile [class*="PreviewPaneFrame"],body.pv-mobile .frame,',
    'body.pv-mobile iframe{width:390px !important;margin-left:auto !important;margin-right:auto !important;',
    'display:block !important;border:1px solid rgba(148,163,184,.2) !important;border-radius:14px !important}'
  ].join('')

  function mount() {
    if (document.getElementById('pv-viewport')) return
    if (!document.body) return

    var style = document.createElement('style')
    style.textContent = STYLE
    document.head.appendChild(style)

    var bar = document.createElement('div')
    bar.id = 'pv-viewport'

    function button(label, mobile) {
      var b = document.createElement('button')
      b.type = 'button'
      b.textContent = label
      b.onclick = function () {
        document.body.classList.toggle('pv-mobile', mobile)
        bar.querySelectorAll('button').forEach(function (other) {
          other.classList.toggle('is-active', other === b)
        })
        // Nudge the iframe so its media queries re-evaluate immediately.
        window.dispatchEvent(new Event('resize'))
      }
      return b
    }

    var desktop = button('Desktop', false)
    var mobileBtn = button('Mobile', true)
    desktop.classList.add('is-active')
    bar.appendChild(desktop)
    bar.appendChild(mobileBtn)
    document.body.appendChild(bar)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount)
  } else {
    mount()
  }
  // The CMS mounts asynchronously; make sure the control survives first paint.
  setTimeout(mount, 1500)
})()
