import { NextResponse } from "next/server";
import fetch from "node-fetch";
import https from "https";

export async function POST(request: Request) {
  try {
    const { prompt, type, context = "project" } = await request.json();

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
    
    if (context === "project") {
      // ── Prompt untuk Project ──
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
    } else if (context === "blog") {
      // ── Prompt untuk Blog ──
      if (type === "short_description") {
        systemPrompt = `Anda adalah asisten penulis blog profesional.
Tugas Anda adalah membersihkan dan merapikan excerpt (ringkasan singkat) artikel blog.
Aturan:
- Perbaiki semua kesalahan ketik (typo) dan tata bahasa.
- Hapus semua karakter aneh, simbol yang tidak beraturan, dan garbage text.
- Buat ringkasan yang menarik dan membuat pembaca ingin membaca artikel lengkapnya.
- Gunakan bahasa Indonesia yang profesional, informatif, dan engaging.
- JANGAN gunakan format Markdown (seperti ** atau ##), buat menjadi teks biasa (plain text) yang rapi.
- Maksimal 2-3 kalimat saja.
- Langsung berikan hasilnya tanpa kalimat pengantar.`;
      } else if (type === "full_content") {
        systemPrompt = `Anda adalah asisten penulis artikel blog profesional.
Tugas Anda adalah membersihkan tulisan mentah dan merapikannya menjadi artikel blog yang terstruktur dan menarik.
Aturan:
- Perbaiki semua kesalahan ketik (typo), rapikan tata bahasa, spasi, dan huruf kapital.
- Strukturkan artikel dengan heading Markdown (## untuk sub-judul utama, ### untuk sub-sub-judul).
- Rapihkan daftar atau penomoran yang berantakan menjadi list Markdown yang benar.
- Hapus semua karakter aneh, coretan, kode aneh, atau teks yang tidak relevan.
- Gunakan format Markdown untuk styling (Bold, Italic, Bullet points, Code blocks) secara proporsional dan rapi.
- Jika ada kode pemrograman, gunakan code block Markdown dengan syntax highlighting yang tepat (misal: \`\`\`javascript).
- Buat tulisan mengalir natural layaknya artikel blog: pembuka yang menarik, isi yang informatif, dan penutup yang berkesan.
- Gunakan bahasa Indonesia profesional, modern, dan mudah dipahami.
- Langsung berikan hasilnya tanpa kalimat pengantar atau penutup dari AI.
- Jangan gunakan blockquote berlebihan kecuali untuk quote sungguhan.`;
      }
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      return NextResponse.json(
        { error: "API Key Groq belum diatur di server." },
        { status: 500 }
      );
    }

    // Paksa menggunakan IPv4 karena VPS IDCloudHost sering bermasalah dengan rute IPv6 Node.js
    const agent = new https.Agent({ family: 4 });

    const fullPrompt = `${systemPrompt}\n\nInput dari pengguna:\n${prompt}`;

    // Gunakan Groq API (OpenAI Compatible)
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
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_completion_tokens: 1500,
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

    return NextResponse.json({ result: text });
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan saat menghubungi AI" },
      { status: 500 }
    );
  }
}
