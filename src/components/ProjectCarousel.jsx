import { useCallback, useEffect, useRef, useState } from 'react'
import Reveal from './Reveal.jsx'
import ProjectCard from './ProjectCard.jsx'
import { featuredProjects as projects, projectsSection as heading } from '../content/index.js'
import { ArrowLeft, ArrowRight } from './Icons.jsx'

/** User-controlled carousel. Native scroll + snap on touch, arrows on desktop. No autoplay. */
export default function ProjectCarousel() {
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)
  const [edges, setEdges] = useState({ start: true, end: false })

  const readPosition = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('.carousel__item')
    const step = card ? card.getBoundingClientRect().width + 24 : track.clientWidth
    const index = Math.round(track.scrollLeft / step)
    setActive(Math.max(0, Math.min(projects.length - 1, index)))
    setEdges({
      start: track.scrollLeft <= 8,
      end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 8
    })
  }, [projects.length])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    readPosition()
    track.addEventListener('scroll', readPosition, { passive: true })
    window.addEventListener('resize', readPosition)
    return () => {
      track.removeEventListener('scroll', readPosition)
      window.removeEventListener('resize', readPosition)
    }
  }, [readPosition])

  const scrollToIndex = (index) => {
    const track = trackRef.current
    if (!track) return
    const cards = track.querySelectorAll('.carousel__item')
    const first = cards[0]
    const target = cards[Math.min(cards.length - 1, Math.max(0, index))]
    if (!first || !target) return
    track.scrollTo({ left: target.offsetLeft - first.offsetLeft, behavior: 'smooth' })
  }

  return (
    <section id="projects" className="section projects">
      <div className="shell">
        <Reveal className="eyebrow-row projects__head">
          <div>
            <span className="label">{heading.label}</span>
            <h2 className="section-title">{heading.title}</h2>
            <p className="section-lead">{heading.lead}</p>
          </div>

          <div className="carousel__controls">
            <button
              type="button"
              className="carousel__btn"
              onClick={() => scrollToIndex(active - 1)}
              disabled={edges.start}
              aria-label="Previous project"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              className="carousel__btn carousel__btn--next"
              onClick={() => scrollToIndex(active + 1)}
              disabled={edges.end}
              aria-label="Next project"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </Reveal>
      </div>

      <div className="carousel">
        <div className="carousel__track" ref={trackRef} tabIndex={0} aria-label="Featured projects">
          {projects.map((project, i) => (
            <div className="carousel__item" key={project.slug}>
              <ProjectCard project={project} isActive={i === active} />
            </div>
          ))}
        </div>
      </div>

      <div className="shell">
        <div className="carousel__progress" role="tablist" aria-label="Project selector">
          {projects.map((project, i) => (
            <button
              key={project.slug}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Go to ${project.title}`}
              className={`carousel__pip ${i === active ? 'is-active' : ''}`}
              onClick={() => scrollToIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
