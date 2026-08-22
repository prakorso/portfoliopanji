import Reveal from './Reveal.jsx'
import { toolGroups } from '../data/tools.js'

export default function ToolsSection() {
  return (
    <section className="section section--tight tools">
      <div className="shell tools__inner">
        <Reveal className="tools__head">
          <span className="label">Tools &amp; Technologies</span>
          <h3 className="tools__title">What I work with</h3>
        </Reveal>

        <Reveal className="tools__groups" delay={60}>
          {toolGroups.map((group) => (
            <div className="tools__group" key={group.group}>
              <span className="tools__group-name">{group.group}</span>
              <ul className="tools__list">
                {group.tools.map((tool) => (
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
