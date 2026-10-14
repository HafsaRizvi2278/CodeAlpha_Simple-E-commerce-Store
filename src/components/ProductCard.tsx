import { useState } from "react";
import type { Product } from "../types";
import Button from "./Button";
import Icon from "./Icon";

export default function ProductCard({ product, onOpen, onAdd }: { product: Product; onOpen: () => void; onAdd: () => void }) {
  const [liked, setLiked] = useState(false);
  const soldOut = product.stock === 0;
  return <article className="group min-w-0">
    <div className="relative aspect-[4/4.6] overflow-hidden rounded-2xl bg-stone-100">
      <button onClick={onOpen} className="size-full"><img src={product.images[0]} alt={product.name} className={`size-full object-cover transition duration-500 group-hover:scale-105 ${soldOut ? "opacity-70 grayscale-[30%]" : ""}`} /></button>
      <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold ${soldOut ? "bg-stone-900 text-white" : "bg-white/90 text-stone-800"}`}>{soldOut ? "Out of stock" : product.featured ? "Featured" : "New"}</span>
      <button onClick={() => setLiked(!liked)} aria-label="Wishlist" className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white shadow-sm ${liked ? "text-red-500" : "text-stone-700"}`}><Icon name="heart" size={17} fill={liked} /></button>
      <div className="absolute inset-x-3 bottom-3 translate-y-16 transition duration-300 group-hover:translate-y-0"><Button onClick={onAdd} disabled={soldOut} className="w-full !min-h-10 !px-3">{soldOut ? "Unavailable" : "Add to cart"}</Button></div>
    </div>
    <div className="pt-4">
      <div className="mb-1 flex items-center justify-between gap-2"><p className="text-xs font-medium uppercase tracking-wider text-stone-400">{product.category}</p><span className="flex items-center gap-1 text-sm font-semibold"><span className="text-amber-500"><Icon name="star" size={14} fill /></span>{product.rating}</span></div>
      <button onClick={onOpen} className="text-left font-semibold text-stone-900 hover:text-teal-700">{product.name}</button>
      <div className="mt-2 flex items-center gap-2"><span className="font-bold">${product.price.toFixed(2)}</span><span className="text-sm text-stone-400 line-through">${product.previousPrice.toFixed(2)}</span></div>
    </div>
  </article>;
}
