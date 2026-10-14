import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync,rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createApp } from './app.mjs';

test('Persistent e-commerce workflow, ownership, roles, validation and stock transactions',async()=>{
 const dir=mkdtempSync(path.join(tmpdir(),'shopnest-test-')),database=path.join(dir,'test.sqlite');
 let instance=createApp({database,adminPassword:'TestAdminPassword123!'}),server=instance.app.listen(0);await new Promise(r=>server.once('listening',r));
 let base=`http://localhost:${server.address().port}`;
 const request=async(url,method='GET',body,cookie,extra={})=>{const res=await fetch(base+'/api'+url,{method,headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{}),...extra},...(body===undefined?{}:{body:JSON.stringify(body)})});return{status:res.status,data:await res.json(),cookie:res.headers.get('set-cookie')?.split(';')[0]};};
 try{
  const first=await request('/products');assert.equal(first.status,200);assert.ok(first.data.length>0);const p=first.data.find(p=>p.stock>2);
  assert.equal((await request('/cart')).status,401);
  const customer=await request('/auth/register','POST',{name:'Hafsa Test',email:'hafsa@example.com',password:'Customer123!'});assert.equal(customer.status,201);assert.equal(customer.data.role,'customer');const c=customer.cookie;
  assert.equal((await request('/auth/register','POST',{name:'Duplicate',email:'hafsa@example.com',password:'Customer123!'})).status,409);
  assert.equal((await request('/auth/login','POST',{email:'hafsa@example.com',password:'wrong'})).status,401);
  assert.equal((await request('/auth/login','POST',{email:'hafsa@example.com',password:'Customer123!'})).status,200);
  assert.equal((await request('/auth/me','GET',undefined,c)).data.name,'Hafsa Test');
  assert.equal((await request('/profile','PATCH',{name:'Hafsa Updated',address:'Colombo, Sri Lanka'},c)).data.address,'Colombo, Sri Lanka');
  assert.equal((await request('/cart','PUT',[{productId:p.id,quantity:-1}],c)).status,400);
  assert.equal((await request('/cart','PUT',[{productId:p.id,quantity:1},{productId:p.id,quantity:1}],c)).status,400);
  assert.equal((await request('/cart','PUT',[{productId:p.id,quantity:p.stock+1}],c)).status,409);
  assert.equal((await request('/cart','PUT',[{productId:p.id,quantity:2}],c)).status,200);
  assert.equal((await request('/cart','GET',undefined,c)).data[0].quantity,2);
  const admin=await request('/auth/login','POST',{email:'admin@shopnest.com',password:'TestAdminPassword123!'});assert.equal(admin.status,200);const a=admin.cookie;
  assert.equal((await request('/admin/products','POST',p,c)).status,403);
  assert.equal((await request('/cart','PUT',[],c,{Origin:'https://attacker.example'})).status,403);
  const order=await request('/orders','POST',{items:[{productId:p.id,quantity:2}],shippingAddress:'42 Flower Road, Colombo, Sri Lanka',paymentMethod:'Pay on delivery',total:0},c);assert.equal(order.status,201);assert.ok(order.data.total>p.price*2);assert.equal(order.data.shippingAddress,'42 Flower Road, Colombo, Sri Lanka');
  assert.equal((await request('/products/'+p.id)).data.stock,p.stock-2);assert.equal((await request('/cart','GET',undefined,c)).data.length,0);
  const second=await request('/auth/register','POST',{name:'Other',email:'other@example.com',password:'Customer123!'});assert.equal((await request('/orders','GET',undefined,second.cookie)).data.length,0);assert.equal((await request('/orders/'+order.data.id,'GET',undefined,second.cookie)).status,404);
  assert.equal((await request('/admin/orders/'+order.data.id,'PATCH',{status:'Delivered'},a)).status,400);
  assert.equal((await request('/admin/orders/'+order.data.id,'PATCH',{status:'Cancelled'},a)).status,200);assert.equal((await request('/products/'+p.id)).data.stock,p.stock);
  assert.equal((await request('/admin/orders/'+order.data.id,'PATCH',{status:'Cancelled'},a)).status,400);assert.equal((await request('/products/'+p.id)).data.stock,p.stock);
  const created=await request('/admin/products','POST',{...p,name:'Test scarce product',stock:1},a);assert.equal(created.status,201);const id=created.data.id;
  assert.equal((await request('/admin/products/'+id,'PATCH',{price:25.50},a)).data.price,25.5);
  const draft={items:[{productId:id,quantity:1}],shippingAddress:'Colombo',paymentMethod:'Mock credit card'};
  const competing=await Promise.all([request('/orders','POST',draft,c),request('/orders','POST',draft,second.cookie)]);assert.deepEqual(competing.map(r=>r.status).sort(),[201,409]);
  const history=await request('/orders','GET',undefined,a);assert.equal(history.data.length,2);assert.equal((await request('/admin/stats','GET',undefined,a)).data.orders,2);
  assert.equal((await request('/admin/products/'+id,'DELETE',undefined,a)).status,200);assert.equal((await request('/products/'+id)).status,404);assert.ok((await request('/orders','GET',undefined,a)).data.some(o=>o.products.some(p=>p.id===id)));
  await new Promise(r=>server.close(r));instance.db.close();instance=createApp({database});server=instance.app.listen(0);await new Promise(r=>server.once('listening',r));base=`http://localhost:${server.address().port}`;
  assert.equal((await request('/auth/me','GET',undefined,c)).status,200);assert.equal((await request('/orders','GET',undefined,a)).data.length,2);
  assert.equal((await request('/auth/logout','POST',undefined,c)).status,200);assert.equal((await request('/auth/me','GET',undefined,c)).status,401);
 }finally{await new Promise(r=>server.close(r));instance.db.close();rmSync(dir,{recursive:true,force:true});}
});
