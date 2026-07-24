# Tickify

Tickify is an event-ticketing platform where visitors can browse events, choose seats, and buy tickets. Event organizers can also publish their events.

## Features and services

- Authentication is provided by Clerk.
- Event and ticket data is stored in PostgreSQL.
- Venue images are uploaded to Cloudinary.
- Venue maps use Leaflet with OpenStreetMap data. A Google Maps API key is **not** required.

## Project structure

```
tick-live/
├── backend/       # Express API and PostgreSQL access
├── frontend/      # Vue 3 and Vite web application
└── doc/           # Database dump and project diagrams
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

# Required when creating or updating venue images
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend: `frontend/.env`

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

Leaflet and OpenStreetMap do not require a map API key for the basic map display. For production, follow the [OpenStreetMap tile usage policy](https://operations.osmfoundation.org/policies/tiles/) or use a dedicated tile provider if traffic becomes substantial.

## Installation and local development

Install the dependencies for each application separately:

```sh
cd backend
npm install

cd ../frontend
npm install
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

## Database

An initial PostgreSQL dump is available at [`doc/dumpfile.sql`](doc/dumpfile.sql).

## Project diagrams

### UML

![UML](https://i.imgur.com/5ViikZR.png)

### ERD

![ERD](https://i.imgur.com/YizUSKt.png)

### Flowchart

![Flowchart](https://i.imgur.com/gkXQoUj.png)

## Contributors

- Adi Nugroho
- Aisya Rivelia Azzahra
- Bryan Herdianto
- Naufal Hadi Rasikhin
