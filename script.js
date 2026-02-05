let pasilloActual = 'calma'; // Pasillo inicial
let db = {};
const pasillos = ['resiliencia', 'sabiduria', 'calma', 'empatia'];

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

// 4. Actualizar toda la pantalla
function actualizarInterfaz() {
    // Mostrar frase y reto según el día
    const diaIndex = obtenerDiaDelAnio() % db[pasilloActual].length;
    const dataHoy = db[pasilloActual][diaIndex];

    document.getElementById('titulo-pasillo').innerText = Pasillo de ${pasilloActual};
    document.getElementById('frase-display').innerText = "${dataHoy.frase}";
    document.getElementById('reto-display').innerText = dataHoy.reto;
    document.getElementById('pasillo-nombre').innerText = pasilloActual.charAt(0).toUpperCase() + pasilloActual.slice(1);

    // Calcular y mostrar avance progresivo por pasillo
    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const diasCompletados = progreso[pasilloActual] ? progreso[pasilloActual].length : 0;
    const porcentaje = ((diasCompletados / 365) * 100).toFixed(1);
    
    document.getElementById('porcentaje-valor').innerText = ${porcentaje}% de constancia;

    // Estado del botón "Logrado"
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
        
        // Revisar si merece medalla por este pasillo
        revisarInsignias(progreso[pasilloActual].length);
    }
}

// 6. Sistema de Recompensas (5% y 10%)
function revisarInsignias(totalDias) {
    if (totalDias === 18) { // 5% de 365
        mostrarModalInsignia("🎖️", "Hábito Iniciado (5%)", "¡Felicidades! Estás construyendo una nueva versión de ti mismo.");
    } 
    else if (totalDias === 36) { // 10% de 365
        const mensajes10 = {
            'calma': "Maestro de la Pausa: En un mundo que corre, tú has elegido respirar. Tu mente ahora es un refugio.",
            'resiliencia': "Corazón de Roble: Has transformado la madera de tu llavero en una armadura mental.",
            'sabiduria': "Mente Clara: La sabiduría se construye con la reflexión diaria que has practicado.",
            'empatia': "Arquitecto de Conexiones: Eres el puente que el mundo necesita. ¡Sigue construyendo!"
        };
        mostrarModalInsignia("✨", "Disciplina de Acero (10%)", mensajes10[pasilloActual]);
    }
}

function mostrarModalInsignia(icono, titulo, msj) {
    // Asegúrate de tener estos IDs en tu HTML para el modal
    document.getElementById('insignia-icon').innerText = icono;
    document.getElementById('insignia-titulo').innerText = titulo;
    document.getEgetElementById('pantalla-inspiracion').style.display = 'none';
    document.getElementById('seleccion').style.display = 'block';

}
