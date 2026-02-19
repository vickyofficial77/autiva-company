import Shell from "../components/Shell";
import { Badge, Button, Divider, SectionHead } from "../components/ui";
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Users, 
  Award, 
  Clock, 
  MessageCircle, 
  Code, 
  Briefcase,
  ChevronDown,
  Star
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do I register?",
      a: "Click 'Apply now', fill in your details, then proceed to payment. After submitting your transaction ID and WhatsApp proof, you'll receive an activation code."
    },
    {
      q: "What is the registration fee?",
      a: "10,000 RWF, which covers administrative costs and ensures commitment. It's a one-time fee for the entire internship program."
    },
    {
      q: "What levels can join?",
      a: "L3, L4, and L5 Software Development students. We tailor tasks to your level."
    },
    {
      q: "How are tasks assigned?",
      a: "After activation, you'll get weekly tasks in your dashboard. They include real project work using Git, code reviews, and feedback."
    },
    {
      q: "What if I need help?",
      a: "You can reach us on WhatsApp (button in footer) or email. Mentors are available during working hours."
    },
    {
      q: "Do I get a certificate?",
      a: "Yes, after completing all tasks successfully, you'll receive a certificate of completion and a portfolio-ready project."
    }
  ];

  return (
    <Shell>
      {/* HERO */}
      <section className="overflow-hidden rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm shadow-2xl shadow-emerald-500/10">
        <div className="relative p-8 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-slate-900/5" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">For L3 • L4 • L5</Badge>
              <Badge className="bg-slate-50 text-slate-700 border-slate-200">Software Development</Badge>
              <Badge className="bg-amber-50 text-amber-700 border-amber-200">Registration: 10,000 RWF</Badge>
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Build real skills through a <span className="text-emerald-600">structured internship</span> workflow.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">
              Autiva helps secondary students master industry practice: tasks, feedback, discipline, and portfolio-ready delivery.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="/register">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30">
                  Apply now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a href="#how">
                <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                  How it works
                </Button>
              </a>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              <Stat k="10k RWF" v="Registration fee" />
              <Stat k="Practical" v="Weekly tasks + review" />
              <Stat k="Certificate" v="After completion" />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (DETAILED) */}
      <section id="how" className="mt-16 scroll-mt-20">
        <SectionHead
          title="How it works"
          desc="Simple steps to start your internship journey."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Step
            number="01"
            title="Register"
            description="Create an account with your details (L3/L4/L5)."
            icon={<Users className="h-6 w-6" />}
          />
          <Step
            number="02"
            title="Pay"
            description="Pay 10,000 RWF and submit transaction ID."
            icon={<Briefcase className="h-6 w-6" />}
          />
          <Step
            number="03"
            title="Verify"
            description="Send payment proof on WhatsApp, get activation code."
            icon={<MessageCircle className="h-6 w-6" />}
          />
          <Step
            number="04"
            title="Start"
            description="Access tasks, submit work, get feedback, earn certificate."
            icon={<Code className="h-6 w-6" />}
          />
        </div>
      </section>

      {/* BENEFITS */}
      <section className="mt-16">
        <SectionHead
          title="Why join Autiva?"
          desc="More than just tasks — a complete learning experience."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Benefit
            icon={<BookOpen className="h-5 w-5 text-emerald-600" />}
            title="Real-world projects"
            description="Work on tasks that simulate industry workflows using Git and modern tools."
          />
          <Benefit
            icon={<Users className="h-5 w-5 text-emerald-600" />}
            title="Mentor guidance"
            description="Get feedback and corrections from experienced mentors."
          />
          <Benefit
            icon={<Award className="h-5 w-5 text-emerald-600" />}
            title="Portfolio ready"
            description="Build a project you can showcase to employers or schools."
          />
          <Benefit
            icon={<Clock className="h-5 w-5 text-emerald-600" />}
            title="Weekly structure"
            description="Consistent pace with deadlines that teach discipline."
          />
          <Benefit
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
            title="Progress tracking"
            description="See your advancement and completed tasks in your dashboard."
          />
          <Benefit
            icon={<Sparkles className="h-5 w-5 text-emerald-600" />}
            title="Certificate of completion"
            description="Receive a verified certificate after finishing the program."
          />
        </div>
      </section>

      {/* TESTIMONIALS (PLACEHOLDER) */}
      <section className="mt-16">
        <SectionHead
          title="What students say"
          desc="Join hundreds who have transformed their skills."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Testimonial
            name="Alice U."
            role="L4 Student"
            quote="Autiva gave me real experience. I learned how to use Git and complete tasks just like in a real job. The feedback helped me improve a lot."
            rating={5}
          />
          <Testimonial
            name="Jean B."
            role="L5 Student"
            quote="The structure kept me disciplined. I now have a project in my portfolio that impressed my teachers."
            rating={5}
          />
          <Testimonial
            name="Clarisse M."
            role="L3 Student"
            quote="I was nervous at first, but the mentors were so helpful. I finished all tasks and feel ready for the next level."
            rating={5}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-16">
        <SectionHead
          title="Frequently asked questions"
          desc="Got questions? We've got answers."
        />
        <div className="mt-8 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => (
            <div key={idx} className="mb-3">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left rounded-2xl border border-white/20 bg-white/80 backdrop-blur-sm p-5 shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </div>
                {openFaq === idx && (
                  <div className="mt-3 text-sm text-slate-600 border-t border-slate-200/70 pt-3">
                    {faq.a}
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-2xl md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative">
            <SectionHead
              title="Ready to join Autiva?"
              desc="Register today, pay the fee, and unlock your tasks after verification."
              light
            />
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="/register">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg">
                  Apply now
                </Button>
              </a>
              <a href="/payment">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Go to payment
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-sm p-5 shadow-md hover:shadow-lg transition-all">
      <div className="text-2xl font-bold text-slate-900">{k}</div>
      <div className="mt-1 text-sm text-slate-500">{v}</div>
    </div>
  );
}

function Step({ number, title, description, icon }: { number: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm p-6 shadow-xl hover:shadow-emerald-500/10 transition-all group">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-sm font-semibold text-emerald-600 mb-1">Step {number}</div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}

function Benefit({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm p-6 shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
          {icon}
        </div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-slate-600">{description}</p>
    </div>
  );
}

function Testimonial({ name, role, quote, rating }: { name: string; role: string; quote: string; rating: number }) {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-sm p-6 shadow-md">
      <div className="flex items-center gap-1 text-amber-500 mb-3">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <p className="text-sm text-slate-700 italic">"{quote}"</p>
      <div className="mt-4 flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
          {name.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-medium text-slate-900">{name}</div>
          <div className="text-xs text-slate-500">{role}</div>
        </div>
      </div>
    </div>
  );
}