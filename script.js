[2:18 p. m., 5/2/2026] Elmer Grande Benavides: let pasilloActual = 'calma'; 
let db = {
    // Frases de respaldo por si el archivo datos.json falla
    "calma": [{"frase": "Respira hondo, todo fluye.", "reto": "Haz 3 respiraciones profundas ahora."}],
    "resiliencia": [{"frase": "Eres más fuerte de lo que crees.", "reto": "Escribe una victoria de ayer."}],
    "sabiduria": [{"frase": "Aprender es crecer.", "reto": "Lee 5 minutos de un libro."}],
    "empatia": [{"frase": "Conecta con el corazón.", "reto": "Envía un mensaje amable a alguien."}]
};

const colores = {
    'resiliencia': '#4caf50',
    'sabiduria': '#0288d1',
    'calma': '#ff7043',
    'empatia': '#fbc02d'
};

window.onload = async () => {
    try {
        const res = await fetch('datos.json');
        if (res.ok) {
            const da…
[2:28 p. m., 5/2/2026] Elmer Grande Benavides: // 1. LAS FRASES VAN AQUÍ ADENTRO (Eliminamos el fetch para evitar errores)
const frasesDB = {
    "calma": [
        { "frase": "El silencio no está vacío, está lleno de respuestas.", "reto": "Permanece en silencio 10 min al despertar." },
        { "frase": "Tu paz vale más que tener la razón.", "reto": "En una discusión, elige dejar de discutir aunque creas tener la razón." }
    ],
    "resiliencia": [
        { "frase": "Nunca es tarde para ser lo que podrías haber sido.", "reto": "Dedica 15 min a un sueño que habías abandonado." }
    ],
    "sabiduria": [
        { "frase": "La duda es el principio de la sabiduría.", "reto": "Investiga hoy algo que siempre te haya causado curiosidad." }
    ],
    "empatia": [
        { "frase": "Nadie sabe las batallas que otros están librando.", "reto": "Haz un cumplido sincero a alguien que te caiga difícil." }
    ]
};

let pasilloActual = 'calma';
const colores = {
    'resiliencia': '#4caf50',
    'sabiduria': '#0288d1',
    'calma': '#ff7043',
    'empatia': '#fbc02d'
};

// 2. Iniciar la aplicación
window.onload = () => {
    // Detectar si viene de un pasillo específico por URL (?p=calma)
    const params = new URLSearchParams(window.location.search);
    const p = params.get('p');
    if (p && frasesDB[p.toLowerCase()]) {
        pasilloActual = p.toLowerCase();
    }
    actualizarInterfaz();
};

function obtenerDiaDelAnio() {
    const ahora = new Date();
    const inicio = new Date(ahora.getFullYear(), 0, 0);
    const dif = ahora - inicio;
    return Math.floor(dif / (1000 * 60 * 60 * 24));
}

function cambiarPasillo(nuevo) {
    pasilloActual = nuevo;
    actualizarInterfaz();
}

function actualizarInterfaz() {
    const datos = frasesDB[pasilloActual];
    const diaIndex = obtenerDiaDelAnio() % datos.length;
    const hoy = datos[diaIndex];

    // Actualizar Textos
    document.getElementById('titulo-pasillo').innerText = Pasillo de ${pasilloActual};
    document.getElementById('frase-display').innerText = "${hoy.frase}";
    document.getElementById('reto-display').innerText = hoy.reto;
    document.getElementById('pasillo-nombre').innerText = pasilloActual.charAt(0).toUpperCase() + pasilloActual.slice(1);

    // Lógica de Progreso
    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const listaDias = progreso[pasilloActual] || [];
    const numDias = listaDias.length;
    const porc = ((numDias / 365) * 100).toFixed(1);

    document.getElementById('porcentaje-valor').innerText = numDias;
    document.getElementById('porcentaje-txt').innerText = porc + "%";
    
    // Mover barra y color
    const barra = document.getElementById('bar-progreso');
    if(barra) {
        barra.style.width = porc + "%";
        barra.style.backgroundColor = colores[pasilloActual];
    }

    // Estado del botón
    const fechaHoy = new Date().toISOString().split('T')[0];
    const btn = document.getElementById('btn-logrado');
    if(btn) {
        btn.style.backgroundColor = colores[pasilloActual];
        if (listaDias.includes(fechaHoy)) {
            btn.disabled = true;
            btn.innerText = "¡YA CUMPLIDO!";
            document.getElementById('logro-confirmacion').style.display = 'block';
        } else {
            btn.disabled = false;
            btn.innerText = "¡LOGRADO!";
            document.getElementById('logro-confirmacion').style.display = 'none';
        }
    }
}

function completarReto() {
    let progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    if (!progreso[pasilloActual]) progreso[pasilloActual] = [];
    
    const fechaHoy = new Date().toISOString().split('T')[0];
    if (!progreso[pasilloActual].includes(fechaHoy)) {
        progreso[pasilloActual].push(fechaHoy);
        localStorage.setItem('progreso_market', JSON.stringify(progreso));
        actualizarInterfaz();
        
        // Mostrar medalla al instante
        lanzarMedalla("🎖️", "¡Reto Logrado!", Has sumado un día más en el pasillo de ${pasilloActual}.);
    }
}

function lanzarMedalla(ico, tit, ms
