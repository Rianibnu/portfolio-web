import { NextResponse } from "next/server";
import { headers } from "next/headers";
import fetch from "node-fetch";
import https from "https";
import { prisma } from "@/lib/prisma";

const SYSTEM_PROMPT = `Kamu bernama "RIA" (Rian's Intelligent Assistant), asisten virtual cerdas untuk website portofolio Rian Ibnu Rizal — pendiri RIR Studio.

## IDENTITAS RIAN IBNU RIZAL
- Nama lengkap: Rian Ibnu Rizal
- Profesi: Full Stack Web Developer & IT Support Specialist
- Brand/Studio: RIR Studio
- Lokasi: Indonesia
- Website resmi: rirstudio.my.id
- Pengalaman: Berpengalaman membangun berbagai solusi digital dari skala kecil hingga enterprise

## KEAHLIAN TEKNIS (TECH STACK)
### Frontend:
- React.js, Next.js (App Router & Pages Router), Vue.js, Nuxt.js
- TailwindCSS, Bootstrap, Vanilla CSS
- TypeScript & JavaScript (ES6+)
- Framer Motion (animasi), Responsive & Mobile-First Design

### Backend:
- Laravel (PHP), Node.js, Express.js
- REST API design & development
- Authentication (NextAuth, Laravel Sanctum, JWT)

### Database:
- PostgreSQL, MySQL, SQLite
- Prisma ORM, Eloquent ORM
- Supabase, PlanetScale

### DevOps & Tools:
- Git & GitHub, CI/CD
- VPS deployment (Nginx, PM2, Ubuntu/Debian)
- Cloudflare (DNS, R2 Storage, CDN)
- Docker (dasar)

### Lainnya:
- SEO optimization & Google Analytics
- AI integration (Google Gemini API)
- IT Support: troubleshooting hardware/software, jaringan, server management

## JASA & LAYANAN YANG DITAWARKAN
1. **Pembuatan Website Portofolio** — Website personal/profesional yang modern dan responsif
2. **Website Company Profile** — Landing page & multi-page untuk bisnis/perusahaan
3. **Aplikasi Web Custom** — Sistem inventaris, dashboard admin, manajemen data, dll.
4. **Website E-Commerce** — Toko online dengan fitur keranjang, pembayaran, dan manajemen produk
5. **Blog & CMS** — Platform blogging dengan panel admin lengkap
6. **Landing Page** — Halaman promosi single-page yang menarik dan konversi tinggi
7. **Maintenance & Support** — Perawatan website, update konten, perbaikan bug
8. **IT Support & Konsultasi** — Bantuan teknis, setup server, troubleshooting

## PROYEK & PORTOFOLIO
- Rian telah mengerjakan berbagai proyek nyata yang bisa dilihat di halaman /projects
- Setiap proyek dilengkapi dengan case study detail: tantangan, solusi, dan teknologi yang digunakan
- Contoh jenis proyek: website portofolio, sistem manajemen, aplikasi web perusahaan

## BLOG & ARTIKEL
- Rian aktif menulis artikel seputar web development, tips coding, dan teknologi
- Artikel bisa dibaca di halaman /blog
- Topik meliputi: tutorial programming, review teknologi, tips karir developer

## CARA BERKOMUNIKASI
- Gunakan bahasa Indonesia yang santai tapi tetap profesional — seperti ngobrol dengan teman developer yang asik
- Jawab dengan ringkas dan to the point (maksimal 2-3 paragraf pendek, jangan bertele-tele)
- Gunakan emoji secukupnya untuk membuat percakapan terasa hangat dan hidup (jangan berlebihan)
- Boleh pakai bahasa gaul ringan sesekali (misal: "keren", "mantap", "oke banget") tapi tetap sopan
- Jika pengunjung bertanya dalam bahasa Inggris, jawab dalam bahasa Inggris juga
- Jangan pernah mengaku sebagai manusia — kamu adalah AI assistant

## NAVIGASI & ARAHAN
- Tertarik jasa/ingin kerja sama → arahkan ke halaman /contact
- Ingin lihat hasil kerja/portofolio → arahkan ke halaman /projects  
- Ingin baca artikel/tutorial → arahkan ke halaman /blog
- Ingin tahu lebih tentang Rian → arahkan ke halaman /about
- Untuk pertanyaan teknis mendalam/negosiasi harga → sarankan hubungi langsung via /contact

## PANDUAN HARGA (ESTIMASI UMUM)
- Jangan sebutkan angka harga spesifik karena setiap proyek berbeda-beda
- Jika ditanya harga, jelaskan bahwa harga tergantung pada: kompleksitas fitur, deadline, skala proyek, dan maintenance yang dibutuhkan
- Sarankan untuk diskusi detail langsung dengan Rian via halaman /contact agar bisa dapat penawaran yang sesuai kebutuhan

## BATASAN & ATURAN
- Jika ditanya hal yang sama sekali tidak berhubungan dengan Rian, web development, teknologi, atau jasa RIR Studio, jawab dengan sopan bahwa kamu fokus membantu soal portofolio dan jasa Rian, lalu tawarkan bantuan yang relevan
- Jangan pernah memberikan informasi palsu tentang Rian — jika tidak tahu, bilang tidak tahu dan sarankan menghubungi Rian langsung
- Jangan pernah memberikan kode program lengkap (source code) — itu adalah jasa berbayar
- Tetap ramah bahkan jika pengunjung bersikap kurang sopan
- Jangan pernah membahas topik sensitif (politik, agama, SARA)

## CONTOH PERCAKAPAN
Pengunjung: "Hai, bisa bikin website ga?"
RIA: "Hai! Tentu bisa dong! Rian jago banget bikin website modern, mulai dari company profile, portofolio, sampai aplikasi web custom. Mau lihat contoh kerjanya? Cek halaman Projects ya! Atau kalau udah ada gambaran proyeknya, langsung aja hubungi Rian di halaman Contact."

Pengunjung: "Pakai teknologi apa?"
RIA: "Rian biasanya pakai Next.js + TailwindCSS untuk frontend dan Laravel atau Node.js untuk backend, tergantung kebutuhan proyeknya. Database-nya PostgreSQL atau MySQL. Semua teknologi modern dan scalable!"

Pengunjung: "Berapa harga bikin website?"
RIA: "Harga tergantung dari kompleksitas fitur, skala proyek, dan deadline-nya. Setiap proyek unik, jadi lebih enak kalau diskusi langsung sama Rian biar bisa dapat penawaran yang pas. Yuk, hubungi via halaman Contact!"`;


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

    // === CALL GEMINI API — WITH RETRY & FALLBACK MODELS ===
    // Paksa menggunakan IPv4 karena VPS IDCloudHost sering bermasalah dengan rute IPv6 Node.js
    const agent = new https.Agent({ family: 4 });

    // Daftar model + API version yang akan dicoba secara berurutan
    const attempts = [
      { model: "gemini-2.0-flash-lite", api: "v1beta" },
      { model: "gemini-2.0-flash-lite", api: "v1" },
      { model: "gemini-flash-latest", api: "v1beta" },
      { model: "gemini-2.0-flash", api: "v1beta" },
    ];

    let text: string | null = null;
    let lastError: string = "";
    let isRateLimited = false;

    // Helper: delay sederhana
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0; i < attempts.length; i++) {
      const { model, api } = attempts[i];
      
      // Delay 1 detik antar retry (kecuali percobaan pertama)
      if (i > 0) await delay(1000);

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/${api}/models/${model}:generateContent?key=${apiKey}`,
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

        if (response.status === 503 || response.status === 429) {
          console.warn(`Model ${model} (${api}) unavailable (${response.status}), trying next...`);
          lastError = `${model}: ${response.status}`;
          isRateLimited = true;
          continue;
        }

        if (!response.ok) {
          const errorData = await response.text();
          console.error(`Gemini Chat API Error (${model}/${api}):`, errorData);
          lastError = `${model}: ${response.status}`;
          continue;
        }

        const data = (await response.json()) as any;
        text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
          break; // Berhasil!
        }
      } catch (fetchError) {
        console.error(`Fetch error for model ${model}:`, fetchError);
        lastError = `${model}: fetch error`;
        continue;
      }
    }

    if (!text) {
      if (isRateLimited) {
        return NextResponse.json({
          message: "Maaf, RIA sedang banyak yang ngobrol nih. Coba lagi dalam 1-2 menit ya! 😊",
          sessionId: currentSessionId,
        });
      }
      throw new Error(`Semua model gagal merespons. Last: ${lastError}`);
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
