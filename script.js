// VARIABLES DE CONTROL
let pasilloActual = '';
let fraseAsignada = { resiliencia: null, sabiduria: null, calma: null, empatia: null, vip: null };
const colores = { 
    'resiliencia': '#4caf50', 
    'sabiduria': '#0288d1', 
    'calma': '#ff7043', 
    'empatia': '#fbc02d',
    'vip': '#d4af37' // Color oro para el VIP
};

window.onload = () => {
    actualizarMenuPrincipal();
};

// NAVEGACIÓN
function irAPasillo(nombre) {
    pasilloActual = nombre;
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('pantalla-reto').style.display = 'block';
    
    // Si no hay una frase elegida para este pasillo hoy, elegimos una
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

// LÓGICA DE SELECCIÓN DE FRASES
function seleccionarFraseNueva() {
    const lista = frasesDB[pasilloActual];
    if (!lista || lista.length === 0) return;

    let nuevaFrase;
    // Evita repetir la misma frase si hay más opciones en la lista
    do {
        nuevaFrase = lista[Math.floor(Math.random() * lista.length)];
    } while (lista.length > 1 && fraseAsignada[pasilloActual] && nuevaFrase.frase === fraseAsignada[pasilloActual].frase);
    
    fraseAsignada[pasilloActual] = nuevaFrase;
}

// ACTUALIZACIÓN DEL MENÚ (INCLUYE LÓGICA VIP)
function actualizarMenuPrincipal() {
    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const pasillosBasicos = ['resiliencia', 'sabiduria', 'calma', 'empatia'];
    const fechaHoy = new Date().toISOString().split('T')[0];
    
    let completadosHoyCount = 0;

    // Actualizar barras de los 4 pasillos normales
    pasillosBasicos.forEach(p => {
        const lista = progreso[p] || [];
        
        // Verificar si se completó hoy
        if (lista.includes(fechaHoy)) {
            completadosHoyCount++;
        }

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

    // CONTROL DEL PASILLO VIP
    const cardVip = document.getElementById('card-vip');
    if (completadosHoyCount === 4) {
        cardVip.style.display = "block"; // Se muestra solo si terminó los 4
    } else {
        cardVip.style.display = "none";
    }
}

// ACTUALIZACIÓN DE LA PANTALLA DE RETO
function actualizarInterfaz() {
    const hoy = fraseAsignada[pasilloActual];
    if (!hoy) return;

    // Textos
    document.getElementById('titulo-pasillo').innerText = "Pasillo de " + pasilloActual;
    document.getElementById('nombre-pasillo-txt').innerText = pasilloActual;
    document.getElementById('frase-display').innerText = '"' + hoy.frase + '"';
    document.getElementById('reto-display').innerText = hoy.reto;

    // Progreso
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

    // Botones
    const btnLogrado = document.getElementById('btn-logrado');
    const btnCambiar = document.getElementById('btn-cambiar-frase');
    btnLogrado.style.backgroundColor = colores[pasilloActual];
    
    const fechaHoy = new Date().toISOString().split('T')[0];
    
    if (listaDias.includes(fechaHoy)) {
        // Si ya lo hizo hoy
        btnLogrado.disabled = true;
        btnLogrado.innerText = "¡RETO CUMPLIDO!";
        btnLogrado.style.opacity = "0.6";
        if (btnCambiar) btnCambiar.style.display = "none";
    } else {
        // Si no lo ha hecho
        btnLogrado.disabled = false;
        btnLogrado.innerText = "¡LOGRADO!";
        btnLogrado.style.opacity = "1";
        if (btnCambiar) btnCambiar.style.display = "block";
    }
}

// GUARDAR PROGRESO
function completarReto() {
    let progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    if (!progreso[pasilloActual]) progreso[pasilloActual] = [];
    
    const hoy = new Date().toISOString().split('T')[0];
    
    if (!progreso[pasilloActual].includes(hoy)) {
        progreso[pasilloActual].push(hoy);
        localStorage.setItem('progreso_market', JSON.stringify(progreso));
        
        actualizarInterfaz();
        
        // Si es el primer día de este pasillo, dar medalla
        if(progreso[pasilloActual].length === 1) {
            lanzarMedalla("🎖️", "¡Excelente Comienzo!", "Has iniciado tu camino en el pasillo de " + pasilloActual);
        }
        
        // Si es el pasillo VIP y lo acaba de completar
        if(pasilloActual === 'vip') {
            lanzarMedalla("💎", "¡MAESTRÍA LOGRADA!", "Has completado todos los pasillos de hoy. ¡Eres un ejemplo de disciplina!");
        }
    }
}

// MODAL DE MEDALLAS
function lanzarMedalla(ico, tit, msg) {
    document.getElementById('insignia-icon').innerText = ico;
    document.getElementById('insignia-titulo').innerText = tit;
    document.getElementById('insignia-msj').innerText = msg;
    document.getElementById('modal-insignia').style.display = 'flex';
}
