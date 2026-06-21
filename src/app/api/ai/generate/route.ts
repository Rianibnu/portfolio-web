import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let systemPrompt = "Anda adalah asisten penulis profesional.";
    
    if (type === "short_description") {
      systemPrompt = `Anda adalah asisten pembuat portofolio.
Tugas Anda adalah membersihkan dan merapikan deskripsi singkat proyek.
Aturan:
- Perbaiki kesalahan ketik (typo), rapikan spasi, dan tanda baca.
- Hapus semua karakter aneh, simbol yang tidak relevan, atau teks acak (garbage text).
- Maksimal 2-3 kalimat yang menarik dan profesional.
- Gunakan bahasa Indonesia yang baik dan baku namun modern.
- Jangan gunakan formatting Markdown seperti ** atau *.
- Langsung berikan hasilnya, tanpa kalimat pengantar.
`;
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
- Jangan gunakan blockquote berlebihan kecuali untuk quote sungguhan.
`;
    }

    const fullPrompt = `${systemPrompt}\n\nInput dari pengguna:\n${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const text = result.response.text();

    return NextResponse.json({ result: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat menghubungi AI" },
      { status: 500 }
    );
  }
}
