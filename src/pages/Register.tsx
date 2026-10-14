import { api } from "../api";
import { useState } from "react";
import type { User } from "../types";
import Button from "../components/Button";
import { LoadingSpinner } from "../components/Feedback";
import Icon from "../components/Icon";
import Input from "../components/Input";

export default function Register({ success, showLogin }: { success: (user: User) => Promise<void>; showLogin: () => void }) {
  const [name,setName]=useState(""),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[confirm,setConfirm]=useState(""),[loading,setLoading]=useState(false),[error,setError]=useState(""),[submitted,setSubmitted]=useState(false);
  const emailError=error;
  const passwordError=submitted&&password.length<8?"Password must contain at least 8 characters.":submitted&&password!==confirm?"Passwords do not match.":"";
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setSubmitted(true);setError("");if(!name||!email||password.length<8||password!==confirm)return;setLoading(true);try{await success(await api<User>("/auth/register","POST",{name,email,password}));}catch(e){setError((e as Error).message);}finally{setLoading(false);}};
  return <main className="mx-auto max-w-lg px-5 py-16"><p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Join ShopNest</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Create your account</h1><p className="mt-3 text-stone-500">Save addresses, track orders, and enjoy faster checkout.</p><form onSubmit={submit} className="mt-8 space-y-5"><Input value={name} onChange={setName} label="Full name" placeholder="Jamie Morgan" error={submitted&&!name?"Full name is required.":undefined}/><Input value={email} onChange={setEmail} label="Email" type="email" placeholder="you@example.com" error={emailError||undefined}/><Input value={password} onChange={setPassword} label="Password" type="password" placeholder="Create a password" error={passwordError||undefined}/><div className="rounded-xl bg-stone-50 p-4 text-xs text-stone-600"><strong className="block text-stone-800">Password requirements</strong><ul className="mt-2 list-inside list-disc space-y-1"><li>At least 8 characters</li><li>One number and one uppercase letter recommended</li></ul></div><Input value={confirm} onChange={setConfirm} label="Confirm password" type="password" placeholder="Repeat your password"/><Button type="submit" disabled={loading} className="w-full">{loading?<LoadingSpinner label="Creating account"/>:"Create account"}</Button></form><p className="mt-6 text-center text-sm text-stone-500">Already registered? <button onClick={showLogin} className="font-semibold text-teal-700">Sign in</button></p></main>;
}
