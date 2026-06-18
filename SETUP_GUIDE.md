# Setup Guide — How to Run EventHub

Everything you need to get this running on your machine.

---

## Prerequisites

You'll need:

- **Node.js** v18+ — [nodejs.org](https://nodejs.org/)
- **npm** (comes bundled with Node)
- **Git** (optional, just for cloning)

Quick check:
```bash
node -v
npm -v
```

---

## Step 1: Install Dependencies

Open a terminal in the project root:

```bash
cd backend
npm install

cd ../frontend
npm install
```

---

## Step 2: Set Up Your `.env` File

Head to the `backend/` folder — there's a `.env` file in there. Open it up and fill in your keys.

Here's what it looks like:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=any_random_secret_string
CLOUDINARY_CLOUD_NAME=dummy_name
CLOUDINARY_API_KEY=dummy_key
CLOUDINARY_API_SECRET=dummy_secret
EMAIL_SERVICE=gmail
EMAIL_USER=dummy@gmail.com
EMAIL_PASS=dummy_pass
```

### What's actually required?

| Key            | Required? | Without it...                         |
| -------------- | --------- | ------------------------------------- |
| `MONGO_URI`    | Yes       | App won't start at all                |
| `JWT_SECRET`   | Yes       | Dummy value works for local dev       |
| `CLOUDINARY_*` | No        | Images just save locally, no big deal |
| `EMAIL_*`      | No        | No emails get sent, app still works   |

---

## Step 3: Get Your API Keys

### MongoDB Atlas (free — but required)

This is the database. No database, no app.

1. Head to [mongodb.com/atlas](https://www.mongodb.com/atlas/database)
2. Create a free account, then create a new Cluster (free M0 tier is fine)
3. Wait a minute or two for it to spin up
4. **Database Access** (left sidebar) → Add a new user with a password. Write the password down somewhere.
5. **Network Access** (left sidebar) → Add IP Address → "Allow Access from Anywhere" (`0.0.0.0/0`). Good enough for dev.
6. Back to **Database** → hit **Connect** on your cluster → **Connect your application**
7. Copy the connection string. It'll look something like:
   ```
   mongodb+srv://youruser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
8. Replace `<password>` with your actual password
9. Add your database name before the `?`:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/eventhub?retryWrites=true&w=majority
   ```
10. Paste that into `.env` as `MONGO_URI`

Done. Database is ready.

---

### JWT Secret (easy)

For local dev, the existing dummy value works. If you want a real one:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output, paste it as `JWT_SECRET`.

---

### Cloudinary (optional — skip if you don't care about cloud image storage)

The app saves images locally by default, so this isn't needed unless you specifically want cloud uploads.

1. Sign up at [cloudinary.com](https://cloudinary.com/) (free tier)
2. Dashboard shows your Cloud Name, API Key, and API Secret
3. Drop them into `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

---

### Email / Gmail (optional — skip if you don't need emails)

Without this the app works perfectly fine — you just won't get confirmation or certificate emails.

If you do want emails working:

1. You need a Gmail account with 2-Step Verification turned on
2. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
3. Search for "App Passwords" in your Google Account settings
4. Create one — select **Mail**, pick **Other**, name it whatever (like "EventHub")
5. Google gives you a 16-character password
6. Put it in `.env`:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=youremail@gmail.com
   EMAIL_PASS=abcdefghijklmnop
   ```

**Don't use your real Gmail password.** Always use an App Password.

---

## Step 4: Run the App

You need two terminals running at the same time.

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
You should see something like:
```
Server running in development mode on port 5000
MongoDB Connected: cluster0-shard-00-xx.xxxxx.mongodb.net
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
You should see:
```
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

Open [http://localhost:5173](http://localhost:5173) in your browser and you're in.

---

## Step 5: Try It Out

1. Register a new account — pick Participant or Organizer
2. Log in
3. **As Organizer:** Dashboard → Create an Event
4. **As Participant:** Browse Events → Register for one
5. **Admin access:** Open MongoDB Atlas, find your user in the `users` collection, change `role` to `"Admin"`

---

## Troubleshooting

| Problem | Fix |
| ------- | --- |
| `connect ECONNREFUSED 127.0.0.1:27017` | `MONGO_URI` is wrong or empty. Double check the MongoDB Atlas steps. |
| `Cannot find module 'xxx'` | Run `npm install` in both `backend/` and `frontend/`. |
| Backend runs but frontend is broken | Make sure backend is on port 5000. Frontend proxies API calls there. |
| `MONGO_URI is not defined` | Check your `.env` — it should be `MONGO_URI`, not `MONGO_URL`. |
| Event creation fails with validation error | Pick a valid category: Workshop, Seminar, Hackathon, Cultural, Technical, or Sports. |

---

## Quick Reference

| What | Where |
| ---- | ----- |
| Backend | `http://localhost:5000` |
| Frontend | `http://localhost:5173` |
| API keys | `backend/.env` |
| Only required key | `MONGO_URI` (free from MongoDB Atlas) |
| Everything else | Optional — app works without them |

That's it. You should be good to go.
