// estado.js - Estado global, LocalStorage e extrato/orçamento/metas
export let saldoOrcamento = 5000;
export let extrato = [];
export let metas = [
    { nome: 'Casa Própria', valor: 500000, economizado: 125000, cor: 'from-pink-400 to-yellow-300' },
    { nome: 'Viagem Europa', valor: 15000, economizado: 10950, cor: 'from-cyan-400 to-green-300' },
    { nome: 'Reserva Emergência', valor: 50000, economizado: 42000, cor: 'from-indigo-400 to-purple-400' }
];

export function salvarEstado() {
    localStorage.setItem('metas', JSON.stringify(metas));
    localStorage.setItem('saldoOrcamento', saldoOrcamento);
    localStorage.setItem('extrato', JSON.stringify(extrato));
}
export function carregarEstado() {
    const metasLS = localStorage.getItem('metas');
    if (metasLS) metas = JSON.parse(metasLS);
    const saldoLS = localStorage.getItem('saldoOrcamento');
    if (saldoLS) saldoOrcamento = parseFloat(saldoLS);
    const extratoLS = localStorage.getItem('extrato');
    if (extratoLS) extrato = JSON.parse(extratoLS);
}

export function renderOrcamento() {
    document.getElementById('orcamento-saldo').textContent = 'R$ ' + saldoOrcamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    let totalMetas = metas.reduce((acc, m) => acc + m.economizado, 0);
    let totalAlvo = metas.reduce((acc, m) => acc + m.valor, 0);
    document.getElementById('orcamento-resumo').innerHTML = `
        <li>Total economizado em metas: <b>R$ ${totalMetas.toLocaleString('pt-BR')}</b></li>
        <li>Progresso geral: <b>${Math.round((totalMetas / totalAlvo) * 100)}%</b></li>
    `;
    let analise = '';
    if (saldoOrcamento < 1000) analise = 'Atenção: seu saldo está baixo. Considere reduzir despesas ou rever aportes.';
    else if (saldoOrcamento > 10000) analise = 'Parabéns! Seu saldo está saudável para novos investimentos.';
    else analise = 'Seu saldo está adequado. Continue acompanhando suas metas.';
    document.getElementById('orcamento-analise').textContent = analise;

    // Atualiza patrimônio total no topo
    const patrimonioTotal = saldoOrcamento + totalMetas;
    const elPatrimonio = document.getElementById('total-balance');
    if (elPatrimonio) {
        elPatrimonio.textContent = 'R$ ' + patrimonioTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    }
}

export function renderExtrato() {
    const el = document.getElementById('orcamento-extrato');
    const el2 = document.getElementById('extrato-geral');
    if (!el || !el2) return;
    let html = '';
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

export function renderMetas() {
    const renderToContainer = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        metas.forEach((meta, idx) => {
            const percent = Math.min(100, Math.round((meta.economizado / meta.valor) * 100));
            let progressGradient = '';
            if (meta.nome === 'Viagem Europa') progressGradient = 'background: linear-gradient(90deg, #22d3ee, #4ade80);';
            container.innerHTML += `
            <div class="goal-item">
                <div class="goal-header flex justify-between items-center">
                    <span class="goal-name">${meta.nome}</span>
                    <span class="goal-amount">R$ ${meta.valor.toLocaleString('pt-BR')}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percent}%;${progressGradient}"></div>
                </div>
                <div class="progress-text">${percent}% concluído • R$ ${meta.economizado.toLocaleString('pt-BR')} economizados</div>
                <div class="flex gap-2 mt-2">
                    <button class="btn bg-green-500 hover:bg-green-600 text-xs" onclick="abrirModalMeta(${idx}, 'deposito')">Depositar</button>
                    <button class="btn bg-red-500 hover:bg-red-600 text-xs" onclick="abrirModalMeta(${idx}, 'retirada')">Retirar</button>
                </div>
            </div>`;
        });
    };
    renderToContainer('goals-section');
    renderToContainer('goals-previw');
}
