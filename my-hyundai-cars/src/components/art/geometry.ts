export type Pt = [number, number]

/**
 * Catmull-Rom interpolation converted to cubic beziers. Lets each vehicle be
 * described by a short list of proportion points while the curve quality stays
 * identical across the whole model range.
 */
export function smoothPath(points: Pt[], tension = 1, close = false): string {
  if (points.length < 2) return ''
  const pts = close ? [points[points.length - 1], ...points, points[0], points[1]] : points
  const first = close ? points[0] : pts[0]
  let d = `M ${round(first[0])} ${round(first[1])}`

  const start = close ? 1 : 0
  const end = close ? pts.length - 3 : pts.length - 2

  for (let i = start; i <= end; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) * tension) / 6, p1[1] + ((p2[1] - p0[1]) * tension) / 6]
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) * tension) / 6, p2[1] - ((p3[1] - p1[1]) * tension) / 6]
    d += ` C ${round(c1[0])} ${round(c1[1])}, ${round(c2[0])} ${round(c2[1])}, ${round(p2[0])} ${round(p2[1])}`
  }

  return close ? `${d} Z` : d
}

function round(n: number): string {
  return (Math.round(n * 100) / 100).toString()
}

/** Wheel arch cut-outs along the rocker line, front first (car faces right). */
export function rockerWithArches(
  rearX: number,
  frontWheel: number,
  rearWheel: number,
  wheelCy: number,
  archR: number,
  rocker: number,
): string {
  const dy = rocker - wheelCy
  const dx = Math.sqrt(Math.max(archR * archR - dy * dy, 1))
  // The rocker sits below the hub, so the arch is the major arc of the circle
  // centred on the wheel — large-arc-flag 1, sweep 0 to bulge upward.
  const arch = (cx: number) =>
    `A ${round(archR)} ${round(archR)} 0 1 0 ${round(cx - dx)} ${round(rocker)}`
  return [
    `L ${round(frontWheel + dx)} ${round(rocker)}`,
    arch(frontWheel),
    `L ${round(rearWheel + dx)} ${round(rocker)}`,
    arch(rearWheel),
    `L ${round(rearX)} ${round(rocker)}`,
    'Z',
  ].join(' ')
}
