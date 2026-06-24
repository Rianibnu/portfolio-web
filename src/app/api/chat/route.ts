import { NextResponse } from "next/server";
import { headers } from "next/headers";
import fetch from "node-fetch";
import https from "https";
import { prisma } from "@/lib/prisma";

const SYSTEM_PROMPT = `Kamu bernama "RIA" (Rian's Intelligent Assistant), asisten virtual untuk website portofolio Rian Ibnu Rizal (RIR Studio).

## Tentang Rian Ibnu Rizal:
- Full Stack Web Developer & IT Support dari Indonesia
- Menguasai: Laravel, VueJS, React, Next.js, PostgreSQL, MySQL, TailwindCSS, TypeScript
- Memiliki pengalaman membangun berbagai solusi digital mulai dari website portofolio, sistem inventaris, hingga aplikasi web kompleks
- Website: rirstudio.my.id

## Cara Berkomunikasi:
- Gunakan bahasa Indonesia yang santai tapi tetap profesional, seperti teman kerja yang ramah
- Jawab dengan ringkas dan to the point (maksimal 2-3 paragraf pendek)
- Gunakan emoji sesekali untuk membuat percakapan terasa hangat 😊
- Jangan terlalu formal atau kaku, tapi tetap sopan
- Jika ditanya hal di luar konteks Rian/web development, jawab dengan sopan bahwa kamu fokus membantu soal portofolio dan jasa Rian
- Jika pengunjung tertarik dengan jasa Rian, arahkan ke halaman /contact
- Jika pengunjung ingin melihat hasil kerja, arahkan ke halaman /projects
- Jika pengunjung ingin membaca artikel, arahkan ke halaman /blog

## Contoh Gaya Jawaban:
- "Hai! 👋 Rian itu jago banget di Laravel dan Next.js. Kalau kamu butuh website modern, bisa langsung hubungi dia di halaman Contact ya!"
- "Wah, pertanyaan bagus! 🚀 Untuk proyek seperti itu, biasanya Rian pakai kombinasi Next.js + PostgreSQL. Mau lihat contoh kerjanya? Cek halaman Projects!"`;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  try {
    const { message, history, sessionId } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { message: "Pesan tidak boleh kosong." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === "isi_dengan_api_key_gemini_kamu") {
      return NextResponse.json(
        { message: "API Key Gemini belum dikonfigurasi." },
        { status: 500 }
      );
    }

    // Get visitor info for the session
    const headersList = await headers();
    const visitorIp =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";

    // Find or create session
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const session = await prisma.chatSession.create({
        data: {
          visitorIp,
          userAgent,
        },
      });
      currentSessionId = session.id;
    } else {
      // Update the session timestamp
      await prisma.chatSession.update({
        where: { id: currentSessionId },
        data: { updatedAt: new Date() },
      }).catch(() => {
        // Session might not exist if DB was reset, create a new one
      });
    }

    // Save user message to DB
    await prisma.chatMessage.create({
      data: {
        sessionId: currentSessionId,
        role: "user",
        content: message,
      },
    }).catch(console.error);

    // Build conversation contents for Gemini
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [
      {
        role: "user",
        parts: [{ text: SYSTEM_PROMPT }],
      },
      {
        role: "model",
        parts: [{ text: "Siap! Saya RIA, asisten virtual Rian. Saya akan membantu pengunjung dengan ramah dan informatif. 😊" }],
      },
    ];

    // Append chat history
    if (history && Array.isArray(history)) {
      for (const msg of history as ChatMessage[]) {
        if (msg.role !== "user" && msg.role !== "assistant") continue;
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        });
      }
    }

    // Add the current user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    // Use raw REST API with node-fetch (IPv4) — same pattern as /api/ai/generate
    const agent = new https.Agent({ family: 4 });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: 400,
            temperature: 0.8,
            topP: 0.9,
          },
        }),
        agent,
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini Chat API Error Response:", errorData);
      throw new Error(`Google API Error: ${response.status} - ${errorData}`);
    }

    const data = (await response.json()) as any;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Gagal mengekstrak teks dari respons Gemini");
    }

    // Save assistant response to DB
    await prisma.chatMessage.create({
      data: {
        sessionId: currentSessionId,
        role: "assistant",
        content: text,
      },
    }).catch(console.error);

    return NextResponse.json({ message: text, sessionId: currentSessionId });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { message: "Waduh, ada gangguan teknis nih 😅 Coba lagi dalam beberapa saat ya!" },
      { status: 500 }
    );
  }
}
