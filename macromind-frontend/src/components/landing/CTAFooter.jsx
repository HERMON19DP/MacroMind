import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", id: "features" },
      { label: "AI", id: "ai" },
      { label: "Dashboard", href: "#" }, // no in-page section yet
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", id: "faq" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export default function CTAFooter() {
  return (
    <>
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, #E1F5EE 0%, #ffffff 60%)",
          }}
        />
        {[...Array(10)].map((_, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute rounded-full bg-brand-300/40"
            style={{
              width: 4 + (i % 3) * 3,
              height: 4 + (i % 3) * 3,
              left: `${8 + i * 9}%`,
              top: `${20 + (i % 4) * 15}%`,
            }}
            animate={{ y: [0, -18, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}

        <div className="relative max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[34px] sm:text-[44px] font-semibold text-gray-900 tracking-tight leading-tight mb-4"
          >
            Ready to build healthier habits?
          </motion.h2>
          <p className="text-[15.5px] text-gray-500 leading-relaxed mb-9 max-w-md mx-auto">
            Join MacroMind and let AI help you understand your nutrition — one
            meal at a time.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center bg-brand-400 hover:bg-brand-600 text-white font-medium text-[15px] px-8 py-3.5 rounded-xl transition-colors shadow-lg shadow-brand-400/25"
          >
            Create free account
          </Link>
          <p className="text-[12.5px] text-gray-400 mt-5">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-brand-600 font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-brand-400 flex items-center justify-center">
                  <Leaf size={15} className="text-white" />
                </div>
                <span className="text-[15px] font-semibold text-gray-900">
                  MacroMind
                </span>
              </div>
              <p className="text-[12.5px] text-gray-400 leading-relaxed max-w-[200px]">
                AI-powered nutrition tracking that understands how you actually
                eat.
              </p>
            </div>

            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-[12px] font-semibold text-gray-900 mb-3.5">
                  {col.title}
                </p>
                <div className="flex flex-col gap-2.5">
                  {col.links.map((l) =>
                    l.id ? (
                      <button
                        key={l.label}
                        onClick={() => scrollToSection(l.id)}
                        className="text-[13px] text-gray-500 hover:text-brand-600 transition-colors text-left"
                      >
                        {l.label}
                      </button>
                    ) : (
                      <a
                        key={l.label}
                        href={l.href}
                        className="text-[13px] text-gray-500 hover:text-brand-600 transition-colors"
                      >
                        {l.label}
                      </a>
                    ),
                  )}
                </div>
              </div>
            ))}

            <div>
              <p className="text-[12px] font-semibold text-gray-900 mb-3.5">
                Social
              </p>
              <div className="flex flex-col gap-2.5">
                <a
                  href="#"
                  className="text-[13px] text-gray-500 hover:text-brand-600 transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="#"
                  className="text-[13px] text-gray-500 hover:text-brand-600 transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 text-[12px] text-gray-400">
            © MacroMind 2026
          </div>
        </div>
      </footer>
    </>
  );
}
