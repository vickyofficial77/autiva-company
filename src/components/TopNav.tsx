import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ListChecks,
  CreditCard,
  KeyRound,
  Home,
} from "lucide-react";
import { Container, Button, Badge, Divider } from "./ui";
import { cn } from "../lib/utils";
import { useMemo, useState } from "react";

export default function TopNav() {
  const { profile, user, signOutNow } = useAuth() as any;
  const nav = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  const activated = !!profile?.active;

  const links = useMemo(() => {
    const base = [{ to: "/", label: "Home", icon: <Home className="h-4 w-4" /> }];

    if (!user) {
      return [
        ...base,
        { to: "/register", label: "Login", icon: <KeyRound className="h-4 w-4" /> },
        
      ];
    }

    // ✅ ALWAYS: dashboard should go to /dashboard
    const authed = [
      ...base,
      { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    ];

    // not activated
    if (!activated) {
      authed.push({ to: "/payment", label: "Payment", icon: <CreditCard className="h-4 w-4" /> });
      authed.push({ to: "/activate", label: "Activate", icon: <KeyRound className="h-4 w-4" /> });
      return authed;
    }

    // activated: show tasks
    authed.push({ to: "/tasks", label: "Tasks", icon: <ListChecks className="h-4 w-4" /> });
    return authed;
  }, [user, activated]);

  async function logout() {
    await signOutNow();
    setOpen(false);
    if (loc.pathname !== "/") nav("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <Container>
        <div className="flex items-center justify-between py-3">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-white">A</div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight text-slate-950">Autiva</div>
              <div className="text-[11px] text-slate-500">Student Portal</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-2 md:flex">
            {links.map((l) => (
              <NavItem key={l.to} to={l.to} label={l.label} icon={l.icon} />
            ))}

            {user ? (
              <>
                {profile?.level ? <Badge>{profile.level}</Badge> : null}
                <Badge
                  className={
                    activated
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  }
                >
                  {activated ? "Active ✅" : "Pending 🔒"}
                </Badge>

                <Button variant="secondary" onClick={logout}>
                  <LogOut className="h-4 w-4" /> Sign out
                </Button>
              </>
            ) : null}
          </nav>

          {/* Mobile toggle */}
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile panel */}
        {open ? (
          <div className="md:hidden">
            <Divider />
            <div className="py-4">
              {user ? (
                <div className="flex flex-wrap items-center gap-2 pb-3">
                  {profile?.level ? <Badge>{profile.level}</Badge> : null}
                  <Badge
                    className={
                      activated
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                    }
                  >
                    {activated ? "Active ✅" : "Pending 🔒"}
                  </Badge>
                </div>
              ) : null}

              <div className="grid gap-2">
                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-100"
                  >
                    {l.icon}
                    {l.label}
                  </Link>
                ))}

                {user ? (
                  <Button variant="secondary" onClick={logout} className="w-full">
                    <LogOut className="h-4 w-4" /> Sign out
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </Container>
    </header>
  );
}

function NavItem({ to, label, icon }: { to: string; label: string; icon?: any }) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
        active ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-slate-100"
      )}
    >
      {icon}
      {label}
    </Link>
  );
}