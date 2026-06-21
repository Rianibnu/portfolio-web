"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

async function uploadFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const uploadDir = join(process.cwd(), "public/uploads");
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (e) {
    // ignore
  }

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filepath = join(uploadDir, filename);
  await writeFile(filepath, buffer);
  
  return `/uploads/${filename}`;
}

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const category = formData.get("category") as string || "General";
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  let finalThumbnail = formData.get("thumbnail") as string;
  const thumbnailFile = formData.get("thumbnailFile") as File | null;
  const tagsRaw = formData.get("tags") as string;
  const published = formData.get("published") === "on";

  if (thumbnailFile && thumbnailFile.size > 0) {
    finalThumbnail = await uploadFile(thumbnailFile);
  }

  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  // Validation
  if (!title || !slug || !content) {
    throw new Error("Missing required fields");
  }

  await prisma.post.create({
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      category,
      thumbnail: finalThumbnail || null,
      tags,
      published,
      publishedAt: published ? new Date() : new Date(),
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin/blog");
}

export async function updatePost(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const category = formData.get("category") as string || "General";
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  let finalThumbnail = formData.get("thumbnail") as string;
  const thumbnailFile = formData.get("thumbnailFile") as File | null;
  const tagsRaw = formData.get("tags") as string;
  const published = formData.get("published") === "on";

  if (thumbnailFile && thumbnailFile.size > 0) {
    finalThumbnail = await uploadFile(thumbnailFile);
  }

  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  if (!title || !slug || !content) {
    throw new Error("Missing required fields");
  }

  await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      category,
      thumbnail: finalThumbnail || null,
      tags,
      published,
      publishedAt: published ? new Date() : undefined,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin/blog");
}

export async function deletePost(id: string) {
  await prisma.post.delete({
    where: { id },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/admin");
  revalidatePath("/blog");
}

export async function togglePublishPost(id: string, published: boolean) {
  await prisma.post.update({
    where: { id },
    data: {
      published,
      publishedAt: published ? new Date() : undefined,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
