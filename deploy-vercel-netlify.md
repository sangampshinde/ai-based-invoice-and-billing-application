# 🌐 Deploying to Vercel & Netlify (Complete Guide)

This guide covers deploying your **Next.js Frontend** to **Vercel** (or **Netlify**) and your **NestJS Backend** to **Render** / **Vercel** / **Railway** with your cloud **Neon PostgreSQL** and **Upstash Redis**.

---

## 🎯 Recommended Architecture

| Component | Recommended Platform | Why |
| :--- | :--- | :--- |
| **Frontend (Next.js)** | **Vercel** (or Netlify) | Native Next.js 15 support, global CDN edge, instant builds. |
| **Backend (NestJS)** | **Render** (or Railway / Vercel) | Full Node.js runtime, zero configuration, free tier available. |
| **Database** | **Neon PostgreSQL** | Serverless, auto-scaling, already connected. |
| **Redis** | **Upstash Redis** | Serverless, already connected. |

---

## 🚀 Part 1: Deploy Backend (NestJS)

### Option A: Deploy on Render.com (Recommended for NestJS)
1. Push your repository to **GitHub**.
2. Go to [dashboard.render.com](https://dashboard.render.com) and click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
5. Under **Environment Variables**, add:
   ```env
   NODE_ENV=production
   PORT=8000
   DATABASE_URL=your_neon_postgresql_connection_string
   REDIS_URL=your_upstash_redis_connection_url
   JWT_SECRET=your_jwt_secret_key_here_change_in_production
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.0-flash
   CLIENT_URL=*
   ```
6. Click **Deploy Web Service**.
7. Copy your backend URL (e.g. `https://invoicer-backend.onrender.com`).

---

### Option B: Deploy Backend on Vercel
1. Install Vercel CLI (or connect GitHub in [vercel.com](https://vercel.com)):
   ```bash
   npm i -g vercel
   ```
2. Navigate to `backend` and deploy:
   ```bash
   cd backend
   vercel
   ```
3. In the Vercel Project Settings → **Environment Variables**, add `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, `GEMINI_MODEL`, and `CLIENT_URL`.

---

## 🎨 Part 2: Deploy Frontend (Next.js)

### Option A: Deploy Frontend on Vercel (Fastest & Best for Next.js)

#### Method 1: Using Vercel Web Dashboard (1-Click via GitHub)
1. Go to [vercel.com](https://vercel.com) and click **Add New...** → **Project**.
2. Select your GitHub repository.
3. In the project setup:
   - **Root Directory**: Click *Edit* and select `frontend`.
   - **Framework Preset**: `Next.js` (detected automatically).
4. Under **Environment Variables**, add:
   - `BACKEND_URL`: `https://your-backend-url.onrender.com` (your backend URL without trailing slash)
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-url.onrender.com/api`
5. Click **Deploy**! 🚀

#### Method 2: Using Vercel CLI
```bash
cd frontend
vercel
# Follow the interactive prompts and select default settings.
vercel --prod
```

---

### Option B: Deploy Frontend on Netlify

1. Go to [app.netlify.com](https://app.netlify.com) and click **Add new site** → **Import an existing project**.
2. Connect your GitHub repository.
3. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/.next`
4. Under **Site configuration** → **Environment variables**, add:
   - `BACKEND_URL`: `https://your-backend-url.onrender.com`
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-url.onrender.com/api`
5. Click **Deploy site**!

---

## 🔗 Part 3: Connect Frontend and Backend

1. In your **Backend** environment variables on Render / Vercel, update `CLIENT_URL`:
   ```env
   CLIENT_URL=https://your-frontend-app.vercel.app
   ```
2. In your **Frontend** environment variables on Vercel / Netlify:
   ```env
   BACKEND_URL=https://your-backend-url.onrender.com
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
   ```
3. Test your live application:
   - Open your Vercel / Netlify frontend URL.
   - Log in using your seeded account:
     - **Email**: `alex@invoicer.ai`
     - **Password**: `password123`
