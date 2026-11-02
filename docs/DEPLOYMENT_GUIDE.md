# Production Deployment Guide & Hosting Manual

**Course Code:** 24TU05IT01  
**Course Title:** Industry Excellence Track  
**Academic Institution:** Woxsen University  
**Project Title:** GitHub as an Industry Standard for Collaborative Software Development  

---

## 1. Hosting Architecture Overview

The **Student Management System** is engineered as a decoupled modern full-stack web application:
- **Frontend SPA:** Built with Vite into a static bundle (`dist/`) optimized for global Edge Content Delivery Networks (CDNs) like **Vercel**, **Netlify**, or **Cloudflare Pages**.
- **Backend API Server:** Node.js Express server running on platforms like **Render**, **Railway**, **Fly.io**, or **AWS Elastic Beanstalk**.
- **Database:** Managed MySQL instance (e.g. AWS RDS, PlanetScale, Railway MySQL, or Aiven) for high concurrency, or file-persisted SQLite on a persistent disk volume.

---

## 2. Option A: Deployment on Vercel (Frontend) + Render / Railway (Backend)

### Step 1: Deploy Backend to Render / Railway
1. Push repository to GitHub.
2. Sign in to [Render](https://render.com) or [Railway](https://railway.app).
3. Create a **New Web Service** connected to repository `ranadeepyasa/Student-Management-System`.
4. Configure service settings:
   - **Root Directory:** `server`
   - **Environment:** Node
   - **Build Command:** `npm ci`
   - **Start Command:** `npm start`
5. Configure Environment Variables:
   ```text
   NODE_ENV=production
   PORT=5000
   DB_ENGINE=auto
   DB_HOST=<your-mysql-host-or-leave-empty-for-sqlite>
   DB_USER=<your-mysql-user>
   DB_PASSWORD=<your-mysql-password>
   DB_NAME=devflow_db
   JWT_SECRET=<generate-strong-random-64-character-secret>
   CLIENT_URL=https://<your-frontend-domain>.vercel.app
   ```
6. Deploy. Render/Railway will provision an HTTPS endpoint (e.g., `https://sms-api.onrender.com`).
7. Verify health: `https://sms-api.onrender.com/api/health`.

### Step 2: Deploy Frontend to Vercel
1. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Import `ranadeepyasa/Student-Management-System`.
3. Configure Build Settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Configure Environment Variables:
   ```text
   VITE_API_URL=https://sms-api.onrender.com/api
   VITE_SOCKET_URL=https://sms-api.onrender.com
   ```
5. Deploy. Vercel provisions an automated SSL/TLS domain (e.g., `https://student-management-system-woxsen.vercel.app`).

---

## 3. Option B: Docker Container Deployment

A multi-stage `Dockerfile` and `docker-compose.yml` can orchestrate the application in any cloud environment:

```dockerfile
# Multi-Stage Production Build
FROM node:24-alpine AS client-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine AS server-runtime
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server/ ./
COPY --from=client-builder /app/dist ./public_dist

EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "server.js"]
```

---

## 4. Post-Deployment Verification Checklist

- [ ] HTTPS is active with a valid SSL/TLS certificate.
- [ ] Health check returns HTTP 200 at `/api/health`.
- [ ] Admin login functions and issues valid JWT tokens.
- [ ] Student CRUD operations persist correctly across page refreshes.
- [ ] CSV report download streams properly with correct MIME headers.
- [ ] No secrets or `.env` files are exposed in client-side bundles or source maps.
