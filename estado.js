// estado.js - Estado global, LocalStorage e extrato/orçamento/metas

// Variáveis globais para saldo do orçamento, extrato de movimentações e metas financeiras
export let saldoOrcamento = 0; // Saldo disponível para orçamento
export let extrato = []; // Lista de movimentações financeiras
export let metas = []; // Lista de metas financeiras do usuário

// Salva o estado atual (metas, saldo, extrato) no LocalStorage do navegador
export function salvarEstado() {
    const usuarioId = (window.usuario && window.usuario.username) ? window.usuario.username : 'anonimo';
    localStorage.setItem('metas_' + usuarioId, JSON.stringify(metas));
    localStorage.setItem('saldoOrcamento_' + usuarioId, saldoOrcamento);
    localStorage.setItem('extrato_' + usuarioId, JSON.stringify(extrato));
}

// Carrega o estado salvo do LocalStorage, se existir
export function carregarEstado() {
    const usuarioId = (window.usuario && window.usuario.username) ? window.usuario.username : 'anonimo';
    const metasLS = localStorage.getItem('metas_' + usuarioId);
    if (metasLS) metas = JSON.parse(metasLS);
    else metas = [];
    const saldoLS = localStorage.getItem('saldoOrcamento_' + usuarioId);
    if (saldoLS) saldoOrcamento = parseFloat(saldoLS);
    else saldoOrcamento = 0; // Garante reset se não houver valor salvo
    const extratoLS = localStorage.getItem('extrato_' + usuarioId);
    if (extratoLS) extrato = JSON.parse(extratoLS);
    else extrato = [];
}

// Renderiza o saldo, resumo e análise do orçamento na tela
export function renderOrcamento() {
    // Sempre busca o saldo atualizado do módulo
    import('./estado.js').then(mod => {
        const saldo = mod.saldoOrcamento;
        const metasArr = mod.metas;
        // Soma fundos extras ao patrimônio
        const fundos = window.fundosPatrimonio || 0;
        document.getElementById('orcamento-saldo').textContent = 'R$ ' + saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        let totalMetas = metasArr.reduce((acc, m) => acc + m.economizado, 0);
        let totalAlvo = metasArr.reduce((acc, m) => acc + m.valor, 0);
        document.getElementById('orcamento-resumo').innerHTML = `
            <li>Total economizado em metas: <b>R$ ${totalMetas.toLocaleString('pt-BR')}</b></li>
            <li>Progresso geral: <b>${Math.round((totalMetas / totalAlvo) * 100)}%</b></li>
        `;
        let analise = '';
        if (saldo < 1000) analise = 'Atenção: seu saldo está baixo. Considere reduzir despesas ou rever aportes.';
        else if (saldo > 10000) analise = 'Parabéns! Seu saldo está saudável para novos investimentos.';
        else analise = 'Seu saldo está adequado. Continue acompanhando suas metas.';
        document.getElementById('orcamento-analise').textContent = analise;
        // Patrimônio total inclui apenas fundos extras e o total economizado em metas
        const patrimonioTotal = fundos + totalMetas;
        const elPatrimonio = document.getElementById('total-balance');
        if (elPatrimonio) {
            elPatrimonio.textContent = 'R$ ' + patrimonioTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
            console.log('[renderOrcamento] Patrimônio atualizado:', patrimonioTotal, 'Total Metas:', totalMetas, 'Fundos:', fundos);
        } else {
            console.warn('[renderOrcamento] Elemento #total-balance não encontrado!');
        }
    });
}

// Renderiza o extrato de movimentações financeiras na tela
export function renderExtrato() {
    const el = document.getElementById('orcamento-extrato'); // Extrato do orçamento
    const el2 = document.getElementById('extrato-geral');   // Extrato geral
    if (!el || !el2) return;
    let html = '';
    // Monta cada linha do extrato
    extrato.forEach(item => {
        html += `<li class="py-2 flex justify-between text-sm">
            <span>${item.tipo}${item.meta ? ' - ' + item.meta : ''}</span>
            <span class="font-mono">R$ ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <span class="opacity-60">${new Date(item.data).toLocaleString('pt-BR')}</span>
        </li>`;
    });
    el.innerHTML = html;
    el2.innerHTML = html;
}

// Renderiza as metas financeiras e seus progressos na tela
export function renderMetas() {
    // Função auxiliar para renderizar em diferentes containers
    const renderToContainer = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        metas.forEach((meta, idx) => {
            const percent = Math.min(100, Math.round((meta.economizado / meta.valor) * 100));
            // Aplica gradiente customizado de cada meta na barra de progresso
            let progressGradient = meta.cor
                ? `background: linear-gradient(90deg, var(--tw-gradient-stops));` // Tailwind usa as classes, mas para inline precisa do style
                : '';
            // Bloco visual de cada meta
            container.innerHTML += `
            <div class="goal-item">
                <div class="goal-header flex justify-between items-center">
                    <span class="goal-name">${meta.nome}</span>
                    <span class="goal-amount">R$ ${meta.valor.toLocaleString('pt-BR')}</span>
                </div>
                <div class="progress-bar bg-gray-700 rounded-full h-4 overflow-hidden mb-2">
                    <div class="progress-fill h-4 rounded-full transition-all duration-700 bg-gradient-to-r ${meta.cor}" style="width: ${percent}%;"></div>
                </div>
                <div class="progress-text">${percent}% concluído • R$ ${meta.economizado.toLocaleString('pt-BR')} economizados</div>
                <div class="flex gap-2 mt-2">
                    <button class="btn bg-green-500 hover:bg-green-600 text-xs" onclick="abrirModalMeta(${idx}, 'deposito')">Depositar</button>
                    <button class="btn bg-red-500 hover:bg-red-600 text-xs" onclick="abrirModalMeta(${idx}, 'retirada')">Retirar</button>
                </div>
            </div>`;
        });
    };
    renderToContainer('goals-section'); // Container principal
    renderToContainer('goals-preview');  // Container de preview
}

// Funções para manipulação do orçamento e extrato
export function adicionarAoOrcamento(valor) {
    saldoOrcamento += valor;
}
export function retirarDoOrcamento(valor) {
    saldoOrcamento -= valor;
}
export function adicionarExtrato(item) {
    extrato.unshift(item);
}
