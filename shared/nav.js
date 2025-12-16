document.addEventListener('DOMContentLoaded', () => {
    const navHTML = `
        <div class="bottom-nav">
            <a href="../inicio/index.html" class="nav-item" id="nav-inicio"><i class="fas fa-home"></i>Inicio</a>
            <a href="../mapa/index.html" class="nav-item" id="nav-mapa"><i class="fas fa-map-marked-alt"></i>Mapa</a>
            <a href="../explorar/index.html" class="nav-item" id="nav-explorar"><i class="fas fa-compass"></i>Explorar</a>
            <a href="../regalo/index.html" class="nav-item" id="nav-regalo"><i class="fas fa-gift"></i>Regalos</a>
            <a href="../perfil/index.html" class="nav-item" id="nav-perfil"><i class="fas fa-user"></i>Perfil</a>
        </div>
    `;
    
    // Inyectar al final del container
    const container = document.querySelector('.app-container');
    if(container) {
        const div = document.createElement('div');
        div.innerHTML = navHTML;
        container.appendChild(div);
        
        // Activar clase según carpeta actual
        const path = window.location.pathname;
        if(path.includes('inicio')) document.getElementById('nav-inicio').classList.add('active');
        if(path.includes('mapa')) document.getElementById('nav-mapa').classList.add('active');
        if(path.includes('explorar')) document.getElementById('nav-explorar').classList.add('active');
        if(path.includes('regalo')) document.getElementById('nav-regalo').classList.add('active');
        if(path.includes('perfil')) document.getElementById('nav-perfil').classList.add('active');
    }
});