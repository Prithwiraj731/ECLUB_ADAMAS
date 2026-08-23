# 🚀 Adamas University Entrepreneurship Club (E-CLUB) — Full-Stack Platform

A modern, production-grade full-stack web application for the **Adamas University Entrepreneurship Club**, built with **React (Vite)**, **Node.js (Express)**, and **Supabase (PostgreSQL & Auth)**.

![Adamas University Entrepreneurship Club Logo](assets/logo.png)

---

## 🎨 Official Adamas University Color Scheme

- **Primary Accent (Lime Green):** `#7abd24` (Innovation, Growth, Vitality)
- **Primary Hover:** `#68a61d`
- **Secondary Brand (Royal Blue):** `#0056b3` (Excellence, Authority, Trust)
- **Deep Navy Tone:** `#003875` (Hero Gradients, Dark Surfaces)
- **Secondary Hover:** `#004494`
- **Neutrals:** Slate Dark (`#1e293b`), Slate Muted (`#64748b`), Off-White (`#f8fafc`), Clean White (`#ffffff`)

---

## ✨ Full-Stack Architecture

```
ECLUB/
├── client/                     # React Frontend (Vite + React Router)
│   ├── public/
│   │   └── assets/             # Logos, hero carousel images, event posters
│   ├── src/
│   │   ├── components/         # Header, Footer, HeroSlider, NoticeBanner, EventSection...
│   │   ├── pages/              # Home, About, Contact, AdminLogin, AdminDashboard
│   │   ├── context/            # AuthContext (Admin authentication & session)
│   │   ├── lib/                # Supabase client connector
│   │   ├── styles/             # Adamas CSS variables & futuristic animations
│   │   ├── App.jsx             # Top-level routing
│   │   └── main.jsx            # Entry point
│   ├── index.html
│   └── vite.config.js          # Proxy configuration to backend (:5000)
│
├── server/                     # Node.js + Express API Server
│   ├── src/
│   │   ├── config/             # Supabase & Mock database configuration
│   │   ├── controllers/        # Events, Notices, Contact, Auth handlers
│   │   └── routes/             # REST API routers (/api/*)
│   ├── server.js               # Express server entry point
│   ├── .env.example            # Environment variables template
│   └── package.json
│
├── supabase/
│   └── schema.sql              # Supabase PostgreSQL schema, RLS policies & initial seed
└── package.json                # Root monorepo concurrent scripts
```

---

## ⚡ Quick Start

### 1. Install Dependencies
Run from the project root:
```bash
npm run install:all
```
*(Or run `npm install` inside both `client/` and `server/`)*

### 2. Start Local Development
Run both the React frontend and Node.js backend concurrently:
```bash
npm run dev
```

- **Frontend Application:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`
- **Health Check:** `http://localhost:5000/api/health`

---

## 🔐 Supabase Configuration (Optional for Live Database)

The application includes an **in-memory database fallback** so it works immediately out of the box without any setup.

To connect your own **live Supabase project**:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and execute the script in [`supabase/schema.sql`](supabase/schema.sql).
3. In your Supabase Dashboard, navigate to **Project Settings → API** and copy:
   - `Project URL`
   - `anon public key`
   - `service_role key`
4. Update `server/.env`:
   ```env
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```
5. Restart your server (`npm run dev`).

---

## 🔑 Default Admin Credentials

- **Portal URL:** `http://localhost:5173/admin`
- **Username:** `admin`
- **Password:** `admin123`

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate admin and receive JWT session |
| `GET` | `/api/events` | List all events |
| `POST` | `/api/events` | Create a new event *(Admin)* |
| `DELETE` | `/api/events/:id` | Delete an event *(Admin)* |
| `GET` | `/api/notices/active` | Get currently active notice for homepage |
| `GET` | `/api/notices` | List all notices |
| `POST` | `/api/notices` | Create a new notice *(Admin)* |
| `PATCH` | `/api/notices/:id` | Toggle notice active/inactive status *(Admin)* |
| `DELETE` | `/api/notices/:id` | Delete a notice *(Admin)* |
| `POST` | `/api/contact` | Submit inquiry from Contact page |
| `GET` | `/api/contact` | List all inquiries *(Admin)* |
| `DELETE` | `/api/contact/:id` | Delete inquiry *(Admin)* |

---

## 📄 License & Credits

© 2026 **Adamas University Entrepreneurship Club**. All rights reserved.
Built with ❤️ to foster innovation, entrepreneurship, and startup culture.
