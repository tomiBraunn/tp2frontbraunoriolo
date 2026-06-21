import { describe, it, expect } from 'vitest'
import { polarToCartesian, describeArc } from '@/lib/chartUtils'

describe('polarToCartesian', () => {
  const cx = 130
  const cy = 130
  const r = 110

  it('converts 0 degrees to top of circle (cx, cy - r)', () => {
    const result = polarToCartesian(cx, cy, r, 0)
    expect(result.x).toBeCloseTo(cx, 5)
    expect(result.y).toBeCloseTo(cy - r, 5)
  })

  it('converts 90 degrees to right of circle (cx + r, cy)', () => {
    const result = polarToCartesian(cx, cy, r, 90)
    expect(result.x).toBeCloseTo(cx + r, 5)
    expect(result.y).toBeCloseTo(cy, 5)
  })

  it('converts 180 degrees to bottom of circle (cx, cy + r)', () => {
    const result = polarToCartesian(cx, cy, r, 180)
    expect(result.x).toBeCloseTo(cx, 5)
    expect(result.y).toBeCloseTo(cy + r, 5)
  })

  it('converts 270 degrees to left of circle (cx - r, cy)', () => {
    const result = polarToCartesian(cx, cy, r, 270)
    expect(result.x).toBeCloseTo(cx - r, 5)
    expect(result.y).toBeCloseTo(cy, 5)
  })

  it('returns correct values for a 45 degree angle', () => {
    const result = polarToCartesian(0, 0, Math.SQRT2, 45)
    expect(result.x).toBeCloseTo(1, 5)
    expect(result.y).toBeCloseTo(-1, 5)
  })
})

describe('describeArc', () => {
  const cx = 130
  const cy = 130
  const r = 110

  it('returns a full-circle arc path when arc spans 360 degrees', () => {
    const path = describeArc(cx, cy, r, 0, 360)
    expect(path).toContain(`M ${cx - r} ${cy}`)
    expect(path).toContain(`A ${r} ${r} 0 1 1`)
  })

  it('returns a wedge-shaped path for an arc less than 180 degrees', () => {
    const path = describeArc(cx, cy, r, 0, 90)
    expect(path).toContain(`M ${cx} ${cy}`)
    expect(path).toContain(`L `)
    expect(path).toContain(`A ${r} ${r} 0 0 1`)
    expect(path).toContain('Z')
  })

  it('uses largeArc flag for arcs greater than 180 degrees', () => {
    const path = describeArc(cx, cy, r, 0, 270)
    expect(path).toContain(`A ${r} ${r} 0 1 1`)
  })

  it('handles arc that completes exactly 360 due to span overflow', () => {
    const path = describeArc(cx, cy, r, 0, 400)
    expect(path).toContain(`M ${cx - r} ${cy}`)
    expect(path).toContain(`A ${r} ${r} 0 1 1`)
  })
})
