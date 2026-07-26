import { useState } from 'react'
import { User, Target, Bell, Shield, Trash2 } from 'lucide-react'
import Topbar from '../components/Topbar'
import { useAuth } from '../context/AuthContext'

export default function Settings() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    height: user?.height || '',
    weight: user?.weight || '',
    targetWeight: user?.targetWeight || '',
    goal: user?.goal || 'Lose weight',
    dailyCalorieGoal: user?.dailyCalorieGoal || 2000,
  })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

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
                { label: 'Email', name: 'email', type: 'email' },
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
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50 transition-all"
                  />
                </div>
              ))}
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
                <label className="text-[11px] font-medium text-gray-500 block mb-1.5">
                  Daily calorie goal — <span className="text-brand-600 font-semibold">{form.dailyCalorieGoal} kcal</span>
                </label>
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
              </div>
            </div>
          </div>

          {/* Notifications */}
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
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-brand-50 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-brand-400 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Save / danger */}
          <div className="flex items-center justify-between">
            <button className="bg-brand-400 text-white text-[13px] font-medium px-6 py-2.5 rounded-xl hover:bg-brand-600 transition-colors">
              Save changes
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
