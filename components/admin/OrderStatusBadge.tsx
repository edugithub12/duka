import { OrderStatus } from "@/lib/types";

const STYLES: Record<OrderStatus, string> = {
  pending: "bg-signal/15 text-signal",
  paid: "bg-brand/15 text-brandDark",
  fulfilled: "bg-green-600/15 text-green-700",
  cancelled: "bg-alert/15 text-alert",
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
