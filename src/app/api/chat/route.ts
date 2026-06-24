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
- Gunakan emoji sesekali untuk membuat percakapan terasa hangat
- Jangan terlalu formal atau kaku, tapi tetap sopan
- Jika ditanya hal di luar konteks Rian/web development, jawab dengan sopan bahwa kamu fokus membantu soal portofolio dan jasa Rian
- Jika pengunjung tertarik dengan jasa Rian, arahkan ke halaman /contact
- Jika pengunjung ingin melihat hasil kerja, arahkan ke halaman /projects
- Jika pengunjung ingin membaca artikel, arahkan ke halaman /blog`;

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

    // Find or create session (resilient - won't break chat if DB fails)
    let currentSessionId = sessionId;
    try {
      if (!currentSessionId) {
        const session = await prisma.chatSession.create({
          data: {
            visitorIp,
            userAgent,
          },
        });
        currentSessionId = session.id;
      } else {
        await prisma.chatSession.update({
          where: { id: currentSessionId },
          data: { updatedAt: new Date() },
        });
      }

      // Save user message to DB
      if (currentSessionId) {
        await prisma.chatMessage.create({
          data: {
            sessionId: currentSessionId,
            role: "user",
            content: message,
          },
        });
      }
    } catch (dbError) {
      console.error("Failed to save to database (Schema probably out of sync):", dbError);
    }

    // === BUILD PROMPT — SAME PATTERN AS /api/ai/generate ===
    // Gabungkan system prompt + history + pesan baru jadi satu teks,
    // persis seperti cara blog AI route bekerja.
    let fullPrompt = SYSTEM_PROMPT + "\n\n";

    // Tambahkan riwayat percakapan
    if (history && Array.isArray(history)) {
      fullPrompt += "Riwayat percakapan sebelumnya:\n";
      for (const msg of history as ChatMessage[]) {
        if (msg.role === "user") {
          fullPrompt += `Pengunjung: ${msg.content}\n`;
        } else if (msg.role === "assistant") {
          fullPrompt += `RIA: ${msg.content}\n`;
        }
      }
      fullPrompt += "\n";
    }

    fullPrompt += `Pengunjung: ${message}\nRIA:`;

    // === CALL GEMINI API — 100% IDENTICAL TO /api/ai/generate ===
    // Paksa menggunakan IPv4 karena VPS IDCloudHost sering bermasalah dengan rute IPv6 Node.js
    const agent = new https.Agent({ family: 4 });

    // Gunakan raw REST API call dengan node-fetch untuk mem-bypass SDK
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
        }),
        agent: agent,
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
    if (currentSessionId) {
      try {
        await prisma.chatMessage.create({
          data: {
            sessionId: currentSessionId,
            role: "assistant",
            content: text,
          },
        });
      } catch (dbError) {
        console.error("Failed to save assistant msg to database:", dbError);
      }
    }

    return NextResponse.json({ message: text, sessionId: currentSessionId });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { message: "Waduh, ada gangguan teknis nih. Coba lagi dalam beberapa saat ya!" },
      { status: 500 }
    );
  }
}
