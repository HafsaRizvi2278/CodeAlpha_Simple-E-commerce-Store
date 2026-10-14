import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Page } from '../types';
import AdminNav from '../components/AdminNav';
import Icon, {type IconName} from '../components/Icon';
export default function AdminDashboard({go}:{go:(p:Page)=>void}){
 const [stats,setStats]=useState<{products:number;orders:number;users:number;revenue:number}|null>(null),[error,setError]=useState('');
 const load=()=>{setError('');api<{products:number;orders:number;users:number;revenue:number}>('/admin/stats').then(setStats).catch(e=>setError(e.message));};
 useEffect(load,[]);
 return <main className="min-h-screen bg-stone-50"><div className="mx-auto max-w-7xl px-5 py-12 lg:px-8"><AdminNav page="admin" go={go}/>{error?<p role="alert">{error} <button onClick={load}>Retry</button></p>:!stats?<p>Loading dashboard…</p>:<><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[['box','Total products',stats.products],['bag','Total orders',stats.orders],['user','Total users',stats.users],['chart','Order revenue',`$${stats.revenue.toFixed(2)}`]].map(([icon,label,value])=><article key={label} className="rounded-3xl bg-white p-6 shadow-sm"><span className="grid size-11 place-items-center rounded-2xl bg-teal-50 text-teal-700"><Icon name={icon as IconName}/></span><p className="mt-5 text-sm text-stone-500">{label}</p><p className="mt-1 text-3xl font-bold">{value}</p></article>)}</div><section className="mt-8 rounded-3xl bg-teal-900 p-8 text-white"><h2 className="text-xl font-semibold">Store management</h2><p className="mt-3 text-teal-100">Revenue includes non-cancelled orders. Mock payments do not collect funds.</p><div className="mt-6 flex gap-4"><button onClick={()=>go('admin-products')} className="rounded-xl bg-white px-5 py-3 text-teal-900">Manage products</button><button onClick={()=>go('admin-orders')} className="rounded-xl bg-white px-5 py-3 text-teal-900">Manage orders</button></div></section></>}</div></main>;
}
