import Reveal from './Reveal.jsx'
import { useSection } from '../content/ContentProvider.jsx'

export default function CareerTimeline() {
  const experience = useSection('milestones')

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
          {(experience.items ?? []).map((m, i) => (
            <Reveal as="li" key={`${m.year}-${i}`} className="milestone" delay={i * 80}>
              <span className="milestone__marker" aria-hidden="true">
                <span className="milestone__dot" />
              </span>
              <span className="milestone__year">{m.year}</span>
              <h3 className="milestone__title">{m.title}</h3>
              <p className="milestone__text">{m.description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
