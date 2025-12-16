// Lógica específica de Inicio
Session.requireAuth();
const user = Session.getUser();
document.getElementById('userName').textContent = user.nombre;
document.getElementById('userPoints').textContent = user.puntos;