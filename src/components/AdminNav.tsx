import type { Page } from "../types";
import Button from "./Button";
export default function AdminNav({ page, go }: { page: Page; go: (page: Page) => void }) {
  return <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Protected admin area</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">ShopNest Admin</h1></div><nav className="flex gap-2 overflow-auto"><Button variant={page==="admin"?"primary":"secondary"} onClick={()=>go("admin")}>Overview</Button><Button variant={page==="admin-products"?"primary":"secondary"} onClick={()=>go("admin-products")}>Products</Button><Button variant={page==="admin-orders"?"primary":"secondary"} onClick={()=>go("admin-orders")}>Orders</Button></nav></div>;
}
