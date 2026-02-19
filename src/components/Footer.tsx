import { Container, Divider, Badge } from "./ui";
import { Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";

export default function Footer() {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || "2507XXXXXXXX";
  const waMsg = encodeURIComponent(
    "Hi Autiva, I need help with registration/payment/activation."
  );
  const waLink = `https://wa.me/${number}?text=${waMsg}`;

  return (
    <footer className="mt-16 border-t border-white/20 bg-white/80 backdrop-blur-sm">
      <Container>
        <div className="py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                  <span className="text-lg font-bold">A</span>
                </div>
                <div className="leading-tight">
                  <div className="text-base font-semibold tracking-tight text-slate-900">Autiva</div>
                  <div className="text-xs text-slate-500">Internship Platform</div>
                </div>
              </div>

              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
                A clean, structured internship workflow for L3, L4, and L5 Software Development students:
                tasks, feedback, discipline, and portfolio outputs.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">L3 • L4 • L5</Badge>
                <Badge className="bg-amber-50 text-amber-700 border-amber-200">10,000 RWF registration</Badge>
                <Badge className="bg-slate-50 text-slate-700 border-slate-200">Activation required</Badge>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:col-span-2">
              <div>
                <div className="text-sm font-semibold text-slate-900">Quick links</div>
                <Divider className="my-3 border-slate-200/70" />
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li><a className="hover:text-emerald-600 transition-colors" href="/">Home</a></li>
                  <li><a className="hover:text-emerald-600 transition-colors" href="/register">Register / Sign in</a></li>
                  <li><a className="hover:text-emerald-600 transition-colors" href="/payment">Payment</a></li>
                  <li><a className="hover:text-emerald-600 transition-colors" href="/activate">Activation</a></li>
                  <li><a className="hover:text-emerald-600 transition-colors" href="/dashboard">Dashboard</a></li>
                </ul>
              </div>

              <div>
                <div className="text-sm font-semibold text-slate-900">Support</div>
                <Divider className="my-3 border-slate-200/70" />
                <div className="mt-4 space-y-3">
                  <a
                    className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/80 backdrop-blur-sm px-4 py-3 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
                    href={waLink}
                  >
                    <MessageCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm text-slate-700">WhatsApp support</span>
                    <span className="ml-auto text-xs text-slate-400">{number}</span>
                  </a>

                  <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/80 backdrop-blur-sm px-4 py-3">
                    <Phone className="h-4 w-4 text-slate-600" />
                    <span className="text-sm text-slate-700">Phone (optional)</span>
                    <span className="ml-auto text-xs text-slate-400">+250 …</span>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/80 backdrop-blur-sm px-4 py-3">
                    <Mail className="h-4 w-4 text-slate-600" />
                    <span className="text-sm text-slate-700">Email</span>
                    <span className="ml-auto text-xs text-slate-400">support@autiva.rw</span>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/80 backdrop-blur-sm px-4 py-3">
                    <ShieldCheck className="h-4 w-4 text-slate-600" />
                    <span className="text-sm text-slate-700">Verification</span>
                    <span className="ml-auto text-xs text-slate-400">Tx ID + WhatsApp proof</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Divider className="my-8 border-slate-200/70" />

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <span>© {new Date().getFullYear()} Autiva. All rights reserved.</span>
            <span>Built for students • Fast, clean, and secure.</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}