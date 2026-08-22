import Reveal from './Reveal.jsx'
import { impact } from '../content/index.js'

export default function ImpactMetrics() {
  return (
    <section className="section section--tight impact">
      <div className="shell impact__inner">
        <Reveal className="impact__head">
          <span className="label">{impact.label}</span>
          <h2 className="section-title">{impact.title}</h2>
        </Reveal>

        <Reveal className="impact__grid" delay={80}>
          {(impact.items ?? []).map((metric, i) => (
            <div key={`${metric.label}-${i}`} className="metric">
              <span className="metric__value">{metric.value}</span>
              <span className="metric__label">{metric.label}</span>
            </div>
          ))}
        </Reveal>
      </div>
      {impact.note && (
        <div className="shell">
          <p className="impact__note">{impact.note}</p>
        </div>
      )}
    </section>
  )
}
