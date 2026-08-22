import Reveal from './Reveal.jsx'
import CapabilityCards from './CapabilityCards.jsx'
import { site } from '../data/site.js'
import { Download } from './Icons.jsx'

export default function AboutSection() {
  return (
    <section id="about" className="section about">
      <div className="shell about__inner">
        <Reveal className="about__intro">
          <span className="label">About me</span>
          <h2 className="section-title">
            Marketing at the intersection of{' '}
            <span className="accent">Brand, Digital, Performance &amp; Growth.</span>
          </h2>
          <p className="section-lead">
            Combining marketing strategy, digital execution, performance marketing and customer
            acquisition to build measurable growth.
          </p>
          <p className="about__note">
            Eight years across consumer technology, marketplace and entrepreneurial businesses — the
            through-line is the same: understand the customer, build the funnel, and prove the
            impact with data.
          </p>
          <a className="btn btn--ghost about__cta" href={site.cvUrl} download>
            Download CV <Download />
          </a>
        </Reveal>

        <CapabilityCards />
      </div>
    </section>
  )
}
