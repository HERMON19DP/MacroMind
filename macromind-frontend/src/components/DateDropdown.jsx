import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, Calendar } from "lucide-react";

export default function DateDropdown({ dateStr }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const menuItems = [
    {
      label: "Today",
      active: true,
    },
    {
      label: "Yesterday",
      disabled: true,
    },
    {
      label: "Choose Date",
      disabled: true,
      icon: Calendar,
    },
  ];

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block"
    >
      {/* Trigger */}

      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 group"
      >
        <span className="text-2xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
          Today
        </span>

        <ChevronDown
          size={20}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <p className="text-sm text-gray-400 mt-1">
        {dateStr}
      </p>

      {/* Dropdown */}

      {open && (
        <div className="absolute mt-3 w-56 bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden z-50">

          {menuItems.map((item) => (
            <button
              key={item.label}
              disabled={item.disabled}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                item.disabled
                  ? "text-gray-300 cursor-not-allowed"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                {item.icon && (
                  <item.icon size={16} />
                )}

                {item.label}
              </div>

              {item.active && (
                <Check
                  size={16}
                  className="text-brand-500"
                />
              )}
            </button>
          ))}

          <div className="px-4 py-2 border-t border-gray-100 text-[11px] text-gray-400">
            Date navigation coming soon
          </div>

        </div>
      )}
    </div>
  );
}