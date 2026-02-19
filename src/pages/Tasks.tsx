import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Shell from "../components/Shell";
import { SectionHead, Badge } from "../components/ui";
import { CheckCircle2, Circle, Clock } from "lucide-react";

type Task = { id: string; title: string; description: string; status: "todo" | "doing" | "done" };

export default function Tasks() {
  const { user, profile } = useAuth();
  const nav = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!user) return nav("/login");
    if (profile && !profile.active) return nav("/activate");

    const q = query(
      collection(db, "tasks"),
      where("uid", "==", user!.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });

    return () => unsub();
  }, [user, profile, nav]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case "doing":
        return <Clock className="h-4 w-4 text-amber-600" />;
      default:
        return <Circle className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "text-xs font-medium px-2.5 py-1 rounded-full border";
    switch (status) {
      case "done":
        return `${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-200`;
      case "doing":
        return `${baseClasses} bg-amber-50 text-amber-700 border-amber-200`;
      default:
        return `${baseClasses} bg-slate-50 text-slate-700 border-slate-200`;
    }
  };

  return (
    <Shell>
      <div className="max-w-3xl mx-auto">
        <SectionHead
          title="Tasks"
          desc="Your internship tasks – updated in real-time."
          badge={`${tasks.length} total`}
        />

        <div className="mt-8 space-y-4">
          {tasks.length === 0 ? (
            <div className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm p-8 text-center shadow-2xl shadow-emerald-500/10">
              <p className="text-sm text-slate-500">No tasks assigned yet. Check back later.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="group rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm p-6 shadow-xl shadow-slate-200/50 transition-all hover:shadow-emerald-500/10"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{task.description}</p>
                  </div>
                  <span className={getStatusBadge(task.status)}>
                    {task.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <p className="mt-6 text-xs text-slate-400 text-center">
          Tasks are assigned by your mentor. Complete them to build your portfolio.
        </p>
      </div>
    </Shell>
  );
}