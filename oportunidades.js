// oportunidades.js - Oportunidades de investimento

// Função principal para renderizar oportunidades de investimento na tela
export function renderOportunidades() {
    // Lista fixa de oportunidades disponíveis
    const oportunidades = [
        { nome: 'CDB Premium', taxa: 13.2, desc: 'Liquidez em 90 dias • Garantido pelo FGC', tipo: 'high' },
        { nome: 'LCI Banco XYZ', taxa: 11.8, desc: 'Isento de IR • Renda Fixa', tipo: 'high' },
        { nome: 'Tesouro IPCA+', taxa: 10.5, desc: 'Proteção contra inflação', tipo: 'medium' },
        { nome: 'Poupança', taxa: 6.2, desc: 'Liquidez diária • Baixo rendimento', tipo: 'low' },
        { nome: 'Bitcoin', taxa: 35.0, desc: 'Criptomoeda mais negociada do mundo', tipo: 'cripto' }
    ];
    // Seleciona o grid de oportunidades na página
    const grid = document.getElementById('opportunities-grid');
    if (!grid) return;
    grid.innerHTML = '';
    // Cria um card para cada oportunidade
    oportunidades.forEach((op, idx) => {
        grid.innerHTML += `
            <div class="opportunity ${op.tipo}">
                <div class="opportunity-header">
                    <span class="opportunity-name">${op.nome}</span>
                    <span class="opportunity-rate">${op.taxa.toFixed(1)}%</span>
                </div>
                <div class="opportunity-desc">${op.desc}</div>
            </div>
        `;
    });
    // Adiciona interação: ao clicar, preenche o formulário de simulação
    const cards = grid.querySelectorAll('.opportunity');
    cards.forEach((card, idx) => {
        card.addEventListener('click', function() {
            document.getElementById('interestRate').value = oportunidades[idx].taxa;
            // Atualiza o tipo de investimento no formulário
            const investmentTypeSelect = document.getElementById('investmentType');
            if (oportunidades[idx].nome.includes('CDB')) investmentTypeSelect.value = 'cdb';
            else if (oportunidades[idx].nome.includes('LCI')) investmentTypeSelect.value = 'lci';
            else if (oportunidades[idx].nome.includes('Tesouro')) investmentTypeSelect.value = 'tesouro';
            else if (oportunidades[idx].nome.includes('Poupança')) investmentTypeSelect.value = 'poupanca';
            else if (oportunidades[idx].nome.includes('Bitcoin')) investmentTypeSelect.value = 'cripto';
            // Recalcula simulação se função disponível
            if (typeof window.calcularInvestimento === 'function') window.calcularInvestimento();
            // Animação visual do card
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'translateX(5px)';
            }, 150);
            // Rola para a seção de investimentos
            const invSection = document.getElementById('investimentos');
            if (invSection) invSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
}
