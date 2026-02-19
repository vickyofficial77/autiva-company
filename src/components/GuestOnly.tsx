import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GuestOnly({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  if (loading) return null;

  // ✅ if already logged in:
  if (user) {
    // active -> tasks
    if (profile?.active) return <Navigate to="/tasks" replace />;
    // not active -> payment/activate
    return <Navigate to="/payment" replace />;
  }

  return <>{children}</>;
}
