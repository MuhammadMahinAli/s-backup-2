/**
 * Centralized Cloudinary Configuration
 * Read environment variables once and export for reuse
 */

// Support both NEXT_PUBLIC_ and VITE_ prefixes for flexibility
export const CLOUD_NAME = 
  import.meta.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 
  '';

export const UNSIGNED_PRESET = 
  import.meta.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET || 
  import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET || 
  '';

export const HAS_CLOUDINARY = Boolean(CLOUD_NAME && UNSIGNED_PRESET);

/**
 * Asserts that Cloudinary is properly configured
 * Throws a clear error if configuration is missing
 * Use this at the entry point of upload functions
 */
export function assertCloudinary(): void {
  if (!CLOUD_NAME) {
    throw new Error(
      '❌ Cloudinary cloud name is not configured.\n\n' +
      'Please set one of these environment variables:\n' +
      '  • VITE_CLOUDINARY_CLOUD_NAME (recommended for Vite)\n' +
      '  • NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME\n\n' +
      'Add to your .env file:\n' +
      'VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here\n\n' +
      'Then restart the dev server.'
    );
  }

  if (!UNSIGNED_PRESET) {
    throw new Error(
      '❌ Cloudinary upload preset is not configured.\n\n' +
      'Please set one of these environment variables:\n' +
      '  • VITE_CLOUDINARY_UNSIGNED_PRESET (recommended for Vite)\n' +
      '  • NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET\n\n' +
      'Add to your .env file:\n' +
      'VITE_CLOUDINARY_UNSIGNED_PRESET=your_preset_name_here\n\n' +
      'Then restart the dev server.'
    );
  }
}

/**
 * Returns the Cloudinary upload URL
 */
export function getUploadUrl(): string {
  assertCloudinary();
  return `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
}

/**
 * Get configuration status for debugging
 */
export function getCloudinaryStatus() {
  return {
    cloudName: CLOUD_NAME || '(not set)',
    uploadPreset: UNSIGNED_PRESET || '(not set)',
    isConfigured: HAS_CLOUDINARY,
    uploadUrl: HAS_CLOUDINARY ? getUploadUrl() : '(not available)',
  };
}

