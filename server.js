const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

function getConfig() {
  const provider = (process.env.AI_PROVIDER || 'auto').toLowerCase();
  const geminiApiKey = process.env.GEMINI_API_KEY || '';
  const openaiApiKey = process.env.OPENAI_API_KEY || '';
  const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const available = {
    gemini: Boolean(geminiApiKey),
    openai: Boolean(openaiApiKey)
  };

  let activeProvider = provider;
  if (provider === 'auto') {
    if (available.gemini) activeProvider = 'gemini';
    else if (available.openai) activeProvider = 'openai';
    else activeProvider = 'fallback';
  }

  if (activeProvider === 'gemini' && !available.gemini) activeProvider = 'fallback';
  if (activeProvider === 'openai' && !available.openai) activeProvider = 'fallback';

  const model = activeProvider === 'gemini'
    ? geminiModel
    : activeProvider === 'openai'
      ? openaiModel
      : 'local-fallback';

  return {
    provider,
    activeProvider,
    model,
    configured: activeProvider !== 'fallback',
    available
  };
}

function fallbackText(type, input) {
  if (type === 'summarize') {
    const cleaned = (input || '').trim();
    if (!cleaned) return 'Tiada teks untuk diringkaskan.';
    return `Ringkasan fallback: ${cleaned.slice(0, 280)}${cleaned.length > 280 ? '...' : ''}`;
  }

  if (type === 'ideas') {
    const topic = (input || 'projek anda').trim();
    return [
      `1) Versi mini ${topic} untuk validasi pantas`,
      `2) Kempen komuniti sekitar ${topic}`,
      `3) Ciri premium berfokus hasil untuk ${topic}`
    ].join('\n');
  }

  if (type === 'imagePrompt') {
    const concept = (input || 'konsep kreatif').trim();
    return `Prompt fallback: "${concept}", gaya sinematik, pencahayaan lembut, ultra detail, komposisi seimbang, 4k.`;
  }

  if (type === 'writing') {
    return `Draf bantuan fallback:\n\n${(input || '').trim() || 'Tulis topik anda di sini.'}\n\nCadangan: tambah tujuan, audiens, dan tindakan seterusnya.`;
  }

  return `Mod fallback aktif. Anda hantar: ${(input || '').toString().slice(0, 300)}`;
}

async function callGemini(prompt, model, apiKey) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    })
  });

  const data = await response.json();
  if (!response.ok) {
    const message = data?.error?.message || 'Gemini request failed';
    throw new Error(message);
  }

  return data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n').trim() || '';
}

async function callOpenAI(prompt, model, apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: 'Anda pembantu AI berbahasa Melayu yang ringkas dan jelas.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();
  if (!response.ok) {
    const message = data?.error?.message || 'OpenAI request failed';
    throw new Error(message);
  }

  return data?.choices?.[0]?.message?.content?.trim() || '';
}

async function generateResponse(type, input, extra = {}) {
  const config = getConfig();

  const prompt = [
    'Jawab dalam Bahasa Melayu yang jelas.',
    `Jenis tugas: ${type}`,
    `Input utama: ${input || ''}`,
    extra && Object.keys(extra).length ? `Konteks tambahan: ${JSON.stringify(extra)}` : ''
  ].filter(Boolean).join('\n\n');

  if (config.activeProvider === 'fallback') {
    return {
      text: fallbackText(type, input),
      provider: 'fallback',
      model: config.model,
      fallback: true
    };
  }

  try {
    let text = '';
    if (config.activeProvider === 'gemini') {
      text = await callGemini(prompt, config.model, process.env.GEMINI_API_KEY);
    } else if (config.activeProvider === 'openai') {
      text = await callOpenAI(prompt, config.model, process.env.OPENAI_API_KEY);
    }

    if (!text) {
      text = fallbackText(type, input);
      return { text, provider: 'fallback', model: 'local-fallback', fallback: true };
    }

    return {
      text,
      provider: config.activeProvider,
      model: config.model,
      fallback: false
    };
  } catch (error) {
    return {
      text: `${fallbackText(type, input)}\n\n[Makluman] API gagal: ${error.message}`,
      provider: 'fallback',
      model: 'local-fallback',
      fallback: true
    };
  }
}

app.get('/api/status', (req, res) => {
  const config = getConfig();
  res.json({
    ok: true,
    provider: config.activeProvider,
    model: config.model,
    configured: config.configured,
    availableProviders: config.available,
    message: config.configured
      ? `AI aktif menggunakan ${config.activeProvider} (${config.model}).`
      : 'Tiada API key. Mod fallback aktif, app masih boleh digunakan.'
  });
});

app.post('/api/chat', async (req, res) => {
  const message = (req.body?.message || '').toString().trim();
  const history = Array.isArray(req.body?.history) ? req.body.history : [];

  if (!message) {
    return res.status(400).json({ ok: false, error: 'Mesej diperlukan.' });
  }

  const response = await generateResponse('chat', message, { history: history.slice(-6) });
  return res.json({ ok: true, reply: response.text, meta: response });
});

app.post('/api/assist', async (req, res) => {
  const type = (req.body?.type || 'writing').toString();
  const input = (req.body?.input || '').toString();
  const extra = req.body?.extra && typeof req.body.extra === 'object' ? req.body.extra : {};

  const allowed = new Set(['writing', 'summarize', 'ideas', 'imagePrompt']);
  if (!allowed.has(type)) {
    return res.status(400).json({ ok: false, error: 'Jenis assist tidak disokong.' });
  }

  const response = await generateResponse(type, input, extra);
  return res.json({ ok: true, result: response.text, meta: response });
});

app.listen(PORT, () => {
  console.log(`Yunus AI berjalan di http://localhost:${PORT}`);
});
