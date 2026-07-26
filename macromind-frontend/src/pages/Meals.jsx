import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Coffee,
  Sun,
  Moon,
  Apple,
  Plus,
} from "lucide-react";

import Topbar from "../components/Topbar";
import MealCard from "../components/MealCard";

import { getRecentMeals, analyzeMeal } from "../api/mealApi";

export default function Meals() {
  const [offset, setOffset] = useState(0);
  const [meals, setMeals] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [mealType, setMealType] = useState("breakfast");

  const [mealText, setMealText] = useState("");

  const [loading, setLoading] = useState(false);

  async function loadMeals() {
    try {
      const response = await getRecentMeals();

      setMeals(response.data);
    } catch (error) {
      console.error("Failed to load meals:", error);
    }
  }

  useEffect(() => {
    loadMeals();
  }, []);

  async function handleAddMeal() {
    if (!mealText.trim()) return;

    try {
      setLoading(true);

      await analyzeMeal(mealType, mealText);

      await loadMeals();

      setMealText("");

      setMealType("breakfast");

      setShowModal(false);
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Failed to add meal");
    } finally {
      setLoading(false);
    }
  }

  const breakfastMeals = meals.filter((meal) => meal.meal_type === "breakfast");

  const lunchMeals = meals.filter((meal) => meal.meal_type === "lunch");

  const dinnerMeals = meals.filter((meal) => meal.meal_type === "dinner");

  const snackMeals = meals.filter((meal) => meal.meal_type === "snack");

  const mealData = {
    breakfast: {
      icon: Coffee,
      items: breakfastMeals.map((meal) => ({
        name: meal.meal_text,
        calories: Number(meal.total_calories),
        carbs: Number(meal.total_carbs),
        protein: Number(meal.total_protein),
        fat: Number(meal.total_fat),
      })),
      total: breakfastMeals.reduce(
        (sum, meal) => sum + Number(meal.total_calories),
        0,
      ),
    },

    lunch: {
      icon: Sun,
      items: lunchMeals.map((meal) => ({
        name: meal.meal_text,
        calories: Number(meal.total_calories),
        carbs: Number(meal.total_carbs),
        protein: Number(meal.total_protein),
        fat: Number(meal.total_fat),
      })),
      total: lunchMeals.reduce(
        (sum, meal) => sum + Number(meal.total_calories),
        0,
      ),
    },

    dinner: {
      icon: Moon,
      items: dinnerMeals.map((meal) => ({
        name: meal.meal_text,
        calories: Number(meal.total_calories),
        carbs: Number(meal.total_carbs),
        protein: Number(meal.total_protein),
        fat: Number(meal.total_fat),
      })),
      total: dinnerMeals.reduce(
        (sum, meal) => sum + Number(meal.total_calories),
        0,
      ),
    },

    snacks: {
      icon: Apple,
      items: snackMeals.map((meal) => ({
        name: meal.meal_text,
        calories: Number(meal.total_calories),
        carbs: Number(meal.total_carbs),
        protein: Number(meal.total_protein),
        fat: Number(meal.total_fat),
      })),
      total: snackMeals.reduce(
        (sum, meal) => sum + Number(meal.total_calories),
        0,
      ),
    },
  };

  const getDate = (off) => {
    const d = new Date();
    d.setDate(d.getDate() + off);

    return d.toLocaleDateString("en-IN", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const totalCal = Object.values(mealData).reduce((s, m) => s + m.total, 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar title="Meals" subtitle="View and manage your meals" />

      <div className="flex-1 overflow-y-auto p-5">
        {/* Date nav */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3 mb-5">
          <button
            onClick={() => setOffset((o) => o - 1)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="text-center">
            <p className="text-[13px] font-semibold text-gray-800">
              {getDate(offset)}
            </p>

            {offset === 0 && (
              <p className="text-[11px] text-brand-500">Today</p>
            )}
          </div>

          <button
            onClick={() => setOffset((o) => Math.min(o + 1, 0))}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors disabled:opacity-30"
            disabled={offset === 0}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Daily summary strip */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] text-gray-500 font-medium">
              Daily total
            </span>

            <span className="text-[14px] font-semibold text-brand-600">
              {totalCal} / 2000 kcal
            </span>
          </div>

          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-brand-400 rounded-full"
              style={{
                width: `${Math.min((totalCal / 2000) * 100, 100)}%`,
              }}
            />
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              {
                label: "Breakfast",
                cal: mealData.breakfast.total,
                color: "bg-amber-100 text-amber-700",
              },
              {
                label: "Lunch",
                cal: mealData.lunch.total,
                color: "bg-blue-100 text-blue-700",
              },
              {
                label: "Snacks",
                cal: mealData.snacks.total,
                color: "bg-green-100 text-green-700",
              },
              {
                label: "Dinner",
                cal: mealData.dinner.total,
                color: "bg-purple-100 text-purple-700",
              },
            ].map((m) => (
              <div
                key={m.label}
                className={`rounded-lg px-2 py-1.5 ${m.color}`}
              >
                <p className="text-[13px] font-semibold">{m.cal}</p>
                <p className="text-[10px] opacity-80">{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Meal cards */}
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(mealData).map(([key, val]) => (
            <MealCard
              key={key}
              title={key.charAt(0).toUpperCase() + key.slice(1)}
              icon={val.icon}
              items={val.items}
              totalCal={val.total}
            />
          ))}
        </div>

        {/* Add meal button */}
        <button
          onClick={() => setShowModal(true)}
          className="
    w-full mt-4
    flex items-center justify-center gap-2
    py-3 rounded-xl border-2 border-dashed
    border-gray-200
    text-[13px]
    text-gray-500

    hover:border-brand-400
    hover:text-brand-600
    hover:bg-brand-50

    active:scale-[0.98]
    active:bg-brand-100

    transition-all duration-200
  "
        >
          <Plus size={15} />
          Add custom meal entry
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Meal</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Meal Type</label>

                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2"
                >
                  <option value="breakfast">Breakfast</option>

                  <option value="lunch">Lunch</option>

                  <option value="dinner">Dinner</option>

                  <option value="snack">Snack</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Food Description</label>

                <textarea
                  value={mealText}
                  onChange={(e) => setMealText(e.target.value)}
                  rows={4}
                  placeholder="2 idlis and sambar"
                  className="w-full border rounded-xl px-3 py-2"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 border rounded-xl py-2"
                >
                  Cancel
                </button>

                <button
                  onClick={handleAddMeal}
                  disabled={loading}
                  className="flex-1 bg-brand-400 text-white rounded-xl py-2"
                >
                  {loading ? "Analyzing..." : "Analyze Meal"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
