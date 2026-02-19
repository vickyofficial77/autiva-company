import { useEffect, useMemo, useState } from "react";
import Shell from "../components/Shell";
import { Badge, Button, Divider, Input, SectionHead } from "../components/ui";
import { db } from "../lib/firebase";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type { Payment, UserProfile } from "../types";
import { makeCode } from "../lib/utils";
import { useAuth } from "../context/AuthContext";
import { CheckCircle2, Search, XCircle } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Array<Payment & { userEmail?: string; userName?: string }>>([]);
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [qText, setQText] = useState("");

  async function refresh() {
    const pq = query(collection(db, "payments"), orderBy("createdAt", "desc"), limit(50));
    const ps = await getDocs(pq);
    const pay = ps.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

    const uq = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(120));
    const us = await getDocs(uq);
    const allUsers = us.docs.map((d) => d.data() as any) as UserProfile[];

    const userMap = new Map<string, UserProfile>();
    allUsers.forEach((u) => userMap.set(u.uid, u));

    setStudents(allUsers);
    setPayments(
      pay.map((p: any) => {
        const u = userMap.get(p.uid);
        return { ...p, userEmail: u?.email, userName: u?.name };
      })
    );
  }

  useEffect(() => {
    refresh();
  }, []);

  async function verifyPayment(p: Payment, ok: boolean) {
    setBusy(true);
    setMsg("");
    try {
      await updateDoc(doc(db, "payments", p.id), {
        status: ok ? "verified" : "rejected",
        verifiedAt: serverTimestamp(),
        verifiedBy: user?.uid ?? "",
      });
      setMsg(ok ? "✅ Payment verified" : "⚠️ Payment rejected");
      await refresh();
    } catch (ex: any) {
      setMsg(ex?.message ?? "Error");
    } finally {
      setBusy(false);
    }
  }

  async function createActivation(uid: string) {
    setBusy(true);
    setMsg("");
    try {
      const code = makeCode(6);
      await setDoc(doc(db, "activationCodes", code), {
        uid,
        used: false,
        createdAt: serverTimestamp(),
        createdBy: user?.uid ?? "",
      });
      setMsg(`✅ Activation code created: ${code}`);
    } catch (ex: any) {
      setMsg(ex?.message ?? "Error");
    } finally {
      setBusy(false);
    }
  }

  async function assignTask(uid: string) {
    const title = prompt("Task title?");
    if (!title) return;
    const description = prompt("Task description?") ?? "";

    setBusy(true);
    setMsg("");
    try {
      const id = crypto.randomUUID();
      await setDoc(doc(db, "tasks", id), {
        uid,
        title,
        description,
        status: "assigned",
        createdAt: serverTimestamp(),
      });
      setMsg("✅ Task assigned");
    } catch (ex: any) {
      setMsg(ex?.message ?? "Error");
    } finally {
      setBusy(false);
    }
  }

  const filteredPayments = useMemo(() => {
    const q = qText.trim().toLowerCase();
    if (!q) return payments;
    return payments.filter((p) =>
      [p.userName, p.userEmail, p.transactionId, p.status].some((x) => String(x ?? "").toLowerCase().includes(q))
    );
  }, [payments, qText]);

  return (
    <Shell>
      <SectionHead title="Admin panel" desc="Verify payments, generate activation codes, and assign tasks." />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge>Payments</Badge>
              <Badge>Tx ID verification</Badge>
              <Badge>No storage</Badge>
            </div>

            <div className="w-full lg:w-80">
              <Input
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                placeholder="Search name / email / tx id / status…"
                className="pl-10"
              />
              <div className="-mt-10 ml-3 flex h-10 items-center text-slate-400">
                <Search className="h-4 w-4" />
              </div>
            </div>
          </div>

          {msg ? <p className="mt-3 text-sm">{msg}</p> : null}

          <Divider />

          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Student</th>
                  <th className="px-4 py-3 text-left font-medium">Tx ID</th>
                  <th className="px-4 py-3 text-left font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="border-t border-slate-200">
                    <td className="px-4 py-3">
                      <div className="leading-tight">
                        <div className="font-medium text-slate-950">{p.userName ?? "Student"}</div>
                        <div className="text-xs text-slate-500">{p.userEmail ?? p.uid}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium">
                        {p.transactionId || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{Number(p.amount).toLocaleString()} RWF</td>
                    <td className="px-4 py-3">
                      <StatusPill s={p.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" disabled={busy} onClick={() => verifyPayment(p, true)}>
                          <CheckCircle2 className="h-4 w-4" /> Verify
                        </Button>
                        <Button variant="secondary" disabled={busy} onClick={() => verifyPayment(p, false)}>
                          <XCircle className="h-4 w-4" /> Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-sm text-slate-600" colSpan={5}>
                      No payments found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={refresh}>Refresh</Button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-950">Students</div>
            <Badge>{students.filter((s) => s.role === "student").length}</Badge>
          </div>

          <Divider />

          <div className="mt-4 space-y-3">
            {students
              .filter((s) => s.role === "student")
              .slice(0, 12)
              .map((s) => (
                <div key={s.uid} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium text-slate-950">{s.name}</div>
                      <div className="mt-1 text-xs text-slate-500">{s.email}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge>{s.level}</Badge>
                        <Badge>{s.active ? "Active ✅" : "Pending 🔒"}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button variant="secondary" disabled={busy} onClick={() => createActivation(s.uid)}>
                      Create Code 🔐
                    </Button>
                    <Button variant="secondary" disabled={busy} onClick={() => assignTask(s.uid)}>
                      Assign Task 🧩
                    </Button>
                  </div>
                </div>
              ))}

            <p className="text-xs text-slate-500">
              Tip: verify payment first, then create code and send via WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function StatusPill({ s }: { s: string }) {
  const base = "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium";
  if (s === "verified") return <span className={`${base} border-emerald-200 bg-emerald-50 text-emerald-700`}>verified</span>;
  if (s === "rejected") return <span className={`${base} border-red-200 bg-red-50 text-red-700`}>rejected</span>;
  return <span className={`${base} border-slate-200 bg-white text-slate-700`}>pending</span>;
}
