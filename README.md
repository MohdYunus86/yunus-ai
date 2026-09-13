# Yunus AI Backend

Backend selamat untuk sambungan APK Android ke OpenAI tanpa bocorkan `OPENAI_API_KEY`.

## Features
- Express API
- JWT auth (`Bearer token`)
- Rate limiting
- Endpoint chat biasa + streaming (SSE)
- Health check

## Setup

1. Install dependencies:
```bash
npm install
```

2. Salin env:
```bash
cp .env.example .env
```

3. Isi nilai `.env`:
- `OPENAI_API_KEY`
- `JWT_SECRET`

4. Run:
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`.

## Endpoints

### GET /health
Semak status server.

### POST /auth/dev-token
Buat token development (disable auto dalam production).

Body contoh:
```json
{
  "sub": "user-1",
  "email": "user@example.com"
}
```

### POST /chat
Protected (Bearer token).

Body minimum:
```json
{ "message": "Hai Yunus AI" }
```

### POST /chat/stream
Protected (Bearer token), SSE streaming.

Body minimum:
```json
{ "message": "Terangkan AI" }
```

## Docker
Build & run:
```bash
docker compose up --build
```
