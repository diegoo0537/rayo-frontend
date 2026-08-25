<<<<<<< HEAD
const botonAcceder = document.getElementById("botonAcceder");
const msgError = document.getElementById("errorMsg");

async function obtenerPassword(password) {
    const res = await fetch(`https://rayo-api.onrender.com/password/?intento_password=${password}`);
    return await res.json();
}

async function validar() {
    const password = document.getElementById('contrasena').value;

    const ok = await obtenerPassword(password);

    if (ok === true) {
        window.location.href = "inicio_admin.html";
    } else {
        msgError.textContent = "Contraseña incorrecta";
        msgError.classList.remove("shake");
        void msgError.offsetWidth;
        msgError.classList.add("shake");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('contrasena');

    botonAcceder.addEventListener("click", () => validar());

    passwordInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            validar();
        }
    });
=======
const botonAcceder = document.getElementById("botonAcceder");
const msgError = document.getElementById("errorMsg");

async function obtenerPassword(password) {
    const res = await fetch(`https://rayo-api.onrender.com/password/?intento_password=${password}`);
    return await res.json();
}

async function validar() {
    const password = document.getElementById('contrasena').value;

    const ok = await obtenerPassword(password);

    if (ok === true) {
        window.location.href = "inicio_admin.html";
    } else {
        msgError.textContent = "Contraseña incorrecta";
        msgError.classList.remove("shake");
        void msgError.offsetWidth;
        msgError.classList.add("shake");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('contrasena');

    botonAcceder.addEventListener("click", () => validar());

    passwordInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            validar();
        }
    });
>>>>>>> 9989992ca0eb607f8d858f57431169d8d0bba6ad
});