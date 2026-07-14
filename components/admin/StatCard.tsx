import type { LucideIcon } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "alert" | "brand";
}) {
  const iconTone =
    tone === "alert"
      ? "text-alert"
      : tone === "brand"
      ? "text-brand"
      : "text-muted";

  return (
    <div className="relative border border-line bg-white p-5">
      <div className="flex items-start justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
          {label}
        </span>
        <Icon className={`h-4 w-4 shrink-0 ${iconTone}`} strokeWidth={1.75} />
      </div>
      <p className="mt-3 font-display text-3xl font-semibold text-ink">
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}
