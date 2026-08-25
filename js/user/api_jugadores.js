var tablaJugadores = document.getElementById("tabla-jugadores");

async function obtenerJugadores() {
    const respuesta = await fetch("https://rayo-api.onrender.com/jugadores/");
    return await respuesta.json(); 
}

async function cargarDatos() {
    const jugadores = await obtenerJugadores();

    var cabeceraHtml = `
        <tr>
            <th>Jugador</th>
            <th>PJ</th>
            <th>Goles</th>
            <th>Asistencias</th>
            <th>G+A</th>
        </tr>
    `;
    
    var datosHtml = "";

    for (var jugador of jugadores) {
        datosHtml += `
            <tr data-numero="${jugador.numero}"
                data-original='${JSON.stringify({
                    nombre: jugador.nombre,
                    partidos_jugados: jugador.partidos_jugados,
                    goles: jugador.goles,
                    asistencias: jugador.asistencias
                })}'>
                <td class="nombre">${jugador.nombre} ${jugador.numero}</td>
                <td class="editable pj">${jugador.partidos_jugados}</td>
                <td class="editable goles">${jugador.goles}</td>
                <td class="editable asistencias">${jugador.asistencias}</td>
                <td>${jugador.goles + jugador.asistencias}</td>
            </tr>
        `;
    }

    tablaJugadores.innerHTML = cabeceraHtml + datosHtml;
}

document.addEventListener('DOMContentLoaded', async() => {
    // OBTENER JUGADORES
    cargarDatos();
});