# Deployment Guide for MERN App (Render + Vercel)

## 📋 Prerequisites
- MongoDB Atlas account (free tier available)
- Cloudinary account (for image uploads)
- Render account (for backend hosting)
- Vercel account (for frontend hosting)
- Git and GitHub account

## 🚀 Deployment Steps

### 1. Backend Deployment to Render

#### Step 1.1: Prepare MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add your IP to Network Access (add 0.0.0.0/0 for all IPs)
4. Create a database user with username and password
5. Copy the connection string: `mongodb+srv://username:password@cluster.mongodb.net/BlogAppFullStack`

#### Step 1.2: Push Backend to GitHub
```bash
cd backend
git init
git add .
git commit -m "Initial commit - backend"
git remote add origin https://github.com/YOUR_USERNAME/your-repo-name.git
git branch -M main
git push -u origin main
```

#### Step 1.3: Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select your repository
5. Fill in the details:
   - **Name**: blog-app-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid if needed)
6. Add Environment Variables:
   - `NODE_ENV`: production
   - `PORT`: (leave blank - Render sets this)
   - `DB_URL`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a strong secret (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
   - `CLOUD_NAME`: Your Cloudinary cloud name
   - `API_KEY`: Your Cloudinary API key
   - `API_SECRET`: Your Cloudinary API secret
   - `ALLOWED_ORIGINS`: https://your-vercel-frontend.vercel.app

7. Click "Create Web Service"
8. Wait for deployment to complete and note your backend URL (e.g., https://blog-app-backend.onrender.com)

#### Step 1.4: Update CORS
Once your Render backend URL is available:
- Update `ALLOWED_ORIGINS` environment variable to include your Vercel frontend URL

---

### 2. Frontend Deployment to Vercel

#### Step 2.1: Push Frontend to GitHub
```bash
cd frontend
git init
git add .
git commit -m "Initial commit - frontend"
git remote add origin https://github.com/YOUR_USERNAME/your-frontend-repo.git
git branch -M main
git push -u origin main
```

#### Step 2.2: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your frontend GitHub repository
4. Fill in the details:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Add Environment Variables:
   - `VITE_API_BASE_URL`: https://your-backend-render-url.onrender.com
6. Click "Deploy"
7. Wait for deployment to complete and note your Vercel URL (e.g., https://your-frontend.vercel.app)

#### Step 2.3: Update Backend CORS (if changed)
- Go back to Render dashboard
- Update `ALLOWED_ORIGINS` to include your Vercel frontend URL
- Trigger a redeploy

---

### 3. Verify Deployment

#### Test Backend
```bash
curl https://your-backend-render-url.onrender.com/common-api/check-auth
```

#### Test Frontend
1. Visit: https://your-frontend.vercel.app
2. Try login/signup functionality
3. Check browser console for any errors

#### Monitor Logs
- **Render**: Dashboard → Your service → Logs
- **Vercel**: Dashboard → Your project → Deployments → View Logs

---

## 🔄 Environment Variables Summary

### Backend (.env in Vercel)
```
NODE_ENV=production
PORT=<Render assigns>
DB_URL=mongodb+srv://user:pass@cluster.mongodb.net/BlogAppFullStack
JWT_SECRET=<strong_random_key>
CLOUD_NAME=<your_cloudinary_cloud>
API_KEY=<your_api_key>
API_SECRET=<your_api_secret>
ALLOWED_ORIGINS=https://your-vercel-frontend.vercel.app
```

### Frontend (.env in Vercel)
```
VITE_API_BASE_URL=https://your-render-backend.onrender.com
```

---

## 🛠️ Troubleshooting

### CORS Errors
- Check `ALLOWED_ORIGINS` in backend environment variables
- Make sure frontend URL matches exactly (including protocol)
- Restart backend after updating environment variables

### Database Connection Errors
- Verify MongoDB IP whitelist includes 0.0.0.0/0
- Check DB_URL connection string format
- Ensure password has no special characters (or is URL encoded)

### Frontend Blank Page
- Check browser console for errors
- Verify `VITE_API_BASE_URL` is set correctly
- Check that VITE_ prefix is used in frontend env variables

### Build Failures
- Clear node_modules and reinstall: `npm ci`
- Check Node version compatibility (12+)
- Review build logs in Vercel/Render dashboard

---

## 📝 Useful Commands

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test API Locally with Environment
```bash
# Backend
NODE_ENV=production PORT=5000 npm start

# Frontend (in separate terminal)
VITE_API_BASE_URL=http://localhost:5000 npm run dev
```

### View Render Logs
```bash
# Live logs (requires Render CLI)
render logs
```

---

## 🎯 Next Steps After Deployment
1. Set up custom domain (optional)
2. Enable auto-deployments on push
3. Set up monitoring and alerts
4. Configure backup strategies for database
5. Plan for scaling if needed

For detailed documentation:
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
