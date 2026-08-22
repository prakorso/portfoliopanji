import { hero, stats } from '../content/index.js'
import { ArrowRight } from './Icons.jsx'

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero__backdrop" aria-hidden="true">
        <span className="hero__grid" />
        <span className="hero__diagonal" />
        <span className="hero__glow" />
      </div>

      <div className="shell hero__inner">
        <div className="hero__content">
          <span className="label">{hero.eyebrow}</span>

          <h1 className="hero__title">
            {(hero.headingLines ?? []).map((line, i) => (
              <span key={`${line.text}-${i}`} className={`hero__line ${line.accent ? 'accent' : ''}`}>
                {line.text}
              </span>
            ))}
          </h1>

          <p className="hero__lead">{hero.description}</p>

          <div className="hero__actions">
            <a className="btn" href={hero.primaryCtaHref}>
              {hero.primaryCtaLabel} <ArrowRight />
            </a>
            <a className="btn btn--ghost" href={hero.secondaryCtaHref}>
              {hero.secondaryCtaLabel}
            </a>
          </div>
        </div>

        <div className="hero__portrait">
          <div className="portrait">
            <span className="portrait__shape portrait__shape--a" aria-hidden="true" />
            <span className="portrait__shape portrait__shape--b" aria-hidden="true" />
            <span className="portrait__dots" aria-hidden="true" />
            <img
              className="portrait__img"
              src={hero.image}
              alt={hero.imageAlt}
              width="720"
              height="900"
              loading="eager"
            />
            {hero.badge && (
              <div className="portrait__tag">
                <span className="portrait__tag-dot" aria-hidden="true" />
                {hero.badge}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="shell">
        <ul className="hero__stats">
          {stats.map((stat, i) => (
            <li key={`${stat.label}-${i}`} className="hero__stat">
              <span className="hero__stat-value">{stat.value}</span>
              <span className="hero__stat-label">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
