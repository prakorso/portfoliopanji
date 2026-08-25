import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import ModelCard from './ModelCard'
import Reveal from './Reveal'
import { MODELS } from '../data/models'

const GAP = 20

export default function ModelCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const sync = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const max = track.scrollWidth - track.clientWidth
    setCanPrev(track.scrollLeft > 8)
    setCanNext(track.scrollLeft < max - 8)
  }, [])

  useEffect(() => {
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [sync])

  const step = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector<HTMLElement>('[data-card]')
    const amount = card ? card.offsetWidth + GAP : track.clientWidth * 0.8
    track.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  // Mouse drag-to-scroll. Touch keeps the native momentum scroll.
  const drag = useRef({ active: false, startX: 0, startLeft: 0 })
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const track = trackRef.current
    if (!track) return
    drag.current = { active: true, startX: e.clientX, startLeft: track.scrollLeft }
    track.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    if (!drag.current.active || !track) return
    track.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX)
  }
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    if (!drag.current.active || !track) return
    drag.current.active = false
    if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId)
  }

  return (
    <div>
      <div className="shell flex items-center justify-end">
        <div className="hidden items-center gap-3 md:flex">
          <CarouselButton
            label="Previous models"
            disabled={!canPrev}
            onClick={() => step(-1)}
            icon={<ArrowLeft className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />}
          />
          <CarouselButton
            label="Next models"
            disabled={!canNext}
            onClick={() => step(1)}
            icon={<ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />}
          />
        </div>
      </div>

      <Reveal className="mt-8 lg:mt-10">
        <div
          ref={trackRef}
          onScroll={sync}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          role="region"
          aria-label="Hyundai model showcase"
          tabIndex={0}
          className="no-scrollbar shell flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 overscroll-x-contain pb-2 xs:scroll-px-6 md:scroll-px-10 xl:scroll-px-16"
        >
          {MODELS.map((model) => (
            <div
              key={model.id}
              data-card
              className="w-[78%] shrink-0 snap-start xs:w-[74%] sm:w-[52%] md:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]"
            >
              <ModelCard model={model} />
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  )
}

function CarouselButton({
  label,
  disabled,
  onClick,
  icon,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  icon: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="inline-flex h-12 w-12 items-center justify-center border border-rule text-ink transition-colors duration-300 hover:border-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-rule"
    >
      {icon}
    </button>
  )
}
