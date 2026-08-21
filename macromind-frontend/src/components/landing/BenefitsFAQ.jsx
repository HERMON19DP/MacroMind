import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, BrainCircuit, Repeat, GraduationCap, ChevronDown } from 'lucide-react'

const BENEFITS = [
  { icon: Clock, title: 'Save time', desc: 'No manual food searching — describe the meal and move on with your day.' },
  { icon: BrainCircuit, title: 'Understand nutrition', desc: 'See the macro breakdown behind every meal instantly, not just a calorie count.' },
  { icon: Repeat, title: 'Build consistency', desc: 'Logging takes seconds, so the daily habit actually sticks.' },
  { icon: GraduationCap, title: 'Learn better habits', desc: 'AI-powered suggestions nudge you toward better choices over time.' },
]

const FAQS = [
  { q: 'Does MacroMind support Indian food?', a: 'Yes — MacroMind is built with Indian home cooking in mind. Idli, dosa, sambar, dal, curd rice, and hundreds of other everyday dishes are recognized directly, with AI filling in anything outside the lookup.' },
  { q: 'How accurate is the AI analysis?', a: 'For common foods, estimates are based on standard nutrition data and portion sizes. For anything the AI has to estimate visually or from a description, treat the numbers as a close estimate rather than a lab measurement.' },
  { q: 'Can I upload meal photos?', a: 'Yes. Upload a photo of your plate from the AI Chat page and MacroMind will identify the foods and estimate calories and macros for you to review before saving.' },
  { q: 'Is my data private?', a: 'Your account is protected with JWT authentication and your password is encrypted before it ever touches the database. Your meal and health data is yours — it is never sold or shared.' },
  { q: 'Is MacroMind free?', a: 'Yes, you can create an account and start tracking meals for free — no credit card required to get started.' },
]

function FAQItem({ item, isOpen, onClick }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-[14.5px] font-medium text-gray-900">{item.q}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="text-[13.5px] text-gray-500 leading-relaxed pb-5 pr-8">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function BenefitsFAQ() {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <>
      {/* <section className="py-24 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="max-w-xl mb-14">
            <p className="text-[12px] font-semibold text-brand-600 uppercase tracking-wide mb-3">Why MacroMind</p>
            <h2 className="text-[32px] sm:text-[38px] font-semibold text-gray-900 tracking-tight leading-tight">
              Built around outcomes, not just features
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl bg-gradient-to-br from-brand-50 to-cyan-50 border border-brand-100 p-7"
              >
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center mb-5 shadow-sm">
                  <b.icon size={20} className="text-brand-600" />
                </div>
                <h3 className="text-[17px] font-semibold text-gray-900 mb-1.5">{b.title}</h3>
                <p className="text-[13.5px] text-gray-500 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      <section id="faq" className="py-24 sm:py-28 bg-gray-50">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <p className="text-[12px] font-semibold text-brand-600 uppercase tracking-wide mb-3">FAQ</p>
            <h2 className="text-[32px] sm:text-[38px] font-semibold text-gray-900 tracking-tight">
              Questions people ask before starting
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 px-6">
            {FAQS.map((item, i) => (
              <FAQItem
                key={item.q}
                item={item}
                isOpen={openIdx === i}
                onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
