import { Flame, Beef, Wheat, Droplet } from "lucide-react";

export default function TodayProgressCard({ data }) {
  const consumed = data?.consumed || {};
  const goals = data?.goals || {};

  const rows = [
    { key: "calories", label: "Calories", unit: "kcal", icon: Flame, color: "text-brand-600" },
    { key: "protein", label: "Protein", unit: "g", icon: Beef, color: "text-violet-600" },
    { key: "carbs", label: "Carbs", unit: "g", icon: Wheat, color: "text-blue-600" },
    { key: "fat", label: "Fat", unit: "g", icon: Droplet, color: "text-amber-600" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <p className="text-[13px] font-semibold text-gray-800 mb-3">Today's Progress</p>
      <div className="space-y-3">
        {rows.map((r) => {
          const val = consumed[r.key] ?? 0;
          const goal = goals[r.key];
          const pct = goal ? Math.min(Math.round((val / goal) * 100), 100) : 0;

          return (
            <div key={r.key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <r.icon size={12} className={r.color} />
                  <span className="text-[12px] text-gray-600">{r.label}</span>
                </div>
                <span className="text-[11.5px] text-gray-500">
                  {val}{r.unit} {goal ? `/ ${goal}${r.unit}` : ""}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}