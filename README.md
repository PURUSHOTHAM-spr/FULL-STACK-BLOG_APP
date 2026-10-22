# Full-Stack Blog Application

A complete full-stack web application for writing, reading, and managing articles/blogs. Built using MongoDB, Express, React (Vite), and Node.js (MERN stack).

---

## Features

The application supports three different user roles: USER (Reader), AUTHOR (Writer), and ADMIN (Manager).

### Readers (USER Role)
- **Authentication**: Sign up and login with secure JWT credentials and custom profile pictures.
- **Browse Articles**: View all published, active articles.
- **Filter Feed**: Read articles from followed authors in a curated feed.
- **Read & Rate**: View detailed articles, read comments, leave comments, and rate articles on a 1-5 scale.
- **Engagement**: Follow or unfollow authors to customize the articles showing up in their feed.
- **Profile Management**: Update profile details (first name, last name, and profile picture).

### Writers (AUTHOR Role)
- **Author Profile & Dashboard**: Access dedicated stats, active article counters, and average ratings.
- **Publishing & Editor**: Write new articles with rich contents under specified categories, and edit existing articles.
- **Article Lifecycle**: Delete (soft-delete) and restore articles.
- **Engagement Stats**: View reader feedback, follower counts, and overall comment/rating statistics.

### Admins (ADMIN Role)
- **Management**: Control system settings and monitor user, author, and article states.

---

## Tech Stack

### Frontend
- **Framework**: React + Vite (fast, HMR-powered bundle runner)
- **State Management**: Zustand (lightweight, hook-based global state)
- **Routing**: React Router (declarative routing with child layouts and protected route guards)
- **Network Client**: Axios
- **UI Notifications**: `react-hot-toast` for interactive notifications

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB via Mongoose ODM
- **Authentication & Security**: JSON Web Token (JWT) with HTTP-only cookies and bcrypt password hashing
- **Media Uploads**: Multer & Cloudinary SDK (secure memory-buffered image uploads)

---

## Project Structure

```text
FULL-STACK-BLOG_APP/
├── backend/                  # Express API Server
│   ├── APIs/                 # API Route Handlers (Admin, Author, User, Common)
│   ├── config/               # Database, Cloudinary, and Multer configurations
│   ├── middlewares/          # JWT Verification & route authentication guards
│   ├── Models/               # Mongoose Schemas (User, Article)
│   ├── services/             # Auth services (Register, Login verification)
│   ├── server.js             # Main server entrypoint
│   └── package.json
└── frontend/                 # React UI Client
    ├── public/
    ├── src/
    │   ├── components/       # Pages, Layouts, and Reusable Components
    │   ├── store/            # Zustand global stores (e.g. AuthStore.js)
    │   ├── config/           # API and Axios setup
    │   ├── App.jsx           # Main Router definitions
    │   └── main.jsx          # DOM rendering entrypoint
    └── package.json
```

---

## Setup Instructions

### Prerequisites
- Node.js installed (v18+)
- MongoDB connection string (local instance or MongoDB Atlas)
- Cloudinary Account (for image uploads)

### 1. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=4000
   DB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=development
   CORS_ORIGINS=http://localhost:5173
   ```
   Use `backend/.env.example` as the variable reference. The legacy
   `CLOUD_NAME`, `API_KEY`, and `API_SECRET` names remain supported temporarily
   for existing deployments, but new deployments should use the canonical
   `CLOUDINARY_*` names.
4. Start the backend dev server:
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `frontend/.env` from `frontend/.env.example`. Set
   `VITE_API_BASE_URL` to `http://localhost:4000` for local development or to
   `https://full-stack-blog-app-2.onrender.com` for the current production
   backend. Vite exposes `VITE_*` values to browser code, so do not put secrets
   in this file.
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```

### Validation commands

Run these commands from the indicated package directory:

```bash
cd backend && npm test
cd ../frontend && npm test
cd ../frontend && npm run build
```

Backend tests use Vitest, Supertest, and isolated in-memory model doubles;
frontend tests use Vitest, jsdom, and Testing Library. Tests do not connect to
the production MongoDB instance.

### Deployment environment variables

- **Vercel frontend:** configure `VITE_API_BASE_URL` as a build-time variable.
  The current production value is
  `https://full-stack-blog-app-2.onrender.com`.
- **Render backend:** configure `PORT` if required by the service, `DB_URL`,
  `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
  `CLOUDINARY_API_SECRET`, `NODE_ENV=production`, and `CORS_ORIGINS` for any
  additional explicitly approved frontend origins. The current production
  Vercel origin is allowed by default.

Real `.env` files are ignored by Git. Commit only the safe `.env.example`
files.

### Docker Compose

Docker Compose runs the frontend and backend containers locally while keeping
MongoDB Atlas and Cloudinary external. Do not add database credentials or real
`.env` files to the repository.

From the repository root, provide the backend variables through the shell or
an ignored root `.env` file:

```bash
DB_URL='mongodb+srv://...'
JWT_SECRET='use-a-long-random-value'
CLOUDINARY_CLOUD_NAME='your-cloud-name'
CLOUDINARY_API_KEY='your-api-key'
CLOUDINARY_API_SECRET='your-api-secret'
```

Start the containers with:

```bash
docker compose up --build
```

The frontend is served at `http://localhost:8080`; the backend is published at
`http://localhost:4000`. `VITE_API_BASE_URL` defaults to
`http://localhost:4000` because the browser cannot resolve the internal
Compose service name. Override it when the backend is exposed at another
browser-visible URL:

```bash
VITE_API_BASE_URL='http://localhost:4000' docker compose up --build
```

Do not set `VITE_API_BASE_URL` to `http://backend:4000`; that hostname is
available only inside the Compose network.

---

## API Endpoints Summary

### Common APIs (`/common-api`)
* `POST /login` - Log in a user (sets an HTTP-only token cookie)
* `GET /logout` - Clear cookie and log out
* `GET /check-auth` - Restore login session (using cookie)
* `PUT /change-password` - Update current password
* `PUT /profile` - Update profile image and names (via Multer/Cloudinary)

### User APIs (`/user-api`)
* `POST /users` - Register a reader (USER) account
* `GET /articles` - View all active articles
* `GET /articles/following` - View articles written by followed authors
* `GET /articles/:id` - Read single article by ID
* `PUT /articles` - Post a comment and rating to an article
* `PUT /users/:id/follow` - Follow an author
* `PUT /users/:id/unfollow` - Unfollow an author

### Author APIs (`/author-api`)
* `POST /users` - Register an author (AUTHOR) account
* `POST /articles` - Create and publish a new article
* `GET /articles` - Fetch all articles created by the authenticated author
* `PUT /articles` - Update title, category, or content of an article
* `PATCH /articles/:id/status` - Toggle active/soft-deleted status of an article
* `GET /stats` - Access analytics (follower count, post count, average ratings)
