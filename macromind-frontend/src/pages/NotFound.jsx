
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Leaf } from "lucide-react";
import { usePageTitle } from "../hooks/usePageTitle";

export default function NotFound() {
  usePageTitle("Page not found");

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-12"
          aria-label="MacroMind home"
        >
          <span className="w-9 h-9 rounded-xl bg-brand-400 flex items-center justify-center">
            <Leaf size={20} className="text-white" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold text-gray-900">
            MacroMind
          </span>
        </Link>

        <div className="mb-6">
          <p className="text-7xl sm:text-8xl font-bold tracking-tight text-brand-400">
            404
          </p>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Oops! Page not found
        </h1>

        <p className="mt-3 text-sm sm:text-base leading-7 text-gray-500">
          Looks like this page went off the menu. The link may be incorrect,
          or the page may no longer exist.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-brand-400 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-600"
          >
            <Home size={17} aria-hidden="true" />
            Back to home
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            Go back
          </button>
        </div>

        <p className="mt-10 text-xs text-gray-400">
          Need help? You can report an issue after signing in.
        </p>
      </div>
    </main>
  );
}
