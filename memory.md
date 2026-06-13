# Project Status Memory

**Date Recorded:** June 13, 2026

## The Current Issue
The backend server for the EventHub application was crashing on startup. 
* **Error:** `connect ECONNREFUSED 127.0.0.1:27017`
* **Reason:** The codebase is trying to connect to a local MongoDB database that is currently not running.

## Next Steps When You Return
To get the website working again, we need to fix the database connection in `backend/.env`:

1. **Database Options:**
   * **Recommended:** Create a free database on [MongoDB Atlas](https://www.mongodb.com/atlas/database) and replace the `MONGO_URI` in your `.env` file with the Atlas connection string. This avoids the need to run MongoDB locally and works perfectly with your existing Mongoose code.
   * **Alternative:** Start your local MongoDB service if you already have it installed.
   * *(Note: We decided against Supabase because it uses PostgreSQL, which would require rewriting almost the entire backend.)*

2. **Other Credentials (Optional for now):**
   * **Cloudinary:** Used for storing uploaded images (like event banners). It has dummy values right now. You can leave them, but image uploads will fail until you provide real keys.
   * **Email Service:** Used for sending notifications/confirmations. Also has dummy values. You can leave them, but the app won't be able to send actual emails.
   * **JWT_SECRET:** The dummy value works, but should eventually be changed to a secure random string for production.

**Summary:** Once you provide a working `MONGO_URI` in `backend/.env`, the backend will start successfully and the website will work.
