import { useState } from "react";
import { ChevronDown, Plus, Pencil, Trash2 } from "lucide-react";

export default function MealCard({
  title,
  icon: Icon,
  items = [],
  totalCal = 0,
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <Icon size={15} className="text-gray-500" />
            </div>
          )}

          <div className="text-left">
            <p className="text-[13px] font-semibold text-gray-800">{title}</p>

            <p className="text-[11px] text-gray-400">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[17px] font-bold text-brand-600 leading-none">
              {totalCal}
            </p>

            <p className="text-[10px] text-gray-400 mt-1">kcal</p>
          </div>

          <ChevronDown
            size={15}
            className={`text-gray-400 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Body */}
      {open && (
        <div className="border-t border-gray-100">
          {/* Empty state */}
          {items.length === 0 ? (
            <div className="py-8 flex flex-col items-center">
              <p className="text-[12px] text-gray-400">No meals logged</p>

              <button className="mt-3 text-[12px] font-medium text-brand-600 hover:text-brand-700 transition-colors">
                + Add Food
              </button>
            </div>
          ) : (
            <>
              {items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 group"
                >
                  <div>
                    <p className="text-[13px] font-medium text-gray-800">
                      {item.name}
                    </p>

                    <p className="text-[11px] text-gray-400 mt-1">
                      {item.carbs ?? 0}g carbs {" • "}
                      {item.protein ?? 0}g protein {" • "}
                      {item.fat ?? 0}g fat
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-semibold text-gray-700">
                      {item.calories} kcal
                    </span>

                    <div className="hidden group-hover:flex items-center gap-1">
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-colors">
                        <Pencil size={12} />
                      </button>

                      <button className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Footer */}
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[12px] font-medium text-brand-600 hover:bg-brand-50 transition-colors">
                <Plus size={14} />
                Add food
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
