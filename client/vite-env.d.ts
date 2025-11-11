/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLOUDINARY_CLOUD_NAME?: string;
  readonly VITE_CLOUDINARY_UNSIGNED_PRESET?: string;
  readonly NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?: string;
  readonly NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET?: string;
  readonly NEXT_PUBLIC_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
