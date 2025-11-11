import { useState, useRef } from 'react';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';
import { HAS_CLOUDINARY, getCloudinaryStatus } from '@/lib/uploadImage';
import { CheckCircle, XCircle, Upload, AlertCircle } from 'lucide-react';

export default function DebugCloudinary() {
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{ url: string; publicId: string } | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const status = getCloudinaryStatus();

  // Mask sensitive data
  const maskString = (str: string) => {
    if (!str || str === '(not set)') return str;
    if (str.length <= 6) return '*'.repeat(str.length);
    return str.slice(0, 3) + '*'.repeat(str.length - 6) + str.slice(-3);
  };

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    setError('');
    setUploading(true);

    try {
      const result = await uploadToCloudinary(f);
      setUploadedImage(result);
      console.log('✅ Upload successful:', result);
    } catch (err: any) {
      console.error('❌ Upload failed:', err);
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🔍 Cloudinary Debug Panel
          </h1>
          <p className="text-gray-600">
            Test your Cloudinary configuration and image uploads
          </p>
        </div>

        {/* Configuration Status */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 Configuration Status
          </h2>

          {/* Overall Status */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50">
            {HAS_CLOUDINARY ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
            <div>
              <div className="font-semibold text-gray-900">
                {HAS_CLOUDINARY ? '✅ Cloudinary Configured' : '❌ Cloudinary Not Configured'}
              </div>
              <div className="text-sm text-gray-600">
                {HAS_CLOUDINARY 
                  ? 'All required environment variables are set'
                  : 'Missing required environment variables'}
              </div>
            </div>
          </div>

          {/* Configuration Details */}
          <div className="space-y-3">
            <div className="grid grid-cols-[200px_1fr] gap-4 p-3 rounded bg-gray-50">
              <div className="font-medium text-gray-700">Cloud Name:</div>
              <div className="font-mono text-sm text-gray-900">
                {status.cloudName === '(not set)' ? (
                  <span className="text-red-600">{status.cloudName}</span>
                ) : (
                  <span className="text-green-600">{maskString(status.cloudName)}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4 p-3 rounded bg-gray-50">
              <div className="font-medium text-gray-700">Upload Preset:</div>
              <div className="font-mono text-sm text-gray-900">
                {status.uploadPreset === '(not set)' ? (
                  <span className="text-red-600">{status.uploadPreset}</span>
                ) : (
                  <span className="text-green-600">{maskString(status.uploadPreset)}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4 p-3 rounded bg-gray-50">
              <div className="font-medium text-gray-700">Upload URL:</div>
              <div className="font-mono text-xs text-gray-600 break-all">
                {status.uploadUrl}
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4 p-3 rounded bg-gray-50">
              <div className="font-medium text-gray-700">Is Configured:</div>
              <div className="font-mono text-sm">
                {status.isConfigured ? (
                  <span className="text-green-600 font-semibold">true</span>
                ) : (
                  <span className="text-red-600 font-semibold">false</span>
                )}
              </div>
            </div>
          </div>

          {/* Warning if not configured */}
          {!HAS_CLOUDINARY && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-semibold mb-2">Configuration Required</p>
                  <p className="mb-2">Add these to your <code className="bg-red-100 px-1 rounded">.env</code> file:</p>
                  <pre className="bg-red-100 p-2 rounded text-xs overflow-x-auto">
{`VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UNSIGNED_PRESET=your_preset_name`}
                  </pre>
                  <p className="mt-2">Then restart the dev server.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upload Test */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📤 Upload Test
          </h2>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading || !HAS_CLOUDINARY}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || !HAS_CLOUDINARY}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>
                  {HAS_CLOUDINARY ? 'Choose Image to Upload' : 'Configure Cloudinary First'}
                </span>
              </>
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex gap-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-800">Upload Failed</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Display */}
          {uploadedImage && (
            <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-800">Upload Successful!</p>
                  <p className="text-sm text-green-700 mt-1">Image uploaded to Cloudinary</p>
                </div>
              </div>

              {/* Image Preview */}
              <div className="space-y-2">
                <img
                  src={uploadedImage.url}
                  alt="Uploaded"
                  className="max-w-full rounded-lg shadow-md"
                />
                
                <div className="space-y-2 text-sm">
                  <div className="p-3 bg-white rounded border border-green-200">
                    <div className="font-medium text-gray-700 mb-1">Secure URL:</div>
                    <div className="font-mono text-xs text-gray-600 break-all">
                      {uploadedImage.url}
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white rounded border border-green-200">
                    <div className="font-medium text-gray-700 mb-1">Public ID:</div>
                    <div className="font-mono text-xs text-gray-600 break-all">
                      {uploadedImage.publicId}
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded border border-green-200">
                    <div className="font-medium text-gray-700 mb-1">Folder:</div>
                    <div className="font-mono text-xs text-gray-600">
                      shy/posts/
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Tip:</strong> Check your browser console for detailed upload logs. 
              Successful uploads will show the full response from Cloudinary.
            </p>
          </div>
        </div>

        {/* Raw Config (for debugging) */}
        <details className="bg-white rounded-lg shadow p-6">
          <summary className="text-lg font-semibold text-gray-900 cursor-pointer">
            🔧 Raw Configuration (Debug)
          </summary>
          <pre className="mt-4 p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto text-xs">
            {JSON.stringify(status, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}

