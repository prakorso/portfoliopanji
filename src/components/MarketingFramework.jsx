import Reveal from './Reveal.jsx'
import { framework } from '../data/framework.js'

export default function MarketingFramework() {
  return (
    <section className="section section--alt framework">
      <div className="shell">
        <Reveal className="eyebrow-row">
          <div>
            <span className="label">How I think</span>
            <h2 className="section-title">
              A four-step way of working, <span className="accent">applied to every brief.</span>
            </h2>
          </div>
          <p className="section-lead framework__lead">
            Strategy before channel, execution before opinion, data before the next budget. The same
            loop runs whether the goal is brand, acquisition or efficiency.
          </p>
        </Reveal>

        <ol className="framework__grid">
          {framework.map((step, i) => (
            <Reveal as="li" key={step.number} className="framework__step" delay={i * 80}>
              <span className="framework__number">{step.number}</span>
              <h3 className="framework__title">{step.title}</h3>
              <p className="framework__caption">{step.caption}</p>
              <ul className="framework__items">
                {step.items.map((item) => (
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
