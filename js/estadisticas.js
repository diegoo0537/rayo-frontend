var botonJugadores = document.getElementById("boton-est-jugadores");
var botonPartidos = document.getElementById("boton-est-partidos");
var contenedorGraficasJugadores = document.getElementById("estadisticas-jugadores");
var contenedorGraficasPartidos = document.getElementById("estadisticas-partidos");
var graficoPartidosJugados = document.getElementById("grafico-partidos-jugados");
var graficoGoles = document.getElementById("grafico-goles");
var graficoAsistencias = document.getElementById("grafico-asistencias");
var graficoGolesAsistencias = document.getElementById("grafico-goles-asistencias");
var graficoPartidos = document.getElementById("grafico-partidos");

async function cargarGraficas() {
    const t = Date.now();
    graficoPartidosJugados.innerHTML = `<img src="https://rayo-api.onrender.com/estadisticas/jugadores/partidos?cache=${t}">`;
    graficoGoles.innerHTML = `<img src="https://rayo-api.onrender.com/estadisticas/jugadores/goles?cache=${t}">`;
    graficoAsistencias.innerHTML = `<img src="https://rayo-api.onrender.com/estadisticas/jugadores/asistencias?cache=${t}">`;
    graficoGolesAsistencias.innerHTML = `<img src="https://rayo-api.onrender.com/estadisticas/jugadores/goles_asistencias?cache=${t}">`;
}

async function cargarGraficas2() {
    const t = Date.now();
    graficoPartidos.innerHTML = `<img src="https://rayo-api.onrender.com/estadisticas/partidos?cache=${t}">`;
}

document.addEventListener("DOMContentLoaded", async () => {
    await cargarGraficas();

    botonJugadores.addEventListener("click", async () => {
        contenedorGraficasPartidos.style.display = "none";        
        contenedorGraficasJugadores.style.display = "flex";
        await cargarGraficas();
    });

    botonPartidos.addEventListener("click", async () => {
        contenedorGraficasJugadores.style.display = "none";
        contenedorGraficasPartidos.style.display = "flex";
        await cargarGraficas2();
    });

    document.getElementById("botonMenuInicio").addEventListener("click", async () => {
        contenedorGraficasPartidos.style.display = "none";        
        contenedorGraficasJugadores.style.display = "flex";
    });

    document.getElementById("botonMenuPartidos").addEventListener("click", async () => {
        contenedorGraficasPartidos.style.display = "none";        
        contenedorGraficasJugadores.style.display = "flex";
    });
});