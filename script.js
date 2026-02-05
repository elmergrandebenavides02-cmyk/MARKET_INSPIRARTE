let pasilloActual = 'calma'; // Pasillo inicial
let db = {};
const pasillos = ['resiliencia', 'sabiduria', 'calma', 'empatia'];

// Configuración de colores por pasillo (Ajustados a tu diseño)
const coloresPasillos = {
    'resiliencia': '#84a59d', // Verde suave
    'sabiduria': '#006d77',    // Azul petróleo
    'calma': '#f28482',        // Naranja/Coral
    'empatia': '#f6bd60'       // Amarillo/Naranja cálido
};

// 1. Cargar frases y actualizar interfaz al iniciar
window.onload = async () => {
    try {
        const res = await fetch('datos.json');
        db = await res.json();
        actualizarInterfaz();
    } catch (e) { 
        console.error("Error cargando base de datos", e); 
    }
};

// 2. Cambiar entre pasillos
function cambiarPasillo(nuevoPasillo) {
    pasilloActual = nuevoPasillo;
    actualizarInterfaz();
}

// 3. Lógica para mostrar la frase del día (1 de 365)
function obtenerDiaDelAnio() {
    const ahora = new Date();
    const inicio = new Date(ahora.getFullYear(), 0, 0);
    const dif = ahora - inicio;
    return Math.floor(dif / (1000 * 60 * 60 * 24));
}

// 4. Actualizar toda la pantalla (Interfaz, Barra y Racha)
function actualizarInterfaz() {
    if (!db[pasilloActual]) return;

    // Mostrar frase y reto según el día
    const diaIndex = obtenerDiaDelAnio() % db[pasilloActual].length;
    const dataHoy = db[pasilloActual][diaIndex];

    document.getElementById('titulo-pasillo').innerText = Pasillo de ${pasilloActual};
    document.getElementById('frase-display').innerText = "${dataHoy.frase}";
    document.getElementById('reto-display').innerText = dataHoy.reto;
    document.getElementById('pasillo-nombre').innerText = pasilloActual.charAt(0).toUpperCase() + pasilloActual.slice(1);

    // --- LÓGICA DE AVANCE Y BARRA ---
    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const diasCompletados = progreso[pasilloActual] ? progreso[pasilloActual].length : 0;
    
    // Cálculo de porcentaje sobre meta de 365 días
    const porcentaje = ((diasCompletados / 365) * 100).toFixed(1);
    
    // Actualizar Texto de Días (Racha)
    if(document.getElementById('porcentaje-valor')) {
        document.getElementById('porcentaje-valor').innerText = ${diasCompletados} Días;
    }

    // Actualizar Texto de Porcentaje debajo de la barra
    if(document.getElementById('porcentaje-txt')) {
        document.getElementById('porcentaje-txt').innerText = ${porcentaje}%;
    }

    // --- CAMBIO DE COLOR Y MOVIMIENTO DE BARRA ---
    const barra = document.getElementById('bar-progreso');
    if(barra) {
        barra.style.width = ${porcentaje}%;
        barra.style.backgroundColor = coloresPasillos[pasilloActual]; // Aplica el color del pasillo
    }

    // --- ESTADO DEL BOTÓN "LOGRADO" ---
    const hoy = new Date().toISOString().split('T')[0];
    const btn = document.getElementById('btn-logrado');
    
    if (progreso[pasilloActual]?.includes(hoy)) {
        btn.disabled = true;
        btn.innerText = "¡YA CUMPLIDO!";
        document.getElementById('logro-confirmacion').style.display = 'block';
    } else {
        btn.disabled = false;
        btn.innerText = "¡LOGRADO!";
        document.getElementById('logro-confirmacion').style.display = 'none';
    }
}

// 5. Registrar el logro y revisar recompensas
function completarReto() {
    let progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const hoy = new Date().toISOString().split('T')[0];

    if (!progreso[pasilloActual]) progreso[pasilloActual] = [];
    
    if (!progreso[pasilloActual].includes(hoy)) {
        progreso[pasilloActual].push(hoy);
        localStorage.setItem('progreso_market', JSON.stringify(progreso));
        
        actualizarInterfaz();
        
        // Revisar si merece medalla por los días acumulados en este pasillo
        revisarInsignias(progreso[pasilloActual].length);
    }
}

// 6. Sistema de Recompensas (5% y 10%)
function revisarInsignias(totalDias) {
    if (totalDias === 1) { 
        mostrarModalInsignia("🎖️", "Hábito

