import { motion } from 'framer-motion'
import { ArrowRight, Flame, Beef, Wheat, Droplet, CheckCircle2 } from 'lucide-react'

const INPUT_LINES = ['2 chapatis', 'Paneer curry', 'Rice', 'Curd']

const RESULT_MACROS = [
  { label: 'Calories', value: '612', icon: Flame },
  { label: 'Protein', value: '28g', icon: Beef },
  { label: 'Carbs', value: '71g', icon: Wheat },
  { label: 'Fat', value: '22g', icon: Droplet },
]

const SUGGESTIONS = [
  'Excellent protein intake for lunch',
  'Add a vegetable side to round out fiber',
  'Rice portion is slightly over your carb target',
]

export default function AIShowcase() {
  return (
    <section id="ai" className="py-24 sm:py-28 bg-gray-900">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-16">
          <p className="text-[12px] font-semibold text-brand-300 uppercase tracking-wide mb-3">AI, not just counting</p>
          <h2 className="text-[32px] sm:text-[40px] font-semibold text-white tracking-tight leading-tight">
            Powered by AI.
            <br />
            Not just calorie counting.
          </h2>
        </div>

        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-4 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-2xl border border-gray-700 p-5"
          >
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-3">Lunch</p>
            <div className="flex flex-col gap-2">
              {INPUT_LINES.map((l) => (
                <div key={l} className="flex items-center gap-2 text-[13.5px] text-gray-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-500 shrink-0" />
                  {l}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex md:flex-col items-center justify-center gap-1 text-brand-400"
          >
            <ArrowRight size={22} className="hidden md:block" />
            <ArrowRight size={22} className="md:hidden rotate-90" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-gray-800 rounded-2xl border border-gray-700 p-5"
          >
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-3">AI result</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {RESULT_MACROS.map((m) => (
                <div key={m.label} className="bg-gray-900/60 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <m.icon size={11} className="text-brand-400" />
                    <span className="text-[10px] text-gray-400">{m.label}</span>
                  </div>
                  <p className="text-[15px] font-semibold text-white">{m.value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5 border-t border-gray-700 pt-3">
              {SUGGESTIONS.map((s) => (
                <div key={s} className="flex items-start gap-1.5 text-[12px] text-gray-300 leading-snug">
                  <CheckCircle2 size={12} className="text-brand-400 shrink-0 mt-0.5" />
                  {s}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
