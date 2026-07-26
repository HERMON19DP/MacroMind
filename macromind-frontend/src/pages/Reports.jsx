import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { TrendingUp, Award, Flame, Beef } from 'lucide-react'
import Topbar from '../components/Topbar'

const calorieData = [
  { day: 'Mon', cal: 1820, goal: 2000 },
  { day: 'Tue', cal: 2100, goal: 2000 },
  { day: 'Wed', cal: 1750, goal: 2000 },
  { day: 'Thu', cal: 1900, goal: 2000 },
  { day: 'Fri', cal: 879,  goal: 2000 },
  { day: 'Sat', cal: 0,    goal: 2000 },
  { day: 'Sun', cal: 0,    goal: 2000 },
]

const proteinData = [
  { day: 'Mon', val: 95 }, { day: 'Tue', val: 110 }, { day: 'Wed', val: 88 },
  { day: 'Thu', val: 102 }, { day: 'Fri', val: 48 }, { day: 'Sat', val: 0 }, { day: 'Sun', val: 0 },
]

const weightData = [
  { day: 'Mon', val: 79.2 }, { day: 'Tue', val: 79.0 }, { day: 'Wed', val: 78.8 },
  { day: 'Thu', val: 78.9 }, { day: 'Fri', val: 78.5 },
]

const tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm px-3 py-2 text-[12px]">
      <p className="text-gray-400 mb-0.5">{label}</p>
      <p className="font-semibold text-gray-900">{payload[0].value}</p>
    </div>
  )
}

export default function Reports() {
  const daysLogged = calorieData.filter(d => d.cal > 0).length
  const avgCal = Math.round(calorieData.filter(d => d.cal > 0).reduce((s, d) => s + d.cal, 0) / daysLogged)
  const avgProtein = Math.round(proteinData.filter(d => d.val > 0).reduce((s, d) => s + d.val, 0) / daysLogged)
  const consistency = Math.round((daysLogged / 7) * 100)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar title="Weekly Report" subtitle="Jun 3 – Jun 9, 2025" />

      <div className="flex-1 overflow-y-auto p-5">
        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Avg calories', value: avgCal, unit: 'kcal/day', icon: Flame, color: 'text-brand-600' },
            { label: 'Avg protein',  value: avgProtein, unit: 'g/day', icon: Beef, color: 'text-violet-600' },
            { label: 'Days logged',  value: daysLogged, unit: '/ 7 days', icon: TrendingUp, color: 'text-blue-600' },
            { label: 'Consistency',  value: `${consistency}%`, unit: 'this week', icon: Award, color: 'text-amber-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">{s.label}</p>
                <s.icon size={14} className={s.color} />
              </div>
              <p className={`text-[22px] font-semibold ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{s.unit}</p>
            </div>
          ))}
        </div>

        {/* Consistency score */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5 flex items-center gap-4">
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#f3f4f6" strokeWidth="8" />
              <circle
                cx="40" cy="40" r="34" fill="none"
                stroke="#1D9E75" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 34}`}
                strokeDashoffset={`${2 * Math.PI * 34 * (1 - consistency / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[16px] font-semibold text-gray-900">{consistency}%</span>
            </div>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-gray-800 mb-1">Consistency score</p>
            <p className="text-[12.5px] text-gray-500 leading-relaxed">
              You logged meals on {daysLogged} out of 7 days this week. Keep going — consistent tracking leads to better results.
            </p>
          </div>
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Calorie bar chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-[13px] font-semibold text-gray-800 mb-4">Daily calories</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={calorieData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={35} />
                <Tooltip content={tip} />
                <Bar dataKey="cal" radius={[4, 4, 0, 0]}>
                  {calorieData.map((entry, i) => (
                    <Cell key={i} fill={entry.cal > entry.goal ? '#f87171' : entry.cal === 0 ? '#e5e7eb' : '#1D9E75'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Protein line chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-[13px] font-semibold text-gray-800 mb-4">Daily protein</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={proteinData.filter(d => d.val > 0)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={tip} />
                <Line type="monotone" dataKey="val" stroke="#7c3aed" strokeWidth={2}
                  dot={{ r: 3, fill: '#7c3aed', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#7c3aed', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Weight trend */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-[13px] font-semibold text-gray-800 mb-4">Weight trend</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[78, 80]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={35} />
                <Tooltip content={tip} />
                <Line type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={2}
                  dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: '#3b82f6', strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Macro split */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-[13px] font-semibold text-gray-800 mb-4">Avg macro split</p>
            <div className="space-y-3 mt-2">
              {[
                { label: 'Carbs',   val: 52, color: 'bg-blue-400',   pct: 52 },
                { label: 'Protein', val: 28, color: 'bg-violet-400', pct: 28 },
                { label: 'Fat',     val: 20, color: 'bg-amber-400',  pct: 20 },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="text-gray-600 font-medium">{m.label}</span>
                    <span className="text-gray-500">{m.val}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-4 text-center">Based on 5 days of logged meals</p>
          </div>
        </div>
      </div>
    </div>
  )
}
