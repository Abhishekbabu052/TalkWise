# TalkWise

A moderated public discussion platform built with the MERN stack and Socket.IO.

## Setup
1. Requirements: Node 18+ and MongoDB running locally (or an Atlas URI).
2. `npm run install:all`
3. Edit `backend/.env` (copy of `.env.example`) and `frontend/.env` if needed.
4. `npm run seed:admin` creates or resets an admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
5. Set `SUPERADMIN_EMAIL` and `SUPERADMIN_PASSWORD`, then run `npm run seed:superadmin` from the `backend` directory to create the superadmin account. Use a strong, unique password.
6. `npm run dev` starts the API on :5000 and the frontend on :5173.

For deployed staff accounts, set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SUPERADMIN_EMAIL`, `SUPERADMIN_PASSWORD`, and `MONGO_URI` in the Render service environment, then run the respective seed scripts in the Render Shell. Both scripts must use the same Atlas database as the deployed API.

For deployments from this repository, set the Render API service root directory to `backend` and the Vercel project root directory to `frontend`.

Post images are stored in Cloudinary so they persist across backend restarts and redeploys. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in the backend environment. Existing images saved under `/uploads` must be uploaded again if the host's temporary disk has already cleared them.

## Features
- Admin: create/edit/delete posts (with image), block/remove users, review reports and notifications
- Superadmin: promote users by email, manage uniquely labeled admins, moderate comments, and manage prohibited keywords
- Public: browse posts and responses without an account
- Members: respond, report responses/users, delete own responses
- Reactions: anyone (no login) can react to a post with 👍 ❤️ 😂 😮 😢 😡; one reaction per browser, click again to undo, counts update live
- Real-time: new/deleted responses and admin notifications via Socket.IO
- Moderation: whole-word, case-insensitive keyword check; blocked responses are rejected, the user gets a warning, and admins are notified live

## API
`/api/auth` `/api/posts` `/api/responses` `/api/users` `/api/reports` `/api/keywords` `/api/notifications`
