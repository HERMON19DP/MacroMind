import { useState, useEffect, useCallback } from 'react'
import { TrendingDown, Target, Calendar, Plus } from 'lucide-react'
import Topbar from '../components/Topbar'
import WeightChart from '../components/WeightChart'
import { getWeightData, logWeight } from '../api/weightApi'
import { usePageTitle } from '../hooks/usePageTitle'

export default function Weight() {
  usePageTitle('Weight Tracker')
  const [range, setRange] = useState('month')
  const [data, setData] = useState({ chart: [], logs: [], summary: {} })
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newWeight, setNewWeight] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getWeightData(range)
      setData(res.data)
    } catch (error) {
      console.error('Failed to load weight data:', error)
    } finally {
      setLoading(false)
    }
  }, [range])

  useEffect(() => { load() }, [load])

  const { current, target, totalLost, toGoal } = data.summary || {}
  const fmt = v => (v === null || v === undefined ? '--' : `${v} kg`)

  const handleSaveWeight = async () => {
    const value = parseFloat(newWeight)
    if (!value || saving) return

    try {
      setSaving(true)
      await logWeight(value)
      setNewWeight('')
      setShowAdd(false)
      await load()
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Failed to log weight')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar title="Weight Tracker" subtitle="Monitor your progress over time" />

      <div className="flex-1 overflow-y-auto p-5">
        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: 'Current weight', value: fmt(current), icon: TrendingDown, sub: 'As of today', color: 'text-brand-600' },
            { label: 'Target weight',  value: fmt(target),  icon: Target,       sub: 'Your goal',   color: 'text-blue-600' },
            { label: 'Total lost',     value: fmt(totalLost), icon: TrendingDown, sub: 'Since start', color: 'text-green-600' },
            { label: 'To goal',        value: fmt(toGoal),    icon: Calendar,     sub: 'Remaining',   color: 'text-amber-600' },
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

          {loading ? (
            <div className="h-[220px] flex items-center justify-center text-[12px] text-gray-400">Loading...</div>
          ) : data.chart.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-[12px] text-gray-400">
              No weight logs yet for this range
            </div>
          ) : (
            <WeightChart data={data.chart} targetWeight={target} />
          )}
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
              <button
                onClick={handleSaveWeight}
                disabled={saving || !newWeight}
                className="bg-brand-400 text-white text-[12px] font-medium px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-40"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setShowAdd(false)} className="text-[12px] text-gray-400 hover:text-gray-600">
                Cancel
              </button>
            </div>
          )}

          {data.logs.length === 0 ? (
            <div className="px-4 py-6 text-center text-[12px] text-gray-400">No weight logged yet</div>
          ) : (
            data.logs.map((log, i) => (
              <div key={log.id} className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-[12.5px] text-gray-600">{log.date}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-semibold text-gray-900">{log.weight} kg</span>
                  {i > 0 && (
                    <span className={`text-[11px] font-medium ${
                      log.weight > data.logs[i - 1].weight ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {log.weight > data.logs[i - 1].weight ? '▲' : '▼'}
                      {Math.abs(log.weight - data.logs[i - 1].weight).toFixed(1)} kg
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}