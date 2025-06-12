// Lógica para trilha de aprendizado, quizzes e progresso educativo

const trilha = [
  {
    id: 1,
    titulo: 'Introdução à Educação Financeira',
    conteudo: 'Entenda os conceitos básicos de finanças pessoais, orçamento, metas e investimentos.',
    quiz: {
      pergunta: 'O que é orçamento?',
      opcoes: [
        'Um tipo de investimento',
        'Um planejamento de receitas e despesas',
        'Uma conta bancária',
        'Um cartão de crédito'
      ],
      resposta: 1
    }
  },
  {
    id: 2,
    titulo: 'Renda Fixa',
    conteudo: 'Descubra como funcionam CDB, LCI/LCA, Tesouro Direto e outros investimentos de renda fixa.',
    quiz: {
      pergunta: 'Qual investimento é garantido pelo FGC?',
      opcoes: [
        'Ações',
        'CDB',
        'FIIs',
        'Criptomoedas'
      ],
      resposta: 1
    }
  },
  {
    id: 3,
    titulo: 'Renda Variável',
    conteudo: 'Aprenda sobre ações, FIIs, ETFs e o potencial de retorno e risco desses ativos.',
    quiz: {
      pergunta: 'O que caracteriza a renda variável?',
      opcoes: [
        'Rentabilidade previsível',
        'Risco e retorno variáveis',
        'Garantia do governo',
        'Liquidez diária garantida'
      ],
      resposta: 1
    }
  },
  {
    id: 4,
    titulo: 'Diversificação',
    conteudo: 'Saiba como montar uma carteira equilibrada e reduzir riscos diversificando seus investimentos.',
    quiz: {
      pergunta: 'Por que diversificar investimentos?',
      opcoes: [
        'Para aumentar o risco',
        'Para reduzir o risco',
        'Para pagar mais impostos',
        'Para ganhar menos'
      ],
      resposta: 1
    }
  }
];

let progressoTrilha = 0;

function renderTrilhaEducacional() {
  const trilhaDiv = document.getElementById('trilha-educacional');
  trilhaDiv.innerHTML = '';
  trilha.forEach((etapa, idx) => {
    const concluido = idx < progressoTrilha;
    const atual = idx === progressoTrilha;
    trilhaDiv.innerHTML += `
      <div class="mb-6 p-4 rounded-xl shadow-lg bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-700 flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${concluido ? 'bg-green-500' : atual ? 'bg-yellow-400 text-black' : 'bg-gray-600'}">
            ${concluido ? '✔' : idx + 1}
          </div>
          <div class="font-semibold text-lg">${etapa.titulo}</div>
        </div>
        <div class="text-sm text-blue-100">${etapa.conteudo}</div>
        <div class="w-full h-2 bg-blue-800 rounded-full overflow-hidden my-2">
          <div class="h-full rounded-full ${concluido ? 'bg-green-400' : atual ? 'bg-yellow-400' : 'bg-gray-500'}" style="width: ${(concluido ? 100 : atual ? 50 : 0)}%"></div>
        </div>
        ${atual ? renderQuiz(etapa.quiz, idx) : ''}
      </div>
    `;
  });
}

function renderQuiz(quiz, idx) {
  let opcoes = '';
  quiz.opcoes.forEach((op, i) => {
    opcoes += `<button class="block w-full text-left px-4 py-2 my-1 rounded-lg bg-blue-700 hover:bg-blue-600 text-white quiz-opcao" data-idx="${i}" data-etapa="${idx}">${op}</button>`;
  });
  return `
    <div class="mt-2">
      <div class="font-semibold mb-2">Quiz: ${quiz.pergunta}</div>
      <div>${opcoes}</div>
      <div id="quiz-feedback" class="mt-2 text-sm font-bold"></div>
    </div>
  `;
}

function handleQuizClick(e) {
  if (!e.target.classList.contains('quiz-opcao')) return;
  const etapaIdx = parseInt(e.target.getAttribute('data-etapa'));
  const opcaoIdx = parseInt(e.target.getAttribute('data-idx'));
  const etapa = trilha[etapaIdx];
  const feedback = document.getElementById('quiz-feedback');
  if (opcaoIdx === etapa.quiz.resposta) {
    feedback.textContent = 'Correto!';
    feedback.className = 'mt-2 text-green-400 font-bold';
    setTimeout(() => {
      progressoTrilha++;
      if (progressoTrilha >= trilha.length) progressoTrilha = trilha.length;
      renderTrilhaEducacional();
    }, 1000);
  } else {
    feedback.textContent = 'Tente novamente!';
    feedback.className = 'mt-2 text-red-400 font-bold';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const trilhaDiv = document.getElementById('trilha-educacional');
  if (trilhaDiv) {
    renderTrilhaEducacional();
    trilhaDiv.addEventListener('click', handleQuizClick);
  }
});
