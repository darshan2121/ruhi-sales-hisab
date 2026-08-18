# 🚀 Ruhi Sales Hisab - Production Deployment & MongoDB Setup Guide

This guide details the complete production-level setup for deploying **Ruhi Sales Hisab** with a live MongoDB database.

---

## 1. MongoDB Atlas (Cloud Database) Setup

1. **Create Free MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free cluster (M0 Free Tier).

2. **Create Database User**:
   - Go to **Database Access** -> **Add New Database User**.
   - Set Username (e.g., `ruhi_admin`) and a strong Password.

3. **Configure Network Access**:
   - Go to **Network Access** -> **Add IP Address**.
   - Click **Allow Access from Anywhere** (`0.0.0.0/0`) so your cloud web server can connect.

4. **Copy Connection String**:
   - Go to **Database** -> **Connect** -> **Drivers**.
   - Copy the MongoDB URI:
     `mongodb+srv://ruhi_admin:<password>@cluster0.mongodb.net/ruhi_sales_hisab?retryWrites=true&w=majority`

---

## 2. Environment Variables (.env)

In your production hosting environment, configure the following environment variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://ruhi_admin:<password>@cluster0.mongodb.net/ruhi_sales_hisab?retryWrites=true&w=majority
```

---

## 3. Recommended Cloud Deployment Options

### Option A: Deploy on Render.com (Easiest - Free Tier Available)

1. Connect your GitHub repository to [Render.com](https://render.com).
2. Click **New +** -> **Web Service**.
3. Set the following settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. In **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `mongodb+srv://ruhi_admin:<password>@cluster0.mongodb.net/ruhi_sales_hisab`
5. Click **Create Web Service**. Your live app URL will be ready in 2 minutes!

---

### Option B: Deploy on Railway.app

1. Go to [Railway.app](https://railway.app) and create a new project from your GitHub repo.
2. Railway will auto-detect Node.js.
3. In variables, add `MONGODB_URI` and `NODE_ENV=production`.
4. Deploy!

---

### Option C: Deploy on Ubuntu VPS (Hostinger / DigitalOcean / AWS EC2 with PM2 & Nginx)

1. **SSH into Server**:
   ```bash
   git clone <your-repo-url>
   cd ruhi-sales-hisab
   npm install
   npm run build
   ```

2. **Create `.env` file**:
   ```bash
   nano .env
   ```
   Add:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://ruhi_admin:<password>@cluster0.mongodb.net/ruhi_sales_hisab
   ```

3. **Start Process Manager (PM2)**:
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name "ruhi-sales"
   pm2 save
   pm2 startup
   ```

4. **Nginx Reverse Proxy Config**:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## 🛡️ Production Security & Performance Included

- ✅ **Helmet Security Headers**: Protection against XSS, Clickjacking, MIME sniffing.
- ✅ **API Rate Limiting**: Max 200 requests/minute per IP to block brute-force attacks.
- ✅ **Response Compression**: Gzip compression enabled for fast mobile loading.
- ✅ **Single Server Architecture**: Production mode serves both the React UI and API endpoints on a single port.
- ✅ **Graceful Shutdown**: Automatically closes active MongoDB connections on process termination.
