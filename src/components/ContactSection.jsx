import Reveal from './Reveal.jsx'
import { contactSection as contact } from '../content/index.js'
import { whatsAppUrl } from '../lib/whatsapp.js'
import { ArrowRight, Mail, Phone, Pin, LinkedIn } from './Icons.jsx'

export default function ContactSection() {
  const whatsapp = whatsAppUrl(contact.phone)

  return (
    <section id="contact" className="section contact">
      <span className="contact__mark" aria-hidden="true">
        P
      </span>

      <div className="shell contact__inner">
        <Reveal className="contact__content">
          <span className="label">{contact.label}</span>
          <h2 className="contact__title">
            {contact.title} <span className="accent">{contact.titleAccent}</span>
          </h2>
          <p className="contact__lead">{contact.lead}</p>
          <a
            className="btn contact__cta"
            /* Opens WhatsApp using the same number as the phone row. Falls back
               to email when there is no usable number, so the button is never
               dead and never needs its own field in the CMS. */
            href={whatsapp || `mailto:${contact.email}`}
            {...(whatsapp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {contact.ctaLabel} <ArrowRight />
          </a>
        </Reveal>

        <Reveal className="contact__details" delay={90}>
          {contact.email && (
            <a className="contact__row" href={`mailto:${contact.email}`}>
              <span className="contact__icon">
                <Mail />
              </span>
              <span>
                <span className="contact__row-label">Email</span>
                {contact.email}
              </span>
            </a>
          )}

          {contact.phone && (
            <a
              className="contact__row"
              /* Opens WhatsApp when the number can be read as international,
                 otherwise stays a normal dial link rather than a dead wa.me one. */
              href={whatsapp || `tel:${contact.phone.replace(/[^+\d]/g, '')}`}
              {...(whatsapp ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span className="contact__icon">
                <Phone />
              </span>
              <span>
                <span className="contact__row-label">Phone</span>
                {contact.phone}
              </span>
            </a>
          )}

          {contact.linkedinUrl && (
            <a
              className="contact__row"
              href={contact.linkedinUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span className="contact__icon">
                <LinkedIn />
              </span>
              <span>
                <span className="contact__row-label">LinkedIn</span>
                {contact.linkedinLabel}
              </span>
            </a>
          )}

          {contact.location && (
            <div className="contact__row contact__row--static">
              <span className="contact__icon">
                <Pin />
              </span>
              <span>
                <span className="contact__row-label">Location</span>
                {contact.location}
              </span>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}
