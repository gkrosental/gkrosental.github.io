// main.js - Ponto de entrada para scripts organizados
import { mostrarSecao } from './spa.js';
import { renderOportunidades } from './oportunidades.js';
import { renderOrcamento, renderMetas, renderExtrato } from './estado.js';
import { calcularInvestimento, initGraficos } from './investimentos.js';
import { renderMercado } from './mercado.js';

// Expor funções globais para HTML inline handlers (se necessário)
window.mostrarSecao = mostrarSecao;
window.renderOportunidades = renderOportunidades;
window.renderOrcamento = renderOrcamento;
window.renderMetas = renderMetas;
window.renderExtrato = renderExtrato;
window.calcularInvestimento = calcularInvestimento;
window.initGraficos = initGraficos;
window.renderMercado = renderMercado;

// Função global para abrir o modal de depósito/retirada de meta
window.abrirModalMeta = async function(idx, tipo) {
    // Exibe o overlay e o modal
    document.getElementById('meta-modal-overlay').classList.remove('hidden');
    document.getElementById('meta-modal').classList.remove('hidden');
    // Preenche informações da meta selecionada
    const { metas } = await import('./estado.js');
    const meta = metas[idx];
    document.getElementById('meta-modal-nome').textContent = meta.nome;
    document.getElementById('meta-modal-saldo').textContent = `Economizado: R$ ${meta.economizado.toLocaleString('pt-BR')}`;
    document.getElementById('meta-modal-titulo').textContent = tipo === 'deposito' ? 'Depositar valor na meta' : 'Retirar valor da meta';
    document.getElementById('meta-modal-btn').textContent = tipo === 'deposito' ? 'Depositar' : 'Retirar';

    // Aplica gradiente do cartão digital conforme a meta
    const card = document.getElementById('meta-modal-card');
    card.style.background = '';
    if (meta.nome === 'Viagem Europa') {
        // Gradiente igual ao da barra de progresso
        card.className = 'rounded-2xl p-6 shadow-lg w-96 h-52 flex flex-col items-start justify-between mb-4 transition-all duration-300 meta-modal-card';
        card.style.background = 'linear-gradient(90deg, #22d3ee, #4ade80)';
    } else {
        // Outras metas usam Tailwind
        card.className = `rounded-2xl p-6 shadow-lg w-96 h-52 flex flex-col items-start justify-between mb-4 transition-all duration-300 meta-modal-card bg-gradient-to-r ${meta.cor || 'from-blue-500 to-green-400'}`;
    }

    // Remove event listener anterior para evitar múltiplos handlers
    const form = document.getElementById('meta-modal-form');
    const novoForm = form.cloneNode(true);
    form.parentNode.replaceChild(novoForm, form);

    novoForm.onsubmit = async function(e) {
        e.preventDefault();
        const valor = parseFloat(novoForm.querySelector('input[type=number]').value);
        if (isNaN(valor) || valor <= 0) return;
        const { metas, saldoOrcamento, salvarEstado, renderMetas, renderOrcamento, extrato, renderExtrato } = await import('./estado.js');
        if (tipo === 'deposito') {
            if (valor > saldoOrcamento) {
                alert('Saldo insuficiente no orçamento!');
                return;
            }
            metas[idx].economizado += valor;
            window.saldoOrcamento -= valor;
            extrato.unshift({ tipo: 'Depósito Meta', meta: meta.nome, valor, data: new Date() });
        } else {
            if (valor > metas[idx].economizado) {
                alert('Valor maior que o economizado na meta!');
                return;
            }
            metas[idx].economizado -= valor;
            window.saldoOrcamento += valor;
            extrato.unshift({ tipo: 'Retirada Meta', meta: meta.nome, valor, data: new Date() });
        }
        salvarEstado();
        renderMetas();
        renderOrcamento();
        renderExtrato();
        fecharModalMeta();
    };
};

// Função para fechar o modal
window.fecharModalMeta = function() {
    document.getElementById('meta-modal-overlay').classList.add('hidden');
    document.getElementById('meta-modal').classList.add('hidden');
};

// Fecha modal ao clicar no X ou no overlay
document.getElementById('meta-modal-close').onclick = window.fecharModalMeta;
document.getElementById('meta-modal-overlay').onclick = window.fecharModalMeta;
