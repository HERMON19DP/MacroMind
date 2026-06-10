import { useState } from 'react'
import { TrendingDown, Target, Calendar, Plus } from 'lucide-react'
import Topbar from '../components/Topbar'
import WeightChart from '../components/WeightChart'
import { useAuth } from '../context/AuthContext'

const allData = {
  week: [
    { date: 'Jun 3', weight: 79.2 }, { date: 'Jun 4', weight: 79.0 },
    { date: 'Jun 5', weight: 78.8 }, { date: 'Jun 6', weight: 78.9 },
    { date: 'Jun 7', weight: 78.5 }, { date: 'Jun 8', weight: 78.3 },
    { date: 'Jun 9', weight: 78.1 },
  ],
  month: [
    { date: 'May 12', weight: 80.1 }, { date: 'May 15', weight: 79.9 },
    { date: 'May 18', weight: 79.6 }, { date: 'May 21', weight: 79.4 },
    { date: 'May 24', weight: 79.2 }, { date: 'May 27', weight: 79.0 },
    { date: 'May 30', weight: 78.8 }, { date: 'Jun 3', weight: 79.2 },
    { date: 'Jun 6', weight: 78.9 }, { date: 'Jun 9', weight: 78.1 },
  ],
  '3months': [
    { date: 'Mar 1', weight: 82.5 }, { date: 'Mar 15', weight: 82.0 },
    { date: 'Apr 1', weight: 81.2 }, { date: 'Apr 15', weight: 80.8 },
    { date: 'May 1', weight: 80.4 }, { date: 'May 15', weight: 79.9 },
    { date: 'Jun 1', weight: 79.2 }, { date: 'Jun 9', weight: 78.1 },
  ],
}

const logs = [
  { date: 'Jun 9, 2025', weight: 78.1 },
  { date: 'Jun 8, 2025', weight: 78.3 },
  { date: 'Jun 7, 2025', weight: 78.5 },
  { date: 'Jun 6, 2025', weight: 78.9 },
  { date: 'Jun 5, 2025', weight: 78.8 },
  { date: 'Jun 3, 2025', weight: 79.2 },
  { date: 'May 30, 2025', weight: 79.8 },
]

export default function Weight() {
  const { user } = useAuth()
  const [range, setRange] = useState('month')
  const [showAdd, setShowAdd] = useState(false)
  const [newWeight, setNewWeight] = useState('')

  const current = 78.1
  const target = user?.targetWeight || 74
  const change = -(82.5 - current).toFixed(1)
  const toGo = (current - target).toFixed(1)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar title="Weight Tracker" subtitle="Monitor your progress over time" />

      <div className="flex-1 overflow-y-auto p-5">
        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Current weight', value: `${current} kg`, icon: TrendingDown, sub: 'As of today', color: 'text-brand-600' },
            { label: 'Target weight',  value: `${target} kg`,  icon: Target,       sub: 'Your goal',   color: 'text-blue-600' },
            { label: 'Total lost',     value: `4.4 kg`,        icon: TrendingDown, sub: 'Since start',  color: 'text-green-600' },
            { label: 'To goal',        value: `${toGo} kg`,    icon: Calendar,     sub: 'Remaining',   color: 'text-amber-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">{s.label}</p>
                <s.icon size={14} className={s.color} />
              </div>
              <p className={`text-[22px] font-semibold ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] font-semibold text-gray-800">Weight progress</p>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {['week', 'month', '3months'].map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1 rounded-md text-[11.5px] font-medium transition-colors ${
                    range === r ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {r === '3months' ? '3 months' : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <WeightChart data={allData[range]} targetWeight={target} />
        </div>

        {/* Log list + add */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="text-[13px] font-semibold text-gray-800">Weight log</p>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="flex items-center gap-1.5 text-[12px] text-brand-600 font-medium hover:text-brand-700"
            >
              <Plus size={13} /> Log weight
            </button>
          </div>

          {showAdd && (
            <div className="px-4 py-3 bg-brand-50 border-b border-brand-100 flex items-center gap-3">
              <input
                type="number"
                step="0.1"
                value={newWeight}
                onChange={e => setNewWeight(e.target.value)}
                placeholder="Enter weight in kg"
                className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-brand-400"
              />
              <button className="bg-brand-400 text-white text-[12px] font-medium px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors">
                Save
              </button>
              <button onClick={() => setShowAdd(false)} className="text-[12px] text-gray-400 hover:text-gray-600">
                Cancel
              </button>
            </div>
          )}

          {logs.map((log, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50 last:border-0">
              <span className="text-[12.5px] text-gray-600">{log.date}</span>
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-semibold text-gray-900">{log.weight} kg</span>
                {i > 0 && (
                  <span className={`text-[11px] font-medium ${
                    log.weight > logs[i - 1].weight ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {log.weight > logs[i - 1].weight ? '▲' : '▼'}
                    {Math.abs(log.weight - logs[i - 1].weight).toFixed(1)} kg
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
