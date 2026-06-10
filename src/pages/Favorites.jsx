import { Heart, Plus, Zap } from 'lucide-react'
import Topbar from '../components/Topbar'

const favorites = [
  { name: 'Idli & Sambar', calories: 310, protein: 11, carbs: 52, fat: 4, emoji: '🍚', uses: 24 },
  { name: 'Curd rice', calories: 290, protein: 8, carbs: 55, fat: 6, emoji: '🍛', uses: 18 },
  { name: 'Filter coffee', calories: 65, protein: 2, carbs: 8, fat: 3, emoji: '☕', uses: 42 },
  { name: 'Poha', calories: 250, protein: 5, carbs: 45, fat: 6, emoji: '🌾', uses: 15 },
  { name: 'Protein shake', calories: 180, protein: 30, carbs: 8, fat: 3, emoji: '🥤', uses: 20 },
  { name: 'Boiled eggs (2)', calories: 140, protein: 12, carbs: 1, fat: 10, emoji: '🥚', uses: 31 },
]

export default function Favorites() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar title="Favorites" subtitle="Your frequently logged meals — one click to log" />

      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex justify-between items-center mb-5">
          <p className="text-[12px] text-gray-400">{favorites.length} saved meals</p>
          <button className="flex items-center gap-1.5 text-[12.5px] text-brand-600 font-medium hover:text-brand-700">
            <Plus size={13} /> Add favorite
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {favorites.map((f, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 hover:border-brand-200 transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{f.emoji}</span>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-400">
                  <Heart size={14} />
                </button>
              </div>
              <p className="text-[13px] font-semibold text-gray-800 mb-1">{f.name}</p>
              <p className="text-[11px] text-gray-400 mb-3">
                P {f.protein}g · C {f.carbs}g · F {f.fat}g
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-brand-600">{f.calories} kcal</span>
                <span className="text-[10.5px] text-gray-400">{f.uses}× logged</span>
              </div>
              <button className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-brand-50 text-brand-600 text-[12px] font-medium hover:bg-brand-100 transition-colors border border-brand-100">
                <Zap size={11} /> Log now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
