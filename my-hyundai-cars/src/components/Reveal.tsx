import type { ElementType, ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  className = '',
  children,
}: {
  as?: ElementType
  delay?: number
  className?: string
  children: ReactNode
}) {
  const ref = useReveal<HTMLDivElement>()
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
