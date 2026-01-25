let bibliotecaFrases = {};
let categoriaActual = "";

// Cargar el JSON desde tu archivo datos.json
fetch('datos.json')
    .then(res => res.json())
    .then(data => {
        bibliotecaFrases = data;
        actualizarRachaInterfaz();
    })
    .catch(err => console.error("Error cargando frases:", err));

function mostrarInspiracion(tipo) {
    categoriaActual = tipo;
    const lista = bibliotecaFrases[tipo];
    
    // Selección aleatoria
    const azar = lista[Math.floor(Math.random() * lista.length)];

    document.getElementById('titulo-pasillo').innerText = "Pasillo de " + tipo;
    document.getElementById('cita').innerText = `"${azar.frase}"`;
    document.getElementById('reto').innerText = "Tu reto: " + azar.reto;
    
    document.getElementById('seleccion').style.display = 'none';
    document.getElementById('pantalla-inspiracion').style.display = 'block';

    verificarEstadoBoton();
}

function verificarEstadoBoton() {
    const hoy = new Date().toDateString();
    const completados = JSON.parse(localStorage.getItem('market_completados') || '{}');
    const boton = document.getElementById('btn-finalizar');
    const mensaje = document.getElementById('msg-hecho');

    if (completados[categoriaActual] === hoy) {
        boton.disabled = true;
        boton.innerText = "¡LOGRADO!";
        mensaje.style.display = "block";
    } else {
        boton.disabled = false;
        boton.innerText = "ENTRENAMIENTO COMPLETADO";
        mensaje.style.display = "none";
    }
}

function finalizar() {
    // LANZAR CONFETI 🎉
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6d4c41', '#8bc34a', '#03a9f4', '#ffc107']
    });

    const hoy = new Date().toDateString();
    let registro = JSON.parse(localStorage.getItem('market_completados') || '{}');
    
    // Guardar progreso diario por categoría
    registro[categoriaActual] = hoy;
    localStorage.setItem('market_completados', JSON.stringify(registro));

    // Aumentar racha
    let racha = parseInt(localStorage.getItem('market_racha') || 0);
    racha++;
    localStorage.setItem('market_racha', racha);

    actualizarRachaInterfaz();
    verificarEstadoBoton();
}

function actualizarRachaInterfaz() {
    const contadorElemento = document.getElementById('contador');
    if (contadorElemento) {
        contadorElemento.innerText = localStorage.getItem('market_racha') || 0;
    }
}

function regresar() {
    document.getElementById('pantalla-inspiracion').style.display = 'none';
    document.getElementById('seleccion').style.display = 'block';
}