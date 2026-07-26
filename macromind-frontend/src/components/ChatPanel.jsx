import { useState, useRef, useEffect } from 'react'
import { Send, Camera, Bookmark, Bot, User, Loader2 } from 'lucide-react'

const MOCK_RESPONSES = {
  default: (meal) => ({
    text: `I've logged your meal. Here's the nutrition breakdown:`,
    foods: [
      { name: meal || 'Meal item', calories: 310, protein: 11, carbs: 52, fat: 4 }
    ],
    insight: 'This is a balanced, moderate-calorie meal. The carbohydrate content will give you steady energy, and the protein supports muscle maintenance.'
  }),
}

function NutritionCard({ food }) {
  return (
    <div className="bg-brand-50 rounded-lg p-3 mt-2 border border-brand-100">
      <p className="text-[12.5px] font-semibold text-brand-700 mb-2">{food.name}</p>
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'Calories', val: food.calories, unit: 'kcal' },
          { label: 'Protein',  val: food.protein,  unit: 'g' },
          { label: 'Carbs',    val: food.carbs,    unit: 'g' },
          { label: 'Fat',      val: food.fat,      unit: 'g' },
        ].map(m => (
          <div key={m.label} className="text-center">
            <p className="text-[13px] font-semibold text-brand-700">{m.val}<span className="text-[10px] font-normal">{m.unit}</span></p>
            <p className="text-[10px] text-brand-500">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ChatPanel({ compact = false }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: "Hi! Tell me what you ate or drank — I'll calculate the calories and macros instantly. You can also describe exercise to log burned calories.",
      foods: null,
      insight: null,
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    // Simulate AI response delay
    await new Promise(r => setTimeout(r, 1200))
    const resp = MOCK_RESPONSES.default(userMsg)
    setMessages(prev => [...prev, { role: 'assistant', ...resp }])
    setLoading(false)
  }

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  return (
    <div className={`bg-white rounded-xl border border-gray-100 flex flex-col ${compact ? 'h-full' : 'h-[600px]'}`}>
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-brand-400 flex items-center justify-center">
          <Bot size={13} className="text-white" />
        </div>
        <span className="text-[13px] font-semibold text-gray-800">AI Nutrition Assistant</span>
        <span className="ml-auto text-[10px] text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full font-medium">Powered by Gemini</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${
              msg.role === 'user' ? 'bg-gray-100' : 'bg-brand-50'
            }`}>
              {msg.role === 'user'
                ? <User size={12} className="text-gray-500" />
                : <Bot size={12} className="text-brand-600" />
              }
            </div>
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`rounded-xl px-3 py-2 text-[13px] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-400 text-white rounded-tr-sm'
                  : 'bg-gray-50 text-gray-700 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
              {msg.foods?.map((food, j) => <NutritionCard key={j} food={food} />)}
              {msg.insight && (
                <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 text-[11.5px] text-amber-700 leading-relaxed">
                  💡 {msg.insight}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center">
              <Bot size={12} className="text-brand-600" />
            </div>
            <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2 flex items-center gap-1.5">
              <Loader2 size={12} className="text-brand-400 animate-spin" />
              <span className="text-[12px] text-gray-400">Analysing meal...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-brand-300 focus-within:ring-2 focus-within:ring-brand-50 transition-all">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="e.g. I ate 2 idlis and sambar for breakfast..."
              rows={2}
              className="w-full bg-transparent text-[13px] text-gray-800 placeholder-gray-400 resize-none outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <button className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors">
              <Camera size={14} />
            </button>
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-lg bg-brand-400 flex items-center justify-center text-white hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={13} />
            </button>
          </div>
        </div>
        <p className="text-[10.5px] text-gray-400 mt-2 text-center">Nutrition values are AI estimates. Consult a dietitian for medical advice.</p>
      </div>
    </div>
  )
}
