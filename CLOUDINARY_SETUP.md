# Cloudinary Image Upload Setup

This guide will help you set up Cloudinary for image uploads in the community features.

## 🎯 What You Get

- ✅ Unsigned image uploads (no server-side code needed)
- ✅ 3MB file size limit
- ✅ Image type validation
- ✅ Progress tracking during upload
- ✅ Error handling with user-friendly messages
- ✅ Ready-to-use React components

## 📋 Prerequisites

1. A Cloudinary account (free tier available)
2. Your application running

## 🚀 Setup Steps

### Step 1: Create Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a free account
3. Verify your email

### Step 2: Get Your Cloud Name

1. Log in to [Cloudinary Dashboard](https://cloudinary.com/console)
2. On the dashboard, find your **Cloud name** (e.g., `demo`, `my-app-name`)
3. Copy it - you'll need it for the environment variables

### Step 3: Create Unsigned Upload Preset

1. In the Cloudinary dashboard, click **Settings** (gear icon)
2. Click **Upload** tab
3. Scroll down to **Upload presets** section
4. Click **Add upload preset**
5. Configure the preset:
   - **Preset name**: Choose a name (e.g., `community_images`)
   - **Signing Mode**: Select **Unsigned** ⚠️ Important!
   - **Folder**: (Optional) Set to `community/` to organize uploads
   - **Format**: Leave as "Original" or restrict to specific formats
   - **Upload control**:
     - ✅ Check "Allowed formats" → Add: jpg, png, gif, webp
     - ✅ Check "Max file size" → Set to 3 MB
     - ✅ Check "Max image dimensions" (optional) → e.g., 4096x4096
   - **Access control**: Public (default)
   - **Transformations**: (Optional) Add eager transformations for thumbnails
6. Click **Save**
7. Copy the **Preset name** - you'll need it next

### Step 4: Configure Environment Variables

Create a `.env` file in the project root (or update existing one):

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UNSIGNED_PRESET=your_preset_name_here

# MongoDB (from previous setup)
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=community_db
```

**Example:**
```env
VITE_CLOUDINARY_CLOUD_NAME=myapp
VITE_CLOUDINARY_UNSIGNED_PRESET=community_images
```

⚠️ **Important**: 
- Use `VITE_` prefix for client-side environment variables in Vite
- Never commit the `.env` file to git (it should be in `.gitignore`)

### Step 5: Restart Development Server

After adding environment variables, restart your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

### Step 6: Test the Upload

1. Navigate to your community page
2. Try uploading an image
3. Check the browser console for any errors
4. Verify the image appears and you get a Cloudinary URL

## 📦 What Was Created

### Core Utility (`client/lib/uploadImage.ts`)

```typescript
import { uploadImageUnsigned } from '@/lib/uploadImage';

// Simple upload
const imageUrl = await uploadImageUnsigned(file);

// With progress tracking
const imageUrl = await uploadImageWithProgress(file, (progress) => {
  console.log(`Upload progress: ${progress}%`);
});
```

### React Components (`client/components/ImageUpload.tsx`)

```typescript
import { ImageUpload } from '@/components/ImageUpload';

// Full component with preview
<ImageUpload 
  onImageUploaded={(url) => console.log('Uploaded:', url)}
  onRemove={() => console.log('Removed')}
/>

// Compact button version
<ImageUploadButton 
  onImageUploaded={(url) => console.log('Uploaded:', url)}
/>
```

## 🎨 Usage in Community Posts

Here's how to integrate with your post creation form:

```typescript
import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { CreatePostRequest } from '@shared/api';

function CreatePostForm() {
  const [imageUrl, setImageUrl] = useState('');
  const [formData, setFormData] = useState({
    nickname: '',
    text: '',
    topics: [],
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const postData: CreatePostRequest = {
      ...formData,
      imageUrl: imageUrl || undefined, // Only include if image was uploaded
    };

    const response = await fetch('/api/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      // Post created successfully
      const post = await response.json();
      console.log('Post created:', post);
      // Reset form, redirect, etc.
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nickname"
        value={formData.nickname}
        onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
        required
      />

      <textarea
        placeholder="Share your thoughts (20-1000 characters)"
        value={formData.text}
        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
        minLength={20}
        maxLength={1000}
        required
      />

      {/* Image upload component */}
      <ImageUpload
        onImageUploaded={setImageUrl}
        onRemove={() => setImageUrl('')}
        currentImageUrl={imageUrl}
      />

      <button type="submit">Post</button>
    </form>
  );
}
```

## 🔒 Security Considerations

### Unsigned Uploads - What You Should Know

**Pros:**
- ✅ No server-side code needed
- ✅ Fast and simple setup
- ✅ Direct upload from browser

**Cons:**
- ⚠️ Anyone with your preset name can upload
- ⚠️ No server-side validation
- ⚠️ Limited control over uploads

### Recommended Settings for Production

1. **Restrict allowed formats** in upload preset
2. **Set maximum file size** (3MB configured)
3. **Use folders** to organize uploads
4. **Enable moderation** if handling user-generated content
5. **Set up notifications** for upload activity
6. **Consider rate limiting** on your API endpoints

### When to Use Signed Uploads

Consider implementing signed uploads if:
- You need server-side validation
- You're handling sensitive content
- You need per-user upload quotas
- You want upload tracking/logging
- You need fine-grained access control

## 🛠️ Cloudinary Features You Can Use

### Image Transformations

Cloudinary URLs support on-the-fly transformations:

```typescript
// Original
const url = "https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg"

// Thumbnail (200x200, cropped)
const thumb = "https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill/v1234/sample.jpg"

// Optimized (auto format, auto quality)
const optimized = "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v1234/sample.jpg"

// Responsive
const responsive = "https://res.cloudinary.com/demo/image/upload/w_800,c_limit/v1234/sample.jpg"
```

### Helper Function for Transformations

```typescript
function getCloudinaryUrl(
  url: string, 
  width?: number, 
  height?: number, 
  crop: string = 'fill'
): string {
  // Insert transformation parameters into Cloudinary URL
  return url.replace('/upload/', `/upload/w_${width},h_${height},c_${crop},f_auto,q_auto/`);
}

// Usage
<img src={getCloudinaryUrl(imageUrl, 400, 300)} alt="Thumbnail" />
```

## 📊 Free Tier Limits

Cloudinary free tier includes:
- ✅ 25 GB storage
- ✅ 25 GB monthly bandwidth
- ✅ 25,000 transformations/month
- ✅ All basic features

This is typically enough for:
- Small to medium apps
- Development and testing
- MVP launches
- Community projects

## 🐛 Troubleshooting

### Error: "Cloudinary configuration is missing"

**Solution:** Make sure:
1. `.env` file exists in project root
2. Environment variables start with `VITE_`
3. Dev server was restarted after adding variables

### Error: "Upload failed: Unauthorized"

**Solution:**
1. Check that upload preset signing mode is **Unsigned**
2. Verify preset name matches `.env` configuration
3. Ensure cloud name is correct

### Images not uploading

**Checklist:**
- [ ] Cloudinary account is active
- [ ] Upload preset exists and is unsigned
- [ ] Environment variables are set correctly
- [ ] File is under 3MB
- [ ] File is a valid image type
- [ ] Dev server was restarted after env changes
- [ ] Browser console shows no CORS errors

### CORS errors

Cloudinary should allow cross-origin requests by default. If you see CORS errors:
1. Check that you're using the correct upload URL format
2. Verify your cloud name is correct
3. Try creating a new upload preset

### Upload is slow

Cloudinary upload speed depends on:
- Your internet connection
- Image file size
- Cloudinary server location

**Tips:**
- Compress images before upload if possible
- Show progress indicator to users
- Consider client-side image resizing for large files

## 📚 Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Upload Presets Guide](https://cloudinary.com/documentation/upload_presets)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [Upload Widget](https://cloudinary.com/documentation/upload_widget) (Advanced option)
- [React SDK](https://cloudinary.com/documentation/react_integration) (Alternative approach)

## 💡 Next Steps

1. ✅ Set up Cloudinary account
2. ✅ Create unsigned upload preset
3. ✅ Configure environment variables
4. ✅ Test image uploads
5. [ ] Integrate with community post form
6. [ ] Add image transformations for thumbnails
7. [ ] Set up moderation (if needed)
8. [ ] Monitor usage in Cloudinary dashboard

---

Need help? Check the [complete utility documentation](client/lib/README.md) or [component examples](client/components/ImageUpload.tsx).

