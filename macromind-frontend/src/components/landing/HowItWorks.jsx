import { motion } from 'framer-motion'
import { UserPlus, MessageSquareText, Sparkles, ClipboardCheck, Trophy } from 'lucide-react'

const STEPS = [
  { icon: UserPlus, title: 'Create your account', desc: 'Tell us your goal — lose, gain, or maintain — and we set up your daily targets.' },
  { icon: MessageSquareText, title: 'Describe a meal or upload a photo', desc: `Write it in plain words or snap a picture. No searching a food database.` },
  { icon: Sparkles, title: 'AI analyzes the nutrition', desc: 'Calories, protein, carbs, and fat are calculated in seconds, portion by portion.' },
  { icon: ClipboardCheck, title: 'Review the insights', desc: 'See exactly how the meal fits into your day before it gets logged.' },
  { icon: Trophy, title: 'Reach your health goals', desc: 'Consistent, low-effort logging adds up to real progress over weeks, not days.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-16">
          <p className="text-[12px] font-semibold text-brand-600 uppercase tracking-wide mb-3">How it works</p>
          <h2 className="text-[32px] sm:text-[38px] font-semibold text-gray-900 tracking-tight">
            From a plate of food to a full breakdown, in one message
          </h2>
        </div>

        <div className="relative pl-2">
          <div className="absolute left-[23px] top-2 bottom-2 w-px bg-gray-200" aria-hidden />

          <div className="flex flex-col gap-10">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative flex gap-5"
              >
                <div className="relative z-10 w-12 h-12 rounded-full bg-white border-2 border-brand-200 flex items-center justify-center shrink-0">
                  <s.icon size={18} className="text-brand-600" />
                </div>
                <div className="pt-1.5">
                  <h3 className="text-[15.5px] font-semibold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-[13.5px] text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
