import { supabaseAdmin } from "@/lib/supabase";

const BUCKET_NAME = "portfolio-uploads";

/**
 * Upload a file to Supabase Storage and return its public URL.
 * Used by both Project and Blog admin actions.
 */
export async function uploadFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename to avoid collisions
  const ext = file.name.split(".").pop() || "jpg";
  const safeName = file.name
    .replace(/\.[^/.]+$/, "") // remove extension
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .substring(0, 50);
  const filename = `${Date.now()}-${safeName}.${ext}`;
  const storagePath = `uploads/${filename}`;

  const { error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(storagePath, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (error) {
    console.error("Supabase Storage upload error:", error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  // Get the public URL
  const { data } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  return data.publicUrl;
}
