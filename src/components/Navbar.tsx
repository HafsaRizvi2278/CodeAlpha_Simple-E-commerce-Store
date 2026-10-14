import { useState } from "react";
import type { Page, User } from "../types";
import Icon from "./Icon";

export default function Navbar({ page, cartCount, user, go, logout }: { page: Page; cartCount: number; user: User | null; go: (page: Page) => void; logout: () => void }) {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const nav = (target: Page, label: string) => <button onClick={() => { go(target); setOpen(false); }} className={`rounded-lg px-2 py-2 text-sm font-medium ${page === target ? "text-teal-700" : "text-stone-600 hover:text-stone-950"}`}>{label}</button>;
  return <>
    <div className="bg-teal-900 px-4 py-2 text-center text-xs font-medium tracking-wide text-teal-50">Free delivery on orders over $75 · Easy 30-day returns</div>
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-8 px-5 lg:px-8">
        <button onClick={() => go("home")} className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight"><span className="grid size-9 place-items-center rounded-xl bg-teal-700 text-white"><Icon name="bag" size={18} /></span>ShopNest</button>
        <nav className="hidden items-center gap-4 lg:flex">{nav("home", "Home")}{nav("shop", "Shop")}<button onClick={() => go("shop")} className="px-2 py-2 text-sm font-medium text-stone-600">Categories</button>{user?.role === "admin" && nav("admin", "Admin")}</nav>
        <button onClick={() => go("shop")} className="ml-auto hidden h-11 w-full max-w-xs items-center gap-3 rounded-full border border-stone-200 bg-stone-50 px-4 text-left text-sm text-stone-400 md:flex"><Icon name="search" size={18} />Search products</button>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          {!user ? <div className="hidden items-center gap-2 sm:flex"><button onClick={() => go("login")} className="px-3 py-2 text-sm font-semibold text-stone-700">Login</button><button onClick={() => go("register")} className="rounded-full bg-teal-700 px-4 py-2 text-sm font-semibold text-white">Register</button></div> :
          <div className="relative"><button onClick={() => setAccountOpen(!accountOpen)} className="flex items-center gap-2 rounded-full p-1.5 pr-3 hover:bg-stone-100"><span className="grid size-8 place-items-center rounded-full bg-teal-100 text-sm font-bold text-teal-800">{user.name.split(" ").map(n => n[0]).join("").slice(0,2)}</span><span className="hidden text-sm font-semibold sm:block">My Account</span></button>{accountOpen && <div className="absolute right-0 top-12 w-52 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl"><p className="border-b border-stone-100 px-3 py-2 text-xs text-stone-400">{user.email}</p><button onClick={() => { go("profile"); setAccountOpen(false); }} className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-stone-50">Profile overview</button><button onClick={() => { go("orders"); setAccountOpen(false); }} className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-stone-50">My orders</button>{user.role === "admin" && <button onClick={() => { go("admin"); setAccountOpen(false); }} className="w-full rounded-lg px-3 py-2 text-left text-sm text-teal-700 hover:bg-teal-50">Admin dashboard</button>}<button onClick={() => { logout(); setAccountOpen(false); }} className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">Logout</button></div>}</div>}
          <button onClick={() => go("cart")} aria-label="Cart" className="relative grid size-11 place-items-center rounded-full hover:bg-stone-100"><Icon name="bag" />{cartCount > 0 && <span className="absolute right-0 top-0 grid size-5 place-items-center rounded-full bg-amber-400 text-[10px] font-bold">{cartCount}</span>}</button>
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="grid size-11 place-items-center lg:hidden"><Icon name={open ? "close" : "menu"} /></button>
        </div>
      </div>
      {open && <nav className="grid gap-1 border-t border-stone-100 p-4 lg:hidden">{nav("home", "Home")}{nav("shop", "Shop")}{user ? <>{nav("profile", "My Account")}{nav("orders", "My Orders")}{user.role === "admin" && nav("admin", "Admin Dashboard")}<button onClick={logout} className="px-2 py-2 text-left text-sm font-medium text-red-600">Logout</button></> : <>{nav("login", "Login")}{nav("register", "Register")}</>}</nav>}
    </header>
  </>;
}
