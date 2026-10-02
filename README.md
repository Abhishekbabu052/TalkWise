# TalkWise

A moderated public discussion platform built with the MERN stack and Socket.IO.

## Setup
1. Requirements: Node 18+ and MongoDB running locally (or an Atlas URI).
2. `npm run install:all`
3. Edit `server/.env` (copy of `.env.example`) and `client/.env` if needed.
4. `npm run seed:admin`  creates the admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (default `admin@talkwise.com` / `Admin@123`). Change it.
5. `npm run dev`  starts the API on :5000 and the client on :5173.

## Features
- Admin: create/edit/delete posts (with image), manage users, reports, keywords, notifications
- Public: browse posts and responses without an account
- Members: respond, report responses/users, delete own responses
- Reactions: anyone (no login) can react to a post with 👍 ❤️ 😂 😮 😢 😡; one reaction per browser, click again to undo, counts update live
- Real-time: new/deleted responses and admin notifications via Socket.IO
- Moderation: whole-word, case-insensitive keyword check; blocked responses are rejected, the user gets a warning, and admins are notified live

## API
`/api/auth` `/api/posts` `/api/responses` `/api/users` `/api/reports` `/api/keywords` `/api/notifications`
