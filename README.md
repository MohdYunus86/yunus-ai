# Yunus AI

AI Melayu sebenar dengan frontend dan backend runnable.

## Ciri

- Chat UI moden dalam Bahasa Melayu
- Backend Node.js tanpa dependency berat
- API `/api/chat`, `/api/health`, `/api/memory`
- Mode offline Malay AI rule-based, boleh jalan tanpa API key
- PWA installable di telefon
- Struktur projek disediakan untuk APK/Android wrapper

## Cara run

```bash
npm start
```

Buka:

```text
http://localhost:3000
```

## API

### Health

```bash
curl http://localhost:3000/api/health
```

### Chat

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Assalamualaikum, siapa awak?"}'
```

## APK

Environment ini belum ada Android SDK/Gradle, jadi fail APK sebenar tidak boleh dikompil terus di sini. Projek ini sudah PWA-ready dan boleh dibungkus menjadi APK menggunakan Android Studio, Capacitor, PWABuilder atau Bubblewrap.

Langkah paling mudah:

1. Deploy web app ini ke hosting HTTPS.
2. Buka https://www.pwabuilder.com/
3. Masukkan URL app.
4. Generate Android package/APK.

Untuk build native APK di mesin sendiri, install:

- Android Studio
- Android SDK
- Java 17+
- Gradle

Kemudian gunakan wrapper Android/PWA pilihan anda.
