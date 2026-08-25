import Reveal from './Reveal'
import type { SolutionRow } from '../data/content'

/**
 * Informational rows. No links, no buttons, no hover affordance — these
 * describe the consultation scope, they are not navigation.
 */
export default function SolutionRows({
  rows,
  tone = 'light',
}: {
  rows: SolutionRow[]
  tone?: 'light' | 'dark'
}) {
  const onDark = tone === 'dark'
  return (
    <ul className={`border-t ${onDark ? 'border-white/15' : 'border-rule'}`}>
      {rows.map((row, i) => (
        <li
          key={row.title}
          className={`border-b ${onDark ? 'border-white/15' : 'border-rule'}`}
        >
          <Reveal delay={i * 80}>
            <div className="grid gap-1.5 py-6 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] sm:gap-8 sm:py-7 lg:py-8">
              <h3
                className={`text-[1.125rem] leading-snug font-normal tracking-[-0.02em] sm:text-[1.25rem] ${
                  onDark ? 'text-white' : 'text-ink'
                }`}
              >
                {row.title}
              </h3>
              <p
                className={`max-w-[46ch] text-[0.9375rem] leading-relaxed sm:text-base ${
                  onDark ? 'text-white/60' : 'text-mute'
                }`}
              >
                {row.description}
              </p>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
