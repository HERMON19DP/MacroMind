import { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import ChatPanel from "../components/ChatPanel";
import TodayProgressCard from "../components/TodayProgressCard";
import CurrentAnalysisCard from "../components/CurrentAnalysisCard";
import SaveMealCard from "../components/SaveMealCard";
import { getTodayDashboard } from "../api/dashboardApi";
import { saveMeal } from "../api/mealApi";

function guessMealType() {
  const hour = new Date().getHours();
  if (hour < 11) return "breakfast";
  if (hour < 16) return "lunch";
  if (hour < 19) return "snack";
  return "dinner";
}

export default function Chat() {
  const [todayData, setTodayData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [mealType, setMealType] = useState(guessMealType());
  const [saving, setSaving] = useState(false);

  async function loadToday() {
    try {
      const res = await getTodayDashboard();
      setTodayData(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadToday();
  }, []);

  function handleAnalysisReady(result, mealText) {
    setAnalysis({ ...result, mealText });
  }

  async function handleSave() {
    if (!analysis) return;

    try {
      setSaving(true);
      await saveMeal({
        mealType,
        mealText: analysis.mealText,
        analysis: { foods: analysis.foods, totals: analysis.totals },
      });
      await loadToday();
      setAnalysis(null);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save meal");
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    setAnalysis(null);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar title="AI Nutrition" subtitle="Describe meals or upload a photo" />

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-2 h-[calc(100vh-140px)]">
            <ChatPanel onAnalysisReady={handleAnalysisReady} />
          </div>

          <div className="flex flex-col gap-4">
            <TodayProgressCard data={todayData} />
            <CurrentAnalysisCard analysis={analysis} />
            <SaveMealCard
              analysis={analysis}
              mealType={mealType}
              onMealTypeChange={setMealType}
              onSave={handleSave}
              onDiscard={handleDiscard}
              saving={saving}
            />
          </div>
        </div>
      </div>
    </div>
  );
}