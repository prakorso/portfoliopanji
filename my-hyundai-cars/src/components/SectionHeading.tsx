import Reveal from './Reveal'

export default function SectionHeading({
  eyebrow,
  title,
  copy,
  tone = 'light',
  className = '',
}: {
  eyebrow?: string
  title: string
  copy?: string
  tone?: 'light' | 'dark'
  className?: string
}) {
  const onDark = tone === 'dark'
  return (
    <Reveal className={className}>
      {eyebrow && (
        <p className={`eyebrow ${onDark ? 'text-white/50' : 'text-mute'}`}>{eyebrow}</p>
      )}
      <h2
        className={`text-[clamp(2rem,5.6vw,3.5rem)] leading-[1.04] font-light whitespace-pre-line ${
          eyebrow ? 'mt-5' : ''
        } ${onDark ? 'text-white' : 'text-ink'}`}
      >
        {title}
      </h2>
      {copy && (
        <p
          className={`mt-5 max-w-[52ch] text-[1rem] leading-relaxed sm:text-[1.0625rem] ${
            onDark ? 'text-white/65' : 'text-mute'
          }`}
        >
          {copy}
        </p>
      )}
    </Reveal>
  )
}
