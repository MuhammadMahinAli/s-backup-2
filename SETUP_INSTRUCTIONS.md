# Setup Instructions for Community Page

## 1. Create Environment File

Create a `.env` file in the project root with your credentials:

```env
MONGODB_URI="mongodb+srv://researchbdy_db_user:researchbdy2004@clustershy.grhh9ap.mongodb.net/?retryWrites=true&w=majority&appName=ClusterShy"
MONGODB_DB="shy"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="deh0v0ayi"
NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET="shy-community"

NEXT_PUBLIC_SITE_URL="http://localhost:8080"
```

**Important**: The `.env` file should be in the same directory as `package.json`

## 2. Restart Development Server

After creating the `.env` file, restart your development server:

```bash
# Stop current server (Ctrl+C)
npm run dev
```

## 3. Test the Features

Navigate to the community page and test:

### ✅ Post Creation
- Enter a nickname (optional, defaults to "Anonymous")
- Type at least 20 characters in the text area
- Optionally add an image using the "Add Image" button
- Toggle "Blur image" if you want the image blurred
- Click "Post" button

### ✅ Image Upload
- Click "Add Image" button
- Select an image file (max 3MB)
- See upload progress
- Image preview appears
- Can remove with X button

### ✅ Comments
- Click on the comment count on any post
- Comments section expands
- Enter nickname (optional) and comment text (5+ characters)
- Press Enter or click "Send"
- See comment added immediately

### ✅ Filters
- **Sort by**: Change between Most Recent, Most Popular, Oldest
- **Content Type**: Filter by All, Text, or Images
- **Topics**: Click topics to filter posts
- Click "Clear" to reset all filters
- Click "Apply" to refresh with current filters

## Features Implemented

### Post Features
- ✅ Create posts with nickname and text (20-1000 chars)
- ✅ Upload images to Cloudinary with progress tracking
- ✅ Remove uploaded images
- ✅ Blur sensitive images
- ✅ Tag posts with topics
- ✅ Real-time character count
- ✅ Form validation with error messages
- ✅ Loading states during posting

### Feed Features
- ✅ Load posts from MongoDB
- ✅ Sort by date or popularity
- ✅ Filter by content type (text/images)
- ✅ Filter by topics
- ✅ Pagination (10 posts per page)
- ✅ Loading and error states

### Comment Features
- ✅ Toggle comments section per post
- ✅ Add comments with nickname and text
- ✅ Load comments from database
- ✅ Real-time comment count updates
- ✅ Press Enter to submit

### UI/UX
- ✅ Responsive design
- ✅ Loading spinners
- ✅ Error messages
- ✅ Disabled states during operations
- ✅ Smooth transitions
- ✅ Character limits enforced
- ✅ Image preview with blur support

## API Endpoints Used

- `POST /api/post` - Create new post
- `GET /api/feed?page=1&limit=10` - Get paginated posts
- `POST /api/comment` - Add comment
- `GET /api/comments?postId=<id>` - Get post comments
- Cloudinary API for image uploads

## Troubleshooting

### "Failed to load feed"
- Check MongoDB connection in `.env`
- Ensure MongoDB server is running
- Check browser console for errors

### Image upload fails
- Verify Cloudinary credentials in `.env`
- Check image size (must be under 3MB)
- Ensure file is a valid image type
- Check browser console for errors

### Environment variables not working
- Make sure `.env` file is in project root
- Restart dev server after creating/editing `.env`
- Check file is named exactly `.env` (not `.env.txt`)

### Posts not appearing
- Check MongoDB connection
- Look at server console for errors
- Try refreshing the page
- Check filter settings (Clear filters)

## Next Steps

1. Test all features thoroughly
2. Add more topics if needed
3. Customize styling/colors
4. Add moderation features
5. Implement reporting system (POST /api/report is already available)
6. Add user authentication (optional)

Enjoy your fully functional community page! 🎉

