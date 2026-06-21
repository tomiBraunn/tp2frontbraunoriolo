export function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

export function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  if (end - start >= 360) return `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy - 0.01}`
  const startP = polarToCartesian(cx, cy, r, start)
  const endP = polarToCartesian(cx, cy, r, end)
  const largeArc = end - start > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${startP.x} ${startP.y} A ${r} ${r} 0 ${largeArc} 1 ${endP.x} ${endP.y} Z`
}
