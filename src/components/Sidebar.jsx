import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, MessageSquare, UtensilsCrossed, BarChart2,
  Scale, Droplets, Heart, Settings, LogOut, Leaf,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'Dashboard', to: '/overview', icon: LayoutDashboard },
  { label: 'AI Chat', to: '/chat', icon: MessageSquare },
  { label: 'Meals', to: '/meals', icon: UtensilsCrossed },
  { label: 'Reports', to: '/reports', icon: BarChart2 },
  { label: 'Weight', to: '/weight', icon: Scale },
  { label: 'Water', to: '/water', icon: Droplets },
  { label: 'Favorites', to: '/favorites', icon: Heart },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2 border-b border-gray-100">
        <div className="w-7 h-7 rounded-lg bg-brand-400 flex items-center justify-center">
          <Leaf size={15} className="text-white" />
        </div>
        <span className="text-[15px] font-semibold text-gray-900 tracking-tight">Journable</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}

        <div className="mt-2 pt-2 border-t border-gray-100">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors ${
                isActive ? 'bg-brand-50 text-brand-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            <Settings size={16} />
            Settings
          </NavLink>
        </div>
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-[11px] font-semibold text-brand-600 shrink-0">
            {user?.name?.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-[11px] text-gray-400 truncate">{user?.goal}</p>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 transition-colors">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}
