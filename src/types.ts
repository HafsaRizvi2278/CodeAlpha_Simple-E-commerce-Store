export type Page =
  | "home" | "shop" | "product" | "cart" | "checkout"
  | "login" | "register" | "profile" | "orders" | "order"
  | "success" | "admin" | "admin-products" | "admin-orders";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  previousPrice: number;
  description: string;
  stock: number;
  rating: number;
  images: string[];
  color?: string;
  featured: boolean;
  createdAt: string;
};

export type CartLine = { productId: string; quantity: number; option?: string };
export type User = { id?: string; address?: string; name: string; email: string; role: "customer" | "admin" };
export type OrderStatus = "Processing" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
export type Order = {
  id: string; date: string; status: OrderStatus; items: CartLine[]; products?: Product[]; customerName?: string;
  shippingAddress: string; paymentMethod: string; subtotal: number;
  shipping: number; tax: number; total: number;
};
