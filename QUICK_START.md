# 🚀 Quick Start Guide

## 1️⃣ Create `.env` File

Copy this into a new file named `.env` in the project root:

```env
MONGODB_URI="mongodb+srv://researchbdy_db_user:researchbdy2004@clustershy.grhh9ap.mongodb.net/?retryWrites=true&w=majority&appName=ClusterShy"
MONGODB_DB="shy"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="deh0v0ayi"
NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET="shy-community"
NEXT_PUBLIC_SITE_URL="http://localhost:8080"
```

## 2️⃣ Restart Server

```bash
npm run dev
```

## 3️⃣ Look for Success Message

In your terminal, you should see:
```
✅ MongoDB connected successfully
```

## 4️⃣ Test on Community Page

1. Go to the community page
2. Create a post (20+ characters)
3. Add a comment (5+ characters)
4. Upload an image
5. Use filters

## ✅ Everything Works!

Your community page is now:
- ✅ Connected to MongoDB Atlas
- ✅ Saving posts to database
- ✅ Saving comments to database
- ✅ Uploading images to Cloudinary
- ✅ Filtering and sorting posts
- ✅ Real-time updates

## 🎯 What You Can Do Now

### Create Posts
- Text posts (20-1000 characters)
- Posts with images
- Tag posts with topics
- Blur sensitive images

### Add Comments
- Comment on any post
- 5-500 characters
- Real-time updates

### Use Filters
- Sort by date or popularity
- Filter by content type
- Filter by topics
- Safe mode toggle

### View Data
Go to [MongoDB Atlas](https://cloud.mongodb.com/) to see your data:
- Database: `shy`
- Collections: `posts`, `comments`

---

**That's it! You're ready to go!** 🎉

See `MONGODB_SETUP_COMPLETE.md` for detailed documentation.

