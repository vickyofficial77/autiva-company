export default function SectionTitle({ k, v }: { k: string; v?: string }) {
  return (
    <div className="border-b border-slate-200 pb-3">
      <h2 className="text-lg font-semibold tracking-tight">{k}</h2>
      {v ? <p className="mt-1 text-sm text-slate-600">{v}</p> : null}
    </div>
  );
}
