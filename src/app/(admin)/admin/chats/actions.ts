"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function markChatAsRead(id: string) {
  await prisma.chatSession.update({
    where: { id },
    data: { read: true },
  });
  revalidatePath("/admin/chats");
}

export async function markChatAsUnread(id: string) {
  await prisma.chatSession.update({
    where: { id },
    data: { read: false },
  });
  revalidatePath("/admin/chats");
}

export async function deleteChatSession(id: string) {
  await prisma.chatSession.delete({
    where: { id },
  });
  revalidatePath("/admin/chats");
}
