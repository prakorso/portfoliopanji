import { ArrowRight } from 'lucide-react'
import { whatsAppLinkFor } from '../config/site'

/**
 * Persistent conversion anchor for phone and tablet. Desktop relies on the
 * header CTA instead.
 */
export default function StickyWhatsApp() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
      <a
        href={whatsAppLinkFor('default')}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex min-h-[52px] w-full items-center justify-center gap-2.5 bg-bone px-4 text-[0.9375rem] font-medium tracking-[-0.01em] text-ink"
      >
        Talk to a Hyundai Consultant
        <ArrowRight
          className="h-[18px] w-[18px] shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          strokeWidth={1.6}
          aria-hidden="true"
        />
      </a>
    </div>
  )
}
