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

    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      return NextResponse.json(
        { error: "API Key Groq belum diatur. Silakan cek file .env" },
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

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Ide Topik:\n${idea}` }
          ],
          temperature: 0.7,
          max_completion_tokens: 1500,
          response_format: { type: "json_object" }
        }),
        agent: agent,
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API Error Response:", errorData);
      throw new Error(`Groq API Error: ${response.status} - ${errorData}`);
    }

    const data = await response.json() as any;
    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("Gagal mengekstrak teks dari respons Groq");
    }

    let resultJson;
    try {
      resultJson = JSON.parse(text);
    } catch (e) {
      throw new Error("AI tidak mengembalikan format JSON yang valid.");
    }

    return NextResponse.json({ result: resultJson });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat menghubungi AI" },
      { status: 500 }
    );
  }
}
