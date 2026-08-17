import { useState, useEffect, useRef } from 'react'
import { User, Target, Bell, Trash2, Loader2, Sparkles } from 'lucide-react'
import Topbar from '../components/Topbar'
import { useAuth } from '../context/AuthContext'
import { getMe, updateProfile, getSuggestedCalories } from '../api/userApi'
import { getGoals, updateGoals } from '../api/goalsApi'
import { usePageTitle } from "../hooks/usePageTitle";

export default function Settings() {
  usePageTitle("Settings")
  const { updateUser } = useAuth()
  const [form, setForm] = useState({
    name: '', email: '', age: '', gender: '', height: '', weight: '',
    targetWeight: '', goal: 'Lose weight', dailyCalorieGoal: 2000,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [suggested, setSuggested] = useState(null)
  const [suggestLoading, setSuggestLoading] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, goalsRes] = await Promise.all([getMe(), getGoals()])
        const profile = profileRes.user
        const goals = goalsRes.data

        setForm({
          name: profile.name || '',
          email: profile.email || '',
          age: profile.age ?? '',
          gender: profile.gender || '',
          height: profile.height_cm ?? '',
          weight: profile.weight_kg ?? '',
          targetWeight: profile.target_weight_kg ?? '',
          goal: profile.goal_type || 'Lose weight',
          dailyCalorieGoal: goals?.calorie_goal ?? 2000,
        })
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Re-fetch a suggested calorie goal whenever the inputs that drive it change.
  useEffect(() => {
    if (loading) return

    const { age, gender, height, weight, goal } = form
    if (!age || !gender || !height || !weight) {
      setSuggested(null)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      try {
        setSuggestLoading(true)
        const res = await getSuggestedCalories({
          weight: Number(weight),
          height: Number(height),
          age: Number(age),
          gender,
          goal,
        })
        setSuggested(res.suggestedCalories)
      } catch (error) {
        console.error('Failed to get suggested calories:', error)
      } finally {
        setSuggestLoading(false)
      }
    }, 500)

    return () => clearTimeout(debounceRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.age, form.gender, form.height, form.weight, form.goal, loading])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const applySuggestion = () => {
    if (suggested) setForm(f => ({ ...f, dailyCalorieGoal: suggested }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setSaved(false)

      const profileRes = await updateProfile({
        name: form.name,
        age: form.age ? Number(form.age) : null,
        gender: form.gender || null,
        height: form.height ? Number(form.height) : null,
        weight: form.weight ? Number(form.weight) : null,
        targetWeight: form.targetWeight ? Number(form.targetWeight) : null,
        goal: form.goal,
      })

      await updateGoals({ calorieGoal: Number(form.dailyCalorieGoal) })

      updateUser(profileRes.user)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title="Settings" subtitle="Manage your profile and preferences" />
        <div className="flex-1 flex items-center justify-center text-gray-400 text-[13px] gap-2">
          <Loader2 size={16} className="animate-spin" /> Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar title="Settings" subtitle="Manage your profile and preferences" />

      <div className="flex-1 overflow-y-auto p-5">
        <div className="max-w-2xl mx-auto space-y-5">

          {/* Profile */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <User size={14} className="text-gray-400" />
              <p className="text-[13px] font-semibold text-gray-800">Profile</p>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {[
                { label: 'Full name', name: 'name', type: 'text' },
                { label: 'Email', name: 'email', type: 'email', disabled: true },
                { label: 'Age', name: 'age', type: 'number' },
                { label: 'Height (cm)', name: 'height', type: 'number' },
                { label: 'Current weight (kg)', name: 'weight', type: 'number' },
                { label: 'Target weight (kg)', name: 'targetWeight', type: 'number' },
              ].map(f => (
                <div key={f.name}>
                  <label className="text-[11px] font-medium text-gray-500 block mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleChange}
                    disabled={f.disabled}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50 transition-all disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>
              ))}

              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-1.5">Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-800 outline-none focus:border-brand-400"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>

          {/* Goal */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <Target size={14} className="text-gray-400" />
              <p className="text-[13px] font-semibold text-gray-800">Goal settings</p>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="text-[11px] font-medium text-gray-500 block mb-1.5">Goal type</label>
                <select
                  name="goal"
                  value={form.goal}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-800 outline-none focus:border-brand-400"
                >
                  <option>Lose weight</option>
                  <option>Gain weight</option>
                  <option>Maintain weight</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-medium text-gray-500">
                    Daily calorie goal — <span className="text-brand-600 font-semibold">{form.dailyCalorieGoal} kcal</span>
                  </label>

                  {suggestLoading && (
                    <span className="text-[10.5px] text-gray-400 flex items-center gap-1">
                      <Loader2 size={10} className="animate-spin" /> Calculating...
                    </span>
                  )}

                  {!suggestLoading && suggested && suggested !== Number(form.dailyCalorieGoal) && (
                    <button
                      onClick={applySuggestion}
                      className="text-[10.5px] font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1"
                    >
                      <Sparkles size={11} /> Use suggested {suggested} kcal
                    </button>
                  )}
                </div>

                <input
                  type="range" name="dailyCalorieGoal"
                  min="1200" max="4000" step="50"
                  value={form.dailyCalorieGoal}
                  onChange={handleChange}
                  className="w-full accent-brand-400"
                />
                <div className="flex justify-between text-[10.5px] text-gray-400 mt-1">
                  <span>1200</span><span>4000</span>
                </div>

                {!suggested && !suggestLoading && (
                  <p className="text-[10.5px] text-gray-400 mt-2">
                    Fill in age, gender, height, and weight above to get a suggested calorie goal.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Notifications — UI only for now */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <Bell size={14} className="text-gray-400" />
              <p className="text-[13px] font-semibold text-gray-800">Notifications</p>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: 'Meal logging reminders', sub: 'Get reminded to log breakfast, lunch, and dinner' },
                { label: 'Weekly report ready', sub: 'Notification when your weekly summary is available' },
                { label: 'Goal milestones', sub: 'Celebrate when you hit your targets' },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-[13px] font-medium text-gray-800">{n.label}</p>
                    <p className="text-[11px] text-gray-400">{n.sub}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-not-allowed opacity-60">
                    <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" disabled />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-brand-400 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                  </label>
                </div>
              ))}
              <p className="text-[10.5px] text-gray-400">Notification preferences are coming soon.</p>
            </div>
          </div>

          {/* Save / danger */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-brand-400 text-white text-[13px] font-medium px-6 py-2.5 rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save changes'}
            </button>
            <button className="flex items-center gap-1.5 text-[12.5px] text-red-400 hover:text-red-600 transition-colors">
              <Trash2 size={13} /> Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}