import { useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";

export default function MealCard({
  title,
  icon: Icon,
  items = [],
  totalCal = 0,
  onDeleteItem,
}) {
  const [open, setOpen] = useState(true);
  const [pendingItem, setPendingItem] = useState(null); // item awaiting confirmation
  const [deleting, setDeleting] = useState(false);

  function requestDelete(item) {
    setPendingItem(item);
  }

  async function confirmDelete() {
    if (!pendingItem || !onDeleteItem) return;
    try {
      setDeleting(true);
      await onDeleteItem(pendingItem.id);
      setPendingItem(null);
    } finally {
      setDeleting(false);
    }
  }

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
            className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Body */}
      {open && (
        <div className="border-t border-gray-100">
          {items.length === 0 ? (
            <div className="h-16 flex items-center justify-center">
              <p className="text-[12px] text-gray-400">No meals logged</p>
            </div>
          ) : (
            <div className="max-h-[192px] overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 group"
                >
                  <div>
                    <p className="text-[13px] font-medium text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {item.carbs ?? 0}g carbs • {item.protein ?? 0}g protein •{" "}
                      {item.fat ?? 0}g fat
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] font-semibold text-gray-700">
                      {item.calories} kcal
                    </span>
                    {onDeleteItem && (
                      <div className="hidden group-hover:flex items-center gap-1">
                        <button
                          onClick={() => requestDelete(item)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingItem}
        title="Delete this meal entry?"
        message={
          pendingItem
            ? `"${pendingItem.name}" (${pendingItem.calories} kcal) will be permanently removed.`
            : ""
        }
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingItem(null)}
      />
    </div>
  );
}
