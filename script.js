const frasesDB = {
    "calma": [
        { "frase": "El silencio no está vacío, está lleno de respuestas.", "reto": "Permanece en silencio 10 min al despertar hoy." },
        { "frase": "Tu paz vale más que tener la razón.", "reto": "No entres en discusiones innecesarias hoy." },
        { "frase": "La calma es el superpoder del alma.", "reto": "Haz 5 respiraciones profundas antes de cada comida." }
    ],
    "resiliencia": [
        { "frase": "Nunca es tarde para ser lo que podrías haber sido.", "reto": "Dedica 15 min a un sueño que habías dejado de lado." },
        { "frase": "Los robles más fuertes crecen contra el viento.", "reto": "Escribe una meta pequeña y cúmplela hoy mismo." }
    ],
    "sabiduria": [
        { "frase": "La duda es el principio de la sabiduría.", "reto": "Lee 5 páginas de un libro que te enseñe algo nuevo." },
        { "frase": "Saber que no se sabe es la mayor sabiduría.", "reto": "Pregúntale a alguien experto sobre un tema que desconozcas." }
    ],
    "empatia": [
        { "frase": "Mira con los ojos de otro.", "reto": "Haz un cumplido sincero a alguien que no conozcas bien." },
        { "frase": "La empatía es escuchar sin juzgar.", "reto": "Escucha a un compañero sin interrumpir durante 5 minutos." }
    ]
};

// Variable para guardar la frase seleccionada en la sesión actual
let fraseAsignada = {
    resiliencia: null,
    sabiduria: null,
    calma: null,
    empatia: null
};

let pasilloActual = '';
const colores = { 'resiliencia': '#4caf50', 'sabiduria': '#0288d1', 'calma': '#ff7043', 'empatia': '#fbc02d' };

window.onload = () => {
    actualizarMenuPrincipal();
};

function irAPasillo(nombre) {
    pasilloActual = nombre;
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('pantalla-reto').style.display = 'block';
    
    // Si no hay una frase asignada para este pasillo en esta sesión, elegimos una
    if (!fraseAsignada[pasilloActual]) {
        seleccionarFraseNueva();
    }
    
    actualizarInterfaz();
}

function seleccionarFraseNueva() {
    const lista = frasesDB[pasilloActual];
    let nuevaFrase;
    
    // Si hay más de una frase, intentamos que no repita la anterior (si existiera)
    do {
        nuevaFrase = lista[Math.floor(Math.random() * lista.length)];
    } while (lista.length > 1 && fraseAsignada[pasilloActual] && nuevaFrase.frase === fraseAsignada[pasilloActual].frase);
    
    fraseAsignada[pasilloActual] = nuevaFrase;
}

function mostrarMenu() {
    document.getElementById('menu-principal').style.display = 'block';
    document.getElementById('pantalla-reto').style.display = 'none';
    actualizarMenuPrincipal();
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
    barra.style.width = porc + "%";
    barra.style.backgroundColor = colores[pasilloActual];

    const btn = document.getElementById('btn-logrado');
    btn.style.backgroundColor = colores[pasilloActual];
    
    const fechaHoy = new Date().toISOString().split('T')[0];
    if (listaDias.includes(fechaHoy)) {
        btn.disabled = true;
        btn.innerText = "¡YA CUMPLIDO!";
        btn.style.opacity = "0.6";
    } else {
        btn.disabled = false;
        btn.innerText = "¡LOGRADO!";
        btn.style.opacity = "1";
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
            lanzarMedalla("🎖️", "¡Buen inicio!", "Has comenzado tu camino en este pasillo.");
        }
    }
}

function lanzarMedalla(ico, tit, msg) {
    document.getElementById('insignia-icon').innerText = ico;
    document.getElementById('insignia-titulo').innerText = tit;
    document.getElementById('insignia-msj').innerText = msg;
    document.getElementById('modal-insignia').style.display = 'flex';
}
