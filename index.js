// index.js - Atualiza o resumo da carteira de investimentos na interface
// Função para atualizar os valores do patrimônio, valor final projetado, lucro total e rentabilidade
function atualizarResumoCarteira({ patrimonio, valorFinal, lucroTotal, rentabilidade }) {
    // Garante que o patrimônio sempre inicia em 0 se não informado
    patrimonio = patrimonio || 0;

    // Busca os elementos do HTML pelos seus IDs
    const patrimonioEl = document.getElementById('resumo-patrimonio');
    const valorFinalEl = document.getElementById('resumo-valor-final');
    const lucroTotalEl = document.getElementById('resumo-lucro-total');
    const rentabilidadeEl = document.getElementById('resumo-rentabilidade');
    const cartaoDigitalEl = document.getElementById('cartao-digital-valor');

    // Atualiza o texto de cada elemento com os valores formatados
    if (patrimonioEl) patrimonioEl.textContent = `R$ ${Number(patrimonio).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (valorFinalEl) valorFinalEl.textContent = `R$ ${Number(valorFinal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (lucroTotalEl) lucroTotalEl.textContent = `R$ ${Number(lucroTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    if (rentabilidadeEl) rentabilidadeEl.textContent = `${Number(rentabilidade).toFixed(2)}%`;
    if (cartaoDigitalEl) cartaoDigitalEl.textContent = `R$ ${Number(patrimonio).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

// Exemplo de uso: chame esta função após calcular os valores dinamicamente
// atualizarResumoCarteira({
//     patrimonio: 12345.67,
//     valorFinal: 15000.00,
//     lucroTotal: 2654.33,
//     rentabilidade: 21.5
// });