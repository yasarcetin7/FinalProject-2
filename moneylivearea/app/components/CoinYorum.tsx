"use client";

import { useEffect, useState } from "react";

type CoinFiyat = {
  symbol: string;
  price: string;
};

const fieldClass =
  "w-full rounded-lg border border-line bg-ink px-3 py-3 font-[inherit] text-white outline-none transition-[border-color] duration-300 focus:border-brand-edge";

export default function CoinYorum() {
  const [sorgu, setSorgu] = useState("");
  const [coinler, setCoinler] = useState<CoinFiyat[]>([]);
  const [listeHazir, setListeHazir] = useState(false);
  const [acik, setAcik] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [secilen, setSecilen] = useState("");
  const [yorum, setYorum] = useState("");
  const [hata, setHata] = useState("");

  useEffect(() => {
    let iptal = false;

    fetch("https://api.binance.com/api/v3/ticker/price")
      .then((yanit) => yanit.json())
      .then((veri: unknown) => {
        if (iptal || !Array.isArray(veri)) return;
        const usdt = veri.filter((coin): coin is CoinFiyat => {
          if (!coin || typeof coin !== "object") return false;
          const kayit = coin as { symbol?: unknown; price?: unknown };
          return typeof kayit.symbol === "string" && kayit.symbol.endsWith("USDT") && typeof kayit.price === "string";
        });
        setCoinler(usdt);
      })
      .catch(() => {
        if (!iptal) setHata("Coin listesi alınamadı.");
      })
      .finally(() => {
        if (!iptal) setListeHazir(true);
      });

    return () => {
      iptal = true;
    };
  }, []);

  const kelime = sorgu.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const sonuclar = kelime.length < 2 ? [] : coinler.filter((coin) => coin.symbol.includes(kelime)).slice(0, 8);

  async function sec(symbol: string) {
    setSecilen(symbol);
    setSorgu(symbol.replace("USDT", ""));
    setAcik(false);
    setYukleniyor(true);
    setHata("");
    setYorum("");

    try {
      const yanit = await fetch("/api/coin-yorum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol }),
      });
      const veri = (await yanit.json()) as { yorum?: string; hata?: string; fiyat?: string; degisim?: string };
      if (!yanit.ok || !veri.yorum) {
        setHata(veri.hata ?? "Yorum alınamadı.");
        return;
      }
      const fiyatNotu = veri.fiyat && veri.fiyat !== "yok" ? `\n\nSon fiyat: ${veri.fiyat} USDT (${veri.degisim ?? "0"}%)` : "";
      setYorum(`${veri.yorum}${fiyatNotu}`);
    } catch {
      setHata("Yorum servisine ulaşılamadı.");
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div>
      <h2 className="mt-0 border-b-2 border-line pb-2.5 text-[1.3rem] text-white">Yapay Zeka Yorumu</h2>
      <p className="mb-4 text-sm text-muted">Bir coin ara ve seç. Gemini, o çiftin son 24 saatlik verisine göre kısa bir not yazar.</p>
      <div className="relative mb-4">
        <input
          className={fieldClass}
          type="text"
          value={sorgu}
          placeholder="Coin ara, örneğin BTC"
          autoComplete="off"
          aria-label="Yorum için coin ara"
          aria-expanded={acik && sonuclar.length > 0}
          onChange={(olay) => {
            setSorgu(olay.target.value);
            setAcik(true);
          }}
          onFocus={() => setAcik(true)}
        />
        {acik && kelime.length >= 2 ? (
          <div className="absolute top-full left-0 z-[100] mt-1 max-h-[220px] w-full overflow-y-auto rounded-lg border border-line bg-dropdown shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
            {sonuclar.length === 0 ? (
              <p className="m-0 px-3 py-3 text-sm text-muted">{listeHazir ? "Eşleşen USDT çifti yok." : "Liste yükleniyor..."}</p>
            ) : (
              sonuclar.map((coin) => (
                <button
                  key={coin.symbol}
                  type="button"
                  className="flex w-full cursor-pointer items-center justify-between border-0 border-b border-line bg-transparent px-3 py-3 text-left font-[inherit] text-white hover:bg-dropdown-hover"
                  onMouseDown={(olay) => olay.preventDefault()}
                  onClick={() => void sec(coin.symbol)}
                >
                  <span className="font-bold text-brand">{coin.symbol.replace("USDT", " / USDT")}</span>
                  <span className="text-[0.85rem] text-muted">{coin.price}</span>
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>
      {yukleniyor ? <p className="m-0 text-sm text-muted">{secilen} için yorum hazırlanıyor...</p> : null}
      {hata ? <p className="m-0 text-sm text-down">{hata}</p> : null}
      {yorum ? (
        <p className="m-0 rounded-lg border border-dashed border-white bg-ink p-[15px] text-sm leading-relaxed whitespace-pre-wrap text-white">
          {yorum}
        </p>
      ) : null}
      <p className="mt-3 mb-0 text-xs text-muted">Bu not yatırım tavsiyesi değildir.</p>
    </div>
  );
}
