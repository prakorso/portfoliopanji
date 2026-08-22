import Reveal from './Reveal.jsx'
import { useSection } from '../content/ContentProvider.jsx'
import { CapabilityIcon } from './Icons.jsx'

export default function CapabilityCards() {
  const disciplines = useSection('disciplines')

  return (
    <div className="capabilities">
      {(disciplines.items ?? []).map((cap, i) => (
        <Reveal key={`${cap.title}-${i}`} as="article" className="capability" delay={i * 70}>
          <div className="capability__head">
            <span className="capability__icon">
              <CapabilityIcon name={cap.icon} />
            </span>
            <span className="capability__number">{cap.number}</span>
          </div>
          <h3 className="capability__title">{cap.title}</h3>
          {cap.description && <p className="capability__desc">{cap.description}</p>}
          <ul className="capability__list">
            {(cap.items ?? []).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  )
}
