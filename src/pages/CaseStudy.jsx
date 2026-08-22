import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import ProjectVisual from '../components/visuals/ProjectVisual.jsx'
import { useProject, useProjects } from '../content/ContentProvider.jsx'
import { ArrowLeft, ArrowRight } from '../components/Icons.jsx'

/** Reusable case-study template — every project renders through this one component. */
export default function CaseStudy() {
  const { slug } = useParams()
  const project = useProject(slug)
  const allProjects = useProjects()

  useEffect(() => {
    if (project) document.title = `${project.title} — Case Study | Panji Prakorso`
  }, [project])

  if (!project) return <Navigate to="/404" replace />

  const related = allProjects.filter((p) => p.slug !== slug)
  const impact = project.impact ?? {}
  const impactItems = impact.items ?? []
  const hasNumbers = impactItems.length > 0

  return (
    <article className="case">
      {/* ---------- Hero ---------- */}
      <header className="case__hero">
        <div className="case__hero-bg" aria-hidden="true">
          <span className="case__hero-glow" />
          <span className="case__hero-diagonal" />
        </div>

        <div className="shell case__hero-inner">
          <Link to="/#projects" className="case__back link-cta">
            <ArrowLeft /> Back to projects
          </Link>

          <div className="case__hero-grid">
            <div>
              <span className="case__number">{project.number}</span>
              <h1 className="case__title">{project.displayTitle}</h1>
              <p className="case__category">{project.category}</p>
              <p className="case__lead">{project.heroDescription}</p>
              <ul className="case__tags">
                {(project.tags ?? []).map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>

            <div className="case__hero-visual">
              <ProjectVisual variant={project.visual} />
            </div>
          </div>
        </div>
      </header>

      {/* ---------- Chapters ---------- */}
      <div className="shell case__body">
        {(project.chapters ?? []).map((chapter, i) => (
          <Reveal as="section" key={chapter.id} className="chapter" id={chapter.id}>
            <div className="chapter__aside">
              <span className="chapter__index">{String(i + 1).padStart(2, '0')}</span>
              <span className="label label--bare">{chapter.label}</span>
            </div>

            <div className="chapter__content">
              <h2 className="chapter__title">{chapter.title}</h2>
              {(chapter.body ?? []).map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="chapter__text">
                  {paragraph}
                </p>
              ))}

              {chapter.bullets && (
                <ul className="chapter__bullets">
                  {chapter.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}

              {chapter.columns && (
                <div className="chapter__columns">
                  {chapter.columns.map((col) => (
                    <div key={col.title} className="chapter__column">
                      <h3 className="chapter__column-title">{col.title}</h3>
                      <ul>
                        {col.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      {/* ---------- Impact ---------- */}
      <section className="section section--panel case__impact">
        <div className="shell">
          <Reveal>
            <span className="label">{impact.label}</span>
            <h2 className="section-title">
              {hasNumbers ? 'The measured result' : 'Where it stands today'}
            </h2>
          </Reveal>

          {hasNumbers && (
            <Reveal className="case__metrics" delay={70}>
              {impactItems.map((m) => (
                <div className="metric metric--lg" key={m.label}>
                  <span className="metric__value">{m.value}</span>
                  <span className="metric__label">{m.label}</span>
                </div>
              ))}
            </Reveal>
          )}

          {impact.qualitative && (
            <Reveal as="ul" className="case__qualitative" delay={70}>
              {impact.qualitative.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </Reveal>
          )}

          <Reveal className="case__attribution" delay={120}>
            <span className="case__attribution-label">Attribution</span>
            <p>
              <strong>{impact.attribution}</strong>
            </p>
            <p className="case__attribution-note">{impact.note}</p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Learning ---------- */}
      <section className="section case__learning">
        <div className="shell">
          <Reveal className="case__learning-inner">
            <span className="label">Key learning</span>
            <blockquote className="case__quote">{project.learning}</blockquote>
          </Reveal>
        </div>
      </section>

      {/* ---------- Related ---------- */}
      <section className="section section--alt case__related">
        <div className="shell">
          <Reveal>
            <span className="label">Related projects</span>
            <h2 className="section-title">Keep exploring</h2>
          </Reveal>

          <div className="case__related-grid">
            {related.map((item, i) => (
              <Reveal key={item.slug} delay={i * 90}>
                <Link to={`/projects/${item.slug}`} className="related-card">
                  <span className="related-card__number">{item.number}</span>
                  <h3 className="related-card__title">{item.displayTitle}</h3>
                  <p className="related-card__category">{item.categoryShort}</p>
                  <p className="related-card__desc">{item.shortDescription}</p>
                  <span className="link-cta related-card__cta">
                    View case study <ArrowRight />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="case__footer-actions">
            <Link className="btn btn--ghost" to="/#projects">
              <ArrowLeft /> Back to projects
            </Link>
            <Link className="btn" to="/#contact">
              Get in touch <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </article>
  )
}
