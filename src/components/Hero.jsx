import { site, heroStats } from '../data/site.js'
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
          <span className="label">Marketing Professional</span>

          <h1 className="hero__title">
            <span className="hero__line">Marketing</span>
            <span className="hero__line">Digital</span>
            <span className="hero__line accent">Performance</span>
            <span className="hero__line accent">Growth</span>
          </h1>

          <p className="hero__lead">{site.heroParagraph}</p>

          <div className="hero__actions">
            <a className="btn" href="#projects">
              View selected work <ArrowRight />
            </a>
            <a className="btn btn--ghost" href="#contact">
              Get in touch
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
              src={site.portrait}
              alt={`${site.name}, marketing professional`}
              width="720"
              height="900"
              loading="eager"
            />
            <div className="portrait__tag">
              <span className="portrait__tag-dot" aria-hidden="true" />
              Brand · Digital · Performance · Growth
            </div>
          </div>
        </div>
      </div>

      <div className="shell">
        <ul className="hero__stats">
          {heroStats.map((stat) => (
            <li key={stat.label} className="hero__stat">
              <span className="hero__stat-value">{stat.value}</span>
              <span className="hero__stat-label">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
