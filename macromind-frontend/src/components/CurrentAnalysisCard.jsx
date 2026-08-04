import { CheckCircle2, UtensilsCrossed } from "lucide-react";

const MACROS = [
  { key: "calories", label: "Calories", unit: "" },
  { key: "protein", label: "Protein", unit: "g" },
  { key: "carbs", label: "Carbs", unit: "g" },
  { key: "fat", label: "Fat", unit: "g" },
];

export default function CurrentAnalysisCard({ analysis }) {
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
      <p className="text-[13px] font-semibold text-gray-800 mb-3">Current Analysis</p>

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
            <span className="text-[12px] font-semibold text-gray-800">
              {totals[m.key] ?? 0}{m.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}