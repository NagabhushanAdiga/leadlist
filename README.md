# MobileAppp

Monorepo-style project with separate mobile app, admin web, and API server.

## Project structure

```
MobileAppp/
├── mobile/     # Expo React Native app
├── admin/      # React 18 admin web dashboard
└── backend/    # Express API (MVC: models, controllers, routes)
```

Legacy `server/` folder forwards to `backend/` for compatibility.

## Mobile app

```bash
cd mobile
npm install
npm start
```

Scan the QR code with Expo Go, or press `i` / `a` for simulators.

## Admin web (React 18)

```bash
cd backend
npm install
npm start
```

Or from the legacy `server/` folder:

```bash
cd server
npm start
```

In another terminal:

```bash
cd admin
npm install
npm run dev
```

Open `http://localhost:5173`

**Default login:** `admin@leadlist.com` / `admin123`

## API server

Runs at `http://localhost:4000` and stores data in **MongoDB** (`leadlist` database).

```bash
cd backend
cp .env.example .env
npm install
npm start
```

Endpoints include user management, leads CRUD, and Excel import.
