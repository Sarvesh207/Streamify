# 🎥 Streamify

Streamify is a YouTube-like video streaming and social platform, combining a Node.js/Express/MongoDB backend with a React + TypeScript + Vite frontend in a single monorepo.

This repo merges the former `VStream_backend` and `VStream_client` projects into one codebase (with full original commit history preserved) so both halves evolve together.

## 📁 Structure

```
Streamify/
├─ server/     Express + MongoDB API (formerly VStream_backend)
└─ client/     React + TypeScript + Vite SPA (formerly VStream_client)
```

Each app manages its own dependencies and is run independently.

## 🚀 Features

- User authentication (JWT access/refresh tokens), profile & channel management, watch history
- Video upload, publish/unpublish, view tracking, feed & single video fetch
- Comments, polymorphic likes (videos/comments/tweets)
- Playlists (create/manage/add/remove videos)
- Tweets (community posts) with likes
- Channel subscriptions & subscriber counts
- Search for videos and channels
- Video playback via video.js with HLS support on the client

## 🧱 Tech Stack

- **Backend:** Node.js, Express.js, MongoDB/Mongoose, JWT auth, Cloudinary media storage
- **Frontend:** React 19, TypeScript, Vite, Redux Toolkit, TanStack Query, Tailwind CSS, video.js

## ▶️ Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB instance (local or Atlas)
- A Cloudinary account (for media uploads)

### Install

Install dependencies for each app separately:

```bash
cd server && npm install
cd ../client && npm install
```

### Configure environment variables

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Fill in your MongoDB URI, JWT secrets, and Cloudinary credentials in `server/.env`.

### Run in development

Run each app in its own terminal.

```bash
cd server && npm run dev    # API at http://localhost:8000
```

```bash
cd client && npm run dev    # Client at http://localhost:5173
```

### Build / Test

From the `client/` directory:

```bash
npm run build   # builds the client for production
npm run lint    # lints the client
npm run test    # runs the client test suite
```

From the `server/` directory:

```bash
npm run swagger # regenerates Swagger API docs
```

## 📘 API Documentation

The backend exposes Swagger docs — see `server/src/swagger.js`.

## 🌱 Future Enhancements

- Notifications system
- Video recommendations engine
- Live streaming support
- Admin dashboard with role-based access control

## 👨‍💻 Author

**Sarvesh Gaynar**
