import { useState } from 'react'
import { ChevronDown, Plus, Pencil, Trash2 } from 'lucide-react'

export default function MealCard({ title, icon: Icon, items = [], totalCal = 0 }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} className="text-gray-400" />}
          <span className="text-[13px] font-medium text-gray-700">{title}</span>
          <span className="text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {items.length} items
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12.5px] font-semibold text-brand-600">{totalCal} kcal</span>
          <ChevronDown
            size={14}
            className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-50">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 group"
            >
              <div>
                <p className="text-[13px] font-medium text-gray-800">{item.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Carbs {item.carbs}g · Protein {item.protein}g · Fat {item.fat}g
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[12px] font-semibold text-gray-700">{item.calories} kcal</span>
                <div className="hidden group-hover:flex items-center gap-1">
                  <button className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                    <Pencil size={11} />
                  </button>
                  <button className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button className="w-full flex items-center gap-2 px-4 py-2.5 text-[12px] text-brand-600 hover:bg-brand-50 transition-colors">
            <Plus size={13} />
            Add food to {title.toLowerCase()}
          </button>
        </div>
      )}
    </div>
  )
}
