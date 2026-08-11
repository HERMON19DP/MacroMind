import { motion } from 'framer-motion'
import { Camera, MessageSquareText, LayoutDashboard, Target, LineChart, ShieldCheck } from 'lucide-react'

const FEATURES = [
  {
    icon: Camera,
    title: 'AI meal recognition',
    desc: 'Upload a photo of your plate and let AI estimate the foods, portions, calories, and macros in seconds.',
  },
  {
    icon: MessageSquareText,
    title: 'Natural language logging',
    desc: `Type meals the way you'd say them out loud — "2 dosa with sambar" — and MacroMind understands the rest.`,
  },
  {
    icon: LayoutDashboard,
    title: 'Nutrition dashboard',
    desc: 'Calories, macros, water, and weight in one view, updated the moment you log something.',
  },
  {
    icon: Target,
    title: 'Personalized goals',
    desc: 'Set targets for weight loss, gain, or maintenance, and get a calorie and macro plan built around them.',
  },
  {
    icon: LineChart,
    title: 'Weekly insights',
    desc: 'Charts on consistency and nutrition trends, so you can see what a good week actually looked like.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by design',
    desc: 'JWT authentication and encrypted passwords keep your health data yours — never sold, never shared.',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06 },
  }),
}

export default function Features() {
  return (
    <section id="features" className="py-24 sm:py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-xl mb-14">
          <p className="text-[12px] font-semibold text-brand-600 uppercase tracking-wide mb-3">Features</p>
          <h2 className="text-[32px] sm:text-[38px] font-semibold text-gray-900 tracking-tight leading-tight">
            Everything nutrition tracking should have been from the start
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              whileHover={{ y: -4 }}
              className="group relative bg-white rounded-2xl border border-gray-100 p-6 transition-shadow hover:shadow-lg hover:shadow-brand-900/5"
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  padding: 1,
                  background: 'linear-gradient(135deg, #5DCAA5, #47bfff)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
                aria-hidden
              />
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand-100 transition-colors">
                <f.icon size={18} className="text-brand-600" />
              </div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-1.5">{f.title}</h3>
              <p className="text-[13.5px] text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
