import Topbar from '../components/Topbar'
import ChatPanel from '../components/ChatPanel'
import { Flame, Beef, Wheat, Droplet } from 'lucide-react'

const recentMeals = [
  { name: 'Idli & Sambar', time: 'Today, 8:30 AM', cal: 310 },
  { name: 'Sambar rice', time: 'Today, 1:00 PM', cal: 380 },
  { name: 'Curd rice', time: 'Yesterday, 7:00 PM', cal: 290 },
  { name: 'Poha', time: 'Yesterday, 8:15 AM', cal: 250 },
]

export default function Chat() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar title="AI Chat Logger" subtitle="Log meals and exercise in natural language" />

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-3 gap-5">
          {/* Chat — takes 2 cols */}
          <div className="col-span-2 h-[calc(100vh-140px)]">
            <ChatPanel />
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-4">
            {/* Today's totals */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wide mb-3">Today so far</p>
              <div className="space-y-2.5">
                {[
                  { label: 'Calories', val: '879', unit: 'kcal', goal: '2000', icon: Flame, color: 'text-brand-500' },
                  { label: 'Protein',  val: '48',  unit: 'g',    goal: '120',  icon: Beef,  color: 'text-violet-500' },
                  { label: 'Carbs',    val: '112', unit: 'g',    goal: '200',  icon: Wheat, color: 'text-blue-500' },
                  { label: 'Fat',      val: '17',  unit: 'g',    goal: '65',   icon: Droplet,color: 'text-amber-500'},
                ].map(m => (
                  <div key={m.label} className="flex items-center gap-2">
                    <m.icon size={13} className={m.color} />
                    <span className="text-[12px] text-gray-500 flex-1">{m.label}</span>
                    <span className="text-[12px] font-semibold text-gray-800">{m.val}</span>
                    <span className="text-[11px] text-gray-400">/ {m.goal}{m.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent logs */}
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-[11.5px] font-medium text-gray-400 uppercase tracking-wide mb-3">Recent logs</p>
              <div className="space-y-2">
                {recentMeals.map((m, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-[12.5px] font-medium text-gray-800">{m.name}</p>
                      <p className="text-[10.5px] text-gray-400">{m.time}</p>
                    </div>
                    <span className="text-[11.5px] font-semibold text-brand-600">{m.cal} kcal</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
              <p className="text-[12px] font-semibold text-amber-700 mb-1.5">💡 Quick tip</p>
              <p className="text-[11.5px] text-amber-600 leading-relaxed">
                You can log multiple meals at once. Try: "Breakfast was idli and sambar, and I had curd rice for lunch."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
