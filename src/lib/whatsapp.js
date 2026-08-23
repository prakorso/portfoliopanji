/**
 * Turns the phone number written in the CMS into a WhatsApp link.
 *
 * The CMS holds one plain phone number and nothing else — no country code
 * field, no wa.me URL. The number stays exactly as typed wherever it is shown;
 * only the link target is normalised.
 *
 * The same rules are mirrored in public/admin/preview-templates.js so the CMS
 * preview links identically. Keep the two in step.
 */

/** Indonesian dialling code, used to replace a leading national 0. */
const COUNTRY_CODE = '62'

/**
 * Normalise a written number to the international form WhatsApp expects.
 *
 *   082233184122        -> 6282233184122
 *   0822 3318 4122      -> 6282233184122
 *   +62 822 3318 4122   -> 6282233184122
 *   6282233184122       -> 6282233184122
 *
 * Returns '' when the value cannot be a real international number, so the
 * caller can fall back instead of producing a dead link.
 */
export function toWhatsAppNumber(phone) {
  if (!phone) return ''

  // Drop spaces, dashes, parentheses, the leading +, everything but digits.
  let digits = String(phone).replace(/\D/g, '')
  if (!digits) return ''

  if (digits.startsWith('00')) {
    // 00 is the international dialling prefix — the country code follows it.
    digits = digits.slice(2)
  } else if (digits.startsWith('0')) {
    // A single leading 0 is the national trunk prefix; swap it for the country code.
    digits = COUNTRY_CODE + digits.slice(1)
  }
  // Anything else already carries its country code (62…, 1…, 44…) — leave it.

  // E.164: 8–15 digits, never a leading zero.
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : ''
}

/** Full WhatsApp link, or '' when the number cannot be normalised. */
export function whatsAppUrl(phone) {
  const number = toWhatsAppNumber(phone)
  return number ? `https://wa.me/${number}` : ''
}
