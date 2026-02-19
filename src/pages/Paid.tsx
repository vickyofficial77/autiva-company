import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Paid() {
  const { profile } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    // if not active, send back to payment
    if (profile && !profile.active) nav("/payment");
  }, [profile, nav]);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Payment Verified ✅</h1>
      <p className="mt-2 text-slate-600">
        Your account is now activated. You can access your internship tasks.
      </p>

      <div className="mt-6 flex gap-3">
        <Link
          to="/tasks"
          className="inline-flex h-11 items-center rounded-lg bg-slate-950 px-4 text-white text-sm hover:bg-slate-800"
        >
          Go to Tasks
        </Link>
        <Link
          to="/dashboard"
          className="inline-flex h-11 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm hover:bg-slate-50"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
