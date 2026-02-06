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
    const pasillosBasicos = ['resiliencia', 'sabiduria', 'calma', 'empatia'];
    const fechaHoy = new Date().toISOString().split('T')[0];
    let completadosHoyCount = 0;

    pasillosBasicos.forEach(p => {
        const lista = progreso[p] || [];
        if (lista.includes(fechaHoy)) completadosHoyCount++;
        const numDias = lista.length;
        const porc = ((numDias / 365) * 100).toFixed(1);
        if (document.getElementById(`mini-dias-${p}`)) document.getElementById(`mini-dias-${p}`).innerText = numDias;
        const barra = document.getElementById(`mini-bar-${p}`);
        if (barra) { barra.style.width = porc + "%"; barra.style.backgroundColor = colores[p]; }
    });

    const cardVip = document.getElementById('card-vip');
    if (cardVip) cardVip.style.display = (completadosHoyCount === 4) ? "block" : "none";
}

function actualizarInterfaz() {
    const hoy = fraseAsignada[pasilloActual];
    if (!hoy) return;
    document.getElementById('titulo-pasillo').innerText = "Pasillo de " + pasilloActual;
    document.getElementById('nombre-pasillo-txt').innerText = pasilloActual;
    document.getElementById('frase-display').innerText = '"' + hoy.frase + '"';
    document.getElementById('reto-display').innerText = hoy.reto;
    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const listaDias = progreso[pasilloActual] || [];
    const numDias = listaDias.length;
    const porc = ((numDias / 365) * 100).toFixed(1);
    document.getElementById('porcentaje-valor').innerText = numDias;
    document.getElementById('porcentaje-txt').innerText = porc + "%";
    const barra = document.getElementById('bar-progreso');
    if (barra) { barra.style.width = porc + "%"; barra.style.backgroundColor = colores[pasilloActual]; }
    const btnLogrado = document.getElementById('btn-logrado');
    const btnCambiar = document.getElementById('btn-cambiar-frase');
    btnLogrado.style.backgroundColor = colores[pasilloActual];
    const fechaHoy = new Date().toISOString().split('T')[0];
    if (listaDias.includes(fechaHoy)) {
        btnLogrado.disabled = true; btnLogrado.innerText = "¡RETO CUMPLIDO!"; btnLogrado.style.opacity = "0.6";
        if (btnCambiar) btnCambiar.style.display = "none";
    } else {
        btnLogrado.disabled = false; btnLogrado.innerText = "¡LOGRADO!"; btnLogrado.style.opacity = "1";
        if (btnCambiar) btnCambiar.style.display = "block";
    }
}

function completarReto() {
    let progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    if (!progreso[pasilloActual]) progreso[pasilloActual] = [];
    const hoy = new Date().toISOString().split('T')[0];
    if (!progreso[pasilloActual].includes(hoy)) {
        progreso[pasilloActual].push(hoy);
        localStorage.setItem('progreso_market', JSON.stringify(progreso));
        actualizarInterfaz();
        if(progreso[pasilloActual].length === 1) lanzarMedalla("🎖️", "¡Buen inicio!", "Has comenzado en " + pasilloActual);
        if(pasilloActual === 'vip') lanzarMedalla("💎", "¡MAESTRÍA!", "¡Día redondo completado!");
    }
}

function lanzarMedalla(ico, tit, msg) {
    document.getElementById('insignia-icon').innerText = ico;
    document.getElementById('insignia-titulo').innerText = tit;
    document.getElementById('insignia-msj').innerText = msg;
    document.getElementById('modal-insignia').style.display = 'flex';
}
