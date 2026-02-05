let pasilloActual = 'calma'; 
let db = {
    // Frases de respaldo por si el archivo datos.json falla
    "calma": [{"frase": "Respira hondo, todo fluye.", "reto": "Haz 3 respiraciones profundas ahora."}],
    "resiliencia": [{"frase": "Eres más fuerte de lo que crees.", "reto": "Escribe una victoria de ayer."}],
    "sabiduria": [{"frase": "Aprender es crecer.", "reto": "Lee 5 minutos de un libro."}],
    "empatia": [{"frase": "Conecta con el corazón.", "reto": "Envía un mensaje amable a alguien."}]
};

const colores = {
    'resiliencia': '#4caf50',
    'sabiduria': '#0288d1',
    'calma': '#ff7043',
    'empatia': '#fbc02d'
};

window.onload = async () => {
    try {
        const res = await fetch('datos.json');
        if (res.ok) {
            const data = await res.json();
            db = data; // Si el archivo existe y es válido, usa tus 400 frases
            console.log("Frases cargadas con éxito");
        }
    } catch (e) {
        console.warn("Usando frases de respaldo. Revisa tu archivo datos.json", e);
    }
    actualizarInterfaz();
};

function cambiarPasillo(nuevo) {
    pasilloActual = nuevo;
    actualizarInterfaz();
}

function obtenerDiaDelAnio() {
    const ahora = new Date();
    const inicio = new Date(ahora.getFullYear(), 0, 0);
    const dif = ahora - inicio;
    return Math.floor(dif / (1000 * 60 * 60 * 24));
}

function actualizarInterfaz() {
    const pasilloKey = pasilloActual.toLowerCase(); // Asegura minúsculas
    if (!db[pasilloKey]) return;

    // Seleccionar frase
    const frasesPasillo = db[pasilloKey];
    const diaIndex = obtenerDiaDelAnio() % frasesPasillo.length;
    const hoy = frasesPasillo[diaIndex];

    // Actualizar Textos
    document.getElementById('titulo-pasillo').innerText = Pasillo de ${pasilloActual};
    document.getElementById('frase-display').innerText = hoy.frase;
    document.getElementById('reto-display').innerText = hoy.reto;
    document.getElementById('pasillo-nombre').innerText = pasilloActual.charAt(0).toUpperCase() + pasilloActual.slice(1);
    document.getElementById('nombre-pasillo-stats').innerText = pasilloActual;

    // Lógica de Progreso
    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const listaDias = progreso[pasilloKey] || [];
    const numDias = listaDias.length;
    const porc = ((numDias / 365) * 100).toFixed(1);

    document.getElementById('porcentaje-valor').innerText = numDias;
    document.getElementById('porcentaje-txt').innerText = porc + "%";
    
    const barra = document.getElementById('bar-progreso');
    if(barra) {
        barra.style.width = porc + "%";
        barra.style.backgroundColor = colores[pasilloKey];
    }

    // Botón
    const fechaHoy = new Date().toISOString().split('T')[0];
    const btn = document.getElementById('btn-logrado');
    if(btn) {
        btn.style.backgroundColor = colores[pasilloKey];
        if (listaDias.includes(fechaHoy)) {
            btn.disabled = true;
            btn.innerText = "¡YA CUMPLIDO!";
            document.getElementById('logro-confirmacion').style.display = 'block';
        } else {
            btn.disabled = false;
            btn.innerText = "¡LOGRADO!";
            document.getElementById('logro-confirmacion').style.display = 'none';
        }
    }
}

function completarReto() {
    let progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const pasilloKey = pasilloActual.toLowerCase();
    if (!progreso[pasilloKey]) progreso[pasilloKey] = [];
    
    const fechaHoy = new Date().toISOString().split('T')[0];
    if (!progreso[pasilloKey].includes(fechaHoy)) {
        progreso[pasilloKey].push(fechaHoy);
        localStorage.setItem('progreso_market', JSON.stringify(progreso));
        actualizarInterfaz();
        
        // Medalla al completar el primer día (luego cambia a 18)
        if(progreso[pasilloKey].length === 1) {
            lanzarMedalla("🎖️", "¡Buen inicio!", "Has comenzado tu camino en este pasillo.");
        }
    }
}

function lanzarMedalla(ico, tit, msg) {
    document.getEle
