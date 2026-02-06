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
        
        // Guardamos el acceso permanente
        localStorage.setItem('acceso_market', 'true');
        
        // Ocultamos login
        document.getElementById('pantalla-login').style.display = 'none';
        
        // REVISAMOS SI YA VIO LA GUÍA
        if (localStorage.getItem('guia_leida') !== 'true') {
            abrirInfo(); // Muestra el mensaje que redactamos
        } else {
            actualizarMenuPrincipal(); // Va directo al menú
        }
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
// Actualizamos la carga inicial también
window.onload = () => {
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

        // --- ESCENARIO A: EL GRAN HITO (DÍA 14) ---
        if (totalDias === 14) {
            // Lluvia Dorada Larga
            var duration = 5 * 1000;
            var end = Date.now() + duration;
            (function frame() {
              confetti({ particleCount: 10, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#d4af37', '#fcf6ba', '#ffffff'] });
              confetti({ particleCount: 10, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#d4af37', '#fcf6ba', '#ffffff'] });
              if (Date.now() < end) requestAnimationFrame(frame);
            }());

            // Mostramos el mensaje de nivel y motivación
            lanzarMedalla(
                "👑", 
                "¡NIVEL PRACTICANTE!", 
                "¡Increíble logro! Has mantenido tu constancia por 14 días. El hábito ya es parte de ti. ¡Sigue adelante hasta alcanzar la MAESTRÍA total! 🌳"
            );
            
            // En este caso NO volvemos al menú automáticamente para que lean su logro
            actualizarInterfaz();
        } 
        // --- ESCENARIO B: DÍA NORMAL ---
        else {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: [colores[pasilloActual], '#fff'] });
            
            // Pausa breve y regreso automático
            setTimeout(() => {
                actualizarInterfaz();
                mostrarMenu();
            }, 1000);
        }
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
    // Obtenemos los textos actuales de la pantalla
    const titulo = pasilloActual.toUpperCase();
    const frase = document.getElementById('frase-display').innerText;
    const reto = document.getElementById('reto-display').innerText;
    
    // Construimos un mensaje estructurado y atractivo
    const mensaje = encodeURIComponent(
        `🚀 *MI CHISPA DIARIA - MARKET INSPIRARTE* 🚀\n\n` +
        `📍 *Pasillo:* ${titulo}\n\n` +
        `✨ *La frase de hoy:* \n${frase}\n\n` +
        `⚡ *Mi reto:* \n${reto}\n\n` +
        `🔑 _Inicia tu día con propósito._`
    );
    
    // Abrimos WhatsApp con el mensaje listo
    window.open(`https://wa.me/?text=${mensaje}`, '_blank');
}

function lanzarMedalla(ico, tit, msg) {
    document.getElementById('insignia-icon').innerText = ico;
    document.getElementById('insignia-titulo').innerText = tit;
    document.getElementById('insignia-msj').innerText = msg;
    document.getElementById('modal-insignia').style.display = 'flex';
}
function cerrarModalYMenu() {
    document.getElementById('modal-insignia').style.display = 'none';
    mostrarMenu();
}
// --- 2. FUNCIONES DE LA GUÍA ---
function abrirInfo() {
    document.getElementById('modal-info').style.display = 'flex';
}

function cerrarInfo() {
    document.getElementById('modal-info').style.display = 'none';
    // Marcamos que ya leyó la guía para que no salga siempre
    localStorage.setItem('guia_leida', 'true'); 
    actualizarMenuPrincipal(); // Al cerrar, mostramos el menú
}


