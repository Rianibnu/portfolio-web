import { NextResponse } from "next/server";
import fetch from "node-fetch";
import https from "https";

export async function POST(request: Request) {
  try {
    const { idea } = await request.json();

    if (!idea) {
      return NextResponse.json(
        { error: "Ide atau prompt diperlukan" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === "isi_dengan_api_key_gemini_kamu") {
      return NextResponse.json(
        { error: "API Key Gemini belum diatur. Silakan cek file .env" },
        { status: 500 }
      );
    }

    const systemPrompt = `Anda adalah asisten AI cerdas untuk platform blog.
Tugas Anda adalah membuat artikel blog yang lengkap (Judul, Slug, Excerpt, Content, dan Tags) berdasarkan SATU ide atau topik pendek dari pengguna.

Aturan output:
- Jawab HANYA dengan format JSON yang valid. Jangan gunakan blok kode markdown di luar JSON.
- Gunakan bahasa Indonesia profesional dan modern.
- \`title\`: Judul artikel menarik (string).
- \`slug\`: URL slug yang bersih dan SEO friendly, contoh "judul-artikel-menarik" (string).
- \`category\`: Kategori umum artikel, contoh "Web Development", "Data Analyst", "Tutorial", "Lifestyle" (string).
- \`excerpt\`: Ringkasan pendek (2-3 kalimat) yang menggugah selera pembaca (string).
- \`content\`: Isi artikel lengkap yang terstruktur dengan format Markdown (menggunakan ##, ###, list, bold, italic). (string)
- \`tags\`: Tag artikel yang relevan (array of strings, contoh: ["Tutorial", "Next.js"]).

Pastikan response bisa di-parse oleh JSON.parse().`;

    // Paksa menggunakan IPv4
    const agent = new https.Agent({ family: 4 });

    const fullPrompt = `${systemPrompt}\n\nIde Topik:\n${idea}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          }
        }),
        agent: agent,
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Google API Error: ${response.status} ${response.statusText} - ${errorData}`);
    }

    const data = await response.json() as any;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Gagal mengekstrak teks dari respons Gemini");
    }

    let resultJson;
    try {
      resultJson = JSON.parse(text);
    } catch (e) {
      throw new Error("AI tidak mengembalikan format JSON yang valid.");
    }

    return NextResponse.json({ result: resultJson });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat menghubungi AI" },
      { status: 500 }
    );
  }
}
