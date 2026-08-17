import { getRecentMeals, analyzeMeal } from "../api/mealApi";
import { useEffect, useState } from "react";
import { getTodayDashboard } from "../api/dashboardApi";
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
  Plus,
} from "lucide-react";
import Topbar from "../components/Topbar";
import MacroCard from "../components/MacroCard";
import MealCard from "../components/MealCard";
import { useAuth } from "../context/AuthContext";
import { usePageTitle } from "../hooks/usePageTitle";

function toDateOnly(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function toISODate(d) {
  const x = toDateOnly(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");

  return `${y}-${m}-${day}`;
}

export default function Dashboard() {
  usePageTitle("Dashboard");

  const { user } = useAuth();

  const [todayData, setTodayData] = useState(null);
  const [recentMeals, setRecentMeals] = useState([]);

  const [selectedDate, setSelectedDate] = useState(() =>
    toDateOnly(new Date())
  );

  const [showModal, setShowModal] = useState(false);
  const [mealType, setMealType] = useState("breakfast");
  const [mealText, setMealText] = useState("");
  const [loading, setLoading] = useState(false);

  const breakfastMeals = recentMeals.filter(
    (meal) => meal.meal_type === "breakfast"
  );

  const lunchMeals = recentMeals.filter(
    (meal) => meal.meal_type === "lunch"
  );

  const snackMeals = recentMeals.filter(
    (meal) => meal.meal_type === "snack"
  );

  const dinnerMeals = recentMeals.filter(
    (meal) => meal.meal_type === "dinner"
  );

  const consumed = todayData?.consumed?.calories || 0;
  const goal = todayData?.goals?.calories || 2400;

  async function loadDashboard(date = selectedDate) {
    try {
      const iso = toISODate(date);

      const today = await getTodayDashboard(iso);
      const meals = await getRecentMeals(iso);

      setRecentMeals(meals.data);
      setTodayData(today.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadDashboard(selectedDate);
  }, [selectedDate]);

  async function handleAddMeal() {
    if (!mealText.trim()) return;

    try {
      setLoading(true);

      await analyzeMeal(mealType, mealText);
      await loadDashboard();

      setMealText("");
      setMealType("breakfast");
      setShowModal(false);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to add meal"
      );
    } finally {
      setLoading(false);
    }
  }

  const realToday = toDateOnly(new Date());

  const dateStr = selectedDate.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const week = [...Array(7)].map((_, i) => {
    const date = new Date(realToday);

    date.setDate(
      realToday.getDate() -
        realToday.getDay() +
        i
    );

    const dateOnly = toDateOnly(date);

    return {
      day: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),

      date: date.getDate(),

      fullDate: dateOnly,

      isFuture:
        dateOnly.getTime() >
        realToday.getTime(),

      isSelected:
        dateOnly.getTime() ===
        toDateOnly(selectedDate).getTime(),
    };
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* =====================================================
          FIXED TOPBAR
          ===================================================== */}
      <Topbar
        title="Dashboard"
        subtitle="Daily Overview"
      />

      {/* =====================================================
          SINGLE DASHBOARD SCROLL CONTAINER
          ===================================================== */}
      <div className="flex-1 overflow-y-auto">

        {/* ===================================================
            DATE + WEEK SECTION

            This stays visually pinned while scrolling.
            Content below has a higher z-index and passes
            over this section.
            =================================================== */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-5">

          {/* Today dropdown */}
          <div className="mb-5">
            <DateDropdown dateStr={dateStr} />
          </div>

          {/* Week selector */}
          <div className="bg-white rounded-2xl border border-gray-100 p-3 inline-flex gap-2 shadow-sm">

            {week.map((d) => (
              <button
                key={d.day}
                disabled={d.isFuture}
                onClick={() =>
                  setSelectedDate(d.fullDate)
                }
                className={`flex flex-col items-center justify-center rounded-xl px-4 py-2 transition-all ${
                  d.isFuture
                    ? "opacity-30 cursor-not-allowed"
                    : d.isSelected
                      ? "bg-brand-400 text-white"
                      : "hover:bg-gray-50"
                }`}
              >
                <span
                  className={`text-[11px] ${
                    d.isSelected &&
                    !d.isFuture
                      ? "text-white/80"
                      : "text-gray-400"
                  }`}
                >
                  {d.day}
                </span>

                <span className="text-lg font-semibold mt-1">
                  {d.date}
                </span>
              </button>
            ))}

          </div>
        </div>

        {/* ===================================================
            SCROLLING CONTENT

            z-20 is intentionally higher than the sticky
            date section's z-10 so this content passes
            OVER the week section while scrolling.
            =================================================== */}
        <div className="relative z-20 bg-gray-50 px-5 pb-8">

          {/* =================================================
              MACRO SUMMARY
              ================================================= */}
          <div className="grid grid-cols-4 gap-3 mb-8 pt-5">

            <MacroCard
              label="Calories"
              value={consumed}
              unit="kcal"
              goal={goal}
              color="brand"
              icon={Flame}
            />

            <MacroCard
              label="Protein"
              value={
                todayData?.consumed?.protein || 0
              }
              unit="g"
              goal={
                todayData?.goals?.protein || 150
              }
              color="violet"
              icon={Beef}
            />

            <MacroCard
              label="Carbs"
              value={
                todayData?.consumed?.carbs || 0
              }
              unit="g"
              goal={
                todayData?.goals?.carbs || 280
              }
              color="blue"
              icon={Wheat}
            />

            <MacroCard
              label="Fat"
              value={
                todayData?.consumed?.fat || 0
              }
              unit="g"
              goal={
                todayData?.goals?.fat || 80
              }
              color="amber"
              icon={Droplet}
            />

          </div>

          {/* =================================================
              TODAY'S MEALS
              ================================================= */}
          <div>

            <div className="flex items-center justify-between mb-4">

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Today's Meals
                </h2>

                <p className="text-sm text-gray-400">
                  Meals you've logged today
                </p>
              </div>

              <button
                onClick={() =>
                  setShowModal(true)
                }
                className="flex items-center gap-1.5 text-[12.5px] font-medium text-brand-600 hover:text-brand-700 transition-colors"
              >
                <Plus size={14} />
                Add meal
              </button>

            </div>

            <div className="grid grid-cols-2 gap-4">

              {/* Breakfast */}
              <MealCard
                title="Breakfast"
                icon={Coffee}
                items={breakfastMeals.map(
                  (meal) => ({
                    name: meal.meal_text,
                    calories: Number(
                      meal.total_calories
                    ),
                    carbs: Number(
                      meal.total_carbs
                    ),
                    protein: Number(
                      meal.total_protein
                    ),
                    fat: Number(
                      meal.total_fat
                    ),
                  })
                )}
                totalCal={breakfastMeals.reduce(
                  (sum, meal) =>
                    sum +
                    Number(
                      meal.total_calories
                    ),
                  0
                )}
              />

              {/* Lunch */}
              <MealCard
                title="Lunch"
                icon={Sun}
                items={lunchMeals.map(
                  (meal) => ({
                    name: meal.meal_text,
                    calories: Number(
                      meal.total_calories
                    ),
                    carbs: Number(
                      meal.total_carbs
                    ),
                    protein: Number(
                      meal.total_protein
                    ),
                    fat: Number(
                      meal.total_fat
                    ),
                  })
                )}
                totalCal={lunchMeals.reduce(
                  (sum, meal) =>
                    sum +
                    Number(
                      meal.total_calories
                    ),
                  0
                )}
              />

              {/* Dinner */}
              <MealCard
                title="Dinner"
                icon={Moon}
                items={dinnerMeals.map(
                  (meal) => ({
                    name: meal.meal_text,
                    calories: Number(
                      meal.total_calories
                    ),
                    carbs: Number(
                      meal.total_carbs
                    ),
                    protein: Number(
                      meal.total_protein
                    ),
                    fat: Number(
                      meal.total_fat
                    ),
                  })
                )}
                totalCal={dinnerMeals.reduce(
                  (sum, meal) =>
                    sum +
                    Number(
                      meal.total_calories
                    ),
                  0
                )}
              />

              {/* Snacks */}
              <MealCard
                title="Snacks"
                icon={Apple}
                items={snackMeals.map(
                  (meal) => ({
                    name: meal.meal_text,
                    calories: Number(
                      meal.total_calories
                    ),
                    carbs: Number(
                      meal.total_carbs
                    ),
                    protein: Number(
                      meal.total_protein
                    ),
                    fat: Number(
                      meal.total_fat
                    ),
                  })
                )}
                totalCal={snackMeals.reduce(
                  (sum, meal) =>
                    sum +
                    Number(
                      meal.total_calories
                    ),
                  0
                )}
              />

            </div>

          </div>

        </div>
      </div>

      {/* =====================================================
          ADD MEAL MODAL
          ===================================================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-full max-w-md">

            <h2 className="text-lg font-semibold mb-4">
              Add Meal
            </h2>

            <div className="space-y-4">

              {/* Meal type */}
              <div>
                <label className="block text-sm mb-1">
                  Meal Type
                </label>

                <select
                  value={mealType}
                  onChange={(e) =>
                    setMealType(e.target.value)
                  }
                  className="w-full border rounded-xl px-3 py-2"
                >
                  <option value="breakfast">
                    Breakfast
                  </option>

                  <option value="lunch">
                    Lunch
                  </option>

                  <option value="dinner">
                    Dinner
                  </option>

                  <option value="snack">
                    Snack
                  </option>
                </select>
              </div>

              {/* Food description */}
              <div>
                <label className="block text-sm mb-1">
                  Food Description
                </label>

                <textarea
                  value={mealText}
                  onChange={(e) =>
                    setMealText(e.target.value)
                  }
                  rows={4}
                  placeholder="2 idlis and sambar"
                  className="w-full border rounded-xl px-3 py-2"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">

                <button
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="flex-1 border rounded-xl py-2"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAddMeal}
                  disabled={loading}
                  className="flex-1 bg-brand-400 text-white rounded-xl py-2"
                >
                  {loading
                    ? "Analyzing..."
                    : "Analyze Meal"}
                </button>

              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}