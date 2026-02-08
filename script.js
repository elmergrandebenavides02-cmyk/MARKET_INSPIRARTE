let pasilloActual = '';
let fraseAsignada = { resiliencia: null, sabiduria: null, calma: null, empatia: null, vip: null };

const colores = { 
    'resiliencia': '#4caf50', 
    'sabiduria': '#0288d1', 
    'calma': '#ff7043', 
    'empatia': '#fbc02d', 
    'vip': '#d4af37' 
};

const clavesMensuales = {
    0: "MarketEne26", 1: "MarketFeb26", 2: "MarketMar26", 3: "MarketAbr26",
    4: "MarketMay26", 5: "MarketJun26", 6: "MarketJul26", 7: "MarketAgo26",
    8: "MarketSep26", 9: "MarketOct26", 10: "MarketNov26", 11: "MarketDic26"
};

// --- SISTEMA DE ACCESO ---
function verificarAcceso() {
    const passIngresada = document.getElementById('input-password').value.trim();
    const clavesValidas = Object.values(clavesMensuales);
    
    if (clavesValidas.includes(passIngresada)) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        localStorage.setItem('acceso_market', 'true');
        document.getElementById('pantalla-login').style.display = 'none';
        
        if (localStorage.getItem('guia_leida') !== 'true') {
            abrirInfo(); 
        } else {
            actualizarMenuPrincipal(); 
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

window.onload = () => {
    if (localStorage.getItem('acceso_market') === 'true') {
        const loginPantalla = document.getElementById('pantalla-login');
        if(loginPantalla) loginPantalla.style.display = 'none';
        actualizarMenuPrincipal();
    }
};

// --- NAVEGACIÓN ---
function irAPasillo(nombre) {
    pasilloActual = nombre;
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('pantalla-reto').style.display = 'block';
    
    // Si no tiene frase asignada o es el pasillo VIP (que siempre refresca), asignamos una
    if (!fraseAsignada[pasilloActual] || pasilloActual === 'vip') {
        seleccionarFraseNueva();
    }
    actualizarInterfaz();
}

function mostrarMenu() {
    document.getElementById('menu-principal').style.display = 'block';
    document.getElementById('pantalla-reto').style.display = 'none';
    actualizarMenuPrincipal();
}

function seleccionarFraseNueva() {
    const lista = frasesDB[pasilloActual];
    if (lista && lista.length > 0) {
        fraseAsignada[pasilloActual] = lista[Math.floor(Math.random() * lista.length)];
    }
}

// --- RENDERIZADO DE INTERFAZ ---
function actualizarInterfaz() {
    const hoyFrase = fraseAsignada[pasilloActual];
    if (!hoyFrase) return;

    // Títulos y textos
    document.getElementById('titulo-pasillo').innerText = pasilloActual;
    document.getElementById('frase-display').innerText = `"${hoyFrase.frase}"`;
    document.getElementById('reto-display').innerText = hoyFrase.reto;

    // Progreso
    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const lista = progreso[pasilloActual] || [];
    const numDias = lista.length;
    
    let porcentaje = Math.min((numDias / 14) * 100, 100).toFixed(0);
    
    // Lógica de Niveles
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

    // Botón de Logro y Lógica de Compromiso
    const btn = document.getElementById('btn-logrado');
    const leyenda = document.getElementById('instruccion-compromiso');
    const fechaHoy = new Date().toLocaleDateString('en-CA'); 
    
    if (lista.includes(fechaHoy)) {
        // Estilo botón desactivado (Compromiso ya hecho)
        btn.disabled = true;
        btn.innerText = "🤝 COMPROMISO ADQUIRIDO";
        btn.style.opacity = "0.5";
        btn.style.backgroundColor = "#ccc";
        btn.style.cursor = "default";
        if(leyenda) {
            leyenda.innerHTML = "✅ <strong>¡Reto activado!</strong> Tu mente ya está trabajando. No olvides usar tu llavero como ancla visual para cumplirlo.";
        }
    } else {
        // Estilo botón activo
        btn.disabled = false;
        btn.innerText = "LO ACEPTO / ¡LOGRADO!";
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
        btn.style.backgroundColor = colores[pasilloActual] || "var(--cafe)";
        if(leyenda) {
            leyenda.innerHTML = `📌 <strong>Tip de Bienestar:</strong> Si no puedes cumplirlo ahora, presiona el botón como <strong>compromiso mental</strong>. <br> <span style="color: var(--cafe-claro); display:block; margin-top:5px;">🔑 Deja tu llavero en un lugar visible (espejo, PC o mesa) para recordarlo durante el día.</span>`;
        }
    }
}

// --- ACCIÓN DE COMPLETAR ---
function completarReto() {
    let progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    if (!progreso[pasilloActual]) progreso[pasilloActual] = [];
    const hoy = new Date().toLocaleDateString('en-CA');
    
    if (!progreso[pasilloActual].includes(hoy)) {
        progreso[pasilloActual].push(hoy);
        localStorage.setItem('progreso_market', JSON.stringify(progreso));
        
        const totalDias = progreso[pasilloActual].length;
        
        // Cambio visual inmediato
        const btn = document.getElementById('btn-logrado');
        const leyenda = document.getElementById('instruccion-compromiso');
        if(btn) {
            btn.innerText = "🤝 COMPROMISO ADQUIRIDO";
            btn.style.backgroundColor = "#ccc";
            btn.disabled = true;
        }
        if(leyenda) {
            leyenda.innerHTML = "✅ <strong>¡Reto activado!</strong> Tu mente ya está trabajando.";
        }

        // Premios por constancia
        if (totalDias === 14) {
            lanzarConfettiEspecial();
            lanzarMedalla("👑", "¡NIVEL PRACTICANTE!", "Has mantenido tu constancia por 14 días. ¡El hábito ya es parte de ti!");
            actualizarInterfaz();
        } else {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: [colores[pasilloActual], '#fff'] });
            setTimeout(() => {
                actualizarInterfaz();
                mostrarMenu();
            }, 2000); 
        }
    }
}

function lanzarConfettiEspecial() {
    var duration = 5 * 1000;
    var end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 10, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#d4af37', '#fcf6ba'] });
      confetti({ particleCount: 10, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#d4af37', '#fcf6ba'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

// --- ACTUALIZACIÓN DEL MENÚ ---
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

    // Lógica Pasillo VIP (Solo si completó los 4 de hoy)
    const cardVip = document.getElementById('card-vip');
    if (cardVip) {
        cardVip.style.display = (completadosHoy >= 4) ? "block" : "none";
    }
}

// --- UTILIDADES ---
function compartirWhatsApp() {
    const titulo = pasilloActual.toUpperCase();
    const frase = document.getElementById('frase-display').innerText;
    const reto = document.getElementById('reto-display').innerText;
    
    const mensaje = encodeURIComponent(
        `🚀 *MI CHISPA DIARIA - MARKET INSPIRARTE* 🚀\n\n` +
        `📍 *Pasillo:* ${titulo}\n\n` +
        `✨ *La frase de hoy:* \n${frase}\n\n` +
        `⚡ *Mi reto:* \n${reto}\n\n` +
        `🔑 _Inicia tu día con propósito._\n\n` +
        `--- \n` +
        `🎁 Adquiere tu llave en *Enkanta2 Arte Manual*\n` +
        `📲 WhatsApp: 3244173977`
    );
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

function abrirInfo() { document.getElementById('modal-info').style.display = 'flex'; }
function cerrarInfo() {
    document.getElementById('modal-info').style.display = 'none';
    localStorage.setItem('guia_leida', 'true'); 
    actualizarMenuPrincipal(); 
}
