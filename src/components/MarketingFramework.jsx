import Reveal from './Reveal.jsx'
import { framework, frameworkSteps } from '../content/index.js'

export default function MarketingFramework() {
  return (
    <section className="section section--alt framework">
      <div className="shell">
        <Reveal className="eyebrow-row">
          <div>
            <span className="label">{framework.label}</span>
            <h2 className="section-title">
              {framework.title} <span className="accent">{framework.titleAccent}</span>
            </h2>
          </div>
          <p className="section-lead framework__lead">{framework.lead}</p>
        </Reveal>

        <ol className="framework__grid">
          {frameworkSteps.map((step, i) => (
            <Reveal as="li" key={`${step.title}-${i}`} className="framework__step" delay={i * 80}>
              <span className="framework__number">{step.number}</span>
              <h3 className="framework__title">{step.title}</h3>
              <p className="framework__caption">{step.caption}</p>
              <ul className="framework__items">
                {(step.points ?? []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <span className="framework__connector" aria-hidden="true" />
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
