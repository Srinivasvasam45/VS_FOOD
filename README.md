# 🍔 VS FOOD — Futuristic Reels-Based Food Discovery & Delivery Platform

An ultra-modern, production-ready food delivery web platform inspired by **Zomato** with an **Instagram Reels-style food video discovery experience**, built with the **MERN Stack** (MongoDB, Express.js, React 18, Node.js) and a **futuristic Glassmorphism 2.0 & Cyber Glow aesthetic**.

---

## 🌟 Key Features

- **📱 Instagram Reels Food Feed**: Vertical snap-scrolling video player with `IntersectionObserver` autoplay/pause, dynamic timeline scrubber, live audio soundwave visualizer, double-tap blooming heart burst, and quick "Add to Cart".
- **🗺️ Geolocation & Haversine Distance**: Real-time GPS distance calculation between customer location and restaurant kitchens.
- **✨ Holographic Restaurant Profiles**: Stories-gradient avatar ring, reels video grid with live modal preview, and categorized full menu list.
- **🛡️ Single-Kitchen Cart Integrity**: Automatic conflict detection modal when ordering across different restaurants, with server-side price recalculation directly from MongoDB.
- **🚀 Live Order Tracking Stepper**: Cyberpunk-style 5-step live order progression timeline (`Placed` ➔ `Accepted` ➔ `Kitchen Prep` ➔ `On the Way` ➔ `Delivered`).
- **💼 Food Partner Management Portal**: Executive dashboard with real-time KPI metrics, video reel uploader (supporting Cloudinary & direct MP4 links), availability toggles, and live order fulfillment pipeline.

---

## 🚀 Live Deployment Guide

### Option 1: 1-Click Unified Full-Stack Deployment (Render / Railway)

This repository includes [`render.yaml`](./render.yaml) for automated fullstack deployment. The Node.js Express server automatically serves the compiled React frontend (`frontend/dist`) and handles all `/api/*` endpoints under a single live URL.

1. Push your repository to GitHub: `https://github.com/Srinivasvasam45/VS_FOOD`
2. Go to [Render.com](https://render.com) and log in.
3. Click **New +** ➔ **Web Service** ➔ Connect your `VS_FOOD` repository.
4. Set the following build and start commands (or use `render.yaml`):
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Add your Environment Variables in Render:
   - `MONGODB_URI`: `your_mongodb_atlas_connection_string`
   - `JWT_SECRET`: `your_secure_jwt_secret_key`
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `CLOUDINARY_CLOUD_NAME`: (Optional, for media uploads)
   - `CLOUDINARY_API_KEY`: (Optional)
   - `CLOUDINARY_API_SECRET`: (Optional)
6. Click **Deploy Web Service**! You will get your live URL (e.g. `https://vs-food.onrender.com`).

---

### Option 2: Split Deployment (Vercel Frontend + Render/Railway Backend)

#### Deploying Backend (Render):
1. Create a Web Service with **Root Directory** set to `backend`.
2. **Build Command**: `npm install`
3. **Start Command**: `node server.js`
4. Set environment variables (`MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`).
5. Copy your backend live URL (e.g., `https://vs-food-api.onrender.com`).

#### Deploying Frontend (Vercel):
1. Go to [Vercel.com](https://vercel.com) ➔ **Add New Project** ➔ Import `VS_FOOD`.
2. Set **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Add Environment Variable:
   - `VITE_API_URL`: `https://vs-food-api.onrender.com/api`
5. Click **Deploy**! You will receive your live link (e.g., `https://vs-food.vercel.app`).

---

## 💻 Local Development Setup

### 1. Configure MongoDB Connection
In `backend/.env`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

### 2. Optional: Seed Sample Restaurants & Food Reels
```bash
cd backend
npm run seed
```

### 3. Start Backend & Frontend Concurrently
From the project root:
```bash
# Start backend API (http://localhost:5000)
cd backend
npm run dev

# In a separate terminal, start frontend (http://localhost:5173)
cd frontend
npm run dev
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router v6, Axios
- **Backend**: Node.js, Express.js, Mongoose, JWT, Multer, Cloudinary, Bcrypt.js
- **Database**: MongoDB (Atlas / Local MongoDB URI)
- **Deployment**: Render, Vercel, Railway