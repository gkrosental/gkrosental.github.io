const PROXY = 'https://corsproxy.io/?';
const API_BASE = 'http://www.ibovfinancials.com';

export async function renderMercado() {
    renderQuotes();
    renderNews();
    setupStockSearch();
}

async function renderQuotes() {
    const quotesList = document.getElementById('quotes-list');
    quotesList.innerHTML = 'Carregando...';
    const symbols = ['IBOV', 'PETR4', 'VALE3', 'AZUL4', 'ITUB4'];
    const token = 'a814ccf4aa08298232f4cd24d5b5019df966d40c';
    try {
        const results = await Promise.all(symbols.map(async symbol => {
            const url = `${API_BASE}/api/ibov/quotes/?symbol=${symbol}&token=${token}`;
            const resp = await fetch(PROXY + encodeURIComponent(url));
            if (!resp.ok) return null;
            const data = await resp.json();
            const d = data.data && data.data[symbol];
            return d
                ? {
                    symbol,
                    last: d.last,
                    price_change: d.price_change,
                    volume: d.volume,
                    bid: d.bid,
                    ask: d.ask
                }
                : null;
        }));
        quotesList.innerHTML = results.filter(Boolean).map(q => `
            <div class="flex flex-col rounded-xl p-4 border border-white/20 shadow-lg glassy-quote-card hover:scale-[1.02] transition"
                 style="background: rgba(255,255,255,0.12); backdrop-filter: blur(12px); box-shadow: 0 4px 32px 0 rgba(0,0,0,0.18);">
                <div class="flex justify-between items-center mb-1">
                    <span class="font-bold text-lg tracking-wider drop-shadow">${q.symbol}</span>
                    <span class="text-sm ${q.price_change >= 0 ? 'text-green-300' : 'text-red-300'} font-semibold drop-shadow">
                        ${(q.price_change * 100).toFixed(2)}%
                    </span>
                </div>
                <div class="text-2xl font-mono mb-1 drop-shadow">R$ ${q.last !== undefined ? q.last : '-'}</div>
                <div class="flex gap-4 text-xs mb-2">
                    <span>Bid: <b>R$ ${q.bid}</b></span>
                    <span>Ask: <b>R$ ${q.ask}</b></span>
                    <span>Vol: <b>${q.volume}</b></span>
                </div>
                <div class="w-full h-2 bg-white/20 rounded">
                    <div style="width:${Math.min(100, q.volume / 10000 * 100)}%" class="h-2 rounded bg-gradient-to-r from-green-400 to-blue-500"></div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        quotesList.innerHTML = 'Erro ao carregar cotações.';
    }
}

async function renderNews() {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = '';
    // Exemplo estático, troque por API real se desejar
    const news = [
        { title: 'Ibovespa fecha em alta com commodities', url: '#' },
        { title: 'Dólar recua após dados de inflação', url: '#' },
        { title: 'Petrobras anuncia novo plano de investimentos', url: '#' },
        { title: 'Mercado espera corte de juros', url: '#' },
        { title: 'Ações de bancos sobem após balanço', url: '#' }
    ];
    news.forEach(n =>
        newsList.innerHTML += `<li><a href="${n.url}" target="_blank" class="text-blue-200 underline hover:text-blue-400 transition">${n.title}</a></li>`
    );
}

function getLastNDates(n) {
    const dates = [];
    let d = new Date();
    while (dates.length < n) {
        if (d.getDay() !== 0 && d.getDay() !== 6) {
            dates.unshift(d.toISOString().slice(0, 10));
        }
        d.setDate(d.getDate() - 1);
    }
    return dates;
}

function getMockDescription(symbol) {
    // Mock para demonstração, troque por API real se desejar
    const descs = {
        PETR4: "Petrobras é uma das maiores empresas de energia do mundo, atuando principalmente na exploração, produção e distribuição de petróleo e gás natural.",
        VALE3: "Vale é uma das maiores mineradoras globais, líder na produção de minério de ferro e níquel.",
        ITUB4: "Itaú Unibanco é o maior banco privado do Brasil, referência em serviços financeiros.",
        AZUL4: "Azul Linhas Aéreas é uma das principais companhias aéreas do Brasil, com forte presença regional.",
        IBOV: "Ibovespa é o principal índice da bolsa brasileira, refletindo o desempenho das ações mais negociadas."
    };
    return descs[symbol] || "Empresa listada na B3. Consulte o site oficial para mais informações.";
}

function getMockAnalysis(symbol, preco, variacao) {
    // Mock para demonstração, troque por análise real se desejar
    if (preco === null || variacao === null) return "";
    let tendencia = variacao > 0 ? "alta" : variacao < 0 ? "baixa" : "estável";
    let cor = variacao > 0 ? "text-green-400" : variacao < 0 ? "text-red-400" : "text-gray-300";
    return `
        <div class="font-semibold ${cor} mb-1">Tendência: ${tendencia.toUpperCase()}</div>
        <div>
            O ativo <b>${symbol}</b> apresenta variação de <b>${(variacao * 100).toFixed(2)}%</b> no dia.<br>
            ${variacao > 0
                ? "O movimento de alta pode indicar otimismo do mercado ou divulgação de resultados positivos."
                : variacao < 0
                    ? "A queda pode estar relacionada a fatores macroeconômicos ou notícias negativas."
                    : "O ativo apresenta estabilidade no pregão atual."}
        </div>
    `;
}

function setupStockSearch() {
    const form = document.getElementById('stock-search-form');
    const info = document.getElementById('stock-info');
    const chartEl = document.getElementById('stock-history-chart');
    const descEl = document.getElementById('stock-description');
    const analysisEl = document.getElementById('stock-analysis');
    if (!form) return;
    form.onsubmit = async (e) => {
        e.preventDefault();
        const symbol = document.getElementById('stock-symbol').value.trim().toUpperCase();
        // Barra de progresso animada com gradiente
        info.innerHTML = `
            <div class="flex items-center gap-2">
                <span>Buscando...</span>
                <span class="w-32 h-2 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 animate-progress-bar">
                    <span class="block h-2 w-full bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 animate-progress-bar-inner"></span>
                </span>
            </div>
            <style>
                @keyframes progress-bar-move {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-progress-bar {
                    position: relative;
                    background: linear-gradient(90deg, #e0e7ff 0%, #a5b4fc 100%);
                    overflow: hidden;
                }
                .animate-progress-bar-inner {
                    position: absolute;
                    left: 0; top: 0;
                    width: 50%; height: 100%;
                    background: linear-gradient(90deg, #38bdf8, #a78bfa, #4ade80);
                    animation: progress-bar-move 1.2s linear infinite;
                }
            </style>
        `;
        descEl.innerHTML = '';
        analysisEl.innerHTML = '';
        chartEl.style.display = 'none';
        const token = 'a814ccf4aa08298232f4cd24d5b5019df966d40c';
        try {
            // Cotação atual
            const quoteResp = await fetch(PROXY + encodeURIComponent(`${API_BASE}/api/ibov/quotes/?symbol=${symbol}&token=${token}`));
            if (!quoteResp.ok) {
                info.innerHTML = `Erro HTTP: ${quoteResp.status}`;
                return;
            }
            const quoteData = await quoteResp.json();
            const d = quoteData.data && quoteData.data[symbol];
            const preco = d?.last ?? null;
            const variacao = d?.price_change ?? null;
            if (preco === null) {
                info.innerHTML = 'Cotação não encontrada para este símbolo.<br><pre>' + JSON.stringify(quoteData, null, 2) + '</pre>';
                return;
            }
            info.innerHTML = `
                <div class="flex items-center gap-3 mb-1">
                    <span class="font-bold text-lg">${symbol}</span>
                    <span class="text-sm ${variacao >= 0 ? 'text-green-300' : 'text-red-300'} font-semibold">
                        ${(variacao * 100).toFixed(2)}%
                    </span>
                </div>
                <div class="text-2xl font-mono mb-1">R$ ${preco}</div>
                <div class="flex gap-4 text-xs mb-2">
                    <span>Bid: <b>R$ ${d.bid}</b></span>
                    <span>Ask: <b>R$ ${d.ask}</b></span>
                    <span>Vol: <b>${d.volume}</b></span>
                </div>
            `;
            descEl.innerHTML = getMockDescription(symbol);
            analysisEl.innerHTML = getMockAnalysis(symbol, preco, variacao);

            // Histórico dos últimos 5 dias úteis
            const dates = getLastNDates(5);
            const start_date = dates[0];
            const end_date = dates[dates.length - 1];
            const timeframe = "1440";
            const histUrl = `${API_BASE}/api/ibov/historical/?symbol=${symbol}&timeframe=${timeframe}&start_date=${start_date}&end_date=${end_date}`;
            const histResp = await fetch(PROXY + encodeURIComponent(histUrl));
            if (!histResp.ok) {
                chartEl.style.display = 'none';
                return;
            }
            const histData = await histResp.json();
            if (Array.isArray(histData) && histData.length > 1) {
                chartEl.style.display = '';
                renderStockChart(chartEl, histData.map(d => d.close ?? d.last));
            } else {
                chartEl.style.display = 'none';
            }
        } catch (err) {
            info.innerHTML = 'Não foi possível obter a cotação.<br><pre>' + err + '</pre>';
            chartEl.style.display = 'none';
        }
    };
}

function renderStockChart(canvas, data) {
    if (!window.Chart) return;
    if (canvas._chart) canvas._chart.destroy();
    canvas._chart = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: data.map((_, i) => `-${data.length - 1 - i}d`).concat('Hoje').slice(-data.length),
            datasets: [{
                label: 'Preço',
                data,
                borderColor: '#a78bfa',
                backgroundColor: 'rgba(167,139,250,0.15)',
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: '#fff'
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: '#fff' } },
                y: { ticks: { color: '#fff' } }
            }
        }
    });
}
