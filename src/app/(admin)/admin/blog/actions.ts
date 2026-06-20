"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const thumbnail = formData.get("thumbnail") as string;
  const tagsRaw = formData.get("tags") as string;
  const published = formData.get("published") === "on";

  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  await prisma.post.create({
    data: {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      thumbnail: thumbnail || null,
      tags,
      published,
      publishedAt: published ? new Date() : new Date(),
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
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
