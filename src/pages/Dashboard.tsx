import { useEffect, useMemo, useState } from "react";
import Shell from "../components/Shell";
import { Badge, Button, Divider, SectionHead } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { db } from "../lib/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import type { Task } from "../types";
import { ArrowRight, CreditCard, UserCircle2, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const { profile, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const active = !!profile?.active;

  useEffect(() => {
    (async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const q = query(
          collection(db, "tasks"),
          where("uid", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snaps = await getDocs(q);
        setTasks(snaps.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      } catch (err: any) {
        console.error("Error fetching tasks:", err);
        if (err.code === "failed-precondition") {
          setError(
            "The database index is still building. Please wait a few minutes and refresh."
          );
        } else if (err.code === "permission-denied") {
          setError("You don't have permission to view tasks. Contact support.");
        } else {
          setError("Failed to load tasks. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const statusBadge = useMemo(() => {
    return active ? (
      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Active ✅</Badge>
    ) : (
      <Badge className="bg-amber-50 text-amber-700 border-amber-200">Pending 🔒</Badge>
    );
  }, [active]);

  return (
    <Shell>
      <SectionHead
        title="Student dashboard"
        desc={
          active
            ? "Your account is active — tasks unlocked."
            : "Your account is not active — enter activation code to unlock tasks."
        }
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm p-6 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md">
                <UserCircle2 className="h-6 w-6" />
              </div>
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  {profile?.name || "Student"}
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile?.level && (
                    <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                      {profile.level}
                    </Badge>
                  )}
                  {statusBadge}
                </div>
              </div>
            </div>

            <Divider className="my-5" />

            <div className="space-y-3">
              <ProfileRow label="School" value={profile?.school ?? "-"} />
              <ProfileRow label="Phone" value={profile?.phone ?? "-"} />
              <ProfileRow label="Email" value={profile?.email ?? "-"} />
            </div>

            {!active && (
              <a href="/activate" className="mt-6 block">
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                  Activate now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm p-6 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Tasks</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Assigned by admin after activation
                </p>
              </div>
              <a href="/payment">
                <Button
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Payment
                </Button>
              </a>
            </div>

            <Divider className="my-6" />

            {!active ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-center">
                <p className="text-sm text-slate-600">
                  🔒 Activate your account first to access tasks.
                </p>
              </div>
            ) : loading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50/80 p-5 text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-center">
                <p className="text-sm text-slate-600">
                  📭 No tasks assigned yet. Check again later.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50/80">
                    <tr>
                      <th className="px-5 py-4 text-left font-medium text-slate-600">
                        Title
                      </th>
                      <th className="px-5 py-4 text-left font-medium text-slate-600">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((t, idx) => (
                      <tr
                        key={t.id}
                        className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"}
                      >
                        <td className="px-5 py-4 font-medium text-slate-900">
                          {t.title}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 border border-slate-200/50">
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="mt-5 text-xs text-slate-400 flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Tip: Always keep Transaction ID and WhatsApp proof for faster verification.
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50/50 px-4 py-3 backdrop-blur-sm">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  );
}