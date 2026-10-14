import type { OrderStatus } from "../types";
export default function StatusBadge({ status }: { status: OrderStatus }) {
  const tones: Record<OrderStatus, string> = { Processing: "bg-amber-100 text-amber-800", Confirmed: "bg-violet-100 text-violet-800", Shipped: "bg-blue-100 text-blue-800", Delivered: "bg-emerald-100 text-emerald-800", Cancelled: "bg-red-100 text-red-800" };
  return <span className={`w-fit rounded-full px-3 py-1.5 text-xs font-bold ${tones[status]}`}>{status}</span>;
}
