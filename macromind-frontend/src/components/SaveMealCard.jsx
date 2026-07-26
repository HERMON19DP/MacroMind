import { Save, XCircle } from "lucide-react";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

export default function SaveMealCard({ analysis, mealType, onMealTypeChange, onSave, onDiscard, saving }) {
  const disabled = !analysis || saving;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <p className="text-[13px] font-semibold text-gray-800 mb-3">
        {analysis ? "Ready to save?" : "Save Meal"}
      </p>

      <div className="mb-3">
        <label className="text-[11px] text-gray-400 block mb-1.5">Meal type</label>
        <div className="grid grid-cols-2 gap-1.5">
          {MEAL_TYPES.map((t) => (
            <button
              key={t}
              disabled={!analysis}
              onClick={() => onMealTypeChange(t)}
              className={`py-1.5 rounded-lg text-[11.5px] font-medium border capitalize transition-colors ${
                mealType === t
                  ? "bg-brand-50 border-brand-300 text-brand-700"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={disabled}
          className="flex-1 flex items-center justify-center gap-1.5 bg-brand-400 text-white text-[12.5px] font-medium py-2 rounded-lg hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Save size={13} /> {saving ? "Saving..." : "Save Meal"}
        </button>
        <button
          onClick={onDiscard}
          disabled={!analysis || saving}
          className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-500 text-[12.5px] font-medium px-3 py-2 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <XCircle size={13} />
        </button>
      </div>
    </div>
  );
}