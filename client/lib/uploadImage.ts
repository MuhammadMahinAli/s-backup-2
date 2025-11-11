/**
 * Cloudinary Image Upload Utility
 * Handles unsigned uploads to Cloudinary
 */

import { 
  CLOUD_NAME, 
  UNSIGNED_PRESET, 
  HAS_CLOUDINARY,
  assertCloudinary, 
  getUploadUrl,
  getCloudinaryStatus 
} from './cloudinary';

// Re-export for convenience
export { HAS_CLOUDINARY, getCloudinaryStatus };

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  url: string;
}

export class ImageUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageUploadError';
  }
}

/**
 * Validates if a file is an image and within size limits
 * @param file - The file to validate
 * @throws {ImageUploadError} If validation fails
 */
function validateImage(file: File): void {
  // Check if file type is an image
  if (!file.type.startsWith('image/')) {
    throw new ImageUploadError(
      `Invalid file type: ${file.type}. Only image files are allowed.`
    );
  }

  // Check file size (max 3MB)
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    throw new ImageUploadError(
      `File size (${sizeMB}MB) exceeds the maximum allowed size of 3MB.`
    );
  }
}

/**
 * Uploads an image to Cloudinary using unsigned upload
 * @param file - The image file to upload
 * @returns Promise that resolves to the secure URL of the uploaded image
 * @throws {ImageUploadError} If validation fails or upload fails
 */
export async function uploadImageUnsigned(file: File): Promise<string> {
  // Validate Cloudinary configuration
  try {
    assertCloudinary();
  } catch (error) {
    throw new ImageUploadError(error instanceof Error ? error.message : 'Cloudinary is not configured');
  }

  // Validate the image file
  validateImage(file);

  // Create FormData for upload
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UNSIGNED_PRESET);

  // Build Cloudinary upload URL
  const uploadUrl = getUploadUrl();

  try {
    // Upload to Cloudinary
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ImageUploadError(
        `Upload failed: ${errorData.error?.message || response.statusText}`
      );
    }

    const data: CloudinaryResponse = await response.json();

    // Return the secure URL
    return data.secure_url;
  } catch (error) {
    if (error instanceof ImageUploadError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new ImageUploadError(`Upload failed: ${error.message}`);
    }

    throw new ImageUploadError('Upload failed: Unknown error occurred');
  }
}

/**
 * Uploads an image with progress tracking
 * @param file - The image file to upload
 * @param onProgress - Callback for upload progress (0-100)
 * @returns Promise that resolves to the secure URL of the uploaded image
 */
export async function uploadImageWithProgress(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Validate Cloudinary configuration
  try {
    assertCloudinary();
  } catch (error) {
    throw new ImageUploadError(error instanceof Error ? error.message : 'Cloudinary is not configured');
  }

  // Validate the image file
  validateImage(file);

  // Create FormData for upload
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UNSIGNED_PRESET);

  // Build Cloudinary upload URL
  const uploadUrl = getUploadUrl();

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          onProgress(percentComplete);
        }
      });
    }

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data: CloudinaryResponse = JSON.parse(xhr.responseText);
          resolve(data.secure_url);
        } catch (error) {
          reject(new ImageUploadError('Failed to parse upload response'));
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          reject(
            new ImageUploadError(
              `Upload failed: ${errorData.error?.message || xhr.statusText}`
            )
          );
        } catch {
          reject(new ImageUploadError(`Upload failed: ${xhr.statusText}`));
        }
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      reject(new ImageUploadError('Network error occurred during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new ImageUploadError('Upload was aborted'));
    });

    // Send request
    xhr.open('POST', uploadUrl);
    xhr.send(formData);
  });
}

/**
 * Helper to check if a file can be uploaded
 * @param file - The file to check
 * @returns Object with isValid boolean and error message if invalid
 */
export function canUploadImage(file: File): { isValid: boolean; error?: string } {
  try {
    validateImage(file);
    return { isValid: true };
  } catch (error) {
    if (error instanceof ImageUploadError) {
      return { isValid: false, error: error.message };
    }
    return { isValid: false, error: 'Unknown validation error' };
  }
}

