import { createApp } from './app.mjs';
const {app}=createApp();
const port=Number(process.env.PORT||3001);
app.listen(port,()=>console.log(`ShopNest server: http://localhost:${port}`));
