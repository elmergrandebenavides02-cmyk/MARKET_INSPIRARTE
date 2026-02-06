let pasilloActual = '';
let fraseAsignada = { resiliencia: null, sabiduria: null, calma: null, empatia: null, vip: null };
const colores = { 
    'resiliencia': '#4caf50', 
    'sabiduria': '#0288d1', 
    'calma': '#ff7043', 
    'empatia': '#fbc02d', 
    'vip': '#d4af37' 
};

window.onload = () => {
    actualizarMenuPrincipal();
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
    if (!lista || lista.length === 0) return;
    let nuevaFrase;
    do {
        nuevaFrase = lista[Math.floor(Math.random() * lista.length)];
    } while (lista.length > 1 && fraseAsignada[pasilloActual] && nuevaFrase.frase === fraseAsignada[pasilloActual].frase);
    fraseAsignada[pasilloActual] = nuevaFrase;
}

function actualizarMenuPrincipal() {
    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const pasillos = ['resiliencia', 'sabiduria', 'calma', 'empatia'];
    let completadosHoy = 0;
    const hoy = new Date().toISOString().split('T')[0];

    pasillos.forEach(p => {
        const lista = progreso[p] || [];
        if (lista.includes(hoy)) completadosHoy++;
        const numDias = lista.length;
        const porc = ((numDias / 365) * 100).toFixed(1);
        if (document.getElementById(`mini-dias-${p}`)) document.getElementById(`mini-dias-${p}`).innerText = numDias;
        const barra = document.getElementById(`mini-bar-${p}`);
        if (barra) { barra.style.width = porc + "%"; barra.style.backgroundColor = colores[p]; }
    });

    const cardVip = document.getElementById('card-vip');
    if (cardVip) cardVip.style.display = (completadosHoy === 4) ? "block" : "none";
}

function actualizarInterfaz() {
    const hoy = fraseAsignada[pasilloActual];
    if (!hoy) return;
    document.getElementById('titulo-pasillo').innerText = "Pasillo de " + pasilloActual;
    document.getElementById('nombre-pasillo-txt').innerText = pasilloActual;
    document.getElementById('frase-display').innerText = '"' + hoy.frase + '"';
    document.getElementById('reto-display').innerText = hoy.reto;
    
    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const lista = progreso[pasilloActual] || [];
    const porc = ((lista.length / 365) * 100).toFixed(1);
    
    document.getElementById('porcentaje-valor').innerText = lista.length;
    document.getElementById('porcentaje-txt').innerText = porc + "%";
    document.getElementById('bar-progreso').style.width = porc + "%";
    document.getElementById('bar-progreso').style.backgroundColor = colores[pasilloActual];

    const btn = document.getElementById('btn-logrado');
    btn.style.backgroundColor = colores[pasilloActual];
    
    const fechaHoy = new Date().toISOString().split('T')[0];
    if (lista.includes(fechaHoy)) {
        btn.disabled = true;
        btn.innerText = "¡RETO CUMPLIDO!";
        btn.style.opacity = "0.6";
        document.getElementById('btn-cambiar-frase').style.display = "none";
    } else {
        btn.disabled = false;
        btn.innerText = "¡LOGRADO!";
        btn.style.opacity = "1";
        document.getElementById('btn-cambiar-frase').style.display = "block";
    }
}

function completarReto() {
    let progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    if (!progreso[pasilloActual]) progreso[pasilloActual] = [];
    const hoy = new Date().toISOString().split('T')[0];
    
    if (!progreso[pasilloActual].includes(hoy)) {
        progreso[pasilloActual].push(hoy);
        localStorage.setItem('progreso_market', JSON.stringify(progreso));
        
        // EFECTO CONFETI
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: [colores[pasilloActual], '#ffffff', '#ffd700']
        });

        actualizarInterfaz();
        if(progreso[pasilloActual].length === 1) lanzarMedalla("🎖️", "¡Buen inicio!", "Has comenzado en " + pasilloActual);
        if(pasilloActual === 'vip') lanzarMedalla("💎", "¡MAESTRÍA!", "¡Has completado todos los pasillos de hoy!");
    }
}

function compartirWhatsApp() {
    const frase = document.getElementById('frase-display').innerText;
    const pasillo = pasilloActual.toUpperCase();
    const texto = `*Market Inspirarte*%0A%0AMi frase de hoy en el pasillo de *${pasillo}* es:%0A%0A${frase}%0A%0A_¡Cuidar nuestro bienestar es el mejor negocio!_ ✨`;
    window.open(`https://wa.me/?text=${texto}`, '_blank');
}

function lanzarMedalla(ico, tit, msg) {
    document.getElementById('insignia-icon').innerText = ico;
    document.getElementById('insignia-titulo').innerText = tit;
    document.getElementById('insignia-msj').innerText = msg;
    document.getElementById('modal-insignia').style.display = 'flex';
}
