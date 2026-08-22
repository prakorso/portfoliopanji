import Reveal from './Reveal.jsx'
import { useSection } from '../content/ContentProvider.jsx'

export default function ToolsSection() {
  const tools = useSection('tools')

  return (
    <section className="section section--tight tools">
      <div className="shell tools__inner">
        <Reveal className="tools__head">
          <span className="label">{tools.label}</span>
          <h3 className="tools__title">{tools.title}</h3>
        </Reveal>

        <Reveal className="tools__groups" delay={60}>
          {(tools.groups ?? []).map((group, i) => (
            <div className="tools__group" key={`${group.group}-${i}`}>
              <span className="tools__group-name">{group.group}</span>
              <ul className="tools__list">
                {(group.tools ?? []).map((tool) => (
                  <li key={tool} className="tools__chip">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
