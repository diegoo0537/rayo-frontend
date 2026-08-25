<<<<<<< HEAD
var tablaPartidos = document.getElementById("tabla-partidos");
var botonAñadirPartido = document.getElementById("boton-añadir-partido");
var botonModificarPartido = document.getElementById("boton-modificar-partido");
var botonEliminarPartido = document.getElementById("boton-eliminar-partido");
var fechaAñadir = document.getElementById("fecha-añadir");
var horaAñadir = document.getElementById("hora-añadir");
var eqLoAñadir = document.getElementById("eq-lo-añadir");
var eqViAñadir = document.getElementById("eq-vi-añadir");
var colorAñadir = document.getElementById("color-añadir");
var estadoAñadir = document.getElementById("estado-añadir");
var botonConfirmarAñadirPartido = document.getElementById("añadir-partido");
var fechaEliminar = document.getElementById("fecha-eliminar");
var botonConfirmarEliminarPartido = document.getElementById("eliminar-partido");

async function obtenerPartidos() {
    const res = await fetch("https://rayo-api.onrender.com/partidos/");
    return await res.json();
}

async function añadirPartido(partido) {
    const res = await fetch("https://rayo-api.onrender.com/partidos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partido)
    });
    return await res.json();
}

async function modificarPartido() {
    const filas = document.querySelectorAll("#tabla-partidos tr[data-fecha]");

    for (const fila of filas) {
        const fecha = fila.dataset.fecha;
        const original = JSON.parse(fila.dataset.original);

        const dropdown = fila.querySelector(".dropdown-estado");
        const estado = dropdown ? dropdown.dataset.valor : original.estado;

        const actualizado = { estado };

        const haCambiado = actualizado.estado !== original.estado;

        if (!haCambiado) continue;

        await fetch(`https://rayo-api.onrender.com/partidos/${fecha}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(actualizado)
        });
    }

    return true;
}

async function eliminarPartido(fecha) {
    const res = await fetch(`https://rayo-api.onrender.com/partidos/${fecha}`, {
        method: "DELETE"
    });
    return await res.json();
}

function formatearFecha(fechaISO) {
    const [año, mes, dia] = fechaISO.split("-");
    return `${dia} / ${mes} / ${año}`;
}

async function cargarPartidos() {
    const partidos = await obtenerPartidos();

    let html = `
        <tr>
            <th>Fecha</th>
            <th>Horario</th>
            <th>Partido</th>
            <th>Color</th>
            <th>Estado</th>
        </tr>
    `;

    for (const partido of partidos) {
        html += `
            <tr data-fecha="${partido.fecha}"
                data-original='${JSON.stringify({
                    hora: partido.hora,
                    equipo_lo: partido.equipo_lo,
                    equipo_vi: partido.equipo_vi,
                    color: partido.color,
                    estado: partido.estado
                })}'>
                <td>${formatearFecha(partido.fecha)}</td>
                <td class="hora">${partido.hora}</td>
                <td class="equipos">${partido.equipo_lo} - ${partido.equipo_vi}</td>
                <td class="color"><div class="color-circulo" style="background:${partido.color};"></div></td>
                <td class="estado">${partido.estado}</td>
            </tr>
        `;
    }

    tablaPartidos.innerHTML = html;
}

async function manejarAñadirPartido() {
    if (
        fechaAñadir.value === "" ||
        horaAñadir.value === "" ||
        eqLoAñadir.value === "" ||
        eqViAñadir.value === "" ||
        colorAñadir.value === "" ||
        estadoAñadir.value === ""
    ) {
        alert("Rellena todos los campos");
        return;
    }

    const colores = {
        azul: "#0057b8",
        negro: "#000000"
    };

    const partido = {
        fecha: fechaAñadir.value,
        hora: horaAñadir.value,
        equipo_lo: eqLoAñadir.value,
        equipo_vi: eqViAñadir.value,
        color: colores[colorAñadir.value],
        estado: estadoAñadir.value
    };

    const ok = await añadirPartido(partido);

    if (ok) {
        alert("Partido añadido correctamente");

        document.getElementById("overlay-añadir-partido").style.display = "none";
        fechaAñadir.value = "";
        horaAñadir.selectedIndex = 0;
        eqLoAñadir.value = "";
        eqViAñadir.value = "";
        colorAñadir.selectedIndex  = 0;
        estadoAñadir.selectedIndex  = 0;

        cargarPartidos();
    } else {
        alert("Ya existe un partido en esa fecha");
    }
}

async function manejarEliminarPartido() {
    if (fechaEliminar.value === "") {
        alert("Introduce una fecha");
        return;
    }

    const ok = await eliminarPartido(fechaEliminar.value);

    if (ok) {
        alert("Partido eliminado correctamente");

        document.getElementById("overlay-eliminar-partido").style.display = "none";
        fechaEliminar.value = "";

        cargarPartidos();
    } else {
        alert("No existe un partido en esa fecha");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const selectHora = document.getElementById("hora-añadir");

    for (let h = 0; h < 24; h++) {
        const hora = h.toString().padStart(2, "0") + ":00";
        const option = document.createElement("option");
        option.value = hora;
        option.textContent = hora;
        selectHora.appendChild(option);
    }

    cargarPartidos();

    // Abrir pop-ups
    botonAñadirPartido.addEventListener("click", () => {
        document.getElementById("overlay-añadir-partido").style.display = "flex";
    });

    let modoEdicionPartidos = false;

    botonModificarPartido.addEventListener("click", () => {
        if (modoEdicionPartidos) return;
        modoEdicionPartidos = true;

        const filas = document.querySelectorAll("#tabla-partidos tr[data-fecha]");

        filas.forEach(fila => {
            // ESTADO
            const celdaEstado = fila.querySelector(".estado");
            const original = JSON.parse(fila.dataset.original);
            const valorEstado = original.estado; // tal cual viene del backend
            celdaEstado.innerHTML = `
                <div class="dropdown-estado" data-valor="${valorEstado}">
                    <div class="dropdown-display">
                        ${valorEstado}
                        <span class="flecha">▼</span>
                    </div>
                    <div class="dropdown-opciones">
                        <div data-value="NO JUGADO">No jugado</div>
                        <div data-value="GANADO">Ganado</div>
                        <div data-value="EMPATADO">Empatado</div>
                        <div data-value="PERDIDO">Perdido</div>
                    </div>
                </div>
            `;
        });

        document.getElementById("guardar-cambios-partidos").style.display = "inline-block";
        document.getElementById("cancelar-edicion-partidos").style.display = "inline-block";
    });

    document.getElementById("guardar-cambios-partidos").addEventListener("click", async () => {
        const ok = await modificarPartido();
        if (ok) {
            alert("Partidos modificados correctamente");
            modoEdicionPartidos = false;
            cargarPartidos();

            document.getElementById("guardar-cambios-partidos").style.display = "none";
            document.getElementById("cancelar-edicion-partidos").style.display = "none";
        }
    });

    document.getElementById("cancelar-edicion-partidos").addEventListener("click", () => {
        modoEdicionPartidos = false;
        cargarPartidos();

        document.getElementById("guardar-cambios-partidos").style.display = "none";
        document.getElementById("cancelar-edicion-partidos").style.display = "none";
    });


    botonEliminarPartido.addEventListener("click", () => {
        document.getElementById("overlay-eliminar-partido").style.display = "flex";
    });

    // Confirmar añadir
    botonConfirmarAñadirPartido.addEventListener("click", manejarAñadirPartido);

    fechaAñadir.addEventListener("keydown", e => e.key === "Enter" && manejarAñadirPartido());
    eqLoAñadir.addEventListener("keydown", e => e.key === "Enter" && manejarAñadirPartido());
    eqViAñadir.addEventListener("keydown", e => e.key === "Enter" && manejarAñadirPartido());

    // Confirmar eliminar
    botonConfirmarEliminarPartido.addEventListener("click", manejarEliminarPartido);

    fechaEliminar.addEventListener("keydown", e => e.key === "Enter" && manejarEliminarPartido());

    // PDF
    document.getElementById("boton-descargar-pdf").addEventListener("click", async () => {

        // Preguntar primero
        const confirmar = confirm("¿Quieres descargar el PDF de los partidos?");
        if (!confirmar) return;

        const tabla = document.getElementById("tabla-partidos");

        // Convertir tabla a imagen
        const canvas = await html2canvas(tabla, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        // Crear PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("p", "mm", "a4");

        // ============================
        // 1. AÑADIR ESCUDO
        // ============================
        const escudo = new Image();
        escudo.src = "img/escudo_Rayo_Hortaleza.jpeg";

        await new Promise(resolve => {
            escudo.onload = resolve;
        });

        pdf.addImage(escudo, "JPEG", 85, 10, 40, 40); 

        // ============================
        // 2. TÍTULO
        // ============================
        pdf.setFontSize(22);
        pdf.setTextColor(0, 0, 0);
        pdf.text("RAYO DE HORTALEZA", 105, 60, { align: "center" });

        pdf.setFontSize(14);
        pdf.text("Calendario de Partidos", 105, 70, { align: "center" });

        // ============================
        // 3. TABLA
        // ============================
        const imgWidth = 160;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (imgHeight > 180) {
            let remainingHeight = imgHeight;
            let position = 80;

            while (remainingHeight > 0) {
                pdf.addImage(imgData, "PNG", 25, position, imgWidth, imgHeight);
                remainingHeight -= 250;

                if (remainingHeight > 0) {
                    pdf.addPage();
                    position = 20;
                }
            }
        } else {
            pdf.addImage(imgData, "PNG", 25, 80, imgWidth, imgHeight);
        }

        // Guardar PDF
        pdf.save("partidos.pdf");
    });

    document.addEventListener("click", (e) => {
        // Cerrar todos los dropdowns si haces click fuera
        document.querySelectorAll(".dropdown-opciones").forEach(menu => {
            if (!menu.contains(e.target) && !menu.previousElementSibling.contains(e.target)) {
                menu.style.display = "none";
            }
        });

        // Abrir dropdown
        if (e.target.closest(".dropdown-display")) {
            const display = e.target.closest(".dropdown-display");
            const opciones = display.nextElementSibling;
            opciones.style.display = opciones.style.display === "flex" ? "none" : "flex";
        }

        // Seleccionar opción
        if (e.target.closest(".dropdown-opciones div")) {
            const opcion = e.target.closest(".dropdown-opciones div");
            const valor = opcion.dataset.value;

            const dropdown = opcion.closest(".dropdown-estado");
            const display = dropdown.querySelector(".dropdown-display");

            display.innerHTML = `${valor} <span class="flecha">▼</span>`;
            dropdown.dataset.valor = valor;

            opcion.parentElement.style.display = "none";
        }
    });
=======
var tablaPartidos = document.getElementById("tabla-partidos");
var botonAñadirPartido = document.getElementById("boton-añadir-partido");
var botonModificarPartido = document.getElementById("boton-modificar-partido");
var botonEliminarPartido = document.getElementById("boton-eliminar-partido");
var fechaAñadir = document.getElementById("fecha-añadir");
var horaAñadir = document.getElementById("hora-añadir");
var eqLoAñadir = document.getElementById("eq-lo-añadir");
var eqViAñadir = document.getElementById("eq-vi-añadir");
var colorAñadir = document.getElementById("color-añadir");
var estadoAñadir = document.getElementById("estado-añadir");
var botonConfirmarAñadirPartido = document.getElementById("añadir-partido");
var fechaEliminar = document.getElementById("fecha-eliminar");
var botonConfirmarEliminarPartido = document.getElementById("eliminar-partido");

async function obtenerPartidos() {
    const res = await fetch("https://rayo-api.onrender.com/partidos/");
    return await res.json();
}

async function añadirPartido(partido) {
    const res = await fetch("https://rayo-api.onrender.com/partidos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partido)
    });
    return await res.json();
}

async function modificarPartido() {
    const filas = document.querySelectorAll("#tabla-partidos tr[data-fecha]");

    for (const fila of filas) {
        const fecha = fila.dataset.fecha;
        const original = JSON.parse(fila.dataset.original);

        const dropdown = fila.querySelector(".dropdown-estado");
        const estado = dropdown ? dropdown.dataset.valor : original.estado;

        const actualizado = { estado };

        const haCambiado = actualizado.estado !== original.estado;

        if (!haCambiado) continue;

        await fetch(`https://rayo-api.onrender.com/partidos/${fecha}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(actualizado)
        });
    }

    return true;
}

async function eliminarPartido(fecha) {
    const res = await fetch(`https://rayo-api.onrender.com/partidos/${fecha}`, {
        method: "DELETE"
    });
    return await res.json();
}

function formatearFecha(fechaISO) {
    const [año, mes, dia] = fechaISO.split("-");
    return `${dia} / ${mes} / ${año}`;
}

async function cargarPartidos() {
    const partidos = await obtenerPartidos();

    let html = `
        <tr>
            <th>Fecha</th>
            <th>Horario</th>
            <th>Partido</th>
            <th>Color</th>
            <th>Estado</th>
        </tr>
    `;

    for (const partido of partidos) {
        html += `
            <tr data-fecha="${partido.fecha}"
                data-original='${JSON.stringify({
                    hora: partido.hora,
                    equipo_lo: partido.equipo_lo,
                    equipo_vi: partido.equipo_vi,
                    color: partido.color,
                    estado: partido.estado
                })}'>
                <td>${formatearFecha(partido.fecha)}</td>
                <td class="hora">${partido.hora}</td>
                <td class="equipos">${partido.equipo_lo} - ${partido.equipo_vi}</td>
                <td class="color"><div class="color-circulo" style="background:${partido.color};"></div></td>
                <td class="estado">${partido.estado}</td>
            </tr>
        `;
    }

    tablaPartidos.innerHTML = html;
}

async function manejarAñadirPartido() {
    if (
        fechaAñadir.value === "" ||
        horaAñadir.value === "" ||
        eqLoAñadir.value === "" ||
        eqViAñadir.value === "" ||
        colorAñadir.value === "" ||
        estadoAñadir.value === ""
    ) {
        alert("Rellena todos los campos");
        return;
    }

    const colores = {
        azul: "#0057b8",
        negro: "#000000"
    };

    const partido = {
        fecha: fechaAñadir.value,
        hora: horaAñadir.value,
        equipo_lo: eqLoAñadir.value,
        equipo_vi: eqViAñadir.value,
        color: colores[colorAñadir.value],
        estado: estadoAñadir.value
    };

    const ok = await añadirPartido(partido);

    if (ok) {
        alert("Partido añadido correctamente");

        document.getElementById("overlay-añadir-partido").style.display = "none";
        fechaAñadir.value = "";
        horaAñadir.selectedIndex = 0;
        eqLoAñadir.value = "";
        eqViAñadir.value = "";
        colorAñadir.selectedIndex  = 0;
        estadoAñadir.selectedIndex  = 0;

        cargarPartidos();
    } else {
        alert("Ya existe un partido en esa fecha");
    }
}

async function manejarEliminarPartido() {
    if (fechaEliminar.value === "") {
        alert("Introduce una fecha");
        return;
    }

    const ok = await eliminarPartido(fechaEliminar.value);

    if (ok) {
        alert("Partido eliminado correctamente");

        document.getElementById("overlay-eliminar-partido").style.display = "none";
        fechaEliminar.value = "";

        cargarPartidos();
    } else {
        alert("No existe un partido en esa fecha");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const selectHora = document.getElementById("hora-añadir");

    for (let h = 0; h < 24; h++) {
        const hora = h.toString().padStart(2, "0") + ":00";
        const option = document.createElement("option");
        option.value = hora;
        option.textContent = hora;
        selectHora.appendChild(option);
    }

    cargarPartidos();

    // Abrir pop-ups
    botonAñadirPartido.addEventListener("click", () => {
        document.getElementById("overlay-añadir-partido").style.display = "flex";
    });

    let modoEdicionPartidos = false;

    botonModificarPartido.addEventListener("click", () => {
        if (modoEdicionPartidos) return;
        modoEdicionPartidos = true;

        const filas = document.querySelectorAll("#tabla-partidos tr[data-fecha]");

        filas.forEach(fila => {
            // ESTADO
            const celdaEstado = fila.querySelector(".estado");
            const original = JSON.parse(fila.dataset.original);
            const valorEstado = original.estado; // tal cual viene del backend
            celdaEstado.innerHTML = `
                <div class="dropdown-estado" data-valor="${valorEstado}">
                    <div class="dropdown-display">
                        ${valorEstado}
                        <span class="flecha">▼</span>
                    </div>
                    <div class="dropdown-opciones">
                        <div data-value="NO JUGADO">No jugado</div>
                        <div data-value="GANADO">Ganado</div>
                        <div data-value="EMPATADO">Empatado</div>
                        <div data-value="PERDIDO">Perdido</div>
                    </div>
                </div>
            `;
        });

        document.getElementById("guardar-cambios-partidos").style.display = "inline-block";
        document.getElementById("cancelar-edicion-partidos").style.display = "inline-block";
    });

    document.getElementById("guardar-cambios-partidos").addEventListener("click", async () => {
        const ok = await modificarPartido();
        if (ok) {
            alert("Partidos modificados correctamente");
            modoEdicionPartidos = false;
            cargarPartidos();

            document.getElementById("guardar-cambios-partidos").style.display = "none";
            document.getElementById("cancelar-edicion-partidos").style.display = "none";
        }
    });

    document.getElementById("cancelar-edicion-partidos").addEventListener("click", () => {
        modoEdicionPartidos = false;
        cargarPartidos();

        document.getElementById("guardar-cambios-partidos").style.display = "none";
        document.getElementById("cancelar-edicion-partidos").style.display = "none";
    });


    botonEliminarPartido.addEventListener("click", () => {
        document.getElementById("overlay-eliminar-partido").style.display = "flex";
    });

    // Confirmar añadir
    botonConfirmarAñadirPartido.addEventListener("click", manejarAñadirPartido);

    fechaAñadir.addEventListener("keydown", e => e.key === "Enter" && manejarAñadirPartido());
    eqLoAñadir.addEventListener("keydown", e => e.key === "Enter" && manejarAñadirPartido());
    eqViAñadir.addEventListener("keydown", e => e.key === "Enter" && manejarAñadirPartido());

    // Confirmar eliminar
    botonConfirmarEliminarPartido.addEventListener("click", manejarEliminarPartido);

    fechaEliminar.addEventListener("keydown", e => e.key === "Enter" && manejarEliminarPartido());

    // PDF
    document.getElementById("boton-descargar-pdf").addEventListener("click", async () => {

        // Preguntar primero
        const confirmar = confirm("¿Quieres descargar el PDF de los partidos?");
        if (!confirmar) return;

        const tabla = document.getElementById("tabla-partidos");

        // Convertir tabla a imagen
        const canvas = await html2canvas(tabla, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        // Crear PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF("p", "mm", "a4");

        // ============================
        // 1. AÑADIR ESCUDO
        // ============================
        const escudo = new Image();
        escudo.src = "img/escudo_Rayo_Hortaleza.jpeg";

        await new Promise(resolve => {
            escudo.onload = resolve;
        });

        pdf.addImage(escudo, "JPEG", 85, 10, 40, 40); 

        // ============================
        // 2. TÍTULO
        // ============================
        pdf.setFontSize(22);
        pdf.setTextColor(0, 0, 0);
        pdf.text("RAYO DE HORTALEZA", 105, 60, { align: "center" });

        pdf.setFontSize(14);
        pdf.text("Calendario de Partidos", 105, 70, { align: "center" });

        // ============================
        // 3. TABLA
        // ============================
        const imgWidth = 160;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (imgHeight > 180) {
            let remainingHeight = imgHeight;
            let position = 80;

            while (remainingHeight > 0) {
                pdf.addImage(imgData, "PNG", 25, position, imgWidth, imgHeight);
                remainingHeight -= 250;

                if (remainingHeight > 0) {
                    pdf.addPage();
                    position = 20;
                }
            }
        } else {
            pdf.addImage(imgData, "PNG", 25, 80, imgWidth, imgHeight);
        }

        // Guardar PDF
        pdf.save("partidos.pdf");
    });

    document.addEventListener("click", (e) => {
        // Cerrar todos los dropdowns si haces click fuera
        document.querySelectorAll(".dropdown-opciones").forEach(menu => {
            if (!menu.contains(e.target) && !menu.previousElementSibling.contains(e.target)) {
                menu.style.display = "none";
            }
        });

        // Abrir dropdown
        if (e.target.closest(".dropdown-display")) {
            const display = e.target.closest(".dropdown-display");
            const opciones = display.nextElementSibling;
            opciones.style.display = opciones.style.display === "flex" ? "none" : "flex";
        }

        // Seleccionar opción
        if (e.target.closest(".dropdown-opciones div")) {
            const opcion = e.target.closest(".dropdown-opciones div");
            const valor = opcion.dataset.value;

            const dropdown = opcion.closest(".dropdown-estado");
            const display = dropdown.querySelector(".dropdown-display");

            display.innerHTML = `${valor} <span class="flecha">▼</span>`;
            dropdown.dataset.valor = valor;

            opcion.parentElement.style.display = "none";
        }
    });
>>>>>>> 9989992ca0eb607f8d858f57431169d8d0bba6ad
});