"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markAsRead(id: string) {
  await prisma.contact.update({
    where: { id },
    data: { read: true },
  });
  revalidatePath("/admin/messages");
}

export async function markAsUnread(id: string) {
  await prisma.contact.update({
    where: { id },
    data: { read: false },
  });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await prisma.contact.delete({
    where: { id },
  });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
