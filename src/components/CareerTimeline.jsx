import Reveal from './Reveal.jsx'
import { experienceSection as experience, milestones } from '../content/index.js'

export default function CareerTimeline() {
  return (
    <section id="experience" className="section section--panel timeline-section">
      <div className="shell">
        <Reveal className="eyebrow-row">
          <div>
            <span className="label">{experience.label}</span>
            <h2 className="section-title">{experience.title}</h2>
          </div>
          <p className="section-lead timeline-section__lead">{experience.lead}</p>
        </Reveal>

        <ol className="timeline">
          <span className="timeline__rail" aria-hidden="true" />
          {milestones.map((m, i) => (
            <Reveal as="li" key={`${m.year}-${i}`} className="milestone" delay={i * 80}>
              <span className="milestone__marker" aria-hidden="true">
                <span className="milestone__dot" />
              </span>
              <span className="milestone__year">{m.year}</span>
              <h3 className="milestone__title">{m.title}</h3>
              {m.company && <p className="milestone__company">{m.company}</p>}
              <p className="milestone__text">{m.description}</p>
              {(m.achievements ?? []).length > 0 && (
                <ul className="milestone__achievements">
                  {m.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
