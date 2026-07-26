import { Bell, Search } from "lucide-react";

export default function Topbar({ title, subtitle }) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <Search size={18} />
          </button>

          <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <Bell size={18} />

            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
