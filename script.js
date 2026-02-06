// VARIABLES GLOBALES (frasesDB viene del archivo frases.js cargado previamente)
let pasilloActual = '';
let fraseAsignada = { resiliencia: null, sabiduria: null, calma: null, empatia: null };
const colores = { 'resiliencia': '#4caf50', 'sabiduria': '#0288d1', 'calma': '#ff7043', 'empatia': '#fbc02d' };

window.onload = () => {
    actualizarMenuPrincipal();
};

function irAPasillo(nombre) {
    pasilloActual = nombre;
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('pantalla-reto').style.display = 'block';
    
    // Si no hay una frase elegida en esta sesión para este pasillo, elegimos una.
    if (!fraseAsignada[pasilloActual]) {
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
    if (!lista || lista.length === 0) return;

    let nuevaFrase;
    // Evita repetir la misma frase si hay más opciones disponibles
    do {
        nuevaFrase = lista[Math.floor(Math.random() * lista.length)];
    } while (lista.length > 1 && fraseAsignada[pasilloActual] && nuevaFrase.frase === fraseAsignada[pasilloActual].frase);
    
    fraseAsignada[pasilloActual] = nuevaFrase;
}

function actualizarMenuPrincipal() {
    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const pasillos = ['resiliencia', 'sabiduria', 'calma', 'empatia'];

    pasillos.forEach(p => {
        const lista = progreso[p] || [];
        const numDias = lista.length;
        const porc = ((numDias / 365) * 100).toFixed(1);

        if (document.getElementById(`mini-dias-${p}`)) 
            document.getElementById(`mini-dias-${p}`).innerText = numDias;

        const barra = document.getElementById(`mini-bar-${p}`);
        if (barra) {
            barra.style.width = porc + "%";
            barra.style.backgroundColor = colores[p];
        }
    });
}

function actualizarInterfaz() {
    const hoy = fraseAsignada[pasilloActual];
    if (!hoy) return;

    document.getElementById('titulo-pasillo').innerText = pasilloActual;
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
    if (barra) {
        barra.style.width = porc + "%";
        barra.style.backgroundColor = colores[pasilloActual];
    }

    const btn = document.getElementById('btn-logrado');
    const btnCambiar = document.getElementById('btn-cambiar-frase');
    btn.style.backgroundColor = colores[pasilloActual];
    
    const fechaHoy = new Date().toISOString().split('T')[0];
    if (listaDias.includes(fechaHoy)) {
        btn.disabled = true;
        btn.innerText = "¡YA CUMPLIDO!";
        btn.style.opacity = "0.6";
        if (btnCambiar) btnCambiar.style.display = "none";
    } else {
        btn.disabled = false;
        btn.innerText = "¡LOGRADO!";
        btn.style.opacity = "1";
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
        if(progreso[pasilloActual].length === 1) {
            lanzarMedalla("🎖️", "¡Buen inicio!", "Has comenzado tu racha en " + pasilloActual);
        }
    }
}

function lanzarMedalla(ico, tit, msg) {
    document.getElementById('insignia-icon').innerText = ico;
    document.getElementById('insignia-titulo').innerText = tit;
    document.getElementById('insignia-msj').innerText = msg;
    document.getElementById('modal-insignia').style.display = 'flex';
}
