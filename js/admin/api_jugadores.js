var nombreAñadir = document.getElementById("nombre-añadir");
var numeroAñadir = document.getElementById("numero-añadir");
var botonAñadir = document.getElementById("añadir-jugador");
var tablaJugadores = document.getElementById("tabla-jugadores");
var botonModificar = document.getElementById("boton-modificar-jugador");
var botonGuardar = document.getElementById("guardar-cambios");
var numeroEliminar = document.getElementById("numero-eliminar");
var botonEliminar = document.getElementById("eliminar-jugador");
var botonPopUpAñadirJugador = document.getElementById("añadir-jugador");
var botonPopUpEliminarJugador = document.getElementById("eliminar-jugador");

async function obtenerJugadores() {
    const respuesta = await fetch("https://rayo-api.onrender.com/jugadores/");
    return await respuesta.json(); 
}

async function añadirJugador(jugador) {
    const respuesta = await fetch("https://rayo-api.onrender.com/jugadores/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jugador)
    });

    return await respuesta.json(); 
}

async function modificarJugadores() {
    const filas = document.querySelectorAll("#tabla-jugadores tr[data-numero]");

    const leerNumero = (celda) => {
        const input = celda.querySelector("input");
        const raw = input ? input.value : celda.textContent;
        const n = parseInt(raw);
        return isNaN(n) ? null : n;
    };

    for (const fila of filas) {
        const numero = fila.dataset.numero;
        const original = JSON.parse(fila.dataset.original);

        const pj = leerNumero(fila.querySelector(".pj"));
        const goles = leerNumero(fila.querySelector(".goles"));
        const asistencias = leerNumero(fila.querySelector(".asistencias"));

        const actualizado = {
            partidos_jugados: pj,
            goles: goles,
            asistencias: asistencias
        };

        const haCambiado =
            actualizado.partidos_jugados !== original.partidos_jugados ||
            actualizado.goles !== original.goles ||
            actualizado.asistencias !== original.asistencias;

        if (!haCambiado) continue;

        // Eliminar campos null (no modificados)
        Object.keys(actualizado).forEach(k => {
            if (actualizado[k] === null) delete actualizado[k];
        });

        if (Object.keys(actualizado).length === 0) continue;

        await fetch(`https://rayo-api.onrender.com/jugadores/${numero}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(actualizado)
        });
    }

    return true;
}

async function eliminarJugador(numero) {
    const respuesta = await fetch(`https://rayo-api.onrender.com/jugadores/${numero}`, {
        method: 'DELETE'
    });

    return respuesta.ok;  
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

function capitalizarNombre(nombre) {
    return nombre
        .toLowerCase()
        .split(" ")
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");
}

async function manejarAñadirJugador() {
    if (nombreAñadir.value !== "" && numeroAñadir.value !== "") {
        const respuesta = await añadirJugador({
            nombre: nombreAñadir.value,
            numero: parseInt(numeroAñadir.value),
            partidos_jugados: 0,
            goles: 0,
            asistencias: 0
        });

        if (respuesta) {
            alert("Se ha añadido al jugador " + capitalizarNombre(nombreAñadir.value));
            document.getElementById("overlay-añadir-jugador").style.display = "none";
            nombreAñadir.value = "";
            numeroAñadir.value = "";
            cargarDatos();
        } else {
            alert("Ya existe un jugador con ese dorsal");
        }
    } else {
        alert("Rellena todos los campos");
    }
}

async function manejarEliminarJugador() {
    if (numeroEliminar.value !== "") {
        const respuesta = await eliminarJugador(numeroEliminar.value);

        if (respuesta) {
            alert("Se ha eliminado al jugador");
            document.getElementById("overlay-eliminar-jugador").style.display = "none";
            numeroEliminar.value = "";
            cargarDatos();
        } else {
            alert("No existe un jugador con ese dorsal");
        }
    } else {
        alert("Rellena todos los campos");
    }
}

document.addEventListener('DOMContentLoaded', async() => {
    // OBTENER JUGADORES
    cargarDatos();

    // AÑADIR JUGADOR
    // AÑADIR JUGADOR (click)
    botonAñadir.addEventListener("click", async (event) => {
        event.preventDefault();
        await manejarAñadirJugador();
    });

    // AÑADIR JUGADOR (Enter en nombre o dorsal)
    nombreAñadir.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            await manejarAñadirJugador();
        }
    });

    numeroAñadir.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            await manejarAñadirJugador();
        }
    });
    
    // MODIFICAR JUGADORES
    botonGuardar.addEventListener("click", async (event) => {
        event.preventDefault();
        const respuesta = await modificarJugadores();
        if (respuesta) {
            alert("Jugadores modificados correctamente");
            cargarDatos();
        } else {
            alert("Hubo un error al modificar los jugadores");
        }
    });

    // ELIMINAR JUGADOR (click)
    botonEliminar.addEventListener("click", async (event) => {
        event.preventDefault();
        await manejarEliminarJugador();
    });

    // ELIMINAR JUGADOR (Enter en dorsal)
    numeroEliminar.addEventListener("keydown", async (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            await manejarEliminarJugador();
        }
    });
});