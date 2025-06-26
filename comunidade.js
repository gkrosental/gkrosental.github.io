// comunidade.js - Feed de Comunidade Financeira

// Estado global para os posts da comunidade, agrupados por categoria
let posts = {};

// Carrega posts de exemplo do arquivo posts.json (usado para popular o feed inicialmente)
async function carregarPostsExemplo() {
    try {
        const response = await fetch('posts.json');
        if (!response.ok) throw new Error('Erro ao carregar posts.json');
        const exemplos = await response.json();
        return exemplos;
    } catch (e) {
        console.error('Erro ao carregar posts de exemplo:', e);
        return {};
    }
}

// Carrega posts do localStorage ou dos exemplos
async function carregarPosts() {
    const postsLS = localStorage.getItem('communityPosts');
    let exemplos = await carregarPostsExemplo();
    if (postsLS) {
        try {
            const salvos = JSON.parse(postsLS);
            // Faz merge dos exemplos do JSON com os do localStorage, sem duplicar ids
            Object.keys(exemplos).forEach(categoria => {
                if (!salvos[categoria]) salvos[categoria] = [];
                exemplos[categoria].forEach(exemplo => {
                    if (!salvos[categoria].some(p => p.id === exemplo.id)) {
                        salvos[categoria].push(exemplo);
                    }
                });
            });
            posts = salvos;
        } catch (e) {
            localStorage.removeItem('communityPosts');
            alert("Houve um problema ao carregar os posts. O armazenamento foi limpo e exemplos restaurados.");
            posts = exemplos;
        }
    } else {
        posts = exemplos;
    }
}

// Estado global de favoritos (posts marcados pelo usuário)
let favoritos = JSON.parse(localStorage.getItem('communityFavoritos') || '{}');

// Salva posts no localStorage
function salvarPosts() {
    localStorage.setItem('communityPosts', JSON.stringify(posts));
}
// Salva favoritos no localStorage
function salvarFavoritos() {
    localStorage.setItem('communityFavoritos', JSON.stringify(favoritos));
}

// Renderiza posts no feed principal, filtrando por categoria
function renderizarPosts(categoria = 'todos') {
    const feedContainer = document.getElementById("community-feed");
    feedContainer.innerHTML = "";
    let postsExibidos = [];
    if (categoria === 'todos') {
        Object.keys(posts).forEach(cat => {
            postsExibidos = postsExibidos.concat(posts[cat]);
        });
    } else if (posts[categoria]) {
        postsExibidos = posts[categoria];
    }
    // Ordena por data (mais recentes primeiro)
    postsExibidos.sort((a, b) => new Date(b.data) - new Date(a.data));
    if (postsExibidos.length === 0) {
        feedContainer.innerHTML = `
            <div class="empty-state text-center py-10 text-gray-500">
                <i class="fas fa-comment-slash text-4xl mb-3"></i>
                <p>Nenhum post encontrado nesta categoria</p>
            </div>
        `;
        return;
    }
    postsExibidos.forEach(post => {
        const postElement = criarPostElement(post);
        feedContainer.appendChild(postElement);
    });
}

// Cria o elemento HTML de um post para o feed
function criarPostElement(post) {
    const postElement = document.createElement("div");
    postElement.className = "post-card bg-gray-800 rounded-xl p-5 shadow-lg border border-gray-700 hover:border-purple-500 transition-colors";
    postElement.dataset.postId = post.id;
    postElement.innerHTML = `
        <div class="post-header flex justify-between items-start mb-4">
            <div class="post-user flex items-center gap-3">
                <img src="${post.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.autor)}&background=8b5cf6&color=fff`}" 
                     alt="${post.autor}" class="w-14 h-14 rounded-2xl object-cover">
                <div>
                    <h4 class="font-semibold">${post.autor} <span class='text-xs text-gray-400 ml-1'>${post.usuario || ''}</span></h4>
                    <p class="text-xs text-gray-400">${formatarData(post.data)}</p>
                </div>
            </div>
            <span class="text-xs px-2 py-1 rounded-full bg-purple-900 text-purple-300">${Object.keys(posts).find(cat => posts[cat].some(p => p.id === post.id))}</span>
        </div>
        <div class="post-content mb-4">
            ${post.titulo ? `<h3 class="text-lg font-bold mb-2 text-purple-300">${post.titulo}</h3>` : ''}
            <p class="text-gray-300">${post.conteudo}</p>
            ${post.midia ? `<img src="${post.midia}" class="post-image rounded-2xl w-full max-h-80 object-cover mt-2 mb-2" alt="Mídia do post" />` : ''}
            ${post.tags && post.tags.length > 0 ? `
                <div class="post-tags flex flex-wrap gap-2 mt-3">
                    ${post.tags.map(tag => `<span class="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">#${tag}</span>`).join('')}
                </div>
            ` : ''}
        </div>
        <div class="post-footer pt-3 border-t border-gray-700 flex justify-between items-center">
            <div class="post-stats flex gap-4">
                <button class="post-stat flex items-center gap-1 text-gray-400 hover:text-purple-400" onclick="curtirPost(${post.id})">
                    <i class="fas fa-heart${post.curtido ? ' text-purple-400' : ''}"></i> ${post.curtidas || 0}
                </button>
                <button class="post-stat flex items-center gap-1 text-gray-400 hover:text-blue-400" onclick="abrirComentarios(${post.id})">
                    <i class="fas fa-comment"></i> ${post.comentarios || 0}
                </button>
                <button class="post-stat flex items-center gap-1 text-gray-400 hover:text-green-400" onclick="compartilharPost(${post.id})">
                    <i class="fas fa-share"></i>
                </button>
            </div>
            <div class="post-actions flex gap-3">
                <button class="text-gray-400 hover:text-yellow-400${favoritos[post.id] ? ' text-yellow-400' : ''}" onclick="favoritarPost(${post.id})">
                    <i class="fas fa-bookmark"></i>
                </button>
                ${post.autor === "Carlos Silva" ? `
                    <button class="text-gray-400 hover:text-blue-400" onclick="editarPost(${post.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-gray-400 hover:text-red-400" onclick="excluirPost(${post.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </div>
        </div>
        <div class="post-comments mt-3 hidden" id="comments-${post.id}"></div>
    `;
    return postElement;
}

// Funções de interação: curtir, favoritar, compartilhar, comentar, editar, excluir
function curtirPost(id) {
    Object.keys(posts).forEach(categoria => {
        const postIndex = posts[categoria].findIndex(p => p.id === id);
        if (postIndex !== -1) {
            if (!posts[categoria][postIndex].curtidas) {
                posts[categoria][postIndex].curtidas = 0;
            }
            if (!posts[categoria][postIndex].curtido) {
                posts[categoria][postIndex].curtidas++;
                posts[categoria][postIndex].curtido = true;
            } else {
                posts[categoria][postIndex].curtidas--;
                posts[categoria][postIndex].curtido = false;
            }
            salvarPosts();
            atualizarPostUI(id);
        }
    });
}

function favoritarPost(id) {
    favoritos[id] = !favoritos[id];
    salvarFavoritos();
    atualizarPostUI(id);
}

function compartilharPost(id) {
    // Reposta o post no topo do feed, com indicação de repost
    const post = encontrarPostPorId(id);
    if (post) {
        const repost = { ...post };
        repost.id = Date.now();
        repost.autor = 'Usuário';
        repost.usuario = '@usuario';
        repost.foto = "https://randomuser.me/api/portraits/lego/2.jpg";
        repost.data = new Date().toISOString();
        repost.titulo = `[Repost] ${post.titulo}`;
        if (!posts["Investimentos"]) posts["Investimentos"] = [];
        posts["Investimentos"].unshift(repost);
        salvarPosts();
        renderizarPosts();
    }
}

function abrirComentarios(id) {
    const commentsDiv = document.getElementById(`comments-${id}`);
    if (!commentsDiv) return;
    if (commentsDiv.classList.contains('hidden')) {
        commentsDiv.classList.remove('hidden');
        renderizarComentarios(id);
    } else {
        commentsDiv.classList.add('hidden');
    }
}

// Renderiza comentários de um post
function renderizarComentarios(id) {
    const commentsDiv = document.getElementById(`comments-${id}`);
    if (!commentsDiv) return;
    let comentarios = JSON.parse(localStorage.getItem('communityComments') || '{}');
    const lista = comentarios[id] || [];
    commentsDiv.innerHTML = `
        <div class="bg-gray-900 rounded-lg p-3 mt-2">
            <div class="mb-2 font-semibold text-blue-200">Comentários</div>
            <div class="space-y-2 mb-2">
                ${lista.map(c => `<div class='text-gray-200 text-sm'><b>${c.autor}</b>: ${c.texto}</div>`).join('') || '<span class="text-gray-400">Nenhum comentário ainda.</span>'}
            </div>
            <form onsubmit="adicionarComentario(event, ${id})" class="flex gap-2 mt-2">
                <input type="text" class="flex-1 rounded bg-gray-800 border border-gray-700 text-white px-2 py-1 text-sm" placeholder="Comente algo..." required />
                <button class="btn bg-blue-600 text-white px-3 py-1 rounded" type="submit">Enviar</button>
            </form>
        </div>
    `;
}

// Handler global para adicionar comentário
window.adicionarComentario = function(event, id) {
    event.preventDefault();
    let comentarios = JSON.parse(localStorage.getItem('communityComments') || '{}');
    const form = event.target;
    const input = form.querySelector('input');
    const texto = input.value.trim();
    if (!texto) return;
    if (!comentarios[id]) comentarios[id] = [];
    comentarios[id].push({ autor: 'Usuário', texto });
    localStorage.setItem('communityComments', JSON.stringify(comentarios));
    input.value = '';
    renderizarComentarios(id);
}

function editarPost(id) {
    const post = encontrarPostPorId(id);
    if (post) {
        document.querySelector(".post-input-field").value = post.titulo ? `${post.titulo}\n\n${post.conteudo}` : post.conteudo;
        // Implementar lógica de edição completa
    }
}

function excluirPost(id) {
    if (confirm("Tem certeza que deseja excluir este post?")) {
        Object.keys(posts).forEach(categoria => {
            posts[categoria] = posts[categoria].filter(p => p.id !== id);
        });
        salvarPosts();
        renderizarPosts();
    }
}

// Funções utilitárias para busca e formatação
function encontrarPostPorId(id) {
    for (const categoria in posts) {
        const post = posts[categoria].find(p => p.id === id);
        if (post) return post;
    }
    return null;
}

function formatarData(dataString) {
    const data = new Date(dataString);
    const agora = new Date();
    const diff = Math.floor((agora - data) / (1000 * 60)); // diferença em minutos
    if (diff < 1) return "Agora mesmo";
    if (diff < 60) return `${diff} min atrás`;
    if (diff < 1440) return `${Math.floor(diff/60)} h atrás`;
    return data.toLocaleDateString('pt-BR');
}

// Atualiza visualmente o post após curtir/favoritar
function atualizarPostUI(id) {
    const postElement = document.querySelector(`.post-card[data-post-id="${id}"]`);
    if (postElement) {
        const post = encontrarPostPorId(id);
        if (post) {
            const likeElement = postElement.querySelector('.post-stat:first-child');
            likeElement.innerHTML = `<i class="fas fa-heart${post.curtido ? ' text-purple-400' : ''}"></i> ${post.curtidas || 0}`;
            if (post.curtido) likeElement.classList.add('text-purple-400'); else likeElement.classList.remove('text-purple-400');
            const favBtn = postElement.querySelector('.text-gray-400.hover\:text-yellow-400, .text-yellow-400');
            if (favBtn) {
                if (favoritos[id]) {
                    favBtn.classList.add('text-yellow-400');
                } else {
                    favBtn.classList.remove('text-yellow-400');
                }
            }
        }
    }
}

// Contatos e mensagens simuladas para a sidebar
const contatosExemplo = [
    { nome: "Juliana Souza", usuario: "@jufinancas", foto: "https://randomuser.me/api/portraits/women/68.jpg" },
    { nome: "Lucas Pereira", usuario: "@lucaspereira", foto: "https://randomuser.me/api/portraits/men/77.jpg" },
    { nome: "Ana Paula", usuario: "@anapaula", foto: "https://randomuser.me/api/portraits/women/44.jpg" },
    { nome: "Bruno Souza", usuario: "@brunosouza", foto: "https://randomuser.me/api/portraits/men/65.jpg" }
];

const mensagensExemplo = {
    "@jufinancas": [
        { autor: "@jufinancas", texto: "Oi! Se precisar de dicas para sair das dívidas, pode contar comigo! 😊" },
        { autor: "@usuario", texto: "Obrigado Ju! Vou te chamar sim." }
    ],
    "@lucaspereira": [
        { autor: "@usuario", texto: "Lucas, você recomenda algum app para investir com pouco?" },
        { autor: "@lucaspereira", texto: "Uso o Nubank e o Inter, são bem simples para começar." }
    ],
    "@anapaula": [
        { autor: "@usuario", texto: "Ana, você tem alguma planilha para controle de orçamento?" },
        { autor: "@anapaula", texto: "Tenho sim! Te envio por e-mail." }
    ],
    "@brunosouza": [
        { autor: "@brunosouza", texto: "Já testou o app Organizze? É ótimo para cartão!" } ]
};

// Renderiza a lista de contatos na sidebar
function renderizarContatos() {
    const ul = document.getElementById("contacts-list");
    if (!ul) return;
    ul.innerHTML = contatosExemplo.map(c => `
        <li class="flex items-center gap-3 cursor-pointer hover:bg-gray-800 rounded-lg p-2 transition" onclick="abrirMensagens('${c.usuario}')">
            <img src="${c.foto}" alt="${c.nome}" class="w-10 h-10 rounded-full object-cover">
            <div>
                <div class="font-semibold text-white">${c.nome}</div>
                <div class="text-xs text-blue-300">${c.usuario}</div>
            </div>
        </li>
    `).join("");
}

// Função para abrir o modal de mensagens com um contato
function abrirModalMensagem(usuario) {
    let modal = document.getElementById('mensagem-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'mensagem-modal';
        modal.className = 'mensagem-modal fixed left-6 bottom-0 z-50 w-full max-w-md bg-gray-900 rounded-t-2xl shadow-2xl border-t-4 border-blue-600';
        modal.innerHTML = `
            <div class="modal-header flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950 rounded-t-2xl">
                <div class="flex items-center gap-3">
                    <img id="modal-foto" src="" class="w-10 h-10 rounded-full object-cover" alt="Contato">
                    <div>
                        <div id="modal-nome" class="font-semibold text-white"></div>
                        <div id="modal-usuario" class="text-xs text-blue-300"></div>
                    </div>
                </div>
                <button onclick="fecharModalMensagem()" class="text-gray-400 hover:text-red-400 text-2xl font-bold">&times;</button>
            </div>
            <div id="modal-mensagens" class="p-4 space-y-3 overflow-y-auto max-h-60"></div>
            <form id="modal-form" class="flex gap-2 p-4 border-t border-gray-800 bg-gray-950">
                <input type="text" class="flex-1 rounded bg-gray-800 border border-gray-700 text-white px-2 py-1 text-sm" placeholder="Digite uma mensagem..." required />
                <button class="btn bg-blue-600 text-white px-3 py-1 rounded" type="submit">Enviar</button>
            </form>
        `;
        document.body.appendChild(modal);
    } else {
        modal.style.display = 'block';
    }
    // Preencher dados do contato
    const contato = contatosExemplo.find(c => c.usuario === usuario);
    if (contato) {
        modal.querySelector('#modal-foto').src = contato.foto;
        modal.querySelector('#modal-nome').textContent = contato.nome;
        modal.querySelector('#modal-usuario').textContent = contato.usuario;
    }
    // Renderizar mensagens
    renderizarMensagensModal(usuario);
    // Handler de envio
    const form = modal.querySelector('#modal-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        const input = form.querySelector('input');
        const texto = input.value.trim();
        if (!texto) return;
        if (!mensagensExemplo[usuario]) mensagensExemplo[usuario] = [];
        mensagensExemplo[usuario].push({ autor: '@usuario', texto });
        input.value = '';
        renderizarMensagensModal(usuario);
    };
}

// Handler global para fechar o modal de mensagens
window.fecharModalMensagem = function() {
    const modal = document.getElementById('mensagem-modal');
    if (modal) modal.style.display = 'none';
};

// Renderiza as mensagens no modal de chat
function renderizarMensagensModal(usuario) {
    const div = document.getElementById('modal-mensagens');
    if (!div) return;
    const msgs = mensagensExemplo[usuario] || [];
    div.innerHTML = msgs.length ? msgs.map(m => `<div class='${m.autor === usuario ? 'text-blue-200 text-right' : 'text-green-200 text-left'}'><span class='font-semibold'>${m.autor}:</span> <span class='text-gray-100'>${m.texto}</span></div>`).join('') : "<span class='text-gray-400'>Nenhuma mensagem ainda.</span>";
    div.scrollTop = div.scrollHeight;
}

// Renderiza notificações de mensagens na sidebar
function renderizarMensagensNotificacoes() {
    const div = document.getElementById('messages-list');
    if (!div) return;
    // Pega a última mensagem de cada contato
    const notificacoes = Object.keys(mensagensExemplo).map(usuario => {
        const contato = contatosExemplo.find(c => c.usuario === usuario);
        const msgs = mensagensExemplo[usuario];
        if (!contato || !msgs || msgs.length === 0) return null;
        const ultima = msgs[msgs.length - 1];
        return {
            usuario,
            nome: contato.nome,
            foto: contato.foto,
            texto: ultima.texto,
            autor: ultima.autor
        };
    }).filter(Boolean);
    if (notificacoes.length === 0) {
        div.innerHTML = '<span class="text-gray-400">Nenhuma mensagem ainda.</span>';
        return;
    }
    div.innerHTML = notificacoes.map(n => `
        <div class="flex items-center gap-3 cursor-pointer hover:bg-gray-800 rounded-lg p-2 transition" onclick="abrirModalMensagem('${n.usuario}')">
            <img src="${n.foto}" alt="${n.nome}" class="w-8 h-8 rounded-full object-cover">
            <div class="flex-1">
                <div class="font-semibold text-white text-sm">${n.nome}</div>
                <div class="text-xs text-blue-300">${n.autor}: <span class="text-gray-200">${n.texto}</span></div>
            </div>
        </div>
    `).join('');
}

// Inicialização: renderiza contatos e mensagens ao carregar a página
document.addEventListener("DOMContentLoaded", function() {
    renderizarContatos();
    renderizarMensagensNotificacoes();
});

// Inicialização: carrega posts, renderiza feed e configura eventos de postagem e filtros
document.addEventListener("DOMContentLoaded", async function() {
    await carregarPosts();
    renderizarPosts();
    // Formulário de postagem
    const postForm = document.querySelector(".create-post");
    const postInput = postForm.querySelector(".post-input-field");
    const postButton = postForm.querySelector("button[type='button']");
    postButton.addEventListener("click", function() {
        const conteudo = postInput.value.trim();
        const mediaInput = postForm.querySelector(".post-media-input");
        let mediaUrl = "";
        if (mediaInput && mediaInput.files && mediaInput.files[0]) {
            const file = mediaInput.files[0];
            mediaUrl = URL.createObjectURL(file);
        }
        if (!conteudo && !mediaUrl) return;
        // Busca usuário logado
        let usuarioLogado = null;
        try {
            usuarioLogado = JSON.parse(localStorage.getItem('usuario'));
        } catch {}
        const novoPost = {
            id: Date.now(),
            titulo: "",
            conteudo,
            autor: usuarioLogado && usuarioLogado.username ? usuarioLogado.username : "Usuário",
            usuario: usuarioLogado && usuarioLogado.username ? '@' + usuarioLogado.username.toLowerCase().replace(/\s+/g, '') : "@usuario",
            foto: usuarioLogado && usuarioLogado.avatar ? usuarioLogado.avatar : "https://randomuser.me/api/portraits/lego/1.jpg",
            data: new Date().toISOString(),
            curtidas: 0,
            comentarios: 0,
            tags: [],
            midia: mediaUrl
        };
        if (!posts["Investimentos"]) {
            posts["Investimentos"] = [];
        }
        posts["Investimentos"].unshift(novoPost);
        salvarPosts();
        renderizarPosts();
        postInput.value = "";
        if (mediaInput) mediaInput.value = "";
    });
    // Botão de mídia mostra o input de arquivo
    postForm.querySelector(".post-tool i.fa-image").parentElement.addEventListener("click", function(e) {
        e.preventDefault();
        postForm.querySelector(".post-media-input").click();
    });
    // Filtros de categoria
    document.querySelectorAll(".category-filter").forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".category-filter").forEach(b => 
                b.classList.remove("active", "bg-purple-600", "text-white")
            );
            this.classList.add("active", "bg-purple-600", "text-white");
            const categoria = this.dataset.category;
            renderizarPosts(categoria);
        });
    });
});

// Exporta funções para uso global em handlers inline
window.curtirPost = curtirPost;
window.favoritarPost = favoritarPost;
window.compartilharPost = compartilharPost;
window.abrirComentarios = abrirComentarios;
window.editarPost = editarPost;
window.excluirPost = excluirPost;
window.abrirMensagens = abrirModalMensagem;
