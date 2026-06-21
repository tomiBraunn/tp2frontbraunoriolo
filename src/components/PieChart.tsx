import type { PollOption } from '@/types'
import { describeArc } from '@/lib/chartUtils'

const COLORS = ['#111111', '#8B5CF6', '#16A34A', '#D97706', '#DC2626', '#6B7280', '#111827', '#E5E7EB']

export default function PieChart({ options, totalVotes }: { options: PollOption[]; totalVotes: number }) {
  if (totalVotes === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-paper-muted">
        <p className="font-[family-name:var(--font-mono)] text-sm">Sin votos todavía</p>
        <p className="text-xs mt-1">Sé el primero en votar</p>
      </div>
    )
  }

  const sorted = [...options].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))

  const arcs = sorted.reduce<
    { cumulative: number; items: Array<PollOption & { percentage: number; startAngle: number; endAngle: number; color: string }> }
  >(
    (acc, opt, i) => {
      const value = opt.vote_count || 0
      const percentage = (value / totalVotes) * 100
      const startAngle = (acc.cumulative / totalVotes) * 360
      const cumulative = acc.cumulative + value
      const endAngle = (cumulative / totalVotes) * 360
      return {
        cumulative,
        items: [...acc.items, { ...opt, percentage, startAngle, endAngle, color: COLORS[i % COLORS.length] }],
      }
    },
    { cumulative: 0, items: [] }
  ).items

  const radius = 110
  const center = 130
  const svgSize = center * 2

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} className="shrink-0">
        {arcs.map((arc) => (
          <path key={arc.id} d={describeArc(center, center, radius, arc.startAngle, arc.endAngle)} fill={arc.color} stroke="white" strokeWidth="2" />
        ))}
        <circle cx={center} cy={center} r={radius * 0.5} fill="white" />
        <text x={center} y={center - 4} textAnchor="middle" className="font-[family-name:var(--font-mono)]" fill="#111827" fontSize="18" fontWeight="700">{totalVotes}</text>
        <text x={center} y={center + 14} textAnchor="middle" fill="#6B7280" fontSize="11">votos</text>
      </svg>
      <div className="flex-1 w-full space-y-3">
        {arcs.map((arc) => (
          <div key={arc.id} className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 shrink-0" style={{ backgroundColor: arc.color }} />
            <span className="flex-1 text-sm text-paper-text truncate">{arc.option_text}</span>
            <div className="flex items-center gap-3 shrink-0">
              <div className="w-16 bg-paper-border h-1.5">
                <div className="h-full transition-all duration-500" style={{ width: `${Math.max(arc.percentage, 1)}%`, backgroundColor: arc.color }} />
              </div>
              <span className="font-[family-name:var(--font-mono)] text-xs text-paper-muted w-10 text-right">{Math.round(arc.percentage)}%</span>
              <span className="font-[family-name:var(--font-mono)] text-xs text-paper-muted w-6 text-right">{arc.vote_count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
