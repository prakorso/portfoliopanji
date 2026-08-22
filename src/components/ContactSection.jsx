import Reveal from './Reveal.jsx'
import { site } from '../data/site.js'
import { ArrowRight, Mail, Pin, LinkedIn } from './Icons.jsx'

export default function ContactSection() {
  return (
    <section id="contact" className="section contact">
      <span className="contact__mark" aria-hidden="true">
        P
      </span>

      <div className="shell contact__inner">
        <Reveal className="contact__content">
          <span className="label">Contact</span>
          <h2 className="contact__title">
            Let&apos;s build <span className="accent">what&apos;s next.</span>
          </h2>
          <p className="contact__lead">
            Open to Marketing, Digital, Performance and Growth opportunities.
          </p>
          <a className="btn contact__cta" href={`mailto:${site.email}`}>
            Get in touch <ArrowRight />
          </a>
        </Reveal>

        <Reveal className="contact__details" delay={90}>
          <a className="contact__row" href={`mailto:${site.email}`}>
            <span className="contact__icon">
              <Mail />
            </span>
            <span>
              <span className="contact__row-label">Email</span>
              {site.email}
            </span>
          </a>

          <a
            className="contact__row"
            href={site.linkedin.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            <span className="contact__icon">
              <LinkedIn />
            </span>
            <span>
              <span className="contact__row-label">LinkedIn</span>
              {site.linkedin.label}
            </span>
          </a>

          <div className="contact__row contact__row--static">
            <span className="contact__icon">
              <Pin />
            </span>
            <span>
              <span className="contact__row-label">Location</span>
              {site.location}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
