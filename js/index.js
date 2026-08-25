var botonSi = document.getElementById("botonSi");
var botonNo = document.getElementById("botonNo");

document.addEventListener('DOMContentLoaded', function() {
    botonSi.addEventListener("click", async(event) => {
        event.preventDefault();
        window.location.href = "password.html";
    });

    botonNo.addEventListener("click", async(event) => {
        event.preventDefault();
        window.location.href = "inicio.html";
    });
})