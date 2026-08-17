import { useEffect, useState } from "react";
import Topbar from "../components/Topbar";
import ChatPanel from "../components/ChatPanel";
import TodayProgressCard from "../components/TodayProgressCard";
import CurrentAnalysisCard from "../components/CurrentAnalysisCard";
import SaveMealCard from "../components/SaveMealCard";
import { getTodayDashboard } from "../api/dashboardApi";
import { saveMeal } from "../api/mealApi";
import { useChatStore } from "../store/chatStore";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Chat() {
  usePageTitle("AI Chat")
  const [todayData, setTodayData] = useState(null);
  const [saving, setSaving] = useState(false);

  const analysis = useChatStore((s) => s.analysis);
  const mealType = useChatStore((s) => s.mealType);
  const setAnalysis = useChatStore((s) => s.setAnalysis);
  const setMealType = useChatStore((s) => s.setMealType);
  const clearAnalysis = useChatStore((s) => s.clearAnalysis);
  const checkNewDay = useChatStore((s) => s.checkNewDay);

  async function loadToday() {
    try {
      const res = await getTodayDashboard();
      setTodayData(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    checkNewDay();
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
      clearAnalysis();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save meal");
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    clearAnalysis();
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