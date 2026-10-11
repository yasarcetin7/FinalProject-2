let fiyatHafizasi = {}; 
let istekSayaci = 1; 

const url = 'wss://stream.binance.com:9443/ws/btcusdt@trade/avaxusdt@trade/ethusdt@trade/dogeusdt@trade/xrpusdt@trade/adausdt@trade/dotusdt@trade/solusdt@trade';
const binanceSocket = new WebSocket(url);

binanceSocket.onopen = () => {
    ['btc', 'avax', 'eth', 'doge', 'ripple', 'ada', 'dot', 'sol'].forEach(coin => {
        const el = document.getElementById(`status-${coin}`);
        if(el) el.innerText = "🟢 Canlı";
    });
};

function aboneOl(symbol) {
    if (symbol === 'BTCUSDT') return; 
    const streamName = symbol.toLowerCase() + '@trade'; 
    if (binanceSocket.readyState === WebSocket.OPEN) {
        binanceSocket.send(JSON.stringify({ "method": "SUBSCRIBE", "params": [streamName], "id": istekSayaci++ }));
    }
}

binanceSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.e === 'trade') {
        const symbol = data.s; 
        const price = parseFloat(data.p); 
        let elementId = `price-${symbol}`; 
        
        if (symbol === 'BTCUSDT') elementId = 'price-btc';
        else if (symbol === 'AVAXUSDT') elementId = 'price-avax';
        else if (symbol === 'ETHUSDT') elementId = 'price-eth';
        else if (symbol === 'DOGEUSDT') elementId = 'price-doge';
        else if (symbol === 'XRPUSDT') elementId = 'price-ripple';
        else if (symbol === 'ADAUSDT') elementId = 'price-ada';
        else if (symbol === 'DOTUSDT') elementId = 'price-dot';
        else if (symbol === 'SOLUSDT') elementId = 'price-sol';
        
        updateCard(elementId, price, symbol);
    }
};

function updateCard(elementId, currentPrice, symbol) {
    const el = document.getElementById(elementId);
    if (!el) return; 
    let previousPrice = fiyatHafizasi[symbol] || 0;
    let gosterilecekFiyat = currentPrice < 1 ? currentPrice.toFixed(5) : currentPrice.toFixed(2);
    el.innerText = gosterilecekFiyat + " $";
    
    if (currentPrice > previousPrice && previousPrice !== 0) el.className = "price up";
    else if (currentPrice < previousPrice && previousPrice !== 0) el.className = "price down";
    
    fiyatHafizasi[symbol] = currentPrice; 
}

/*ARAMA ÇUBUĞU VE SONUÇLARI İÇİN KODLAR AŞAĞIDA DEVAM EDİYOR...*/
const searchInput = document.getElementById('crypto-search-input');
const searchResults = document.getElementById('crypto-search-results');
let bittunCoinler = []; 

async function coinListesiniGetir() {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price');
        const data = await response.json();
        bittunCoinler = data.filter(coin => coin.symbol.endsWith('USDT'));
    } catch (err) {}
}
coinListesiniGetir();

if(searchInput) {
    searchInput.addEventListener('input', function(e) {
        const kelime = e.target.value.toUpperCase().trim();
        if (kelime.length < 2) { searchResults.style.display = 'none'; return; }
        const bulunanlar = bittunCoinler.filter(coin => coin.symbol.includes(kelime)).slice(0, 10); 
        sonuclariGoster(bulunanlar);
    });
}

function sonuclariGoster(coinler) {
    searchResults.innerHTML = '';
    if (coinler.length === 0) { searchResults.style.display = 'none'; return; }
    coinler.forEach(coin => {
        const div = document.createElement('div');
        div.className = 'result-item';
        const temizSembol = coin.symbol.replace('USDT', ' / USDT');
        div.innerHTML = `<span class="result-symbol">${temizSembol}</span><span class="result-desc">Ekle +</span>`;
        div.onclick = () => panoyaEkle(coin.symbol, temizSembol);
        searchResults.appendChild(div);
    });
    searchResults.style.display = 'block';
}

document.addEventListener('click', function(event) {
    if (searchInput && searchResults && !searchInput.contains(event.target) && !searchResults.contains(event.target)) {
        searchResults.style.display = 'none';
    }
});

function panoyaEkle(symbol, temizSembol) {
    searchResults.style.display = 'none'; 
    searchInput.value = ''; 
    
    if (document.getElementById(`price-${symbol}`)) { 
        alert("Bu coin zaten panoda var!"); 
        return; 
    }
    
    const yeniKart = document.createElement('div');
    yeniKart.className = 'card';
    yeniKart.id = `card-${symbol}`; 
    yeniKart.onclick = () => grafigiAc(symbol, temizSembol); 
    yeniKart.innerHTML = `
        <div class="symbol-name">${temizSembol}</div>
        <div class="price" id="price-${symbol}">Yükleniyor...</div>
        <div class="status">🟢 Canlı (Senin Seçimin)</div>
    `;
    
    const gizliBolum = document.getElementById('custom-section');
    if(gizliBolum) {
        gizliBolum.style.display = 'block';
    }

    const ozelPano = document.getElementById('custom-dashboard');
    if(ozelPano) {
        ozelPano.insertBefore(yeniKart, ozelPano.firstChild); 
    } else {
        const anaPano = document.querySelector('.dashboard');
        anaPano.insertBefore(yeniKart, anaPano.firstChild);
    }
    
    fiyatHafizasi[symbol] = 0;
    aboneOl(symbol);
}

/*  MUM GRAFİĞİ: Binance herkese açık kline verisi, API anahtarı yok */
const grafikAraliklari = ['15m', '1h', '4h', '1d'];
let grafikNesnesi = null;
let grafikIstegi = 0;
let acikSembol = null;

function grafigiAc(symbol, coinAdi, interval = '4h') {
    acikSembol = symbol;
    const secilenAralik = grafikAraliklari.includes(interval) ? interval : '4h';
    const modal = document.getElementById('chart-modal');
    modal.style.display = 'block';
    document.getElementById('modal-title').innerText = `${coinAdi} Grafiği`;
    aralikButonlariniIsaretle(secilenAralik);
    mumGrafiginiYukle(symbol, secilenAralik);
}

function grafigiKapat() {
    grafikIstegi += 1;
    document.getElementById('chart-modal').style.display = 'none';
    grafigiTemizle();
}

function grafigiTemizle() {
    if (grafikNesnesi) {
        grafikNesnesi.remove();
        grafikNesnesi = null;
    }
    const konteyner = document.getElementById('chart-container');
    if (konteyner) konteyner.replaceChildren();
}

function aralikButonlariniIsaretle(interval) {
    document.querySelectorAll('.interval-btn').forEach((button) => {
        const secili = button.dataset.interval === interval;
        button.classList.toggle('is-active', secili);
        button.setAttribute('aria-pressed', secili ? 'true' : 'false');
    });
}

async function mumGrafiginiYukle(symbol, interval) {
    const istekNo = ++grafikIstegi;
    const durum = document.getElementById('chart-status');
    if (durum) durum.textContent = 'Mum verisi yükleniyor...';
    grafigiTemizle();

    try {
        const url = `https://data-api.binance.vision/api/v3/klines?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&limit=200`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Binance yanıtı alınamadı');
        const satirlar = await response.json();
        if (istekNo !== grafikIstegi) return;
        if (!Array.isArray(satirlar) || satirlar.length === 0) throw new Error('Mum verisi boş');

        const mumlar = satirlar.map((satir) => ({
            time: Math.floor(satir[0] / 1000),
            open: Number(satir[1]),
            high: Number(satir[2]),
            low: Number(satir[3]),
            close: Number(satir[4]),
        }));

        grafigiCiz(mumlar);
        if (istekNo !== grafikIstegi) return;
        if (durum) durum.textContent = '';
    } catch (error) {
        if (istekNo !== grafikIstegi) return;
        if (durum) durum.textContent = 'Mum verisi alınamadı. Bağlantını kontrol edip tekrar dene.';
    }
}

function grafigiCiz(mumlar) {
    const konteyner = document.getElementById('chart-container');
    const durum = document.getElementById('chart-status');
    if (!konteyner || typeof LightweightCharts === 'undefined') {
        if (durum) durum.textContent = 'Grafik kütüphanesi yüklenemedi.';
        return;
    }

    grafikNesnesi = LightweightCharts.createChart(konteyner, {
        autoSize: true,
        layout: {
            background: { color: '#0d1117' },
            textColor: '#c9d1d9',
        },
        grid: {
            vertLines: { color: '#21262d' },
            horzLines: { color: '#21262d' },
        },
        rightPriceScale: { borderColor: '#30363d' },
        timeScale: {
            borderColor: '#30363d',
            timeVisible: true,
            secondsVisible: false,
        },
    });

    const seri = grafikNesnesi.addSeries(LightweightCharts.CandlestickSeries, {
        upColor: '#3fb950',
        downColor: '#f85149',
        borderVisible: false,
        wickUpColor: '#3fb950',
        wickDownColor: '#f85149',
    });
    seri.setData(mumlar);
    grafikNesnesi.timeScale().fitContent();
}

document.querySelectorAll('.interval-btn').forEach((button) => {
    button.addEventListener('click', () => {
        if (!acikSembol) return;
        const interval = button.dataset.interval;
        aralikButonlariniIsaretle(interval);
        mumGrafiginiYukle(acikSembol, interval);
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') grafigiKapat();
});

window.onclick = function(event) {
    const modal = document.getElementById('chart-modal');
    if (event.target === modal) {
        grafigiKapat();
    }
}