import { useEffect, useMemo, useState } from "react";
import { db } from "../lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Shell from "../components/Shell";
import { Button, Input, SectionHead, Badge } from "../components/ui";
import { ArrowRight, LogOut, Upload, Link2, X } from "lucide-react";

type Level = "L3" | "L4" | "L5";

type Task = {
  id: string;
  title: string;
  description: string;
  audience?: "student" | "level";
  uid?: string | null;
  level?: Level | null;
  deadline?: any; // Timestamp
  createdAt?: any;
  createdBy?: string;
  fileName?: string | null;
};

export default function Tasks() {
  const { user, profile, loading, signOutNow } = useAuth() as any;
  const nav = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [err, setErr] = useState("");

  // submit UI
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) return nav("/login");
    if (profile && !profile.active) return nav("/activate");
  }, [loading, user, profile, nav]);

  const canLoad = useMemo(() => {
    return !!user && !!profile?.active && !!profile?.level;
  }, [user, profile?.active, profile?.level]);

  function isExpired(task: Task) {
    if (!task.deadline?.toDate) return false;
    const d = task.deadline.toDate() as Date;
    return d.getTime() <= Date.now();
  }

  function deadlineText(deadline: any) {
    if (!deadline?.toDate) return "No deadline";
    return (deadline.toDate() as Date).toLocaleString();
  }

  // ✅ Merge tasks from uid + level without OR query (no indexes)
  useEffect(() => {
    setErr("");
    setTasks([]);
    if (!canLoad) return;

    const map = new Map<string, Task>();

    const qLevel = query(
      collection(db, "tasks"),
      where("level", "==", profile!.level)
    );

    const qUid = query(
      collection(db, "tasks"),
      where("uid", "==", user!.uid)
    );

    const applySnap = (snap: any) => {
      snap.docs.forEach((d: any) => map.set(d.id, { id: d.id, ...(d.data() as any) }));
      const merged = Array.from(map.values())
        .filter((t) => !isExpired(t)) // ✅ deadline filter in frontend
        .sort((a, b) => {
          const ad = a.deadline?.toDate ? a.deadline.toDate().getTime() : Number.MAX_SAFE_INTEGER;
          const bd = b.deadline?.toDate ? b.deadline.toDate().getTime() : Number.MAX_SAFE_INTEGER;
          return ad - bd;
        });
      setTasks(merged);
    };

    const unsubLevel = onSnapshot(
      qLevel,
      (snap) => applySnap(snap),
      (e) => setErr(e?.message ?? "You don't have permission to view tasks.")
    );

    const unsubUid = onSnapshot(
      qUid,
      (snap) => applySnap(snap),
      (e) => setErr(e?.message ?? "You don't have permission to view tasks.")
    );

    return () => {
      unsubLevel();
      unsubUid();
    };
  }, [canLoad, user?.uid, profile?.level]);

  async function logout() {
    try {
      if (typeof signOutNow === "function") await signOutNow();
    } finally {
      nav("/");
    }
  }

  async function submitWork(taskId: string) {
    if (!user || !profile) return;
    const m = msg.trim();
    const l = link.trim();

    if (m.length < 5) return setToast("❌ Write a short submission message.");
    if (l && !/^https?:\/\//i.test(l)) return setToast("❌ Link must start with http:// or https://");

    setBusy(true);
    setToast("");

    try {
      // (optional) validate task exists
      const tSnap = await getDoc(doc(db, "tasks", taskId));
      if (!tSnap.exists()) throw new Error("Task not found.");

      await addDoc(collection(db, "submissions"), {
        taskId,
        uid: user.uid,
        level: profile.level,
        message: m,
        link: l || null,
        createdAt: serverTimestamp(),
      });

      setToast("✅ Submitted successfully!");
      setOpenTaskId(null);
      setMsg("");
      setLink("");
      setTimeout(() => setToast(""), 2500);
    } catch (e: any) {
      setToast(e?.message ?? "Submit failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <SectionHead
            title="Tasks"
            desc="Tasks assigned to your level and your account. Deadlines are enforced automatically."
            badge={`${tasks.length} available`}
          />

          <div className="flex flex-wrap items-center gap-2">
            {profile?.level ? <Badge>{profile.level}</Badge> : null}
            {profile?.active ? <Badge>Active ✅</Badge> : <Badge>Pending 🔒</Badge>}
            <Button variant="secondary" onClick={logout}>
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        {err ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/50 px-4 py-3 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        {toast ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm">
            {toast}
          </div>
        ) : null}

        {/* Profile card */}
        {profile ? (
          <div className="mt-6 rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm p-6 shadow-xl shadow-slate-200/50">
            <div className="grid gap-4 md:grid-cols-3">
              <Info label="Name" value={profile.name} />
              <Info label="Email" value={profile.email} />
              <Info label="Phone" value={profile.phone} />
              <Info label="School" value={profile.school} />
              <Info label="Level" value={profile.level} />
              <Info label="Status" value={profile.active ? "Activated" : "Pending"} />
            </div>
          </div>
        ) : null}

        <div className="mt-8 space-y-4">
          {tasks.length === 0 ? (
            <div className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm p-10 text-center shadow-2xl shadow-emerald-500/10">
              <p className="text-sm text-slate-500">No tasks available right now.</p>
            </div>
          ) : (
            tasks.map((t) => (
              <div
                key={t.id}
                className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm p-6 shadow-xl shadow-slate-200/50"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">{t.title}</h3>
                      {t.level ? <Badge>{t.level}</Badge> : null}
                      {t.uid ? <Badge>Personal</Badge> : <Badge>Level</Badge>}
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{t.description}</p>
                    <p className="mt-3 text-xs text-slate-500">
                      Deadline: <span className="font-medium">{deadlineText(t.deadline)}</span>
                      {t.fileName ? (
                        <span className="ml-2 inline-flex items-center gap-1">
                          <Upload className="h-3.5 w-3.5" /> {t.fileName}
                        </span>
                      ) : null}
                    </p>
                  </div>

                  <Button
                    onClick={() => setOpenTaskId((v) => (v === t.id ? null : t.id))}
                    variant="outline"
                    className="border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    Submit
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {openTaskId === t.id ? (
                  <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="grid gap-4">
                      <Input
                        label="Message"
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        placeholder="Explain what you did, tools used, what to check..."
                      />
                      <Input
                        label="Link (optional)"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="https://github.com/... or demo link"
                        rightIcon={<Link2 className="h-4 w-4" />}
                      />

                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => submitWork(t.id)}
                          disabled={busy}
                          className="bg-slate-950 text-white hover:bg-slate-800"
                        >
                          {busy ? "Submitting…" : "Send submission"}
                        </Button>
                        <Button
                          variant="outline"
                          className="border-slate-300 text-slate-700 hover:bg-slate-100"
                          onClick={() => {
                            setOpenTaskId(null);
                            setMsg("");
                            setLink("");
                          }}
                        >
                          <X className="h-4 w-4" /> Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>

        <p className="mt-8 text-xs text-slate-400 text-center">
          Tasks are assigned by admin based on your level or your account. Expired tasks are hidden automatically.
        </p>
      </div>
    </Shell>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="text-[11px] font-medium text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value || "—"}</div>
    </div>
  );
}