// mercado.js - Lida com a seção de mercado financeiro, cotações, notícias e busca de ações
// Proxy para contornar CORS em requisições HTTP externas
const PROXY = 'https://corsproxy.io/?';
// URL base da API de dados financeiros (exemplo)
const API_BASE = 'http://www.ibovfinancials.com';

// Objetos de cache para evitar requisições repetidas
const quoteCache = {};   // Armazena cotações por símbolo
const histCache = {};    // Armazena históricos por símbolo

// Função principal que inicializa a seção Mercado
// Chama funções para renderizar cotações, notícias e busca de ações
export async function renderMercado() {
    renderQuotes(); // Renderiza as cotações principais
    renderNews();   // Renderiza as notícias
    setupStockSearch(); // Configura o formulário de busca de ações
    // Exibe instruções no card de detalhes antes de qualquer busca
    const info = document.getElementById('stock-info');
    const chartEl = document.getElementById('stock-history-chart');
    const descEl = document.getElementById('stock-description');
    const analysisEl = document.getElementById('stock-analysis');
    if (info && chartEl && descEl && analysisEl) {
        info.innerHTML = `
            <div class="text-lg text-center text-white/90 py-6">
                Digite o código de uma ação no campo ao lado para ver cotação, histórico, descrição e análise.<br>
                Ou clique em uma das ações em destaque para ver detalhes.
            </div>
        `;
        chartEl.style.display = 'none';
        descEl.innerHTML = '';
        analysisEl.innerHTML = '';
    }
}

// Busca e exibe as cotações dos principais ativos em destaque
async function renderQuotes() {
    const quotesList = document.getElementById('quotes-list');
    quotesList.innerHTML = 'Carregando...';
    const symbols = ['IBOV', 'PETR4', 'VALE3', 'AZUL4', 'ITUB4'];
    // const token = 'a814ccf4aa08298232f4cd24d5b5019df966d40c';
    try {
        // Usa apenas cache/mocks para evitar requisições durante desenvolvimento
        const results = symbols.map(symbol => {
            const d = getCachedOrMockQuote(symbol);
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
        });
        // Monta o HTML das cotações filtrando apenas resultados válidos
        quotesList.innerHTML = results.filter(Boolean).map(q => `
            <div class="flex flex-col rounded-xl p-4 border border-white/20 shadow-lg glassy-quote-card hover:scale-[1.02] transition quote-card"
                 style="background: rgba(255,255,255,0.12); backdrop-filter: blur(12px); box-shadow: 0 4px 32px 0 rgba(0,0,0,0.18); cursor:pointer"
                 data-symbol="${q.symbol}">
                <div class="flex justify-between items-center mb-1">
                    <span class="font-bold text-lg tracking-wider drop-shadow">${q.symbol}</span>
                    <span class="text-sm ${q.price_change >= 0 ? 'text-green-300' : 'text-red-300'} font-semibold drop-shadow">
                        ${q.price_change.toFixed(2)}%
                    </span>
                </div>
                <div class="text-2xl font-mono mb-1 drop-shadow">R$ ${q.last !== undefined ? q.last : '-'}</div>
                <div class="flex gap-4 text-xs mb-2">
                    <span>Bid: <b>R$ ${q.bid}</b></span>
                    <span>Ask: <b>R$ ${q.ask}</b></span>
                    <span>Vol: <b>${q.volume}</b></span>
                </div>
                <div class="w-full h-2 bg-white/20 rounded">
                    <div style="width:${Math.min(100, q.volume / 10000 * 100)}%; 
                        height:100%; 
                        border-radius:0.25rem;
                        background: ${
                            q.price_change >= 0
                                ? 'linear-gradient(to right, #4ade80, #22d3ee)' // verde-azul para alta
                                : 'linear-gradient(to right, #f87171, #f43f5e)' // vermelho para baixa
                        };">
                    </div>
                </div>
            </div>
        `).join('');

        // --- Adiciona evento de clique nos cards de destaque ---
        // Ao clicar, exibe os dados completos no card à direita, sem nova requisição
        document.querySelectorAll('.quote-card').forEach(card => {
            card.addEventListener('click', () => {
                const symbol = card.getAttribute('data-symbol');
                // Chama função para exibir detalhes no card à direita usando cache
                showStockInfoFromCache(symbol);
            });
        });
        // -------------------------------------------------------
    } catch (err) {
        quotesList.innerHTML = 'Erro ao carregar cotações.';
    }
}

// --- Função temporária para simular cache e evitar requisições para ações em destaque durante desenvolvimento ---
function getCachedOrMockQuote(symbol) {
    // Se já está no cache, retorna do cache
    if (quoteCache[symbol]) {
        return quoteCache[symbol];
    }
    // Mock de dados para desenvolvimento (ajuste conforme necessário)
    const mocks = {
        IBOV: { last: 120000, price_change: 0.5, volume: 1000000, bid: 119950, ask: 120050 },
        PETR4: { last: 28.5, price_change: 1.2, volume: 500000, bid: 28.45, ask: 28.55 },
        VALE3: { last: 70.1, price_change: -0.8, volume: 300000, bid: 70.00, ask: 70.15 },
        AZUL4: { last: 15.2, price_change: 2.5, volume: 200000, bid: 15.15, ask: 15.25 },
        ITUB4: { last: 27.8, price_change: 0.3, volume: 400000, bid: 27.75, ask: 27.85 }
    };
    if (mocks[symbol]) {
        quoteCache[symbol] = mocks[symbol];
        // Simula histórico para o gráfico
        const dias = 5;
        const dailyChange = mocks[symbol].price_change / dias;
        let prices = [mocks[symbol].last];
        for (let i = 1; i < dias; i++) {
            const prev = prices[0] / (1 + dailyChange / 100);
            prices.unshift(Number(prev.toFixed(2)));
        }
        histCache[symbol] = prices;
        return mocks[symbol];
    }
    return null;
}
// -------------------------------------------------------------------------------

// --- Função para exibir dados completos de uma ação no card à direita usando cache ---
// Inclui cotação, descrição, gráfico (apenas um local) e análise
function showStockInfoFromCache(symbol) {
    // Elementos do card à direita
    const info = document.getElementById('stock-info');
    const chartEl = document.getElementById('stock-history-chart');
    const descEl = document.getElementById('stock-description');
    const analysisEl = document.getElementById('stock-analysis');
    // Busca dados do cache
    const d = quoteCache[symbol];
    const hist = histCache[symbol];
    if (!d) {
        info.innerHTML = 'Dados não disponíveis no cache.';
        chartEl.style.display = 'none';
        descEl.innerHTML = '';
        analysisEl.innerHTML = '';
        return;
    }
    const preco = d.last ?? null;
    const variacao = d.price_change ?? null;
    info.innerHTML = `
        <div class="flex items-center gap-3 mb-1">
            <span class="font-bold text-lg">${symbol}</span>
            <span class="text-sm ${variacao >= 0 ? 'text-green-300' : 'text-red-300'} font-semibold">
                ${variacao.toFixed(2)}%
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

    // --- Renderiza o gráfico estilizado logo acima do card de análise ---
    // Garante contraste do gráfico: aplica cor escura de fundo ao card do gráfico
    if (Array.isArray(hist) && hist.length > 1) {
        // Remove o fundo branco do card pai, se existir
        // Se o canvas está dentro de um .bg-white, troca para escuro
        if (chartEl.parentNode && chartEl.parentNode.classList.contains('bg-white')) {
            chartEl.parentNode.classList.remove('bg-white');
            chartEl.parentNode.style.background = '#181926';
        }
        // Também remove classes de borda clara
        if (chartEl.parentNode) {
            chartEl.parentNode.classList.remove('shadow-inner');
            chartEl.parentNode.classList.remove('rounded-lg');
            chartEl.parentNode.classList.add('rounded-xl');
            chartEl.parentNode.style.boxShadow = '0 2px 16px 0 rgba(0,0,0,0.18)';
            chartEl.parentNode.style.border = 'none';
        }
        chartEl.style.display = 'block';
        chartEl.style.background = '#181926'; // Fundo escuro para contraste
        chartEl.style.borderRadius = '1rem';
        chartEl.style.margin = '18px 0 0 0';
        chartEl.style.padding = '0';
        chartEl.style.boxShadow = '0 2px 16px 0 rgba(0,0,0,0.18)'; // Mantém sombra para destaque
        chartEl.style.maxWidth = '100%';
        chartEl.style.height = '220px';
        // Ajusta resolução para retina/displays modernos
        const devicePixelRatio = window.devicePixelRatio || 1;
        chartEl.width = (chartEl.parentNode ? chartEl.parentNode.offsetWidth : 400) * devicePixelRatio;
        chartEl.height = 220 * devicePixelRatio;
        chartEl.style.width = '100%';
        chartEl.style.height = '220px';
        if (chartEl._chart) {
            chartEl._chart.destroy();
            chartEl._chart = null;
        }
        renderStockChart(chartEl, hist);
    } else {
        chartEl.style.display = 'none';
    }
    // -------------------------------------------------------------------

    // --- Card de análise agora fica logo abaixo do gráfico ---
    analysisEl.innerHTML = `
        <div style="font-size:1.25rem; line-height:1.7; padding:1.5rem 1.2rem; min-height:7.5rem; background:rgba(255,255,255,0.10); border-radius:1rem; margin-top:1.2rem;">
            ${getMockAnalysis(symbol, preco, variacao)}
        </div>
    `;
    // --------------------------------------------------------
}

// Renderiza uma lista de notícias (mock)
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
    // Adiciona cada notícia como um item de lista
    news.forEach(n =>
        newsList.innerHTML += `<li><a href="${n.url}" target="_blank" class="text-blue-200 underline hover:text-blue-400 transition">${n.title}</a></li>`
    );
}

// Retorna os últimos n dias úteis em formato AAAA-MM-DD
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

// Retorna uma descrição mockada para o símbolo
function getMockDescription(symbol) {
    // Mock para demonstração, agora cobre pelo menos as 30 maiores empresas da B3
    const descs = {
        PETR4: "Petrobras é uma das maiores empresas de energia do mundo, atuando principalmente na exploração, produção e distribuição de petróleo e gás natural.",
        VALE3: "Vale é uma das maiores mineradoras globais, líder na produção de minério de ferro e níquel.",
        ITUB4: "Itaú Unibanco é o maior banco privado do Brasil, referência em serviços financeiros.",
        AZUL4: "Azul Linhas Aéreas é uma das principais companhias aéreas do Brasil, com forte presença regional.",
        IBOV: "Ibovespa é o principal índice da bolsa brasileira, refletindo o desempenho das ações mais negociadas.",
        BBDC4: "Bradesco é um dos maiores bancos do Brasil, oferecendo uma ampla gama de serviços financeiros.",
        B3SA3: "B3 é a bolsa de valores oficial do Brasil, responsável pela negociação de ações e outros ativos.",
        ABEV3: "Ambev é líder no setor de bebidas na América Latina, com marcas como Skol, Brahma e Antarctica.",
        BBAS3: "Banco do Brasil é um dos maiores bancos do país, com forte atuação em crédito e serviços bancários.",
        BBDC3: "Bradesco PN é uma das principais ações do setor bancário brasileiro.",
        BRFS3: "BRF é uma das maiores empresas de alimentos do mundo, dona das marcas Sadia e Perdigão.",
        BRKM5: "Braskem é a maior produtora de resinas termoplásticas das Américas e líder mundial em biopolímeros.",
        BRML3: "BR Malls é uma das maiores empresas de shopping centers do Brasil.",
        CIEL3: "Cielo é líder em soluções de pagamentos eletrônicos no Brasil.",
        CMIG4: "Cemig é uma das maiores companhias do setor elétrico brasileiro.",
        COGN3: "Cogna Educação é uma das maiores organizações educacionais do mundo.",
        CSAN3: "Cosan atua nos setores de energia, logística, infraestrutura e agronegócio.",
        CSNA3: "CSN é uma das maiores siderúrgicas do Brasil, com atuação em mineração e logística.",
        CVCB3: "CVC é a maior operadora de turismo da América Latina.",
        CYRE3: "Cyrela é uma das maiores incorporadoras do setor imobiliário brasileiro.",
        ECOR3: "Ecorodovias atua no setor de concessão de rodovias no Brasil.",
        EGIE3: "Engie Brasil é uma das maiores geradoras privadas de energia elétrica do país.",
        ELET3: "Eletrobras é a maior companhia de energia elétrica da América Latina.",
        EMBR3: "Embraer é uma das maiores fabricantes de aeronaves do mundo.",
        ENBR3: "EDP Brasil atua na geração, distribuição e comercialização de energia elétrica.",
        EQTL3: "Equatorial Energia é uma das principais empresas do setor elétrico brasileiro.",
        GGBR4: "Gerdau é líder na produção de aços longos nas Américas e uma das maiores fornecedoras de aços especiais do mundo.",
        GOAU4: "Metalúrgica Gerdau atua no setor de siderurgia e metalurgia.",
        HYPE3: "Hypera Pharma é uma das maiores empresas farmacêuticas do Brasil.",
        ITSA4: "Itaúsa é uma holding que controla empresas como Itaú Unibanco e Duratex.",
        JBSS3: "JBS é uma das maiores empresas de alimentos do mundo, líder global em processamento de carnes.",
        KLBN11: "Klabin é a maior produtora e exportadora de papéis para embalagens do Brasil.",
        LAME4: "Lojas Americanas é uma das maiores redes de varejo do Brasil.",
        LREN3: "Lojas Renner é a maior varejista de moda do Brasil.",
        MGLU3: "Magazine Luiza é uma das maiores varejistas do Brasil, referência em transformação digital.",
        MRFG3: "Marfrig é uma das maiores companhias de carne bovina do mundo.",
        MRVE3: "MRV Engenharia é líder nacional no segmento de construção civil.",
        MULT3: "Multiplan é uma das maiores empresas de shopping centers do Brasil.",
        PETR3: "Petrobras ON atua no setor de energia, principalmente em petróleo e gás.",
        QUAL3: "Qualicorp é líder em administração de planos de saúde coletivos.",
        RADL3: "Raia Drogasil é a maior rede de drogarias do Brasil.",
        RAIZ4: "Raízen é uma das maiores empresas de energia e bioenergia do Brasil.",
        RENT3: "Localiza é líder em aluguel de carros e gestão de frotas na América do Sul.",
        SANB11: "Banco Santander Brasil é um dos maiores bancos do país.",
        SBSP3: "Sabesp é a maior empresa de saneamento básico do Brasil.",
        SULA11: "SulAmérica atua nos segmentos de seguros e previdência.",
        SUZB3: "Suzano é líder global na produção de celulose de eucalipto.",
        TAEE11: "Taesa é uma das maiores companhias de transmissão de energia elétrica do Brasil.",
        TIMS3: "TIM Brasil é uma das principais operadoras de telefonia móvel do país.",
        UGPA3: "Ultrapar atua nos setores de distribuição de combustíveis, gás e produtos químicos.",
        USIM5: "Usiminas é uma das maiores produtoras de aços planos da América Latina.",
        VBBR3: "Vibra Energia atua no setor de distribuição de combustíveis.",
        VIVT3: "Vivo (Telefônica Brasil) é líder em telecomunicações no Brasil.",
        WEGE3: "WEG é uma das maiores fabricantes de equipamentos elétricos do mundo."
    };
    return descs[symbol] || "Empresa listada na B3. Consulte o site oficial para mais informações.";
}

// Retorna uma análise mockada baseada no preço e variação
function getMockAnalysis(symbol, preco, variacao) {
    // Mock para demonstração, troque por análise real se desejar
    if (preco === null || variacao === null) return "";
    let tendencia = variacao > 0 ? "alta" : variacao < 0 ? "baixa" : "estável";
    let cor = variacao > 0 ? "text-green-400" : variacao < 0 ? "text-red-400" : "text-gray-300";
    return `
        <div class="font-semibold ${cor} mb-1">Tendência: ${tendencia.toUpperCase()}</div>
        <div>
            O ativo <b>${symbol}</b> apresenta variação de <b>${variacao.toFixed(2)}%</b> no dia.<br>
            ${variacao > 0
                ? "O movimento de alta pode indicar otimismo do mercado ou divulgação de resultados positivos."
                : variacao < 0
                    ? "A queda pode estar relacionada a fatores macroeconômicos ou notícias negativas."
                    : "O ativo apresenta estabilidade no pregão atual."}
        </div>
    `;
}

// Configura o formulário de busca de ações e exibe informações detalhadas
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

        // --- Se já existe no cache, exibe sem nova requisição ---
        if (quoteCache[symbol]) {
            showStockInfoFromCache(symbol);
            // ---------------------------------------------------------------
            return;
        }
        // --------------------------------------------------------

        // Barra de progresso animada com gradiente (agora maior)
        info.innerHTML = `
            <div class="flex flex-col items-center gap-4 w-full py-8">
                <span class="text-lg">Buscando...</span>
                <span class="w-2/3 max-w-xl h-4 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 animate-progress-bar">
                    <span class="block h-4 w-full bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 animate-progress-bar-inner"></span>
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
        chartEl.style.display = 'none'; // Esconde gráfico durante busca
        const token = 'a814ccf4aa08298232f4cd24d5b5019df966d40c';
        try {
            // --- Apenas uma requisição para cotação ---
            const quoteResp = await fetch(PROXY + encodeURIComponent(`${API_BASE}/api/ibov/quotes/?symbol=${symbol}&token=${token}`));
            if (!quoteResp.ok) {
                info.innerHTML = 'Não foi possível encontrar resultados para o ticker informado. Verifique se digitou corretamente.';
                return;
            }
            const quoteData = await quoteResp.json();
            const d = quoteData.data && quoteData.data[symbol];
            if (d) quoteCache[symbol] = d;
            const preco = d?.last ?? null;
            const variacao = d?.price_change ?? null;
            if (preco === null) {
                info.innerHTML = 'Não foi possível encontrar resultados para o ticker informado. Verifique se digitou corretamente.';
                return;
            }
            info.innerHTML = `
                <div class="flex items-center gap-3 mb-1">
                    <span class="font-bold text-lg">${symbol}</span>
                    <span class="text-sm ${variacao >= 0 ? 'text-green-300' : 'text-red-300'} font-semibold">
                        ${variacao.toFixed(2)}%
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

            // --- Busca histórico dos últimos 5 dias úteis (apenas uma requisição) ---
            const dates = getLastNDates(5);
            const start_date = dates[0];
            const end_date = dates[dates.length - 1];
            const timeframe = "1440";
            const histUrl = `${API_BASE}/api/ibov/historical/?symbol=${symbol}&timeframe=${timeframe}&start_date=${start_date}&end_date=${end_date}`;
            const histResp = await fetch(PROXY + encodeURIComponent(histUrl));
            let histArr = [];
            if (typeof preco === "number" && typeof variacao === "number") {
                // Simula histórico se necessário
                const dias = 5;
                const dailyChange = variacao / dias;
                let prices = [preco];
                for (let i = 1; i < dias; i++) {
                    const prev = prices[0] / (1 + dailyChange / 100);
                    prices.unshift(prev);
                }
                histArr = prices.map(v => Number(v.toFixed(2)));
            }
            if (!histResp.ok) {
                if (histArr.length > 1) histCache[symbol] = histArr;
                chartEl.style.display = histArr.length > 1 ? '' : 'none';
                if (histArr.length > 1) {
                    renderStockChart(chartEl, histArr);
                }
                return;
            }
            const histData = await histResp.json();
            if (Array.isArray(histData) && histData.length > 0) {
                histCache[symbol] = histData.map(d => d.close ?? d.last);
            } else if (histArr.length > 1) {
                histCache[symbol] = histArr;
            }
            // --- Exibe gráfico no card usando histórico recém obtido ---
            if (Array.isArray(histCache[symbol]) && histCache[symbol].length > 1) {
                chartEl.style.display = 'block';
                // Limpa gráfico anterior se existir
                if (chartEl._chart) {
                    chartEl._chart.destroy();
                    chartEl._chart = null;
                }
                renderStockChart(chartEl, histCache[symbol]);
            } else {
                chartEl.style.display = 'none';
            }
            // ----------------------------------------------------------------
        } catch (err) {
            info.innerHTML = 'Não foi possível obter a cotação. Tente novamente mais tarde.';
            chartEl.style.display = 'none';
        }
    };
}

// Renderiza o gráfico de histórico de preços usando Chart.js
function renderStockChart(canvas, data) {
    // --- Gráfico de linha estilizado para identidade visual da página ---
    // canvas: elemento canvas do DOM
    // data: array de preços (um para cada dia)
    if (!window.Chart) return;
    // Limpa gráfico anterior se existir
    if (canvas._chart) {
        canvas._chart.destroy();
        canvas._chart = null;
    }
    // Corrige labels para mostrar apenas "Hoje" já que todos os dados são do mesmo dia
    let labels = [];
    if (Array.isArray(data) && data.length > 0) {
        labels = data.map(() => "Hoje");
    }
    // Garante que os dados são numéricos e não undefined/null
    const cleanData = Array.isArray(data)
        ? data.map(v => (typeof v === "number" && !isNaN(v) ? v : null))
        : [];
    // Só renderiza se houver pelo menos 2 pontos válidos
    if (cleanData.filter(v => v !== null).length < 2) {
        canvas.style.display = 'none';
        return;
    }
    canvas.style.display = 'block';
    // --- Chart.js config com identidade visual escura, descrição do eixo Y e curva smooth ---
    canvas._chart = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Preço',
                data: cleanData,
                borderColor: '#a78bfa',
                backgroundColor: 'rgba(56,189,248,0.08)',
                fill: true,
                tension: 0.6, // curva mais suave
                pointRadius: 4,
                pointBackgroundColor: '#38bdf8',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: false, // já controlado pelo canvas.width/height acima
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#181926',
                    titleColor: '#fff',
                    bodyColor: '#a5b4fc',
                    borderColor: '#a78bfa',
                    borderWidth: 1
                }
            },
            layout: { padding: 10 },
            scales: {
                x: {
                    title: { display: false },
                    ticks: { color: '#c7d2fe', font: { size: 14 } },
                    grid: { color: 'rgba(167,139,250,0.10)' }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Preço (R$)',
                        color: '#c7d2fe',
                        font: { size: 15, weight: 'bold' }
                    },
                    ticks: { color: '#c7d2fe', font: { size: 14 } },
                    grid: { color: 'rgba(167,139,250,0.10)' }
                }
            }
        }
    });
}
