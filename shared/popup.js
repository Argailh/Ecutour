// UBICACIÓN: shared/popup.js

// 1. INYECTAR HTML (Detectamos si es emoji o imagen automáticamente)
const popupHTML = `
<div id="modalOverlay" class="fixed inset-0 bg-black bg-opacity-50 hidden z-50 flex items-end sm:items-center justify-center transition-all">
    <div id="modalContent" class="bg-white w-full sm:w-96 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl transform translate-y-full sm:translate-y-0 transition-transform duration-300" onclick="event.stopPropagation()">
        
        <div class="flex justify-end">
            <button id="closeModal" class="text-gray-400 text-2xl font-bold hover:text-gray-700">&times;</button>
        </div>

        <div id="modalVisual" class="w-full h-40 bg-blue-50 rounded-xl mb-4 flex items-center justify-center text-8xl shadow-inner">
            </div>
        
        <div class="text-center mb-4">
            <h2 id="modalTitle" class="text-2xl font-bold text-gray-800"></h2>
            <div class="flex justify-center items-center gap-2 mt-1">
                <span id="modalPrice" class="text-gray-500 font-bold text-lg"></span>
                <span id="modalPoints" class="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm"></span>
            </div>
        </div>

        <p id="modalDesc" class="text-gray-600 text-sm mb-6 text-center leading-relaxed"></p>

        <button id="btnAgregarCarrito" class="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2">
            📅 Agregar a mi Plan
        </button>
    </div>
</div>

<div id="verPlanBtn" class="fixed bottom-24 right-6 z-40 hidden cursor-pointer animate-bounce">
    <div class="bg-blue-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center relative border-4 border-white">
        <span class="text-2xl">🎒</span>
        <span id="cartCounter" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border border-white">0</span>
    </div>
</div>
`;
document.body.insertAdjacentHTML('beforeend', popupHTML);

// 2. LÓGICA
let miPlan = JSON.parse(localStorage.getItem('ecutour_plan')) || [];
let lugarActual = null; // Para saber qué estamos agregando

// Elementos DOM
const overlay = document.getElementById('modalOverlay');
const content = document.getElementById('modalContent');
const btnAdd = document.getElementById('btnAgregarCarrito');

// --- FUNCIÓN PRINCIPAL (La que llamará Components.js) ---
window.abrirModal = function (idLugar) {
    // BUSCAR EL LUGAR EN TU ARCHIVO DE DATOS (lugares.js)
    // Esto es mucho más limpio que pasar strings por HTML
    lugarActual = LugaresData.find(l => l.id === idLugar);

    if (!lugarActual) return console.error("Lugar no encontrado");

    // Llenar datos
    document.getElementById('modalTitle').innerText = lugarActual.nombre;
    document.getElementById('modalPrice').innerText = lugarActual.precio;
    document.getElementById('modalPoints').innerText = `+${lugarActual.puntos}pts`;
    document.getElementById('modalDesc').innerText = lugarActual.descripcion;

    // Manejar Icono (Emoji) o Imagen
    const visual = document.getElementById('modalVisual');
    if (lugarActual.icono.includes('/') || lugarActual.icono.includes('.')) {
        // Es una ruta de imagen (ej: img/foto.jpg)
        visual.innerHTML = `<img src="${lugarActual.icono}" class="w-full h-full object-cover rounded-xl">`;
    } else {
        // Es un emoji (ej: 🌍)
        visual.innerHTML = lugarActual.icono;
    }

    // Verificar estado del botón
    actualizarBotonState();

    // Mostrar
    overlay.classList.remove('hidden');
    setTimeout(() => content.classList.remove('translate-y-full'), 10);
};

// --- Cerrar ---
function cerrar() {
    content.classList.add('translate-y-full');
    setTimeout(() => overlay.classList.add('hidden'), 300);
}
document.getElementById('closeModal').onclick = cerrar;
overlay.onclick = (e) => { if (e.target === overlay) cerrar(); };

// --- Agregar al Plan ---
btnAdd.onclick = function () {
    miPlan.push(lugarActual);
    localStorage.setItem('ecutour_plan', JSON.stringify(miPlan));

    // Feedback visual en el botón en lugar de alert
    btnAdd.innerHTML = `<i class="fas fa-check-circle animate-bounce"></i> ¡Agregado!`;
    btnAdd.className = "w-full bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg";

    actualizarContador();

    // Cerrar después de breve pausa
    setTimeout(() => {
        cerrar();
        // Restablecer estado (aunque al volver a abrir se recalcula, es bueno limpiar)
        // actualizarBotonState() se llamará al abrir de nuevo
    }, 1000);
};

function actualizarBotonState() {
    const existe = miPlan.some(i => i.id === lugarActual.id);
    if (existe) {
        btnAdd.innerText = "✅ Ya está en tu plan";
        btnAdd.className = "w-full bg-green-500 text-white font-bold py-3 rounded-xl cursor-default";
        btnAdd.disabled = true;
    } else {
        btnAdd.innerHTML = "📅 Agregar a mi Plan";
        btnAdd.className = "w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg transition transform active:scale-95";
        btnAdd.disabled = false;
    }
}

function actualizarContador() {
    const btn = document.getElementById('verPlanBtn');

    // Actualizamos el número rojo
    document.getElementById('cartCounter').innerText = miPlan.length;

    // Mostrar u ocultar botón
    if (miPlan.length > 0) {
        btn.classList.remove('hidden');
    } else {
        btn.classList.add('hidden');
    }

    // --- CAMBIO CLAVE: REDIRECCIÓN ---
    btn.onclick = () => {
        // Redirige a la carpeta carrito (subimos un nivel con ..)
        window.location.href = '../carrito/index.html';
    };
}
actualizarContador();