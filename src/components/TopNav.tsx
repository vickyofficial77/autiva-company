import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { Container, Button, Badge, Divider } from "./ui";
import { cn } from "../lib/utils";
import { useMemo, useState } from "react";

export default function TopNav() {
  const { profile, user, signOutNow } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  const links = useMemo(() => {
    const base = [{ to: "/", label: "Home" }];

    if (!user) return base;

    const authed = [
      ...base,
      { to: "/dashboard", label: "Dashboard" },
      { to: "/payment", label: "Payment" },
      { to: "/activate", label: "Activate" },
      { to: "/whatsapp", label: "WhatsApp" },
    ];

    if (profile?.role === "admin") authed.push({ to: "/admin", label: "Admin" });

    return authed;
  }, [user, profile?.role]);

  async function logout() {
    await signOutNow();
    setOpen(false);
    if (loc.pathname !== "/") nav("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-lg">
      <Container>
        <div className="flex items-center justify-between py-3">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/30">
              <span className="text-sm font-bold">A</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight text-slate-900">Autiva</div>
              <div className="text-[11px] text-slate-500">Internship Platform</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-2 md:flex">
            {links.map((l) => (
              <NavItem key={l.to} to={l.to} label={l.label} />
            ))}

            {user ? (
              <>
                {profile?.level && (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    {profile.level}
                  </Badge>
                )}

                {profile?.role === "admin" && (
                  <span className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/80 backdrop-blur-sm px-3 py-2 text-sm shadow-sm">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span className="text-slate-700">Admin</span>
                  </span>
                )}

                <Button
                  variant="outline"
                  onClick={logout}
                  className="border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  <LogOut className="h-4 w-4" /> Sign out
                </Button>
              </>
            ) : (
              <Link to="/register">
                <Button className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                  Apply
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/80 backdrop-blur-sm hover:bg-white md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5 text-slate-700" /> : <Menu className="h-5 w-5 text-slate-700" />}
          </button>
        </div>

        {/* Mobile panel */}
        {open && (
          <div className="md:hidden">
            <Divider className="border-white/20" />
            <div className="py-4">
              <div className="grid gap-2">
                {user && (
                  <div className="flex flex-wrap items-center gap-2 pb-2">
                    {profile?.level && (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        {profile.level}
                      </Badge>
                    )}
                    <Badge
                      className={
                        profile?.active
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }
                    >
                      {profile?.active ? "Active ✅" : "Pending 🔒"}
                    </Badge>
                    {profile?.role === "admin" && (
                      <Badge className="bg-slate-50 text-slate-700 border-slate-200">Admin</Badge>
                    )}
                  </div>
                )}

                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-white/20 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm font-medium text-slate-900 shadow-sm hover:bg-white"
                  >
                    {l.label}
                  </Link>
                ))}

                {user ? (
                  <Button variant="outline" onClick={logout} className="w-full border-slate-300 text-slate-700">
                    <LogOut className="h-4 w-4" /> Sign out
                  </Button>
                ) : (
                  <Link to="/register" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                      Apply
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "rounded-xl px-4 py-2 text-sm font-medium transition-all",
        active
          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
          : "text-slate-700 hover:bg-white/70 backdrop-blur-sm"
      )}
    >
      {label}
    </Link>
  );
}