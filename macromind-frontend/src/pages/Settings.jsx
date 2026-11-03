import { useState, useEffect, useRef } from "react";
import { User, Target, Bell, Trash2, Loader2, Sparkles } from "lucide-react";
import Topbar from "../components/Topbar";
import { useAuth } from "../context/AuthContext";
import { getMe, updateProfile, getSuggestedCalories } from "../api/userApi";
import { getGoals, updateGoals } from "../api/goalsApi";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Settings() {
  usePageTitle("Settings");
  const { updateUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    targetWeight: "",
    goal: "Lose weight",
    dailyCalorieGoal: 2000,
    activityLevel: "lightly_active",
    goalRateKgWeek: "0.5",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [initialForm, setInitialForm] = useState(null);
  const [suggested, setSuggested] = useState(null);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, goalsRes] = await Promise.all([getMe(), getGoals()]);
        const profile = profileRes.user;
        const goals = goalsRes.data;

        const loadedForm = {
          name: profile.name || "",
          email: profile.email || "",
          age: profile.age ?? "",
          gender: profile.gender || "",
          height: profile.height_cm ?? "",
          weight: profile.weight_kg ?? "",
          targetWeight: profile.target_weight_kg ?? "",
          goal: profile.goal_type || "Lose weight",
          dailyCalorieGoal: goals?.calorie_goal ?? 2000,
          activityLevel: profile.activity_level || "lightly_active",

          goalRateKgWeek:
            profile.goal_rate_kg_week == null
              ? "0.5"
              : String(Number(profile.goal_rate_kg_week)),
        };

        setForm(loadedForm);
        setInitialForm(loadedForm);
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Re-fetch a suggested calorie goal whenever the inputs that drive it change.
  useEffect(() => {
    if (loading) return;

    const { age, gender, height, weight, goal } = form;
    if (!age || !gender || !height || !weight) {
      setSuggested(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        setSuggestLoading(true);
        const res = await getSuggestedCalories({
          weight: Number(weight),
          height: Number(height),
          age: Number(age),
          gender,
          goal,
          activityLevel: form.activityLevel,
          goalRateKgWeek:
            form.goal === "Maintain weight"
              ? undefined
              : Number(form.goalRateKgWeek),
        });
        setSuggested(res.suggestedCalories);
      } catch (error) {
        console.error("Failed to get suggested calories:", error);
      } finally {
        setSuggestLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    form.age,
    form.gender,
    form.height,
    form.weight,
    form.goal,
    form.activityLevel,
    form.goalRateKgWeek,
    loading,
  ]);

  const hasUnsavedChanges =
    initialForm !== null &&
    Object.keys(form).some(
      (key) => String(form[key] ?? "") !== String(initialForm[key] ?? ""),
    );

  const profileFields = [
    "name",
    "age",
    "gender",
    "height",
    "weight",
    "targetWeight",
    "goal",
    "activityLevel",
    "goalRateKgWeek",
  ];

  const profileHasChanges =
    initialForm !== null &&
    profileFields.some(
      (key) => String(form[key] ?? "") !== String(initialForm[key] ?? ""),
    );

  const goalHasChanges =
    initialForm !== null &&
    ["goal", "dailyCalorieGoal"].some(
      (key) => String(form[key] ?? "") !== String(initialForm[key] ?? ""),
    );

  const handleChange = (e) => {
    setSaved(false);
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const applySuggestion = () => {
    if (suggested) {
      setSaved(false);
      setForm((f) => ({
        ...f,
        dailyCalorieGoal: suggested,
      }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);

      const profileRes = await updateProfile({
        name: form.name,
        age: form.age ? Number(form.age) : null,
        gender: form.gender || null,
        height: form.height ? Number(form.height) : null,
        weight: form.weight ? Number(form.weight) : null,
        targetWeight: form.targetWeight ? Number(form.targetWeight) : null,
        goal: form.goal,
        activityLevel: form.activityLevel,
        goalRateKgWeek:
          form.goal === "Maintain weight" ? null : Number(form.goalRateKgWeek),
      });

      await updateGoals({ calorieGoal: Number(form.dailyCalorieGoal) });

      updateUser(profileRes.user);
      setInitialForm({ ...form });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          title="Settings"
          subtitle="Manage your profile and preferences"
        />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-[13px] gap-2">
          <Loader2 size={16} className="animate-spin" /> Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar title="Settings" subtitle="Manage your profile and preferences" />

      {hasUnsavedChanges && (
        <div className="sticky top-0 z-20 px-3 sm:px-5 pt-3">
          <div
            role="status"
            aria-live="polite"
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 sm:px-4 py-3 shadow-sm"
          >
            <div className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">!</span>

              <div>
                <p className="text-[12.5px] font-semibold text-amber-800">
                  Unsaved changes
                </p>

                <p className="text-[11px] text-amber-700">
                  Remember to save your settings.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto shrink-0 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save now"}
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 lg:p-5">
        <div className="w-full max-w-2xl mx-auto space-y-4 sm:space-y-5">
          {/* Profile */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-3 sm:px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <User size={14} className="text-gray-400 shrink-0" />

              <p className="text-[13px] font-semibold text-gray-800">Profile</p>

              {profileHasChanges && (
                <span className="ml-auto rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700">
                  Unsaved
                </span>
              )}
            </div>

            <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {[
                { label: "Full name", name: "name", type: "text" },
                {
                  label: "Email",
                  name: "email",
                  type: "email",
                  disabled: true,
                },
                { label: "Age", name: "age", type: "number" },
                { label: "Height (cm)", name: "height", type: "number" },
                {
                  label: "Current weight (kg)",
                  name: "weight",
                  type: "number",
                },
                {
                  label: "Target weight (kg)",
                  name: "targetWeight",
                  type: "number",
                },
              ].map((f) => (
                <div key={f.name} className="min-w-0">
                  <label className="text-[11px] font-medium text-gray-500 block mb-1.5">
                    {f.label}
                  </label>

                  <input
                    type={f.type}
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleChange}
                    disabled={f.disabled}
                    className="w-full min-w-0 border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50 transition-all disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>
              ))}

              <div className="min-w-0">
                <label className="text-[11px] font-medium text-gray-500 block mb-1.5">
                  Gender
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full min-w-0 border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-800 outline-none focus:border-brand-400"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="min-w-0">
                <label className="text-[11px] font-medium text-gray-500 block mb-1.5">
                  Activity level
                </label>

                <select
                  name="activityLevel"
                  value={form.activityLevel}
                  onChange={handleChange}
                  className="w-full min-w-0 border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-800 outline-none focus:border-brand-400"
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="lightly_active">Lightly active</option>
                  <option value="moderately_active">Moderately active</option>
                  <option value="very_active">Very active</option>
                  <option value="extra_active">Extra active</option>
                </select>
              </div>

              {form.goal !== "Maintain weight" && (
                <div className="min-w-0">
                  <label className="text-[11px] font-medium text-gray-500 block mb-1.5">
                    Weekly {form.goal === "Gain weight" ? "gain" : "loss"} rate
                  </label>

                  <select
                    name="goalRateKgWeek"
                    value={form.goalRateKgWeek}
                    onChange={handleChange}
                    className="w-full min-w-0 border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-800 outline-none focus:border-brand-400"
                  >
                    <option value="0.25">0.25 kg/week</option>
                    <option value="0.5">0.5 kg/week</option>
                    <option value="1">1 kg/week</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Goal settings */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-3 sm:px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <Target size={14} className="text-gray-400 shrink-0" />

              <p className="text-[13px] font-semibold text-gray-800">
                Goal settings
              </p>

              {goalHasChanges && (
                <span className="ml-auto rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold text-amber-700">
                  Unsaved
                </span>
              )}
            </div>

            <div className="p-3 sm:p-4 space-y-4">
              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-1.5">
                  Goal type
                </label>

                <select
                  name="goal"
                  value={form.goal}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-800 outline-none focus:border-brand-400"
                >
                  <option>Lose weight</option>
                  <option>Gain weight</option>
                  <option>Maintain weight</option>
                </select>
              </div>

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <label className="text-[11px] font-medium text-gray-500">
                    Daily calorie goal —{" "}
                    <span className="text-brand-600 font-semibold">
                      {form.dailyCalorieGoal} kcal
                    </span>
                  </label>

                  {suggestLoading && (
                    <span className="text-[10.5px] text-gray-400 flex items-center gap-1">
                      <Loader2 size={10} className="animate-spin" />
                      Calculating...
                    </span>
                  )}

                  {!suggestLoading &&
                    suggested &&
                    suggested !== Number(form.dailyCalorieGoal) && (
                      <button
                        onClick={applySuggestion}
                        className="text-left text-[10.5px] font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
                      >
                        <Sparkles size={11} />
                        Use suggested {suggested} kcal
                      </button>
                    )}
                </div>

                <input
                  type="range"
                  name="dailyCalorieGoal"
                  min="1200"
                  max="4000"
                  step="50"
                  value={form.dailyCalorieGoal}
                  onChange={handleChange}
                  className="w-full accent-brand-400"
                />

                <div className="flex justify-between text-[10.5px] text-gray-400 mt-1">
                  <span>1200</span>
                  <span>4000</span>
                </div>

                {!suggested && !suggestLoading && (
                  <p className="text-[10.5px] text-gray-400 mt-2">
                    Fill in age, gender, height, and weight above to get a
                    suggested calorie goal.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="space-y-3">
            <button
              onClick={handleSave}
              disabled={saving || !hasUnsavedChanges}
              className={
                "w-full sm:w-auto text-[13px] font-semibold px-6 py-3 sm:py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed " +
                (hasUnsavedChanges
                  ? "bg-amber-500 text-white ring-4 ring-amber-100 shadow-md hover:bg-amber-600"
                  : "bg-brand-400 text-white hover:bg-brand-600")
              }
            >
              {saving
                ? "Saving..."
                : saved
                  ? "Saved ✓"
                  : hasUnsavedChanges
                    ? "Save changes •"
                    : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
