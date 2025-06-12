// spa.js - Navegação SPA e inicialização global
import { carregarEstado, renderOrcamento, renderMetas, renderExtrato } from './estado.js';
import { renderOportunidades } from './oportunidades.js';
import { initGraficos, calcularInvestimento } from './investimentos.js';
import { renderMercado } from './mercado.js';

export function mostrarSecao(idSecao) {
    document.querySelectorAll('.spa-section').forEach(sec => {
        sec.classList.remove('active');
        sec.classList.add('hidden');
    });
    const secaoAtiva = document.getElementById(idSecao);
    if (secaoAtiva) {
        secaoAtiva.classList.remove('hidden');
        secaoAtiva.classList.add('active');
    }
    if (idSecao === 'investimentos') calcularInvestimento();
    if (idSecao === 'orcamento') renderOrcamento();
    if (idSecao === 'metas') renderMetas();
    if (idSecao === 'extrato') renderExtrato();
    if (idSecao === 'mercado') renderMercado();
}

document.addEventListener('DOMContentLoaded', () => {
    carregarEstado();
    mostrarSecao('investimentos');
    renderOportunidades();
    renderMetas();
    renderOrcamento();
    renderExtrato();
    initGraficos();
    calcularInvestimento();
});
