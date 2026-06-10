export default function MacroCard({ label, value, unit, goal, color = 'brand', icon: Icon }) {
  const pct = goal ? Math.min(Math.round((parseFloat(value) / goal) * 100), 100) : null

  const colorMap = {
    brand: { bar: 'bg-brand-400', text: 'text-brand-600', bg: 'bg-brand-50' },
    blue:  { bar: 'bg-blue-400',  text: 'text-blue-600',  bg: 'bg-blue-50' },
    violet:{ bar: 'bg-violet-400',text: 'text-violet-600',bg: 'bg-violet-50' },
    amber: { bar: 'bg-amber-400', text: 'text-amber-600', bg: 'bg-amber-50' },
  }
  const c = colorMap[color] || colorMap.brand

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wide">{label}</span>
        {Icon && (
          <div className={`w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center`}>
            <Icon size={13} className={c.text} />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-semibold ${c.text}`}>{value}</span>
        <span className="text-[12px] text-gray-400">{unit}</span>
        {goal && <span className="text-[11px] text-gray-300 ml-1">/ {goal}{unit}</span>}
      </div>
      {pct !== null && (
        <div>
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>{pct}% of goal</span>
            <span>{goal - parseFloat(value)} {unit} left</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${c.bar} transition-all`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}
