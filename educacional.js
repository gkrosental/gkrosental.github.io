// educacional.js - Lógica da trilha educacional interativa
// Usa window.modulos para acessar os módulos e perguntas
let modulosGlobal = window.modulos;
const TOTAL_MODULOS = modulosGlobal.length; // Total de módulos disponíveis
const PERGUNTAS_POR_MODULO = modulosGlobal[0].perguntas.length; // Perguntas por módulo

// Variáveis de progresso do usuário
let progressoModulo = 0; // Índice do módulo atual
let progressoPergunta = 0; // Índice da pergunta atual
let modulosConcluidos = 0; // Contador de módulos concluídos

// Renderiza o módulo educacional atual, incluindo barra de progresso e perguntas
function renderModuloEducacional() {
  const trilhaDiv = document.getElementById('trilha-educacional');
  trilhaDiv.innerHTML = '';
  const moduloAtual = modulosGlobal[progressoModulo];
  const perguntasModulo = moduloAtual.perguntas;

  // Barra de progresso superior, mostra avanço entre módulos
  trilhaDiv.innerHTML += `
    <div class="w-full flex items-center mb-6">
      <div class="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
        <div class="h-full transition-all duration-700" style="width: ${(progressoModulo / (modulos.length - 1)) * 100}%; background: linear-gradient(90deg, #22d3ee, #4ade80 80%);"></div>
      </div>
      <span class="ml-3 text-sm text-blue-200 font-bold">Módulo ${progressoModulo + 1} / ${modulosGlobal.length}</span>
    </div>
    <div class="mb-2 text-xl font-bold text-white">${moduloAtual.titulo}</div>
    <div class="mb-6 text-blue-200">${moduloAtual.descricao}</div>
  `;

  // Calcula altura da barra lateral para cobrir todos os cards de perguntas
  const cardHeight = 120; // Altura estimada de cada card
  const lateralHeight = perguntasModulo.length * cardHeight + 32; // Espaço extra

  trilhaDiv.innerHTML += `
    <div class="flex gap-12">
      <div class="flex flex-col items-center justify-center relative" style="min-width: 32px; height: ${lateralHeight}px;">
        <div class="absolute left-1/2 top-0 -translate-x-1/2 w-2 bg-gray-700 rounded-full" style="height: 100%; z-index:0;"></div>
        ${Array.from({length: perguntasModulo.length}).map((_,i) => `
          <div class="w-8 h-8 mb-6 z-10 rounded-full flex items-center justify-center font-bold text-white transition-all duration-700 ${i < progressoPergunta ? 'bg-green-500 scale-110' : i === progressoPergunta ? 'bg-yellow-400 text-black scale-105' : 'bg-gray-600'}">
            ${i < progressoPergunta ? '\u2714' : i+1}
          </div>
        `).join('')}
      </div>
      <div class="flex-1">
        ${perguntasModulo.map((etapa, idx) => {
          const concluido = idx < progressoPergunta;
          const atual = idx === progressoPergunta;
          return `
            <div class="mb-8 p-4 rounded-xl shadow-lg bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-700 flex flex-col gap-2 ${!atual && !concluido ? 'opacity-50' : ''}" id="card-pergunta-${idx}">
              <div class="flex items-center gap-2 justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${concluido ? 'bg-green-500' : atual ? 'bg-yellow-400 text-black' : 'bg-gray-600'}">
                    ${concluido ? '\u2714' : idx + 1}
                  </div>
                  <div class="font-semibold text-lg">${etapa.enunciado}</div>
                </div>
                <div id="explicacao-btn-container-${idx}" class="ml-2 flex items-center"></div>
              </div>
              <div class="w-full h-2 bg-blue-800 rounded-full overflow-hidden my-2">
                <div class="h-full rounded-full ${concluido ? 'bg-green-400' : atual ? 'bg-yellow-400' : 'bg-gray-500'}" style="width: ${(concluido ? 100 : atual ? 50 : 0)}%"></div>
              </div>
              ${atual ? renderQuiz(etapa, idx) : ''}
              ${concluido ? `<div class='mt-4 text-blue-200 text-base'>${etapa.explicacao}</div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Barra de progresso inferior
  trilhaDiv.innerHTML += `
    <div class="w-full flex items-center mt-6">
      <div class="flex-1 h-3 bg-gray-700 rounded-full overflow-hidden">
        <div class="h-full transition-all duration-700" style="width: ${(progressoModulo / (modulos.length - 1)) * 100}%; background: linear-gradient(90deg, #22d3ee, #4ade80 80%);"></div>
      </div>
      <span class="ml-3 text-sm text-blue-200 font-bold">Módulo ${progressoModulo + 1} / ${modulosGlobal.length}</span>
    </div>
  `;

  // Mensagem de módulo concluído
  if (progressoPergunta >= perguntasModulo.length) {
    trilhaDiv.innerHTML += `
      <div class="flex flex-col items-center justify-center mt-8 mb-8">
        <div class="p-8 rounded-2xl shadow-2xl bg-gradient-to-br from-green-400/90 via-emerald-500/90 to-blue-400/90 border-2 border-green-300 text-center text-2xl font-bold text-white max-w-xl w-full">
          <span class="block mb-2">Módulo ${progressoModulo + 1} concluído! 🎉</span>
          <span class="block text-lg font-medium">Continue para o próximo módulo para avançar na sua jornada financeira!</span>
        </div>
        ${progressoModulo + 1 < modulosGlobal.length ? `<button id="btn-proximo-modulo" class="btn bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold text-lg px-8 py-3 rounded-xl mt-6 shadow-lg transition">Próximo Módulo</button>` : `<div class="p-6 bg-gradient-to-br from-blue-800 via-blue-600 to-green-400 text-white rounded-xl text-center text-xl font-bold shadow-lg mt-6">Parabéns! Você concluiu toda a trilha de aprendizado financeiro! 🏆</div>`}
      </div>
    `;
  }
}

// Renderiza o quiz da etapa atual
function renderQuiz(quiz, idx) {
  let opcoes = '';
  quiz.opcoes.forEach((op, i) => {
    opcoes += `<button class="block w-full text-left px-4 py-2 my-1 rounded-lg bg-blue-700 hover:bg-blue-600 text-white quiz-opcao" data-idx="${i}" data-etapa="${idx}">${op}</button>`;
  });
  return `
    <div class="mt-2">
      <div id="quiz-feedback-${idx}" class="mt-2 text-sm font-bold"></div>
      <div>${opcoes}</div>
    </div>
  `;
}

// Handler para clique nas opções do quiz
// Verifica se a resposta está correta, mostra feedback e avança o progresso
function handleQuizClick(e) {
  if (!e.target.classList.contains('quiz-opcao')) return;
  const etapaIdx = parseInt(e.target.getAttribute('data-etapa'));
  const opcaoIdx = parseInt(e.target.getAttribute('data-idx'));
  const idxPergunta = etapaIdx;
  const pergunta = modulosGlobal[progressoModulo].perguntas[idxPergunta];
  const feedback = document.querySelector(`#quiz-feedback-${etapaIdx}`);
  if (opcaoIdx === pergunta.resposta) {
    if (feedback) {
      feedback.textContent = 'Correto!';
      feedback.className = 'mt-2 text-green-400 font-bold';
    }
    setTimeout(() => {
      progressoPergunta++;
      renderModuloEducacional();
    }, 1000);
  } else {
    if (feedback) {
      feedback.textContent = 'Tente novamente!';
      feedback.className = 'mt-2 text-red-400 font-bold';
    }
  }
}

// Handler para avançar para o próximo módulo
function handleProximoModulo(e) {
  if (e.target.id === 'btn-proximo-modulo') {
    progressoModulo++;
    progressoPergunta = 0;
    renderModuloEducacional();
    // Scroll para a primeira pergunta do novo módulo
    setTimeout(() => {
      const card = document.getElementById('card-pergunta-0');
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        // Centraliza no topo da viewport
        window.scrollTo({
          top: card.getBoundingClientRect().top + window.scrollY - 40,
          behavior: 'smooth'
        });
      }
    }, 100);
  }
}

// Inicialização automática ao carregar a página
// Renderiza o módulo e adiciona os handlers

document.addEventListener('DOMContentLoaded', () => {
  const trilhaDiv = document.getElementById('trilha-educacional');
  if (trilhaDiv) {
    renderModuloEducacional();
    trilhaDiv.addEventListener('click', handleQuizClick);
    trilhaDiv.addEventListener('click', handleProximoModulo);
  }
});
