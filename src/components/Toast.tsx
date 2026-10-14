import Icon from "./Icon";
export default function Toast({ message, onClose }: { message: string | null; onClose: () => void }) {
  if (!message) return null;
  return <div role="status" className="fixed bottom-5 right-5 z-50 flex w-[calc(100%-2.5rem)] max-w-sm items-center gap-3 rounded-2xl bg-stone-900 p-4 text-white shadow-2xl"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-teal-600"><Icon name="check" size={18} /></span><p className="flex-1 text-sm font-semibold">{message}</p><button onClick={onClose} aria-label="Close"><Icon name="close" size={17} /></button></div>;
}
