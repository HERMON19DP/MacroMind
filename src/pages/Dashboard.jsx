import { Flame, Beef, Wheat, Droplet, Sun, Coffee, Moon, Apple, TrendingUp } from 'lucide-react'
import Topbar from '../components/Topbar'
import MacroCard from '../components/MacroCard'
import MealCard from '../components/MealCard'
import ChatPanel from '../components/ChatPanel'
import { useAuth } from '../context/AuthContext'

const todayMeals = {
  breakfast: {
    items: [
      { name: 'Idli (2 pieces)', calories: 150, carbs: 30, protein: 4, fat: 0.5 },
      { name: 'Sambar (1 cup)', calories: 95, carbs: 12, protein: 5, fat: 2 },
      { name: 'Filter coffee', calories: 65, carbs: 8, protein: 2, fat: 3 },
    ],
    total: 310,
  },
  lunch: {
    items: [
      { name: 'Sambar rice (1 plate)', calories: 380, carbs: 68, protein: 12, fat: 8 },
      { name: 'Papad (2 pieces)', calories: 100, carbs: 14, protein: 3, fat: 4 },
    ],
    total: 480,
  },
  snack: {
    items: [
      { name: 'Banana (1 medium)', calories: 89, carbs: 23, protein: 1, fat: 0.3 },
    ],
    total: 89,
  },
}

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const weekData = [1820, 2100, 1750, 1900, 879, 0, 0]

export default function Dashboard() {
  const { user } = useAuth()
  const consumed = 879
  const goal = user?.dailyCalorieGoal || 2000
  const remaining = goal - consumed

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar title="Dashboard" subtitle={dateStr} />

      <div className="flex-1 overflow-y-auto p-5">
        {/* Macro summary row */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <MacroCard label="Calories" value={consumed} unit="kcal" goal={goal} color="brand" icon={Flame} />
          <MacroCard label="Protein" value={48} unit="g" goal={120} color="violet" icon={Beef} />
          <MacroCard label="Carbs" value={112} unit="g" goal={200} color="blue" icon={Wheat} />
          <MacroCard label="Fat" value={17} unit="g" goal={65} color="amber" icon={Droplet} />
        </div>

        {/* Main grid: weekly heatmap + chat */}
        <div className="grid grid-cols-5 gap-4 mb-5">
          {/* Weekly strip */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wide mb-3">This week</p>
            <div className="space-y-2">
              {weekDays.map((day, i) => {
                const cal = weekData[i]
                const isToday = i === 4
                const pct = cal ? Math.min((cal / goal) * 100, 100) : 0
                return (
                  <div key={day} className={`flex items-center gap-3 p-2 rounded-lg ${isToday ? 'bg-brand-50' : ''}`}>
                    <span className={`text-[12px] w-8 font-medium ${isToday ? 'text-brand-600' : 'text-gray-400'}`}>{day}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          cal > goal ? 'bg-red-400' : isToday ? 'bg-brand-400' : 'bg-brand-200'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={`text-[11px] w-14 text-right font-medium ${isToday ? 'text-brand-600' : 'text-gray-400'}`}>
                      {cal > 0 ? `${cal} kcal` : '—'}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Quick stats */}
            <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-[18px] font-semibold text-gray-900">{remaining}</p>
                <p className="text-[10px] text-gray-400">kcal remaining</p>
              </div>
              <div className="text-center">
                <p className="text-[18px] font-semibold text-green-600">3</p>
                <p className="text-[10px] text-gray-400">days on track</p>
              </div>
            </div>
          </div>

          {/* Chat panel */}
          <div className="col-span-3">
            <ChatPanel compact />
          </div>
        </div>

        {/* Today's meals */}
        <div>
          <p className="text-[13px] font-semibold text-gray-700 mb-3">Today's meals</p>
          <div className="grid grid-cols-3 gap-3">
            <MealCard title="Breakfast" icon={Coffee} items={todayMeals.breakfast.items} totalCal={todayMeals.breakfast.total} />
            <MealCard title="Lunch" icon={Sun} items={todayMeals.lunch.items} totalCal={todayMeals.lunch.total} />
            <MealCard title="Snacks" icon={Apple} items={todayMeals.snack.items} totalCal={todayMeals.snack.total} />
          </div>
        </div>
      </div>
    </div>
  )
}
