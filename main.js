// main.js - Ponto de entrada dos scripts principais do sistema
// Importa funções de outros módulos para uso global e integração SPA
import { mostrarSecao } from './spa.js';
import { renderOportunidades } from './oportunidades.js';
import { renderMetas, renderExtrato, saldoOrcamento, extrato, metas, salvarEstado, adicionarAoOrcamento, retirarDoOrcamento, adicionarExtrato } from './estado.js';
import { calcularInvestimento, initGraficos } from './investimentos.js';
import { renderMercado } from './mercado.js';
import './comunidade.js'; // Importa funcionalidades da comunidade
import './orcamento.js'; // Importa funções do orçamento

// Expõe funções globais para uso em handlers inline no HTML (caso necessário)
window.mostrarSecao = mostrarSecao;
window.renderOportunidades = renderOportunidades;
window.renderMetas = renderMetas;
window.renderExtrato = renderExtrato;
window.calcularInvestimento = calcularInvestimento;
window.initGraficos = initGraficos;
window.renderMercado = renderMercado;
window.saldoOrcamento = saldoOrcamento;
window.extrato = extrato;
window.metas = metas;
window.salvarEstado = salvarEstado;

// Função global para abrir o modal de depósito/retirada de meta
// Recebe o índice da meta e o tipo de operação ('deposito' ou 'retirada')
window.abrirModalMeta = function(idx, tipo) {
    document.getElementById('meta-modal-overlay').classList.remove('hidden');
    document.getElementById('meta-modal').classList.remove('hidden');
    const meta = metas[idx];
    document.getElementById('meta-modal-nome').textContent = meta.nome;
    document.getElementById('meta-modal-saldo').textContent = `Economizado: R$ ${meta.economizado.toLocaleString('pt-BR')}`;
    document.getElementById('meta-modal-titulo').textContent = tipo === 'deposito' ? 'Depositar valor na meta' : 'Retirar valor da meta';
    const btn = document.getElementById('meta-modal-btn');
    btn.textContent = tipo === 'deposito' ? 'Depositar' : 'Retirar';
    btn.setAttribute('type', 'button');
    // Gradiente do cartão digital conforme a meta
    const card = document.getElementById('meta-modal-card');
    card.style.background = '';
    if (meta.nome === 'Viagem Europa') {
        card.className = 'rounded-2xl p-6 shadow-lg w-96 h-52 flex flex-col items-start justify-between mb-4 transition-all duration-300 meta-modal-card';
        card.style.background = 'linear-gradient(90deg, #22d3ee, #4ade80)';
    } else {
        card.className = `rounded-2xl p-6 shadow-lg w-96 h-52 flex flex-col items-start justify-between mb-4 transition-all duration-300 meta-modal-card bg-gradient-to-r ${meta.cor || 'from-blue-500 to-green-400'}`;
    }
    // Limpa o campo de valor
    const form = document.getElementById('meta-modal-form');
    const input = form.querySelector('input[type=number]');
    if (input) input.value = '';
    // Remove handlers antigos
    btn.onclick = null;
    form.onsubmit = null;
    // Handler único
    function handleMeta(e) {
        if (e) e.preventDefault();
        const valor = parseFloat(input.value);
        if (isNaN(valor) || valor <= 0) return;
        if (tipo === 'deposito') {
            if (valor > saldoOrcamento) {
                alert('Saldo insuficiente no orçamento!');
                return;
            }
            meta.economizado += valor;
            retirarDoOrcamento(valor);
            adicionarExtrato({ tipo: 'Depósito Meta', meta: meta.nome, valor, data: new Date() });
        } else {
            if (valor > meta.economizado) {
                alert('Valor maior que o economizado na meta!');
                return;
            }
            meta.economizado -= valor;
            adicionarAoOrcamento(valor);
            adicionarExtrato({ tipo: 'Retirada Meta', meta: meta.nome, valor, data: new Date() });
        }
        salvarEstado();
        renderMetas();
        renderOrcamento();
        renderExtrato();
        if (window.fecharModalMeta) window.fecharModalMeta();
    }
    form.onsubmit = handleMeta;
    btn.onclick = handleMeta;
};

// Função para fechar o modal
window.fecharModalMeta = function() {
    document.getElementById('meta-modal-overlay').classList.add('hidden');
    document.getElementById('meta-modal').classList.add('hidden');
};

// Fecha modal ao clicar no X ou no overlay
// Adiciona eventos para fechar o modal
document.getElementById('meta-modal-close').onclick = window.fecharModalMeta;
document.getElementById('meta-modal-overlay').onclick = window.fecharModalMeta;

// Função global para adicionar uma nova meta financeira
window.adicionarMeta = function(event) {
    event.preventDefault();
    const nome = document.getElementById('nova-meta-nome').value.trim();
    const valor = parseFloat(document.getElementById('nova-meta-valor').value);
    if (!nome || isNaN(valor) || valor <= 0) return;
    // Gradientes sugeridos para novas metas (ciclo de cores)
    const gradientes = [
        'from-pink-400 to-yellow-300',
        'from-cyan-400 to-green-300',
        'from-indigo-400 to-purple-400',
        'from-blue-500 to-green-400',
        'from-purple-500 to-pink-400',
        'from-yellow-400 to-red-400',
        'from-green-400 to-blue-400'
    ];
    // Seleciona gradiente baseado na quantidade de metas já existentes
    const cor = gradientes[metas.length % gradientes.length];
    metas.push({ nome, valor, economizado: 0, cor });
    document.getElementById('nova-meta-nome').value = '';
    document.getElementById('nova-meta-valor').value = '';
    salvarEstado();
    renderMetas();
    renderOrcamento && renderOrcamento();
};

// --- Autenticação e Perfil ---

// Estado do usuário
let usuario = JSON.parse(localStorage.getItem('usuario')) || null;

function salvarUsuario(u) {
    usuario = u;
    localStorage.setItem('usuario', JSON.stringify(u));
}

function atualizarSidebarAvatar() {
    const sidebarBtn = document.querySelector('aside #sidebar button[onclick*="perfil"] i');
    if (sidebarBtn && usuario && usuario.avatar) {
        sidebarBtn.className = '';
        sidebarBtn.innerHTML = `<img src="${usuario.avatar}" alt="avatar" class="rounded-full w-8 h-8 object-cover border-2 border-blue-400">`;
    } else if (sidebarBtn) {
        sidebarBtn.className = 'fas fa-user-circle feature-icon glossy-gradient-icon';
        sidebarBtn.innerHTML = '';
    }
}

window.fecharModalLogin = function() {
    document.getElementById('modal-login').classList.add('hidden');
};
window.abrirModalLogin = function() {
    document.getElementById('modal-login').classList.remove('hidden');
};
window.fecharModalCadastro = function() {
    document.getElementById('modal-cadastro').classList.add('hidden');
};
window.abrirModalCadastro = function() {
    document.getElementById('modal-cadastro').classList.remove('hidden');
};

// SPA: ao clicar em perfil, verifica login
window.mostrarSecao = function(id) {
    if (id === 'perfil') {
        if (!usuario) {
            abrirModalLogin();
            return;
        } else {
            renderPerfilDashboard();
        }
    }
    // ...existing code...
    mostrarSecaoOriginal(id);
};
const mostrarSecaoOriginal = mostrarSecao;

// Renderiza dashboard do perfil
function renderPerfilDashboard() {
    const dash = document.getElementById('perfil-dashboard');
    if (!dash) return;
    dash.innerHTML = `
        <div class="w-full flex flex-col items-center gap-8">
            <div class="card bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 shadow-2xl p-8 w-full flex flex-col items-center gap-4 border-2 border-blue-700">
                <div class="relative">
                    <img id="avatar-preview" src="${usuario.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(usuario.username || 'Usuário') + '&background=8b5cf6&color=fff'}" alt="Avatar" class="rounded-full w-32 h-32 object-cover border-4 border-blue-400 shadow-xl">
                    <label for="perfil-avatar-upload" class="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 cursor-pointer shadow-lg" title="Alterar avatar por upload">
                        <i class="fas fa-camera"></i>
                        <input id="perfil-avatar-upload" type="file" accept="image/*" class="hidden" />
                    </label>
                </div>
                <div class="text-3xl font-bold text-blue-200">${usuario.username}</div>
                <div class="text-blue-400 text-base">${usuario.email || ''}</div>
            </div>
            <form id="form-perfil" class="card bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 shadow-xl w-full flex flex-col gap-6 border-2 border-blue-800">
                <div class="flex flex-col gap-2">
                    <label class="text-blue-200 font-semibold">Nome de usuário</label>
                    <input id="perfil-nome" class="rounded-lg px-4 py-2 bg-gray-700 text-white" type="text" value="${usuario.username}" placeholder="Novo nome">
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-blue-200 font-semibold">E-mail</label>
                    <input id="perfil-email" class="rounded-lg px-4 py-2 bg-gray-700 text-white" type="email" value="${usuario.email || ''}" placeholder="E-mail">
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-blue-200 font-semibold">Nova senha</label>
                    <input id="perfil-senha" class="rounded-lg px-4 py-2 bg-gray-700 text-white" type="password" placeholder="Nova senha (opcional)">
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-blue-200 font-semibold">Avatar (upload de imagem)</label>
                    <input id="perfil-avatar-upload-form" type="file" accept="image/*" class="rounded-lg px-4 py-2 bg-gray-700 text-white" />
                </div>
                <button class="btn bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-2 rounded-lg shadow-lg" id="btn-salvar-perfil" type="submit">Salvar Alterações</button>
            </form>
            <div class="card bg-gradient-to-br from-blue-800 via-blue-700 to-green-400 text-white rounded-xl text-center text-lg font-bold shadow-lg w-full border-2 border-blue-700">
                <div class="text-blue-200 font-bold text-xl mb-2">Notificações</div>
                <div class="text-blue-100">Bem-vindo(a), ${usuario.username}! Aqui você acompanha seu progresso, novidades e alertas da plataforma.</div>
            </div>
        </div>
    `;
    document.getElementById('perfil').classList.remove('hidden');
    atualizarSidebarAvatar();
    // Upload de avatar (ícone e formulário)
    const avatarUploadIcon = document.getElementById('perfil-avatar-upload');
    const avatarUploadForm = document.getElementById('perfil-avatar-upload-form');
    function handleAvatarUpload(input) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                usuario.avatar = ev.target.result;
                salvarUsuario(usuario);
                renderPerfilDashboard();
                atualizarSidebarAvatar();
                atualizarAvatarComunidade();
            };
            reader.readAsDataURL(file);
        }
    }
    if (avatarUploadIcon) {
        avatarUploadIcon.onchange = function(e) { handleAvatarUpload(e.target); };
    }
    if (avatarUploadForm) {
        avatarUploadForm.onchange = function(e) { handleAvatarUpload(e.target); };
    }
    // Salvar alterações
    document.getElementById('form-perfil').onsubmit = function(e) {
        e.preventDefault();
        const novoNome = document.getElementById('perfil-nome').value.trim();
        const novoEmail = document.getElementById('perfil-email').value.trim();
        const novaSenha = document.getElementById('perfil-senha').value.trim();
        if (novoNome) usuario.username = novoNome;
        if (novoEmail) usuario.email = novoEmail;
        if (novaSenha) usuario.senha = novaSenha; // Simulação, não seguro para produção
        salvarUsuario(usuario);
        renderPerfilDashboard();
        atualizarSidebarAvatar();
        atualizarAvatarComunidade();
    };
}

// Atualiza avatar e nome do usuário na comunidade
function atualizarAvatarComunidade() {
    // Exemplo: atualiza todos os avatares e nomes do usuário logado na comunidade
    document.querySelectorAll('.post-user-avatar').forEach(img => {
        img.src = usuario.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(usuario.username || 'Usuário') + '&background=8b5cf6&color=fff';
    });
    document.querySelectorAll('.post-username').forEach(span => {
        span.textContent = usuario.username;
    });
}

// Login
const formLogin = document.getElementById('form-login');
if (formLogin) {
    formLogin.onsubmit = function(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        // Simulação de login (em produção, validar com backend)
        if (username && password) {
            const fakeUser = {
                username,
                email: username.includes('@') ? username : username + '@investsmart.com',
                avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(username) + '&background=8b5cf6&color=fff'
            };
            salvarUsuario(fakeUser);
            fecharModalLogin();
            renderPerfilDashboard();
            atualizarSidebarAvatar();
            mostrarSecaoOriginal('perfil');
        }
    };
}
// Cadastro
const formCadastro = document.getElementById('form-cadastro');
if (formCadastro) {
    formCadastro.onsubmit = function(e) {
        e.preventDefault();
        const username = document.getElementById('cadastro-username').value.trim();
        const email = document.getElementById('cadastro-email').value.trim();
        const password = document.getElementById('cadastro-password').value.trim();
        if (username && email && password) {
            const fakeUser = {
                username,
                email,
                avatar: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(username) + '&background=8b5cf6&color=fff'
            };
            salvarUsuario(fakeUser);
            fecharModalCadastro();
            renderPerfilDashboard();
            atualizarSidebarAvatar();
            mostrarSecaoOriginal('perfil');
        }
    };
}
// Logout (opcional)
window.logout = function() {
    usuario = null;
    localStorage.removeItem('usuario');
    atualizarSidebarAvatar();
    mostrarSecaoOriginal('perfil');
};

// Substitui os handlers dos botões do Cartão Digital para usar o modal
window.addEventListener('DOMContentLoaded', () => {
    // Corrige handlers dos botões do Cartão Digital SEMPRE após renderização
    function corrigirHandlersCartaoDigital() {
        const btnDepositar = document.querySelector('#orcamento-card-digital .bg-green-500');
        const btnRetirar = document.querySelector('#orcamento-card-digital .bg-red-500');
        if (btnDepositar) btnDepositar.onclick = (e) => { e.preventDefault(); window.abrirModalOrcamento('deposito'); };
        if (btnRetirar) btnRetirar.onclick = (e) => { e.preventDefault(); window.abrirModalOrcamento('retirada'); };
    }
    corrigirHandlersCartaoDigital();
    // Garante que handlers são reatribuídos após cada renderização do orçamento
});

// Valor de fundos extras do patrimônio
// Sempre inicialize fundos extras em 0 ao iniciar a sessão
function getUsuarioId() {
    if (window.usuario && window.usuario.username) return window.usuario.username;
    return 'anonimo';
}
function getFundosPatrimonioKey() {
    return 'fundosPatrimonio_' + getUsuarioId();
}
function loadFundosPatrimonio() {
    const v = localStorage.getItem(getFundosPatrimonioKey());
    return v ? parseFloat(v) : 0;
}
function saveFundosPatrimonio(valor) {
    localStorage.setItem(getFundosPatrimonioKey(), valor);
}
let fundosPatrimonio = loadFundosPatrimonio();
window.fundosPatrimonio = fundosPatrimonio;

window.addEventListener('DOMContentLoaded', () => {
    fundosPatrimonio = loadFundosPatrimonio();
    window.fundosPatrimonio = fundosPatrimonio;
    const btnFundos = document.getElementById('btn-adicionar-fundos');
    const modalOverlay = document.getElementById('modal-fundos-overlay');
    const modal = document.getElementById('modal-fundos');
    const btnClose = document.getElementById('modal-fundos-close');
    const form = document.getElementById('form-adicionar-fundos');
    const input = form.querySelector('input[type=number]');
    if (btnFundos) btnFundos.onclick = () => {
        modalOverlay.classList.remove('hidden');
        modal.classList.remove('hidden');
        if (input) input.value = '';
    };
    if (btnClose) btnClose.onclick = () => {
        modalOverlay.classList.add('hidden');
        modal.classList.add('hidden');
    };
    if (modalOverlay) modalOverlay.onclick = () => {
        modalOverlay.classList.add('hidden');
        modal.classList.add('hidden');
    };
    if (form) form.onsubmit = function(e) {
        e.preventDefault();
        const valor = parseFloat(input.value);
        if (isNaN(valor) || valor <= 0) return;
        fundosPatrimonio += valor;
        window.fundosPatrimonio = fundosPatrimonio;
        saveFundosPatrimonio(fundosPatrimonio);
        // Força atualização do patrimônio na tela
        import('./estado.js').then(mod => {
            if (typeof mod.renderOrcamento === 'function') mod.renderOrcamento();
            if (typeof window.renderOrcamento === 'function') window.renderOrcamento();
        });
        modalOverlay.classList.add('hidden');
        modal.classList.add('hidden');
    };
});

// Sempre que trocar de usuário, recarrega fundos do usuário
window.addEventListener('storage', (e) => {
    if (e.key === 'usuario') {
        fundosPatrimonio = loadFundosPatrimonio();
        window.fundosPatrimonio = fundosPatrimonio;
        if (typeof window.renderOrcamento === 'function') window.renderOrcamento();
    }
});
window.saveFundosPatrimonio = saveFundosPatrimonio;
