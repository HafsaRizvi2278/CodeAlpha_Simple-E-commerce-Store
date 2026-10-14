import { useMemo, useState } from "react";
import type { Product } from "../types";
import Button from "../components/Button";

import Icon from "../components/Icon";
import ProductCard from "../components/ProductCard";


export default function Shop({ products, openProduct, add }: { products: Product[]; openProduct: (product: Product) => void; add: (product: Product) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All products");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [stockOnly, setStockOnly] = useState(false);
  const [sort, setSort] = useState("Featured");
  const categories = ["All products", ...new Set(products.map(p => p.category))];
  const filtered = useMemo(() => {
    const result = products.filter(p => (category === "All products" || p.category === category) && p.name.toLowerCase().includes(query.toLowerCase()) && (!min || p.price >= Number(min)) && (!max || p.price <= Number(max)) && (!stockOnly || p.stock > 0));
    return [...result].sort((a,b) => sort === "Newest" ? b.createdAt.localeCompare(a.createdAt) : sort === "Price low to high" ? a.price-b.price : sort === "Price high to low" ? b.price-a.price : sort === "Rating" ? b.rating-a.rating : Number(b.featured)-Number(a.featured));
  }, [products, category, query, min, max, stockOnly, sort]);
  const clear = () => { setQuery(""); setCategory("All products"); setMin(""); setMax(""); setStockOnly(false); setSort("Featured"); };

  return <main><div className="bg-stone-100 px-5 py-14 text-center"><p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">The collection</p><h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Shop all products</h1><p className="mx-auto mt-4 max-w-xl text-stone-500">Discover beautifully designed essentials for your wardrobe and home.</p></div>
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8"><div className="mb-8 grid gap-4 rounded-2xl border border-stone-200 p-4 lg:grid-cols-[1fr_auto_auto]">
      <label className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"><Icon name="search" size={18} /></span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products..." className="h-11 w-full rounded-full border border-stone-200 pl-11 pr-4 text-sm outline-none focus:border-teal-600" /></label>
      <div className="flex gap-2"><input value={min} onChange={e => setMin(e.target.value)} type="number" aria-label="Minimum price" placeholder="Min $" className="h-11 w-24 rounded-full border border-stone-200 px-4 text-sm" /><input value={max} onChange={e => setMax(e.target.value)} type="number" aria-label="Maximum price" placeholder="Max $" className="h-11 w-24 rounded-full border border-stone-200 px-4 text-sm" /></div>
      <select value={sort} onChange={e => setSort(e.target.value)} className="h-11 rounded-full border border-stone-200 bg-white px-4 text-sm"><option>Featured</option><option>Newest</option><option>Price low to high</option><option>Price high to low</option><option>Rating</option></select>
      <div className="flex gap-2 overflow-x-auto lg:col-span-2">{categories.map(c => <button key={c} onClick={() => setCategory(c)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${category === c ? "bg-teal-700 text-white" : "bg-stone-100 text-stone-600"}`}>{c}</button>)}</div>
      <label className="flex items-center gap-2 text-sm font-medium"><input checked={stockOnly} onChange={e => setStockOnly(e.target.checked)} type="checkbox" className="size-4 accent-teal-700" />In stock only</label>
      <div className="flex gap-2 lg:col-span-3"><Button variant="ghost" onClick={clear} className="!px-2">Clear filters</Button></div>
    </div>
    <p className="mb-7 text-sm text-stone-500"><strong className="text-stone-900">{filtered.length}</strong> products</p>
    {filtered.length === 0 ? <div className="rounded-3xl bg-stone-50 py-20 text-center"><Icon name="search" /><h2 className="mt-4 text-xl font-semibold">No products found</h2><p className="mt-2 text-sm text-stone-500">Try adjusting your search or filters.</p><Button onClick={clear} className="mt-6">Clear filters</Button></div> : <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">{filtered.map(p => <ProductCard key={p.id} product={p} onOpen={() => openProduct(p)} onAdd={() => add(p)} />)}</div>}</div>
  </main>;
}
