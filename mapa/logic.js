
document.addEventListener('DOMContentLoaded', () => {

  // 1. Obtener Contenedor
  const mapa = document.getElementById('mapaContenedor');
  if (!mapa) return console.error("No se encontró el contenedor del mapa");

  // 2. Importar o Leer Datos (Asumimos LugaresData cargado en HTML)
  if (typeof LugaresData === 'undefined') return console.error("No hay datos de lugares cargados");

  // 3. Renderizar Pines
  LugaresData.forEach(lugar => {
    // Solo si tiene coordenadas definidas
    if (lugar.coords) {

      // Crear elemento
      const pin = document.createElement('button');

      // Estilos de Posicionamiento
      pin.className = "absolute transform -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg border-2 border-blue-500 hover:scale-110 transition z-10 group flex items-center justify-center w-10 h-10";
      pin.style.top = lugar.coords.top;
      pin.style.left = lugar.coords.left;

      // Contenido (Icono + Tooltip)
      pin.innerHTML = `
                <div class="text-xl">${lugar.icono}</div>
                
                <!-- Tooltip -->
                <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-20 pointer-events-none">
                    ${lugar.nombre}
                </span>
            `;

      // Evento Click -> Abrir Popup (Funcionalidad compartida)
      pin.onclick = () => {
        // Función global definida en shared/popup.js
        if (typeof abrirModal === 'function') {
          abrirModal(lugar.id);
        } else {
          console.error("Popup Shared no cargado");
          alert(lugar.nombre);
        }
      };

      mapa.appendChild(pin);
    }
  });

});