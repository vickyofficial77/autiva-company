import Shell from "../components/Shell";
import { Button, SectionHead } from "../components/ui";
import { MessageCircle, CheckCircle2 } from "lucide-react";

export default function Whatsapp() {
  const number = import.meta.env.VITE_WHATSAPP_NUMBER || "2507XXXXXXXX";

  const msg = encodeURIComponent(
    "Hi Autiva, I have paid the 10,000 RWF registration fee. Here is my screenshot. Please send me the activation code."
  );

  const link = `https://wa.me/${number}?text=${msg}`;

  return (
    <Shell>
      <SectionHead
        title="Send screenshot on WhatsApp 📲"
        desc="After payment, send screenshot so admin can verify and give activation code."
      />

      <div className="mt-8 max-w-xl mx-auto">
        <div className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm p-8 shadow-2xl shadow-emerald-500/10">
          <div className="space-y-5">
            <Step number="1" text="Open WhatsApp chat" />
            <Step number="2" text="Send your payment screenshot" />
            <Step number="3" text="Wait for activation code 🔐" />
          </div>

          <div className="mt-8">
            <a href={link} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                <MessageCircle className="mr-2 h-4 w-4" />
                Open WhatsApp
              </Button>
            </a>
          </div>

          <p className="mt-5 text-xs text-center text-slate-400">
            Number: <span className="font-mono">{number}</span>
          </p>
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