# Yunus AI Pro

Versi ini sudah dinaik taraf berbanding APK offline pertama.

## Apa yang berubah

- Backend boleh guna model AI sebenar melalui API OpenAI-compatible.
- APK ada tetapan ⚙ untuk sambung ke backend Pro.
- Jika backend/API key tiada, APK guna offline fallback sahaja.
- Permintaan seperti “Buat gambar” tidak lagi dijawab sebagai karangan biasa; fallback akan hasilkan prompt imej.

## Jalankan backend offline

```bash
cd /home/user/yunus-ai
npm start
```

## Jalankan backend dengan AI sebenar

```bash
cd /home/user/yunus-ai
OPENAI_API_KEY="sk-..." OPENAI_MODEL="gpt-4o-mini" npm start
```

Atau untuk provider OpenAI-compatible lain:

```bash
LLM_BASE_URL="https://api-provider-anda.com/v1" \
LLM_API_KEY="key-anda" \
LLM_MODEL="nama-model" \
npm start
```

## Sambung APK ke backend

1. Deploy backend ke server HTTPS.
2. Buka APK Yunus AI Pro.
3. Tekan ⚙.
4. Masukkan URL backend, contoh:

```text
https://api.yunus-ai.com
```

5. Simpan.

Selepas itu APK akan hantar chat ke backend AI sebenar.

## Fail APK

```text
/home/user/yunus-ai/yunus-ai.apk
```
