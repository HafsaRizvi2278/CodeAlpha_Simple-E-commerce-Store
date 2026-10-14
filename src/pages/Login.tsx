import { api } from "../api";
import { useState } from "react";
import type { User } from "../types";
import { images } from "../data";
import Button from "../components/Button";
import { LoadingSpinner } from "../components/Feedback";
import Input from "../components/Input";

export default function Login({ success, showRegister }: { success: (user: User) => Promise<void>; showRegister: () => void }) {
  const [email,setEmail]=useState(""), [password,setPassword]=useState(""), [loading,setLoading]=useState(false), [error,setError]=useState("");
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setError("");setLoading(true);try{const user=await api<User>("/auth/login","POST",{email,password});await success(user);}catch(e){setError((e as Error).message);}finally{setLoading(false);}};
  return <main className="grid min-h-[calc(100vh-112px)] lg:grid-cols-2"><div className="relative hidden overflow-hidden bg-stone-900 lg:block"><img src={images.hero} alt="" className="absolute inset-0 size-full object-cover opacity-75" /><div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" /><p className="absolute bottom-14 left-14 max-w-lg text-3xl font-medium leading-tight text-white">“Everything you need, thoughtfully selected and delivered with care.”</p></div><div className="flex items-center justify-center px-5 py-16"><div className="w-full max-w-md"><p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Welcome back</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Sign in to your account</h1><p className="mt-3 text-stone-500">Sign in with your registered email and password.</p>{error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}<form onSubmit={submit} className="mt-8 space-y-5"><Input value={email} onChange={setEmail} label="Email address" type="email" placeholder="you@example.com" /><Input value={password} onChange={setPassword} label="Password" type="password" placeholder="Enter your password" /><p className="text-xs text-stone-500">Your session stays signed in for up to 7 days.</p><Button type="submit" disabled={loading} className="w-full">{loading?<LoadingSpinner label="Signing in" />:"Sign in"}</Button></form><p className="mt-6 text-center text-sm text-stone-500">New to ShopNest? <button onClick={showRegister} className="font-semibold text-teal-700">Create an account</button></p></div></div></main>;
}
