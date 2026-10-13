"use client";
import { Button } from "./components/ui/button";
import { useEffect, useState } from "react";
import CoinYorum from "./components/CoinYorum";
import Header from "./components/header";
import emblem from "../money amblem.png";

type GrafikModulu = {
  grafigiAc: (symbol: string, coinAdi: string, interval?: string) => void;
  grafigiKapat: () => void;
  araligiSec: (interval: string) => void;
};

const araliklar = [
  { id: "15m", etiket: "15 dk" },
  { id: "1h", etiket: "1 sa" },
  { id: "4h", etiket: "4 sa" },
  { id: "1d", etiket: "1 gün" },
] as const;

const coinler = [
  { symbol: "BTCUSDT", ad: "Bitcoin (BTC / USDT)", etiket: "Bitcoin (BTC/USDT)", fiyatId: "price-btc", durumId: "status-btc", baslangic: "Yükleniyor...", durum: "Canlı Bağlantı Bekleniyor" },
  { symbol: "AVAXUSDT", ad: "Avalanche (AVAX / USDT)", etiket: "Avalanche (AVAX/USDT)", fiyatId: "price-avax", durumId: "status-avax", baslangic: "Yükleniyor...", durum: "Canlı Bağlantı Bekleniyor" },
  { symbol: "ETHUSDT", ad: "Ethereum (ETH / USDT)", etiket: "Ethereum (ETH/USDT)", fiyatId: "price-eth", durumId: "status-eth", baslangic: "Yükleniyor...", durum: "Canlı bağlantı Bekleniyor.." },
  { symbol: "DOGEUSDT", ad: "Doge (DOGE / USDT)", etiket: "Doge (DOGE/USDT)", fiyatId: "price-doge", durumId: "status-doge", baslangic: "Yükleniyor...", durum: "Canlı bağlantı Bekleniyor.." },
  { symbol: "XRPUSDT", ad: "Ripple (XRP / USDT)", etiket: "Ripple (XRP/USDT)", fiyatId: "price-ripple", durumId: "status-ripple", baslangic: "Veri Bekleniyor", durum: "Canlı bağlantı Bekleniyor" },
  { symbol: "ADAUSDT", ad: "Cardano (ADA / USDT)", etiket: "Cardano (ADA/USDT)", fiyatId: "price-ada", durumId: "status-ada", baslangic: "Yükleniyor...", durum: "Canlı bağlantı Bekleniyor.." },
  { symbol: "DOTUSDT", ad: "Polkadot (DOT / USDT)", etiket: "Polkadot (DOT/USDT)", fiyatId: "price-dot", durumId: "status-dot", baslangic: "Yükleniyor...", durum: "Canlı bağlantı Bekleniyor.." },
  { symbol: "SOLUSDT", ad: "Solana (SOL / USDT)", etiket: "Solana (SOL/USDT)", fiyatId: "price-sol", durumId: "status-sol", baslangic: "Yükleniyor...", durum: "Canlı bağlantı Bekleniyor.." },
] as const;

const cardClass =
  "w-full cursor-pointer rounded-xl border border-line bg-panel p-5 text-center font-[inherit] text-inherit shadow-[0_4px_6px_rgba(0,0,0,0.3)] transition-transform duration-200 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0";
const symbolClass = "mb-2.5 text-[clamp(16px,1vw_+_12.8px,19.2px)] font-bold text-muted wrap-anywhere";
const priceClass = "my-2.5 text-[clamp(21.6px,2vw_+_12.8px,32px)] font-bold text-white wrap-anywhere";
const statusClass = "text-[13.6px] text-up";
const widgetClass = "rounded-xl border border-line bg-panel p-5 shadow-[0_4px_6px_rgba(0,0,0,0.3)]";
const noteClass = "m-0 rounded-lg border border-dashed border-white bg-ink p-[15px] text-sm leading-relaxed text-white max-[480px]:p-2.5 max-[480px]:text-[13.6px]";

function grafikModulu() {
  return import("./script.js") as Promise<GrafikModulu>;
}

export default function HomePage() {
  const [aralik, setAralik] = useState<(typeof araliklar)[number]["id"]>("4h");

  useEffect(() => {
    void grafikModulu();
  }, []);

  function coinAc(symbol: string, ad: string) {
    setAralik("4h");
    void grafikModulu().then((mod) => mod.grafigiAc(symbol, ad));
  }

  function aralikSec(interval: (typeof araliklar)[number]["id"]) {
    setAralik(interval);
    void grafikModulu().then((mod) => mod.araligiSec(interval));
  }

  return (
    <div>
      <Header />

      <div className="mb-[30px] text-center">
        <p className="m-0 px-2 text-sm text-muted">
          Canlı kripto para fiyatlarını takip edin ve favori coinlerinizi panoya ekleyin!
        </p>
      </div>

      <h1 className="mb-5 px-2 pb-2 text-center text-xl text-white">
        İşlem hacmi en yüksek coinler
      </h1>

      <div className="dashboard mx-auto grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-3">
        {coinler.map((coin) => (
          <button type="button" className={cardClass} key={coin.symbol} onClick={() => coinAc(coin.symbol, coin.ad)}>
            <div className={symbolClass}>{coin.etiket}</div>
            <div className={priceClass} id={coin.fiyatId}>{coin.baslangic}</div>
            <div className={statusClass} id={coin.durumId}>{coin.durum}</div>
          </button>
        ))}
      </div>

      <div id="custom-section" className="hidden">
          <h2 className="mt-7 border-t border-line px-3 pt-6 text-center text-xl text-brand">
          ⭐ Senin Takip Ettiklerin
        </h2>
        <div className="dashboard mx-auto grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-3" id="custom-dashboard" />
      </div>

      <div className="mx-auto my-6 grid max-w-6xl grid-cols-[repeat(auto-fit,minmax(22rem,1fr))] gap-4">
        <div className={widgetClass}>
          <h2 className="mt-0 border-b-2 border-line pb-2.5 text-lg text-white">📺 Günün Analizi</h2>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              className="absolute inset-0 h-full w-full border-0"
              src="https://www.youtube.com/embed/QjvNKNM2RU0"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className={widgetClass}>
          <CoinYorum />
        </div>
      </div>

      <div
        id="chart-modal"
        className="fixed inset-0 z-50 hidden overflow-auto bg-black/85 p-3 pt-safe pb-safe backdrop-blur-sm"
      >
          <div className="relative mx-auto my-6 w-full max-w-2xl rounded-xl border border-line bg-panel p-6 shadow-xl shadow-black/80">
          <Button
            type="button"
            variant="ghost"
            size="none"
            aria-label="Kapat"
            onClick={() => void grafikModulu().then((mod) => mod.grafigiKapat())}
          >
            &times;
          </Button>
          <h2 id="modal-title" className="m-0 pe-10 text-[clamp(1.15rem,2vw+0.6rem,1.5rem)] text-gold">
            Grafik Yükleniyor...
          </h2>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Zaman aralığı">
            {araliklar.map((secenek) => (
              <Button
                type="button"
                key={secenek.id}
                variant="outline"
                data-interval={secenek.id}
                aria-pressed={aralik === secenek.id}
                className={aralik === secenek.id ? "is-active h-auto px-3" : "h-auto px-3"}
                onClick={() => aralikSec(secenek.id)}
              >
                {secenek.etiket}
              </Button>
            ))}
          </div>
          <div className="relative mt-3 overflow-hidden rounded-lg border border-line bg-ink">
            <div id="chart-container" className="h-[min(420px,55dvh)] min-h-[240px] w-full" />
            <p id="chart-status" className="absolute inset-0 grid place-items-center p-4 text-center text-text empty:hidden" />
          </div>
        </div>
      </div>

      <footer className="mt-10 border-t border-line bg-panel px-5 pt-10 pb-5 max-[480px]:px-2.5 max-[480px]:pt-[25px] max-[480px]:pb-2.5">
        <div className="mx-auto mb-5 grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,17rem),1fr))] gap-[clamp(16px,3vw,30px)] min-[800px]:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] max-[640px]:text-center">
          <div>
            <div className="mb-5 flex items-center gap-[15px] max-[640px]:justify-center">
              <img className="block size-10 rounded-full bg-brand object-cover max-[480px]:size-[35px]" src={emblem.src} alt="MoneyLiveArea Logo" />
              <h3 className="m-0 text-2xl text-white max-[480px]:text-[1.3rem]">MoneyLiveArea</h3>
            </div>
            <p className={noteClass}>
              Kripto para piyasasını eş zamanlı takip edin, analizleri okuyun ve kendi favori listenizi oluşturarak
              yatırımlarınızı kolayca yönetin.
            </p>
          </div>
          <div>
            <h2 className="relative mt-0 pb-2.5 text-white after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-[30px] after:rounded-sm after:bg-brand max-[640px]:after:left-1/2 max-[640px]:after:-translate-x-1/2">
              Yasal Uyarı
            </h2>
            <p className={noteClass}>
              Burada yer alan yatırım bilgi, yorum ve tavsiyeleri yatırım danışmanlığı kapsamında değildir. Kripto
              para birimleri yüksek volatilite içerir ve risk taşır.
            </p>
          </div>
        </div>
        <div className="border-t border-dashed border-white pt-5 text-center text-sm text-white">
          <p>&copy; 2024 MoneyLiveArea. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
