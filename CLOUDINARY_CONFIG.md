# Cloudinary Configuration - Centralized Setup

## 📁 New Files Created

### `client/lib/cloudinary.ts`
Centralized Cloudinary configuration with:
- `CLOUD_NAME` - Exported constant for cloud name
- `UNSIGNED_PRESET` - Exported constant for upload preset
- `HAS_CLOUDINARY` - Boolean indicating if Cloudinary is configured
- `assertCloudinary()` - Throws clear error if config is missing
- `getUploadUrl()` - Returns the full upload URL
- `getCloudinaryStatus()` - Debug helper to check configuration

## 🔧 Environment Variables

Set **ONE** of these pairs in your `.env` file:

### Option 1: Vite Style (Recommended)
```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UNSIGNED_PRESET=your_preset_name
```

### Option 2: Next.js Style (Also Supported)
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET=your_preset_name
```

The code automatically tries both prefixes!

## 🚀 Usage

### Basic Upload
```typescript
import { uploadImageUnsigned } from '@/lib/uploadImage';

const url = await uploadImageUnsigned(file);
```

### Check Configuration Status
```typescript
import { HAS_CLOUDINARY, getCloudinaryStatus } from '@/lib/uploadImage';

// Simple check
if (HAS_CLOUDINARY) {
  console.log('✅ Cloudinary is configured');
} else {
  console.log('❌ Cloudinary is NOT configured');
}

// Detailed status
console.log(getCloudinaryStatus());
// Output:
// {
//   cloudName: 'your_cloud_name',
//   uploadPreset: 'your_preset_name',
//   isConfigured: true,
//   uploadUrl: 'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload'
// }
```

### Debug in Browser Console
Open browser DevTools console and run:
```javascript
import('@/lib/uploadImage').then(m => console.log(m.getCloudinaryStatus()))
```

## ✅ What Changed

1. **Created** `client/lib/cloudinary.ts` - Centralized config
2. **Updated** `client/lib/uploadImage.ts` - Now uses centralized config
3. **Better Error Messages** - Clear instructions on what's missing
4. **Debug Helpers** - Easy to check config status

## 🎯 Benefits

- ✅ **Single Source of Truth** - Config read once, used everywhere
- ✅ **Better Error Messages** - Clear instructions when config is missing
- ✅ **Easy Debugging** - Check config status anytime
- ✅ **Type Safety** - TypeScript knows about the config
- ✅ **Backwards Compatible** - Existing code still works

## 🔍 Error Messages

### Before (generic):
```
Cloudinary configuration is missing
```

### After (detailed):
```
❌ Cloudinary cloud name is not configured.

Please set one of these environment variables:
  • VITE_CLOUDINARY_CLOUD_NAME (recommended for Vite)
  • NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

Add to your .env file:
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here

Then restart the dev server.
```

## 🧪 Testing

To test if Cloudinary is working:

1. Set environment variables in `.env`
2. Restart dev server (`pnpm dev`)
3. Check console: `import('@/lib/uploadImage').then(m => console.log(m.getCloudinaryStatus()))`
4. Try uploading an image in Community page

## 📝 Example .env File

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=shy

# Cloudinary (REQUIRED for image uploads)
VITE_CLOUDINARY_CLOUD_NAME=deh0v0ayi
VITE_CLOUDINARY_UNSIGNED_PRESET=shy-community

# Optional
VITE_SITE_URL=http://localhost:8080
```

## 🔗 Related Files

- `client/lib/cloudinary.ts` - Configuration constants
- `client/lib/uploadImage.ts` - Upload functions
- `client/components/ImageUpload.tsx` - Upload UI component
- `client/pages/community.tsx` - Uses image upload
- `client/vite-env.d.ts` - TypeScript environment types

---

**Note:** Always restart your dev server after changing `.env` files!

