import { useEffect, useRef, useState } from "react";
import {
  getRecentMeals,
  analyzeMeal,
  saveMeal,
  deleteMeal,
} from "../api/mealApi";
import { getTodayDashboard, getWeekDashboard } from "../api/dashboardApi";
import DateDropdown from "../components/DateDropdown";
import {
  Flame,
  Beef,
  Wheat,
  Droplet,
  Sun,
  Coffee,
  Moon,
  Apple,
} from "lucide-react";
import Topbar from "../components/Topbar";
import MacroCard from "../components/MacroCard";
import MealCard from "../components/MealCard";
import { usePageTitle } from "../hooks/usePageTitle";

function toDateOnly(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function Dashboard() {
  usePageTitle("Dashboard");

  const [todayData, setTodayData] = useState(null);
  const [recentMeals, setRecentMeals] = useState([]);

  const [selectedDate, setSelectedDate] = useState(() =>
    toDateOnly(new Date()),
  );

  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [mealType, setMealType] = useState("breakfast");
  const [mealText, setMealText] = useState("");
  const [loading, setLoading] = useState(false);

  // Prevent an older API response from overwriting a newer date selection.
  const requestId = useRef(0);

  const realToday = toDateOnly(new Date());

  const isToday = toISODate(selectedDate) === toISODate(realToday);

  const dateStr = selectedDate.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year:
      selectedDate.getFullYear() !== realToday.getFullYear()
        ? "numeric"
        : undefined,
  });

  // All date-dependent dashboard data is fetched together.
  async function loadDashboard(date = selectedDate) {
    const currentRequestId = ++requestId.current;

    setDashboardLoading(true);
    setDashboardError("");

    try {
      const isoDate = toISODate(date);

      const [dashboardResponse, mealsResponse] = await Promise.all([
        getTodayDashboard(isoDate),
        getRecentMeals(isoDate),
      ]);

      // Ignore responses from previous date selections.
      if (currentRequestId !== requestId.current) {
        return;
      }

      setTodayData(dashboardResponse.data);
      setRecentMeals(mealsResponse.data ?? []);
    } catch (error) {
      if (currentRequestId !== requestId.current) {
        return;
      }

      console.error("Failed to load dashboard:", error);

      setDashboardError(
        error.response?.data?.message ||
          "Unable to load this day's dashboard. Please try again.",
      );
    } finally {
      if (currentRequestId === requestId.current) {
        setDashboardLoading(false);
      }
    }
  }

  // Fetch whenever the selected calendar date changes.
  useEffect(() => {
    loadDashboard(selectedDate);
  }, [selectedDate]);

  // Group the selected day's meals by meal type.
  const breakfastMeals = recentMeals.filter(
    (meal) => meal.meal_type === "breakfast",
  );

  const lunchMeals = recentMeals.filter((meal) => meal.meal_type === "lunch");

  const dinnerMeals = recentMeals.filter((meal) => meal.meal_type === "dinner");

  const snackMeals = recentMeals.filter((meal) => meal.meal_type === "snack");

  const consumed = todayData?.consumed ?? {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  const goals = todayData?.goals ?? {
    calories: 2400,
    protein: 150,
    carbs: 280,
    fat: 80,
  };

  // The week strip follows the week containing the selected date.
  // Sunday is the first day of the week.
  const selectedWeekStart = toDateOnly(selectedDate);

  selectedWeekStart.setDate(
    selectedWeekStart.getDate() - selectedWeekStart.getDay(),
  );

  const week = [...Array(7)].map((_, index) => {
    const date = new Date(selectedWeekStart);

    date.setDate(selectedWeekStart.getDate() + index);

    const dateOnly = toDateOnly(date);
    const isoDate = toISODate(dateOnly);

    return {
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      date: date.getDate(),
      fullDate: dateOnly,
      isFuture: isoDate > toISODate(realToday),
      isSelected: isoDate === toISODate(selectedDate),
    };
  });

  // Analyze and save the meal before refreshing the selected day.
  async function handleAddMeal() {
    if (!mealText.trim()) return;

    try {
      setLoading(true);

      const analysisResponse = await analyzeMeal(mealText);

      await saveMeal({
        mealType,
        mealText: mealText.trim(),
        analysis: analysisResponse.data,
      });

      await loadDashboard(selectedDate);

      setMealText("");
      setMealType("breakfast");
      setShowModal(false);
    } catch (error) {
      console.error("Failed to add meal:", error);

      alert(error.response?.data?.message || "Failed to add meal");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteMeal(mealId) {
    try {
      await deleteMeal(mealId);
      await loadDashboard(selectedDate);
    } catch (error) {
      console.error("Failed to delete meal:", error);

      alert(error.response?.data?.message || "Failed to delete meal");
    }
  }

  function mapMeal(meal) {
    return {
      id: meal.id,
      name: meal.meal_text,
      calories: Number(meal.total_calories),
      carbs: Number(meal.total_carbs),
      protein: Number(meal.total_protein),
      fat: Number(meal.total_fat),
    };
  }

  function getMealTotal(meals) {
    return meals.reduce(
      (sum, meal) => sum + Number(meal.total_calories || 0),
      0,
    );
  }

  const mealHeading = isToday
    ? "Today's Meals"
    : `Meals for ${selectedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar title="Dashboard" subtitle="Daily Overview" />

      {/* Single dashboard scroll container */}
      <div className="flex-1 overflow-y-auto">
        {/* Date selector and week strip */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-5">
          <div className="mb-5">
            <DateDropdown
              selectedDate={selectedDate}
              dateStr={dateStr}
              onChange={setSelectedDate}
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-3 inline-flex gap-2 shadow-sm">
            {week.map((day) => (
              <button
                key={toISODate(day.fullDate)}
                type="button"
                disabled={day.isFuture}
                onClick={() => setSelectedDate(day.fullDate)}
                aria-pressed={day.isSelected}
                className={`flex flex-col items-center justify-center rounded-xl px-4 py-2 transition-all ${
                  day.isFuture
                    ? "opacity-50 cursor-not-allowed"
                    : day.isSelected
                      ? "bg-brand-400 text-white"
                      : "hover:bg-gray-50"
                }`}
              >
                <span
                  className={`text-[11px] ${
                    day.isSelected && !day.isFuture
                      ? "text-white/80"
                      : "text-gray-400"
                  }`}
                >
                  {day.day}
                </span>

                <span className="text-lg font-semibold mt-1">{day.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scrolling dashboard content */}
        <div className="relative z-0 bg-gray-50 px-5 pb-8">
          {dashboardError && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
            >
              <p>{dashboardError}</p>

              <button
                type="button"
                onClick={() => loadDashboard(selectedDate)}
                className="mt-2 font-medium underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Nutrient summary */}
          <div
            className={`grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8 pt-5 ${
              dashboardLoading ? "opacity-70" : ""
            }`}
            aria-busy={dashboardLoading}
          >
            <MacroCard
              label="Calories"
              value={consumed.calories}
              unit="kcal"
              goal={goals.calories}
              color="brand"
              icon={Flame}
            />

            <MacroCard
              label="Protein"
              value={consumed.protein}
              unit="g"
              goal={goals.protein}
              color="violet"
              icon={Beef}
            />

            <MacroCard
              label="Carbs"
              value={consumed.carbs}
              unit="g"
              goal={goals.carbs}
              color="blue"
              icon={Wheat}
            />

            <MacroCard
              label="Fat"
              value={consumed.fat}
              unit="g"
              goal={goals.fat}
              color="amber"
              icon={Droplet}
            />
          </div>

          {/* Selected day's meals */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {mealHeading}
                </h2>

                <p className="text-sm text-gray-400">
                  {isToday
                    ? "Meals you've logged today"
                    : "Meals you've logged on this date"}
                </p>
              </div>

              {/*
                The Add Meal button remains disabled in the UI,
                as in the existing dashboard design.
                handleAddMeal is wired to the analyze-and-save API
                flow if you enable the modal later.
              */}
            </div>

            {dashboardLoading && (
              <p role="status" className="mb-4 text-sm text-gray-500">
                Loading meals and nutrients...
              </p>
            )}

            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-4 items-start ${
                dashboardLoading ? "opacity-70" : ""
              }`}
              aria-busy={dashboardLoading}
            >
              <MealCard
                title="Breakfast"
                icon={Coffee}
                items={breakfastMeals.map(mapMeal)}
                totalCal={getMealTotal(breakfastMeals)}
                onDeleteItem={isToday ? handleDeleteMeal : undefined}
              />

              <MealCard
                title="Lunch"
                icon={Sun}
                items={lunchMeals.map(mapMeal)}
                totalCal={getMealTotal(lunchMeals)}
                onDeleteItem={isToday ? handleDeleteMeal : undefined}
              />

              <MealCard
                title="Dinner"
                icon={Moon}
                items={dinnerMeals.map(mapMeal)}
                totalCal={getMealTotal(dinnerMeals)}
                onDeleteItem={isToday ? handleDeleteMeal : undefined}
              />

              <MealCard
                title="Snacks"
                icon={Apple}
                items={snackMeals.map(mapMeal)}
                totalCal={getMealTotal(snackMeals)}
                onDeleteItem={isToday ? handleDeleteMeal : undefined}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Existing Add Meal modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Add Meal</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm">Meal Type</label>

                <select
                  value={mealType}
                  onChange={(event) => setMealType(event.target.value)}
                  className="w-full rounded-xl border px-3 py-2"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm">Food Description</label>

                <textarea
                  value={mealText}
                  onChange={(event) => setMealText(event.target.value)}
                  rows={4}
                  placeholder="2 idlis and sambar"
                  className="w-full rounded-xl border px-3 py-2"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border py-2"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAddMeal}
                  disabled={loading || !mealText.trim()}
                  className="flex-1 rounded-xl bg-brand-400 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Analyze & Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
