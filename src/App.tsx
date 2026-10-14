import { useEffect, useRef, useState } from 'react';
import { api } from './api';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import Login from './pages/Login';
import OrderDetails from './pages/OrderDetails';
import Orders from './pages/Orders';
import OrderSuccess from './pages/OrderSuccess';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Shop from './pages/Shop';
import type { CartLine, Order, Page, Product, User } from './types';
const readGuest=():CartLine[]=>{try{const v=JSON.parse(localStorage.getItem('shopnest-guest-cart')||'[]');return Array.isArray(v)?v.filter(l=>typeof l.productId==='string'&&Number.isInteger(l.quantity)&&l.quantity>0):[];}catch{return [];}};
export default function App(){
 const [page,setPage]=useState<Page>('home'),[products,setProducts]=useState<Product[]>([]),[selectedProduct,setSelectedProduct]=useState<Product|null>(null),[cart,setCart]=useState<CartLine[]>([]),[user,setUser]=useState<User|null>(null),[orders,setOrders]=useState<Order[]>([]),[selectedOrder,setSelectedOrder]=useState<Order|null>(null),[toast,setToast]=useState<string|null>(null),[ready,setReady]=useState(false),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const notify=(message:string)=>{clearTimeout(timer.current);setToast(message);timer.current=setTimeout(()=>setToast(null),4000);};
 const go=(next:Page)=>{setPage(next);window.scrollTo({top:0,behavior:'smooth'});};
 const loadProducts=async()=>setProducts(await api<Product[]>('/products'));
 const loadOrders=async()=>setOrders(await api<Order[]>('/orders'));
 const bootstrap=async()=>{setError('');try{const list=await api<Product[]>('/products');setProducts(list);let current:User|null=null;try{current=await api<User>('/auth/me');}catch{}setUser(current);if(current){const [c,o]=await Promise.all([api<CartLine[]>('/cart'),api<Order[]>('/orders')]);setCart(c);setOrders(o);}else setCart(readGuest());setReady(true);}catch(e){setError((e as Error).message);}};
 useEffect(()=>{void bootstrap();return()=>clearTimeout(timer.current);},[]);
 const signIn=async(next:User)=>{const [c,o,list]=await Promise.all([api<CartLine[]>('/cart'),api<Order[]>('/orders'),api<Product[]>('/products')]);const merged=new Map(c.map(l=>[l.productId,l]));for(const l of readGuest()){const p=list.find(p=>p.id===l.productId);if(p?.stock)merged.set(l.productId,{...l,quantity:Math.min(p.stock,(merged.get(l.productId)?.quantity||0)+l.quantity)});}let restored=c;try{restored=await api<CartLine[]>('/cart','PUT',[...merged.values()].filter(l=>list.some(p=>p.id===l.productId&&p.stock>0)).map(l=>({...l,quantity:Math.min(l.quantity,list.find(p=>p.id===l.productId)!.stock)})));localStorage.removeItem('shopnest-guest-cart');}catch{notify('Signed in. Some cart items are unavailable; adjust quantities before ordering.');}setUser(next);setProducts(list);setCart(restored);setOrders(o);go('cart');};
 const logout=async()=>{try{await api('/auth/logout','POST');setUser(null);setOrders([]);setSelectedOrder(null);setCart(readGuest());go('home');notify('Signed out');}catch(e){notify((e as Error).message);}};
 const saveCart=async(lines:CartLine[])=>{if(busy)return;setBusy(true);try{if(user)setCart(await api<CartLine[]>('/cart','PUT',lines));else{localStorage.setItem('shopnest-guest-cart',JSON.stringify(lines));setCart(lines);}}catch(e){notify((e as Error).message);await loadProducts().catch(()=>{});}finally{setBusy(false);}};
 const add=(p:Product,quantity=1)=>{if(!p.stock||busy)return;const existing=cart.find(l=>l.productId===p.id);void saveCart(existing?cart.map(l=>l.productId===p.id?{...l,quantity:Math.min(p.stock,l.quantity+quantity)}:l):[...cart,{productId:p.id,quantity:Math.min(p.stock,quantity),option:p.color}]);};
 const placeOrder=async(draft:{items:CartLine[];shippingAddress:string;paymentMethod:string})=>{const o=await api<Order>('/orders','POST',draft);setOrders(current=>[o,...current]);setSelectedOrder(o);setCart([]);go('success');await loadProducts().catch(()=>notify('Order saved. Refresh to see updated stock.'));};
 const openOrder=(o:Order)=>{setSelectedOrder(o);go('order');};
 const openProduct=(p:Product)=>{setSelectedProduct(p);go('product');};
 const p=products.find(p=>p.id===selectedProduct?.id);
 const validCart=cart.filter(l=>products.some(p=>p.id===l.productId));
 const isAdmin=page.startsWith('admin'), account=['profile','orders','checkout'].includes(page);
 return <div className="min-h-screen bg-white text-stone-900"><Navbar page={page} cartCount={cart.reduce((n,l)=>n+l.quantity,0)} user={user} go={go} logout={()=>void logout()}/>
 {!ready?<main className="p-20 text-center">{error?<><p role="alert">{error}</p><button onClick={()=>void bootstrap()} className="mt-4 text-teal-700">Retry connection</button></>:<p>Loading ShopNest…</p>}</main>:<>
 {busy&&<p role="status" className="bg-teal-50 px-5 py-2 text-center text-sm text-teal-800">Saving cart…</p>}
 {page==='home'&&<Home products={products} go={go} openProduct={openProduct} add={add}/>}
 {page==='shop'&&<Shop products={products} openProduct={openProduct} add={add}/>}
 {page==='product'&&(p?<ProductDetails key={p.id} product={p} add={add} buy={(p,q)=>{add(p,q);go('cart');}} back={()=>go('shop')}/>:<p className="p-20">This product is no longer available.</p>)}
 {page==='cart'&&<><Cart lines={validCart} products={products} update={(id,q)=>void saveCart(cart.map(l=>l.productId===id?{...l,quantity:q}:l))} remove={id=>void saveCart(cart.filter(l=>l.productId!==id))} clear={()=>void saveCart([])} go={go}/>{cart.length!==validCart.length&&<button className="m-5 text-teal-700" onClick={()=>void saveCart(validCart)}>Remove unavailable products</button>}</>}
 {page==='checkout'&&user&&<Checkout lines={validCart} products={products} placeOrder={placeOrder} back={()=>go('cart')}/>}
 {(page==='login'||(account&&!user)||(isAdmin&&!user))&&<Login success={signIn} showRegister={()=>go('register')}/>}
 {page==='register'&&<Register success={signIn} showLogin={()=>go('login')}/>}
 {page==='profile'&&user&&<Profile user={user} saved={setUser} go={go} logout={()=>void logout()}/>}
 {page==='orders'&&user&&<Orders orders={orders} open={openOrder}/>}
 {page==='order'&&selectedOrder&&user&&<OrderDetails order={selectedOrder} products={selectedOrder.products||products} back={()=>go(user.role==='admin'?'admin-orders':'orders')}/>}
 {page==='success'&&selectedOrder&&<OrderSuccess order={selectedOrder} go={go}/>}
 {isAdmin&&user&&user.role!=='admin'&&<p className="p-20 text-center">Admins only.</p>}
 {page==='admin'&&user?.role==='admin'&&<AdminDashboard go={go}/>}
 {page==='admin-products'&&user?.role==='admin'&&<AdminProducts products={products} refresh={loadProducts} go={go}/>}
 {page==='admin-orders'&&user?.role==='admin'&&<AdminOrders initialOrders={orders} refresh={async()=>{await loadOrders();await loadProducts();}} go={go} open={openOrder}/>}
 </>}{!['login','register'].includes(page)&&!isAdmin&&<Footer go={go}/>}<Toast message={toast} onClose={()=>setToast(null)}/></div>;
}
