import { getRecentMeals } from "../api/mealApi";
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
} from "lucide-react";
import Topbar from "../components/Topbar";
import MacroCard from "../components/MacroCard";
import MealCard from "../components/MealCard";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [todayData, setTodayData] = useState(null);

  const [recentMeals, setRecentMeals] = useState([]);

  const breakfastMeals = recentMeals.filter(
    (meal) => meal.meal_type === "breakfast",
  );

  const lunchMeals = recentMeals.filter((meal) => meal.meal_type === "lunch");

  const snackMeals = recentMeals.filter((meal) => meal.meal_type === "snack");

  const dinnerMeals = recentMeals.filter((meal) => meal.meal_type === "dinner");

  const consumed = todayData?.consumed?.calories || 0;
  const goal = todayData?.goals?.calories || 2400;

  useEffect(() => {
    async function loadDashboard() {
      try {
        const today = await getTodayDashboard();

        const meals = await getRecentMeals();

        setRecentMeals(meals.data);

        setTodayData(today.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadDashboard();
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const week = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(today.getDate() - today.getDay() + i + 1);

    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: date.getDate(),
      isToday: date.toDateString() === today.toDateString(),
    };
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar title="Dashboard" subtitle="Daily Overview" />
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <div className="mb-5">
          <DateDropdown dateStr={dateStr} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-3 inline-flex gap-2 shadow-sm">
          {week.map((d) => (
            <button
              key={d.day}
              className={`flex flex-col items-center justify-center rounded-xl px-4 py-2 transition-all ${
                d.isToday ? "bg-brand-400 text-white" : "hover:bg-gray-50"
              }`}
            >
              <span
                className={`text-[11px] ${
                  d.isToday ? "text-white/80" : "text-gray-400"
                }`}
              >
                {d.day}
              </span>

              <span className="text-lg font-semibold mt-1">{d.date}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-5">
        {/* Macro summary row */}
        <div className="grid grid-cols-4 gap-3 mb-5">
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
            value={todayData?.consumed?.protein || 0}
            unit="g"
            goal={todayData?.goals?.protein || 150}
            color="violet"
            icon={Beef}
          />
          <MacroCard
            label="Carbs"
            value={todayData?.consumed?.carbs || 0}
            unit="g"
            goal={todayData?.goals?.carbs || 280}
            color="blue"
            icon={Wheat}
          />
          <MacroCard
            label="Fat"
            value={todayData?.consumed?.fat || 0}
            unit="g"
            goal={todayData?.goals?.fat || 80}
            color="amber"
            icon={Droplet}
          />
        </div>

        {/* Today's meals */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Today's Meals
              </h2>

              <p className="text-sm text-gray-400">Meals you've logged today</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MealCard
              title="Breakfast"
              icon={Coffee}
              items={breakfastMeals.map((meal) => ({
                name: meal.meal_text,
                calories: Number(meal.total_calories),
              }))}
              totalCal={breakfastMeals.reduce(
                (sum, meal) => sum + Number(meal.total_calories),
                0,
              )}
            />
            <MealCard
              title="Lunch"
              icon={Sun}
              items={lunchMeals.map((meal) => ({
                name: meal.meal_text,
                calories: Number(meal.total_calories),
              }))}
              totalCal={lunchMeals.reduce(
                (sum, meal) => sum + Number(meal.total_calories),
                0,
              )}
            />
            <MealCard
              title="Snacks"
              icon={Apple}
              items={snackMeals.map((meal) => ({
                name: meal.meal_text,
                calories: Number(meal.total_calories),
              }))}
              totalCal={snackMeals.reduce(
                (sum, meal) => sum + Number(meal.total_calories),
                0,
              )}
            />
            <MealCard
              title="Dinner"
              icon={Moon}
              items={dinnerMeals.map((meal) => ({
                name: meal.meal_text,
                calories: Number(meal.total_calories),
              }))}
              totalCal={dinnerMeals.reduce(
                (sum, meal) => sum + Number(meal.total_calories),
                0,
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
