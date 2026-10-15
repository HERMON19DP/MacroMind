import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";

function dateOnly(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function sameDay(a, b) {
  return toISODate(a) === toISODate(b);
}

export default function DateDropdown({ selectedDate, onChange, dateStr }) {
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );

  const dropdownRef = useRef(null);
  const today = dateOnly(new Date());

  useEffect(() => {
    if (!open) return;

    function handleOutsideClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setVisibleMonth(
        new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
      );
    }
  }, [open, selectedDate]);

  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Sunday-first calendar.
    const cells = Array(firstDay.getDay()).fill(null);

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push(new Date(year, month, day));
    }

    while (cells.length % 7 !== 0) cells.push(null);

    return cells;
  }, [visibleMonth]);

  const monthLabel = visibleMonth.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const isCurrentMonth =
    visibleMonth.getFullYear() === today.getFullYear() &&
    visibleMonth.getMonth() === today.getMonth();

  const selectedLabel = sameDay(selectedDate, today)
    ? "Today"
    : (() => {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (sameDay(selectedDate, yesterday)) return "Yesterday";

        return selectedDate.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year:
            selectedDate.getFullYear() === today.getFullYear()
              ? undefined
              : "numeric",
        });
      })();

  function chooseDate(date) {
    if (!date || dateOnly(date) > today) return;

    onChange(dateOnly(date));
    setOpen(false);
  }

  function changeMonth(amount) {
    setVisibleMonth((current) => {
      const next = new Date(
        current.getFullYear(),
        current.getMonth() + amount,
        1,
      );

      const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      return next > currentMonth ? currentMonth : next;
    });
  }

  function chooseMonth(monthIndex) {
    const next = new Date(visibleMonth.getFullYear(), monthIndex, 1);

    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    if (next <= currentMonth) setVisibleMonth(next);
  }

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="group flex items-center gap-2 rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
      >
        <span className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-brand-600">
          {selectedLabel}
        </span>

        <ChevronDown
          size={20}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <p className="mt-1 text-sm text-gray-400">{dateStr}</p>

      {open && (
        <div
          role="dialog"
          aria-label="Choose a date"
          className="absolute left-0 top-full z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-gray-100 bg-white p-4 shadow-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <CalendarDays size={16} className="text-brand-500" />
              {monthLabel}
            </div>

            <button
              type="button"
              onClick={() => changeMonth(1)}
              disabled={isCurrentMonth}
              aria-label="Next month"
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <span
                key={`${day}-${index}`}
                className="py-2 text-xs font-medium text-gray-400"
              >
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <span key={`empty-${index}`} className="h-9" />;
              }

              const future = dateOnly(date) > today;
              const active = sameDay(date, selectedDate);
              const isToday = sameDay(date, today);

              return (
                <button
                  key={toISODate(date)}
                  type="button"
                  disabled={future}
                  onClick={() => chooseDate(date)}
                  aria-pressed={active}
                  aria-label={date.toLocaleDateString("en-IN", {
                    dateStyle: "full",
                  })}
                  className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors
                    ${active ? "bg-brand-500 font-semibold text-green" : ""}
                    ${
                      !active && isToday
                        ? "border border-brand-500 font-semibold text-brand-600"
                        : ""  
                    }
                    ${
                      !active && !future
                        ? "text-gray-700 hover:bg-gray-100"
                        : ""
                    }
                    ${future ? "cursor-not-allowed text-gray-300" : ""}
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-4 border-t border-gray-100 pt-3">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Jump to month
            </p>

            <div className="grid grid-cols-6 gap-1">
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ].map((month, index) => {
                const active = visibleMonth.getMonth() === index;

                const targetMonth = new Date(
                  visibleMonth.getFullYear(),
                  index,
                  1,
                );

                const currentMonth = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  1,
                );

                const futureMonth = targetMonth > currentMonth;

                return (
                  <button
                    key={month}
                    type="button"
                    disabled={futureMonth}
                    onClick={() => chooseMonth(index)}
                    className={`rounded-lg px-1 py-2 text-xs transition-colors
                      ${
                        active
                          ? "bg-brand-500 font-medium text-green"
                          : "text-gray-600 hover:bg-gray-100"
                      }
                      ${futureMonth ? "cursor-not-allowed opacity-30" : ""}
                    `}
                  >
                    {month}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => chooseDate(today)}
            disabled={sameDay(selectedDate, today)}
            className="mt-3 flex w-full items-center justify-center rounded-xl bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-default disabled:opacity-50"
          >
            Go to today
            {sameDay(selectedDate, today) && (
              <Check size={14} className="ml-1" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
