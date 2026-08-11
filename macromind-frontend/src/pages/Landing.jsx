import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Leaf,
  Menu,
  X,
  Flame,
  Droplet,
  Wheat,
  Beef,
  TrendingDown,
  Sparkles,
} from "lucide-react";

import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import AIShowcase from "../components/landing/AIShowcase";
import DashboardShowcase from "../components/landing/DashboardShowcase";
import BenefitsFAQ from "../components/landing/BenefitsFAQ";
import CTAFooter from "../components/landing/CTAFooter";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { usePageTitle } from '../hooks/usePageTitle'

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const NAV_LINKS = [
  { label: "Features", id: "features" },
  { label: "How it works", id: "how-it-works" },
  { label: "AI", id: "ai" },
  { label: "FAQ", id: "faq" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2"
        >
          <div className="w-7 h-7 rounded-lg bg-brand-400 flex items-center justify-center">
            <Leaf size={15} className="text-white" />
          </div>
          <span className="text-[15px] font-semibold text-gray-900 tracking-tight">
            MacroMind
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollToSection(l.id)}
              className="text-[13.5px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              to="/overview"
              className="text-[13.5px] font-medium text-white bg-brand-400 hover:bg-brand-600 transition-colors px-4 py-2 rounded-xl"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-[13.5px] font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="text-[13.5px] font-medium text-white bg-brand-400 hover:bg-brand-600 transition-colors px-4 py-2 rounded-xl"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-9 h-9 flex items-center justify-center text-gray-600"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                scrollToSection(l.id);
                setOpen(false);
              }}
              className="text-[14px] font-medium text-gray-600 text-left"
            >
              {l.label}
            </button>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
            {isAuthenticated ? (
              <Link
                to="/overview"
                className="text-[14px] font-medium text-white bg-brand-400 rounded-xl py-2.5 text-center"
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[14px] font-medium text-gray-600 py-2"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-[14px] font-medium text-white bg-brand-400 rounded-xl py-2.5 text-center"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

const floatingCards = [
  {
    icon: Sparkles,
    text: "AI analysis complete",
    top: "4%",
    left: "-8%",
    delay: 0.4,
  },
  {
    icon: Beef,
    text: "+42g protein logged",
    top: "18%",
    right: "-12%",
    delay: 0.7,
  },
  {
    icon: TrendingDown,
    text: "92% of goal reached",
    bottom: "10%",
    left: "-10%",
    delay: 1.0,
  },
];

function DashboardMockup() {
  const rows = [
    {
      key: "calories",
      label: "Calories",
      value: 1640,
      goal: 2200,
      unit: "",
      icon: Flame,
      color: "text-brand-600",
      bar: "bg-brand-400",
    },
    {
      key: "protein",
      label: "Protein",
      value: 98,
      goal: 130,
      unit: "g",
      icon: Beef,
      color: "text-violet-600",
      bar: "bg-violet-400",
    },
    {
      key: "carbs",
      label: "Carbs",
      value: 172,
      goal: 240,
      unit: "g",
      icon: Wheat,
      color: "text-blue-600",
      bar: "bg-blue-400",
    },
    {
      key: "water",
      label: "Water",
      value: 1.6,
      goal: 3,
      unit: "L",
      icon: Droplet,
      color: "text-cyan-600",
      bar: "bg-cyan-400",
    },
  ];

  const week = [40, 65, 52, 80, 44, 70, 90];

  return (
    <div className="relative">
      {floatingCards.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: [0, -8, 0] }}
          transition={{
            opacity: { duration: 0.6, delay: c.delay },
            y: {
              duration: 4.5 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: c.delay,
            },
          }}
          className="hidden lg:flex absolute z-20 items-center gap-2 bg-white rounded-xl border border-gray-100 shadow-lg px-3.5 py-2.5"
          style={{ top: c.top, left: c.left, right: c.right, bottom: c.bottom }}
        >
          <div className="w-6 h-6 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
            <c.icon size={12} className="text-brand-600" />
          </div>
          <span className="text-[12px] font-medium text-gray-700 whitespace-nowrap">
            {c.text}
          </span>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: [0, -10, 0] }}
        transition={{
          opacity: { duration: 0.7 },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
        className="relative z-10 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-brand-900/10 p-5 w-full max-w-md mx-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">
              Today
            </p>
            <p className="text-[15px] font-semibold text-gray-900">
              Wednesday, Aug 6
            </p>
          </div>
          <div className="relative w-12 h-12">
            <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="5"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="#1D9E75"
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 20}
                strokeDashoffset={2 * Math.PI * 20 * (1 - 0.74)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-brand-600">
              74%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {rows.map((r) => {
            const pct = Math.min(Math.round((r.value / r.goal) * 100), 100);
            return (
              <div key={r.key} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <r.icon size={11} className={r.color} />
                  <span className="text-[10.5px] text-gray-400 font-medium">
                    {r.label}
                  </span>
                </div>
                <p className="text-[15px] font-semibold text-gray-900 leading-none mb-2">
                  {r.value}
                  {r.unit}{" "}
                  <span className="text-[10px] font-normal text-gray-400">
                    / {r.goal}
                    {r.unit}
                  </span>
                </p>
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${r.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-50 rounded-xl p-3 mb-4">
          <p className="text-[10.5px] text-gray-400 font-medium mb-2">
            This week
          </p>
          <div className="flex items-end gap-1.5 h-12">
            {week.map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-brand-200 rounded-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-xl px-3 py-2">
          <div className="w-5 h-5 rounded-md bg-brand-400 flex items-center justify-center shrink-0">
            <Sparkles size={10} className="text-white" />
          </div>
          <p className="text-[11px] text-brand-700 leading-snug">
            "2 idlis and sambar" logged — 143 kcal, 12.7g protein
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, #9FE1CB 0%, #A5E9F0 45%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded-full pl-2 pr-3 py-1 mb-6 shadow-sm">
            <span className="w-4 h-4 rounded-full bg-gradient-to-br from-brand-400 to-cyan-400 flex items-center justify-center">
              <Sparkles size={9} className="text-white" />
            </span>
            <span className="text-[11.5px] font-medium text-gray-600">
              Now understands Indian home cooking
            </span>
          </div>

          <h1 className="text-[42px] sm:text-[54px] leading-[1.05] font-semibold text-gray-900 tracking-tight mb-5">
            AI-powered nutrition that thinks like a dietitian
          </h1>

          <p className="text-[16px] sm:text-[17px] text-gray-500 leading-relaxed max-w-md mb-8">
            Describe what you ate, or snap a photo. MacroMind reads it,
            calculates the calories and macros, and keeps your goals on track —
            no manual food search required.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-brand-400 hover:bg-brand-600 text-white font-medium text-[14px] px-6 py-3 rounded-xl transition-colors"
            >
              Start free
            </Link>
            <button
              onClick={() => scrollToSection("ai")}
              className="inline-flex items-center justify-center border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium text-[14px] px-6 py-3 rounded-xl transition-colors"
            >
              See it analyze a meal
            </button>
          </div>

          <p className="text-[12px] text-gray-400">
            No credit card required &nbsp;·&nbsp; Free to get started
            &nbsp;·&nbsp; AI-powered
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
}

export default function Landing() {
  usePageTitle()
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/overview" replace />
  
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <AIShowcase />
      <DashboardShowcase />
      <BenefitsFAQ />
      <CTAFooter />
    </div>
  );
}
