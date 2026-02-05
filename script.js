// --- BLOQUE DE TUS FRASES ---
// Asegúrate de que empiece con { y termine con }
const frasesDB = {
    "calma": [
        { "frase": "El silencio es el lenguaje de las respuestas.", "reto": "5 minutos de meditación." }
        // Aquí siguen todas tus demás frases...
    ],
    "resiliencia": [
        { "frase": "Tu fuerza es mayor que cualquier reto.", "reto": "Escribe un logro de hoy." }
    ],
    "sabiduria": [
        { "frase": "Saber es recordar.", "reto": "Lee 3 páginas de algo nuevo." }
    ],
    "empatia": [
        { "frase": "Mira con los ojos del otro.", "reto": "Haz un cumplido a un desconocido." }
    ]
};

// --- LÓGICA DE LA APLICACIÓN (No tocar nada de aquí abajo) ---
let pasilloActual = 'calma';
const colores = { 'resiliencia': '#4caf50', 'sabiduria': '#0288d1', 'calma': '#ff7043', 'empatia': '#fbc02d' };

window.onload = () => {
    console.log("Aplicación Iniciada");
    try {
        actualizarInterfaz();
    } catch (error) {
        console.error("Error crítico al cargar interfaz:", error);
        document.getElementById('frase-display').innerText = "Error al leer las frases. Revisa las comas y corchetes.";
    }
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
    // 1. Validar que existan datos
    const pasilloKey = pasilloActual.toLowerCase();
    const datos = frasesDB[pasilloKey];

    if (!datos || datos.length === 0) {
        document.getElementById('frase-display').innerText = "No se encontraron frases para este pasillo.";
        return;
    }

    // 2. Seleccionar frase por día
    const diaIndex = obtenerDiaDelAnio() % datos.length;
    const hoy = datos[diaIndex];

    // 3. Pintar en pantalla (Asegúrate que estos IDs existan en tu HTML)
    if(document.getElementById('titulo-pasillo')) 
        document.getElementById('titulo-pasillo').innerText = Pasillo de ${pasilloActual};
    
    if(document.getElementById('frase-display')) 
        document.getElementById('frase-display').innerText = hoy.frase;
    
    if(document.getElementById('reto-display')) 
        document.getElementById('reto-display').innerText = hoy.reto;

    // 4. Actualizar Barra y Racha
    actualizarProgresoVisual();
}

function actualizarProgresoVisual() {
    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const listaDias = progreso[pasilloActual] || [];
    const numDias = listaDias.length;
    const porc = ((numDias / 365) * 100).toFixed(1);

    if(document.getElementById('porcentaje-valor')) document.getElementById('porcentaje-valor').innerText = numDias;
    if(document.getElementById('porcentaje-txt')) document.getElementById('porcentaje-txt').innerText = porc + "%";
    
    const barra = document.getElementById('bar-progreso');
    if(barra) {
        barra.style.width = porc + "%";
        barra.style.backgroundColor = colores[pasilloActual] || '#6d4c41';
    }

    // Botón Logrado
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
        localSt
