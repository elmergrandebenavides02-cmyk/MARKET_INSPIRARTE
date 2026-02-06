let pasilloActual = '';
let fraseAsignada = { resiliencia: null, sabiduria: null, calma: null, empatia: null, vip: null };
const colores = { 'resiliencia': '#4caf50', 'sabiduria': '#0288d1', 'calma': '#ff7043', 'empatia': '#fbc02d', 'vip': '#d4af37' };

const clavesMensuales = {
    0: "MarketEne26", 1: "MarketFeb26", 2: "MarketMar26", 3: "MarketAbr26",
    4: "MarketMay26", 5: "MarketJun26", 6: "MarketJul26", 7: "MarketAgo26",
    8: "MarketSep26", 9: "MarketOct26", 10: "MarketNov26", 11: "MarketDic26"
};

function verificarAcceso() {
    const passIngresada = document.getElementById('input-password').value.trim();
    const clavesValidas = Object.values(clavesMensuales);
    if (clavesValidas.includes(passIngresada)) {
        document.getElementById('pantalla-login').style.display = 'none';
        sessionStorage.setItem('acceso_market', 'true');
        actualizarMenuPrincipal();
    } else {
        document.getElementById('error-login').style.display = 'block';
    }
}

window.onload = () => {
    if (sessionStorage.getItem('acceso_market') === 'true') {
        document.getElementById('pantalla-login').style.display = 'none';
        actualizarMenuPrincipal();
    }
};

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

function actualizarInterfaz() {
    const hoyFrase = fraseAsignada[pasilloActual];
    if (!hoyFrase) return;

    // 1. Mostrar textos
    document.getElementById('titulo-pasillo').innerText = pasilloActual;
    document.getElementById('frase-display').innerText = `"${hoyFrase.frase}"`;
    document.getElementById('reto-display').innerText = hoyFrase.reto;

    // 2. Calcular progreso
    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const lista = progreso[pasilloActual] || [];
    const numDias = lista.length;
    const porcentaje = Math.min((numDias / 365) * 100, 100).toFixed(1);

    // 3. Actualizar elementos visuales (Barra y números)
    document.getElementById('porcentaje-valor').innerText = numDias;
    document.getElementById('porcentaje-txt').innerText = porcentaje + "%";
    const barraDetalle = document.getElementById('bar-reto-detalle');
    if(barraDetalle) {
        barraDetalle.style.width = porcentaje + "%";
        barraDetalle.style.backgroundColor = colores[pasilloActual];
    }

    // 4. LÓGICA DEL BOTÓN (Día 2, 3, etc.)
    const btn = document.getElementById('btn-logrado');
    // Obtenemos la fecha de hoy en formato local YYYY-MM-DD
    const fechaHoy = new Date().toLocaleDateString('en-CA'); // Esto da "2026-02-06"
    
    // Si la lista de días logrados YA incluye la fecha de hoy...
    if (lista.includes(fechaHoy)) {
        btn.disabled = true;
        btn.innerText = "¡RETO CUMPLIDO HOY!";
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";
        btn.style.backgroundColor = "#ccc"; // Color gris de bloqueado
    } else {
        // Si es un nuevo día, el botón vuelve a la vida
        btn.disabled = false;
        btn.innerText = "¡LOGRADO!";
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
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
        lanzarMedalla(pasilloActual === 'vip' ? "💎" : "🏆", "¡Logrado!", "Has avanzado en tu camino de bienestar.");
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
        
        // Actualizar número de días
        const contador = document.getElementById(`mini-dias-${p}`);
        if (contador) contador.innerText = lista.length;
        
        // Actualizar barra de progreso del menú
        const barraMenu = document.getElementById(`bar-menu-${p}`);
        if (barraMenu) {
            const porc = Math.min((lista.length / 365) * 100, 100);
            barraMenu.style.width = porc + "%";
        }
    });

    const cardVip = document.getElementById('card-vip');
    if (cardVip) cardVip.style.display = (completadosHoy >= 4) ? "block" : "none";
}

function compartirWhatsApp() {
    const frase = document.getElementById('frase-display').innerText;
    window.open(`https://wa.me/?text=Mi reto de hoy en Inspirarte Market: ${frase}`, '_blank');
}

function lanzarMedalla(ico, tit, msg) {
    document.getElementById('insignia-icon').innerText = ico;
    document.getElementById('insignia-titulo').innerText = tit;
    document.getElementById('insignia-msj').innerText = msg;
    document.getElementById('modal-insignia').style.display = 'flex';
}
function contactarSoporte() {
    const telefonoSoporte = "573244173977"; // Tu número con código de país (57 para Colombia)
    const mesActualNombre = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
    
    const mensaje = `Hola! 👋 Necesito soporte con mi llave del Market Inspirarte. No puedo acceder con mi código de ${mesActualNombre}.`;
    
    const url = `https://wa.me/${telefonoSoporte}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

