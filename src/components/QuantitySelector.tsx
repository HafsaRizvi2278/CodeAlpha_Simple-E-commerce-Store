import Icon from "./Icon";
export default function QuantitySelector({ value, onChange, max = 99 }: { value: number; onChange: (value: number) => void; max?: number }) {
  return <div className="inline-flex h-11 items-center rounded-full border border-stone-300 bg-white"><button onClick={() => onChange(Math.max(1, value - 1))} aria-label="Decrease quantity" className="grid size-10 place-items-center"><Icon name="minus" size={15} /></button><span className="w-7 text-center text-sm font-semibold">{value}</span><button onClick={() => onChange(Math.min(max, value + 1))} aria-label="Increase quantity" className="grid size-10 place-items-center"><Icon name="plus" size={15} /></button></div>;
}
