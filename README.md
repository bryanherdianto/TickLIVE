# Tickify

Tickify is an event-ticketing platform where visitors can browse events, choose seats, and buy tickets. Event organizers can also publish their events.

## Features and services

- Authentication is provided by Clerk.
- Event, venue, seat, ticket, and organizer data is stored in PostgreSQL.
- Venue images are uploaded to Cloudinary.
- Venue maps use Leaflet with OpenStreetMap data. A Google Maps API key is **not** required.

## Project structure

```
tickify/
├── backend/       # Express API and PostgreSQL access
└── frontend/      # Vue 3 and Vite web application
```

## Prerequisites

- Node.js 20.19 or later (or Node.js 22.12 or later) for the frontend
- PostgreSQL database
- A Clerk application
- A Cloudinary account if venue image uploads are used

## Environment variables

Create the following files. Never commit real credentials.

### Backend: `backend/.env`

```env
# Optional. Defaults to 3000.
PORT=3000

# PostgreSQL connection URI
PG_CONNECTION_STRING=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require

# Required for protected organizer and ticket endpoints. Keep this server-only.
CLERK_SECRET_KEY=sk_test_...
# Use the same value as frontend's VITE_CLERK_PUBLISHABLE_KEY.
CLERK_PUBLISHABLE_KEY=pk_test_...

# Allowed frontend origins, separated by commas.
FRONTEND_ORIGIN=http://localhost:5173,http://localhost:3000

# Required only when uploading an image file through the API.
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Midtrans Snap, from Dashboard > Settings > Access Keys with the environment set to Sandbox.
# The server key is server-only. The API refuses to boot on a non-SB key while
# MIDTRANS_IS_PRODUCTION is false, so a live key cannot be loaded by accident.
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false
```

### Frontend: `frontend/.env`

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_BASE_URL=http://localhost:3000/api

# Public by design. The server key never reaches the browser.
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxx
```

### Payments

Checkout runs on the Midtrans **sandbox**: no real money moves, and real cards do not work.
Pay with test card `4811 1111 1111 1114`, any future expiry, CVV `123`, OTP `112233`.

Two rules follow from the 15 minute seat hold:

- Only instant payment channels are enabled (card, GoPay, ShopeePay, QRIS). Bank transfer and
  convenience-store payments can settle hours later, after the hold has been swept.
- Events are priced in IDR only, in whole rupiah, because that is what Midtrans settles in.

Midtrans confirms payments by calling `POST /api/webhooks/midtrans`, which cannot reach
`localhost`. Local checkout still works end to end: after the Snap window closes, the frontend
calls `POST /api/tickets/:id/payment/sync`, and the server re-checks the status with Midtrans
directly. Once deployed, set the notification URL in the Midtrans dashboard to
`https://your-api-host/api/webhooks/midtrans` — the webhook is the durable source of truth.

Leaflet and OpenStreetMap do not require a map API key for the basic map display. For production, follow the [OpenStreetMap tile usage policy](https://operations.osmfoundation.org/policies/tiles/) or use a dedicated tile provider if traffic becomes substantial.

## Installation and local development

Install the dependencies for each application separately:

```sh
cd backend
npm install

cd ../frontend
npm install
```

Reset the database once before starting the backend. This intentionally removes the legacy schema and its data, then creates the frontend-aligned Tickify schema:

```sh
cd backend
npm run db:reset
```

If you already have data you want to keep, apply the additive migrations instead. This adds the
`payments` table and switches the default event currency to IDR without dropping anything:

```sh
cd backend
npm run db:migrate
```

Start the backend from the `backend` directory:

```sh
node index.js
```

Start the frontend from the `frontend` directory in a separate terminal:

```sh
npm run dev
```

The backend listens on port `3000` by default. The frontend development server prints its local URL after it starts.

## Backend API

All API routes use the `/api` prefix and return `{ success, data }`. Public screens can use:

- `GET /api/events` — event discovery with `search`, `category`, `city`, `from`, `to`, `minPrice`, and `maxPrice` filters
- `GET /api/events/:idOrSlug` and `GET /api/events/:idOrSlug/seats`
- `GET /api/venues` and `GET /api/venues/:idOrSlug`

Clerk-authenticated routes support the account and organizer screens:

- `PUT /api/me`, `GET /api/me/tickets`, and `POST /api/tickets`
- `GET /api/me/organizer/summary`
- `GET|POST /api/me/events` and `PATCH|DELETE /api/me/events/:id`
- `GET|POST /api/me/venues` and `PATCH|DELETE /api/me/venues/:id`

`POST /api/tickets` creates a 15-minute seat hold. It deliberately does not mark a ticket as paid; connect a payment provider webhook before confirming payment and issuing booked tickets. Image-creation and update endpoints accept an optional `image` file (uploaded to Cloudinary) or an `imageUrl` field.

The active database schema is [`backend/db/reset.sql`](backend/db/reset.sql).

## Contributors

- Adi Nugroho
- Aisya Rivelia Azzahra
- Bryan Herdianto
- Naufal Hadi Rasikhin
