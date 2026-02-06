let pasilloActual = '';
let fraseAsignada = { resiliencia: null, sabiduria: null, calma: null, empatia: null, vip: null };
const colores = { 'resiliencia': '#4caf50', 'sabiduria': '#0288d1', 'calma': '#ff7043', 'empatia': '#fbc02d', 'vip': '#d4af37' };

const clavesMensuales = {
    0: "MarketEne26", 1: "MarketFeb26", 2: "MarketMar26", 3: "MarketAbr26",
    4: "MarketMay26", 5: "MarketJun26", 6: "MarketJul26", 7: "MarketAgo26",
    8: "MarketSep26", 9: "MarketOct26", 10: "MarketNov26", 11: "MarketDic26"
};

// --- ACCESO PERMANENTE ---
function verificarAcceso() {
    const passIngresada = document.getElementById('input-password').value.trim();
    const clavesValidas = Object.values(clavesMensuales);
    
    if (clavesValidas.includes(passIngresada)) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        document.getElementById('pantalla-login').style.display = 'none';
        localStorage.setItem('acceso_market', 'true'); // Guarda para siempre
        actualizarMenuPrincipal();
    } else {
        document.getElementById('error-login').style.display = 'block';
    }
}

function contactarSoporte() {
    const telefonoSoporte = "573244173977"; 
    const mesActualNombre = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
    const mensaje = `Hola! 👋 Necesito soporte con mi llave del Market Inspirarte. No puedo acceder con mi código de ${mesActualNombre}.`;
    window.open(`https://wa.me/${telefonoSoporte}?text=${encodeURIComponent(mensaje)}`, '_blank');
}

window.onload = () => {
    // Revisa si ya tenía acceso guardado
    if (localStorage.getItem('acceso_market') === 'true') {
        document.getElementById('pantalla-login').style.display = 'none';
        actualizarMenuPrincipal();
    }
};

// --- NAVEGACIÓN ---
function irAPasillo(nombre) {
    pasilloActual = nombre;
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('pantalla-reto').style.display = 'block';
    if (!fraseAsignada[pasilloActual]) seleccionarFraseNueva();
    actualizarInterfaz();
}

function mostrarMenu() {
    document.getElementById('menu-principal').style.display = 'block';
    document.getElementById('pantalla-reto').style.display = 'none';
    actualizarMenuPrincipal();
}

function seleccionarFraseNueva() {
    const lista = frasesDB[pasilloActual];
    if (lista) fraseAsignada[pasilloActual] = lista[Math.floor(Math.random() * lista.length)];
}

// --- INTERFAZ Y NIVELES ---
function actualizarInterfaz() {
    const hoyFrase = fraseAsignada[pasilloActual];
    if (!hoyFrase) return;

    document.getElementById('titulo-pasillo').innerText = pasilloActual;
    document.getElementById('frase-display').innerText = `"${hoyFrase.frase}"`;
    document.getElementById('reto-display').innerText = hoyFrase.reto;

    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const lista = progreso[pasilloActual] || [];
    const numDias = lista.length;
    
    let porcentaje = Math.min((numDias / 14) * 100, 100).toFixed(0);
    
    let nivelTexto = "";
    let iconoNivel = "";
    if (numDias < 7) { nivelTexto = "Iniciado"; iconoNivel = "🌱"; }
    else if (numDias < 14) { nivelTexto = "Aprendiz"; iconoNivel = "🌿"; }
    else if (numDias < 21) { nivelTexto = "Practicante"; iconoNivel = "🌳"; }
    else { nivelTexto = "Maestro"; iconoNivel = "👑"; }

    document.getElementById('porcentaje-valor').innerText = numDias;
    document.getElementById('porcentaje-txt').innerText = `${nivelTexto} ${iconoNivel} (${porcentaje}%)`;
    
    const barraDetalle = document.getElementById('bar-reto-detalle');
    if(barraDetalle) {
        barraDetalle.style.width = porcentaje + "%";
        barraDetalle.style.backgroundColor = colores[pasilloActual];
    }

    const btn = document.getElementById('btn-logrado');
    const fechaHoy = new Date().toLocaleDateString('en-CA'); 
    
    if (lista.includes(fechaHoy)) {
        btn.disabled = true;
        btn.innerText = "¡RETO CUMPLIDO HOY!";
        btn.style.opacity = "0.5";
    } else {
        btn.disabled = false;
        btn.innerText = "¡LOGRADO!";
        btn.style.opacity = "1";
        btn.className = "btn-principal color-" + pasilloActual;
    }
}

// --- LOGRADO ---
function completarReto() {
    let progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    if (!progreso[pasilloActual]) progreso[pasilloActual] = [];
    const hoy = new Date().toLocaleDateString('en-CA');
    
    if (!progreso[pasilloActual].includes(hoy)) {
        progreso[pasilloActual].push(hoy);
        localStorage.setItem('progreso_market', JSON.stringify(progreso));
        
        const totalDias = progreso[pasilloActual].length;

        // 1. Efectos visuales de celebración
        if (totalDias === 14) {
            var duration = 4 * 1000;
            var end = Date.now() + duration;
            (function frame() {
              confetti({ particleCount: 7, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#d4af37', '#fcf6ba'] });
              confetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#d4af37', '#fcf6ba'] });
              if (Date.now() < end) requestAnimationFrame(frame);
            }());
        } else {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: [colores[pasilloActual], '#fff'] });
        }

        // 2. Pequeña pausa (800ms) para que el usuario sienta el éxito y luego regreso automático
        setTimeout(() => {
            actualizarInterfaz(); // Actualiza el botón internamente
            mostrarMenu();        // Vuelve al menú principal automáticamente
        }, 800); 
    }
}

function actualizarMenuPrincipal() {
    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const pasillos = ['resiliencia', 'sabiduria', 'calma', 'empatia'];
    let completadosHoy = 0;
    const hoy = new Date().toLocaleDateString('en-CA');

    pasillos.forEach(p => {
        const lista = progreso[p] || [];
        if (lista.includes(hoy)) completadosHoy++;
        
        const contador = document.getElementById(`mini-dias-${p}`);
        if (contador) contador.innerText = lista.length;
        
        const barraMenu = document.getElementById(`bar-menu-${p}`);
        if (barraMenu) {
            const porc = Math.min((lista.length / 14) * 100, 100);
            barraMenu.style.width = porc + "%";
        }
    });

    const cardVip = document.getElementById('card-vip');
    if (cardVip) cardVip.style.display = (completadosHoy >= 4) ? "block" : "none";
}

function compartirWhatsApp() {
    const frase = document.getElementById('frase-display').innerText;
    window.open(`https://wa.me/?text=Mi reto: ${frase}`, '_blank');
}

function lanzarMedalla(ico, tit, msg) {
    document.getElementById('insignia-icon').innerText = ico;
    document.getElementById('insignia-titulo').innerText = tit;
    document.getElementById('insignia-msj').innerText = msg;
    document.getElementById('modal-insignia').style.display = 'flex';
}

