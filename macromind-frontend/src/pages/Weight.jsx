import { useState, useEffect, useCallback } from "react";
import { TrendingDown, Target, Calendar, Plus } from "lucide-react";
import Topbar from "../components/Topbar";
import WeightChart from "../components/WeightChart";
import { getWeightData, logWeight } from "../api/weightApi";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Weight() {
  usePageTitle("Weight Tracker");
  const [range, setRange] = useState("month");
  const [data, setData] = useState({ chart: [], logs: [], summary: {} });
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newWeight, setNewWeight] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getWeightData(range);
      setData(res.data);
    } catch (error) {
      console.error("Failed to load weight data:", error);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  const { current, target, totalLost, toGoal } = data.summary || {};

  const fmt = (v) => (v === null || v === undefined ? "--" : `${v} kg`);

  const fmtToGoal = (v) => {
    if (v === null || v === undefined) return "--";

    const difference = -v;
    const sign = difference >= 0 ? "+" : "-";

    return `${sign}${Math.abs(difference)} kg`;
  };

  const handleSaveWeight = async () => {
    const value = parseFloat(newWeight);
    if (!value || saving) return;

    try {
      setSaving(true);
      await logWeight(value);
      setNewWeight("");
      setShowAdd(false);
      await load();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to log weight");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar
        title="Weight Tracker"
        subtitle="Monitor your progress over time"
      />

      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 lg:p-5">
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 sm:mb-5">
          {[
            {
              label: "Current weight",
              value: fmt(current),
              icon: TrendingDown,
              sub: "As of today",
              color: "text-brand-600",
            },
            {
              label: "Target weight",
              value: fmt(target),
              icon: Target,
              sub: "Your goal",
              color: "text-blue-600",
            },
            {
              label: "Total lost",
              value: fmt(totalLost),
              icon: TrendingDown,
              sub: "Since start",
              color: "text-green-600",
            },
            {
              label: "To goal",
              value: fmtToGoal(toGoal),
              icon: Calendar,
              sub: "Remaining",
              color: "text-amber-600",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="min-w-0 bg-white rounded-xl border border-gray-100 p-3 sm:p-4"
            >
              <div className="flex items-start justify-between gap-1 mb-2">
                <p className="text-[10px] sm:text-[11px] text-gray-400 font-medium uppercase tracking-wide">
                  {s.label}
                </p>

                <s.icon size={14} className={`${s.color} shrink-0`} />
              </div>

              <p
                className={`text-lg sm:text-[22px] font-semibold break-words ${s.color}`}
              >
                {s.value}
              </p>

              <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="min-w-0 bg-white rounded-xl border border-gray-100 p-3 sm:p-4 mb-4 sm:mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <p className="text-[13px] font-semibold text-gray-800">
              Weight progress
            </p>

            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit max-w-full">
              {["week", "month", "3months"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-2.5 sm:px-3 py-1 rounded-md text-[11px] sm:text-[11.5px] font-medium whitespace-nowrap transition-colors ${
                    range === r
                      ? "bg-white text-gray-800 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {r === "3months"
                    ? "3 months"
                    : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="h-[220px] flex items-center justify-center text-[12px] text-gray-400">
              Loading...
            </div>
          ) : data.chart.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-[12px] text-gray-400 text-center">
              No weight logs yet for this range
            </div>
          ) : (
            <div className="w-full min-w-0">
              <WeightChart data={data.chart} targetWeight={target} />
            </div>
          )}
        </div>

        {/* Log list + add */}
        <div className="min-w-0 bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-3 border-b border-gray-100">
            <p className="text-[13px] font-semibold text-gray-800">
              Weight log
            </p>

            <button
              onClick={() => setShowAdd(!showAdd)}
              className="flex items-center gap-1.5 text-[12px] text-brand-600 font-medium hover:text-brand-700 whitespace-nowrap"
            >
              <Plus size={13} />
              Log weight
            </button>
          </div>

          {showAdd && (
            <div className="px-3 sm:px-4 py-3 bg-brand-50 border-b border-brand-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <input
                type="number"
                step="0.1"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="Enter weight in kg"
                className="w-full min-w-0 sm:flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-brand-400"
              />

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveWeight}
                  disabled={saving || !newWeight}
                  className="flex-1 sm:flex-none bg-brand-400 text-white text-[12px] font-medium px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-40"
                >
                  {saving ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={() => setShowAdd(false)}
                  className="flex-1 sm:flex-none text-[12px] text-gray-400 hover:text-gray-600 px-3 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {data.logs.length === 0 ? (
            <div className="px-4 py-6 text-center text-[12px] text-gray-400">
              No weight logged yet
            </div>
          ) : (
            data.logs.map((log, i) => (
              <div
                key={log.id}
                className="flex items-center justify-between gap-3 px-3 sm:px-4 py-2.5 border-b border-gray-50 last:border-0"
              >
                <span className="text-[12px] sm:text-[12.5px] text-gray-600">
                  {log.date}
                </span>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span className="text-[13px] font-semibold text-gray-900">
                    {log.weight} kg
                  </span>

                  {i > 0 && (
                    <span
                      className={`text-[11px] font-medium ${
                        log.weight > data.logs[i - 1].weight
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {log.weight > data.logs[i - 1].weight ? "▲" : "▼"}
                      {Math.abs(log.weight - data.logs[i - 1].weight).toFixed(
                        1,
                      )}{" "}
                      kg
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
