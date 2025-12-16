Session.requireAuth();
const user = Session.getUser();
document.getElementById('puntosDisp').innerText = user.puntos;

function canjear(costo, nombre) {
    if(user.puntos >= costo) {
        if(confirm(`¿Canjear ${nombre} por ${costo} puntos?`)) {
            Session.updatePoints(-costo, `Canje: ${nombre}`);
        }
    } else {
        alert('No tienes suficientes puntos :(');
    }
}