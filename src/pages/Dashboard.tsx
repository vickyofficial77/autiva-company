import { useEffect, useMemo, useState } from "react";
import Shell from "../components/Shell";
import { Badge, Button, SectionHead } from "../components/ui";
import { db } from "../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { CheckCircle2, Clock, ArrowRight, User } from "lucide-react";

type Level = "L3" | "L4" | "L5";

type TaskRow = {
  id: string;
  title: string;
  description: string;
  level?: Level | null;
  uid?: string | null;
  audience?: "level" | "student";
  deadline?: any;
  createdAt?: any;
};

type SubRow = {
  id: string;
  taskId: string;
  uid: string;
  message: string;
  createdAt?: any;
};

function toMillis(ts: any): number {
  if (!ts) return 0;
  if (typeof ts === "number") return ts;
  if (ts?.toMillis) return ts.toMillis();
  if (ts?.seconds) return ts.seconds * 1000;
  return 0;
}

function dayKey(ms: number) {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function lastNDays(n: number) {
  const out: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push(dayKey(d.getTime()));
  }
  return out;
}

const PIE_COLORS = ["#0f172a", "#22c55e", "#f59e0b", "#64748b"];

export default function StudentDashboard() {
  const { user, profile, loading } = useAuth() as any;
  const nav = useNavigate();

  const [allTasks, setAllTasks] = useState<TaskRow[]>([]);
  const [allSubs, setAllSubs] = useState<SubRow[]>([]);

  useEffect(() => {
    if (!loading && !user) nav("/login");
    if (!loading && user && profile && !profile.active) nav("/activate");
  }, [loading, user, profile, nav]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "tasks"), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as TaskRow[];
      data.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
      setAllTasks(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "submissions"), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as SubRow[];
      data.sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
      setAllSubs(data);
    });
    return () => unsub();
  }, []);

  const myTasks = useMemo(() => {
    if (!user || !profile?.level) return [];
    const lvl = profile.level as Level;

    // student can see: personal tasks OR level tasks
    return allTasks.filter((t) => {
      const personal = t.uid && t.uid === user.uid;
      const levelTask = t.level && t.level === lvl && !t.uid;
      return personal || levelTask;
    });
  }, [allTasks, user, profile?.level]);

  const mySubs = useMemo(() => {
    if (!user) return [];
    return allSubs.filter((s) => s.uid === user.uid);
  }, [allSubs, user]);

  const submittedTaskIds = useMemo(() => new Set(mySubs.map((s) => s.taskId)), [mySubs]);

  const perf = useMemo(() => {
    const assigned = myTasks.length;
    const submitted = myTasks.filter((t) => submittedTaskIds.has(t.id)).length;
    const pending = assigned - submitted;

    // on-time rate
    let onTime = 0;
    mySubs.forEach((s) => {
      const task = myTasks.find((t) => t.id === s.taskId);
      if (!task?.deadline?.toMillis) return;
      const subMs = toMillis(s.createdAt);
      const dlMs = task.deadline.toMillis();
      if (subMs && dlMs && subMs <= dlMs) onTime += 1;
    });

    const onTimeRate = submitted === 0 ? 0 : Math.round((onTime / submitted) * 100);
    const completionRate = assigned === 0 ? 0 : Math.round((submitted / assigned) * 100);

    return { assigned, submitted, pending, onTimeRate, completionRate };
  }, [myTasks, mySubs, submittedTaskIds]);

  const statusPie = useMemo(() => {
    return [
      { name: "Submitted", value: perf.submitted },
      { name: "Pending", value: perf.pending },
    ];
  }, [perf.submitted, perf.pending]);

  const submissions7d = useMemo(() => {
    const days = lastNDays(7);
    const count = new Map<string, number>();

    mySubs.forEach((s) => {
      const ms = toMillis(s.createdAt);
      if (!ms) return;
      const k = dayKey(ms);
      count.set(k, (count.get(k) ?? 0) + 1);
    });

    return days.map((d) => ({
      day: d.slice(5),
      submissions: count.get(d) ?? 0,
    }));
  }, [mySubs]);

  const upcoming = useMemo(() => {
    const now = Date.now();
    const rows = myTasks
      .map((t) => {
        const dl = t.deadline?.toMillis ? t.deadline.toMillis() : 0;
        const done = submittedTaskIds.has(t.id);
        return { ...t, dl, done };
      })
      .filter((t: any) => !t.done)
      .sort((a: any, b: any) => (a.dl || 0) - (b.dl || 0));

    // show next 6
    return rows.slice(0, 6);
  }, [myTasks, submittedTaskIds]);

  const recentDone = useMemo(() => {
    const rows = mySubs.slice(0, 6);
    return rows;
  }, [mySubs]);

  function deadlineText(deadline: any) {
    if (!deadline?.toDate) return "No deadline";
    return (deadline.toDate() as Date).toLocaleString();
  }

  return (
    <Shell>
      <div className="max-w-5xl mx-auto">
        <SectionHead
          title="Dashboard"
          desc="Track your real progress, deadlines and submissions."
        />

        {/* Profile + KPIs */}
        <div className="mt-6 grid gap-4 lg:grid-cols-4">
          <div className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm p-5 shadow-md lg:col-span-1">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <User className="h-4 w-4" /> Profile
            </div>
            <div className="mt-3 text-sm font-semibold text-slate-900">{profile?.name ?? "Student"}</div>
            <div className="mt-1 text-xs text-slate-500">{profile?.email}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile?.level ? <Badge>{profile.level}</Badge> : null}
              <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">Activated ✅</Badge>
            </div>

            <div className="mt-4">
              <Link to="/tasks">
                <Button className="w-full bg-slate-950 text-white hover:bg-slate-800">
                  Go to Tasks <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <Kpi title="Assigned tasks" value={perf.assigned} sub="tasks you can access" />
          <Kpi title="Submitted" value={perf.submitted} sub="completed tasks" tone="emerald" />
          <Kpi title="Completion rate" value={`${perf.completionRate}%`} sub={`on-time ${perf.onTimeRate}%`} tone="amber" />
        </div>

        {/* Charts */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Panel title="Submission status" subtitle="Submitted vs Pending">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusPie} dataKey="value" nameKey="name" outerRadius={90} label>
                    {statusPie.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Your submissions (last 7 days)" subtitle="Activity trend">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={submissions7d}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="submissions" stroke="#22c55e" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        {/* Real sections: upcoming + recent submissions */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Panel title="Upcoming deadlines" subtitle="Pending tasks sorted by nearest deadline">
            {upcoming.length === 0 ? (
              <div className="text-sm text-slate-500">No pending tasks right now 🎉</div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((t: any) => (
                  <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900 truncate">{t.title}</div>
                        <div className="mt-1 text-xs text-slate-500 truncate">{t.description}</div>
                      </div>
                      <Badge className="border-amber-200 bg-amber-50 text-amber-700">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> Pending
                        </span>
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      Deadline: <span className="font-medium">{deadlineText(t.deadline)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Recent submissions" subtitle="Your latest responses">
            {recentDone.length === 0 ? (
              <div className="text-sm text-slate-500">No submissions yet. Start with Tasks page.</div>
            ) : (
              <div className="space-y-3">
                {recentDone.map((s: any) => (
                  <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-slate-900">Task: {s.taskId}</div>
                      <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Submitted
                        </span>
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm text-slate-700 line-clamp-2">{s.message}</div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </Shell>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle?: string; children: any }) {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm p-6 shadow-md">
      <div className="mb-4">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        {subtitle ? <div className="mt-1 text-xs text-slate-500">{subtitle}</div> : null}
      </div>
      {children}
    </div>
  );
}

function Kpi({
  title,
  value,
  sub,
  tone,
}: {
  title: string;
  value: any;
  sub: string;
  tone?: "emerald" | "amber";
}) {
  const cls =
    tone === "emerald"
      ? "text-emerald-700"
      : tone === "amber"
      ? "text-amber-700"
      : "text-slate-600";
  return (
    <div className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm p-5 shadow-md">
      <div className={`text-xs font-medium ${cls}`}>{title}</div>
      <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{sub}</div>
    </div>
  );
}