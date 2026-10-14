# ShopNest API

All endpoints use JSON under `/api`. Errors return `{ "error": "message" }` and an HTTP error status. Authentication uses the `shopnest_session` HttpOnly cookie. No bearer token needs to be stored by the frontend.

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| GET | /health | Public | Health check |
| GET | /products | Public | Active product catalog |
| GET | /products/:id | Public | Product details |
| POST | /auth/register | Public | Create customer (`name`, `email`, `password`) and session |
| POST | /auth/login | Public | Sign in (`email`, `password`) |
| GET | /auth/me | Signed in | Current user |
| POST | /auth/logout | Public | Invalidate current session |
| PATCH | /profile | Signed in | Update `name` and optional `address` |
| GET | /cart | Signed in | Current account cart |
| PUT | /cart | Signed in | Replace cart with an array of `{productId, quantity}` |
| GET | /orders | Signed in | Own orders; admins see all orders |
| GET | /orders/:id | Owner/admin | Order with product snapshots |
| POST | /orders | Signed in | Create an order (`items`, `shippingAddress`, `paymentMethod`) |
| GET | /admin/stats | Admin | Database totals and non-cancelled order revenue |
| POST | /admin/products | Admin | Create a product |
| PATCH | /admin/products/:id | Admin | Update a product |
| DELETE | /admin/products/:id | Admin | Soft-delete product from catalog |
| PATCH | /admin/orders/:id | Admin | Change `status` with lifecycle validation |

Product writes accept `name`, `category`, `description`, `price`, `previousPrice`, `stock`, `images` (HTTP(S) URL array), `color`, and `featured`.

Order prices, tax, shipping, status, customer identity, and stock are determined on the server. Client-supplied totals are ignored. Payment methods are `Mock credit card`, `Mock PayPal`, and `Pay on delivery`.

Passwords use salted scrypt hashes; session tokens are random and stored hashed. SQL values use prepared statements. Registration/login are rate limited in memory. Cross-origin writes with an untrusted Origin are rejected. Cookies are SameSite=Lax and HttpOnly, and Secure in production.
