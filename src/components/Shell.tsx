import React from "react";
import TopNav from "./TopNav";
import Footer from "./Footer";
import { Container } from "./ui";

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />
      <Container>
        <main className="py-10">{children}</main>
      </Container>
      <Footer />
    </div>
  );
}
