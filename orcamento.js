// orcamento.js - Funções relacionadas ao Orçamento

// Função global para abrir modal de depósito em Orçamento
window.abrirDeposito = function() {
    const valor = prompt('Digite o valor a depositar no orçamento:', '100');
    const v = parseFloat(valor);
    import('./estado.js').then(mod => {
        // Busca fundos extras e saldo do orçamento
        let fundos = window.fundosPatrimonio || 0;
        const metasArr = mod.metas || [];
        const saldo = mod.saldoOrcamento || 0;
        let totalMetas = metasArr.reduce((acc, m) => acc + m.economizado, 0);
        const patrimonioTotal = saldo + totalMetas + fundos;
        if (isNaN(v) || v <= 0) return;
        if (v > fundos) {
            alert('Valor maior que o patrimônio disponível para depósito!');
            return;
        }
        window.saldoOrcamento += v;
        fundos -= v;
        window.fundosPatrimonio = fundos;
        if (typeof saveFundosPatrimonio === 'function') saveFundosPatrimonio(fundos);
        // Força sincronização do valor global após salvar
        window.fundosPatrimonio = parseFloat(localStorage.getItem('fundosPatrimonio_' + (window.usuario && window.usuario.username ? window.usuario.username : 'anonimo')) || 0);
        window.extrato.unshift({ tipo: 'Depósito Orçamento', valor: v, data: new Date() });
        window.salvarEstado();
        window.renderOrcamento();
        window.renderExtrato();
    });
};
// Função global para abrir modal de retirada em Orçamento
window.abrirRetirada = function() {
    const valor = prompt('Digite o valor a retirar do orçamento:', '100');
    const v = parseFloat(valor);
    if (!isNaN(v) && v > 0 && v <= window.saldoOrcamento) {
        window.saldoOrcamento -= v;
        // Adiciona o valor de volta ao patrimônio
        let fundos = window.fundosPatrimonio || 0;
        fundos += v;
        window.fundosPatrimonio = fundos;
        if (typeof saveFundosPatrimonio === 'function') saveFundosPatrimonio(fundos);
        window.extrato.unshift({ tipo: 'Retirada Orçamento', valor: v, data: new Date() });
        window.salvarEstado();
        window.renderOrcamento();
        window.renderExtrato();
    } else if (v > window.saldoOrcamento) {
        alert('Saldo insuficiente no orçamento!');
    }
};
// Função global para abrir modal de depósito/retirada do Cartão Digital do Orçamento
import { adicionarAoOrcamento, retirarDoOrcamento, adicionarExtrato, salvarEstado, renderOrcamento, renderExtrato } from './estado.js';

window.abrirModalOrcamento = function(tipo) {
    document.getElementById('meta-modal-overlay').classList.remove('hidden');
    document.getElementById('meta-modal').classList.remove('hidden');
    import('./estado.js').then(({ saldoOrcamento }) => {
        document.getElementById('meta-modal-nome').textContent = 'Cartão Digital';
        document.getElementById('meta-modal-saldo').textContent = `Saldo: R$ ${saldoOrcamento.toLocaleString('pt-BR')}`;
        document.getElementById('meta-modal-titulo').textContent = tipo === 'deposito' ? 'Depositar valor no orçamento' : 'Retirar valor do orçamento';
        const btn = document.getElementById('meta-modal-btn');
        btn.textContent = tipo === 'deposito' ? 'Depositar' : 'Retirar';
        btn.setAttribute('type', 'button');
        // Limpa o campo de valor
        const form = document.getElementById('meta-modal-form');
        const input = form.querySelector('input[type=number]');
        if (input) input.value = '';
        // Remove handlers antigos do botão e do form
        btn.onclick = null;
        form.onsubmit = null;
        // Handler único
        function handleOrcamento(e) {
            if (e) e.preventDefault();
            const valor = parseFloat(input.value);
            if (isNaN(valor) || valor <= 0) return;
            if (tipo === 'deposito') {
                adicionarAoOrcamento(valor);
                // Subtrai do patrimônio ao depositar
                let fundos = window.fundosPatrimonio || 0;
                fundos -= valor;
                window.fundosPatrimonio = fundos;
                if (typeof saveFundosPatrimonio === 'function') saveFundosPatrimonio(fundos);
                adicionarExtrato({ tipo: 'Depósito Orçamento', valor, data: new Date() });
            } else {
                if (valor > saldoOrcamento) {
                    alert('Saldo insuficiente no orçamento!');
                    return;
                }
                retirarDoOrcamento(valor);
                // Adiciona o valor de volta ao patrimônio ao retirar
                let fundos = window.fundosPatrimonio || 0;
                fundos += valor;
                window.fundosPatrimonio = fundos;
                if (typeof saveFundosPatrimonio === 'function') saveFundosPatrimonio(fundos);
                adicionarExtrato({ tipo: 'Retirada Orçamento', valor, data: new Date() });
            }
            salvarEstado();
            renderOrcamento();
            renderExtrato();
            window.fecharModalMeta();
        }
        form.onsubmit = handleOrcamento;
        btn.onclick = handleOrcamento;
        // Atualiza gradiente do cartão digital no modal
        const card = document.getElementById('meta-modal-card');
        card.className = 'rounded-2xl p-6 shadow-lg w-96 h-52 flex flex-col items-start justify-between mb-4 transition-all duration-300 meta-modal-card bg-gradient-to-r from-blue-500 to-green-400';
        card.style.background = '';
    });
};
