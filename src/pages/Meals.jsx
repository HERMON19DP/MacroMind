import { useState } from 'react'
import { ChevronLeft, ChevronRight, Coffee, Sun, Moon, Apple, Plus } from 'lucide-react'
import Topbar from '../components/Topbar'
import MealCard from '../components/MealCard'

const mealData = {
  breakfast: {
    icon: Coffee,
    items: [
      { name: 'Idli (2 pieces)', calories: 150, carbs: 30, protein: 4, fat: 0.5 },
      { name: 'Sambar (1 cup)', calories: 95, carbs: 12, protein: 5, fat: 2 },
      { name: 'Filter coffee', calories: 65, carbs: 8, protein: 2, fat: 3 },
    ],
    total: 310,
  },
  lunch: {
    icon: Sun,
    items: [
      { name: 'Sambar rice (1 plate)', calories: 380, carbs: 68, protein: 12, fat: 8 },
      { name: 'Papad (2 pieces)', calories: 100, carbs: 14, protein: 3, fat: 4 },
    ],
    total: 480,
  },
  snacks: {
    icon: Apple,
    items: [
      { name: 'Banana (1 medium)', calories: 89, carbs: 23, protein: 1, fat: 0.3 },
    ],
    total: 89,
  },
  dinner: { icon: Moon, items: [], total: 0 },
}

export default function Meals() {
  const [offset, setOffset] = useState(0)

  const getDate = (off) => {
    const d = new Date()
    d.setDate(d.getDate() + off)
    return d.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  const totalCal = Object.values(mealData).reduce((s, m) => s + m.total, 0)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar title="Meal Log" subtitle="All meals for the day" />

      <div className="flex-1 overflow-y-auto p-5">
        {/* Date nav */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3 mb-5">
          <button
            onClick={() => setOffset(o => o - 1)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="text-center">
            <p className="text-[13px] font-semibold text-gray-800">{getDate(offset)}</p>
            {offset === 0 && <p className="text-[11px] text-brand-500">Today</p>}
          </div>
          <button
            onClick={() => setOffset(o => Math.min(o + 1, 0))}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors disabled:opacity-30"
            disabled={offset === 0}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Daily summary strip */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] text-gray-500 font-medium">Daily total</span>
            <span className="text-[14px] font-semibold text-brand-600">{totalCal} / 2000 kcal</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-brand-400 rounded-full"
              style={{ width: `${Math.min((totalCal / 2000) * 100, 100)}%` }}
            />
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: 'Breakfast', cal: mealData.breakfast.total, color: 'bg-amber-100 text-amber-700' },
              { label: 'Lunch',     cal: mealData.lunch.total,     color: 'bg-blue-100 text-blue-700' },
              { label: 'Snacks',    cal: mealData.snacks.total,    color: 'bg-green-100 text-green-700' },
              { label: 'Dinner',    cal: mealData.dinner.total,    color: 'bg-purple-100 text-purple-700' },
            ].map(m => (
              <div key={m.label} className={`rounded-lg px-2 py-1.5 ${m.color}`}>
                <p className="text-[13px] font-semibold">{m.cal}</p>
                <p className="text-[10px] opacity-80">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Meal cards */}
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(mealData).map(([key, val]) => (
            <MealCard
              key={key}
              title={key.charAt(0).toUpperCase() + key.slice(1)}
              icon={val.icon}
              items={val.items}
              totalCal={val.total}
            />
          ))}
        </div>

        {/* Add meal button */}
        <button className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-[13px] text-gray-400 hover:border-brand-300 hover:text-brand-500 transition-colors">
          <Plus size={15} />
          Add custom meal entry
        </button>
      </div>
    </div>
  )
}
