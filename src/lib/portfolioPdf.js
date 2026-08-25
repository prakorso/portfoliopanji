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
  projects,
  projectsSection,
  framework,
  frameworkSteps,
  tools,
  contactSection
} from '../content/index.js'
import { whatsAppUrl } from './whatsapp.js'

export const PDF_FILENAME = 'Panji-Prakorsowibowo-Portfolio.pdf'

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

function coverPage(sheet, portrait) {
  const doc = sheet.doc

  // A blue wash across the top, echoing the site's hero.
  doc.setFillColor(C.surface)
  doc.rect(0, 0, PAGE.w, 232, 'F')
  doc.setDrawColor(C.accent)
  doc.setLineWidth(3)
  doc.line(0, 232, PAGE.w, 232)

  const textW = portrait ? CONTENT_W - 152 : CONTENT_W

  sheet.y = 56
  if (clean(hero.eyebrow)) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(C.bright)
    doc.text(clean(hero.eyebrow).toUpperCase(), MARGIN.x, sheet.y)
    sheet.y += 16
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(30)
  doc.setTextColor(C.text)
  doc.text(clean(site.name), MARGIN.x, sheet.y + 22)
  sheet.y += 40

  // The hero headline, keeping the accent lines blue as on the site.
  const headingLines = asList(hero.headingLines)
  if (headingLines.length) {
    doc.setFontSize(15)
    for (const line of headingLines) {
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(line.accent ? C.soft : C.text)
      doc.text(clean(line.text), MARGIN.x, sheet.y + 12)
      sheet.y += 19
    }
  } else if (clean(site.tagline)) {
    doc.setFontSize(13)
    doc.setTextColor(C.soft)
    doc.text(clean(site.tagline), MARGIN.x, sheet.y + 12)
    sheet.y += 20
  }

  if (portrait) {
    const boxW = 132
    const boxH = 168
    const ratio = Math.min(boxW / portrait.w, boxH / portrait.h)
    const w = portrait.w * ratio
    const h = portrait.h * ratio
    const x = PAGE.w - MARGIN.x - boxW + (boxW - w) / 2
    doc.setFillColor(C.raised)
    doc.setDrawColor(C.line)
    doc.roundedRect(PAGE.w - MARGIN.x - boxW, 46, boxW, boxH, 10, 10, 'FD')
    doc.addImage(portrait.data, portrait.format, x, 46 + (boxH - h) / 2, w, h, undefined, 'FAST')
  }

  sheet.y = Math.max(sheet.y + 8, 156)
  sheet.paragraph(hero.description, { size: 10, color: C.muted, width: textW, leading: 1.5 })

  sheet.y = 258

  // Headline stats.
  const items = asList(stats)
  if (items.length) {
    const gap = 10
    const w = (CONTENT_W - gap * (items.length - 1)) / items.length
    const h = 52
    items.forEach((stat, i) => {
      const x = MARGIN.x + i * (w + gap)
      sheet.panel(x, sheet.y, w, h)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.setTextColor(C.soft)
      doc.text(clean(stat.value), x + 10, sheet.y + 22)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(C.muted)
      const label = doc.splitTextToSize(clean(stat.label), w - 20)
      doc.text(label.slice(0, 2), x + 10, sheet.y + 34)
    })
    sheet.y += h + 22
  }

  // Selected historical impact — attribution and note included verbatim.
  const impactItems = asList(impact.items)
  if (impactItems.length) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(C.bright)
    const eyebrow = [clean(impact.label), clean(impact.attribution)].filter(Boolean).join(' — ')
    doc.text(eyebrow.toUpperCase(), MARGIN.x, sheet.y)
    sheet.y += 14

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(C.text)
    doc.text(clean(impact.title), MARGIN.x, sheet.y + 10)
    sheet.y += 24

    const gap = 8
    const perRow = Math.min(impactItems.length, 5)
    const w = (CONTENT_W - gap * (perRow - 1)) / perRow
    const h = 46
    impactItems.forEach((item, i) => {
      const x = MARGIN.x + (i % perRow) * (w + gap)
      const y = sheet.y + Math.floor(i / perRow) * (h + gap)
      sheet.panel(x, y, w, h, { fill: C.raised })
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.setTextColor(C.soft)
      doc.text(clean(item.value), x + w / 2, y + 20, { align: 'center' })
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(6.5)
      doc.setTextColor(C.muted)
      const label = doc.splitTextToSize(clean(item.label), w - 10)
      doc.text(label.slice(0, 2), x + w / 2, y + 31, { align: 'center' })
    })
    sheet.y += Math.ceil(impactItems.length / perRow) * (h + gap) + 6
    sheet.paragraph(impact.note, { size: 7.5, color: C.dim, leading: 1.45 })
  }
}

function aboutSectionPage(sheet) {
  sheet.newPage()
  sheet.heading(
    aboutSection.label,
    aboutSection.heading,
    aboutSection.headingAccent,
    aboutSection.description
  )
  sheet.paragraph(aboutSection.note, { size: 9, color: C.dim, leading: 1.5, after: 12 })

  const cards = asList(disciplines)
  const gap = 10
  const w = (CONTENT_W - gap) / 2
  for (let i = 0; i < cards.length; i += 2) {
    const row = cards.slice(i, i + 2)
    // Both cards in a row share the taller height so the grid stays even.
    const heights = row.map((card) => {
      const desc = sheet.measure(card.description, { size: 8.5, width: w - 24, leading: 1.45 })
      const points = asList(card.points).length * 8.5 * 1.5
      return 46 + desc + points + 12
    })
    const h = Math.max(...heights)
    sheet.need(h + gap)
    const top = sheet.y
    row.forEach((card, j) => {
      const x = MARGIN.x + j * (w + gap)
      sheet.panel(x, top, w, h, { fill: C.surface })
      sheet.doc.setFont('helvetica', 'bold')
      sheet.doc.setFontSize(8)
      sheet.doc.setTextColor(C.bright)
      sheet.doc.text(clean(card.number), x + 12, top + 18)
      sheet.doc.setFontSize(12)
      sheet.doc.setTextColor(C.text)
      sheet.doc.text(clean(card.title), x + 12, top + 34)

      let cy = top + 44
      const desc = clean(card.description)
      if (desc) {
        sheet.doc.setFont('helvetica', 'normal')
        sheet.doc.setFontSize(8.5)
        sheet.doc.setTextColor(C.muted)
        const rows = sheet.doc.splitTextToSize(desc, w - 24)
        sheet.doc.text(rows, x + 12, cy)
        cy += rows.length * 8.5 * 1.45
      }
      for (const point of asList(card.points).map(clean).filter(Boolean)) {
        sheet.doc.setFillColor(C.accent)
        sheet.doc.circle(x + 14, cy - 2.5, 1.5, 'F')
        sheet.doc.setFont('helvetica', 'normal')
        sheet.doc.setFontSize(8.5)
        sheet.doc.setTextColor(C.muted)
        sheet.doc.text(sheet.doc.splitTextToSize(point, w - 32)[0], x + 21, cy)
        cy += 8.5 * 1.5
      }
    })
    sheet.y = top + h + gap
  }
}

function experiencePages(sheet) {
  sheet.newPage()
  sheet.heading(experienceSection.label, experienceSection.title, '', experienceSection.lead)

  for (const m of asList(milestones)) {
    // Mirrors CareerTimeline: a promotion stays part of one milestone.
    const dates = [clean(m.startDate), clean(m.endDate)].filter(Boolean).join(' – ')
    const promotion = clean(m.promotionNote)
      ? [clean(m.promotionNote), clean(m.promotionDate)].filter(Boolean).join(' · ')
      : clean(m.promotionDate)
        ? `Promoted ${clean(m.promotionDate)}`
        : ''
    const achievements = asList(m.achievements).map(clean).filter(Boolean)

    const innerW = CONTENT_W - 24
    const h =
      34 +
      sheet.measure(m.title, { size: 12, style: 'bold', width: innerW }) +
      (clean(m.company) ? 13 : 0) +
      (dates ? 12 : 0) +
      (clean(m.joinedAs) ? 12 : 0) +
      (promotion ? 12 : 0) +
      sheet.measure(m.description, { size: 9, width: innerW, leading: 1.5 }) +
      achievements.length * 9 * 1.5 +
      16

    sheet.need(Math.min(h + 10, PAGE.h - MARGIN.top - MARGIN.bottom))
    const top = sheet.y
    sheet.panel(MARGIN.x, top, CONTENT_W, h, { fill: C.surface })
    // Blue spine, the timeline's rail.
    sheet.doc.setFillColor(C.accent)
    sheet.doc.rect(MARGIN.x, top + 8, 2.5, h - 16, 'F')

    sheet.y = top + 12
    const x = MARGIN.x + 14
    sheet.doc.setFont('helvetica', 'bold')
    sheet.doc.setFontSize(8)
    sheet.doc.setTextColor(C.bright)
    sheet.doc.text(clean(m.year), x, sheet.y + 6)
    sheet.y += 14

    sheet.paragraph(m.title, { size: 12, style: 'bold', x, width: innerW, leading: 1.3 })
    if (clean(m.company)) {
      sheet.paragraph(m.company, { size: 9, color: C.soft, x, width: innerW, leading: 1.35 })
    }
    if (dates) sheet.paragraph(dates, { size: 8, color: C.dim, x, width: innerW, leading: 1.4 })
    if (clean(m.joinedAs)) {
      sheet.paragraph(`Joined as ${clean(m.joinedAs)}`, { size: 8, color: C.dim, x, width: innerW, leading: 1.4 })
    }
    if (promotion) {
      sheet.paragraph(promotion, { size: 8, color: C.bright, style: 'bold', x, width: innerW, leading: 1.4 })
    }
    sheet.y += 3
    sheet.paragraph(m.description, { size: 9, color: C.muted, x, width: innerW, leading: 1.5 })
    if (achievements.length) sheet.bullets(achievements, { size: 9, x, width: innerW })

    sheet.y = Math.max(sheet.y, top + h) + 10
  }
}

async function projectPages(sheet, origin) {
  sheet.newPage()
  sheet.heading(projectsSection.label, projectsSection.title, '', projectsSection.lead)

  for (const project of asList(projects)) {
    // Real imagery only: heroImage/logo come from the CMS. The site's decorative
    // SVG placeholders carry no information a PDF reader needs.
    const image = await loadImage(project.heroImage || project.logo, 520)
    const tags = asList(project.tags).map(clean).filter(Boolean)
    const metrics = asList(project.cardMetrics)
    const innerW = CONTENT_W - 28
    const imageH = image ? Math.min(150, (innerW * image.h) / image.w) : 0

    const h =
      36 +
      sheet.measure(project.displayTitle || project.title, { size: 15, style: 'bold', width: innerW }) +
      (clean(project.category) ? 13 : 0) +
      sheet.measure(project.shortDescription || project.heroDescription, {
        size: 9,
        width: innerW,
        leading: 1.5
      }) +
      (imageH ? imageH + 12 : 0) +
      (tags.length ? 24 : 0) +
      (metrics.length ? 44 : 0) +
      26

    sheet.need(Math.min(h + 12, PAGE.h - MARGIN.top - MARGIN.bottom))
    const top = sheet.y
    sheet.panel(MARGIN.x, top, CONTENT_W, h, { fill: C.surface })

    sheet.y = top + 14
    const x = MARGIN.x + 14

    sheet.doc.setFont('helvetica', 'bold')
    sheet.doc.setFontSize(8)
    sheet.doc.setTextColor(C.bright)
    sheet.doc.text(clean(project.number), x, sheet.y + 6)
    sheet.y += 14

    sheet.paragraph(project.displayTitle || project.title, {
      size: 15,
      style: 'bold',
      x,
      width: innerW,
      leading: 1.25
    })
    if (clean(project.category)) {
      sheet.paragraph(project.category, { size: 8.5, color: C.soft, x, width: innerW, leading: 1.4 })
    }
    sheet.y += 2
    sheet.paragraph(project.shortDescription || project.heroDescription, {
      size: 9,
      color: C.muted,
      x,
      width: innerW,
      leading: 1.5
    })

    if (image) {
      const w = Math.min(innerW, (imageH * image.w) / image.h)
      sheet.y += 6
      sheet.doc.addImage(image.data, image.format, x, sheet.y, w, imageH, undefined, 'FAST')
      sheet.y += imageH + 6
    }

    if (tags.length) {
      sheet.y += 2
      sheet.chips(tags, { x, width: innerW })
    }

    if (metrics.length) {
      const gap = 8
      const w = (innerW - gap * (metrics.length - 1)) / metrics.length
      const mh = 38
      metrics.forEach((metric, i) => {
        const mx = x + i * (w + gap)
        sheet.panel(mx, sheet.y, w, mh, { fill: C.raised, radius: 6 })
        sheet.doc.setFont('helvetica', 'bold')
        sheet.doc.setFontSize(11)
        sheet.doc.setTextColor(C.soft)
        sheet.doc.text(clean(metric.value), mx + w / 2, sheet.y + 16, { align: 'center' })
        sheet.doc.setFont('helvetica', 'normal')
        sheet.doc.setFontSize(6.5)
        sheet.doc.setTextColor(C.muted)
        const label = sheet.doc.splitTextToSize(clean(metric.label), w - 8)
        sheet.doc.text(label.slice(0, 2), mx + w / 2, sheet.y + 26, { align: 'center' })
      })
      sheet.y += mh + 8
    }

    if (origin && clean(project.slug)) {
      const path = `/projects/${clean(project.slug)}`
      sheet.link(`Read the case study: ${path}`, `${origin}${path}`, { size: 8, x })
    }

    sheet.y = Math.max(sheet.y, top + h) + 12
  }
}

function frameworkPages(sheet) {
  sheet.newPage()
  sheet.heading(framework.label, framework.title, framework.titleAccent, framework.lead)

  for (const step of asList(frameworkSteps)) {
    const innerW = CONTENT_W - 28
    const points = asList(step.points).map(clean).filter(Boolean)
    const h =
      32 +
      (clean(step.caption) ? sheet.measure(step.caption, { size: 9, width: innerW, leading: 1.45 }) : 0) +
      (points.length ? 24 : 0) +
      14

    sheet.need(h + 10)
    const top = sheet.y
    sheet.panel(MARGIN.x, top, CONTENT_W, h, { fill: C.surface })

    sheet.doc.setFont('helvetica', 'bold')
    sheet.doc.setFontSize(17)
    sheet.doc.setTextColor(C.accent)
    sheet.doc.text(clean(step.number), MARGIN.x + 14, top + 26)

    const x = MARGIN.x + 52
    sheet.y = top + 12
    sheet.paragraph(step.title, { size: 12, style: 'bold', x, width: innerW - 38, leading: 1.3 })
    if (clean(step.caption)) {
      sheet.paragraph(step.caption, { size: 9, color: C.muted, x, width: innerW - 38, leading: 1.45 })
    }
    if (points.length) {
      sheet.y += 2
      sheet.chips(points, { x, width: innerW - 38 })
    }
    sheet.y = Math.max(sheet.y, top + h) + 10
  }
}

function toolsSection(sheet) {
  const groups = asList(tools.groups)
  if (!groups.length) return
  sheet.need(120)
  sheet.gap(8)
  sheet.heading(tools.label, tools.title, '', '')

  for (const group of groups) {
    const names = asList(group.tools).map(clean).filter(Boolean)
    sheet.need(46)
    sheet.paragraph(group.group, { size: 10, style: 'bold', color: C.text, leading: 1.4, after: 4 })
    sheet.chips(names)
  }
}

function contactPage(sheet) {
  sheet.newPage()
  sheet.heading(contactSection.label, contactSection.title, contactSection.titleAccent, contactSection.lead)

  const rows = []
  const email = clean(contactSection.email)
  if (email) rows.push({ label: 'Email', value: email, url: `mailto:${email}` })

  // Same normalisation the site's contact row and CTA use — the number is shown
  // exactly as written, and only the link is converted.
  const phone = clean(contactSection.phone)
  if (phone) rows.push({ label: 'Phone / WhatsApp', value: phone, url: whatsAppUrl(phone) })

  const location = clean(contactSection.location)
  if (location) rows.push({ label: 'Location', value: location, url: '' })

  const linkedin = clean(contactSection.linkedinUrl)
  if (linkedin) {
    rows.push({ label: 'LinkedIn', value: clean(contactSection.linkedinLabel) || linkedin, url: linkedin })
  }
  const instagram = clean(contactSection.instagramUrl)
  if (instagram) {
    rows.push({ label: 'Instagram', value: clean(contactSection.instagramLabel) || instagram, url: instagram })
  }

  sheet.gap(4)
  for (const row of rows) {
    sheet.need(38)
    const top = sheet.y
    sheet.panel(MARGIN.x, top, CONTENT_W, 32, { fill: C.surface, radius: 6 })
    sheet.doc.setFont('helvetica', 'bold')
    sheet.doc.setFontSize(7.5)
    sheet.doc.setTextColor(C.dim)
    sheet.doc.text(row.label.toUpperCase(), MARGIN.x + 12, top + 13)
    sheet.y = top + 15
    if (row.url) {
      sheet.link(row.value, row.url, { size: 10, x: MARGIN.x + 12, color: C.soft })
    } else {
      sheet.paragraph(row.value, { size: 10, color: C.text, x: MARGIN.x + 12, width: CONTENT_W - 24 })
    }
    sheet.y = top + 32 + 8
  }
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
  frameworkPages(sheet)
  toolsSection(sheet)
  contactPage(sheet)

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
