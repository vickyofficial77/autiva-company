import { useEffect, useMemo, useState } from "react";
import { addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Shell from "../components/Shell";
import { Button, Input, SectionHead } from "../components/ui";
import { ArrowRight, CheckCircle2, Clock, XCircle } from "lucide-react";

type Pay = { id: string; status: string; transactionId: string; activationCode?: string };

export default function Payment() {
  const { user, profile } = useAuth();
  const nav = useNavigate();
  const [tx, setTx] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [latest, setLatest] = useState<Pay | null>(null);

  // ✅ if active, go tasks immediately (no activation code again)
  useEffect(() => {
    if (profile?.active) nav("/tasks");
  }, [profile?.active, nav]);

  // ✅ realtime latest payment status for this user
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "payments"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const unsub = onSnapshot(q, (snap) => {
      const d = snap.docs[0];
      setLatest(d ? ({ id: d.id, ...(d.data() as any) } as any) : null);
    });
    return () => unsub();
  }, [user]);

  const statusLine = useMemo(() => {
    if (!latest) return null;
    if (latest.status === "pending") return "⏳ Waiting admin confirmation…";
    if (latest.status === "confirmed") return "✅ Transaction confirmed. Wait activation code…";
    if (latest.status === "activated") return "🔐 Code generated. Go to Activate page.";
    if (latest.status === "rejected") return "❌ Rejected. Please re-check transaction and re-submit.";
    return null;
  }, [latest]);

  async function submit() {
    if (!user) return nav("/login");
    const transactionId = tx.trim();
    if (transactionId.length < 6) return setMsg("❌ Transaction ID is too short.");

    setBusy(true); setMsg("");
    try {
      await addDoc(collection(db, "payments"), {
        uid: user.uid,
        transactionId,
        amount: 10000,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      nav("/activate"); // ✅ after submit go activate page
    } catch (e: any) {
      setMsg(e?.message ?? "Error submitting payment");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <div className="max-w-xl mx-auto">
        <SectionHead
          title="Payment"
          desc="Pay 10,000 RWF then submit your transaction ID."
        />

        {statusLine && (
          <div
            className={`mt-6 rounded-2xl border p-5 backdrop-blur-sm ${
              latest?.status === "pending"
                ? "border-amber-200 bg-amber-50/50 text-amber-800"
                : latest?.status === "confirmed"
                ? "border-emerald-200 bg-emerald-50/50 text-emerald-800"
                : latest?.status === "activated"
                ? "border-blue-200 bg-blue-50/50 text-blue-800"
                : latest?.status === "rejected"
                ? "border-red-200 bg-red-50/50 text-red-800"
                : "border-slate-200 bg-slate-50/50 text-slate-800"
            }`}
          >
            <div className="flex items-start gap-3">
              {latest?.status === "pending" && <Clock className="h-5 w-5 flex-shrink-0 text-amber-600" />}
              {latest?.status === "confirmed" && <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-600" />}
              {latest?.status === "activated" && <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-blue-600" />}
              {latest?.status === "rejected" && <XCircle className="h-5 w-5 flex-shrink-0 text-red-600" />}
              <span className="text-sm font-medium">{statusLine}</span>
            </div>
          </div>
        )}

        <div className="mt-8 rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm p-8 shadow-2xl shadow-emerald-500/10">
          <div className="space-y-5">
            <Input
              label="Transaction ID"
              value={tx}
              onChange={(e) => setTx(e.target.value)}
              placeholder="e.g. TX123456"
              className="border-slate-200/70 focus:border-emerald-400 focus:ring-emerald-100"
            />

            {msg && (
              <div className="rounded-xl border border-red-200 bg-red-50/50 px-4 py-3 text-sm text-red-600">
                {msg}
              </div>
            )}

            <Button
              onClick={submit}
              disabled={busy}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/30"
            >
              {busy ? "Submitting…" : "Submit Transaction"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/70" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/80 px-2 text-slate-400 backdrop-blur-sm">or</span>
              </div>
            </div>

            <Button
              onClick={() => nav("/activate")}
              variant="outline"
              className="w-full border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              I have activation code → Activate
            </Button>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-400 text-center">
          After submitting, admin will verify your payment and send an activation code to your dashboard.
        </p>
      </div>
    </Shell>
  );
}