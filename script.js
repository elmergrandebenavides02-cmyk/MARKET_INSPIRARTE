/**
 * MARKET INSPIRARTE - ARCHIVO DE LÓGICA PRINCIPAL
 * Versión: Maestro / Arquitecto de Bienestar
 * Descripción: Controla acceso, progreso, niveles y neuroplasticidad.
 */

// --- 1. VARIABLES GLOBALES Y ESTADO ---
let pasilloActual = ''; // Almacena el pasillo en el que está el usuario actualmente

// Objeto para guardar la frase que se le asignó al usuario en esta sesión por categoría
let fraseAsignada = { 
    resiliencia: null, 
    sabiduria: null, 
    calma: null, 
    empatia: null, 
    vip: null 
};

// Configuración de colores oficiales por categoría
const colores = { 
    'resiliencia': '#4caf50', 
    'sabiduria': '#0288d1', 
    'calma': '#ff7043', 
    'empatia': '#fbc02d', 
    'vip': '#d4af37' 
};

// Llaves de acceso dinámicas según el mes del año (2026)
const clavesMensuales = {
    0: "MarketEne26", 1: "MarketFeb26", 2: "MarketMar26", 3: "MarketAbr26",
    4: "MarketMay26", 5: "MarketJun26", 6: "MarketJul26", 7: "MarketAgo26",
    8: "MarketSep26", 9: "MarketOct26", 10: "MarketNov26", 11: "MarketDic26"
};

// --- 2. SISTEMA DE ACCESO Y SEGURIDAD ---

/**
 * Valida la contraseña ingresada contra la lista de claves permitidas.
 * Si es correcta, otorga acceso y guarda el estado en Local Storage.
 */
function verificarAcceso() {
    const passIngresada = document.getElementById('input-password').value.trim();
    const clavesValidas = Object.values(clavesMensuales);
    
    if (clavesValidas.includes(passIngresada)) {
        // Celebración de entrada
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        
        // Guardar acceso en el dispositivo
        localStorage.setItem('acceso_market', 'true');
        document.getElementById('pantalla-login').style.display = 'none';
        
        // Si es la primera vez, mostrar la guía de uso automáticamente
        if (localStorage.getItem('guia_leida') !== 'true') {
            abrirInfo(); 
        } else {
            actualizarMenuPrincipal(); 
        }
    } else {
        // Mostrar error si la contraseña es incorrecta
        document.getElementById('error-login').style.display = 'block';
    }
}

/**
 * Abre un chat directo de WhatsApp con soporte técnico.
 */
function contactarSoporte() {
    const telefonoSoporte = "573244173977"; 
    const mesActualNombre = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
    const mensaje = `Hola! 👋 Necesito soporte con mi llavero del Market Inspirarte. No puedo acceder con mi código de ${mesActualNombre}.`;
    window.open(`https://wa.me/${telefonoSoporte}?text=${encodeURIComponent(mensaje)}`, '_blank');
}

/**
 * Al cargar la página, verifica si el usuario ya tenía el acceso guardado.
 */
window.onload = () => {
    if (localStorage.getItem('acceso_market') === 'true') {
        const loginPantalla = document.getElementById('pantalla-login');
        if(loginPantalla) loginPantalla.style.display = 'none';
        actualizarMenuPrincipal();
    }
};

// --- 3. NAVEGACIÓN ENTRE PANTALLAS ---

/**
 * Cambia la vista del menú principal a la vista del pasillo seleccionado.
 */
function irAPasillo(nombre) {
    pasilloActual = nombre;
    document.getElementById('menu-principal').style.display = 'none';
    document.getElementById('pantalla-reto').style.display = 'block';
    
    // Si no tiene una frase asignada aún, o es el VIP, elegimos una nueva
    if (!fraseAsignada[pasilloActual] || pasilloActual === 'vip') {
        seleccionarFraseNueva();
    }
    actualizarInterfaz();
}

/**
 * Regresa al menú principal.
 */
function mostrarMenu() {
    document.getElementById('menu-principal').style.display = 'block';
    document.getElementById('pantalla-reto').style.display = 'none';
    actualizarMenuPrincipal(); // Refresca contadores y barras de progreso
}

/**
 * Elige una frase al azar de la base de datos (frases.js) según el pasillo actual.
 */
function seleccionarFraseNueva() {
    const lista = frasesDB[pasilloActual];
    if (lista && lista.length > 0) {
        fraseAsignada[pasilloActual] = lista[Math.floor(Math.random() * lista.length)];
    }
}

// --- 4. RENDERIZADO Y NEUROPLASTICIDAD ---

/**
 * Actualiza todos los textos, colores y barras de progreso en la pantalla del reto.
 */
function actualizarInterfaz() {
    const hoyFrase = fraseAsignada[pasilloActual];
    if (!hoyFrase) return;

    // Inyectar textos de la frase y el reto
    document.getElementById('titulo-pasillo').innerText = pasilloActual;
    document.getElementById('frase-display').innerText = `"${hoyFrase.frase}"`;
    document.getElementById('reto-display').innerText = hoyFrase.reto;

    // Obtener progreso histórico del Local Storage
    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const lista = progreso[pasilloActual] || [];
    const numDias = lista.length;
    
    // Calcular porcentaje basado en meta de 14 días para hábito inicial
    let porcentaje = Math.min((numDias / 14) * 100, 100).toFixed(0);
    
    // Determinar Rango del Usuario según constancia
    let nivelTexto = "";
    let iconoNivel = "";
    if (numDias < 7) { 
        nivelTexto = "Iniciado"; iconoNivel = "🌱"; 
    } else if (numDias < 14) { 
        nivelTexto = "Aprendiz"; iconoNivel = "🌿"; 
    } else if (numDias < 21) { 
        nivelTexto = "Practicante"; iconoNivel = "🌳"; 
    } else { 
        nivelTexto = "Maestro"; iconoNivel = "👑"; 
    }

    // Actualizar elementos visuales de progreso
    document.getElementById('porcentaje-valor').innerText = numDias;
    document.getElementById('porcentaje-txt').innerText = `${nivelTexto} ${iconoNivel} (${porcentaje}%)`;
    
    const barraDetalle = document.getElementById('bar-reto-detalle');
    if(barraDetalle) {
        barraDetalle.style.width = porcentaje + "%";
        barraDetalle.style.backgroundColor = colores[pasilloActual];
    }

    // --- LÓGICA DEL BOTÓN DE COMPROMISO ---
    const btn = document.getElementById('btn-logrado');
    const leyenda = document.getElementById('instruccion-compromiso');
    const fechaHoy = new Date().toLocaleDateString('en-CA'); // Formato YYYY-MM-DD
    
    if (lista.includes(fechaHoy)) {
        // Si ya lo hizo hoy, desactivar botón para evitar duplicados
        btn.disabled = true;
        btn.innerText = "🤝 COMPROMISO ADQUIRIDO";
        btn.style.opacity = "0.5";
        btn.style.backgroundColor = "#ccc";
        btn.style.cursor = "default";
        if(leyenda) {
            leyenda.innerHTML = "✅ <strong>¡Reto activado!</strong> Tu mente ya está trabajando. No olvides usar tu llavero como ancla visual para cumplirlo.";
        }
    } else {
        // Botón disponible para aceptar el compromiso
        btn.disabled = false;
        btn.innerText = "LO ACEPTO / ¡LOGRADO!";
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
        btn.style.backgroundColor = colores[pasilloActual] || "var(--cafe)";
        if(leyenda) {
            leyenda.innerHTML = `📌 <strong>Tip de Bienestar:</strong> Si no puedes cumplirlo ahora, presiona el botón como <strong>compromiso mental</strong>. <br> <span style="color: var(--cafe-claro); display:block; margin-top:5px;">🔑 Deja tu llavero en un lugar visible (espejo, PC o mesa) para recordarlo durante el día.</span>`;
        }
    }
}

// --- 5. ACCIÓN DE COMPLETAR Y PREMIACIÓN ---

/**
 * Registra el reto como completado en el Local Storage y dispara celebraciones.
 */
function completarReto() {
    let progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    if (!progreso[pasilloActual]) progreso[pasilloActual] = [];
    const hoy = new Date().toLocaleDateString('en-CA');
    
    if (!progreso[pasilloActual].includes(hoy)) {
        // Guardar la fecha de hoy en el historial del pasillo
        progreso[pasilloActual].push(hoy);
        localStorage.setItem('progreso_market', JSON.stringify(progreso));
        
        const totalDias = progreso[pasilloActual].length;
        
        // Efecto visual inmediato en el botón
        const btn = document.getElementById('btn-logrado');
        const leyenda = document.getElementById('instruccion-compromiso');
        if(btn) {
            btn.innerText = "🤝 COMPROMISO ADQUIRIDO";
            btn.style.backgroundColor = "#ccc";
            btn.disabled = true;
        }
        if(leyenda) {
            leyenda.innerHTML = "✅ <strong>¡Reto activado!</strong> Tu mente ya está trabajando.";
        }

        // --- PREMIOS POR HITOS DE CONSTANCIA ---
        if (totalDias === 14) {
            lanzarConfettiEspecial();
            lanzarMedalla("👑", "¡NIVEL PRACTICANTE!", "Has mantenido tu constancia por 14 días. ¡El hábito ya es parte de ti!");
            actualizarInterfaz();
        } else {
            // Animación de éxito estándar
            confetti({ 
                particleCount: 150, 
                spread: 70, 
                origin: { y: 0.6 }, 
                colors: [colores[pasilloActual], '#fff'] 
            });
            
            // Regresar al menú tras 2 segundos de celebración
            setTimeout(() => {
                actualizarInterfaz();
                mostrarMenu();
            }, 2000); 
        }
    }
}

/**
 * Crea una lluvia de confeti persistente para hitos importantes.
 */
function lanzarConfettiEspecial() {
    var duration = 5 * 1000;
    var end = Date.now() + duration;
    (function frame() {
      confetti({ particleCount: 10, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#d4af37', '#fcf6ba'] });
      confetti({ particleCount: 10, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#d4af37', '#fcf6ba'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

// --- 6. GESTIÓN DEL MENÚ PRINCIPAL Y PASILLO VIP ---

/**
 * Calcula el progreso de todas las categorías y decide si se muestra el VIP.
 */
function actualizarMenuPrincipal() {
    const progreso = JSON.parse(localStorage.getItem('progreso_market')) || {};
    const pasillos = ['resiliencia', 'sabiduria', 'calma', 'empatia'];
    let completadosHoy = 0;
    const hoy = new Date().toLocaleDateString('en-CA');

    // Recorrer cada pasillo para actualizar sus contadores visuales
    pasillos.forEach(p => {
        const lista = progreso[p] || [];
        if (lista.includes(hoy)) completadosHoy++;
        
        const contador = document.getElementById(`mini-dias-${p}`);
        if (contador) contador.innerText = lista.length;
        
        const barraMenu = document.getElementById(`bar-menu-${p}`);
        if (barraMenu) {
            const porc = Math.min((lista.length / 14) * 100, 100);
            barraMenu.style.width = porc + "%";
        }
    });

    // --- LÓGICA PASILLO VIP ---
    // Solo aparece si el usuario ha completado los 4 pasillos base el día de hoy
    const cardVip = document.getElementById('card-vip');
    if (cardVip) {
        cardVip.style.display = (completadosHoy >= 4) ? "block" : "none";
    }
}

// --- 7. FUNCIONES DE APOYO Y COMPARTIR ---

/**
 * Genera un mensaje estructurado para compartir en WhatsApp.
 */
function compartirWhatsApp() {
    const titulo = pasilloActual.toUpperCase();
    const frase = document.getElementById('frase-display').innerText;
    const reto = document.getElementById('reto-display').innerText;
    
    const mensaje = encodeURIComponent(
        `🚀 *MI CHISPA DIARIA - MARKET INSPIRARTE* 🚀\n\n` +
        `📍 *Pasillo:* ${titulo}\n\n` +
        `✨ *La frase de hoy:* \n${frase}\n\n` +
        `⚡ *Mi reto:* \n${reto}\n\n` +
        `🔑 _Inicia tu día con propósito._\n\n` +
        `--- \n` +
        `🎁 Adquiere tu llave en *Enkanta2 Arte Manual*\n` +
        `📲 WhatsApp: 3244173977`
    );
    window.open(`https://wa.me/?text=${mensaje}`, '_blank');
}

/**
 * Muestra el modal de medallas/insignias de nivel.
 */
function lanzarMedalla(ico, tit, msg) {
    document.getElementById('insignia-icon').innerText = ico;
    document.getElementById('insignia-titulo').innerText = tit;
    document.getElementById('insignia-msj').innerText = msg;
    document.getElementById('modal-insignia').style.display = 'flex';
}

/**
 * Cierra la medalla y devuelve al usuario al menú.
 */
function cerrarModalYMenu() {
    document.getElementById('modal-insignia').style.display = 'none';
    mostrarMenu();
}

// Control de apertura y cierre del modal de información (Guía de Uso)
function abrirInfo() { document.getElementById('modal-info').style.display = 'flex'; }

function cerrarInfo() {
    document.getElementById('modal-info').style.display = 'none';
    // Marcar como leída para que no se abra automáticamente de nuevo
    localStorage.setItem('guia_leida', 'true'); 
    actualizarMenuPrincipal(); 
}
