export default function MacroCard({
  label,
  value,
  unit,
  goal,
  color = "brand",
  icon: Icon,
}) {
  const numericValue = Number(value) || 0;
  const numericGoal = Number(goal) || 0;

  const isCalories = label.toLowerCase() === "calories";
  const decimals = isCalories ? 0 : 1;

  const formatValue = (number) =>
    Number(number.toFixed(decimals)).toLocaleString("en-IN", {
      maximumFractionDigits: decimals,
    });

  const pct = numericGoal
    ? Math.min(Math.round((numericValue / numericGoal) * 100), 100)
    : null;

  const remaining = numericGoal - numericValue;

  const colorMap = {
    brand: {
      bar: "bg-brand-400",
      text: "text-brand-600",
      bg: "bg-brand-50",
    },
    blue: {
      bar: "bg-blue-400",
      text: "text-blue-600",
      bg: "bg-blue-50",
    },
    violet: {
      bar: "bg-violet-400",
      text: "text-violet-600",
      bg: "bg-violet-50",
    },
    amber: {
      bar: "bg-amber-400",
      text: "text-amber-600",
      bg: "bg-amber-50",
    },
  };

  const c = colorMap[color] || colorMap.brand;

  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-gray-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11.5px] font-medium uppercase tracking-wide text-gray-400">
          {label}
        </span>

        {Icon && (
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-lg ${c.bg}`}
          >
            <Icon size={12} className={c.text} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-semibold ${c.text}`}>
          {formatValue(numericValue)}
        </span>

        <span className="text-[11px] text-gray-400">{unit}</span>

        {numericGoal > 0 && (
          <span className="ml-1 text-[11px] text-gray-300">
            / {formatValue(numericGoal)}
            {unit}
          </span>
        )}
      </div>

      {pct !== null && (
        <div>
          <div className="mb-1 flex justify-between gap-2 text-[9px] text-gray-400">
            <span>{pct}% of goal</span>

            <span className="text-right">
              {remaining < 0
                ? `${formatValue(Math.abs(remaining))} ${unit} over`
                : `${formatValue(remaining)} ${unit} left`}
            </span>
          </div>

          <div className="h-1 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all ${c.bar}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
