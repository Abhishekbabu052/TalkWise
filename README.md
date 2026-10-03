# TalkWise

A moderated public discussion platform built with the MERN stack and Socket.IO.

## Setup
1. Requirements: Node 18+ and MongoDB running locally (or an Atlas URI).
2. `npm run install:all`
3. Edit `server/.env` (copy of `.env.example`) and `client/.env` if needed.
4. `npm run seed:admin` creates or resets the admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (defaults are in `server/.env.example`; change them).
5. `npm run dev`  starts the API on :5000 and the client on :5173.

For a deployed admin account, set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `MONGO_URI` in the Render service environment, then run `npm run seed:admin` in the Render Shell. This must use the same Atlas database as the deployed API.

Post images are stored in Cloudinary so they persist across server restarts and redeploys. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in the server environment. Existing images saved under `/uploads` must be uploaded again if the host's temporary disk has already cleared them.

## Features
- Admin: create/edit/delete posts (with image), manage users, reports, keywords, notifications
- Public: browse posts and responses without an account
- Members: respond, report responses/users, delete own responses
- Reactions: anyone (no login) can react to a post with 👍 ❤️ 😂 😮 😢 😡; one reaction per browser, click again to undo, counts update live
- Real-time: new/deleted responses and admin notifications via Socket.IO
- Moderation: whole-word, case-insensitive keyword check; blocked responses are rejected, the user gets a warning, and admins are notified live

## API
`/api/auth` `/api/posts` `/api/responses` `/api/users` `/api/reports` `/api/keywords` `/api/notifications`
