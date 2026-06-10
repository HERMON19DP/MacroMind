import { useState } from 'react'
import { Droplets, Plus, Minus } from 'lucide-react'
import Topbar from '../components/Topbar'

const GOAL_ML = 3000
const quickAmounts = [150, 200, 250, 350, 500]

const logs = [
  { time: '8:00 AM', amount: 250 },
  { time: '9:30 AM', amount: 200 },
  { time: '11:00 AM', amount: 350 },
  { time: '1:00 PM', amount: 250 },
  { time: '3:00 PM', amount: 200 },
]

export default function Water() {
  const [total, setTotal] = useState(1250)

  const pct = Math.min((total / GOAL_ML) * 100, 100)
  const cups = Math.round(total / 250)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar title="Water Intake" subtitle="Stay hydrated throughout the day" />

      <div className="flex-1 overflow-y-auto p-5">
        <div className="max-w-2xl mx-auto">
          {/* Big circle progress */}
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-5 flex flex-col items-center">
            <div className="relative w-48 h-48 mb-6">
              <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                <circle cx="80" cy="80" r="68" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                <circle
                  cx="80" cy="80" r="68" fill="none"
                  stroke="#1D9E75" strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 68}`}
                  strokeDashoffset={`${2 * Math.PI * 68 * (1 - pct / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Droplets size={22} className="text-brand-400 mb-1" />
                <p className="text-[28px] font-semibold text-gray-900">{(total / 1000).toFixed(2)}L</p>
                <p className="text-[12px] text-gray-400">of {GOAL_ML / 1000}L goal</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 w-full text-center border-t border-gray-100 pt-5">
              <div>
                <p className="text-[20px] font-semibold text-gray-900">{Math.round(pct)}%</p>
                <p className="text-[11px] text-gray-400">completed</p>
              </div>
              <div>
                <p className="text-[20px] font-semibold text-gray-900">{cups}</p>
                <p className="text-[11px] text-gray-400">cups (250ml)</p>
              </div>
              <div>
                <p className="text-[20px] font-semibold text-blue-600">{((GOAL_ML - total) / 1000).toFixed(2)}L</p>
                <p className="text-[11px] text-gray-400">remaining</p>
              </div>
            </div>
          </div>

          {/* Quick add */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
            <p className="text-[13px] font-semibold text-gray-800 mb-3">Quick add</p>
            <div className="flex gap-2 flex-wrap">
              {quickAmounts.map(amt => (
                <button
                  key={amt}
                  onClick={() => setTotal(t => Math.min(t + amt, GOAL_ML))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-50 text-brand-600 text-[12.5px] font-medium hover:bg-brand-100 transition-colors border border-brand-100"
                >
                  <Plus size={12} /> {amt} ml
                </button>
              ))}
              <button
                onClick={() => setTotal(t => Math.max(t - 250, 0))}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-500 text-[12.5px] font-medium hover:bg-red-100 transition-colors border border-red-100"
              >
                <Minus size={12} /> Undo
              </button>
            </div>
          </div>

          {/* Today's log */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-[13px] font-semibold text-gray-800">Today's log</p>
            </div>
            {logs.map((l, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                    <Droplets size={11} className="text-blue-400" />
                  </div>
                  <span className="text-[12.5px] text-gray-600">{l.time}</span>
                </div>
                <span className="text-[12.5px] font-semibold text-gray-800">{l.amount} ml</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
