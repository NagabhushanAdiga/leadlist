# Lead List Backend

Express API with **MVC + MongoDB** for the mobile app and admin dashboard.

## Setup

1. Install and start MongoDB locally, or use [MongoDB Atlas](https://www.mongodb.com/atlas).

2. Copy environment file:

```bash
cp .env.example .env
```

3. Install and run:

```bash
npm install
npm start
```

Dev mode:

```bash
npm run dev
```

API: `http://localhost:4000/api`

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | API port |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/leadlist` | MongoDB connection string |
| `ADMIN_EMAIL` | `admin@leadlist.com` | Default admin email (seeded once) |
| `ADMIN_PASSWORD` | `admin123` | Default admin password |

## Folder structure

```
backend/
├── src/
│   ├── config/          # Env, DB connection, seed
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, upload
│   ├── models/
│   │   ├── schemas/     # Mongoose schemas (User, Lead, Admin, Session)
│   │   └── *Model.js    # Data access layer
│   ├── routes/
│   └── utils/
├── .env.example
└── package.json
```

## MongoDB collections

| Collection | Purpose |
|------------|---------|
| `users` | Mobile app users |
| `leads` | Leads — each row has `userId` (per-user Excel data) |
| `admins` | Admin panel accounts |
| `sessions` | Auth tokens |

## User-scoped Excel import

Each lead is stored with a `userId`:

- **Mobile** upload → saved under the logged-in user's `userId`
- **Admin** upload → saved under the selected user's `userId`
- User A's upload **never** replaces User B's leads

## Default admin

`admin@leadlist.com` / `admin123` (created automatically on first run)
