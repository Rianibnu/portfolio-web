"use server";

import { prisma } from "@/lib/prisma";

export async function submitContactForm(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, error: "All fields are required" };
  }

  try {
    await prisma.contact.create({
      data: {
        name,
        email,
        message,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Contact form error:", error);
    return { success: false, error: "Failed to send message" };
  }
}
