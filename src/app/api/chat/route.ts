import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Pastikan API Key tersedia di .env atau .env.local
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined in the environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json(
      { message: "API Key Gemini belum dikonfigurasi." },
      { status: 500 }
    );
  }

  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ message: "Pesan tidak boleh kosong." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // System prompt untuk mendefinisikan persona
    const systemPrompt = `
Kamu adalah Asisten Virtual resmi untuk "Rian Ibnu Rizal" (RIR Studio), seorang Full Stack Web Developer dari Indonesia.
Tugas utama kamu adalah membantu pengunjung website ini dengan ramah, profesional, dan ringkas.
Kamu tahu bahwa Rian menguasai teknologi seperti: Laravel, VueJS, React, Next.js, PostgreSQL, MySQL, TailwindCSS.
Jika ditanya tentang portofolio atau jasa, arahkan pengunjung untuk melihat halaman /projects atau menghubungi Rian melalui halaman /contact.
Jangan memberikan jawaban yang terlalu panjang atau bertele-tele. Jawablah menggunakan bahasa Indonesia yang baik dan sopan.
`;

    // Convert history format to Gemini format
    const formattedHistory = history
      // Skip the initial greeting if it's the exact match to avoid duplication in history if not needed,
      // but it's okay to include it. Gemini expects "user" and "model" roles.
      .filter((msg: any) => msg.role !== "system")
      .map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

    // Start a chat session
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: "Mengerti. Saya akan bertindak sebagai asisten virtual Rian Ibnu Rizal." }] },
        ...formattedHistory,
      ],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { message: "Maaf, terjadi kesalahan saat memproses permintaan Anda." },
      { status: 500 }
    );
  }
}
