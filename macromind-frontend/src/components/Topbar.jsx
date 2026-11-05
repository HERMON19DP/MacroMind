export default function Topbar({ title, subtitle }) {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold tracking-tight text-gray-900 md:text-xl">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-gray-400 md:text-sm">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
