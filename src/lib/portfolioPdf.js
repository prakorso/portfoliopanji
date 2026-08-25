/**
 * Builds the downloadable portfolio PDF.
 *
 * The document is drawn from the same content modules the site renders from, so
 * it is never a separate copy of the portfolio: edit a YAML file in the CMS,
 * Netlify rebuilds, and the next download carries the new text automatically.
 * Nothing here is uploaded or maintained by hand.
 *
 * It draws real text rather than screenshotting the page, which is what keeps
 * the result selectable, searchable, small, and able to carry working links —
 * and what lets page breaks fall between blocks instead of through them.
 *
 * jsPDF is imported lazily by the caller so none of this is in the initial
 * bundle; a visitor who never clicks Download never pays for it.
 */

import {
  site,
  hero,
  stats,
  impact,
  aboutSection,
  disciplines,
  experienceSection,
  milestones,
  featuredProjects,
  projectsSection,
  framework,
  frameworkSteps,
  tools,
  contactSection
} from '../content/index.js'
import { whatsAppUrl } from './whatsapp.js'

export const PDF_FILENAME = 'Muhammad-Panji-Prakorsowibowo-Portfolio.pdf'

/* A4 portrait, in points — the unit jsPDF measures text in. */
const PAGE = { w: 595.28, h: 841.89 }
const MARGIN = { x: 46, top: 54, bottom: 58 }
const CONTENT_W = PAGE.w - MARGIN.x * 2

/** The site's own tokens, so the PDF carries the same navy/blue identity. */
const C = {
  bg: '#040c16',
  surface: '#0b1a2e',
  raised: '#102341',
  line: '#16304f',
  accent: '#2563eb',
  bright: '#3b82f6',
  soft: '#60a5fa',
  text: '#f8fafc',
  muted: '#94a3b8',
  dim: '#64748b'
}

/**
 * jsPDF's built-in Helvetica is encoded WinAnsi, so anything outside that set —
 * arrows, emoji, non-Latin scripts — comes out as garbage glyphs rather than
 * failing loudly. Characters with a sensible ASCII stand-in are mapped and the
 * rest dropped, so text typed in the CMS can never corrupt the page.
 */
const SUBSTITUTES = {
  '\u2192': '->', '\u2190': '<-', '\u2191': '^', '\u2193': 'v',
  '\u21d2': '=>', '\u2194': '<->', '\u2212': '-', '\u00a0': ' ',
  '\u2044': '/', '\u2032': "'", '\u2033': '"'
}
const WINANSI =
  /[^\u0020-\u007e\u00a1-\u00ff\u20ac\u201a\u0192\u201e\u2026\u2020\u2021\u02c6\u2030\u0160\u2039\u0152\u017d\u2018\u2019\u201c\u201d\u2022\u2013\u2014\u02dc\u2122\u0161\u203a\u0153\u017e\u0178]/g

const clean = (v) =>
  v == null ? '' : String(v).replace(WINANSI, (ch) => SUBSTITUTES[ch] ?? '').trim()

const asList = (v) => (Array.isArray(v) ? v.filter(Boolean) : [])

/**
 * Loads an image as something jsPDF can embed.
 *
 * Everything goes through a canvas so a 1.4 MB source photo is not carried into
 * the document at full resolution — it is resampled to roughly twice the size it
 * is printed at, which stays sharp on paper while keeping the file small. SVG is
 * rasterised the same way, since jsPDF cannot place vector SVG. Anything that
 * fails to load resolves to null, so a missing file never breaks the download.
 *
 * `flattenOn` draws the image over a solid colour and emits JPEG: the right
 * choice for a cut-out photo that sits on a known panel, and far smaller than
 * keeping the alpha channel.
 */
async function loadImage(src, targetPx = 640, flattenOn = '') {
  if (!clean(src)) return null
  try {
    const res = await fetch(src)
    if (!res.ok) return null
    const blob = await res.blob()
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })

    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = dataUrl
    })

    // An SVG may report no intrinsic size; fall back to a sensible box.
    const w = img.naturalWidth || 600
    const h = img.naturalHeight || 600

    const scale = Math.min(1.5, targetPx / Math.max(w, h))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(w * scale))
    canvas.height = Math.max(1, Math.round(h * scale))
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingQuality = 'high'
    if (flattenOn) {
      ctx.fillStyle = flattenOn
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    return flattenOn
      ? { data: canvas.toDataURL('image/jpeg', 0.86), w, h, format: 'JPEG' }
      : { data: canvas.toDataURL('image/png'), w, h, format: 'PNG' }
  } catch {
    return null
  }
}

/**
 * A cursor over a stack of pages.
 *
 * Everything that draws first asks whether it fits. Paragraphs break line by
 * line so a long one flows across pages; cards measure themselves whole and
 * move down rather than being cut in half.
 */
class Sheet {
  constructor(JsPDF) {
    this.doc = new JsPDF({ unit: 'pt', format: 'a4', compress: true })
    this.doc.setFont('helvetica', 'normal')
    this.y = MARGIN.top
    this.paintBackground()
  }

  paintBackground() {
    this.doc.setFillColor(C.bg)
    this.doc.rect(0, 0, PAGE.w, PAGE.h, 'F')
  }

  get bottom() {
    return PAGE.h - MARGIN.bottom
  }

  newPage() {
    this.doc.addPage()
    this.paintBackground()
    this.y = MARGIN.top
  }

  /** Move to a fresh page unless `h` still fits on this one. */
  need(h) {
    if (this.y + h > this.bottom) this.newPage()
  }

  gap(h) {
    this.y += h
  }

  lines(str, { size = 10, style = 'normal', width = CONTENT_W }) {
    this.doc.setFont('helvetica', style)
    this.doc.setFontSize(size)
    return this.doc.splitTextToSize(clean(str), width)
  }

  /** Height a paragraph would take, without drawing it. */
  measure(str, opts = {}) {
    if (!clean(str)) return 0
    const { size = 10, leading = 1.45, after = 0 } = opts
    return this.lines(str, opts).length * size * leading + after
  }

  /** Draws a paragraph, breaking across pages line by line so nothing clips. */
  paragraph(str, opts = {}) {
    if (!clean(str)) return
    const {
      size = 10,
      style = 'normal',
      color = C.text,
      x = MARGIN.x,
      width = CONTENT_W,
      leading = 1.45,
      after = 0,
      align
    } = opts
    const rows = this.lines(str, { size, style, width })
    const step = size * leading
    this.doc.setTextColor(color)
    for (const row of rows) {
      this.need(step)
      this.doc.setFont('helvetica', style)
      this.doc.setFontSize(size)
      this.doc.text(row, align === 'right' ? x + width : x, this.y + size * 0.82, { align })
      this.y += step
    }
    this.y += after
  }

  /** A line of text that is also a clickable annotation. */
  link(label, url, opts = {}) {
    const { size = 10, color = C.soft, x = MARGIN.x, style = 'normal', after = 0 } = opts
    const step = size * 1.45
    this.need(step)
    this.doc.setFont('helvetica', style)
    this.doc.setFontSize(size)
    this.doc.setTextColor(color)
    const text = clean(label)
    this.doc.text(text, x, this.y + size * 0.82)
    const w = this.doc.getTextWidth(text)
    if (url) this.doc.link(x, this.y, w, size * 1.1, { url })
    this.y += step + after
  }

  rule(color = C.line, width = CONTENT_W, x = MARGIN.x) {
    this.need(8)
    this.doc.setDrawColor(color)
    this.doc.setLineWidth(0.6)
    this.doc.line(x, this.y, x + width, this.y)
    this.y += 1
  }

  panel(x, y, w, h, { fill = C.surface, border = C.line, radius = 8 } = {}) {
    this.doc.setFillColor(fill)
    this.doc.setDrawColor(border)
    this.doc.setLineWidth(0.6)
    this.doc.roundedRect(x, y, w, h, radius, radius, 'FD')
  }

  /**
   * Section heading. It reserves room for the first slice of the section too,
   * so a heading is never stranded alone at the foot of a page.
   */
  heading(eyebrow, title, accent, lead) {
    const titleH = this.measure(`${clean(title)} ${clean(accent)}`, { size: 19, style: 'bold' })
    const leadH = this.measure(lead, { size: 10, leading: 1.5 })
    this.need(14 + titleH + leadH + 56)

    if (clean(eyebrow)) {
      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(8)
      this.doc.setTextColor(C.bright)
      this.doc.text(clean(eyebrow).toUpperCase(), MARGIN.x, this.y + 7)
      this.y += 16
    }

    // Title, with the accent half in blue exactly as the site shows it.
    const head = [clean(title), clean(accent)].filter(Boolean).join(' ')
    const rows = this.lines(head, { size: 19, style: 'bold' })
    const plainLen = clean(title).length
    let consumed = 0
    for (const row of rows) {
      this.need(19 * 1.3)
      this.doc.setFont('helvetica', 'bold')
      this.doc.setFontSize(19)
      // Split this row at the point where the accent text begins.
      const startsAt = consumed
      const accentFrom = Math.max(0, plainLen - startsAt)
      const whiteText = row.slice(0, accentFrom)
      const blueText = row.slice(accentFrom)
      this.doc.setTextColor(C.text)
      this.doc.text(whiteText, MARGIN.x, this.y + 15)
      if (blueText) {
        this.doc.setTextColor(C.soft)
        this.doc.text(blueText, MARGIN.x + this.doc.getTextWidth(whiteText), this.y + 15)
      }
      consumed += row.length + 1
      this.y += 19 * 1.3
    }

    this.y += 6
    this.doc.setDrawColor(C.accent)
    this.doc.setLineWidth(2)
    this.doc.line(MARGIN.x, this.y, MARGIN.x + 42, this.y)
    this.y += 12

    if (clean(lead)) this.paragraph(lead, { size: 10, color: C.muted, leading: 1.5, after: 6 })
  }

  /** Height a wrapped chip set needs, so a group can be kept together. */
  chipsHeight(items, { size = 8, width = CONTENT_W } = {}) {
    const list = asList(items).map(clean).filter(Boolean)
    if (!list.length) return 0
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(size)
    let rows = 1
    let cx = 0
    for (const item of list) {
      const w = this.doc.getTextWidth(item) + 14
      if (cx + w > width) {
        rows += 1
        cx = 0
      }
      cx += w + 5
    }
    return rows * 20 + 8
  }

  /** Small pill row — tags, tools. Wraps, and breaks between rows. */
  chips(items, { size = 8, x = MARGIN.x, width = CONTENT_W } = {}) {
    const list = asList(items).map(clean).filter(Boolean)
    if (!list.length) return
    const padX = 7
    const rowH = 16
    let cx = x
    this.need(rowH + 4)
    for (const item of list) {
      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(size)
      const w = this.doc.getTextWidth(item) + padX * 2
      if (cx + w > x + width) {
        cx = x
        this.y += rowH + 4
        this.need(rowH + 4)
      }
      this.doc.setFillColor(C.raised)
      this.doc.setDrawColor(C.line)
      this.doc.setLineWidth(0.5)
      this.doc.roundedRect(cx, this.y, w, rowH, 5, 5, 'FD')
      this.doc.setTextColor(C.muted)
      this.doc.text(item, cx + padX, this.y + rowH / 2 + size * 0.36)
      cx += w + 5
    }
    this.y += rowH + 8
  }

  /** Bulleted list, one point per line, wrapping and breaking safely. */
  bullets(points, { size = 9, x = MARGIN.x, width = CONTENT_W, color = C.muted } = {}) {
    for (const point of asList(points).map(clean).filter(Boolean)) {
      const rows = this.lines(point, { size, width: width - 12 })
      const step = size * 1.45
      rows.forEach((row, i) => {
        this.need(step)
        if (i === 0) {
          this.doc.setFillColor(C.accent)
          this.doc.circle(x + 2.5, this.y + size * 0.45, 1.6, 'F')
        }
        this.doc.setFont('helvetica', 'normal')
        this.doc.setFontSize(size)
        this.doc.setTextColor(color)
        this.doc.text(row, x + 12, this.y + size * 0.82)
        this.y += step
      })
    }
  }

  /** Page furniture, added once the total page count is known. */
  finish() {
    const total = this.doc.getNumberOfPages()
    for (let page = 1; page <= total; page += 1) {
      this.doc.setPage(page)
      const y = PAGE.h - 30
      this.doc.setDrawColor(C.line)
      this.doc.setLineWidth(0.6)
      this.doc.line(MARGIN.x, y - 12, PAGE.w - MARGIN.x, y - 12)
      this.doc.setFont('helvetica', 'normal')
      this.doc.setFontSize(7.5)
      this.doc.setTextColor(C.dim)
      this.doc.text(clean(site.name), MARGIN.x, y)
      this.doc.text(`${page} / ${total}`, PAGE.w - MARGIN.x, y, { align: 'right' })
    }
    return this.doc
  }
}

/* ------------------------------------------------------------------ sections */

/**
 * The document is composed as a sequence of chapters rather than a transcript
 * of the website's sections. A chapter starts on a fresh page — that is what
 * keeps headings with their content and stops a case study bleeding into the
 * next — while everything inside a chapter flows, so the page fills naturally
 * instead of ending wherever the corresponding web section happened to stop.
 */

/** Reserves a whole block, capped so an over-long one still starts on a page. */
const keepTogether = (sheet, height) =>
  sheet.need(Math.min(height, PAGE.h - MARGIN.top - MARGIN.bottom))

/** The small uppercase label that opens every block, in the site's blue. */
function eyebrow(sheet, text, x = MARGIN.x) {
  if (!clean(text)) return
  sheet.doc.setFont('helvetica', 'bold')
  sheet.doc.setFontSize(7.5)
  sheet.doc.setTextColor(C.bright)
  sheet.doc.text(clean(text).toUpperCase(), x, sheet.y + 6)
  sheet.y += 15
}

/** A row of value/label tiles that always fills its width. */
function metricRow(sheet, items, { x = MARGIN.x, width = CONTENT_W, height = 42, perRow = 5 } = {}) {
  const list = asList(items)
  if (!list.length) return
  const gap = 8
  const columns = Math.min(list.length, perRow)
  const rowCount = Math.ceil(list.length / columns)
  keepTogether(sheet, rowCount * (height + gap))
  const top = sheet.y

  // Tiles on the final row widen to take up the slack, so a set that does not
  // divide evenly still finishes flush instead of trailing off into a gap —
  // the same rule the site's own metric grid follows.
  for (let r = 0; r < rowCount; r += 1) {
    const row = list.slice(r * columns, (r + 1) * columns)
    const w = (width - gap * (row.length - 1)) / row.length
    const my = top + r * (height + gap)
    row.forEach((item, i) => {
      const mx = x + i * (w + gap)
      sheet.panel(mx, my, w, height, { fill: C.raised, radius: 6 })
      sheet.doc.setFont('helvetica', 'bold')
      sheet.doc.setFontSize(12)
      sheet.doc.setTextColor(C.soft)
      sheet.doc.text(clean(item.value), mx + w / 2, my + height * 0.46, { align: 'center' })
      sheet.doc.setFont('helvetica', 'normal')
      sheet.doc.setFontSize(6)
      sheet.doc.setTextColor(C.muted)
      const label = sheet.doc.splitTextToSize(clean(item.label), w - 10)
      sheet.doc.text(label.slice(0, 2), mx + w / 2, my + height * 0.46 + 10, { align: 'center' })
    })
  }
  sheet.y = top + rowCount * (height + gap)
}

/* ---------------------------------------------------------------- cover page */

function coverPage(sheet, portrait) {
  const doc = sheet.doc

  doc.setFillColor(C.surface)
  doc.rect(0, 0, PAGE.w, 250, 'F')
  doc.setDrawColor(C.accent)
  doc.setLineWidth(3)
  doc.line(0, 250, PAGE.w, 250)

  // Leave the portrait's box plus a gutter clear.
  const textW = portrait ? CONTENT_W - 164 : CONTENT_W

  sheet.y = 52
  if (clean(hero.eyebrow)) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(C.bright)
    doc.text(clean(hero.eyebrow).toUpperCase(), MARGIN.x, sheet.y)
    sheet.y += 18
  }

  // The name is whatever the CMS holds, so it has to fit whatever that is:
  // shrink until it clears the portrait, and only then wrap.
  const name = clean(site.name)
  doc.setFont('helvetica', 'bold')
  let nameSize = 28
  while (nameSize > 15) {
    doc.setFontSize(nameSize)
    if (doc.getTextWidth(name) <= textW) break
    nameSize -= 1
  }
  doc.setFontSize(nameSize)
  doc.setTextColor(C.text)
  for (const row of doc.splitTextToSize(name, textW)) {
    doc.text(row, MARGIN.x, sheet.y + nameSize * 0.75)
    sheet.y += nameSize * 1.15
  }
  sheet.y += 8

  // The hero headline, keeping the accent lines blue as on the site.
  const headingLines = asList(hero.headingLines)
  if (headingLines.length) {
    for (const line of headingLines) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.setTextColor(line.accent ? C.soft : C.text)
      for (const row of doc.splitTextToSize(clean(line.text), textW)) {
        doc.text(row, MARGIN.x, sheet.y + 11)
        sheet.y += 17
      }
    }
  } else if (clean(site.tagline)) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(C.soft)
    for (const row of doc.splitTextToSize(clean(site.tagline), textW)) {
      doc.text(row, MARGIN.x, sheet.y + 11)
      sheet.y += 18
    }
  }

  if (portrait) {
    const boxW = 138
    const boxH = 176
    const ratio = Math.min(boxW / portrait.w, boxH / portrait.h)
    const w = portrait.w * ratio
    const h = portrait.h * ratio
    const x = PAGE.w - MARGIN.x - boxW + (boxW - w) / 2
    doc.setFillColor(C.raised)
    doc.setDrawColor(C.line)
    doc.roundedRect(PAGE.w - MARGIN.x - boxW, 46, boxW, boxH, 10, 10, 'FD')
    doc.addImage(portrait.data, portrait.format, x, 46 + (boxH - h) / 2, w, h, undefined, 'FAST')
  }

  sheet.y = Math.max(sheet.y + 10, 168)
  sheet.paragraph(hero.description, { size: 9.5, color: C.muted, width: textW, leading: 1.5 })

  /* --- profile stats, just under the band --------------------------------
     The blocks below are laid out against the space actually available, so
     whatever is left over is shared out between them rather than collecting
     into one hole above the contact strip. */
  const contact = contactRows()
  const stripH = contact.length ? 66 : 0
  const zoneTop = 262
  const zoneBottom = PAGE.h - MARGIN.bottom - stripH - 10

  const statItems = asList(stats)
  const impactItems = asList(impact.items)
  const impactRows = impactItems.length ? Math.ceil(impactItems.length / 5) : 0
  const noteH = sheet.measure(impact.note, { size: 7, leading: 1.45 })
  const baseH =
    (statItems.length ? 56 : 0) +
    (impactItems.length ? 41 + impactRows * 46 + noteH : 0)

  // Spend the leftover space rather than letting it collect above the contact
  // strip: the tiles grow into it first, then it becomes air between the bands.
  const slack = Math.max(0, zoneBottom - zoneTop - baseH)
  const statH = Math.min(94, 56 + slack * 0.3)
  const metricH = Math.min(64, 46 + slack * 0.12)
  const impactH = impactItems.length ? 41 + impactRows * (metricH + 8) + noteH : 0
  const breathe = Math.min(46, Math.max(0, zoneBottom - zoneTop - statH - impactH) / 2)

  sheet.y = zoneTop + breathe
  if (statItems.length) {
    const gap = 10
    const w = (CONTENT_W - gap * (statItems.length - 1)) / statItems.length
    const h = statH
    statItems.forEach((stat, i) => {
      const x = MARGIN.x + i * (w + gap)
      sheet.panel(x, sheet.y, w, h)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(20)
      doc.setTextColor(C.soft)
      doc.text(clean(stat.value), x + w / 2, sheet.y + h * 0.5, { align: 'center' })
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(C.muted)
      const label = doc.splitTextToSize(clean(stat.label), w - 16)
      doc.text(label.slice(0, 2), x + w / 2, sheet.y + h * 0.5 + 15, { align: 'center' })
    })
    sheet.y += h + breathe
  }

  /* --- selected historical impact ---------------------------------------- */
  if (impactItems.length) {
    // Anchored to the foot of the zone: whatever air is left shows up between
    // the two bands, where it reads as spacing, not as an unfinished page.
    sheet.y = Math.max(sheet.y, zoneBottom - impactH)
    eyebrow(sheet, [clean(impact.label), clean(impact.attribution)].filter(Boolean).join(' — '))
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(15)
    doc.setTextColor(C.text)
    doc.text(clean(impact.title), MARGIN.x, sheet.y + 11)
    sheet.y += 26
    metricRow(sheet, impactItems, { height: metricH })
    sheet.y += 4
    sheet.paragraph(impact.note, { size: 7, color: C.dim, leading: 1.45 })
  }

  /* --- contact strip, anchored to the foot of the cover ------------------- */
  const rows = contact
  if (rows.length) {
    // Only anchor it if the content above has not already reached that far.
    sheet.y = Math.max(sheet.y + 16, zoneBottom + 10)
    sheet.doc.setDrawColor(C.line)
    sheet.doc.setLineWidth(0.6)
    sheet.doc.line(MARGIN.x, sheet.y, PAGE.w - MARGIN.x, sheet.y)
    sheet.y += 12

    const gap = 10
    const w = (CONTENT_W - gap * (rows.length - 1)) / rows.length
    const top2 = sheet.y
    rows.forEach((row, i) => {
      const x = MARGIN.x + i * (w + gap)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(6)
      doc.setTextColor(C.dim)
      doc.text(row.label.toUpperCase(), x, top2 + 6)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(row.url ? C.soft : C.text)
      // Shrink rather than truncate: a clipped email or profile name is useless.
      let size = 8
      while (size > 5.5) {
        doc.setFontSize(size)
        if (doc.getTextWidth(row.value) <= w) break
        size -= 0.25
      }
      doc.setFontSize(size)
      doc.text(row.value, x, top2 + 18)
      if (row.url) doc.link(x, top2 + 10, doc.getTextWidth(row.value), 10, { url: row.url })
    })
    sheet.y = top2 + 26
  }
}

/** Contact details in a fixed order, skipping anything the CMS leaves empty. */
function contactRows() {
  const rows = []
  const email = clean(contactSection.email)
  if (email) rows.push({ label: 'Email', value: email, url: `mailto:${email}` })

  // Same normalisation the site's contact row and CTA use — the number is shown
  // exactly as written, and only the link is converted.
  const phone = clean(contactSection.phone)
  if (phone) rows.push({ label: 'WhatsApp', value: phone, url: whatsAppUrl(phone) })

  const linkedin = clean(contactSection.linkedinUrl)
  if (linkedin) {
    rows.push({ label: 'LinkedIn', value: clean(contactSection.linkedinLabel) || linkedin, url: linkedin })
  }
  const location = clean(contactSection.location)
  if (location) rows.push({ label: 'Location', value: location, url: '' })
  return rows
}

/* --------------------------------------------------------------- about page */

function aboutSectionPage(sheet) {
  sheet.newPage()
  sheet.heading(
    aboutSection.label,
    aboutSection.heading,
    aboutSection.headingAccent,
    aboutSection.description
  )
  sheet.paragraph(aboutSection.note, { size: 9, color: C.dim, leading: 1.5, after: 16 })

  const cards = asList(disciplines)
  const gap = 12
  const w = (CONTENT_W - gap) / 2
  for (let i = 0; i < cards.length; i += 2) {
    const row = cards.slice(i, i + 2)
    // Both cards in a row share the taller height so the grid stays even.
    const heights = row.map((card) => {
      const desc = sheet.measure(card.description, { size: 8.5, width: w - 24, leading: 1.45 })
      const points = asList(card.points).length * 8.5 * 1.6
      return 52 + desc + points + 14
    })
    const h = Math.max(...heights)
    keepTogether(sheet, h + gap)
    const top = sheet.y
    row.forEach((card, j) => {
      const x = MARGIN.x + j * (w + gap)
      sheet.panel(x, top, w, h, { fill: C.surface })
      sheet.doc.setFont('helvetica', 'bold')
      sheet.doc.setFontSize(8)
      sheet.doc.setTextColor(C.bright)
      sheet.doc.text(clean(card.number), x + 14, top + 20)
      sheet.doc.setFontSize(13)
      sheet.doc.setTextColor(C.text)
      sheet.doc.text(clean(card.title), x + 14, top + 38)

      let cy = top + 50
      const desc = clean(card.description)
      if (desc) {
        sheet.doc.setFont('helvetica', 'normal')
        sheet.doc.setFontSize(8.5)
        sheet.doc.setTextColor(C.muted)
        const rows = sheet.doc.splitTextToSize(desc, w - 28)
        sheet.doc.text(rows, x + 14, cy)
        cy += rows.length * 8.5 * 1.45
      }
      for (const point of asList(card.points).map(clean).filter(Boolean)) {
        sheet.doc.setFillColor(C.accent)
        sheet.doc.circle(x + 16, cy - 2.5, 1.5, 'F')
        sheet.doc.setFont('helvetica', 'normal')
        sheet.doc.setFontSize(8.5)
        sheet.doc.setTextColor(C.muted)
        sheet.doc.text(sheet.doc.splitTextToSize(point, w - 36)[0], x + 24, cy)
        cy += 8.5 * 1.6
      }
    })
    sheet.y = top + h + gap
  }
}

/* ------------------------------------------------------------ career page */

function experiencePages(sheet) {
  sheet.newPage()
  sheet.heading(experienceSection.label, experienceSection.title, '', experienceSection.lead)

  const list = asList(milestones)
  for (const m of list) {
    // Mirrors CareerTimeline: a promotion stays part of one milestone.
    const dates = [clean(m.startDate), clean(m.endDate)].filter(Boolean).join(' – ')
    const promotion = clean(m.promotionNote)
      ? [clean(m.promotionNote), clean(m.promotionDate)].filter(Boolean).join(' · ')
      : clean(m.promotionDate)
        ? `Promoted ${clean(m.promotionDate)}`
        : ''
    const achievements = asList(m.achievements).map(clean).filter(Boolean)

    // The year sits in its own column, which keeps each entry compact.
    const railW = 52
    const innerW = CONTENT_W - railW - 24
    const bodyX = MARGIN.x + railW + 14

    const h =
      18 +
      sheet.measure(m.title, { size: 12, style: 'bold', width: innerW }) +
      (clean(m.company) ? 13 : 0) +
      (dates ? 12 : 0) +
      (clean(m.joinedAs) ? 12 : 0) +
      (promotion ? 12 : 0) +
      sheet.measure(m.description, { size: 8.8, width: innerW, leading: 1.5 }) +
      achievements.length * 8.8 * 1.5 +
      18

    keepTogether(sheet, h + 10)
    const top = sheet.y
    sheet.panel(MARGIN.x, top, CONTENT_W, h, { fill: C.surface })
    sheet.doc.setFillColor(C.accent)
    sheet.doc.rect(MARGIN.x, top + 10, 2.5, h - 20, 'F')

    sheet.doc.setFont('helvetica', 'bold')
    sheet.doc.setFontSize(15)
    sheet.doc.setTextColor(C.soft)
    sheet.doc.text(clean(m.year), MARGIN.x + 16, top + 28)

    sheet.y = top + 12
    sheet.paragraph(m.title, { size: 12, style: 'bold', x: bodyX, width: innerW, leading: 1.3 })
    if (clean(m.company)) {
      sheet.paragraph(m.company, { size: 9, color: C.soft, x: bodyX, width: innerW, leading: 1.35 })
    }
    if (dates) sheet.paragraph(dates, { size: 8, color: C.dim, x: bodyX, width: innerW, leading: 1.4 })
    if (clean(m.joinedAs)) {
      sheet.paragraph(`Joined as ${clean(m.joinedAs)}`, { size: 8, color: C.dim, x: bodyX, width: innerW, leading: 1.4 })
    }
    if (promotion) {
      sheet.paragraph(promotion, { size: 8, color: C.bright, style: 'bold', x: bodyX, width: innerW, leading: 1.4 })
    }
    sheet.y += 3
    sheet.paragraph(m.description, { size: 8.8, color: C.muted, x: bodyX, width: innerW, leading: 1.5 })
    if (achievements.length) sheet.bullets(achievements, { size: 8.8, x: bodyX, width: innerW })

    sheet.y = Math.max(sheet.y, top + h) + 10
  }
}

/* ------------------------------------------------------- selected work page */

async function projectPages(sheet, origin) {
  sheet.newPage()
  sheet.heading(projectsSection.label, projectsSection.title, '', projectsSection.lead)

  // The same set the homepage carousel shows: this section is headed "Featured
  // Projects", so a project switched off should not appear here either.
  //
  // These are index cards, not the case studies: the imagery gets its room a few
  // pages later, so here a logo is only a small mark beside the title. That keeps
  // all three on one page, which is what makes this read as a contents page.
  for (const project of asList(featuredProjects)) {
    const mark = await loadImage(project.logo || project.heroImage, 240)
    const markH = mark ? 38 : 0
    const markW = mark ? Math.min(96, (markH * mark.w) / mark.h) : 0

    const tags = asList(project.tags).map(clean).filter(Boolean)
    const metrics = asList(project.cardMetrics)
    const innerW = CONTENT_W - 28 - (markW ? markW + 14 : 0)
    const fullW = CONTENT_W - 28

    const h =
      30 +
      sheet.measure(project.displayTitle || project.title, { size: 14, style: 'bold', width: innerW }) +
      (clean(project.category) ? 13 : 0) +
      sheet.measure(project.shortDescription || project.heroDescription, {
        size: 8.6,
        width: fullW,
        leading: 1.5
      }) +
      (tags.length ? sheet.chipsHeight(tags, { width: fullW }) : 0) +
      (metrics.length ? 46 : 0) +
      20

    keepTogether(sheet, h + 12)
    const top = sheet.y
    sheet.panel(MARGIN.x, top, CONTENT_W, h, { fill: C.surface })

    const x = MARGIN.x + 14
    if (mark) {
      sheet.doc.addImage(
        mark.data, mark.format,
        MARGIN.x + CONTENT_W - 14 - markW, top + 14, markW, markH, undefined, 'FAST'
      )
    }

    sheet.y = top + 12
    sheet.doc.setFont('helvetica', 'bold')
    sheet.doc.setFontSize(8)
    sheet.doc.setTextColor(C.bright)
    sheet.doc.text(clean(project.number), x, sheet.y + 6)
    sheet.y += 13

    sheet.paragraph(project.displayTitle || project.title, {
      size: 14, style: 'bold', x, width: innerW, leading: 1.25
    })
    if (clean(project.category)) {
      sheet.paragraph(project.category, { size: 8.5, color: C.soft, x, width: innerW, leading: 1.4 })
    }
    sheet.y = Math.max(sheet.y, top + 14 + markH) + 4
    sheet.paragraph(project.shortDescription || project.heroDescription, {
      size: 8.6, color: C.muted, x, width: fullW, leading: 1.5
    })

    if (tags.length) {
      sheet.y += 2
      sheet.chips(tags, { x, width: fullW })
    }
    if (metrics.length) metricRow(sheet, metrics, { x, width: fullW, height: 40, perRow: 3 })

    sheet.y = Math.max(sheet.y, top + h) + 12
  }
}

/* ------------------------------------------------------------- case studies */

/**
 * One chapter of a case study: label, title, optional prose, bullets and the
 * little figure columns. Measured as a whole first so a label never ends up
 * alone at the foot of a page.
 */
function caseChapter(sheet, chapter) {
  const label = clean(chapter.label)
  const title = clean(chapter.title)
  const body = clean(chapter.body)
  const bullets = asList(chapter.bullets).map(clean).filter(Boolean)
  const columns = asList(chapter.columns)

  const h =
    (label ? 15 : 0) +
    sheet.measure(title, { size: 11, style: 'bold', leading: 1.28 }) +
    (body ? sheet.measure(body, { size: 8.8, leading: 1.5 }) + 4 : 0) +
    12

  // A label and its heading never break away from the first lines beneath them.
  keepTogether(sheet, h + 28)
  eyebrow(sheet, label)
  if (title) sheet.paragraph(title, { size: 11, style: 'bold', leading: 1.28, after: 3 })
  if (body) sheet.paragraph(body, { size: 8.8, color: C.muted, leading: 1.5, after: 3 })

  if (bullets.length) {
    keepTogether(sheet, Math.min(bullets.length, 3) * 8.8 * 1.5)
    sheet.bullets(bullets, { size: 8.8 })
    sheet.y += 2
  }

  if (columns.length) {
    const gap = 10
    const per = Math.min(columns.length, 3)
    const w = (CONTENT_W - gap * (per - 1)) / per
    for (let i = 0; i < columns.length; i += per) {
      const row = columns.slice(i, i + per)
      const heights = row.map(
        (col) =>
          26 +
          sheet.measure(col.title, { size: 8.5, style: 'bold', width: w - 20, leading: 1.35 }) +
          asList(col.items).length * 9 * 1.5
      )
      const ch = Math.max(...heights)
      keepTogether(sheet, ch + gap)
      const top = sheet.y
      row.forEach((col, j) => {
        const x = MARGIN.x + j * (w + gap)
        sheet.panel(x, top, w, ch, { fill: C.raised, radius: 6 })
        let cy = top + 16
        for (const item of asList(col.items).map(clean).filter(Boolean)) {
          sheet.doc.setFont('helvetica', 'bold')
          sheet.doc.setFontSize(12)
          sheet.doc.setTextColor(C.soft)
          sheet.doc.text(item, x + 12, cy)
          cy += 9 * 1.5 + 3
        }
        sheet.doc.setFont('helvetica', 'bold')
        sheet.doc.setFontSize(8.5)
        sheet.doc.setTextColor(C.muted)
        const rows = sheet.doc.splitTextToSize(clean(col.title), w - 20)
        sheet.doc.text(rows, x + 12, cy)
      })
      sheet.y = top + ch + gap
    }
  }

  sheet.y += 6
}

async function caseStudyPages(sheet, origin) {
  for (const project of asList(featuredProjects)) {
    sheet.newPage()

    /* --- case study masthead --------------------------------------------- */
    const title = clean(project.displayTitle || project.title)
    eyebrow(sheet, `Case study ${clean(project.number)}`)
    sheet.paragraph(title, { size: 22, style: 'bold', leading: 1.2, after: 2 })
    if (clean(project.category)) {
      sheet.paragraph(project.category, { size: 9, color: C.soft, leading: 1.4 })
    }
    sheet.y += 4
    sheet.doc.setDrawColor(C.accent)
    sheet.doc.setLineWidth(2)
    sheet.doc.line(MARGIN.x, sheet.y, MARGIN.x + 42, sheet.y)
    sheet.y += 14

    sheet.paragraph(project.heroDescription || project.shortDescription, {
      size: 9,
      color: C.muted,
      leading: 1.5,
      after: 8
    })

    const cover = await loadImage(project.heroImage || project.logo, 620)
    if (cover) {
      // Deliberately modest: the imagery is a mark of identity here, not the
      // subject. A taller one pushes a chapter onto a third page for no gain.
      const h = Math.min(120, (CONTENT_W * cover.h) / cover.w)
      const w = Math.min(CONTENT_W, (h * cover.w) / cover.h)
      keepTogether(sheet, h + 12)
      sheet.doc.addImage(cover.data, cover.format, MARGIN.x, sheet.y, w, h, undefined, 'FAST')
      sheet.y += h + 12
    }

    /* --- chapters --------------------------------------------------------- */
    for (const chapter of asList(project.chapters)) caseChapter(sheet, chapter)

    /* --- measured impact -------------------------------------------------- */
    const pi = project.impact ?? {}
    const items = asList(pi.items)
    const qualitative = asList(pi.qualitative).map(clean).filter(Boolean)
    if (items.length || qualitative.length) {
      keepTogether(sheet, 90)
      eyebrow(sheet, [clean(pi.label), clean(pi.attribution)].filter(Boolean).join(' — '))
      if (items.length) metricRow(sheet, items, { height: 44, perRow: Math.min(items.length, 4) })
      if (qualitative.length) {
        sheet.y += 2
        sheet.bullets(qualitative, { size: 9 })
      }
      if (clean(pi.note)) {
        sheet.y += 4
        sheet.paragraph(pi.note, { size: 7.5, color: C.dim, leading: 1.5 })
      }
      sheet.y += 8
    }

    /* --- key learning ------------------------------------------------------ */
    const learning = clean(project.learning)
    if (learning) {
      const h = sheet.measure(learning, { size: 9, width: CONTENT_W - 32, leading: 1.5 }) + 38
      keepTogether(sheet, h + 8)
      const top = sheet.y
      sheet.panel(MARGIN.x, top, CONTENT_W, h, { fill: C.raised })
      sheet.doc.setFillColor(C.accent)
      sheet.doc.rect(MARGIN.x, top + 10, 2.5, h - 20, 'F')
      sheet.y = top + 12
      eyebrow(sheet, 'Key learning', MARGIN.x + 16)
      sheet.paragraph(learning, {
        size: 9,
        color: C.text,
        x: MARGIN.x + 16,
        width: CONTENT_W - 32,
        leading: 1.5
      })
      sheet.y = Math.max(sheet.y, top + h) + 10
    }

    if (origin && clean(project.slug)) {
      const path = `/projects/${clean(project.slug)}`
      sheet.link(`Read this case study online: ${path}`, `${origin}${path}`, { size: 8 })
    }
  }
}

/* ----------------------------------------------------------- approach pages */

function approachPages(sheet) {
  sheet.newPage()
  sheet.heading(framework.label, framework.title, framework.titleAccent, framework.lead)

  for (const step of asList(frameworkSteps)) {
    const innerW = CONTENT_W - 70
    const points = asList(step.points).map(clean).filter(Boolean)
    const h =
      30 +
      (clean(step.caption) ? sheet.measure(step.caption, { size: 9, width: innerW, leading: 1.45 }) : 0) +
      (points.length ? sheet.chipsHeight(points, { width: innerW }) : 0) +
      12

    keepTogether(sheet, h + 10)
    const top = sheet.y
    sheet.panel(MARGIN.x, top, CONTENT_W, h, { fill: C.surface })

    sheet.doc.setFont('helvetica', 'bold')
    sheet.doc.setFontSize(18)
    sheet.doc.setTextColor(C.accent)
    sheet.doc.text(clean(step.number), MARGIN.x + 16, top + 28)

    const x = MARGIN.x + 56
    sheet.y = top + 12
    sheet.paragraph(step.title, { size: 12, style: 'bold', x, width: innerW, leading: 1.3 })
    if (clean(step.caption)) {
      sheet.paragraph(step.caption, { size: 9, color: C.muted, x, width: innerW, leading: 1.45 })
    }
    if (points.length) {
      sheet.y += 2
      sheet.chips(points, { x, width: innerW })
    }
    sheet.y = Math.max(sheet.y, top + h) + 10
  }

  const groups = asList(tools.groups)
  if (!groups.length) return
  sheet.y += 10
  sheet.heading(tools.label, tools.title, '', '')

  // Two columns, each a stack of whole groups — not two groups per row.
  // Splitting by row leaves a second row that has to break to a new page the
  // moment it will not fit, which stranded the last groups on a page of their
  // own. As one block it either fits where it is or moves intact.
  const gap = 18
  const colW = (CONTENT_W - gap) / 2
  const half = Math.ceil(groups.length / 2)
  const columns = [groups.slice(0, half), groups.slice(half)]

  const columnHeight = (column) =>
    column.reduce((total, g) => total + 17 + sheet.chipsHeight(asList(g.tools).map(clean), { width: colW }), 0)

  keepTogether(sheet, Math.max(...columns.map(columnHeight)) + 8)

  const top = sheet.y
  let lowest = top
  columns.forEach((column, i) => {
    const x = MARGIN.x + i * (colW + gap)
    sheet.y = top
    for (const group of column) {
      sheet.paragraph(group.group, {
        size: 9.5, style: 'bold', color: C.text, x, width: colW, leading: 1.4, after: 3
      })
      sheet.chips(asList(group.tools).map(clean).filter(Boolean), { x, width: colW })
    }
    lowest = Math.max(lowest, sheet.y)
  })
  sheet.y = lowest + 4
}

/* ---------------------------------------------------------------------- api */

/**
 * Builds the document and returns the jsPDF instance.
 * `origin` is the site's own address, used for the case-study links.
 */
export async function buildPortfolioPdf(JsPDF, origin = '') {
  const sheet = new Sheet(JsPDF)
  const portrait = await loadImage(hero.image, 420, C.raised)

  coverPage(sheet, portrait)
  aboutSectionPage(sheet)
  experiencePages(sheet)
  await projectPages(sheet, origin)
  await caseStudyPages(sheet, origin)
  approachPages(sheet)

  const doc = sheet.finish()
  doc.setProperties({
    title: `${clean(site.name)} — Portfolio`,
    subject: clean(site.tagline),
    author: clean(site.name),
    creator: clean(site.name)
  })
  return doc
}

/** Loads jsPDF on demand, builds the document, and hands it to the browser. */
export async function downloadPortfolioPdf() {
  const { jsPDF } = await import('jspdf')
  const doc = await buildPortfolioPdf(jsPDF, window.location.origin)
  doc.save(PDF_FILENAME)
}
