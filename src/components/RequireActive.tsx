import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireActive({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  // ✅ active users go through
  if (profile?.active) return <>{children}</>;

  // ✅ not active -> activation page
  return <Navigate to="/activate" replace />;
}
