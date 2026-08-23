/**
 * Turns a human-written phone number into a wa.me link.
 *
 * The CMS field stays a plain phone number — the owner never types a URL. What
 * is displayed on the page is never changed; only the link target is derived.
 *
 * The same rules are mirrored in public/admin/preview-templates.js so the CMS
 * preview links the same way. Keep the two in step.
 */

/**
 * Reduce a written number to the bare international form WhatsApp expects.
 * Returns '' when the result could not be a real international number, so the
 * caller can fall back rather than produce a dead link.
 *
 * @param {string} phone        e.g. "+62 821 1234 5678" or "0822 3318 4122"
 * @param {string} countryCode  dialling code used when the number is written in
 *                              national form starting with a single 0
 */
export function toWhatsAppNumber(phone, countryCode) {
  if (!phone) return ''
  let digits = String(phone).replace(/\D/g, '')
  if (!digits) return ''

  if (digits.startsWith('00')) {
    // 00 is the international dialling prefix; wa.me wants the number without it.
    digits = digits.slice(2)
  } else if (digits.startsWith('0')) {
    // A single leading 0 is a national trunk prefix and carries no country, so
    // without a country code there is no way to know which country it belongs
    // to. Decline rather than guess.
    const code = String(countryCode ?? '').replace(/\D/g, '')
    if (!code) return ''
    digits = code + digits.slice(1)
  }

  // E.164: 8–15 digits, never a leading zero.
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : ''
}

/** Full WhatsApp link, or '' when the number cannot be normalised. */
export function whatsAppUrl(phone, countryCode) {
  const number = toWhatsAppNumber(phone, countryCode)
  return number ? `https://wa.me/${number}` : ''
}
