// spa.js - Gerencia navegação SPA e inicialização global do app
// Importa funções de outros módulos para manipular o estado e renderizar seções
import { carregarEstado, renderOrcamento, renderMetas, renderExtrato } from './estado.js';
import { renderOportunidades } from './oportunidades.js';
import { initGraficos, calcularInvestimento } from './investimentos.js';
import { renderMercado } from './mercado.js';

// Função responsável por exibir a seção ativa da SPA
// Esconde todas as seções e exibe apenas a selecionada
// Também chama funções de renderização específicas conforme a seção
export function mostrarSecao(idSecao) {
    // Esconde todas as seções marcadas com a classe 'spa-section'
    document.querySelectorAll('.spa-section').forEach(sec => {
        sec.classList.remove('active');
        sec.classList.add('hidden');
    });
    // Exibe a seção selecionada
    const secaoAtiva = document.getElementById(idSecao);
    if (secaoAtiva) {
        secaoAtiva.classList.remove('hidden');
        secaoAtiva.classList.add('active');
    }
    // Renderiza conteúdos específicos ao trocar de seção
    if (idSecao === 'investimentos') calcularInvestimento();
    if (idSecao === 'orcamento') renderOrcamento();
    if (idSecao === 'metas') renderMetas();
    if (idSecao === 'extrato') renderExtrato();
    if (idSecao === 'mercado') renderMercado();
    if (idSecao === 'dicas') {
        // Aguarda carregamento e renderiza posts de dicas
        setTimeout(() => {
            if (window.renderizarPosts) {
                window.renderizarPosts();
            }
        }, 100);
    }
}

// Inicialização automática ao carregar a página
// Carrega estado, renderiza seções e gráficos
// Garante que tudo está pronto ao abrir o app
// Executa apenas uma vez ao carregar o DOM
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
