// investimentos.js - Simulação e gráficos de investimentos

// Importa metas do estado global para uso em simulações
import { metas } from './estado.js';

// Variáveis globais para armazenar instâncias dos gráficos de investimento
export let investmentChart = null; // Gráfico de evolução do investimento
export let portfolioChart = null;  // Gráfico de alocação de portfólio

// Função principal para calcular a simulação de investimento
// Lê valores do formulário, calcula o valor final, lucro e atualiza gráficos
export function calcularInvestimento() {
    // Captura valores do formulário de simulação
    const initialValue = parseFloat(document.getElementById('initialValue').value);
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value);
    const interestRateAnnual = parseFloat(document.getElementById('interestRate').value);
    const periodYears = parseInt(document.getElementById('period').value);
    if (isNaN(initialValue) || isNaN(monthlyContribution) || isNaN(interestRateAnnual) || isNaN(periodYears)) return;
    // Calcula taxa mensal e meses totais
    const monthlyRate = interestRateAnnual / 100 / 12;
    const months = periodYears * 12;
    // Fórmula de juros compostos para valor final
    const finalValue = initialValue * Math.pow(1 + monthlyRate, months) +
        monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    const investedTotal = initialValue + monthlyContribution * months;
    const profit = finalValue - investedTotal;
    const profitPercentage = ((profit / investedTotal) * 100).toFixed(1);
    // Atualiza valores na tela
    document.getElementById('totalReturn').textContent = 'R$ ' + finalValue.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
    document.getElementById('totalProfit').textContent = 'R$ ' + profit.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
    document.getElementById('profitPercentage').textContent = profitPercentage + '%';
    // Atualiza gráfico de evolução do investimento
    if (investmentChart) {
        const yearlyValues = [];
        for (let y = 1; y <= periodYears; y++) {
            const monthsY = y * 12;
            const valueY = initialValue * Math.pow(1 + monthlyRate, monthsY) +
                monthlyContribution * ((Math.pow(1 + monthlyRate, monthsY) - 1) / monthlyRate);
            yearlyValues.push(parseFloat(valueY.toFixed(2)));
        }
        investmentChart.data.labels = Array.from({ length: periodYears }, (_, i) => `Ano ${i + 1}`);
        investmentChart.data.datasets[0].data = yearlyValues;
        investmentChart.update();
    }
    // Atualiza gráfico de alocação de portfólio
    if (portfolioChart) {
        const investmentType = document.getElementById('investmentType').value;
        let fixed = 0, acoes = 0, fiis = 0, crypto = 0;
        // Distribuição simulada conforme tipo de investimento
        if (investmentType === 'cdb') {
            fixed = finalValue * 0.70;
            acoes = finalValue * 0.15;
            fiis = finalValue * 0.10;
            crypto = finalValue * 0.05;
        } else if (investmentType === 'lci') {
            fixed = finalValue * 0.75;
            acoes = finalValue * 0.10;
            fiis = finalValue * 0.10;
            crypto = finalValue * 0.05;
        } else if (investmentType === 'tesouro') {
            fixed = finalValue * 0.80;
            acoes = finalValue * 0.10;
            fiis = finalValue * 0.05;
            crypto = finalValue * 0.05;
        } else if (investmentType === 'poupanca') {
            fixed = finalValue * 0.90;
            acoes = finalValue * 0.05;
            fiis = finalValue * 0.03;
            crypto = finalValue * 0.02;
        } else if (investmentType === 'acoes') {
            fixed = finalValue * 0.30;
            acoes = finalValue * 0.50;
            fiis = finalValue * 0.10;
            crypto = finalValue * 0.10;
        } else if (investmentType === 'fiis') {
            fixed = finalValue * 0.40;
            acoes = finalValue * 0.30;
            fiis = finalValue * 0.20;
            crypto = finalValue * 0.10;
        } else if (investmentType === 'cripto') {
            fixed = finalValue * 0.05;
            acoes = finalValue * 0.05;
            fiis = finalValue * 0.05;
            crypto = finalValue * 0.85;
        }
        portfolioChart.data.datasets[0].data = [
            parseFloat(fixed.toFixed(2)),
            parseFloat(acoes.toFixed(2)),
            parseFloat(fiis.toFixed(2)),
            parseFloat(crypto.toFixed(2))
        ];
        portfolioChart.update();
    }
}

// Inicializa os gráficos de linha e pizza usando Chart.js
// Configura eventos para recalcular ao alterar inputs
export function initGraficos() {
    const ctx1 = document.getElementById('investmentChart').getContext('2d');
    investmentChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['Ano 1', 'Ano 2', 'Ano 3', 'Ano 4', 'Ano 5'],
            datasets: [
                {
                    label: 'Valor do Investimento',
                    data: [16800, 25536, 35901, 47909, 61680],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Valor Investido',
                    data: [16000, 22000, 28000, 34000, 40000],
                    borderColor: '#00d4aa',
                    backgroundColor: 'rgba(0, 212, 170, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff',
                        usePointStyle: true
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#ffffff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    ticks: {
                        color: '#ffffff',
                        callback: function(value) {
                            return 'R$ ' + value.toLocaleString('pt-BR');
                        }
                    },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
    const ctx2 = document.getElementById('portfolioChart').getContext('2d');
    portfolioChart = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: ['Renda Fixa', 'Ações', 'FIIs', 'Criptomoedas'],
            datasets: [{
                data: [45, 30, 15, 10],
                backgroundColor: [
                    '#667eea',
                    '#764ba2',
                    '#00d4aa',
                    '#ff6b6b'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        usePointStyle: true,
                        padding: 15,
                        font: { size: 11 }
                    }
                }
            }
        }
    });
    // Adiciona listeners para recalcular simulação ao alterar qualquer input relevante
    document.querySelectorAll('#initialValue, #monthlyContribution, #interestRate, #period, #investmentType')
        .forEach(input => input.addEventListener('change', calcularInvestimento));
}
