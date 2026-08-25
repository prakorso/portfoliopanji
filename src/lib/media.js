/**
 * Reading the optional Selected Media list off a project.
 *
 * The case-study page, the PDF and the CMS preview all decide what to draw from
 * here, so a rule about what counts as a video — or what makes an item worth
 * rendering at all — is written once rather than three times.
 *
 * Every field is optional in the CMS, so nothing here assumes a shape: an item
 * with no usable content is dropped rather than rendered as an empty card.
 */

const byOrder = (a, b) => (a.order ?? 999) - (b.order ?? 999)

const text = (v) => (v == null ? '' : String(v).trim())

/** A video item is one the editor marked as such, or one that only has a link. */
export const isVideo = (item) =>
  item.type === 'video' || (!text(item.image) && !!text(item.videoUrl))

/** The picture to show: a video's own thumbnail, else whatever image it carries. */
export const mediaThumb = (item) => text(item.thumbnail) || text(item.image)

/** Where a media card sends you, if anywhere. */
export const mediaHref = (item) => text(item.linkUrl) || text(item.videoUrl)

/**
 * An item earns a card only if it can show or say something: a picture, a link,
 * or at minimum a title. Otherwise a half-filled row in the CMS would leave a
 * blank tile on the page.
 */
const hasSubstance = (item) =>
  !!(mediaThumb(item) || mediaHref(item) || text(item.title) || text(item.description))

export function projectMedia(project) {
  return [...(project?.media ?? [])].filter((item) => item && hasSubstance(item)).sort(byOrder)
}

/** Related materials. A link with no address or no wording is not a link. */
export function projectLinks(project) {
  return [...(project?.links ?? [])]
    .filter((link) => link && text(link.url) && text(link.label))
    .sort(byOrder)
}
