import { CheckCircle2, Pencil, UtensilsCrossed } from "lucide-react";

const MACROS = [
  { key: "calories", label: "Calories", unit: "" },
  { key: "protein", label: "Protein", unit: "g" },
  { key: "carbs", label: "Carbs", unit: "g" },
  { key: "fat", label: "Fat", unit: "g" },
];

export default function CurrentAnalysisCard({ analysis, editing, onEditToggle, onFieldChange }) {
  if (!analysis) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <p className="text-[13px] font-semibold text-gray-800 mb-2">Current Analysis</p>
        <div className="flex flex-col items-center text-center py-6">
          <UtensilsCrossed size={20} className="text-gray-300 mb-2" />
          <p className="text-[12px] text-gray-400">No meal analysed yet.</p>
          <p className="text-[11px] text-gray-400 mt-1">Describe a meal or upload a photo.</p>
        </div>
      </div>
    );
  }

  const { foods = [], totals = {} } = analysis;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-semibold text-gray-800">Current Analysis</p>
        <button
          onClick={onEditToggle}
          className="flex items-center gap-1 text-[11px] text-brand-600 hover:text-brand-700 font-medium"
        >
          <Pencil size={11} /> {editing ? "Done" : "Edit"}
        </button>
      </div>

      <div className="space-y-1.5 mb-3">
        {foods.map((f, i) => (
          <div key={i} className="flex items-center gap-1.5 text-[12px] text-gray-700">
            <CheckCircle2 size={12} className="text-brand-500 shrink-0" />
            <span>{f.quantity ? `${f.quantity} ` : ""}{f.name}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100">
        {MACROS.map((m) => (
          <div key={m.key} className="flex items-center justify-between bg-gray-50 rounded-lg px-2.5 py-1.5">
            <span className="text-[11px] text-gray-500">{m.label}</span>
            {editing ? (
              <input
                type="number"
                value={totals[m.key] ?? 0}
                onChange={(e) => onFieldChange(m.key, Number(e.target.value))}
                className="w-14 text-right text-[12px] font-semibold text-gray-800 bg-white border border-gray-200 rounded px-1 py-0.5 outline-none focus:border-brand-400"
              />
            ) : (
              <span className="text-[12px] font-semibold text-gray-800">
                {totals[m.key] ?? 0}{m.unit}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}