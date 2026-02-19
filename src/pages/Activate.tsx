import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Shell from "../components/Shell";
import { Button, Input, SectionHead } from "../components/ui";
import { ArrowRight } from "lucide-react";

export default function Activate() {
  const { user, profile } = useAuth();
  const nav = useNavigate();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!user) nav("/login");
    if (profile?.active) nav("/tasks"); // ✅ never ask again after activation
  }, [user, profile?.active, nav]);

  async function submit() {
    if (!user) return;
    const c = code.trim().toUpperCase();
    if (c.length < 4) return setMsg("❌ Code too short.");

    setBusy(true); setMsg("");
    try {
      const ref = doc(db, "activationCodes", c);
      const snap = await getDoc(ref);

      if (!snap.exists()) return setMsg("❌ Invalid code.");
      const data = snap.data() as any;

      if (data.uid !== user.uid) return setMsg("❌ This code is not for your account.");
      if (data.used === true) return setMsg("⚠️ Code already used.");

      // ✅ atomic: mark code used + activate user
      const batch = writeBatch(db);
      batch.update(ref, { used: true, usedAt: serverTimestamp() });
      batch.update(doc(db, "users", user.uid), { active: true });
      await batch.commit();

      nav("/tasks");
    } catch (e: any) {
      setMsg(e?.message ?? "Activation failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <div className="max-w-xl mx-auto">
        <SectionHead
          title="Activate your account"
          desc="Enter the activation code you received from admin."
        />

        <div className="mt-8 rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm p-8 shadow-2xl shadow-emerald-500/10">
          <div className="space-y-5">
            <Input
              label="Activation code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. A7K2Q9"
              className="border-slate-200/70 font-mono tracking-widest focus:border-emerald-400 focus:ring-emerald-100"
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
              {busy ? "Activating…" : "Activate & Continue"}
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
              onClick={() => nav("/payment")}
              variant="outline"
              className="w-full border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Back to Payment
            </Button>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-400 text-center">
          The activation code is sent after payment verification.
        </p>
      </div>
    </Shell>
  );
}