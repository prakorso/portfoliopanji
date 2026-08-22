import Reveal from './Reveal.jsx'
import { capabilities } from '../data/capabilities.js'
import { CapabilityIcon } from './Icons.jsx'

export default function CapabilityCards() {
  return (
    <div className="capabilities">
      {capabilities.map((cap, i) => (
        <Reveal key={cap.number} as="article" className="capability" delay={i * 70}>
          <div className="capability__head">
            <span className="capability__icon">
              <CapabilityIcon name={cap.icon} />
            </span>
            <span className="capability__number">{cap.number}</span>
          </div>
          <h3 className="capability__title">{cap.title}</h3>
          <ul className="capability__list">
            {cap.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  )
}
