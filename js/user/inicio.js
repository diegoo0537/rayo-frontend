<<<<<<< HEAD
var botonMenuInicio = document.getElementById("botonMenuInicio");
var botonMenuPartidos = document.getElementById("botonMenuPartidos");
var botonMenuEstadisticas = document.getElementById("botonMenuEstadisticas");
var contenedorInicio = document.getElementById("contenedor-tabla-jugadores");
var contenedorPartidos = document.getElementById("contenedor-partidos");
var contenedorEstadisticas = document.getElementById("contenedor-graficas");

var graficoPartidosJugados = document.getElementById("grafico-partidos-jugados");
var graficoGoles = document.getElementById("grafico-goles");
var graficoAsistencias = document.getElementById("grafico-asistencias");
var graficoGolesAsistencias = document.getElementById("grafico-goles-asistencias");

var azul = "#0057b8";
var negro = "#000000";

async function cargarGraficas() {
    const t = Date.now();
    graficoPartidosJugados.innerHTML = `<img src="https://rayo-api.onrender.com/estadisticas/jugadores/partidos?cache=${t}">`;
    graficoGoles.innerHTML = `<img src="https://rayo-api.onrender.com/estadisticas/jugadores/goles?cache=${t}">`;
    graficoAsistencias.innerHTML = `<img src="https://rayo-api.onrender.com/estadisticas/jugadores/asistencias?cache=${t}">`;
    graficoGolesAsistencias.innerHTML = `<img src="https://rayo-api.onrender.com/estadisticas/jugadores/goles_asistencias?cache=${t}">`;
}

document.addEventListener('DOMContentLoaded', function() {

    function refrescarCeldasEditables() {
        celdasEditables = document.querySelectorAll("#tabla-jugadores td.editable");
    }

    // ============================
    // MENÚ
    // ============================

    botonMenuInicio.addEventListener("click", (event) => {
        event.preventDefault();
        contenedorPartidos.style.display = "none";
        botonMenuPartidos.style.background = azul;

        contenedorEstadisticas.style.display = "none";
        botonMenuEstadisticas.style.background = azul;

        contenedorInicio.style.display = "flex";
        botonMenuInicio.style.background = negro;
    });

    botonMenuPartidos.addEventListener("click", (event) => {
        event.preventDefault();
        contenedorEstadisticas.style.display = "none";
        botonMenuEstadisticas.style.background = azul;

        contenedorInicio.style.display = "none";
        botonMenuInicio.style.background = azul;

        contenedorPartidos.style.display = "flex";
        botonMenuPartidos.style.background = negro;
    });

    botonMenuEstadisticas.addEventListener("click", async (event) => {
        event.preventDefault();
        contenedorInicio.style.display = "none";
        botonMenuInicio.style.background = azul;

        contenedorPartidos.style.display = "none";
        botonMenuPartidos.style.background = azul;

        contenedorEstadisticas.style.display = "flex";
        botonMenuEstadisticas.style.background = negro;

        await cargarGraficas();
    });
});
=======
var botonMenuInicio = document.getElementById("botonMenuInicio");
var botonMenuPartidos = document.getElementById("botonMenuPartidos");
var botonMenuEstadisticas = document.getElementById("botonMenuEstadisticas");
var contenedorInicio = document.getElementById("contenedor-tabla-jugadores");
var contenedorPartidos = document.getElementById("contenedor-partidos");
var contenedorEstadisticas = document.getElementById("contenedor-graficas");

var graficoPartidosJugados = document.getElementById("grafico-partidos-jugados");
var graficoGoles = document.getElementById("grafico-goles");
var graficoAsistencias = document.getElementById("grafico-asistencias");
var graficoGolesAsistencias = document.getElementById("grafico-goles-asistencias");

var azul = "#0057b8";
var negro = "#000000";

async function cargarGraficas() {
    const t = Date.now();
    graficoPartidosJugados.innerHTML = `<img src="https://rayo-api.onrender.com/estadisticas/jugadores/partidos?cache=${t}">`;
    graficoGoles.innerHTML = `<img src="https://rayo-api.onrender.com/estadisticas/jugadores/goles?cache=${t}">`;
    graficoAsistencias.innerHTML = `<img src="https://rayo-api.onrender.com/estadisticas/jugadores/asistencias?cache=${t}">`;
    graficoGolesAsistencias.innerHTML = `<img src="https://rayo-api.onrender.com/estadisticas/jugadores/goles_asistencias?cache=${t}">`;
}

document.addEventListener('DOMContentLoaded', function() {

    function refrescarCeldasEditables() {
        celdasEditables = document.querySelectorAll("#tabla-jugadores td.editable");
    }

    // ============================
    // MENÚ
    // ============================

    botonMenuInicio.addEventListener("click", (event) => {
        event.preventDefault();
        contenedorPartidos.style.display = "none";
        botonMenuPartidos.style.background = azul;

        contenedorEstadisticas.style.display = "none";
        botonMenuEstadisticas.style.background = azul;

        contenedorInicio.style.display = "flex";
        botonMenuInicio.style.background = negro;
    });

    botonMenuPartidos.addEventListener("click", (event) => {
        event.preventDefault();
        contenedorEstadisticas.style.display = "none";
        botonMenuEstadisticas.style.background = azul;

        contenedorInicio.style.display = "none";
        botonMenuInicio.style.background = azul;

        contenedorPartidos.style.display = "flex";
        botonMenuPartidos.style.background = negro;
    });

    botonMenuEstadisticas.addEventListener("click", async (event) => {
        event.preventDefault();
        contenedorInicio.style.display = "none";
        botonMenuInicio.style.background = azul;

        contenedorPartidos.style.display = "none";
        botonMenuPartidos.style.background = azul;

        contenedorEstadisticas.style.display = "flex";
        botonMenuEstadisticas.style.background = negro;

        await cargarGraficas();
    });
});
>>>>>>> 9989992ca0eb607f8d858f57431169d8d0bba6ad
