import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm px-3 py-2">
        <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
        <p className="text-[13px] font-semibold text-gray-900">{payload[0].value} kg</p>
      </div>
    )
  }
  return null
}

export default function WeightChart({ data, targetWeight }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={['dataMin - 1', 'dataMax + 1']}
          tick={{ fontSize: 11, fill: '#9ca3af' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        {targetWeight && (
          <ReferenceLine
            y={targetWeight}
            stroke="#1D9E75"
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{ value: `Goal: ${targetWeight}kg`, position: 'insideTopRight', fontSize: 10, fill: '#0F6E56' }}
          />
        )}
        <Line
          type="monotone"
          dataKey="weight"
          stroke="#1D9E75"
          strokeWidth={2}
          dot={{ r: 3, fill: '#1D9E75', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#1D9E75', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
