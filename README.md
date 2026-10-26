# FlashSale

A flash-sale storefront where the sale rules are enforced by the server, not just drawn in the UI: limited units, per-customer limits, real countdowns, and checkout that cannot oversell even when hundreds of people click at once.

**Stack:** React 19 · Tailwind CSS 4 · React Router 7 · Spring Boot 3 (Java 21) · Spring Security + JWT · Spring Data JPA · MySQL · Docker

## What it does

**Shoppers**
- Browse without an account: search, category filter, sorting and pagination
- A hero for the sale that ends first, with a live countdown and a "claimed" meter fed by real sold counts
- Product pages show the flash price, time left, units left and the per-customer limit
- Cart (kept in the browser, always re-priced by the server), checkout with address and payment choice, order history with a status timeline, cancellation, wishlist and profile

**Administrators**
- Dashboard: revenue, orders, customers, live sales, low stock, 7-day revenue chart, recent orders
- Products: create, edit, hide
- Flash sales: schedule (checked for overlaps and sensible prices), watch claimed units, end early
- Orders: filter by status and move them through the delivery steps; cancelling returns stock

## How the flash sale stays honest

| Problem | How it is handled |
|---|---|
| Two buyers take the last unit | Stock is taken with one conditional statement, `UPDATE ... SET stock = stock - :qty WHERE stock >= :qty`. The database decides who wins; a result of 0 rows means "sold out". Flash units are claimed the same way. |
| One customer beats the per-customer limit with parallel requests | Checkout first locks the customer's row (`SELECT ... FOR UPDATE`), so that customer's requests run one at a time and the limit check is race-free. |
| Double click or network retry creates two orders | The client sends an `Idempotency-Key`. The same key returns the original order (HTTP 200) instead of creating another (201). A unique index backs this up. |
| Client sends a cheaper price | It cannot. The request carries product ids and quantities only; prices, flash deals and totals are computed on the server. |
| Half an order goes through | Everything runs in one transaction. If any line fails, every claim made so far rolls back. |
| Deadlocks between checkouts | Lines are processed in product-id order, so concurrent checkouts always lock rows in the same order. |
| Cancel twice returns stock twice | The order row is locked and cancelling an already cancelled order does nothing. |
| Countdown shows a sale that has ended | The countdown refetches when it hits zero, and the server checks the sale window on every claim. |

These are tested in `CheckoutConcurrencyTest`: 150 buyers racing for 40 flash units produce exactly 40 orders, a double click with one key produces one order, and ten parallel requests from one customer with a limit of 2 produce exactly 2 orders.

## Architecture

```
React (Vite)  ──  /api  ──►  Spring Boot REST API  ──►  MySQL
   │                              │
   │  JWT in Authorization header │  JwtAuthenticationFilter → roles (CUSTOMER / ADMIN)
   └──────────────────────────────┘
```

```
.
├── src/                     React app
│   ├── api/                 fetch client (token handling, error shape, Idempotency-Key)
│   ├── context/             auth, cart, wishlist, toasts
│   ├── pages/               storefront pages; pages/admin for the admin panel
│   └── components/          layout, product cards, countdown, claimed bar, shared UI
├── backend/src/main/java/com/lokesh/flashsale/
│   ├── controller/          REST endpoints
│   ├── service/             OrderService (checkout), ProductService, FlashSaleService, ...
│   ├── repository/          Spring Data JPA, atomic update queries, filtering
│   ├── model/ dto/          entities and request/response records
│   ├── security/            JWT, auth filter, login rate limiter
│   └── config/              security chain, CORS, demo data seeder
├── Dockerfile, nginx.conf   frontend image
├── docker-compose.yml       MySQL + API + frontend
└── .github/workflows/       CI: backend tests, frontend lint and build
```

## API

Public: product and flash-sale reads and login/register. Everything else needs `Authorization: Bearer <token>`; `/api/admin/**` needs the ADMIN role.

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/register`, `/api/auth/login` | Create an account / get a JWT |
| GET, PUT | `/api/auth/me` | Read / update profile |
| PUT | `/api/auth/password` | Change password |
| GET | `/api/products?q=&category=&sort=&page=&size=` | Search the catalog (sort: `newest`, `price_asc`, `price_desc`, `rating`) |
| GET | `/api/products/{id}`, `/api/products/by-ids?ids=1,2`, `/api/products/categories` | Product details, cart lookup, categories |
| GET | `/api/flash-sales/live`, `/api/flash-sales/upcoming` | Products on sale now / soon |
| GET, PUT, DELETE | `/api/wishlist[/{productId}]` | Wishlist |
| POST | `/api/orders` (header `Idempotency-Key`) | Place an order: 201 created, 200 if the key was already used |
| GET | `/api/orders`, `/api/orders/{id}` | My orders |
| POST | `/api/orders/{id}/cancel` | Cancel (PLACED or CONFIRMED only); returns stock |
| GET | `/api/admin/stats` | Dashboard numbers |
| GET, POST, PUT, DELETE | `/api/admin/products[/{id}]` | Manage products (DELETE hides the product) |
| GET, POST | `/api/admin/flash-sales`, `/api/admin/flash-sales/{id}/end` | Manage flash sales |
| GET, PATCH | `/api/admin/orders`, `/api/admin/orders/{id}/status` | Manage orders |

Errors share one shape: `{ timestamp, status, error, message, fieldErrors? }`. Business conflicts (sold out, limit reached, invalid status change) return `409` with a message safe to show to the shopper.

## Run it

### Option 1: Docker

```bash
cp .env.example .env        # then edit the passwords and JWT_SECRET
docker compose up --build
```

Open http://localhost:3000.

### Option 2: local development

Requires Java 21, Maven, Node 22 and a running MySQL.

```bash
# terminal 1: API on :8080
cd backend
SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run    # "dev" supplies a dev-only JWT secret; set DB_PASSWORD if your root password is not "root"

# terminal 2: React on :5173 (proxies /api to :8080)
npm install
npm run dev
```

### Demo accounts

Created on first start when `SEED_DATA=true`, together with 6 products and 3 flash sales (two live, one upcoming).

| Role | Email | Password |
|---|---|---|
| Customer | `customer@example.com` | `Customer@123` |
| Admin | `admin@example.com` | `Admin@123` |

Set `SEED_DATA=false` (and `VITE_SHOW_DEMO=false` when building the frontend) for anything other than a demo.

## Tests

```bash
cd backend && mvn test
```

- `CheckoutConcurrencyTest`: oversell protection, per-customer limit under races, idempotent retries, cancel-once restocking
- `StoreApiTest`: catalog and flash prices, register/login, rate limiting, roles, server-side pricing, per-customer limit message, validation errors, cancellation, admin order flow, flash sale validation
- `OrderStatusTest`, `JwtServiceTest`, `LoginRateLimiterTest`: unit tests

The suite runs on in-memory H2 in MySQL mode. The same atomic-update and locking approach is what MySQL/InnoDB runs in production, but it is worth also running the concurrency test against a real MySQL before relying on it.

## Configuration

| Variable | Where | Default | Notes |
|---|---|---|---|
| `JWT_SECRET` | backend | none (required) | 32+ characters; the app refuses to start without it |
| `JWT_EXPIRATION_MINUTES` | backend | 240 | |
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | backend | local MySQL | |
| `CORS_ALLOWED_ORIGINS` | backend | `http://localhost:5173` | comma-separated; only needed when the frontend is on another origin |
| `SEED_DATA` | backend | `true` | |
| `LOGIN_MAX_FAILED_ATTEMPTS`, `LOGIN_WINDOW_MINUTES` | backend | 5 / 10 | login rate limit |
| `VITE_API_URL` | frontend build | `/api` | full URL when the API is hosted separately |
| `VITE_SHOW_DEMO` | frontend build | `true` | `false` hides the demo-account shortcuts |

## Deploying the frontend separately (for example on Vercel)

The frontend needs the API. Host the backend somewhere that runs Java and MySQL, then set `VITE_API_URL=https://<your-api-host>/api` in the frontend build settings and `CORS_ALLOWED_ORIGINS=https://<your-frontend-host>` on the backend.

## Design decisions and limits

- **Payments are simulated.** The chosen method is stored on the order; no money moves and nothing is verified.
- **Flash units come out of regular stock.** A sale of 40 units on a product with 100 in stock leaves 60 for regular sale; creating a sale checks this.
- **No overlapping sales per product.** One price applies at a time, which keeps the pricing rule unambiguous.
- **Prices are `BigDecimal`** with two decimals in the database.
- **Login rate limiting is in memory**, so it is per server instance. Behind several instances it needs a shared store such as Redis.
- **Token storage.** The JWT is kept in `localStorage` (when "keep me signed in" is ticked) or `sessionStorage`: simple, but readable by any script on the page. An httpOnly cookie with CSRF protection is the stricter choice.
- **Schema** is managed with `spring.jpa.hibernate.ddl-auto=update`. A production deployment should use a migration tool such as Flyway.
- **Not implemented:** refresh tokens, email verification, password reset, real payments, product reviews, frontend tests.
