import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppLayout from "./components/AppLayout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Reports from "./pages/Reports";
import Weight from "./pages/Weight";
import Water from "./pages/Water";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BugReport from "./pages/BugReport";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import PublicRoute from "./components/PublicRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* Only unauthenticated users can access these pages */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<AppLayout />}>
            <Route path="/overview" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/weight" element={<Weight />} />
            {/* <Route path="/water" element={<Water />} /> water page is disabled for now */}
            {/* <Route path="/favorites" element={<Favorites />} /> favorites page is disabled for now */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/report-issues" element={<BugReport />} />
          </Route>

          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
