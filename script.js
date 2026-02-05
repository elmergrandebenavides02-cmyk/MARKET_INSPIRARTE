// 1. CONFIGURACIÓN DE FRASES (Asegúrate de no borrar el signo "=" ni las llaves "{")
const frasesDB = {
    "calma": [
        { "frase": "El silencio no está vacío, está lleno de respuestas.", "reto": "Permanece en silencio total durante los primeros 10 minutos al despertar." },
        { "frase": "Tu paz vale más que tener la razón.", "reto": "En una discusión, elige dejar de discutir aunque creas que tienes la razón." }
    ],
    "resiliencia": [
        { "frase": "Nunca es tarde para ser lo que podrías haber sido.", "reto": "Dedica 15 minutos a un sueño que habías abandonado hace años." }
    ],
    "sabiduria": [
        { "frase": "La verdadera sabiduría está en reconocer la propia ignorancia.", "reto": "Aprende algo nuevo sobre un tema que desconozcas hoy." }
    ],
    "empatia": [
        { "frase": "La empatía es ver con los ojos de otro y sentir con el corazón de otro.", "reto": "Escucha a alguien hoy sin interrumpir ni juzgar." }
    ]
};

// 2. LÓGICA DE LA APLICACIÓN
let pasilloActual = 'calma';
const colores = { 'resiliencia': '#4caf50', 'sabiduria': '#0288d1', 'calma': '#ff7043', 'empatia': '#fbc02d' };

window.onload = () => {
    console.log("Iniciando Market Inspirarte...");
    
    // Detectar pasillo por URL (?p=resiliencia)
    const params = new URLSearchParams(window.location.search);
    const p = params.get('p');
    if (p && frasesDB[p.toLowerCase()]) {
        pasilloActual = p.toLowerCase();
    }
    
    actualizarInterfaz();
};

function cambiarPasillo(nuevo) {
    pasilloActual = nuevo;
    actualizarInterfaz();
}

function obtenerDiaDelAnio() {
    const ahora = new Date();
    const inicio = new Date(ahora.getFullYear(), 0, 0);
    return Math.floor((ahora - inicio) / 86400000);
}

function actualizarInterfaz() {
    // Validar que el pasillo existe en la base de datos
    const datos = frasesDB[pasilloActual];
    if (!datos) {
        console.error("Error: No se encontraron frases para " + pasilloActual);
        return;
    }

    const diaIndex = obtenerDiaDelAnio() % datos.length;
    const hoy = datos[diaIndex];

    // Actualizar elementos Visuales
    document.getElementById('titulo-pasillo').innerText = "Pasillo de " + pasilloActual;
    document.getElementById('frase-display').innerText = '"' + hoy.frase + '"';
    document.getElementById('reto-display').innerText = hoy.reto;

    // Actualizar Progreso y Racha
    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const listaDias = progreso[pasilloActual] || [];
    const numDias = listaDias.length;
    const porc = ((numDias / 365) * 100).toFixed(1);

    if(document.getElementById('porcentaje-valor')) document.getElementById('porcentaje-valor').innerText = numDias;
    if(document.getElementById('porcentaje-txt')) document.getElementById('porcentaje-txt').innerText = porc + "%";
    
    const barra = document.getElementById('bar-progreso');
    if(barra) {
        barra.style.width = porc + "%";
        barra.style.backgroundColor = colores[pasilloActual];
    }

    // Configurar Botón
    const btn = document.getElementById('btn-logrado');
    if(btn) {
        btn.style.backgroundColor = colores[pasilloActual];
        const fechaHoy = new Date().toISOString().split('T')[0];
        if (listaDias.includes(fechaHoy)) {
            btn.disabled = true;
            btn.innerText = "¡YA CUMPLIDO!";
        } else {
            btn.disabled = false;
            btn.innerText = "¡LOGRADO!";
        }
    }
}

function completarReto() {
    let progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    if (!progreso[pasilloActual]) progreso[pasilloActual] = [];
    
    const hoy = new Date().toISOString().split('T')[0];
    if (!progreso[pasilloActual].includes(hoy)) {
        progreso[pasilloActual].push(hoy);
        localStorage.setItem('progreso_market', JSON.stringify(progreso));
        actualizarInterfaz();
        alert("✨ ¡Reto Logrado! Sigue así.");
    }
}
