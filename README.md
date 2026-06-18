# EventHub — Event Management System (Demo)

> **This is a demo project.** It ships with placeholder API keys. You'll need to swap in your own before things actually work. See the [Setup Guide](./SETUP_GUIDE.md) for details.

A full-stack event management app with QR-based attendance tracking, role-based dashboards, and PDF certificate generation.

---

## Tech Stack

| Layer      | Tech                                                   |
| ---------- | ------------------------------------------------------ |
| Frontend   | React 19, Vite, Tailwind CSS, Framer Motion, Recharts  |
| Backend    | Node.js, Express 5, Mongoose                           |
| Database   | MongoDB (Atlas or local)                               |
| Auth       | JWT (cookie + Bearer token)                            |
| Other      | QR Code generation/scanning, PDF certificates          |

---

## Getting Started

### 1. Clone & Install

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Set Up Environment Variables

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and plug in your own values. At minimum you need a working `MONGO_URI` — the rest is optional. Check the [Setup Guide](./SETUP_GUIDE.md) for step-by-step instructions on getting each key.

### 3. Run It

You need two terminals:

```bash
# Terminal 1 — backend
cd backend
npm run dev

# Terminal 2 — frontend
cd frontend
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000](http://localhost:5000)

---

## API Keys

The `backend/.env` file has these variables. The demo ships with dummy values — replace them.

**MongoDB Atlas (Required)** — Without this, the app won't start. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas/database), grab your connection string, and paste it as `MONGO_URI`.

**JWT Secret (Required)** — The dummy value works for local dev. For anything real, generate one:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Cloudinary (Optional)** — For cloud image uploads. Right now images just save to `/uploads` locally, so you can skip this.

**Email / Gmail (Optional)** — For sending registration confirmations and certificate emails. Without it the app still works, just no emails go out.

---

## User Roles

| Role        | What they can do                                                  |
| ----------- | ----------------------------------------------------------------- |
| Participant | Browse events, register, view QR pass, get certificates           |
| Organizer   | Create events, scan QR codes for attendance, manage their events  |
| Admin       | View analytics, manage all users, approve organizers              |

To test as Admin, manually set a user's `role` to `"Admin"` in MongoDB — there's no admin signup flow.

---

## Project Structure

```
new project/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers (auth, events, attendance, admin)
│   ├── middlewares/      # Auth & error handling
│   ├── models/          # Mongoose schemas (User, Event, Registration, Attendance, Certificate)
│   ├── routes/          # API routes
│   ├── utils/           # JWT, QR code, PDF, email helpers
│   ├── uploads/         # Locally stored images & certs
│   ├── server.js        # Entry point
│   └── .env             # Your API keys go here
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI (Navbar, QRScanner, etc.)
│   │   ├── context/     # React Context (AuthContext)
│   │   ├── pages/       # Page components (auth, dashboard, events)
│   │   └── main.jsx     # Entry point
│   └── index.html
│
└── README.md
```

---

## API Endpoints

### Auth
| Method | Route                | Access  | Description            |
| ------ | -------------------- | ------- | ---------------------- |
| POST   | `/api/auth/register` | Public  | Register a new user    |
| POST   | `/api/auth/login`    | Public  | Login & get token      |
| POST   | `/api/auth/logout`   | Private | Logout & clear cookie  |
| GET    | `/api/auth/profile`  | Private | Get user profile       |

### Events
| Method | Route              | Access            | Description         |
| ------ | ------------------ | ----------------- | ------------------- |
| GET    | `/api/events`      | Public            | List all events     |
| GET    | `/api/events/:id`  | Public            | Get event details   |
| POST   | `/api/events`      | Organizer         | Create event        |
| PUT    | `/api/events/:id`  | Organizer/Admin   | Update event        |
| DELETE | `/api/events/:id`  | Organizer/Admin   | Delete event        |

### Attendance
| Method | Route                            | Access      | Description              |
| ------ | -------------------------------- | ----------- | ------------------------ |
| POST   | `/api/attendance/register/:id`   | Private     | Register for an event    |
| POST   | `/api/attendance/scan`           | Organizer   | Scan QR & mark attendance|

### Admin
| Method | Route                           | Access | Description           |
| ------ | ------------------------------- | ------ | --------------------- |
| GET    | `/api/admin/analytics`          | Admin  | Dashboard analytics   |
| GET    | `/api/admin/users`              | Admin  | List all users        |
| PUT    | `/api/admin/users/:id/approve`  | Admin  | Approve an organizer  |

---

## Known Limitations

- Email won't work with the dummy credentials (app itself is fine, just no emails).
- Cloudinary keys are placeholders — images save locally instead.
- No password reset flow yet.
- Participant dashboard is still using placeholder data in some spots.
- This is a demo — don't deploy it anywhere with the dummy secrets still in place.

---

## License

This project is for educational / demo purposes.
