import React from "react";
import { Navigate, Route, Routes as RRDRoutes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Payment from "../pages/Payment";
import Whatsapp from "../pages/Whatsapp";
import Activate from "../pages/Activate";
import Dashboard from "../pages/Dashboard";
import Admin from "../pages/Admin";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8">Loading…</div>;
  if (!user) return <Navigate to="/register" replace />;
  return <>{children}</>;
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  if (loading) return <div className="p-8">Loading…</div>;
  if (!user) return <Navigate to="/register" replace />;
  if (profile?.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export function Routes() {
  return (
    <RRDRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/payment" element={<RequireAuth><Payment /></RequireAuth>} />
      <Route path="/whatsapp" element={<RequireAuth><Whatsapp /></RequireAuth>} />
      <Route path="/activate" element={<RequireAuth><Activate /></RequireAuth>} />
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </RRDRoutes>
  );
}
