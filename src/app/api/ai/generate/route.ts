import { NextResponse } from "next/server";
import fetch from "node-fetch";
import https from "https";

export async function POST(request: Request) {
  try {
    const { prompt, type } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
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

    let systemPrompt = "Anda adalah asisten penulis profesional.";
    
    if (type === "short_description") {
      systemPrompt = `Anda adalah asisten pembuat portofolio.
Tugas Anda adalah membersihkan dan merapikan deskripsi singkat proyek.
Aturan:
- Perbaiki semua kesalahan ketik (typo).
- Hapus semua karakter aneh, simbol (seperti * atau # yang tidak beraturan), dan garbage text.
- Gunakan bahasa Indonesia yang profesional dan menarik.
- JANGAN gunakan format Markdown (seperti ** atau ##), buat menjadi teks biasa (plain text) yang rapi.
- Langsung berikan hasilnya tanpa kalimat pengantar.`;
    } else if (type === "full_content") {
      systemPrompt = `Anda adalah asisten penulis Case Study portofolio profesional.
Tugas Anda adalah membersihkan tulisan mentah dan merapikannya menjadi format Case Study yang terstruktur.
Aturan:
- Perbaiki semua kesalahan ketik (typo), rapikan tata bahasa, spasi, dan huruf kapital.
- Rapihkan daftar atau penomoran (numbering) yang berantakan menjadi list Markdown yang benar (1. 2. 3. atau - bullet points).
- Hapus semua karakter aneh, coretan, kode aneh, atau teks yang tidak relevan.
- Gunakan format Markdown untuk styling (Bold, Italic, Bullet points) secara proporsional dan rapi.
- Jika tulisan cukup panjang, strukturkan menjadi bagian-bagian (misal: Tantangan, Solusi, dan Hasil).
- Gunakan bahasa Indonesia profesional dan modern.
- Langsung berikan hasilnya tanpa kalimat pengantar atau penutup.
- Jangan gunakan blockquote berlebihan kecuali untuk quote sungguhan.`;
    }

    // Paksa menggunakan IPv4 karena VPS IDCloudHost sering bermasalah dengan rute IPv6 Node.js
    const agent = new https.Agent({ family: 4 });

    const fullPrompt = `${systemPrompt}\n\nInput dari pengguna:\n${prompt}`;

    // Gunakan raw REST API call dengan node-fetch untuk mem-bypass SDK
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
      console.error("Gemini API Error Response:", errorData);
      throw new Error(`Google API Error: ${response.status} ${response.statusText} - ${errorData}`);
    }

    const data = await response.json() as any;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Gagal mengekstrak teks dari respons Gemini");
    }

    return NextResponse.json({ result: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat menghubungi AI" },
      { status: 500 }
    );
  }
}
