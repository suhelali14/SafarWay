import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
  colorClass?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  colorClass = 'emerald'
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${colorClass}-100`}>
          <Icon className={`w-6 h-6 text-${colorClass}-600`} />
        </div>
        {trend && (
          <div
            className={`flex items-center text-sm ${
              trend.isPositive ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            <span className="font-medium">
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
          </div>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{value}</h3>
      <p className="text-sm text-gray-600">{title}</p>
      {description && (
        <p className="text-xs text-gray-500 mt-2">{description}</p>
      )}
    </div>
  )
} 