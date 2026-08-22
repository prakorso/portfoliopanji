import Reveal from './Reveal.jsx'
import CapabilityCards from './CapabilityCards.jsx'
import { aboutSection as about } from '../content/index.js'
import { Download } from './Icons.jsx'

export default function AboutSection() {
  return (
    <section id="about" className="section about">
      <div className="shell about__inner">
        <Reveal className="about__intro">
          <span className="label">{about.label}</span>
          <h2 className="section-title">
            {about.heading} <span className="accent">{about.headingAccent}</span>
          </h2>
          <p className="section-lead">{about.description}</p>
          {about.note && <p className="about__note">{about.note}</p>}
          {about.cvUrl && (
            <a className="btn btn--ghost about__cta" href={about.cvUrl} download>
              {about.cvLabel} <Download />
            </a>
          )}
        </Reveal>

        <CapabilityCards />
      </div>
    </section>
  )
}
