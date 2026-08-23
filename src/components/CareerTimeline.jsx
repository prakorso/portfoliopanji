import { useCallback, useEffect, useRef, useState } from 'react'
import Reveal from './Reveal.jsx'
import { experienceSection as experience, milestones } from '../content/index.js'
import { ArrowLeft, ArrowRight } from './Icons.jsx'

/**
 * How many milestones the horizontal timeline shows at once on desktop.
 * Up to this many share the full width evenly; beyond it the track scrolls.
 */
const VISIBLE = 5

export default function CareerTimeline() {
  const trackRef = useRef(null)
  const count = milestones.length
  const scrollable = count > VISIBLE
  const [edges, setEdges] = useState({ start: true, end: false })

  const readEdges = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    setEdges({ start: track.scrollLeft <= 8, end: track.scrollLeft >= max - 8 })
  }, [])

  useEffect(() => {
    if (!scrollable) return undefined
    const track = trackRef.current
    if (!track) return undefined
    readEdges()
    track.addEventListener('scroll', readEdges, { passive: true })
    window.addEventListener('resize', readEdges)
    return () => {
      track.removeEventListener('scroll', readEdges)
      window.removeEventListener('resize', readEdges)
    }
  }, [scrollable, readEdges])

  const step = (direction) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('.milestone')
    const gap = parseFloat(getComputedStyle(track).columnGap) || 24
    const distance = card ? card.getBoundingClientRect().width + gap : track.clientWidth
    track.scrollBy({ left: direction * distance, behavior: 'smooth' })
  }

  return (
    <section id="experience" className="section section--panel timeline-section">
      <div className="shell">
        <Reveal className="eyebrow-row">
          <div>
            <span className="label">{experience.label}</span>
            <h2 className="section-title">{experience.title}</h2>
          </div>
          <p className="section-lead timeline-section__lead">{experience.lead}</p>
        </Reveal>

        {/* Controls appear only once there are more milestones than fit. */}
        {scrollable && (
          <div className="timeline__controls">
            <button
              type="button"
              className="carousel__btn"
              onClick={() => step(-1)}
              disabled={edges.start}
              aria-label="Previous milestones"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              className="carousel__btn"
              onClick={() => step(1)}
              disabled={edges.end}
              aria-label="Next milestones"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/*
          --n drives the rail length and --visible the card width, so the layout
          follows the number of milestones in the CMS with no code change:
          up to VISIBLE they divide the full width evenly, beyond it the track
          scrolls and keeps the same card size.
        */}
        <ol
          className={`timeline ${scrollable ? 'is-scrollable' : ''}`}
          ref={trackRef}
          style={{ '--n': count || 1, '--visible': Math.min(Math.max(count, 1), VISIBLE) }}
        >
          <span className="timeline__rail" aria-hidden="true" />
          {milestones.map((m, i) => {
            /*
              Optional career-progression details. A promotion inside the same
              company stays part of this one milestone rather than becoming a
              second point on the timeline. Every line renders only when its
              field is filled in, so entries without them look exactly as before.
            */
            const dates = [m.startDate, m.endDate].filter(Boolean).join(' – ')
            const promotion = m.promotionNote
              ? [m.promotionNote, m.promotionDate].filter(Boolean).join(' · ')
              : m.promotionDate
                ? `Promoted ${m.promotionDate}`
                : ''

            const body = (
              <>
                <span className="milestone__marker" aria-hidden="true">
                  <span className="milestone__dot" />
                </span>
                <span className="milestone__year">{m.year}</span>
                <h3 className="milestone__title">{m.title}</h3>
                {m.company && <p className="milestone__company">{m.company}</p>}
                {(dates || m.joinedAs || promotion) && (
                  <div className="milestone__progression">
                    {dates && <p className="milestone__dates">{dates}</p>}
                    {m.joinedAs && <p className="milestone__joined">Joined as {m.joinedAs}</p>}
                    {promotion && <p className="milestone__promotion">{promotion}</p>}
                  </div>
                )}
                <p className="milestone__text">{m.description}</p>
                {(m.achievements ?? []).length > 0 && (
                  <ul className="milestone__achievements">
                    {m.achievements.map((achievement) => (
                      <li key={achievement}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </>
            )

            /*
              The scroll reveal watches for an element entering the viewport.
              Milestones parked beyond the visible window never do that until
              the track is scrolled, and would sit at zero opacity, so only the
              ones on screen animate in — the rest render already visible.
            */
            return scrollable && i >= VISIBLE ? (
              <li key={`${m.year}-${i}`} className="milestone">
                {body}
              </li>
            ) : (
              <Reveal as="li" key={`${m.year}-${i}`} className="milestone" delay={i * 80}>
                {body}
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
