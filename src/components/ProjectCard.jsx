import { Link } from 'react-router-dom'
import ProjectVisual from './visuals/ProjectVisual.jsx'
import { ArrowRight } from './Icons.jsx'

export default function ProjectCard({ project, isActive = false }) {
  const cardMetrics = project.cardMetrics ?? []
  const tags = project.tags ?? []
  const hasMetrics = cardMetrics.length > 0

  return (
    <article className={`project-card ${isActive ? 'is-active' : ''}`}>
      <div className="project-card__media">
        <ProjectVisual variant={project.visual} />
        <span className="project-card__number">{project.number}</span>
      </div>

      <div className="project-card__body">
        <p className="project-card__category">{project.category}</p>
        <h3 className="project-card__title">{project.displayTitle}</h3>
        <p className="project-card__desc">{project.shortDescription}</p>

        {hasMetrics ? (
          <ul className="project-card__metrics">
            {cardMetrics.map((m) => (
              <li key={m.label}>
                <span className="project-card__metric-value">{m.value}</span>
                <span className="project-card__metric-label">{m.label}</span>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="project-card__tags">
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
      </div>

      <Link className="project-card__cta link-cta" to={`/projects/${project.slug}`}>
        View case study <ArrowRight />
        <span className="project-card__hit" aria-hidden="true" />
      </Link>
    </article>
  )
}
