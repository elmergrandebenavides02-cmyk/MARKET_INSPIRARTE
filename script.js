let pasilloActual = '';
let fraseAsignada = { resiliencia: null, sabiduria: null, calma: null, empatia: null, vip: null };
const colores = { 'resiliencia': '#4caf50', 'sabiduria': '#0288d1', 'calma': '#ff7043', 'empatia': '#fbc02d', 'vip': '#d4af37' };

window.onload = () => { 
    actualizarMenuPrincipal(); 
};

function irAPasillo(nombre) {
    pasilloActual = nombre;
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('pantalla-reto').style.display = 'block';
    
    // Si no hay frase para hoy en este pasillo, elegimos una
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
    if (lista && lista.length > 0) {
        fraseAsignada[pasilloActual] = lista[Math.floor(Math.random() * lista.length)];
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
        
        // Actualizar mini contadores del menú
        const miniContador = document.getElementById(`mini-dias-${p}`);
        if (miniContador) miniContador.innerText = lista.length;
        
        const miniBarra = document.getElementById(`mini-bar-${p}`);
        if (miniBarra) {
            const porc = Math.min((lista.length / 365) * 100, 100);
            miniBarra.style.width = porc + "%";
        }
    });

    // Mostrar/Ocultar VIP si los 4 están hechos hoy
    const cardVip = document.getElementById('card-vip');
    if (cardVip) cardVip.style.display = (completadosHoy >= 4) ? "block" : "none";
}

function actualizarInterfaz() {
    const hoy = fraseAsignada[pasilloActual];
    if (!hoy) return;

    // Actualizar Textos
    document.getElementById('titulo-pasillo').innerText = "Pasillo de " + pasilloActual;
    document.getElementById('frase-display').innerText = `"${hoy.frase}"`;
    document.getElementById('reto-display').innerText = hoy.reto;

    // Actualizar Progreso
    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const lista = progreso[pasilloActual] || [];
    const numDias = lista.length;
    const porcentaje = Math.min((numDias / 365) * 100, 100).toFixed(1);

    // ESTA ES LA PARTE QUE DABA ERROR: verificamos que los IDs existan
    const txtPorc = document.getElementById('porcentaje-txt');
    if (txtPorc) txtPorc.innerText = porcentaje + "% completado";
    
    const valPorc = document.getElementById('porcentaje-valor');
    if (valPorc) valPorc.innerText = numDias;

    const barra = document.getElementById('bar-progreso');
    if (barra) {
        barra.style.width = porcentaje + "%";
        barra.style.backgroundColor = colores[pasilloActual];
    }

    // Estado del botón Logrado
    const btn = document.getElementById('btn-logrado');
    const fechaHoy = new Date().toISOString().split('T')[0];
    if (lista.includes(fechaHoy)) {
        btn.disabled = true;
        btn.innerText = "¡RETO CUMPLIDO!";
        btn.style.opacity = "0.6";
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
        
        // Efecto Confeti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: [colores[pasilloActual], '#ffffff']
        });

        actualizarInterfaz();
        
        // Mensaje de éxito
        setTimeout(() => {
            lanzarMedalla("🏆", "¡Excelente!", "Has dado un paso más hacia tu maestría personal.");
        }, 500);
    }
}

function compartirWhatsApp() {
    const frase = document.getElementById('frase-display').innerText;
    const reto = document.getElementById('reto-display').innerText;
    const texto = `*Market Inspirarte*%0A%0A✨ *Frase del día:* ${frase}%0A%0A💪 *Mi reto:* ${reto}`;
    window.open(`https://wa.me/?text=${texto}`, '_blank');
}

function lanzarMedalla(ico, tit, msg) {
    const modal = document.getElementById('modal-insignia');
    if (modal) {
        document.getElementById('insignia-icon').innerText = ico;
        document.getElementById('insignia-titulo').innerText = tit;
        document.getElementById('insignia-msj').innerText = msg;
        modal.style.display = 'flex';
    }
}
