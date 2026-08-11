import { useEffect, useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { TrendingUp, Award, Flame, Beef } from 'lucide-react'
import Topbar from '../components/Topbar'
import { getWeekDashboard } from '../api/dashboardApi'
import { getGoals } from '../api/goalsApi'
import { usePageTitle } from '../hooks/usePageTitle'

const tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm px-3 py-2 text-[12px]">
      <p className="text-gray-400 mb-0.5">{label}</p>
      <p className="font-semibold text-gray-900">{payload[0].value}</p>
    </div>
  )
}

function buildWeekRange() {
  const today = new Date()
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(today.getDate() - i)
    days.push(d)
  }
  return days
}

export default function Reports() {
  usePageTitle('Weekly Report')
  const [weekData, setWeekData] = useState([])
  const [calorieGoal, setCalorieGoal] = useState(2000)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [weekRes, goalsRes] = await Promise.all([
          getWeekDashboard(),
          getGoals(),
        ])

        const byDate = {}
        weekRes.data.forEach((d) => {
          byDate[new Date(d.date).toDateString()] = d
        })

        const days = buildWeekRange()
        const merged = days.map((d) => {
          const entry = byDate[d.toDateString()]
          return {
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            fullDate: d,
            cal: entry ? Number(entry.calories) : 0,
            protein: entry ? Number(entry.protein) : 0,
            carbs: entry ? Number(entry.carbs) : 0,
            fat: entry ? Number(entry.fat) : 0,
          }
        })

        setWeekData(merged)
        setCalorieGoal(goalsRes.data?.calorie_goal || 2000)
      } catch (error) {
        console.error('Failed to load report data:', error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const daysLogged = weekData.filter((d) => d.cal > 0).length
  const avgCal = daysLogged
    ? Math.round(weekData.reduce((s, d) => s + d.cal, 0) / daysLogged)
    : 0
  const avgProtein = daysLogged
    ? Math.round(weekData.reduce((s, d) => s + d.protein, 0) / daysLogged)
    : 0
  const consistency = Math.round((daysLogged / 7) * 100)

  const totals = weekData.reduce(
    (acc, d) => ({
      protein: acc.protein + d.protein,
      carbs: acc.carbs + d.carbs,
      fat: acc.fat + d.fat,
    }),
    { protein: 0, carbs: 0, fat: 0 },
  )

  const proteinCal = totals.protein * 4
  const carbsCal = totals.carbs * 4
  const fatCal = totals.fat * 9
  const totalMacroCal = proteinCal + carbsCal + fatCal

  const macroSplit = totalMacroCal > 0
    ? [
        { label: 'Carbs', color: 'bg-blue-400', pct: Math.round((carbsCal / totalMacroCal) * 100) },
        { label: 'Protein', color: 'bg-violet-400', pct: Math.round((proteinCal / totalMacroCal) * 100) },
        { label: 'Fat', color: 'bg-amber-400', pct: Math.round((fatCal / totalMacroCal) * 100) },
      ]
    : []

  const rangeLabel = weekData.length
    ? `${weekData[0].fullDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekData[6].fullDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
    : ''

  if (loading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Weekly Report" subtitle="Loading..." />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar title="Weekly Report" subtitle={rangeLabel} />

      <div className="flex-1 overflow-y-auto p-5">
        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Avg calories', value: avgCal, unit: 'kcal/day', icon: Flame, color: 'text-brand-600' },
            { label: 'Avg protein', value: avgProtein, unit: 'g/day', icon: Beef, color: 'text-violet-600' },
            { label: 'Days logged', value: daysLogged, unit: '/ 7 days', icon: TrendingUp, color: 'text-blue-600' },
            { label: 'Consistency', value: `${consistency}%`, unit: 'this week', icon: Award, color: 'text-amber-600' },
          ].map((s) => (
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
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Calorie bar chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-[13px] font-semibold text-gray-800 mb-4">Daily calories</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weekData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={35} />
                <Tooltip content={tip} />
                <Bar dataKey="cal" radius={[4, 4, 0, 0]}>
                  {weekData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.cal > calorieGoal ? '#f87171' : entry.cal === 0 ? '#e5e7eb' : '#1D9E75'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Protein line chart */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-[13px] font-semibold text-gray-800 mb-4">Daily protein</p>
            {weekData.some((d) => d.protein > 0) ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={weekData.filter((d) => d.protein > 0)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip content={tip} />
                  <Line
                    type="monotone" dataKey="protein" stroke="#7c3aed" strokeWidth={2}
                    dot={{ r: 3, fill: '#7c3aed', strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: '#7c3aed', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-[12px] text-gray-400">
                No protein data logged this week
              </div>
            )}
          </div>
        </div>

        {/* Macro split */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-[13px] font-semibold text-gray-800 mb-4">Avg macro split</p>
          {macroSplit.length ? (
            <>
              <div className="space-y-3 mt-2">
                {macroSplit.map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="text-gray-600 font-medium">{m.label}</span>
                      <span className="text-gray-500">{m.pct}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-4 text-center">
                Based on {daysLogged} day{daysLogged === 1 ? '' : 's'} of logged meals
              </p>
            </>
          ) : (
            <p className="text-[12px] text-gray-400 text-center py-6">No meals logged this week yet</p>
          )}
        </div>
      </div>
    </div>
  )
}