import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart2,
  Scale,
  Droplets,
  Settings,
  LogOut,
  Leaf,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "./ConfirmDialog";

const navItems = [
  { label: "Dashboard", to: "/overview", icon: LayoutDashboard },
  { label: "AI Chat", to: "/chat", icon: MessageSquare },
  { label: "Reports", to: "/reports", icon: BarChart2 },
  { label: "Weight", to: "/weight", icon: Scale },
  { label: "Water", to: "/water", icon: Droplets },
  // Favorites page is disabled for now.
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);

    // Replace the current route and reset navigation to the homepage.
    window.history.replaceState(null, "", "/");
    navigate("/", { replace: true });
  };

  return (
    <>
      <aside className="w-56 shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-2 border-b border-gray-100">
          <div className="w-7 h-7 rounded-lg bg-brand-400 flex items-center justify-center">
            <Leaf size={15} className="text-white" />
          </div>
          <span className="text-[15px] font-semibold text-gray-900 tracking-tight">
            Journable
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}

          <div className="mt-2 pt-2 border-t border-gray-100">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`
              }
            >
              <Settings size={16} />
              Settings
            </NavLink>
          </div>
        </nav>

        {/* User */}
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

      {/* Sign-out confirmation */}
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
