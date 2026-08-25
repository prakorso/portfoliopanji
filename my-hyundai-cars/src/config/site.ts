/**
 * Single source of truth for every outbound destination on the site.
 * The sales number lives here and nowhere else — no component hardcodes it.
 */

export const WHATSAPP_NUMBER = '6281234567890' // REPLACE_WITH_SALES_NUMBER (international format, digits only)

export const TRADE_IN_URL = 'https://hasamotor.com/'

export const CONTACT_EMAIL = 'hello@myhyundaicars.com'

/** Every WhatsApp entry point on the page pulls its copy from here. */
export const WA_MESSAGES = {
  default: 'Hi, saya tertarik dengan My Hyundai Cars dan ingin berkonsultasi mengenai Hyundai.',
  business: 'Hi, saya ingin berkonsultasi mengenai Hyundai untuk kebutuhan bisnis/fleet.',
  general: 'Hi, saya ingin berkonsultasi mengenai Hyundai.',
} as const

export type WhatsAppIntent = keyof typeof WA_MESSAGES

/**
 * Builds a wa.me deep link. Pass a raw string for one-off copy, or an intent
 * key from WA_MESSAGES.
 */
export function createWhatsAppLink(message: string = WA_MESSAGES.default): string {
  const number = WHATSAPP_NUMBER.replace(/\D/g, '')
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export function whatsAppLinkFor(intent: WhatsAppIntent = 'default'): string {
  return createWhatsAppLink(WA_MESSAGES[intent])
}

export const SITE = {
  name: 'My Hyundai Cars',
  tagline: 'Independent Hyundai consultation',
  disclaimer:
    'My Hyundai Cars is an independent Hyundai sales consultation service and is not the official Hyundai Indonesia corporate website.',
} as const
