import { useState } from 'react'
import CarArt from './CarArt'
import { CAR_SPECS, type Paint } from './carSpecs'

type VehicleImageProps = {
  /** Approved photography, when available. Falls back to studio art on error. */
  photo?: string
  specKey: keyof typeof CAR_SPECS | string
  alt: string
  className?: string
  artClassName?: string
  imgClassName?: string
  loading?: 'lazy' | 'eager'
  paint?: Paint
  rimLight?: boolean
  headlightGlow?: boolean
  shadow?: boolean
  decorative?: boolean
}

/**
 * Renders vehicle imagery with a guaranteed visual: the vector studio render is
 * always painted underneath, so a missing or failed photo never leaves a broken
 * image box behind.
 */
export default function VehicleImage({
  photo,
  specKey,
  alt,
  className = '',
  artClassName = '',
  imgClassName = '',
  loading = 'lazy',
  paint,
  rimLight,
  headlightGlow,
  shadow,
  decorative,
}: VehicleImageProps) {
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const spec = CAR_SPECS[specKey] ?? CAR_SPECS.creta
  const showPhoto = Boolean(photo) && status !== 'error'

  return (
    <div className={`relative ${className}`}>
      <CarArt
        spec={spec}
        paint={paint}
        title={alt}
        className={`h-full w-full ${artClassName}`}
        rimLight={rimLight}
        headlightGlow={headlightGlow}
        shadow={shadow}
        decorative={decorative || showPhoto}
      />
      {showPhoto && (
        <img
          src={photo}
          alt={decorative ? '' : alt}
          loading={loading}
          decoding="async"
          onLoad={() => setStatus('ok')}
          onError={() => setStatus('error')}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            status === 'ok' ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}
    </div>
  )
}
