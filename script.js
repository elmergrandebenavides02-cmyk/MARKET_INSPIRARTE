// 1. EL BLOQUE DE FRASES (Pega tus frases dentro de las llaves { })
const frasesDB = {
    "calma": [
        { "frase": "El silencio no está vacío, está lleno de respuestas.", "reto": "Permanece en silencio 10 min al despertar." }
    ],
    "resiliencia": [
        { "frase": "Nunca es tarde para ser lo que podrías haber sido.", "reto": "Dedica 15 min a un sueño abandonado." }
    ],
    "sabiduria": [
        { "frase": "La duda es el principio de la sabiduría.", "reto": "Investiga algo nuevo hoy." }
    ],
    "empatia": [
        { "frase": "Mira con los ojos de otro.", "reto": "Haz un cumplido sincero hoy." }
    ]
};

// 2. LA LÓGICA (Copia y pega esto tal cual abajo de las frases)
let pasilloActual = 'calma';
const colores = { 'resiliencia': '#4caf50', 'sabiduria': '#0288d1', 'calma': '#ff7043', 'empatia': '#fbc02d' };

window.onload = () => {
    // Detectar si hay un pasillo en la URL
    const params = new URLSearchParams(window.location.search);
    const p = params.get('p');
    if (p && frasesDB[p.toLowerCase()]) pasilloActual = p.toLowerCase();
    
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
    const datos = frasesDB[pasilloActual];
    if (!datos) return;

    const diaIndex = obtenerDiaDelAnio() % datos.length;
    const hoy = datos[diaIndex];

    // Actualizar Textos
    document.getElementById('titulo-pasillo').innerText = Pasillo de ${pasilloActual};
    document.getElementById('frase-display').innerText = hoy.frase;
    document.getElementById('reto-display').innerText = hoy.reto;

    // Actualizar Progreso
    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const numDias = (progreso[pasilloActual] || []).length;
    const porc = ((numDias / 365) * 100).toFixed(1);

    document.getElementById('porcentaje-valor').innerText = numDias;
    document.getElementById('porcentaje-txt').innerText = porc + "%";
    
    const barra = document.getElementById('bar-progreso');
    if(barra) {
        barra.style.width = porc + "%";
        barra.style.backgroundColor = colores[pasilloActual];
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
        alert("✨ ¡Reto Logrado!");
    }
}
