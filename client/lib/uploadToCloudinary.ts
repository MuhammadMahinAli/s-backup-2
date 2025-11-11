import type { PostImage } from "@shared/api";

export async function uploadToCloudinary(file: File): Promise<PostImage> {
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME!;
  const preset = import.meta.env.VITE_CLOUDINARY_UNSIGNED_PRESET!;
  const url = `https://api.cloudinary.com/v1_1/${cloud}/image/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", preset);
  fd.append("folder", "shy/posts");

  const res = await fetch(url, { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message || "Cloudinary upload failed");
  return { url: json.secure_url as string, publicId: json.public_id as string };
}

