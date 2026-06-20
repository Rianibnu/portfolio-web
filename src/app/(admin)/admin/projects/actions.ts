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

export async function createProject(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  let finalCoverImage = formData.get("coverImage") as string;
  const coverImageFile = formData.get("coverImageFile") as File | null;
  const githubUrl = formData.get("githubUrl") as string;
  const demoUrl = formData.get("demoUrl") as string;
  const featured = formData.get("featured") === "on";
  
  if (coverImageFile && coverImageFile.size > 0) {
    finalCoverImage = await uploadFile(coverImageFile);
  } else if (!finalCoverImage && demoUrl) {
    // Auto-generate screenshot from demo URL using Microlink
    finalCoverImage = `https://api.microlink.io/?url=${encodeURIComponent(demoUrl)}&screenshot=true&meta=false&embed=screenshot.url`;
  }
  
  // Parse comma separated tech stack
  const techStackString = formData.get("techStack") as string;
  const techStack = techStackString
    ? techStackString.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  // Very basic validation
  if (!title || !slug || !description) {
    throw new Error("Missing required fields");
  }

  // Create in DB
  await prisma.project.create({
    data: {
      title,
      slug,
      description,
      content,
      coverImage: finalCoverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop", // fallback image
      techStack,
      githubUrl,
      demoUrl,
      featured,
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  
  redirect("/admin/projects");
}

export async function deleteProject(id: string) {
  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function updateProject(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  let finalCoverImage = formData.get("coverImage") as string;
  const coverImageFile = formData.get("coverImageFile") as File | null;
  const githubUrl = formData.get("githubUrl") as string;
  const demoUrl = formData.get("demoUrl") as string;
  const featured = formData.get("featured") === "on";

  if (coverImageFile && coverImageFile.size > 0) {
    finalCoverImage = await uploadFile(coverImageFile);
  } else if (!finalCoverImage && demoUrl) {
    // Auto-generate screenshot from demo URL using Microlink
    finalCoverImage = `https://api.microlink.io/?url=${encodeURIComponent(demoUrl)}&screenshot=true&meta=false&embed=screenshot.url`;
  }
  
  // Parse comma separated tech stack
  const techStackString = formData.get("techStack") as string;
  const techStack = techStackString
    ? techStackString.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  if (!title || !slug || !description) {
    throw new Error("Missing required fields");
  }

  await prisma.project.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      content,
      coverImage: finalCoverImage,
      techStack,
      githubUrl,
      demoUrl,
      featured,
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  
  redirect("/admin/projects");
}
