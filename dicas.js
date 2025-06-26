// dicas.js - Funções utilitárias e manipulação de dicas financeiras

// Função para salvar o objeto de dicas no localStorage
function salvarDicas() {
    // Serializa o objeto dicas e salva no armazenamento local do navegador
    localStorage.setItem('dicas', JSON.stringify(dicas));
}

// Função para carregar dicas do localStorage, se houver
function carregarDicas() {
    const dicasLS = localStorage.getItem('dicas');
    if (dicasLS) {
        try {
            dicas = JSON.parse(dicasLS); // Tenta restaurar dicas salvas
        } catch (e) {
            // Se houver erro, remove o dado corrompido e restaura padrão
            localStorage.removeItem('dicas');
            dicas = {
                "Juros": [
                    { id: 1, titulo: "Entenda a Taxa de Juros", descricao: "A taxa de juros influencia diretamente no custo do crédito e no retorno dos investimentos." },
                    { id: 2, titulo: "Como a Selic Afeta os Juros", descricao: "Entenda como a taxa Selic impacta os juros no Brasil e o mercado financeiro." },
                    { id: 3, titulo: "Juros Compostos", descricao: "Os juros compostos fazem o seu dinheiro crescer mais rapidamente ao longo do tempo." }
                ],
                "Criptomoedas": [
                    { id: 4, titulo: "O que são Criptomoedas?", descricao: "Criptomoedas são moedas digitais que operam em uma rede descentralizada de blockchain." },
                    { id: 5, titulo: "Investir em Criptomoedas com Segurança", descricao: "Investir com segurança requer cuidados na escolha da corretora e proteção das chaves privadas." },
                    { id: 6, titulo: "Bitcoin e Ethereum: Principais Criptomoedas", descricao: "Bitcoin e Ethereum são as duas criptomoedas mais populares e com maior capitalização de mercado." }
                ],
                "Tesouro Direto": [
                    { id: 7, titulo: "O que é Tesouro Direto?", descricao: "Tesouro Direto é uma forma de investimento onde você compra títulos do governo federal." },
                    { id: 8, titulo: "Como Investir no Tesouro Direto?", descricao: "Investir no Tesouro Direto é simples e oferece segurança, sendo uma ótima opção para iniciantes." },
                    { id: 9, titulo: "Tesouro Direto x Poupança", descricao: "O Tesouro Direto costuma ser uma opção mais vantajosa do que a poupança devido aos seus rendimentos." }
                ],
                "Investimentos": [
                    { id: 10, titulo: "Diversificação de Investimentos", descricao: "Diversificar seus investimentos ajuda a reduzir os riscos e maximizar os retornos." },
                    { id: 11, titulo: "Como Escolher um Investimento?", descricao: "Escolher o investimento certo depende do seu perfil de risco e dos seus objetivos financeiros." },
                    { id: 12, titulo: "Renda Fixa vs Renda Variável", descricao: "Entenda a diferença entre a renda fixa e a variável, e como cada uma pode se encaixar no seu portfólio." }
                ]
            };
            alert("Houve um problema ao carregar as dicas salvas. O armazenamento foi limpo.");
        }
    }
}

// Estado global para as dicas financeiras organizadas por categoria
let dicas = {
    "Juros": [
        { id: 1, titulo: "Entenda a Taxa de Juros", descricao: "A taxa de juros influencia diretamente no custo do crédito e no retorno dos investimentos." },
        { id: 2, titulo: "Como a Selic Afeta os Juros", descricao: "Entenda como a taxa Selic impacta os juros no Brasil e o mercado financeiro." },
        { id: 3, titulo: "Juros Compostos", descricao: "Os juros compostos fazem o seu dinheiro crescer mais rapidamente ao longo do tempo." }
    ],
    "Criptomoedas": [
        { id: 4, titulo: "O que são Criptomoedas?", descricao: "Criptomoedas são moedas digitais que operam em uma rede descentralizada de blockchain." },
        { id: 5, titulo: "Investir em Criptomoedas com Segurança", descricao: "Investir com segurança requer cuidados na escolha da corretora e proteção das chaves privadas." },
        { id: 6, titulo: "Bitcoin e Ethereum: Principais Criptomoedas", descricao: "Bitcoin e Ethereum são as duas criptomoedas mais populares e com maior capitalização de mercado." }
    ],
    "Tesouro Direto": [
        { id: 7, titulo: "O que é Tesouro Direto?", descricao: "Tesouro Direto é uma forma de investimento onde você compra títulos do governo federal." },
        { id: 8, titulo: "Como Investir no Tesouro Direto?", descricao: "Investir no Tesouro Direto é simples e oferece segurança, sendo uma ótima opção para iniciantes." },
        { id: 9, titulo: "Tesouro Direto x Poupança", descricao: "O Tesouro Direto costuma ser uma opção mais vantajosa do que a poupança devido aos seus rendimentos." }
    ],
    "Investimentos": [
        { id: 10, titulo: "Diversificação de Investimentos", descricao: "Diversificar seus investimentos ajuda a reduzir os riscos e maximizar os retornos." },
        { id: 11, titulo: "Como Escolher um Investimento?", descricao: "Escolher o investimento certo depende do seu perfil de risco e dos seus objetivos financeiros." },
        { id: 12, titulo: "Renda Fixa vs Renda Variável", descricao: "Entenda a diferença entre a renda fixa e a variável, e como cada uma pode se encaixar no seu portfólio." }
    ]
};

// Função para renderizar as dicas na tela, filtrando por categoria se necessário
function renderDicas(categoria = 'todos') {
    const container = document.getElementById("tips-container");
    container.innerHTML = ""; // Limpa o conteúdo anterior
    let dicasExibidas = [];
    if (categoria === 'todos') {
        // Exibe 3 dicas por categoria
        Object.keys(dicas).forEach(categoria => {
            dicasExibidas = dicasExibidas.concat(dicas[categoria].slice(0, 3));
        });
    } else if (dicas[categoria]) {
        // Exibe 3 dicas da categoria selecionada
        dicasExibidas = dicas[categoria].slice(0, 3);
    }
    if (dicasExibidas.length === 0) {
        container.innerHTML = '<p class="text-muted">Nenhuma dica encontrada para esta categoria.</p>';
    }
    dicasExibidas.forEach(dica => {
        // Cria um card visual para cada dica
        const card = document.createElement("div");
        card.className = "dicas-card bg-white p-4 rounded-lg shadow-md hover:shadow-lg";
        card.innerHTML = `
            <h5 class="text-lg font-semibold dicas-titulo">${dica.titulo}</h5>
            <p class="text-gray-700">${dica.descricao}</p>
            <button class="btn btn-danger text-white mt-3" onclick="excluirDica(${dica.id})">Excluir</button>
            <button class="btn btn-primary text-white mt-3 ml-2" onclick="editarDica(${dica.id})">Editar</button>
        `;
        container.appendChild(card);
    });
    salvarDicas(); // Atualiza localStorage
}

// Função para excluir uma dica por id
function excluirDica(id) {
    // Remove a dica do estado global em todas as categorias
    Object.keys(dicas).forEach(categoria => {
        dicas[categoria] = dicas[categoria].filter(dica => dica.id !== id);
    });
    salvarDicas();
    renderDicas();
}

// Função para adicionar uma nova dica
function adicionarDica(titulo, categoria, descricao) {
    const novaDica = {
        id: Date.now(), // Gera id único
        titulo,
        descricao
    };
    if (!dicas[categoria]) {
        dicas[categoria] = [];
    }
    // Adiciona a nova dica no início do array
    dicas[categoria].unshift(novaDica);
    salvarDicas();
    renderDicas(); // Atualiza a lista de dicas
}

// Função para capturar dados do formulário e adicionar a dica
const formAddDica = document.getElementById("form-add-tip");
formAddDica.addEventListener("submit", function(e) {
    e.preventDefault();
    const titulo = document.getElementById("input-title").value.trim();
    const categoria = document.getElementById("input-category").value.trim();
    const descricao = document.getElementById("input-text").value.trim();
    if (!titulo || !categoria || !descricao) {
        alert("Todos os campos são obrigatórios.");
        return;
    }
    // Se NÃO estivermos editando, adiciona uma nova dica
    if (!formAddDica.dataset.editando) {
        adicionarDica(titulo, categoria, descricao);
        formAddDica.reset();  // Limpa o formulário
    }
});

// Listener para atualizar a dica (botão Atualizar)
const btnAtualizar = document.getElementById("btn-atualizar");
btnAtualizar.addEventListener("click", function(e) {
    e.preventDefault();
    // Obtém os valores dos inputs
    const titulo = document.getElementById("input-title").value.trim();
    const categoria = document.getElementById("input-category").value.trim();
    const descricao = document.getElementById("input-text").value.trim();
    if (!titulo || !categoria || !descricao) {
        alert("Todos os campos são obrigatórios.");
        return;
    }
    // Somente atualiza se estivermos no modo de edição
    if (formAddDica.dataset.editando) {
        atualizarDica(formAddDica.dataset.editando, titulo, categoria, descricao);
        formAddDica.reset();
    }
});

// Função para editar uma dica existente
function editarDica(id) {
    let dicaParaEditar = null;
    let categoriaOriginal = null;
    Object.keys(dicas).forEach(categoria => {
        const dica = dicas[categoria].find(dica => dica.id === id);
        if (dica) {
            dicaParaEditar = dica;
            categoriaOriginal = categoria;
        }
    });
    if (dicaParaEditar) {
        // Preenche o formulário com os dados da dica
        document.getElementById("input-title").value = dicaParaEditar.titulo;
        document.getElementById("input-category").value = categoriaOriginal;
        document.getElementById("input-text").value = dicaParaEditar.descricao;
        const atualizarBtn = document.getElementById("btn-atualizar");
        atualizarBtn.style.display = 'inline-block';
        formAddDica.dataset.editando = id;
        formAddDica.dataset.categoriaOriginal = categoriaOriginal; // Salva a categoria original
    }
}

// Função para atualizar uma dica existente, podendo inclusive trocar de categoria
function atualizarDica(id, titulo, categoria, descricao) {
    const categoriaOriginal = formAddDica.dataset.categoriaOriginal;
    // Se o campo de categoria estiver vazio ou igual à original, usamos a categoria original
    const novaCategoria = categoria.trim() ? categoria : categoriaOriginal;
    id = Number(id);
    if (categoriaOriginal === novaCategoria) {
        // Atualiza em linha sem reposicionar a dica
        const index = dicas[categoriaOriginal].findIndex(dica => dica.id === id);
        if (index !== -1) {
            dicas[categoriaOriginal][index].titulo = titulo;
            dicas[categoriaOriginal][index].descricao = descricao;
        }
    } else {
        // Muda a dica de categoria: remove da antiga e adiciona na nova
        const index = dicas[categoriaOriginal].findIndex(dica => dica.id === id);
        if (index !== -1) {
            const [dicaMovida] = dicas[categoriaOriginal].splice(index, 1);
            dicaMovida.titulo = titulo;
            dicaMovida.descricao = descricao;
            if (!dicas[novaCategoria]) {
                dicas[novaCategoria] = [];
            }
            dicas[novaCategoria].unshift(dicaMovida);
        }
    }
    salvarDicas();
    renderDicas();
    document.getElementById("btn-atualizar").style.display = 'none';
    delete formAddDica.dataset.editando;
    delete formAddDica.dataset.categoriaOriginal;
}

// Filtro de categorias para visualizar as dicas específicas
const categoryButtons = document.querySelectorAll(".category-btn");
categoryButtons.forEach(button => {
    button.addEventListener("click", function() {
        categoryButtons.forEach(b => b.classList.remove("active"));
        this.classList.add("active");
        const categoria = this.dataset.category;
        renderDicas(categoria);  // Filtra as dicas pela categoria selecionada
    });
});

// Inicialização ao carregar a página
// Carrega dicas do localStorage e renderiza na tela
document.addEventListener("DOMContentLoaded", function() {
    carregarDicas();
    renderDicas();  // Exibe todas as dicas quando a página for carregada
});