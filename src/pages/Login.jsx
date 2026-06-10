import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Leaf, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    login({ name: 'Arun Kumar', email: form.email, goal: 'Lose weight', dailyCalorieGoal: 2000, weight: 79, targetWeight: 74 })
    navigate('/overview')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-400 flex items-center justify-center mx-auto mb-3">
            <Leaf size={20} className="text-white" />
          </div>
          <h1 className="text-[22px] font-semibold text-gray-900">Welcome back</h1>
          <p className="text-[13px] text-gray-400 mt-1">Sign in to continue tracking</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11.5px] font-medium text-gray-500 block mb-1.5">Email</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50 transition-all"
              />
            </div>
            <div>
              <label className="text-[11.5px] font-medium text-gray-500 block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-50 transition-all pr-10"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-2.5 text-gray-400">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-400 text-white font-medium text-[13.5px] py-2.5 rounded-xl hover:bg-brand-600 transition-colors mt-2"
            >
              Sign in
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-[11px] text-gray-400 bg-white px-2">or</div>
          </div>

          <button className="w-full flex items-center justify-center gap-2.5 border border-gray-200 rounded-xl py-2.5 text-[13px] text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center text-[12px] text-gray-400 mt-4">
          No account?{' '}
          <Link to="/register" className="text-brand-600 font-medium hover:underline">Create one free</Link>
        </p>
      </div>
    </div>
  )
}
