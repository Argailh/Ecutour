
document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('listaResultados');
    const searchInput = document.getElementById('searchInput');
    const catContainer = document.getElementById('categoryContainer');
    const cartBadge = document.getElementById('cartBadge');

    // 1. Definir Categorías (Icono + Nombre + Key en data)
    const categorias = [
        { id: 'all', label: 'Todos', icon: '' },
        { id: 'hoteles', label: 'Hoteles', icon: '🏨' },
        { id: 'restaurantes', label: 'Restaurantes', icon: '🍽️' },
        { id: 'huecas', label: 'Huecas Típicas', icon: '🍲' },
        { id: 'turismo', label: 'Turismo', icon: '🏛️' },
        { id: 'museos', label: 'Museos', icon: '🎨' },
        { id: 'parques', label: 'Parques', icon: '🌳' }
    ];

    let currentCat = 'all';
    let searchQuery = '';

    // 2. Renderizar Filtros
    function renderFilters() {
        catContainer.innerHTML = '';
        categorias.forEach(cat => {
            const btn = document.createElement('button');
            const isActive = currentCat === cat.id;

            // Clases base
            let classes = "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition border flex items-center gap-2";

            if (isActive) {
                // Estilo Activo (Azul)
                btn.className = `${classes} bg-blue-600 text-white border-blue-600 shadow-md transform scale-105`;
            } else {
                // Estilo Inactivo (Blanco/Gris)
                btn.className = `${classes} bg-white text-gray-600 border-gray-200 hover:bg-gray-50`;
            }

            // Contenido
            btn.innerHTML = `${cat.icon} ${cat.label}`;

            // Click
            btn.onclick = () => {
                currentCat = cat.id;
                renderFilters(); // Re-render para actualizar estado visual
                filterAndRender();
            };

            catContainer.appendChild(btn);
        });
    }

    // 3. Filtrar y Renderizar Lista
    function filterAndRender() {
        container.innerHTML = '';

        // Filtrar
        const filtered = LugaresData.filter(lugar => {
            // Filtro Texto
            const matchSearch = lugar.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lugar.descripcion.toLowerCase().includes(searchQuery.toLowerCase());

            // Filtro Categoría
            // Nota: En la data, la propiedad es 'categoria' (singular y minuscula).
            // A veces la data no tiene categoria, asumimos 'otros'
            const itemCat = (lugar.categoria || '').toLowerCase();
            const matchCat = currentCat === 'all' || itemCat === currentCat;

            return matchSearch && matchCat;
        });

        // Renderizar
        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center mt-10 text-center">
                    <div class="text-4xl mb-2">🔍</div>
                    <p class="text-gray-500">No encontramos resultados.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(lugar => {
            // Usamos el modo 'explorar' que creamos en components.js
            container.innerHTML += CardFactory.crearTarjeta(lugar, 'explorar');
        });
    }

    // 4. Listeners
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        filterAndRender();
    });

    // 5. Lógica de Carrito (Global)
    window.addToCart = function (id) {
        // Evitar que el click se propague al abrirModal (si está anidado)
        event.stopPropagation();

        // Buscar lugar
        const lugar = LugaresData.find(l => l.id === id);
        if (!lugar) return;

        // Leer carrito actual
        let cart = JSON.parse(localStorage.getItem('ecutour_plan')) || [];

        // Agregar
        // (Opcional: Verificar si ya existe)
        const exists = cart.find(item => item.id === id);
        if (exists) {
            alert('¡Este lugar ya está en tu carrito!');
            return;
        }

        cart.push(lugar);
        localStorage.setItem('ecutour_plan', JSON.stringify(cart));

        // Feedback visual
        updateCartBadge();

        // Animación simple del botón
        const btn = event.currentTarget;
        const original = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-check text-green-500"></i>`;
        btn.classList.add('bg-green-50');

        setTimeout(() => {
            btn.innerHTML = `<i class="fas fa-heart text-red-500"></i>`;
            btn.classList.remove('bg-green-50');
        }, 1500);
    };

    function updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('ecutour_plan')) || [];
        const count = cart.length;

        if (count > 0) {
            cartBadge.innerText = count;
            cartBadge.classList.remove('hidden');
        } else {
            cartBadge.classList.add('hidden');
        }
    }

    // Inicializar
    renderFilters();
    filterAndRender();
    updateCartBadge();
});
