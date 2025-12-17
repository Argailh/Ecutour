// shared/components.js

function esFavorito(id) {
    const favs = JSON.parse(localStorage.getItem('ecutour_favoritos')) || [];
    return favs.includes(id);
}

const CardFactory = {
    crearTarjeta(lugar, modo = 'simple') {

        // MODO SIMPLE (Home)
        if (modo === 'simple') {
            return `
            <div onclick="abrirModal(${lugar.id})" 
                 class="bg-white p-4 rounded-xl shadow-md mb-3 flex items-center cursor-pointer transition transform active:scale-95 hover:shadow-lg">
                
                ${lugar.imagen
                    ? `<img src="${lugar.imagen}" class="w-16 h-16 rounded-lg object-cover mr-4 shadow-sm" alt="${lugar.nombre}">`
                    : `<div class="text-4xl mr-4 w-12 text-center">${lugar.icono}</div>`
                }
                
                <div class="flex-1">
                    <h3 class="font-bold text-gray-800 text-lg">${lugar.nombre}</h3>
                    <div class="flex items-center gap-2">
                        <span class="text-yellow-600 font-bold text-xs bg-yellow-50 px-2 py-0.5 rounded-md">${lugar.precio}</span>
                        <span class="text-green-600 font-bold text-sm">+${lugar.puntos}pts</span>
                    </div>
                </div>
                
                <div class="text-blue-500 font-bold text-xl">
                    <i class="fas fa-chevron-right text-sm text-gray-300"></i>
                </div>
            </div>
            `;
        }

        // MODO EXPLORAR (List View rediseñado)
        else if (modo === 'explorar') {
            return `
            <div class="bg-white p-4 rounded-xl shadow-sm mb-4 border border-gray-100 flex items-center gap-4 transition hover:shadow-md">
                <!-- Icono / Avatar -->
                <div onclick="abrirModal(${lugar.id})" class="w-16 h-16 flex-shrink-0 cursor-pointer">
                    ${lugar.imagen
                    ? `<img src="${lugar.imagen}" class="w-full h-full rounded-lg object-cover shadow-sm border border-gray-100" alt="${lugar.nombre}">`
                    : `<div class="w-full h-full rounded-full bg-blue-50 flex items-center justify-center text-3xl border border-blue-100">${lugar.icono}</div>`
                }
                </div>

                <!-- Info Central -->
                <div onclick="abrirModal(${lugar.id})" class="flex-1 min-w-0 cursor-pointer">
                    <h3 class="font-bold text-gray-900 text-base truncate mb-1">${lugar.nombre}</h3>
                    <p class="text-gray-400 text-xs mb-2 line-clamp-1">${lugar.descripcion}</p>
                    
                    <div class="flex items-center gap-3 text-xs text-gray-500 font-medium">
                        <span class="flex items-center text-yellow-500">
                            <i class="fas fa-star mr-1"></i> ${lugar.rating}
                        </span>
                        <span>${lugar.precio}</span>
                        <span class="flex items-center">
                            <i class="fas fa-map-marker-alt mr-1 text-red-400"></i> ${lugar.distancia}
                        </span>
                    </div>
                </div>

                <!-- Botón Acción (Favorito) -->
                <button onclick="event.stopPropagation(); toggleFavorite(${lugar.id})" 
                        class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center transition shadow-sm border border-gray-100 active:scale-90 hover:bg-red-50 group">
                    <i class="fas fa-heart text-lg transition ${esFavorito(lugar.id) ? 'text-red-500' : 'text-gray-300 group-hover:text-red-300'}"></i>
                </button>
            </div>
            `;
        } // Fin modo explorar

        return '';
    }
};

window.toggleFavorite = function (id) {
    let favs = JSON.parse(localStorage.getItem('ecutour_favoritos')) || [];
    const index = favs.indexOf(id);

    if (index === -1) {
        favs.push(id);
        // alert('❤️ Agregado a Favoritos');
    } else {
        favs.splice(index, 1);
        // alert('💔 Eliminado de Favoritos');
    }

    localStorage.setItem('ecutour_favoritos', JSON.stringify(favs));

    // UI Feedback instantáneo (si existe el botón en el DOM actual)
    // Recargamos o buscamos el icono específico.
    // Hack simple: Recargar si estamos en perfil, si estamos en explorar solo cambiar clase si posible.
    // Por ahora, recargar es seguro pero tosco. Mejor cambiar clases via JS selector.

    const btnIcon = event.target.closest('button')?.querySelector('i');
    if (btnIcon) {
        btnIcon.classList.toggle('text-red-500');
        btnIcon.classList.toggle('text-gray-300');
    }

    // Si estamos en perfil, quizás queramos remover la tarjeta.
    if (window.location.href.includes('perfil')) {
        window.location.reload();
    }
};