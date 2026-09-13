# yunus-ai

Yunus AI ialah aplikasi web AI ringan (frontend + backend) yang boleh terus dijalankan secara lokal.

## Ciri
- Chat AI
- Pembantu penulisan
- Perumus dokumen (teks / fail `.txt`)
- Penjana idea
- Penjana prompt imej
- Speech synthesis (suara browser)
- Tetapan identiti app (disimpan dalam `localStorage`)

## Keperluan
- Node.js 18+

## Setup
1. Pasang dependency:
   ```bash
   npm install
   ```
2. (Opsyenal) Konfigurasi AI key:
   ```bash
   cp .env.example .env
   ```
   Isi `GEMINI_API_KEY` dan/atau `OPENAI_API_KEY` dalam `.env`.

## Jalan aplikasi
```bash
npm start
```

Buka browser di `http://localhost:3000`.

## API
- `GET /api/status` → status provider/model/config
- `POST /api/chat` dengan body `{ "message": "..." }`
- `POST /api/assist` dengan body:
  - `{ "type": "writing", "input": "..." }`
  - `{ "type": "summarize", "input": "..." }`
  - `{ "type": "ideas", "input": "..." }`
  - `{ "type": "imagePrompt", "input": "..." }`

## Fallback tanpa API key
Jika API key tidak diisi, aplikasi tetap boleh dibuka dan fungsi backend akan guna fallback response dengan mesej status yang jelas.
