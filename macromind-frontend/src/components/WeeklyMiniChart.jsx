// macromind-frontend/src/components/WeeklyMiniChart.jsx
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm px-3 py-2">
      <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
      <p className="text-[13px] font-semibold text-gray-900">{payload[0].value} kcal</p>
    </div>
  )
}

export default function WeeklyMiniChart({ days, selectedDay, calorieGoal }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm h-full">
      <p className="text-[13px] font-semibold text-gray-800 mb-3">This week's calories</p>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={days} barSize={22}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
          <Bar dataKey="calories" radius={[4, 4, 0, 0]}>
            {days.map((d, i) => {
              const isSelected = d.day === selectedDay
              const overGoal = calorieGoal && d.calories > calorieGoal
              let fill = '#e5e7eb' // empty day
              if (d.calories > 0) {
                if (overGoal) fill = isSelected ? '#ef4444' : '#fca5a5'
                else fill = isSelected ? '#0F6E56' : '#5DCAA5'
              }
              return <Cell key={i} fill={fill} />
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}