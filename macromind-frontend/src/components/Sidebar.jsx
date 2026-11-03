import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart2,
  Scale,
  Settings,
  LogOut,
  Bug,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "./ConfirmDialog";
import logo from "../assets/macromind-logo-transparent.png";

const navItems = [
  { label: "Dashboard", to: "/overview", icon: LayoutDashboard },
  { label: "AI Chat", to: "/chat", icon: MessageSquare },
  { label: "Reports", to: "/reports", icon: BarChart2 },
  { label: "Weight", to: "/weight", icon: Scale },
  { label: "Settings", to: "/settings", icon: Settings },
  { label: "Issues", to: "/report-issues", icon: Bug },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);

    window.history.replaceState(null, "", "/");
    navigate("/", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors ${
      isActive
        ? "bg-brand-50 text-brand-600"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
    }`;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 bg-white border-r border-gray-100 flex-col h-screen sticky top-0">
        <div className="px-5 py-4 flex items-center gap-2.5 border-b border-gray-100">
          <img
            src={logo}
            alt="MacroMind"
            className="h-9 w-9 object-contain shrink-0"
          />

          <span className="text-[15px] font-semibold text-gray-900 tracking-tight">
            MacroMind
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              <Icon size={16} />
              {label === "Issues" ? "Report Bug / Issues" : label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-gray-100">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-[11px] font-semibold text-brand-600 shrink-0">
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-[11px] text-gray-400 truncate">{user?.goal}</p>
            </div>

            <button
              type="button"
              onClick={() => setShowLogoutDialog(true)}
              aria-label="Sign out"
              title="Sign out"
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden overflow-x-auto border-t border-gray-200 bg-white"
      >
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            className={({ isActive }) =>
              `flex min-w-[56px] flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-[9px] font-medium transition-colors ${
                isActive ? "text-brand-600" : "text-gray-500"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />
                <span className="whitespace-nowrap">{label}</span>
              </>
            )}
          </NavLink>
        ))}

        <button
          type="button"
          onClick={() => setShowLogoutDialog(true)}
          aria-label="Sign out"
          title="Sign out"
          className="flex min-w-[56px] flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-[9px] font-medium text-gray-500"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>

      <ConfirmDialog
        open={showLogoutDialog}
        title="Sign out?"
        message="Are you sure you want to sign out of your account?"
        confirmLabel="Sign out"
        cancelLabel="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </>
  );
}
