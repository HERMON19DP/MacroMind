import { motion } from 'framer-motion'
import { Flame, Beef, Wheat, Droplet, Scale, BarChart2 } from 'lucide-react'

const CALLOUTS = [
  { icon: Flame, label: 'Daily progress', top: '8%', left: '-14%' },
  { icon: BarChart2, label: 'Weekly analytics', top: '8%', right: '-14%' },
  { icon: Scale, label: 'Weight trend', bottom: '10%', left: '-16%' },
  { icon: Droplet, label: 'Water tracking', bottom: '10%', right: '-14%' },
]

const MACROS = [
  { key: 'calories', label: 'Calories', value: 1840, goal: 2200, icon: Flame, color: 'text-brand-600', bar: 'bg-brand-400' },
  { key: 'protein', label: 'Protein', value: 112, goal: 140, icon: Beef, color: 'text-violet-600', bar: 'bg-violet-400' },
  { key: 'carbs', label: 'Carbs', value: 198, goal: 260, icon: Wheat, color: 'text-blue-600', bar: 'bg-blue-400' },
  { key: 'fat', label: 'Fat', value: 58, goal: 75, icon: Droplet, color: 'text-amber-600', bar: 'bg-amber-400' },
]

const week = [
  { d: 'Mon', v: 62 }, { d: 'Tue', v: 78 }, { d: 'Wed', v: 55 },
  { d: 'Thu', v: 90 }, { d: 'Fri', v: 71 }, { d: 'Sat', v: 40 }, { d: 'Sun', v: 84 },
]

export default function DashboardShowcase() {
  return (
    <section className="py-24 sm:py-28 bg-gray-50">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-xl mx-auto mb-20">
          <p className="text-[12px] font-semibold text-brand-600 uppercase tracking-wide mb-3">Your dashboard</p>
          <h2 className="text-[32px] sm:text-[38px] font-semibold text-gray-900 tracking-tight leading-tight">
            One screen for calories, macros, weight, and water
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="relative max-w-2xl mx-auto"
        >
          {CALLOUTS.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
              className="hidden md:flex absolute z-10 items-center gap-1.5 bg-white rounded-full border border-gray-200 shadow-sm px-3 py-1.5"
              style={{ top: c.top, left: c.left, right: c.right, bottom: c.bottom }}
            >
              <c.icon size={11} className="text-brand-500" />
              <span className="text-[11px] font-medium text-gray-600 whitespace-nowrap">{c.label}</span>
            </motion.div>
          ))}

          <div className="relative z-0 bg-white rounded-2xl border border-gray-100 shadow-xl p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              {MACROS.map((m) => {
                const pct = Math.min(Math.round((m.value / m.goal) * 100), 100)
                return (
                  <div key={m.key} className="bg-gray-50 rounded-xl p-3.5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <m.icon size={12} className={m.color} />
                      <span className="text-[10.5px] text-gray-400 font-medium uppercase tracking-wide">{m.label}</span>
                    </div>
                    <p className={`text-[18px] font-semibold ${m.color} leading-none mb-2`}>{m.value}</p>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${m.bar}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-[11px] text-gray-400 font-medium mb-3">Weekly calories</p>
              <div className="flex items-end gap-2 h-20">
                {week.map((w) => (
                  <div key={w.d} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className="w-full bg-brand-300 rounded-md" style={{ height: `${w.v}%` }} />
                    <span className="text-[9.5px] text-gray-400">{w.d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
