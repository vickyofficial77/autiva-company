import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireStudentActive({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const loc = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;

  // ✅ if already active, allow
  if (profile?.active) return <>{children}</>;

  // inactive -> must activate
  return <Navigate to="/activate" replace />;
}
