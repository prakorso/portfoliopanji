import Reveal from './Reveal.jsx'
import { getProject } from '../data/projects.js'

/**
 * Homepage impact band. Metrics are read from project data so nothing is
 * hardcoded twice — and the historical attribution travels with them.
 */
export default function ImpactMetrics() {
  const axioo = getProject('axioo-pongo')
  const { items, attribution, label } = axioo.impact

  return (
    <section className="section section--tight impact">
      <div className="shell impact__inner">
        <Reveal className="impact__head">
          <span className="label">{label}</span>
          <h2 className="section-title">Impact That Matters</h2>
        </Reveal>

        <Reveal className="impact__grid" delay={80}>
          {items.map((metric) => (
            <div key={metric.label} className="metric">
              <span className="metric__value">{metric.value}</span>
              <span className="metric__label">{metric.label}</span>
            </div>
          ))}
        </Reveal>
      </div>
      <div className="shell">
        <p className="impact__note">
          Selected historical impact achieved at <strong>{attribution}</strong>. These describe past
          performance in that role and period, not current 2026 results.
        </p>
      </div>
    </section>
  )
}
