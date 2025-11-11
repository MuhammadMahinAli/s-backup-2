# Client Utilities

## Image Upload to Cloudinary

The `uploadImage.ts` utility provides functions for uploading images to Cloudinary using unsigned uploads.

### Setup

1. **Create an unsigned upload preset in Cloudinary:**
   - Log in to [Cloudinary Dashboard](https://cloudinary.com/console)
   - Go to Settings → Upload
   - Scroll to "Upload presets"
   - Click "Add upload preset"
   - Set signing mode to "Unsigned"
   - Configure your preset settings
   - Save and note the preset name

2. **Add environment variables:**

Create a `.env` file in the project root:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UNSIGNED_PRESET=your_preset_name
```

Or for production, set these in your deployment platform (Vercel, Netlify, etc.)

### Usage

#### Basic Upload

```typescript
import { uploadImageUnsigned, ImageUploadError } from '@/lib/uploadImage';

async function handleFileUpload(file: File) {
  try {
    const imageUrl = await uploadImageUnsigned(file);
    console.log('Image uploaded:', imageUrl);
    // Use imageUrl in your app (save to database, display, etc.)
  } catch (error) {
    if (error instanceof ImageUploadError) {
      alert(error.message);
    }
  }
}

// Example with file input
<input 
  type="file" 
  accept="image/*" 
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }}
/>
```

#### Upload with Progress Tracking

```typescript
import { uploadImageWithProgress } from '@/lib/uploadImage';
import { useState } from 'react';

function ImageUploader() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    setProgress(0);

    try {
      const imageUrl = await uploadImageWithProgress(file, (progress) => {
        setProgress(progress);
      });
      
      console.log('Upload complete:', imageUrl);
      // Use imageUrl...
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  return (
    <div>
      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        disabled={uploading}
      />
      {uploading && <progress value={progress} max={100} />}
      {uploading && <span>{progress}%</span>}
    </div>
  );
}
```

#### Validate Before Upload

```typescript
import { canUploadImage } from '@/lib/uploadImage';

function handleFileSelect(file: File) {
  const validation = canUploadImage(file);
  
  if (!validation.isValid) {
    alert(validation.error);
    return;
  }
  
  // Proceed with upload
  uploadImageUnsigned(file);
}
```

#### Complete Example Component

```typescript
import { useState } from 'react';
import { uploadImageUnsigned, canUploadImage, ImageUploadError } from '@/lib/uploadImage';
import { Button } from '@/components/ui/button';

export function ImageUploadForm() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate first
    const validation = canUploadImage(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const url = await uploadImageUnsigned(file);
      setImageUrl(url);
      console.log('Image uploaded successfully:', url);
    } catch (err) {
      if (err instanceof ImageUploadError) {
        setError(err.message);
      } else {
        setError('Upload failed. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="image-upload" className="block text-sm font-medium mb-2">
          Upload Image
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          Max file size: 3MB. Supported formats: JPG, PNG, GIF, WebP
        </p>
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      {uploading && (
        <div className="text-blue-600 text-sm">
          Uploading...
        </div>
      )}

      {imageUrl && (
        <div className="space-y-2">
          <p className="text-green-600 text-sm">Upload successful!</p>
          <img 
            src={imageUrl} 
            alt="Uploaded" 
            className="max-w-sm rounded-lg shadow-md"
          />
          <p className="text-xs text-gray-600 break-all">{imageUrl}</p>
        </div>
      )}
    </div>
  );
}
```

### API Reference

#### `uploadImageUnsigned(file: File): Promise<string>`

Uploads an image to Cloudinary using unsigned upload.

**Parameters:**
- `file` - The image file to upload

**Returns:**
- Promise that resolves to the secure URL of the uploaded image

**Throws:**
- `ImageUploadError` if validation fails or upload fails

**Validation:**
- File must be of type `image/*`
- File size must not exceed 3MB

---

#### `uploadImageWithProgress(file: File, onProgress?: (progress: number) => void): Promise<string>`

Uploads an image with progress tracking.

**Parameters:**
- `file` - The image file to upload
- `onProgress` - Optional callback function that receives progress (0-100)

**Returns:**
- Promise that resolves to the secure URL of the uploaded image

**Throws:**
- `ImageUploadError` if validation fails or upload fails

---

#### `canUploadImage(file: File): { isValid: boolean; error?: string }`

Validates if a file can be uploaded without actually uploading it.

**Parameters:**
- `file` - The file to validate

**Returns:**
- Object with `isValid` boolean and optional `error` message

**Example:**
```typescript
const result = canUploadImage(file);
if (!result.isValid) {
  console.error(result.error);
}
```

---

#### `ImageUploadError`

Custom error class for image upload errors.

**Properties:**
- `name` - Always "ImageUploadError"
- `message` - Descriptive error message

### Validation Rules

| Rule | Description |
|------|-------------|
| File Type | Must be `image/*` (JPEG, PNG, GIF, WebP, etc.) |
| File Size | Maximum 3MB (3,145,728 bytes) |
| Environment | Requires `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UNSIGNED_PRESET` |

### Error Handling

The utility provides detailed error messages for common issues:

- **Invalid file type**: "Invalid file type: {type}. Only image files are allowed."
- **File too large**: "File size ({size}MB) exceeds the maximum allowed size of 3MB."
- **Missing config**: "Cloudinary cloud name is not configured..."
- **Upload failed**: "Upload failed: {error message}"
- **Network error**: "Network error occurred during upload"

### Cloudinary Response

The full Cloudinary response includes:

```typescript
interface CloudinaryResponse {
  secure_url: string;    // HTTPS URL of the uploaded image
  public_id: string;     // Cloudinary public ID
  width: number;         // Image width in pixels
  height: number;        // Image height in pixels
  format: string;        // Image format (jpg, png, etc.)
  resource_type: string; // Resource type (image)
  created_at: string;    // Upload timestamp
  bytes: number;         // File size in bytes
  url: string;           // HTTP URL (use secure_url instead)
}
```

### Best Practices

1. **Always validate** files before attempting upload
2. **Handle errors** gracefully with user-friendly messages
3. **Show progress** for better UX on slow connections
4. **Disable form** during upload to prevent multiple submissions
5. **Store URLs** returned by Cloudinary in your database
6. **Use transformations** in Cloudinary for responsive images:
   ```typescript
   // Original: https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg
   // Thumbnail: https://res.cloudinary.com/demo/image/upload/w_200,h_200,c_fill/v1234/sample.jpg
   ```

### Security Notes

- Unsigned uploads are convenient but less secure
- Configure your upload preset carefully:
  - Limit allowed formats
  - Set maximum file size
  - Enable moderation if needed
  - Consider folder restrictions
- For production apps with sensitive content, consider using signed uploads
- Never expose API secrets in client-side code

### Troubleshooting

**"Cloudinary configuration is missing"**
- Check that `.env` file exists in project root
- Verify environment variable names are correct
- Restart dev server after adding env variables

**"Upload failed: Unauthorized"**
- Verify your upload preset is set to "Unsigned"
- Check that the preset name matches your `.env` configuration
- Confirm the cloud name is correct

**"Upload failed: Invalid image file"**
- Check file format is supported
- Try a different image file
- Verify the image isn't corrupted

**CORS errors**
- Cloudinary should allow cross-origin requests by default
- Check browser console for specific CORS messages
- Verify you're using the correct Cloudinary URL format

