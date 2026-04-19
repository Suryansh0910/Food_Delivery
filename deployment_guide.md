# Deployment Guide - FoodDash

This application is split into a **Frontend (Vite + React)** and a **Backend (Express + MongoDB)**.

## 1. Backend Deployment (e.g., Render, Railway, Heroku)

### Prerequisites
- A MongoDB cluster (e.g., [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

### Steps
1. Push your code to a GitHub repository.
2. Connect your repository to your hosting platform.
3. Set the **Root Directory** to `backend`.
4. Set the **Build Command** to `npm install && npm run build`.
5. Set the **Start Command** to `npm start`.
6. Add the following **Environment Variables**:
   - `PORT`: `5001` (or whatever the platform provides)
   - `MONGO_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A long, random string.
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: The URL where your frontend will be hosted (e.g., `https://fooddash-app.vercel.app`).

---

## 2. Frontend Deployment (e.g., Vercel, Netlify)

### Steps
1. Connect your GitHub repository to Vercel/Netlify.
2. Set the **Root Directory** to `frontend`.
3. The platform should automatically detect Vite settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add the following **Environment Variable**:
   - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://fooddash-api.onrender.com/api`).

---

## 3. Deployment Readiness Checklist

- [x] **Centralized API Config**: Global `API_BASE_URL` in `frontend/src/config.ts`.
- [x] **Environment Variables**: Both frontend and backend use `.env` patterns.
- [x] **CORS Configuration**: Backend allows the production `FRONTEND_URL`.
- [x] **Build Scripts**: `npm run build` is present in both `package.json` files.
- [x] **Database Connectivity**: Backend uses a configurable `MONGO_URI`.

## Local Build Test
To test the build locally before deploying:

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```
