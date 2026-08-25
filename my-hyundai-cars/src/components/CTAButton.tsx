import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'

type CTAProps = {
  href: string
  children: ReactNode
  tone?: 'onLight' | 'onDark'
  variant?: 'solid' | 'ghost'
  external?: boolean
  withArrow?: boolean
  className?: string
  'aria-label'?: string
}

const STYLES: Record<string, string> = {
  'onLight-solid':
    'bg-ink text-bone border border-ink hover:bg-[#1a212b] hover:border-[#1a212b] focus-visible:outline-ink',
  'onLight-ghost':
    'bg-transparent text-ink border border-ink/25 hover:border-ink/70 hover:bg-ink/[0.03] focus-visible:outline-ink',
  'onDark-solid':
    'bg-bone text-ink border border-bone hover:bg-white hover:border-white focus-visible:outline-bone',
  'onDark-ghost':
    'bg-transparent text-bone border border-bone/35 hover:border-bone/80 hover:bg-white/[0.06] focus-visible:outline-bone',
}

export default function CTAButton({
  href,
  children,
  tone = 'onLight',
  variant = 'solid',
  external = true,
  withArrow = true,
  className = '',
  ...rest
}: CTAProps) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`group inline-flex min-h-[52px] items-center justify-center gap-2.5 px-6 py-3.5 text-[0.9375rem] font-medium tracking-[-0.01em] transition-colors duration-300 sm:px-8 ${
        STYLES[`${tone}-${variant}`]
      } ${className}`}
      aria-label={rest['aria-label']}
    >
      <span>{children}</span>
      {withArrow && (
        <ArrowRight
          className="h-[18px] w-[18px] shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
          strokeWidth={1.6}
        />
      )}
    </a>
  )
}
