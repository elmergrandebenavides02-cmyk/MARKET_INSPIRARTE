let pasilloActual = '';
let fraseAsignada = { resiliencia: null, sabiduria: null, calma: null, empatia: null, vip: null };
const colores = { 'resiliencia': '#4caf50', 'sabiduria': '#0288d1', 'calma': '#ff7043', 'empatia': '#fbc02d', 'vip': '#d4af37' };

// --- LÓGICA DE LLAVES MENSUALES ---
const clavesMensuales = {
    0: "MarketEne26", 1: "MarketFeb26", 2: "MarketMar26", 3: "MarketAbr26",
    4: "MarketMay26", 5: "MarketJun26", 6: "MarketJul26", 7: "MarketAgo26",
    8: "MarketSep26", 9: "MarketOct26", 10: "MarketNov26", 11: "MarketDic26"
};

function verificarAcceso() {
    const passIngresada = document.getElementById('input-password').value.trim();
    const errorMsg = document.getElementById('error-login');
    const mesActual = new Date().getMonth();
    
    // Acepta la clave del mes actual O de cualquier mes anterior de la lista
    const clavesValidas = Object.values(clavesMensuales);
    
    if (clavesValidas.includes(passIngresada)) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        document.getElementById('pantalla-login').style.display = 'none';
        sessionStorage.setItem('acceso_market', 'true');
        actualizarMenuPrincipal();
    } else {
        errorMsg.style.display = 'block';
    }
}

// Verificar acceso al cargar
window.onload = () => {
    if (sessionStorage.getItem('acceso_market') === 'true') {
        document.getElementById('pantalla-login').style.display = 'none';
        actualizarMenuPrincipal();
    }
};

// --- LÓGICA DE PASILLOS ---
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
    if (lista) {
        fraseAsignada[pasilloActual] = lista[Math.floor(Math.random() * lista.length)];
    }
}

function actualizarInterfaz() {
    const hoy = fraseAsignada[pasilloActual];
    if (!hoy) return;

    document.getElementById('titulo-pasillo').innerText = pasilloActual;
    document.getElementById('frase-display').innerText = `"${hoy.frase}"`;
    document.getElementById('reto-display').innerText = hoy.reto;

    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const lista = progreso[pasilloActual] || [];
    
    document.getElementById('porcentaje-valor').innerText = lista.length;
    
    const btn = document.getElementById('btn-logrado');
    const fechaHoy = new Date().toISOString().split('T')[0];
    
    if (lista.includes(fechaHoy)) {
        btn.disabled = true;
        btn.innerText = "¡RETO CUMPLIDO!";
        btn.style.opacity = "0.5";
    } else {
        btn.disabled = false;
        btn.innerText = "¡LOGRADO!";
        btn.style.opacity = "1";
        btn.className = "btn-principal color-" + pasilloActual;
    }
}

function completarReto() {
    let progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    if (!progreso[pasilloActual]) progreso[pasilloActual] = [];
    
    const hoy = new Date().toISOString().split('T')[0];
    if (!progreso[pasilloActual].includes(hoy)) {
        progreso[pasilloActual].push(hoy);
        localStorage.setItem('progreso_market', JSON.stringify(progreso));
        
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: [colores[pasilloActual], '#fff'] });
        actualizarInterfaz();
        
        if (pasilloActual === 'vip') {
            lanzarMedalla("💎", "MAESTRÍA", "Has alcanzado el nivel más alto de bienestar hoy.");
        } else {
            lanzarMedalla("🏆", "¡Logrado!", "Sigue así, vas por buen camino.");
        }
    }
}

function actualizarMenuPrincipal() {
    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const pasillos = ['resiliencia', 'sabiduria', 'calma', 'empatia'];
    let completadosHoy = 0;
    const hoy = new Date().toISOString().split('T')[0];

    pasillos.forEach(p => {
        const lista = progreso[p] || [];
        if (lista.includes(hoy)) completadosHoy++;
        const contador = document.getElementById(`mini-dias-${p}`);
        if (contador) contador.innerText = lista.length;
    });

    const cardVip = document.getElementById('card-vip');
    if (cardVip) cardVip.style.display = (completadosHoy >= 4) ? "block" : "none";
}

function compartirWhatsApp() {
    const frase = document.getElementById('frase-display').innerText;
    window.open(`https://wa.me/?text=Inspirarte Market: ${frase}`, '_blank');
}

function lanzarMedalla(ico, tit, msg) {
    document.getElementById('insignia-icon').innerText = ico;
    document.getElementById('insignia-titulo').innerText = tit;
    document.getElementById('insignia-msj').innerText = msg;
    document.getElementById('modal-insignia').style.display = 'flex';
}
