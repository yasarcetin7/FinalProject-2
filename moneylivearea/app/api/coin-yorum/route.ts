const MODELLER = ["gemini-3.5-flash", "gemini-3.8-flash"] as const;

type BinanceOzet = {
  lastPrice: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  quoteVolume: string;
};

type GeminiParca = {
  text?: string;
  thought?: boolean;
};

type GeminiYanit = {
  candidates?: { content?: { parts?: GeminiParca[] } }[];
  error?: { message?: string; status?: string };
};

function sembolGecerli(deger: unknown): deger is string {
  return typeof deger === "string" && /^[A-Z0-9]{5,20}$/.test(deger) && deger.endsWith("USDT");
}

function sayiMetni(deger: unknown) {
  return typeof deger === "string" && /^-?[0-9]+(\.[0-9]+)?$/.test(deger) ? deger : "yok";
}

function ondalikMetin(deger: number | null) {
  if (deger === null || !Number.isFinite(deger)) return "yok";
  return deger.toFixed(2);
}

function emaHesapla(kapanislar: number[], periyot: number) {
  if (kapanislar.length < periyot) return null;
  const k = 2 / (periyot + 1);
  let ema = kapanislar.slice(0, periyot).reduce((toplam, fiyat) => toplam + fiyat, 0) / periyot;
  for (let indeks = periyot; indeks < kapanislar.length; indeks += 1) {
    const kapanis = kapanislar[indeks];
    if (kapanis === undefined) return null;
    ema = kapanis * k + ema * (1 - k);
  }
  return ema;
}

function aylikDegisimHesapla(kapanislar: number[]) {
  if (kapanislar.length < 31) return null;
  const onceki = kapanislar[kapanislar.length - 31];
  const son = kapanislar[kapanislar.length - 1];
  if (onceki === undefined || son === undefined || onceki <= 0) return null;
  return ((son - onceki) / onceki) * 100;
}

function teknikEgilim(sonFiyat: number, ema20: number | null, ema50: number | null) {
  if (ema20 === null || ema50 === null || !Number.isFinite(sonFiyat)) return "yok";
  if (sonFiyat > ema20 && sonFiyat > ema50) return "pozitif";
  if (sonFiyat < ema20 && sonFiyat < ema50) return "negatif";
  return "nötr";
}

function yorumMetni(yanit: GeminiYanit) {
  const parcalar = yanit.candidates?.[0]?.content?.parts ?? [];
  return parcalar
    .filter((parca) => parca.thought !== true && typeof parca.text === "string")
    .map((parca) => parca.text?.trim() ?? "")
    .filter((metin) => metin.length > 0)
    .join("\n")
    .trim();
}

async function geminiCagir(anahtar: string, istem: string, model: (typeof MODELLER)[number], dusunmeKapali: boolean) {
  const govde: {
    contents: { parts: { text: string }[] }[];
    generationConfig: {
      maxOutputTokens: number;
      temperature: number;
      thinkingConfig?: { thinkingBudget: number };
    };
  } = {
    contents: [{ parts: [{ text: istem }] }],
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.4,
    },
  };

  if (dusunmeKapali) {
    govde.generationConfig.thinkingConfig = { thinkingBudget: 0 };
  }

  const yanit = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": anahtar,
      },
      body: JSON.stringify(govde),
      cache: "no-store",
    },
  );

  const veri = (await yanit.json()) as GeminiYanit;
  return { yanit, veri };
}

export async function POST(request: Request) {
  let govde: unknown;
  try {
    govde = await request.json();
  } catch {
    return Response.json({ hata: "İstek okunamadı." }, { status: 400 });
  }

  const sembol = govde && typeof govde === "object" && "symbol" in govde ? govde.symbol : undefined;
  if (!sembolGecerli(sembol)) {
    return Response.json({ hata: "Geçerli bir USDT çifti seç." }, { status: 400 });
  }

  const anahtar = process.env.GEMINI_API_KEY;
  if (!anahtar) {
    return Response.json(
      { hata: "Gemini anahtarı yok. moneylivearea/.env dosyasına GEMINI_API_KEY ekleyip sunucuyu yeniden başlat." },
      { status: 503 },
    );
  }

  const piyasaYaniti = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${sembol}`, {
    cache: "no-store",
  });
  if (!piyasaYaniti.ok) {
    return Response.json({ hata: "Bu çiftin piyasa verisi alınamadı." }, { status: 502 });
  }

  const piyasa = (await piyasaYaniti.json()) as Partial<BinanceOzet>;
  const mumYaniti = await fetch(
    `https://api.binance.com/api/v3/klines?symbol=${sembol}&interval=1d&limit=80`,
    { cache: "no-store" },
  );
  const mumlar = mumYaniti.ok ? ((await mumYaniti.json()) as unknown[]) : [];
  const kapanislar = mumlar
    .map((mum) => (Array.isArray(mum) ? Number(mum[4]) : Number.NaN))
    .filter((fiyat) => Number.isFinite(fiyat) && fiyat > 0);
  const ema20 = emaHesapla(kapanislar, 20);
  const ema50 = emaHesapla(kapanislar, 50);
  const sonFiyat = Number(piyasa.lastPrice);
  const aylikDegisim = aylikDegisimHesapla(kapanislar);
  const egilim = teknikEgilim(sonFiyat, ema20, ema50);

  const istem = [
    "Bir kripto para piyasa analisti gibi bir not yaz. Kesinlikle yatırım tavsiyesi verme, 'al' veya 'sat' deme.",
    "Türkçe yaz, 4 ile 6 cümle arası olsun.",
    `Çift: ${sembol}`,
    `Son fiyat (USDT): ${sayiMetni(piyasa.lastPrice)}`,
    `24 saatlik değişim (%): ${sayiMetni(piyasa.priceChangePercent)}`,
    `Son 1 aylık değişim (%): ${ondalikMetin(aylikDegisim)}`,
    `Günlük EMA (20): ${ondalikMetin(ema20)}`,
    `Günlük EMA (50): ${ondalikMetin(ema50)}`,
    `Teknik eğilim: ${egilim}`,
    "",
    "YORUMLAMA KURALLARI:",
    "1. Teknik eğilim 'pozitif' ise fiyatın EMA(20) ve EMA(50) üzerinde olduğunu ve teknik olarak pozitif eğilim taşıdığını belirt.",
    "2. Teknik eğilim 'negatif' ise fiyatın her iki ortalamanın altında olduğunu ve teknik olarak negatif eğilim taşıdığını belirt.",
    "3. Teknik eğilim 'nötr' ise fiyatın ortalamalardan birinin üstünde, diğerinin altında olduğunu ve eğilimin nötr kaldığını belirt.",
    "4. Teknik eğilim 'yok' ise ortalama verisinin yetersiz olduğunu söyle.",
    "5. Son 1 aylık değişime bakarak kısa vadeli performansı kısaca değerlendir.",
    "6. Sadece sağlanan bu verilere dayan. Gelecek tahmini yapma ve objektif bir dil kullan.",
  ].join("\n");

  let yanit = new Response(null, { status: 503 });
  let veri: GeminiYanit = {};
  for (const model of MODELLER) {
    ({ yanit, veri } = await geminiCagir(anahtar, istem, model, true));
    if (!yanit.ok && /thinking/i.test(veri.error?.message ?? "")) {
      ({ yanit, veri } = await geminiCagir(anahtar, istem, model, false));
    }
    if (yanit.ok || yanit.status === 400 || yanit.status === 401 || yanit.status === 403) break;
  }

  if (yanit.status === 429) {
    return Response.json({ hata: "Gemini ücretsiz kotası doldu. Biraz sonra tekrar dene." }, { status: 429 });
  }

  if (yanit.status === 503) {
    return Response.json({ hata: "Gemini modeli şu an yoğun. Biraz sonra tekrar dene." }, { status: 503 });
  }

  if (yanit.status === 400 || yanit.status === 401 || yanit.status === 403) {
    return Response.json({ hata: "Gemini anahtarı veya modeli reddedildi." }, { status: 502 });
  }

  if (!yanit.ok) {
    return Response.json({ hata: "Gemini yanıt vermedi. Biraz sonra tekrar dene." }, { status: 502 });
  }

  const yorum = yorumMetni(veri);
  if (!yorum) {
    return Response.json({ hata: "Gemini boş bir yanıt döndürdü." }, { status: 502 });
  }

  return Response.json({
    yorum,
    sembol,
    fiyat: sayiMetni(piyasa.lastPrice),
    degisim: sayiMetni(piyasa.priceChangePercent),
  });
}
