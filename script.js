// --- CONFIGURACIÓN GLOBAL ---
let pasilloActual = 'calma';
let frasesDB = {}; // Se llenará con el archivo datos.json

// Colores oficiales para cada pasillo
const colores = {
    'resiliencia': '#4caf50', // Verde
    'sabiduria': '#0288d1',    // Azul
    'calma': '#ff7043',        // Naranja
    'empatia': '#fbc02d'       // Amarillo
};

// 1. CARGA INICIAL
window.onload = async () => {
    try {
        const res = await fetch('datos.json');
        if (!res.ok) throw new Error("No se pudo cargar datos.json");
        frasesDB = await res.json();
        console.log("Base de datos de frases cargada con éxito.");
    } catch (e) {
        console.error("Error crítico:", e);
        alert("Atención: No se pudieron cargar las frases. Revisa el archivo datos.json");
    }
};

// 2. NAVEGACIÓN
function irAPasillo(nombre) {
    pasilloActual = nombre.toLowerCase();
    
    // Cambiar pantallas
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('pantalla-reto').style.display = 'block';
    
    actualizarInterfaz();
}

function mostrarMenu() {
    document.getElementById('menu-principal').style.display = 'block';
    document.getElementById('pantalla-reto').style.display = 'none';
}

// 3. LÓGICA DE TIEMPO (1 frase por día del año)
function obtenerDiaDelAnio() {
    const ahora = new Date();
    const inicio = new Date(ahora.getFullYear(), 0, 0);
    const dif = ahora - inicio;
    return Math.floor(dif / (1000 * 60 * 60 * 24));
}

// 4. ACTUALIZACIÓN VISUAL
function actualizarInterfaz() {
    const datosPasillo = frasesDB[pasilloActual];
    
    if (!datosPasillo || datosPasillo.length === 0) {
        console.error("No hay frases para el pasillo:", pasilloActual);
        return;
    }

    // Seleccionar frase basada en el día actual
    const diaIndex = obtenerDiaDelAnio() % datosPasillo.length;
    const hoy = datosPasillo[diaIndex];

    // Llenar textos en el HTML
    document.getElementById('titulo-pasillo').innerText = "Pasillo de " + pasilloActual;
    document.getElementById('nombre-pasillo-txt').innerText = pasilloActual;
    document.getElementById('frase-display').innerText = `"${hoy.frase}"`;
    document.getElementById('reto-display').innerText = hoy.reto;

    // --- MANEJO DE PROGRESO ---
    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const listaDias = progreso[pasilloActual] || [];
    const numDias = listaDias.length;
    
    // Calcular porcentaje sobre meta de 365 días
    const porc = ((numDias / 365) * 100).toFixed(1);

    // Actualizar racha y porcentaje
    document.getElementById('porcentaje-valor').innerText = numDias;
    document.getElementById('porcentaje-txt').innerText = porc + "%";
    
    // Mover barra y cambiar su color
    const barra = document.getElementById('bar-progreso');
    if (barra) {
        barra.style.width = porc + "%";
        barra.style.backgroundColor = colores[pasilloActual];
    }

    // --- ESTADO DEL BOTÓN ---
    const btn = document.getElementById('btn-logrado');
    const confirmacion = document.getElementById('confirmacion-texto');
    const fechaHoy = new Date().toISOString().split('T')[0];

    if (btn) {
        btn.style.backgroundColor = colores[pasilloActual];
        if (listaDias.includes(fechaHoy)) {
            btn.disabled = true;
            btn.innerText = "¡YA CUMPLIDO!";
            confirmacion.style.display = 'block';
        } else {
            btn.disabled = false;
            btn.innerText = "¡LOGRADO!";
            confirmacion.style.display = 'none';
        }
    }
}

// 5. REGISTRAR EL LOGRO
function completarReto() {
    let progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    if (!progreso[pasilloActual]) progreso[pasilloActual] = [];
    
    const hoy = new Date().toISOString().split('T')[0];

    if (!progreso[pasilloActual].includes(hoy)) {
        progreso[pasilloActual].push(hoy);
        localStorage.setItem('progreso_market', JSON.stringify(progreso));
        
        actualizarInterfaz();
        
        // Sistema de Medallas
        revisarMedallas(progreso[pasilloActual].length);
    }
}

// 6. SISTEMA DE RECOMPENSAS
function revisarMedallas(total) {
    if (total === 1) {
        lanzarMedalla("🎖️", "¡Primer Gran Paso!", "Has iniciado oficialmente tu camino en el pasillo de " + pasilloActual + ".");
    } else if (total === 18) {
        lanzarMedalla("🥉", "Hábito Iniciado (5%)", "¡Felicidades! Estás construyendo una disciplina imparable.");
    } else if (total === 36) {
        lanzarMedalla("✨", "Disciplina de Hierro (10%)", "Has completado el 10% del año. ¡Tu mente está en otro nivel!");
    }
}

function lanzarMedalla(ico, tit, msg) {
    document.getElementById('insignia-icon').innerText = ico;
    document.getElementById('insignia-titulo').innerText = tit;
    document.getElementById('insignia-msj').innerText = msg;
    document.getElementById('modal-insignia').style.display = 'flex';
}
