// regalo/logic.js

// DATOS DE PREMIOS (Con Categoría)
const PremiosData = [
    // BÁSICOS (20-30 pts)
    {
        id: 1,
        nombre: 'Souvenir Artesanal',
        marca: 'Postal, llavero o pulsera',
        icono: '🎁',
        costo: 20,
        categoria: 'basico',
        color: 'from-orange-100 to-orange-50 text-orange-600',
        bg: 'bg-white'
    },
    {
        id: 2,
        nombre: 'Canelazo en La Ronda',
        marca: 'Recorrido Autoguiado',
        icono: '🍹',
        costo: 30,
        categoria: 'basico',
        color: 'from-purple-100 to-purple-50 text-purple-600',
        bg: 'bg-white'
    },
    {
        id: 3,
        nombre: 'Museo Municipal',
        marca: 'Entrada General',
        icono: '🏛️',
        costo: 30,
        categoria: 'basico',
        color: 'from-blue-100 to-blue-50 text-blue-600',
        bg: 'bg-white'
    },

    // INTERMEDIOS (40-60 pts)
    {
        id: 4,
        nombre: 'Tour Nocturno',
        marca: 'Centro Histórico / La Ronda',
        icono: '🌙',
        costo: 40,
        categoria: 'medio',
        color: 'from-indigo-100 to-indigo-50 text-indigo-600',
        bg: 'bg-gradient-to-br from-white to-blue-50'
    },
    {
        id: 5,
        nombre: 'Cena en El Panecillo',
        marca: 'Experiencia Simbólica',
        icono: '🍽️',
        costo: 50,
        categoria: 'medio',
        color: 'from-yellow-100 to-yellow-50 text-yellow-600',
        bg: 'bg-gradient-to-br from-white to-yellow-50'
    },
    {
        id: 6,
        nombre: 'Entrada Doble Museo',
        marca: 'Museos de la Ciudad',
        icono: '🎟️',
        costo: 60,
        categoria: 'medio',
        color: 'from-teal-100 to-teal-50 text-teal-600',
        bg: 'bg-gradient-to-br from-white to-teal-50'
    },

    // ESPECIALES (80-100 pts)
    {
        id: 7,
        nombre: 'City Tour Temático',
        marca: 'Arte, Historia y Leyendas',
        icono: '🎭',
        costo: 80,
        categoria: 'premium',
        color: 'from-red-100 to-red-50 text-red-600',
        bg: 'bg-gradient-to-br from-white to-red-50 border-gold'
    },
    {
        id: 8,
        nombre: 'Quito desde las Alturas',
        marca: 'Mirador + Actividad Cultural',
        icono: '🌄',
        costo: 80,
        categoria: 'premium',
        color: 'from-amber-100 to-amber-50 text-amber-600',
        bg: 'bg-gradient-to-br from-amber-50 to-white border-gold'
    }
];

// Estado
let usuarioActual = null;
let premioSeleccionado = null;

// Elementos DOM Globales
const modal = document.getElementById('confirmModal');
const msgModal = document.getElementById('messageModal');
const listaPremios = document.getElementById('lista-premios');
const puntosDisp = document.getElementById('puntosDisp');
const progressFill = document.getElementById('progressFill');

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Obtener Usuario
    const sessionUser = Session.getUser();
    usuarioActual = sessionUser || { puntos: 0, email: 'invitado@ecutour.com', nombre: 'Invitado' };

    // 2. Renderizar UI Inicial
    actualizarHeader();
    renderAllPremios();

    // 3. Sincronizar con DB (simulado o real)
    if (sessionUser && sessionUser.email && window.DB) {
        try {
            const dbUser = await DB.getUser(sessionUser.email);
            if (dbUser) {
                usuarioActual = dbUser;
                actualizarHeader();
                renderAllPremios();
            }
        } catch (e) {
            console.error("Sync error:", e);
        }
    }
});

// Actualizar Header (Puntos y Progreso)
function actualizarHeader() {
    // Texto puntos
    puntosDisp.innerText = usuarioActual.puntos;

    // Barra de progreso (Objetivo arbitrario: 100pts para "Completar Nivel")
    const maxPoints = 100;
    const percent = Math.min((usuarioActual.puntos / maxPoints) * 100, 100);
    if (progressFill) {
        progressFill.style.width = `${percent}%`;
    }
}

// Renderizar Premios por Categorías (Estilo Estándar)
function renderAllPremios() {
    listaPremios.innerHTML = '';

    // Agrupar
    const grupos = {
        'basico': { title: 'Pequeños Detalles', desc: '20-30 Puntos' },
        'medio': { title: 'Experiencias Intermedias', desc: '40-60 Puntos' },
        'premium': { title: 'Especiales & VIP', desc: '80-100 Puntos' }
    };

    Object.keys(grupos).forEach(catKey => {
        const info = grupos[catKey];
        const items = PremiosData.filter(p => p.categoria === catKey);

        if (items.length > 0) {
            // Header de Sección Simple
            const section = document.createElement('div');
            section.className = "mb-6";
            section.innerHTML = `
                <div class="mb-3 px-1 border-l-4 border-blue-500 pl-3">
                    <h3 class="font-bold text-gray-800 text-lg">${info.title}</h3>
                    <p class="text-xs text-gray-500">${info.desc}</p>
                </div>
                <div class="space-y-3">
                    ${items.map(item => crearCardHTML(item)).join('')}
                </div>
            `;
            listaPremios.appendChild(section);
        }
    });
}

function crearCardHTML(premio) {
    const puedeCanjear = usuarioActual.puntos >= premio.costo;
    const opacityClass = puedeCanjear ? '' : 'opacity-60 grayscale-[0.5]';
    const activeClass = puedeCanjear ? 'hover:shadow-md cursor-pointer' : 'cursor-not-allowed';

    // Botón Estándar
    const btnStyle = puedeCanjear
        ? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
        : 'bg-gray-100 text-gray-400';

    const onclick = puedeCanjear ? `onclick="abrirConfirmacion(${premio.id})"` : '';

    return `
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center transition ${activeClass} ${opacityClass}" ${onclick}>
        <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-2xl border border-gray-100">
                ${premio.icono}
            </div>
            <div>
                <h4 class="font-bold text-gray-800 text-sm leading-tight">${premio.nombre}</h4>
                <p class="text-xs text-gray-500 mt-0.5">${premio.marca}</p>
            </div>
        </div>

        <div class="flex flex-col items-center min-w-[70px]">
            <span class="font-bold text-blue-600 text-lg">${premio.costo}</span>
            <span class="text-[10px] text-gray-400 font-medium">puntos</span>
        </div>
    </div>
    `;
}

// --- MODALES ---

window.abrirConfirmacion = function (id) {
    premioSeleccionado = PremiosData.find(p => p.id === id);
    if (!premioSeleccionado) return;

    // Llenar Modal
    document.getElementById('modalItemName').innerText = premioSeleccionado.nombre;
    const pointsEl = document.getElementById('modalItemPoints');
    pointsEl.innerText = `-${premioSeleccionado.costo} pts`;

    // Icono visual grande
    document.getElementById('modalVisualIcon').innerHTML = premioSeleccionado.icono;

    modal.classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('confirmCard').classList.remove('scale-95', 'opacity-0');
        document.getElementById('confirmCard').classList.add('scale-100', 'opacity-100');
    }, 10);
};

window.cerrarModal = function () {
    const card = document.getElementById('confirmCard');
    card.classList.remove('scale-100', 'opacity-100');
    card.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        premioSeleccionado = null;
    }, 200);
};

window.cerrarMessage = function () {
    const card = document.getElementById('msgCard');
    card.classList.remove('scale-100', 'opacity-100');
    card.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        msgModal.classList.add('hidden');
    }, 200);
};

window.showMessage = function (title, text, isError = false) {
    const iconContainer = document.getElementById('msgIconContainer');
    const titleEl = document.getElementById('msgTitle');
    const textEl = document.getElementById('msgText');

    titleEl.innerText = title;
    textEl.innerText = text;

    if (isError) {
        iconContainer.innerHTML = '<i class="fas fa-times text-4xl text-red-500"></i>';
        iconContainer.className = "w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse";
    } else {
        iconContainer.innerHTML = '<i class="fas fa-check text-4xl text-green-500"></i>';
        iconContainer.className = "w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce";
    }

    msgModal.classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('msgCard').classList.remove('scale-95', 'opacity-0');
        document.getElementById('msgCard').classList.add('scale-100', 'opacity-100');
    }, 10);
};

document.getElementById('btnConfirmar').onclick = async function () {
    if (!premioSeleccionado) return;
    const item = premioSeleccionado;

    // Loading State
    const btn = this;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando';
    btn.disabled = true;

    try {
        await Session.updatePoints(-item.costo, `Canje: ${item.nombre}`);

        usuarioActual.puntos -= item.costo;
        actualizarHeader();
        renderAllPremios();
        cerrarModal();

        // Confetti effect wrapper if we had one
        showMessage('¡Canje Exitoso!', `Disfruta tu ${item.nombre}. Revisa tu correo o mis premios.`);
    } catch (error) {
        console.error("Error canje:", error);
        cerrarModal();
        showMessage('Hubo un problema', error.message || 'Inténtalo de nuevo', true);
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
};

// Close on outside click
modal.onclick = (e) => { if (e.target === modal) cerrarModal(); };
msgModal.onclick = (e) => { if (e.target === msgModal) cerrarMessage(); };