var botonMenuInicio = document.getElementById("botonMenuInicio");
var botonMenuPartidos = document.getElementById("botonMenuPartidos");
var botonMenuEstadisticas = document.getElementById("botonMenuEstadisticas");
var contenedorInicio = document.getElementById("contenedor-tabla-jugadores");
var contenedorPartidos = document.getElementById("contenedor-partidos");
var contenedorEstadisticas = document.getElementById("contenedor-graficas");

var botonAñadirJugador = document.getElementById("boton-añadir-jugador");
var botonModificarJugador = document.getElementById("boton-modificar-jugador");
var botonEliminarJugador = document.getElementById("boton-eliminar-jugador");

var botonCancelar = document.querySelectorAll(".boton-cancelar");

var celdasEditables = document.querySelectorAll("#tabla-jugadores td.editable");
var botonGuardar = document.getElementById("guardar-cambios");
var botonCancelarEdicion = document.getElementById("cancelar-edicion");
var botonGuardarPartidos = document.getElementById("guardar-cambios-partidos");
var botonCancelarEdicionPartidos = document.getElementById("cancelar-edicion-partidos");

let modoEdicion = false;
let valoresOriginales = [];

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

    // ============================
    // POP-UPS
    // ============================

    botonAñadirJugador.addEventListener("click", () => {
        document.getElementById("overlay-añadir-jugador").style.display = "flex";
    });
    
    botonEliminarJugador.addEventListener("click", () => {
        document.getElementById("overlay-eliminar-jugador").style.display = "flex";
    });

    botonCancelar.forEach(boton => {
        boton.addEventListener("click", () => {
            const overlay = boton.closest(".pop-up-overlay");
            if (!overlay) return;

            overlay.style.display = "none";

            overlay.querySelectorAll("input").forEach(input => {
                if (input.type === "text" || input.type === "number" || input.type === "date") {
                    input.value = "";
                }
            });

            overlay.querySelectorAll("select").forEach(select => {
                select.selectedIndex = 0;
            });
        });
    });

    // ============================
    // MODO EDICIÓN TABLA JUGADORES
    // ============================

    botonModificarJugador.addEventListener("click", () => {

        if (modoEdicion) return;
        modoEdicion = true;

        refrescarCeldasEditables();

        // Guardar valores originales
        valoresOriginales = [];
        celdasEditables.forEach(celda => valoresOriginales.push(celda.textContent.trim()));

        // Convertir celdas en inputs
        celdasEditables.forEach((celda, index) => {
            const valor = celda.textContent.trim();
            celda.innerHTML = `<input type="number" min="0" class="input-editar" value="${valor}">`;
            celda.classList.add("editando");

            const input = celda.querySelector("input");

            // Recalcular G+A en tiempo real SOLO si es goles (index 2) o asistencias (index 3)
            input.addEventListener("input", () => {
                const fila = celda.parentElement;

                const golesInput = fila.children[2].querySelector("input");
                const asistInput = fila.children[3].querySelector("input");

                const goles = parseInt(golesInput?.value) || 0;
                const asist = parseInt(asistInput?.value) || 0;

                fila.children[4].textContent = goles + asist;
            });
        });


        botonGuardar.style.display = "inline-block";
        botonCancelarEdicion.style.display = "inline-block";
    });

    // GUARDAR CAMBIOS
    botonGuardar.addEventListener("click", () => {

        if (!modoEdicion) return;
        modoEdicion = false;

        celdasEditables.forEach(celda => {
            const input = celda.querySelector("input");
            celda.textContent = input.value;
            celda.classList.remove("editando");
        });

        // Recalcular G+A
        document.querySelectorAll("#tabla-jugadores tr").forEach((fila, index) => {
            // Saltar la cabecera
            if (index === 0) return;

            const celdas = fila.children;
            if (celdas.length === 5) {
                const goles = parseInt(celdas[2].textContent) || 0;
                const asist = parseInt(celdas[3].textContent) || 0;
                celdas[4].textContent = goles + asist;
            }
        });

        botonGuardar.style.display = "none";
        botonCancelarEdicion.style.display = "none";
    });

    botonCancelarEdicion.addEventListener("click", () => {
        if (!modoEdicion) return;
        modoEdicion = false;

        // Restaurar valores originales
        celdasEditables.forEach((celda, i) => {
            celda.textContent = valoresOriginales[i];
            celda.classList.remove("editando");
        });

        // Recalcular G+A correctamente
        document.querySelectorAll("#tabla-jugadores tr").forEach((fila, index) => {
            // Saltar la cabecera
            if (index === 0) return;

            const celdas = fila.children;
            if (celdas.length === 5) {
                const goles = parseInt(celdas[2].textContent) || 0;
                const asist = parseInt(celdas[3].textContent) || 0;
                celdas[4].textContent = goles + asist;
            }
        });

        botonGuardar.style.display = "none";
        botonCancelarEdicion.style.display = "none";
    });
});
