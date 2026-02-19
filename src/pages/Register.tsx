import { useState } from "react";
import Shell from "../components/Shell";
import { Button, Divider, Input, SectionHead, Badge } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import type { Level } from "../types";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, UserPlus, CheckCircle2 } from "lucide-react";

export default function Register() {
  const { user, signInEmail, signUpStudent } = useAuth();
  const nav = useNavigate();

  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string>("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [school, setSchool] = useState("");
  const [level, setLevel] = useState<Level>("L3");
  const [password, setPassword] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      if (mode === "signup") {
        await signUpStudent({ name, email, phone, school, level, password });
      } else {
        await signInEmail(email, password);
      }
      nav("/payment");
    } catch (ex: any) {
      setErr(ex?.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left column - Info */}
        <div className="space-y-6">
          <SectionHead 
            title="Join Autiva" 
            desc="Register (L3/L4/L5) then continue to payment and activation." 
          />

          <div className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm p-8 shadow-2xl shadow-emerald-500/10">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Structured internship</Badge>
              <Badge className="bg-slate-50 text-slate-700 border-slate-200">Weekly tasks</Badge>
              <Badge className="bg-amber-50 text-amber-700 border-amber-200">10,000 RWF fee</Badge>
            </div>

            <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-900">
              Build discipline, portfolio, and real workflow.
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              After registration and payment verification, you’ll receive an activation code to unlock your dashboard tasks.
            </p>

            <Divider className="my-5 border-slate-200/70" />

            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>Pay 10k → enter Transaction ID</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>Send proof on WhatsApp</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span>Admin verifies → sends activation code</span>
              </li>
            </ul>

            {user ? (
              <div className="mt-6">
                <a href="/payment">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30">
                    Continue to payment <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            ) : null}
          </div>
        </div>

        {/* Right column - Form */}
        <div className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm shadow-2xl shadow-emerald-500/10">
          <div className="p-8">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                  mode === "signup"
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "border-slate-200 bg-white/50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <UserPlus className="h-4 w-4" /> Sign up
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                  mode === "signin"
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                    : "border-slate-200 bg-white/50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Sign in
                </span>
              </button>
            </div>

            <form onSubmit={submit} className="mt-6 grid gap-5">
              {mode === "signup" ? (
                <>
                  <Input 
                    label="Full name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Your name"
                    className="border-slate-200/70 focus:border-emerald-400 focus:ring-emerald-100"
                  />
                  <div className="grid gap-5 md:grid-cols-2">
                    <Input 
                      label="Phone" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="078xxxxxxx"
                      className="border-slate-200/70 focus:border-emerald-400 focus:ring-emerald-100"
                    />
                    <div className="grid gap-1.5">
                      <span className="text-xs font-medium text-slate-700">Level</span>
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value as Level)}
                        className="h-11 w-full rounded-xl border border-slate-200/70 bg-white/50 px-3 text-sm outline-none backdrop-blur-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      >
                        <option value="L3">L3</option>
                        <option value="L4">L4</option>
                        <option value="L5">L5</option>
                      </select>
                    </div>
                  </div>

                  <Input 
                    label="School" 
                    value={school} 
                    onChange={(e) => setSchool(e.target.value)} 
                    placeholder="School name"
                    className="border-slate-200/70 focus:border-emerald-400 focus:ring-emerald-100"
                  />
                </>
              ) : null}

              <Input 
                label="Email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="name@example.com"
                className="border-slate-200/70 focus:border-emerald-400 focus:ring-emerald-100"
              />
              <Input 
                label="Password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                className="border-slate-200/70 focus:border-emerald-400 focus:ring-emerald-100"
              />

              {err ? <p className="text-sm text-red-500">{err}</p> : null}

              <Button 
                disabled={busy} 
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/30"
              >
                {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="text-xs text-slate-400">
                By continuing, you agree to follow Autiva instructions for payment verification and activation.
              </p>
            </form>
          </div>

          <Divider className="border-slate-200/70" />

          <div className="p-8">
            <div className="text-sm font-semibold text-slate-900">Next steps</div>
            <div className="mt-4 grid gap-3">
              <Step number="1" text="Pay 10,000 RWF" />
              <Step number="2" text="Enter Transaction ID" />
              <Step number="3" text="Send proof on WhatsApp" />
              <Step number="4" text="Receive activation code" />
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function Step({ number, text }: { number: string; text: string }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200/70 bg-white/50 px-4 py-3 backdrop-blur-sm">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
        {number}
      </div>
      <span className="text-sm font-medium text-slate-900">{text}</span>
    </div>
  );
}