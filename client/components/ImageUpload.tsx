import { useState, useRef } from 'react';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';
import { canUploadImage } from '@/lib/uploadImage';
import { Button } from '@/components/ui/button';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  onRemove?: () => void;
  currentImageUrl?: string;
  disabled?: boolean;
}

/**
 * Image upload component with preview and progress
 * Uses Cloudinary unsigned upload
 */
export function ImageUpload({ 
  onImageUploaded, 
  onRemove,
  currentImageUrl,
  disabled = false 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset error
    setError('');

    // Validate file
    const validation = canUploadImage(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    // Create local preview
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setUploading(true);
    setProgress(0);

    try {
      // Upload to Cloudinary
      const result = await uploadToCloudinary(file);

      // Clean up local preview
      URL.revokeObjectURL(localPreview);
      
      // Update with Cloudinary URL
      setPreviewUrl(result.url);
      onImageUploaded(result.url);
    } catch (err) {
      // Clean up local preview on error
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(currentImageUrl || '');
      
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Upload failed. Please try again.');
      }
    } finally {
      setUploading(false);
      setProgress(0);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  function handleRemove() {
    setPreviewUrl('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onRemove?.();
  }

  function handleClick() {
    fileInputRef.current?.click();
  }

  return (
    <div className="space-y-3">
      {/* Preview or Upload Button */}
      {previewUrl ? (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Upload preview"
            className="max-w-full max-h-64 rounded-lg shadow-md object-cover"
          />
          
          {/* Progress overlay during upload */}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <div className="mb-2">Uploading...</div>
                <div className="text-2xl font-bold">{progress}%</div>
              </div>
            </div>
          )}

          {/* Remove button */}
          {!uploading && (
            <button
              onClick={handleRemove}
              disabled={disabled}
              className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled || uploading}
            className="hidden"
            aria-label="Upload image"
          />
          
          <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            disabled={disabled || uploading}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Image
          </Button>
        </div>
      )}

      {/* Help text */}
      {!previewUrl && (
        <p className="text-xs text-muted-foreground">
          <ImageIcon className="w-3 h-3 inline mr-1" />
          Max 3MB. Supported: JPG, PNG, GIF, WebP
        </p>
      )}

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </div>
      )}

      {/* Progress bar (alternative to overlay) */}
      {uploading && !previewUrl && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact version with just icon button
 */
export function ImageUploadButton({ 
  onImageUploaded, 
  disabled = false 
}: Pick<ImageUploadProps, 'onImageUploaded' | 'disabled'>) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = canUploadImage(file);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    setUploading(true);

    try {
      const result = await uploadToCloudinary(file);
      onImageUploaded(result.url);
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('Upload failed. Please try again.');
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || uploading}
        className="hidden"
      />
      
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled || uploading}
        aria-label="Upload image"
      >
        {uploading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <ImageIcon className="w-4 h-4" />
        )}
      </Button>
    </>
  );
}

