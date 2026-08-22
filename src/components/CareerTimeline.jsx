import Reveal from './Reveal.jsx'
import { milestones } from '../data/milestones.js'

export default function CareerTimeline() {
  return (
    <section id="experience" className="section section--panel timeline-section">
      <div className="shell">
        <Reveal className="eyebrow-row">
          <div>
            <span className="label">Experience</span>
            <h2 className="section-title">Career Milestones</h2>
          </div>
          <p className="section-lead timeline-section__lead">
            Eight years of compounding scope — from commercial foundation to manager-level
            marketing across brand, digital, performance and growth.
          </p>
        </Reveal>

        <ol className="timeline">
          <span className="timeline__rail" aria-hidden="true" />
          {milestones.map((m, i) => (
            <Reveal as="li" key={m.year} className="milestone" delay={i * 80}>
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
