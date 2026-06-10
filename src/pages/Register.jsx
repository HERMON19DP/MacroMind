import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', height: '', weight: '', goal: 'Lose weight' })
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleFinish = (e) => {
    e.preventDefault()
    login({ ...form, dailyCalorieGoal: 2000, targetWeight: 74 })
    navigate('/overview')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-400 flex items-center justify-center mx-auto mb-3">
            <Leaf size={20} className="text-white" />
          </div>
          <h1 className="text-[22px] font-semibold text-gray-900">Create account</h1>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {[1, 2].map(s => (
              <div key={s} className={`h-1.5 rounded-full transition-all ${s === step ? 'w-6 bg-brand-400' : 'w-3 bg-gray-200'}`} />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          {step === 1 ? (
            <form onSubmit={e => { e.preventDefault(); setStep(2) }} className="space-y-3.5">
              <p className="text-[12px] text-gray-400 mb-1">Step 1 of 2 — account details</p>
              {[
                { label: 'Full name', key: 'name', type: 'text', placeholder: 'Arun Kumar' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
                { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-[11.5px] font-medium text-gray-500 block mb-1.5">{f.label}</label>
                  <input
                    type={f.type} required
                    value={form[f.key]}
                    onChange={e => set(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50 transition-all"
                  />
                </div>
              ))}
              <button type="submit" className="w-full bg-brand-400 text-white font-medium text-[13.5px] py-2.5 rounded-xl hover:bg-brand-600 transition-colors mt-1">
                Continue
              </button>
            </form>
          ) : (
            <form onSubmit={handleFinish} className="space-y-3.5">
              <p className="text-[12px] text-gray-400 mb-1">Step 2 of 2 — your health profile</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Age', key: 'age', placeholder: '28' },
                  { label: 'Height (cm)', key: 'height', placeholder: '175' },
                  { label: 'Current weight (kg)', key: 'weight', placeholder: '79' },
                ].map(f => (
                  <div key={f.key} className={f.key === 'weight' ? 'col-span-2' : ''}>
                    <label className="text-[11.5px] font-medium text-gray-500 block mb-1.5">{f.label}</label>
                    <input
                      type="number" required
                      value={form[f.key]}
                      onChange={e => set(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50 transition-all"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-[11.5px] font-medium text-gray-500 block mb-1.5">Your goal</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Lose weight', 'Gain weight', 'Maintain'].map(g => (
                    <button
                      key={g} type="button"
                      onClick={() => set('goal', g)}
                      className={`py-2 rounded-xl text-[12px] font-medium border transition-colors ${
                        form.goal === g ? 'bg-brand-50 border-brand-300 text-brand-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-1">
                <button type="button" onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-[13px] font-medium py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button type="submit" className="flex-[2] bg-brand-400 text-white font-medium text-[13.5px] py-2.5 rounded-xl hover:bg-brand-600 transition-colors">
                  Start tracking
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-[12px] text-gray-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
