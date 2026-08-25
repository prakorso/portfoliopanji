import { useCallback, useEffect, useState } from 'react'
import Reveal from './Reveal.jsx'
import { Play, ExternalLink, Close, ArrowRight } from './Icons.jsx'
import { projectMedia, projectLinks, isVideo, mediaThumb, mediaHref } from '../lib/media.js'

/**
 * Selected Media — optional visual evidence for a case study.
 *
 * Sits between Measured Impact and Key Learning, in the same section/shell
 * wrapper every other case-study section uses, so it inherits the page's
 * content edges rather than defining its own.
 *
 * Videos are never embedded. A third-party player on every case study would
 * cost a page load's worth of scripts for something most readers never press,
 * so a video is a card that links out — the thumbnail the editor supplied, or a
 * plain placeholder if they supplied none.
 *
 * The whole section is absent when a project has neither media nor links, which
 * is the state every project is in until its owner fills the list.
 */
export default function SelectedMedia({ project }) {
  const media = projectMedia(project)
  const links = projectLinks(project)
  const [zoomed, setZoomed] = useState(null)

  const close = useCallback(() => setZoomed(null), [])

  useEffect(() => {
    if (!zoomed) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [zoomed, close])

  if (!media.length && !links.length) return null

  return (
    <section className="section case__media">
      <div className="shell">
        <Reveal>
          <span className="label">Selected media</span>
          <h2 className="section-title">Selected work, campaign materials and supporting evidence.</h2>
        </Reveal>

        {media.length > 0 && (
          <Reveal className="media-grid" delay={70}>
            {media.map((item, i) => (
              <MediaCard
                key={`${item.title || item.image || item.videoUrl || 'media'}-${i}`}
                item={item}
                onZoom={setZoomed}
              />
            ))}
          </Reveal>
        )}

        {links.length > 0 && (
          <Reveal className="media-links" delay={110}>
            <span className="label label--bare">Related materials</span>
            <ul className="media-links__list">
              {links.map((link, i) => (
                <li key={`${link.url}-${i}`}>
                  <a
                    className="link-cta media-links__link"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ArrowRight size={14} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>

      {zoomed && (
        <div
          className="media-zoom"
          role="dialog"
          aria-modal="true"
          aria-label={zoomed.title || 'Enlarged image'}
          onClick={close}
        >
          <button type="button" className="media-zoom__close" onClick={close} aria-label="Close">
            <Close size={20} />
          </button>
          <img
            className="media-zoom__image"
            src={zoomed.src}
            alt={zoomed.title || ''}
            onClick={(event) => event.stopPropagation()}
          />
          {zoomed.title && <p className="media-zoom__caption">{zoomed.title}</p>}
        </div>
      )}
    </section>
  )
}

function MediaCard({ item, onZoom }) {
  const video = isVideo(item)
  const thumb = mediaThumb(item)
  const href = mediaHref(item)
  const title = (item.title ?? '').trim()
  const description = (item.description ?? '').trim()
  const platform = (item.platform ?? '').trim()
  const linkLabel = (item.linkLabel ?? '').trim() || (video ? 'Watch video' : 'View')

  // An image with nothing to link to opens in place; anything with an address
  // leaves the site. Both keep the same card, so the grid stays even.
  const openZoom = () => onZoom({ src: thumb, title })

  const figure = thumb ? (
    <img className="media-card__image" src={thumb} alt={title} loading="lazy" />
  ) : (
    <span className="media-card__placeholder" aria-hidden="true">
      <Play size={26} />
    </span>
  )

  return (
    <figure className={`media-card ${video ? 'media-card--video' : ''}`}>
      {video ? (
        <a
          className="media-card__frame"
          href={href || undefined}
          target={href ? '_blank' : undefined}
          rel={href ? 'noopener noreferrer' : undefined}
        >
          {figure}
          <span className="media-card__play" aria-hidden="true">
            <Play size={18} />
          </span>
        </a>
      ) : thumb ? (
        <button type="button" className="media-card__frame" onClick={openZoom} aria-label={title ? `Enlarge ${title}` : 'Enlarge image'}>
          {figure}
        </button>
      ) : (
        <span className="media-card__frame">{figure}</span>
      )}

      {(title || description || platform || href) && (
        <figcaption className="media-card__body">
          {platform && <span className="media-card__platform">{platform}</span>}
          {title && <h3 className="media-card__title">{title}</h3>}
          {description && <p className="media-card__desc">{description}</p>}
          {href && (
            <a
              className="link-cta media-card__cta"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {linkLabel}
              <ExternalLink size={13} />
            </a>
          )}
        </figcaption>
      )}
    </figure>
  )
}
