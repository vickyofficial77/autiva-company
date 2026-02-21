import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Payment from "./pages/Payment";
import Activate from "./pages/Activate";
import Tasks from "./pages/Tasks";
import Dashboard from "./pages/Dashboard";

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth() as any;
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireActivated({ children }: { children: JSX.Element }) {
  const { profile, loading } = useAuth() as any;
  if (loading) return null;
  if (!profile?.active) return <Navigate to="/activate" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />

      {/* Authed */}
      <Route
        path="/payment"
        element={
          <RequireAuth>
            <Payment />
          </RequireAuth>
        }
      />
      <Route
        path="/activate"
        element={
          <RequireAuth>
            <Activate />
          </RequireAuth>
        }
      />

      {/* ✅ Dashboard: authed only (does NOT redirect to tasks) */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />

      {/* ✅ Tasks: must be activated */}
      <Route
        path="/tasks"
        element={
          <RequireAuth>
            <RequireActivated>
              <Tasks />
            </RequireActivated>
          </RequireAuth>
        }
      />

      {/* Default */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}