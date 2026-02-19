import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";

export type Level = "L3" | "L4" | "L5";
export type UserRole = "student" | "admin";

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  level: Level;
  role: UserRole;
  active: boolean;
  createdAt: any;
};

type AuthCtx = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signUpStudent: (p: { name: string; email: string; password: string; phone: string; school: string; level: Level }) => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signOutNow: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("AuthContext missing");
  return v;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // ✅ realtime profile (fast redirects + no refresh needed)
  useEffect(() => {
    if (!user) { setProfile(null); return; }
    const ref = doc(db, "users", user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      setProfile(snap.exists() ? (snap.data() as UserProfile) : null);
    });
    return () => unsub();
  }, [user]);

  const api = useMemo<AuthCtx>(() => ({
    user, profile, loading,

    async signUpStudent(p) {
      const cred = await createUserWithEmailAndPassword(auth, p.email, p.password);
      const data: UserProfile = {
        uid: cred.user.uid,
        name: p.name,
        email: p.email,
        phone: p.phone,
        school: p.school,
        level: p.level,
        role: "student",
        active: false,
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, "users", cred.user.uid), data);
      setProfile(data);
    },

    async signInEmail(email, password) {
      await signInWithEmailAndPassword(auth, email, password);
    },

    async signOutNow() {
      await signOut(auth);
    },
  }), [user, profile, loading]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
};
