const tablaPartidos = document.getElementById("tabla-partidos");
const botonAñadirPartido = document.getElementById("boton-añadir-partido");
const botonEliminarPartido = document.getElementById("boton-eliminar-partido");
const botonConfirmarAñadirPartido = document.getElementById("añadir-partido");
const fechaEliminar = document.getElementById("fecha-eliminar");
const botonConfirmarEliminarPartido = document.getElementById("eliminar-partido");

async function obtenerPartidos() {
    const res = await fetch("https://rayo-api.onrender.com/partidos/");
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
            <tr>
                <td>${formatearFecha(partido.fecha)}</td>
                <td>${partido.hora}</td>
                <td>${partido.equipo_lo} - ${partido.equipo_vi}</td>
                <td><div class="color-circulo" style="background:${partido.color};"></td>
                <td>${partido.estado}</td>
            </tr>
        `;
    }

    tablaPartidos.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", () => {
    cargarPartidos();

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
            let position = y;

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
});