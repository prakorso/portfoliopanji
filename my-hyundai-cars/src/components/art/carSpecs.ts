import type { Pt } from './geometry'

export type Paint = {
  /** upper body / mid body / lower body */
  body: [string, string, string]
  glass: [string, string]
  lamp: string
}

/** Shared drawing surface. Every vehicle is built to the same scale. */
export const CAR_VIEWBOX = { w: 1000, h: 480, ground: 415 }

/** Pixels per millimetre — keeps the range in true relative proportion. */
const SCALE = 0.18

type ModelParams = {
  lengthMm: number
  heightMm: number
  wheelbaseMm: number
  wheelDiaMm: number
  clearanceMm: number
  /** Beltline height as a fraction of overall height. */
  beltRatio: number
  /** Roof-rear / roof-front / cowl positions as fractions of length from the tail. */
  roofRear: number
  roofFront: number
  cowl: number
  /** Share of total overhang carried at the front. */
  frontBias: number
  /** How far the bonnet nose sits below the beltline, as a fraction of flank depth. */
  noseDrop: number
  paint: Paint
}

export type CarSpec = {
  rearX: number
  frontX: number
  rearWheel: number
  frontWheel: number
  wheelR: number
  archR: number
  rocker: number
  beltY: number
  roofY: number
  outline: Pt[]
  glass: Pt[]
  belt: Pt[]
  lower: Pt[]
  bPillar: number
  door: number[]
  headlight: Pt[]
  taillight: Pt[]
  mirror: Pt[]
  paint: Paint
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function buildSpec(p: ModelParams): CarSpec {
  const L = p.lengthMm * SCALE
  const H = p.heightMm * SCALE
  const WB = p.wheelbaseMm * SCALE
  const ground = CAR_VIEWBOX.ground

  const rearX = (CAR_VIEWBOX.w - L) / 2
  const frontX = rearX + L
  const overhang = L - WB
  const rearWheel = rearX + overhang * (1 - p.frontBias)
  const frontWheel = frontX - overhang * p.frontBias

  const wheelR = (p.wheelDiaMm * SCALE) / 2
  const archR = wheelR * 1.17
  const rocker = ground - p.clearanceMm * SCALE
  const roofY = ground - H
  const beltY = ground - p.beltRatio * H
  /** Greenhouse height and flank depth — every control point is measured
   *  against one of these, never against overall height. */
  const GH = beltY - roofY
  const FD = rocker - beltY
  const hoodY = beltY - 0.06 * GH
  const noseY = beltY + p.noseDrop * FD

  const rgX = rearX + p.roofRear * L
  const rfX = rearX + p.roofFront * L
  const cwX = rearX + p.cowl * L
  const bPillar = lerp(rgX, cwX, 0.42)
  const gBotY = beltY - 0.08 * GH

  const outline: Pt[] = [
    [rearX + 0.03 * L, rocker],
    [rearX + 0.008 * L, rocker - 0.18 * FD],
    [rearX + 0.001 * L, beltY + 0.6 * FD],
    [rearX, beltY + 0.55 * FD],
    [rearX + 0.002 * L, beltY + 0.26 * FD],
    [rearX + 0.012 * L, beltY + 0.04 * FD],
    [rearX + 0.028 * L, beltY - 0.16 * GH],
    [lerp(rearX, rgX, 0.34), beltY - 0.42 * GH],
    [lerp(rearX, rgX, 0.66), beltY - 0.74 * GH],
    [lerp(rearX, rgX, 0.9), beltY - 0.945 * GH],
    [rgX, roofY + 0.015 * GH],
    [lerp(rgX, rfX, 0.3), roofY],
    [lerp(rgX, rfX, 0.7), roofY],
    [rfX, roofY + 0.02 * GH],
    [lerp(rfX, cwX, 0.3), beltY - 0.8 * GH],
    [lerp(rfX, cwX, 0.68), beltY - 0.36 * GH],
    [cwX, beltY - 0.02 * GH],
    [lerp(cwX, frontX, 0.35), hoodY],
    [lerp(cwX, frontX, 0.72), hoodY + 0.02 * GH],
    [frontX - 0.055 * L, hoodY + 0.1 * GH],
    [frontX - 0.016 * L, noseY],
    [frontX - 0.002 * L, noseY + 0.18 * FD],
    [frontX, beltY + 0.78 * FD],
    [frontX - 0.006 * L, rocker - 0.18 * FD],
    [frontX - 0.028 * L, rocker],
  ]

  const glass: Pt[] = [
    [lerp(rearX, rgX, 0.3), gBotY],
    [lerp(rearX, rgX, 0.55), beltY - 0.46 * GH],
    [lerp(rearX, rgX, 0.8), beltY - 0.78 * GH],
    [lerp(rearX, rgX, 0.95), beltY - 0.86 * GH],
    [rgX + 0.03 * L, beltY - 0.885 * GH],
    [lerp(rgX, rfX, 0.5), beltY - 0.9 * GH],
    [rfX - 0.02 * L, beltY - 0.885 * GH],
    [lerp(rfX, cwX, 0.24), beltY - 0.86 * GH],
    [lerp(rfX, cwX, 0.54), beltY - 0.44 * GH],
    [lerp(rfX, cwX, 0.85), beltY - 0.12 * GH],
    [cwX - 0.022 * L, gBotY],
    [lerp(rearX, cwX, 0.66), gBotY],
    [lerp(rearX, cwX, 0.46), gBotY],
  ]

  return {
    rearX,
    frontX,
    rearWheel,
    frontWheel,
    wheelR,
    archR,
    rocker,
    beltY,
    roofY,
    outline,
    glass,
    belt: [
      [rearX + 0.03 * L, beltY + 0.015 * H],
      [lerp(rearX, cwX, 0.45), beltY + 0.005 * H],
      [cwX, beltY + 0.025 * H],
    ],
    lower: [
      [rearWheel - wheelR * 0.4, rocker - 0.075 * H],
      [lerp(rearWheel, frontWheel, 0.5), rocker - 0.095 * H],
      [frontWheel + wheelR * 0.4, rocker - 0.07 * H],
    ],
    bPillar,
    door: [bPillar + 5, cwX - 0.035 * L],
    headlight: [
      [frontX - 0.088 * L, noseY + 0.14 * FD],
      [frontX - 0.024 * L, noseY + 0.08 * FD],
      [frontX - 0.018 * L, noseY + 0.2 * FD],
      [frontX - 0.084 * L, noseY + 0.24 * FD],
    ],
    taillight: [
      [rearX + 0.004 * L, beltY + 0.08 * FD],
      [rearX + 0.04 * L, beltY + 0.11 * FD],
      [rearX + 0.037 * L, beltY + 0.28 * FD],
      [rearX + 0.002 * L, beltY + 0.25 * FD],
    ],
    mirror: [
      [cwX - 0.004 * L, beltY - 0.035 * H],
      [cwX + 0.05 * L, beltY - 0.06 * H],
      [cwX + 0.054 * L, beltY + 0.012 * H],
      [cwX + 0.002 * L, beltY + 0.022 * H],
    ],
    paint: p.paint,
  }
}

export const CAR_SPECS: Record<string, CarSpec> = {
  creta: buildSpec({
    lengthMm: 4330,
    heightMm: 1635,
    wheelbaseMm: 2610,
    wheelDiaMm: 690,
    clearanceMm: 190,
    beltRatio: 0.655,
    roofRear: 0.235,
    roofFront: 0.565,
    cowl: 0.72,
    frontBias: 0.54,
    noseDrop: 0.1,
    paint: {
      body: ['#F2F5F8', '#D2DAE2', '#98A5B2'],
      glass: ['#2E3C4A', '#151F29'],
      lamp: '#EAF2FF',
    },
  }),

  stargazer: buildSpec({
    lengthMm: 4460,
    heightMm: 1695,
    wheelbaseMm: 2780,
    wheelDiaMm: 680,
    clearanceMm: 185,
    beltRatio: 0.6,
    roofRear: 0.17,
    roofFront: 0.6,
    cowl: 0.765,
    frontBias: 0.54,
    noseDrop: 0.13,
    paint: {
      body: ['#A3ACB7', '#7C8794', '#505965'],
      glass: ['#2A3641', '#131B23'],
      lamp: '#F2F6FF',
    },
  }),

  'santa-fe': buildSpec({
    lengthMm: 4830,
    heightMm: 1720,
    wheelbaseMm: 2815,
    wheelDiaMm: 740,
    clearanceMm: 200,
    beltRatio: 0.66,
    roofRear: 0.23,
    roofFront: 0.55,
    cowl: 0.725,
    frontBias: 0.54,
    noseDrop: 0.09,
    paint: {
      body: ['#48584F', '#2E3B34', '#18211C'],
      glass: ['#1E282E', '#0E151A'],
      lamp: '#EDF4FF',
    },
  }),

  palisade: buildSpec({
    lengthMm: 5000,
    heightMm: 1750,
    wheelbaseMm: 2900,
    wheelDiaMm: 750,
    clearanceMm: 203,
    beltRatio: 0.665,
    roofRear: 0.225,
    roofFront: 0.555,
    cowl: 0.735,
    frontBias: 0.54,
    noseDrop: 0.08,
    paint: {
      body: ['#2A333E', '#1A222C', '#0C1118'],
      glass: ['#1A232D', '#0B1116'],
      lamp: '#F4F8FF',
    },
  }),

  'kona-electric': buildSpec({
    lengthMm: 4355,
    heightMm: 1580,
    wheelbaseMm: 2660,
    wheelDiaMm: 690,
    clearanceMm: 170,
    beltRatio: 0.65,
    roofRear: 0.27,
    roofFront: 0.56,
    cowl: 0.715,
    frontBias: 0.55,
    noseDrop: 0.14,
    paint: {
      body: ['#6C93AC', '#456C83', '#284457'],
      glass: ['#202C36', '#101820'],
      lamp: '#E6F1FF',
    },
  }),

  'ioniq-5': buildSpec({
    lengthMm: 4635,
    heightMm: 1605,
    wheelbaseMm: 3000,
    wheelDiaMm: 760,
    clearanceMm: 160,
    beltRatio: 0.66,
    roofRear: 0.3,
    roofFront: 0.6,
    cowl: 0.775,
    frontBias: 0.5,
    noseDrop: 0.12,
    paint: {
      body: ['#CDD3D7', '#A7AEB4', '#767E86'],
      glass: ['#242E36', '#11181E'],
      lamp: '#E9F4FF',
    },
  }),
}

/** Used wherever a vehicle sits inside a dark cinematic plate. */
export const CINEMATIC_PAINT: Paint = {
  body: ['#4A5867', '#2B3541', '#141A22'],
  glass: ['#1E2833', '#0B1016'],
  lamp: '#DCEBFF',
}

/** For a vehicle sitting on an off-white studio plate. */
export const STUDIO_PAINT: Paint = {
  body: ['#5E6C7A', '#3A4652', '#1F2831'],
  glass: ['#26313B', '#131A21'],
  lamp: '#F0F6FF',
}
