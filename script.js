// chaustrexp - Chatbot de Diseño, Inglés y Entretenimiento

// Referencias DOM
const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const suggestionChips = document.querySelectorAll('.suggestion-chip');

// Variable para rastrear si es la primera vez
let primeraVez = true;
let introMostrada = false;
let yaSaludo = false; // Para rastrear si ya se hizo un saludo en esta sesión

// Intro animada al cargar
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        mostrarIntroBienvenida();
    }, 300);
});

// Event Listeners
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Sugerencias rápidas
suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
        userInput.value = chip.getAttribute('data-text');
        sendMessage();
    });
});

// Funciones
function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Mostrar mensaje del usuario
    addMessage(message, 'user');
    
    // Limpiar input
    userInput.value = '';
    
    // Mostrar indicador de escritura
    showTypingIndicator();
    
    // Simular delay y generar respuesta
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateBotResponse(message);
        
        // Verificar si la respuesta contiene media (imagen/video)
        if (typeof response === 'object' && response.media) {
            addMessage(response.text, 'bot', response.media);
        } else {
            addMessage(response, 'bot');
        }
    }, 1000);
}

function addMessage(text, type, media = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const avatar = type === 'bot' ? '🎨' : '👤';
    
    // Si hay media (imagen o video), incluirlo en el mensaje
    let mediaHTML = '';
    if (media) {
        if (media.type === 'image') {
            mediaHTML = `
                <div class="message-media">
                    <img src="${media.url}" alt="${media.alt || 'Imagen'}" class="message-image" loading="lazy">
                    <div class="image-loader">
                        <div class="loader-spinner"></div>
                    </div>
                </div>
            `;
        } else if (media.type === 'video') {
            mediaHTML = `
                <div class="message-media">
                    <video class="message-video" controls preload="metadata">
                        <source src="${media.url}" type="${media.mimeType || 'video/mp4'}">
                        Tu navegador no soporta la reproducción de videos.
                    </video>
                </div>
            `;
        }
    }
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-bubble ${type}-bubble">
                ${formatMessage(text)}
                ${mediaHTML}
            </div>
            <span class="message-time">${getCurrentTime()}</span>
        </div>
    `;
    
    chatContainer.appendChild(messageDiv);
    scrollToBottom();
    
    // Remover loader cuando la imagen se cargue
    if (media && media.type === 'image') {
        const img = messageDiv.querySelector('.message-image');
        const loader = messageDiv.querySelector('.image-loader');
        if (img && loader) {
            img.onload = () => {
                loader.style.display = 'none';
            };
            img.onerror = () => {
                loader.style.display = 'none';
                img.style.display = 'none';
            };
        }
    }
}

function formatMessage(text) {
    // Convertir markdown básico a HTML
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/\n\n/g, '</p><p>');
    text = text.replace(/\n/g, '<br>');
    return `<p>${text}</p>`;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">🎨</div>
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    chatContainer.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function mostrarIntroBienvenida() {
    if (introMostrada) return;
    introMostrada = true;
    
    const intro = `
¡Hola! 👋 Bienvenido/a al asistente virtual de **Trabajos y Carrera**.

Estoy aquí para ayudarte a avanzar en tu camino profesional 🚀

Puedo apoyarte con:

💼 **Creación de CVs efectivos**

📝 **Redacción de cartas de presentación**

🎯 **Preparación para entrevistas**

💬 **Frases y comunicación profesional**

💻 **Programación y Desarrollo** (Frontend, Backend, Fullstack)

✨ **Diseño Gráfico y UI/UX**

📚 **Aprendizaje de Inglés**

🎬 **Entretenimiento** (Series, Películas, Música)

🏃 **Deportes y Fitness**

🍴 **Comidas y Bebidas**

¿En qué te gustaría que te ayude hoy? 💡`;
    
    addMessage(intro, 'bot');
}

function getSaludoSegunHora() {
    const hora = new Date().getHours();
    if (hora >= 5 && hora < 12) {
        return 'Buenos días';
    } else if (hora >= 12 && hora < 19) {
        return 'Buenas tardes';
    } else {
        return 'Buenas noches';
    }
}

function generateBotResponse(mensajeUsuario) {
    const mensajeLower = mensajeUsuario.toLowerCase().trim();
    
    // Detectar saludos
    if (esSaludo(mensajeLower)) {
        return generarRespuestaSaludo(mensajeLower);
    }
    
    // Detectar despedidas
    if (esDespedida(mensajeLower)) {
        return generarRespuestaDespedida();
    }
    
    // Detectar solicitudes de fotos/videos
    const solicitudFoto = detectarFoto(mensajeLower);
    const solicitudVideo = detectarVideo(mensajeLower);
    
    if (solicitudFoto) {
        return generarRespuestaConFoto(mensajeUsuario, mensajeLower);
    } else if (solicitudVideo) {
        return generarRespuestaConVideo(mensajeUsuario, mensajeLower);
    }
    
    // Detectar temas
    const esIngles = detectarIngles(mensajeLower);
    const esDiseno = detectarDiseno(mensajeLower);
    const esEntretenimiento = detectarEntretenimiento(mensajeLower);
    const esDeportes = detectarDeportes(mensajeLower);
    const esComidaBebida = detectarComidaBebida(mensajeLower);
    const esTrabajo = detectarTrabajo(mensajeLower);
    const esProgramacion = detectarProgramacion(mensajeLower);
    
    if (esDiseno) {
        return generarRespuestaDiseno(mensajeLower);
    } else if (esProgramacion) {
        return generarRespuestaProgramacion(mensajeLower);
    } else if (esIngles) {
        return generarRespuestaIngles(mensajeLower);
    } else if (esEntretenimiento) {
        return generarRespuestaEntretenimiento(mensajeLower);
    } else if (esDeportes) {
        return generarRespuestaDeportes(mensajeLower);
    } else if (esComidaBebida) {
        return generarRespuestaComidaBebida(mensajeLower);
    } else if (esTrabajo) {
        return generarRespuestaTrabajo(mensajeLower);
    } else {
        return "**¡Hola! 👋 Bienvenido/a al asistente virtual de Trabajos y Carrera.**\n\nEstoy aquí para ayudarte a avanzar en tu camino profesional 🚀\n\nPuedo apoyarte con:\n\n💼 **Creación de CVs efectivos**\n📝 **Redacción de cartas de presentación**\n🎯 **Preparación para entrevistas**\n💬 **Frases y comunicación profesional**\n💻 **Programación y Desarrollo**\n✨ **Diseño Gráfico y UI/UX**\n📚 **Aprendizaje de Inglés**\n🎬 **Entretenimiento**\n🏃 **Deportes y Fitness**\n🍴 **Comidas y Bebidas**\n\n**¿En qué te gustaría que te ayude hoy?** 💡";
    }
}

function esSaludo(mensaje) {
    const saludos = [
        // Saludos básicos
        'hola', 'hi', 'hey', 'hello', 'holis', 'hola', 'holii',
        // Saludos formales con hora del día
        'buenos días', 'buenos dias', 'buen día', 'buen dia', 'good morning',
        'buenas tardes', 'buenas tades', 'good afternoon',
        'buenas noches', 'buenas noches', 'good evening', 'good night',
        // Saludos informales
        'saludos', 'qué tal', 'que tal', 'quetal', 'qué hay', 'que hay',
        'qué onda', 'que onda', 'qué pasa', 'que pasa',
        // Preguntas sobre el estado
        'cómo está', 'como esta', 'cómo estás', 'como estas', 'como estas',
        'cómo andas', 'como andas', 'cómo vas', 'como vas',
        'cómo te va', 'como te va', 'qué tal estás', 'que tal estas',
        // Otras formas
        'hey ahí', 'ey', 'oye', 'epa', 'alo', 'aló'
    ];
    return saludos.some(saludo => mensaje.includes(saludo));
}

function esDespedida(mensaje) {
    const despedidas = [
        'adiós', 'adios', 'hasta luego', 'nos vemos', 'chao', 'chau',
        'hasta pronto', 'hasta la vista', 'hasta mañana'
    ];
    return despedidas.some(despedida => mensaje.includes(despedida));
}

function detectarFoto(mensaje) {
    const palabrasFoto = [
        'foto', 'fotos', 'imagen', 'imágenes', 'imagenes', 'picture', 'pictures',
        'muéstrame una foto', 'muestrame una foto', 'genera una foto', 'crea una foto',
        'enséñame una foto', 'ensename una foto', 'dame una foto', 'quiero una foto',
        'necesito una foto', 'busca una foto', 'muéstrame foto', 'muestrame foto',
        'genera foto', 'crea foto', 'muestra foto', 'ver foto', 'ver fotos'
    ];
    
    const patrones = [
        /\b(genera?|crea?|muestra?|enseñ?a|dame|quiero|necesito)\s+(una\s+)?(foto|imagen)/i,
        /\b(foto|imagen).*(genera?|crea?|muestra?|dame)/i
    ];
    
    const tienePalabra = palabrasFoto.some(p => mensaje.includes(p));
    const tienePatron = patrones.some(patron => patron.test(mensaje));
    
    return tienePalabra || tienePatron;
}

function detectarVideo(mensaje) {
    const palabrasVideo = [
        'video', 'vídeo', 'videos', 'videos', 'clip', 'clips', 'videoclip',
        'muéstrame un video', 'muestrame un video', 'muéstrame un vídeo', 'muestrame un video',
        'genera un video', 'genera un vídeo', 'crea un video', 'crea un vídeo',
        'enséñame un video', 'ensename un video', 'dame un video', 'quiero un video',
        'necesito un video', 'busca un video', 'muéstrame video', 'muestrame video',
        'genera video', 'crea video', 'muestra video', 'ver video', 'ver videos',
        'reproduce', 'reproducir', 'play'
    ];
    
    const patrones = [
        /\b(genera?|crea?|muestra?|enseñ?a|dame|quiero|necesito|reproduce?)\s+(un\s+)?(video|v[ií]deo|clip)/i,
        /\b(video|v[ií]deo|clip).*(genera?|crea?|muestra?|dame|reproduce?)/i
    ];
    
    const tienePalabra = palabrasVideo.some(p => mensaje.includes(p));
    const tienePatron = patrones.some(patron => patron.test(mensaje));
    
    return tienePalabra || tienePatron;
}

function detectarIngles(mensaje) {
    const palabras = [
        'inglés', 'ingles', 'english', 'aprender inglés', 'aprender ingles',
        'estudiar inglés', 'estudiar ingles', 'aprendo inglés', 'aprendo ingles',
        'gramática', 'gramatica', 'vocabulario', 'pronunciación', 'pronunciacion',
        'speaking', 'writing', 'verbos', 'tiempos verbales', 'preposiciones',
        'conversación', 'conversacion', 'clase de inglés', 'clase de ingles',
        'curso de inglés', 'curso de ingles', 'mejorar inglés', 'mejorar ingles',
        'practicar inglés', 'practicar ingles', 'hablar inglés', 'hablar ingles',
        'nivel de inglés', 'nivel de ingles', 'aprendizaje de inglés',
        'aprendizaje de ingles'
    ];
    // Buscar coincidencias exactas y parciales
    const tienePalabra = palabras.some(p => mensaje.includes(p));
    
    // Detectar frases comunes
    const frases = [
        'quiero aprender', 'quiero estudiar', 'cómo aprender', 'como aprender',
        'enseñame inglés', 'enseñame ingles', 'ayuda con inglés', 'ayuda con ingles',
        'tutorial inglés', 'tutorial ingles'
    ];
    const tieneFrase = frases.some(f => mensaje.includes(f));
    
    return tienePalabra || tieneFrase;
}

function detectarDiseno(mensaje) {
    const palabras = [
        'diseño', 'diseno', 'interfaz', 'ui', 'ux', 'poster', 'afiche',
        'gráfico', 'grafico', 'visual', 'colores', 'tipografía', 'tipografia',
        'layout', 'paleta de colores', 'paleta de colores', 'fotoshop',
        'illustrator', 'figma', 'adobe', 'logo', 'marca', 'branding',
        'iconos', 'mockup', 'ui/ux', 'ui ux', 'diseño ui', 'diseno ui',
        'diseño ux', 'diseno ux', 'interfaz de usuario', 'experiencia de usuario',
        'user interface', 'user experience', 'diseñar interfaz', 'disenar interfaz',
        'ideas para diseñar', 'ideas para disenar', 'diseño de interfaz',
        'diseno de interfaz', 'diseño de interfaces', 'diseno de interfaces'
    ];
    
    // Detectar específicamente UI/UX
    const patronesUIUX = [
        /\b(ui|ux)\b/i,
        /\bui\/ux\b/i,
        /\bui ux\b/i,
        /\bdiseño\s+(ui|ux)\b/i,
        /\bdiseno\s+(ui|ux)\b/i,
        /\b(ideas|consejos|ayuda)\s+.*(ui|ux|interfaz)/i
    ];
    
    const tieneUIUX = patronesUIUX.some(patron => patron.test(mensaje));
    const tienePalabra = palabras.some(p => mensaje.includes(p));
    
    return tienePalabra || tieneUIUX;
}

function detectarEntretenimiento(mensaje) {
    const palabras = [
        'serie', 'series', 'película', 'pelicula', 'películas', 'peliculas',
        'documental', 'documentales', 'música', 'musica', 'recomend', 'recomiend',
        'recomendacion', 'recomendación', 'recomendame', 'recomiéndame',
        'ver', 'escuchar', 'mirar', 'netflix', 'disney', 'prime', 'hbo',
        'spotify', 'canción', 'cancion', 'canciones', 'banda', 'artista',
        'album', 'álbum', 'pelicula', 'películas', 'cine', 'tv', 'televisión',
        'television', 'streaming', 'plataforma'
    ];
    
    // Detectar frases comunes para recomendaciones de series
    const frasesRecomendacion = [
        'recomienda serie', 'recomiéndame serie', 'recomendame serie',
        'recomienda una serie', 'recomiéndame una serie', 'recomendame una serie',
        'qué serie', 'que serie', 'serie para ver', 'serie que ver',
        'mejor serie', 'buena serie', 'series recomendadas', 'series buenas',
        'ver serie', 'ver series', 'ver una serie', 'qué ver', 'que ver',
        'película para ver', 'pelicula para ver', 'recomienda película',
        'recomienda pelicula', 'recomiéndame película', 'recomendame pelicula'
    ];
    
    const tienePalabra = palabras.some(p => mensaje.includes(p));
    const tieneFrase = frasesRecomendacion.some(f => mensaje.includes(f));
    
    // Detectar patrones con regex para mayor flexibilidad
    const patrones = [
        /\brecomi[eé]nd[ao]me?\b/i,
        /\b(recomienda|recomiendame|recomiéndame)\s+(una\s+)?(serie|pel[íi]cula)/i,
        /\b(serie|pel[íi]cula|documental).*(ver|recomendar|recomendaci[oó]n)/i,
        /\b(qué|que)\s+(serie|pel[íi]cula|ver|recomendar)/i
    ];
    
    const tienePatron = patrones.some(patron => patron.test(mensaje));
    
    return tienePalabra || tieneFrase || tienePatron;
}

function detectarDeportes(mensaje) {
    const palabras = [
        'deporte', 'deportes', 'fútbol', 'futbol', 'futbol', 'fútbol', 'soccer',
        'basketball', 'baloncesto', 'tenis', 'natación', 'natacion', 'natación',
        'ciclismo', 'running', 'correr', 'gimnasio', 'gym', 'ejercicio', 'ejercicios',
        'fitness', 'entrenamiento', 'entrenar', 'maratón', 'maraton', 'carrera',
        'boxeo', 'mma', 'karate', 'yoga', 'pilates', 'crosstraining', 'crossfit',
        'voleibol', 'voley', 'beisbol', 'béisbol', 'baseball', 'rugby', 'hockey',
        'equipo', 'equipos', 'partido', 'partidos', 'liga', 'campeonato', 'mundial',
        'olimpicos', 'olímpicos', 'atleta', 'atletas', 'jugador', 'jugadores'
    ];
    
    const frases = [
        'información sobre deportes', 'info de deportes', 'qué deporte',
        'que deporte', 'mejor deporte', 'recomienda deporte', 'deporte para',
        'ejercicio', 'hacer ejercicio', 'practicar deporte', 'entrenar'
    ];
    
    const tienePalabra = palabras.some(p => mensaje.includes(p));
    const tieneFrase = frases.some(f => mensaje.includes(f));
    
    return tienePalabra || tieneFrase;
}

function detectarComidaBebida(mensaje) {
    const palabras = [
        'comida', 'comidas', 'bebida', 'bebidas', 'receta', 'recetas', 'cocinar',
        'cocina', 'restaurante', 'restaurantes', 'plato', 'platos', 'menu', 'menú',
        'desayuno', 'almuerzo', 'cena', 'snack', 'snacks', 'aperitivo', 'aperitivos',
        'postre', 'postres', 'ensalada', 'ensaladas', 'pasta', 'pizza', 'hamburguesa',
        'tacos', 'sushi', 'arroz', 'pollo', 'carne', 'pescado', 'verduras', 'frutas',
        'café', 'cafe', 'té', 'te', 'agua', 'jugo', 'jugos', 'batido', 'batidos',
        'smoothie', 'smoothies', 'vino', 'cerveza', 'cocktail', 'coctel', 'cóctel',
        'bar', 'cocteleria', 'coctelería', 'nutrición', 'nutricion', 'dieta', 'dietas',
        'saludable', 'vegetariano', 'vegano', 'vegetariana', 'vegana', 'saludable'
    ];
    
    const frases = [
        'qué comer', 'que comer', 'recomienda comida', 'mejor comida',
        'qué beber', 'que beber', 'recomienda bebida', 'mejor bebida',
        'receta para', 'como cocinar', 'cómo cocinar', 'receta de',
        'restaurante recomendado', 'buen restaurante', 'lugar para comer'
    ];
    
    const tienePalabra = palabras.some(p => mensaje.includes(p));
    const tieneFrase = frases.some(f => mensaje.includes(f));
    
    return tienePalabra || tieneFrase;
}

function detectarTrabajo(mensaje) {
    const palabras = [
        'trabajo', 'trabajos', 'empleo', 'empleos', 'curriculum', 'currículum',
        'curriculum vitae', 'cv', 'carta de presentación', 'carta de presentacion',
        'entrevista', 'entrevistas', 'entrevista de trabajo', 'hoja de vida',
        'resumen', 'resume', 'linkedin', 'portafolio', 'portfolio', 'aplicar',
        'aplicación', 'aplicacion', 'postular', 'postulación', 'postulacion',
        'reclutamiento', 'reclutador', 'reclutadora', 'rrhh', 'recursos humanos',
        'oferta laboral', 'oferta de trabajo', 'vacante', 'vacantes', 'puesto',
        'cargo', 'posición', 'posicion', 'experiencia laboral', 'experiencia profesional'
    ];
    
    const frases = [
        'escribir cv', 'hacer cv', 'crear cv', 'como hacer un cv', 'cómo hacer un cv',
        'carta de presentación', 'carta de presentacion', 'frases para cv',
        'ejemplo de cv', 'plantilla cv', 'modelo cv', 'formato cv',
        'preparar entrevista', 'consejos entrevista', 'como pasar entrevista',
        'cómo pasar entrevista', 'buscar trabajo', 'encontrar trabajo',
        'redactar', 'escribir', 'texto para', 'frase para', 'escrito para'
    ];
    
    const patrones = [
        /\b(cv|curriculum|curr[ií]culum)\b/i,
        /\b(carta|escrito|texto|frase).*(trabajo|empleo|cv|curriculum)/i,
        /\b(como|cómo)\s+(hacer|crear|escribir|redactar).*(cv|curriculum|carta)/i,
        /\b(para|de)\s+(trabajo|empleo|entrevista|cv)/i
    ];
    
    const tienePalabra = palabras.some(p => mensaje.includes(p));
    const tieneFrase = frases.some(f => mensaje.includes(f));
    const tienePatron = patrones.some(patron => patron.test(mensaje));
    
    return tienePalabra || tieneFrase || tienePatron;
}

function detectarProgramacion(mensaje) {
    const palabras = [
        'programación', 'programacion', 'programador', 'desarrollador', 'developer',
        'código', 'codigo', 'code', 'coding', 'software', 'aplicación', 'aplicacion',
        'app', 'web', 'frontend', 'front-end', 'front end', 'backend', 'back-end',
        'back end', 'fullstack', 'full-stack', 'full stack', 'fullstack',
        'javascript', 'js', 'python', 'java', 'php', 'react', 'vue', 'angular',
        'node', 'nodejs', 'html', 'css', 'typescript', 'ts', 'sql', 'database',
        'base de datos', 'api', 'rest', 'graphql', 'framework', 'librería', 'libreria',
        'library', 'git', 'github', 'gitlab', 'deployment', 'despliegue',
        'arquitectura', 'algoritmo', 'algoritmos', 'estructura de datos',
        'diseño de software', 'diseno de software', 'clean code', 'código limpio',
        'codigo limpio', 'patrones de diseño', 'design patterns', 'agile', 'scrum'
    ];
    
    const frases = [
        'como programar', 'cómo programar', 'aprender a programar', 'programar en',
        'desarrollo web', 'desarrollo de software', 'crear aplicación', 'crear app',
        'hacer una app', 'desarrollar software', 'lenguaje de programación',
        'lenguaje de programacion', 'que es frontend', 'qué es frontend',
        'que es backend', 'qué es backend', 'que es fullstack', 'qué es fullstack',
        'stack tecnológico', 'stack tecnologico', 'tecnologías', 'tecnologias'
    ];
    
    const patrones = [
        /\b(frontend|front-end|backend|back-end|fullstack|full-stack)\b/i,
        /\b(programar|desarrollar|codificar).*(en|con|usando)/i,
        /\b(react|vue|angular|node|python|javascript|java|php)\b/i,
        /\b(como|cómo)\s+(programar|desarrollar|crear).*(app|aplicaci[oó]n|software)/i
    ];
    
    const tienePalabra = palabras.some(p => mensaje.includes(p));
    const tieneFrase = frases.some(f => mensaje.includes(f));
    const tienePatron = patrones.some(patron => patron.test(mensaje));
    
    return tienePalabra || tieneFrase || tienePatron;
}

function generarRespuestaSaludo(mensaje) {
    const hora = new Date().getHours();
    let saludoHora = '';
    let contextoHora = '';
    
    // Determinar saludo según la hora
    if (hora >= 5 && hora < 12) {
        saludoHora = '¡Buenos días!';
        contextoHora = 'un excelente día';
    } else if (hora >= 12 && hora < 19) {
        saludoHora = '¡Buenas tardes!';
        contextoHora = 'una excelente tarde';
    } else if (hora >= 19 && hora < 24) {
        saludoHora = '¡Buenas noches!';
        contextoHora = 'una excelente noche';
    } else {
        saludoHora = '¡Hola!';
        contextoHora = 'que estés bien';
    }
    
    // Si ya se saludó antes en esta sesión
    if (yaSaludo) {
        const respuestasReSaludo = [
            `¡Hola de nuevo! 👋 ${saludoHora}\n\nMe da gusto verte otra vez. ¿En qué más puedo ayudarte hoy? ✨`,
            `¡Hola otra vez! 👋\n\nQué bueno tenerte de vuelta. ¿Qué te gustaría hacer ahora? 💙`,
            `${saludoHora} otra vez 👋\n\n¡Qué gusto volver a saludarte! ¿Hay algo más en lo que pueda asistirte? 🎨`
        ];
        return respuestasReSaludo[Math.floor(Math.random() * respuestasReSaludo.length)];
    }
    
    yaSaludo = true; // Marcar que ya se saludó
    
    // Saludos formales con hora específica
    if (mensaje.includes('buenos días') || mensaje.includes('buenos dias') || mensaje.includes('buen día') || mensaje.includes('buen dia')) {
        const respuestas = [
            `${saludoHora} 👋\n\n¡Qué gusto saludarte! Soy chaustrexp, tu asistente especializado. Espero que tengas ${contextoHora}. ¿En qué puedo ayudarte hoy? Puedo ayudarte con diseño, inglés o recomendaciones de entretenimiento 🎨`,
            `${saludoHora} 👋\n\n¡Bienvenido/a! Me da mucho gusto conocerte. Soy chaustrexp y estoy aquí para ayudarte. ¿Hay algo específico en lo que pueda asistirte? 💙`,
            `${saludoHora} 👋\n\n¡Hola! Qué placer saludarte esta mañana. Soy chaustrexp. ¿Qué te gustaría hacer hoy? Estoy listo para ayudarte con diseño, inglés o entretenimiento ✨`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
    
    if (mensaje.includes('buenas tardes')) {
        const respuestas = [
            `${saludoHora} 👋\n\n¡Hola! ¿Qué tal tu día? Espero que vaya muy bien. Soy chaustrexp, aquí para ayudarte con lo que necesites. ¿En qué puedo asistirte? 💙`,
            `${saludoHora} 👋\n\n¡Qué gusto saludarte! Soy chaustrexp. ¿Cómo va tu tarde? Estoy aquí para ayudarte con diseño, inglés o entretenimiento. ¿Qué te interesa? 🎨`,
            `${saludoHora} 👋\n\n¡Hola! Me da mucho gusto conocerte. Soy chaustrexp, tu asistente especializado. ¿En qué puedo ayudarte esta tarde? ✨`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
    
    if (mensaje.includes('buenas noches')) {
        const respuestas = [
            `${saludoHora} 👋\n\n¡Qué tal! Soy chaustrexp. ¿Cómo va tu noche? ¿En qué puedo ayudarte esta noche? Puedo recomendarte series, películas o música para disfrutar 🎬`,
            `${saludoHora} 👋\n\n¡Hola! Qué placer saludarte. Soy chaustrexp, aquí para asistirte. ¿Qué te gustaría hacer? Puedo ayudarte con entretenimiento, diseño o inglés 💙`,
            `${saludoHora} 👋\n\n¡Bienvenido/a! Espero que tengas una excelente noche. Soy chaustrexp. ¿En qué puedo ayudarte? ✨`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
    
    // Saludos informales o preguntas sobre el estado
    if (mensaje.includes('qué tal') || mensaje.includes('que tal') || mensaje.includes('quetal') || 
        mensaje.includes('qué hay') || mensaje.includes('que hay') || 
        mensaje.includes('qué onda') || mensaje.includes('que onda') ||
        mensaje.includes('qué pasa') || mensaje.includes('que pasa') ||
        mensaje.includes('cómo andas') || mensaje.includes('como andas') ||
        mensaje.includes('cómo vas') || mensaje.includes('como vas')) {
        const respuestas = [
            `${saludoHora} 👋 ¡Todo muy bien, gracias por preguntar!\n\nSoy chaustrexp, tu asistente. ¿Y tú, qué tal? ¿En qué puedo ayudarte hoy? 🎨`,
            `¡Hola! ${saludoHora} Todo excelente por aquí 👋\n\nMe da gusto que preguntes. Soy chaustrexp, aquí para lo que necesites. ¿Qué te gustaría hacer? 💙`,
            `${saludoHora} 👋 ¡Muy bien, gracias!\n\nQué bueno saludarte. Soy chaustrexp, especializado en diseño, inglés y entretenimiento. ¿Cómo puedo asistirte? ✨`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
    
    // Saludos con pregunta sobre el estado
    if (mensaje.includes('cómo está') || mensaje.includes('como esta') || 
        mensaje.includes('cómo estás') || mensaje.includes('como estas') ||
        mensaje.includes('cómo te va') || mensaje.includes('como te va')) {
        const respuestas = [
            `${saludoHora} 👋 ¡Estoy muy bien, gracias por preguntar!\n\nSoy chaustrexp, aquí para ayudarte. ¿Y tú, cómo estás? ¿En qué puedo asistirte hoy? 💙`,
            `¡Hola! ${saludoHora} Todo excelente por aquí 👋\n\nMe da mucho gusto tu interés. Soy chaustrexp. ¿Cómo estás tú? ¿Hay algo en lo que pueda ayudarte? 🎨`,
            `${saludoHora} 👋 ¡Muy bien, gracias!\n\nQué lindo que me preguntes. Soy chaustrexp, tu asistente. ¿En qué puedo serte útil hoy? ✨`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
    
    // Saludos informales (hey, ey, oye, etc.)
    if (mensaje.includes('hey') || mensaje.includes('ey') || mensaje.includes('oye') || 
        mensaje.includes('epa') || mensaje.includes('hi') || mensaje.includes('hello')) {
        const respuestas = [
            `¡Hey! 👋 ${saludoHora}\n\n¡Qué bueno verte! Soy chaustrexp, aquí para ayudarte. ¿Qué necesitas? 🎨`,
            `${saludoHora} 👋 ¡Hola!\n\nMe da gusto saludarte. Soy chaustrexp, tu asistente especializado. ¿En qué puedo ayudarte? 💙`,
            `¡Hey! 👋 ${saludoHora}\n\nSoy chaustrexp. ¿Qué tal? ¿Hay algo en lo que pueda asistirte hoy? ✨`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
    
    // Saludo genérico (hola, saludos, etc.)
    const respuestasGenericas = [
        `${saludoHora} 👋\n\n¡Qué gusto saludarte! Soy **chaustrexp**, tu asistente especializado en diseño, inglés y entretenimiento. ¿En qué puedo ayudarte hoy? ✨`,
        `¡Hola! 👋 ${saludoHora}\n\nMe da mucho gusto conocerte. Soy chaustrexp y estoy aquí para asistirte. Puedo ayudarte con:\n\n🎨 **Diseño gráfico y UI/UX**\n📚 **Aprendizaje de inglés**\n🎬 **Recomendaciones de entretenimiento**\n\n¿Sobre qué te gustaría saber más? 💙`,
        `${saludoHora} 👋\n\n¡Bienvenido/a! Soy **chaustrexp**, tu asistente. Estoy aquí para ayudarte con diseño, inglés y entretenimiento. ¿Qué te gustaría hacer hoy? 🎨`,
        `¡Hola! 👋 ${saludoHora}\n\n¡Qué placer saludarte! Soy chaustrexp. ¿En qué puedo ayudarte? Estoy listo para asistirte con lo que necesites relacionado a diseño, inglés o entretenimiento ✨`
    ];
    return respuestasGenericas[Math.floor(Math.random() * respuestasGenericas.length)];
}

function generarRespuestaDespedida() {
    const despedidas = [
        '¡Adiós! Fue un placer ayudarte. ¡Hasta pronto! 👋',
        '¡Hasta luego! Que tengas un excelente día. 👋',
        '¡Nos vemos! Cualquier cosa que necesites, aquí estaré. 👋',
        '¡Chao! Que disfrutes tu día. ¡Hasta pronto! 👋'
    ];
    const indice = Math.floor(Math.random() * despedidas.length);
    return despedidas[indice];
}

function generarRespuestaConFoto(mensajeOriginal, mensajeLower) {
    // Determinar el tema de la foto según el mensaje
    let tema = 'nature'; // tema por defecto
    let descripcion = 'una imagen hermosa';
    
    // Detectar temas específicos
    if (mensajeLower.includes('diseño') || mensajeLower.includes('diseno') || mensajeLower.includes('ui') || mensajeLower.includes('ux')) {
        tema = 'design';
        descripcion = 'diseño gráfico e interfaces';
    } else if (mensajeLower.includes('nature') || mensajeLower.includes('naturaleza') || mensajeLower.includes('paisaje')) {
        tema = 'nature';
        descripcion = 'naturaleza';
    } else if (mensajeLower.includes('ciudad') || mensajeLower.includes('urban') || mensajeLower.includes('city')) {
        tema = 'city';
        descripcion = 'ciudad';
    } else if (mensajeLower.includes('arte') || mensajeLower.includes('art')) {
        tema = 'art';
        descripcion = 'arte';
    } else if (mensajeLower.includes('tecnología') || mensajeLower.includes('tecnologia') || mensajeLower.includes('tech')) {
        tema = 'technology';
        descripcion = 'tecnología';
    } else if (mensajeLower.includes('comida') || mensajeLower.includes('food')) {
        tema = 'food';
        descripcion = 'comida';
    }
    
    // Generar URL de imagen usando Unsplash API (gratis, sin API key necesaria para tamaño fijo)
    const width = 800;
    const height = 600;
    const imageUrl = `https://source.unsplash.com/${width}x${height}/?${tema}&sig=${Math.floor(Math.random() * 1000)}`;
    
    // Alternativa con placeholder si Unsplash no funciona
    const placeholderUrl = `https://picsum.photos/${width}/${height}?random=${Math.floor(Math.random() * 1000)}`;
    
    const textoRespuesta = `¡Aquí tienes ${descripcion}! 📸\n\nEspero que te guste esta imagen. Si necesitas otra o algo específico, solo dímelo. 🎨`;
    
    return {
        text: textoRespuesta,
        media: {
            type: 'image',
            url: imageUrl,
            alt: `Imagen de ${descripcion}`,
            fallbackUrl: placeholderUrl
        }
    };
}

function generarRespuestaConVideo(mensajeOriginal, mensajeLower) {
    // Determinar el tema del video según el mensaje
    let tema = 'nature';
    let descripcion = 'un video interesante';
    
    // Detectar temas específicos
    if (mensajeLower.includes('diseño') || mensajeLower.includes('diseno')) {
        tema = 'design';
        descripcion = 'diseño y creatividad';
    } else if (mensajeLower.includes('naturaleza') || mensajeLower.includes('nature')) {
        tema = 'nature';
        descripcion = 'naturaleza';
    } else if (mensajeLower.includes('ciudad') || mensajeLower.includes('city')) {
        tema = 'city';
        descripcion = 'ciudad';
    } else if (mensajeLower.includes('tecnología') || mensajeLower.includes('tecnologia') || mensajeLower.includes('tech')) {
        tema = 'technology';
        descripcion = 'tecnología';
    }
    
    // Usar Pexels Videos API (gratis, pero necesitamos un video directo)
    // Por ahora usaremos videos de ejemplo de servidores públicos
    const videos = [
        {
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            mimeType: 'video/mp4',
            descripcion: 'un video de ejemplo'
        },
        {
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            mimeType: 'video/mp4',
            descripcion: 'un video de ejemplo'
        },
        {
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            mimeType: 'video/mp4',
            descripcion: 'un video de ejemplo'
        }
    ];
    
    const videoAleatorio = videos[Math.floor(Math.random() * videos.length)];
    
    const textoRespuesta = `¡Aquí tienes ${descripcion}! 🎬\n\nEspero que disfrutes este video. Si necesitas otro o algo específico, solo dímelo. 🎥`;
    
    return {
        text: textoRespuesta,
        media: {
            type: 'video',
            url: videoAleatorio.url,
            mimeType: videoAleatorio.mimeType,
            alt: descripcion
        }
    };
}

function generarRespuestaDiseno(mensaje) {
    // Detectar específicamente UI/UX con varias variaciones
    const esUIUX = /\b(ui|ux|ui\/ux|ui ux)\b/i.test(mensaje) ||
                   mensaje.includes('diseño ui') || mensaje.includes('diseno ui') ||
                   mensaje.includes('diseño ux') || mensaje.includes('diseno ux') ||
                   mensaje.includes('interfaz de usuario') || mensaje.includes('experiencia de usuario') ||
                   mensaje.includes('user interface') || mensaje.includes('user experience') ||
                   mensaje.includes('ideas para diseñar') || mensaje.includes('ideas para disenar');
    
    if (esUIUX || mensaje.includes('interfaz') || mensaje.includes('ui') || mensaje.includes('ux')) {
        return `**Ideas para Diseñar Interfaces (UI/UX):**

**Principios fundamentales:**
1. **Jerarquía Visual**: Usa tamaños, colores y espacios para guiar la atención
2. **Consistencia**: Mantén elementos similares con el mismo estilo
3. **Espaciado**: Aprovecha el espacio en blanco (white space)
4. **Contraste**: Asegura buena legibilidad y accesibilidad

**Tips prácticos:**
• Usa una grilla (grid) de 8 o 12 columnas
• Paleta de colores: máximo 3 colores principales + acentos
• Tipografía: máximo 2 fuentes (una para títulos, otra para cuerpo)
• Botones: tamaño mínimo de 44x44px para móvil
• Estados visuales: hover, active, disabled, loading

**Herramientas recomendadas:**
• Figma (prototipado y diseño)
• Adobe XD (diseño profesional)
• Sketch (macOS)
• Framer (interactividad avanzada)

¿Quieres profundizar en algún aspecto específico? 🎨`;
    }
    
    if (mensaje.includes('poster') || mensaje.includes('afiche')) {
        return `**Diseño de Posters y Afiches:**

**Elementos clave:**
1. **Título impactante**: Tipografía grande y legible
2. **Jerarquía**: Título > Subtítulo > Información secundaria
3. **Imagen fuerte**: Una imagen potente comunica más que muchas
4. **Información esencial**: Solo lo necesario (qué, cuándo, dónde)
5. **Call to Action**: Llama a la acción claramente

**Composición:**
• Regla de los tercios para ubicar elementos importantes
• Zonas de lectura: de arriba a abajo, de izquierda a derecha
• Contraste entre texto y fondo
• Espacio negativo para respirar

**Estilos populares:**
• Minimalista: mucho espacio, pocos elementos
• Tipográfico: la tipografía es el protagonista
• Fotográfico: imagen en grande con texto superpuesto
• Ilustrado: estilo artístico y personalizado

¿Tienes un proyecto específico en mente? 📐`;
    }
    
    if (mensaje.includes('color') || mensaje.includes('paleta')) {
        return `**Paletas de Colores:**

**Teoría del color:**
• **Complementarios**: Colores opuestos en la rueda (azul-naranja)
• **Análogos**: Colores vecinos (azul-verde-turquesa)
• **Triádicos**: Tres colores equidistantes en la rueda

**Paletas modernas sugeridas:**
1. **Azul y Blanco** (tu tema actual)
   - Azul primario: #1e40af
   - Azul secundario: #3b82f6
   - Blanco: #ffffff
   - Grises: #f1f5f9, #64748b

2. **Alegre y vibrante**
   - Naranja: #f97316
   - Amarillo: #fbbf24
   - Blanco: #ffffff

3. **Profesional y corporativo**
   - Azul marino: #0f172a
   - Azul claro: #3b82f6
   - Gris: #64748b

**Herramientas para paletas:**
• Coolors.co
• Adobe Color
• Paletton

¿Quieres una paleta específica para tu proyecto? 🎨`;
    }
    
    return `**Diseño Gráfico - Consejos Generales:**

Puedo ayudarte con:
• **Diseño de interfaces** (UI/UX)
• **Posters y afiches**
• **Paletas de colores**
• **Tipografía**
• **Composición y layout**
• **Branding e identidad visual**

¿Sobre qué aspecto específico del diseño te gustaría saber más? 🎨`;
}

function generarRespuestaIngles(mensaje) {
    // Detectar específicamente "aprender inglés"
    const esAprenderIngles = /\baprender\s+(ingl[eé]s|ingles)/i.test(mensaje) ||
                              mensaje.includes('aprender inglés') || mensaje.includes('aprender ingles') ||
                              mensaje.includes('estudiar inglés') || mensaje.includes('estudiar ingles') ||
                              mensaje.includes('quiero aprender inglés') || mensaje.includes('quiero aprender ingles') ||
                              mensaje.includes('cómo aprender inglés') || mensaje.includes('como aprender ingles') ||
                              mensaje.includes('aprendo inglés') || mensaje.includes('aprendo ingles');
    
    if (esAprenderIngles || mensaje.includes('aprender') || mensaje.includes('estudiar')) {
        return `**Cómo Aprender Inglés Efectivamente:**

**Métodos recomendados:**
1. **Inmersión diaria**: 30 minutos al día es mejor que 3 horas una vez
2. **Práctica activa**: Habla y escribe, no solo leas
3. **Contenido que disfrutas**: Series, música, podcasts en inglés
4. **Aplicaciones**: Duolingo, Babbel, Busuu para vocabulario básico
5. **Intercambio**: Busca partners para practicar conversación

**Recursos gratis:**
• YouTube: canales como English with Lucy, BBC Learning English
• Podcasts: "6 Minute English", "Stuff You Should Know"
• Series con subtítulos en inglés
• Lectura: noticias, artículos en inglés

**Técnicas de estudio:**
• Tarjetas de memoria (flashcards) para vocabulario
• Anotar frases útiles que escuches
• Repasar en intervalos (spaced repetition)
• Enfócate en lo que necesitas (negocios, viajes, académico)

¿Quieres enfocarte en algún nivel específico (principiante, intermedio, avanzado)? 📚`;
    }
    
    if (mensaje.includes('gramática') || mensaje.includes('gramatica') || mensaje.includes('verbos')) {
        return `**Gramática Inglesa - Guía Rápida:**

**Tiempos verbales más usados:**
1. **Present Simple**: I work (trabajo/habitual)
2. **Present Continuous**: I am working (ahora)
3. **Past Simple**: I worked (pasado simple)
4. **Present Perfect**: I have worked (experiencia/conexión presente)
5. **Future**: I will work / I'm going to work

**Estructuras importantes:**
• **Condicionales**: If I study, I will pass (si estudio, aprobaré)
• **Pasiva**: It was made (fue hecho)
• **Futuro**: Will vs Going to vs Present Continuous

**Errores comunes:**
• "I am agree" ❌ → "I agree" ✅
• "I have 20 years" ❌ → "I am 20 years old" ✅
• "She don't like" ❌ → "She doesn't like" ✅

¿Quieres profundizar en algún tiempo verbal específico? 📖`;
    }
    
    return `**Aprendizaje de Inglés:**

Puedo ayudarte con:
• **Métodos de estudio** y técnicas de aprendizaje
• **Gramática** (tiempos verbales, estructuras)
• **Vocabulario** y frases útiles
• **Pronunciación** y speaking
• **Writing** y redacción
• **Recursos** y materiales recomendados

¿Sobre qué aspecto del inglés te gustaría aprender más? 🇬🇧`;
}

function generarRespuestaEntretenimiento(mensaje) {
    // Detectar específicamente recomendaciones de series
    const esRecomendacionSerie = /\b(recomi[eé]nd[ao]me?|recomienda)\s+(una\s+)?serie/i.test(mensaje) ||
                                  mensaje.includes('recomienda serie') || mensaje.includes('recomiéndame serie') ||
                                  mensaje.includes('recomendame serie') || mensaje.includes('serie para ver') ||
                                  mensaje.includes('serie que ver') || mensaje.includes('qué serie') ||
                                  mensaje.includes('que serie') || mensaje.includes('mejor serie') ||
                                  mensaje.includes('buena serie') || mensaje.includes('series recomendadas');
    
    if (esRecomendacionSerie || mensaje.includes('serie') || mensaje.includes('series')) {
        return `**Recomendaciones de Series:**

**Drama y Thriller:**
• **Breaking Bad** - Un profesor de química se convierte en narcotraficante
• **Game of Thrones** - Fantasía épica con política compleja
• **The Crown** - La historia de la familia real británica
• **Stranger Things** - Horror y ciencia ficción de los 80s

**Comedia:**
• **Friends** - Comedia clásica de amigos en Nueva York
• **The Office** (US) - Comedia de oficina estilo mockumentary
• **Brooklyn Nine-Nine** - Policías cómicos y divertidos
• **The Good Place** - Filosofía y comedia inteligente

**Sci-Fi y Fantasía:**
• **Black Mirror** - Tecnología distópica y antológica
• **The Mandalorian** - Star Wars en formato serie
• **Dark** - Ciencia ficción alemana con viajes en el tiempo
• **Westworld** - IA y consciencia artificial

**Crimen:**
• **True Detective** - Detectives con casos complejos
• **Mindhunter** - Perfiles psicológicos de asesinos
• **Sherlock** - El detective más famoso, versión moderna

¿Buscas algo específico? Puedo recomendar según tu género preferido 🎬`;
    }
    
    if (mensaje.includes('película') || mensaje.includes('pelicula') || mensaje.includes('película')) {
        return `**Recomendaciones de Películas:**

**Drama:**
• **The Shawshank Redemption** - Esperanza y amistad en prisión
• **Forrest Gump** - Historia de vida inspiradora
• **The Godfather** - Clásico del cine de gangsters
• **Parasite** - Thriller social coreano

**Ciencia Ficción:**
• **Interstellar** - Viajes espaciales y relatividad
• **Inception** - Sueños y realidad mezclados
• **The Matrix** - Realidad virtual y filosófica
• **Blade Runner 2049** - Futuro distópico

**Acción:**
• **Mad Max: Fury Road** - Acción post-apocalíptica
• **John Wick** - Combate coreografiado impresionante
• **Dunkirk** - Segunda Guerra Mundial

**Documentales:**
• **Planet Earth** - Naturaleza y vida salvaje
• **The Social Dilemma** - Impacto de las redes sociales
• **My Octopus Teacher** - Conexión con la naturaleza
• **Our Planet** - Conservación ambiental

¿Qué género prefieres? Puedo recomendar según tus gustos 🎥`;
    }
    
    if (mensaje.includes('documental') || mensaje.includes('documentales')) {
        return `**Documentales Recomendados:**

**Ciencia y Naturaleza:**
• **Planet Earth I & II** - Naturaleza y vida salvaje
• **Cosmos: A Spacetime Odyssey** - Astronomía y universo
• **Blue Planet II** - Vida marina
• **Our Planet** - Conservación ambiental

**Tecnología y Sociedad:**
• **The Social Dilemma** - Impacto de las redes sociales
• **The Great Hack** - Privacidad y datos
• **Ex Machina** (tema de IA)
• **AlphaGo** - IA y juego de Go

**Historia y Cultura:**
• **Apollo 11** - Llegada a la luna
• **13th** - Sistema penitenciario y discriminación
• **Free Solo** - Escalada en roca sin protección
• **My Octopus Teacher** - Conexión emocional con la naturaleza

**Crime y Mystery:**
• **Making a Murderer** - Justicia criminal
• **The Keepers** - Crimen sin resolver
• **Wild Wild Country** - Comuna espiritual controvertida

¿Qué tema te interesa más? 📺`;
    }
    
    // Detectar artistas específicos en inglés
    const artistaReconocido = detectarArtistaIngles(mensaje);
    if (artistaReconocido) {
        return generarInfoArtista(artistaReconocido);
    }
    
    if (mensaje.includes('música') || mensaje.includes('musica') || mensaje.includes('canción') || mensaje.includes('cancion') || mensaje.includes('cantante') || mensaje.includes('artista')) {
        return `**Recomendaciones Musicales - Artistas en Inglés:**

**Pop & Alternative:**
• **Lana Del Rey** - Pop nostálgico y cinematográfico con estilo vintage
• **The Weeknd** - R&B/Pop oscuro y sofisticado con sintetizadores
• **Taylor Swift** - Narrativa lírica y producción moderna
• **Dua Lipa** - Pop dance moderno y energético
• **Billie Eilish** - Pop alternativo oscuro y minimalista
• **Harry Styles** - Pop rock suave y ecléctico

**Indie & Alternative Rock:**
• **Cigarettes After Sex** - Dream pop melancólico y atmosférico
• **Arctic Monkeys** - Rock alternativo británico
• **The Strokes** - Indie rock icónico de garage
• **Radiohead** - Rock alternativo experimental
• **Tame Impala** - Psychedelic pop/rock
• **Mac DeMarco** - Indie rock relajado y lo-fi

**R&B & Soul:**
• **The Weeknd** - R&B moderno y oscuro
• **Frank Ocean** - R&B experimental y poético
• **SZA** - R&B alternativo y soul
• **Daniel Caesar** - R&B suave y romántico

**Hip-Hop/Rap:**
• **Kendrick Lamar** - Rap conceptual y lírico
• **J. Cole** - Rap consciente y storytelling
• **Eminem** - Rap técnico y narrativo
• **Tyler, The Creator** - Hip-hop experimental

**Electronic/EDM:**
• **Daft Punk** - House y funk electrónico
• **Deadmau5** - Progressive house
• **Flume** - Electronic experimental
• **ODESZA** - Electronic indie atmosférico

**Para estudiar/relajarse:**
• **Lo-Fi Hip Hop** (playlists en Spotify/YouTube)
• **Jazz instrumental** (Miles Davis, John Coltrane)
• **Música clásica** (Beethoven, Mozart, Bach)

¿Quieres conocer más sobre algún artista específico o buscar por género? 🎵`;
    }
    
    return `**Recomendaciones de Entretenimiento:**

Puedo recomendarte:
• **Series** (drama, comedia, thriller, sci-fi)
• **Películas** (todos los géneros)
• **Documentales** (ciencia, naturaleza, tecnología)
• **Música** (pop, rock, hip-hop, electrónica, artistas en inglés)

¿Sobre qué quieres recomendaciones? 🎬`;
}

function detectarArtistaIngles(mensaje) {
    const artistas = {
        'lana del rey': 'lana del rey',
        'lana': 'lana del rey',
        'the weeknd': 'the weeknd',
        'weeknd': 'the weeknd',
        'cigarettes after sex': 'cigarettes after sex',
        'cigarettes': 'cigarettes after sex',
        'taylor swift': 'taylor swift',
        'taylor': 'taylor swift',
        'dua lipa': 'dua lipa',
        'billie eilish': 'billie eilish',
        'billie': 'billie eilish',
        'harry styles': 'harry styles',
        'arctic monkeys': 'arctic monkeys',
        'the strokes': 'the strokes',
        'radiohead': 'radiohead',
        'tame impala': 'tame impala',
        'mac demarco': 'mac demarco',
        'frank ocean': 'frank ocean',
        'sza': 'sza',
        'daniel caesar': 'daniel caesar',
        'kendrick lamar': 'kendrick lamar',
        'kendrick': 'kendrick lamar',
        'j. cole': 'j. cole',
        'j cole': 'j. cole',
        'eminem': 'eminem',
        'tyler the creator': 'tyler, the creator',
        'tyler': 'tyler, the creator',
        'daft punk': 'daft punk',
        'deadmau5': 'deadmau5',
        'flume': 'flume',
        'odesza': 'odesza'
    };
    
    for (const [key, value] of Object.entries(artistas)) {
        if (mensaje.includes(key)) {
            return value;
        }
    }
    
    return null;
}

function generarInfoArtista(artista) {
    const infoArtistas = {
        'lana del rey': `**Lana Del Rey** 🎤

**Estilo**: Pop nostálgico, dream pop, indie pop
**Características**: Música cinematográfica con estilo vintage de los años 50-60, letras melancólicas y románticas

**Álbumes recomendados:**
• **Born to Die** (2012) - Su álbum debut más famoso
• **Ultraviolence** (2014) - Estilo más rock y oscuro
• **Norman Fucking Rockwell!** (2019) - Aclamado por la crítica
• **Chemtrails Over the Country Club** (2021) - Más acústico y personal

**Canciones esenciales:**
• "Video Games" - Su hit debut
• "Summertime Sadness" - Una de sus más populares
• "Young and Beautiful" - Para la película "The Great Gatsby"
• "Born to Die" - Título del álbum
• "West Coast" - Estilo rock alternativo

**Por qué escucharla:**
Perfecta para momentos nostálgicos, relajantes, o cuando buscas música con mucho sentimiento y atmósfera cinematográfica. Ideal para estudiar, leer o simplemente relajarse. 🎵`,
        
        'the weeknd': `**The Weeknd** 🎤

**Estilo**: R&B alternativo, Pop oscuro, Synth-pop
**Características**: Voces etéreas, sintetizadores oscuros, temas sobre relaciones y noche

**Álbumes recomendados:**
• **After Hours** (2020) - Su álbum más exitoso con "Blinding Lights"
• **Starboy** (2016) - Colaboración con Daft Punk
• **Beauty Behind the Madness** (2015) - "Can't Feel My Face"
• **House of Balloons** (2011) - Mixtape debut que lo lanzó

**Canciones esenciales:**
• "Blinding Lights" - Su canción más exitosa
• "Starboy" - Con Daft Punk
• "The Hills" - Estilo oscuro característico
• "Can't Feel My Face" - Pop más accesible
• "Save Your Tears" - Hit reciente

**Por qué escucharlo:**
Perfecto para la noche, fiestas, o cuando buscas música con un vibe oscuro pero catchy. Su música mezcla R&B sensual con producción electrónica moderna. 🌙`,
        
        'cigarettes after sex': `**Cigarettes After Sex** 🎤

**Estilo**: Dream pop, Slowcore, Shoegaze
**Características**: Música atmosférica, melancólica, perfecta para momentos íntimos y relajantes

**Álbumes recomendados:**
• **Cigarettes After Sex** (2017) - Álbum debut homónimo
• **Cry** (2019) - Segunda producción
• **Bubblegum** (2023) - EP más reciente

**Canciones esenciales:**
• "Apocalypse" - Su canción más reconocida
• "Nothing's Gonna Hurt You Baby" - Romántica y suave
• "Sweet" - Melancólica y atmosférica
• "K." - Una de las más populares
• "Heavenly" - Perfecta para relajarse

**Por qué escucharlos:**
Ideal para estudiar, trabajar, leer, o simplemente relajarse. Su música es como un abrazo cálido, perfecta para momentos tranquilos y nostálgicos. Muy recomendada para antes de dormir o durante la lluvia. ☁️`,
        
        'taylor swift': `**Taylor Swift** 🎤

**Estilo**: Pop, Country-pop, Folk-pop
**Características**: Narrativa lírica excepcional, evolución constante, storytelling en cada canción

**Álbumes recomendados:**
• **folklore** (2020) - Indie folk alternativo, aclamado por la crítica
• **1989** (2014) - Pop puro, su transformación al pop
• **Midnights** (2022) - Pop electrónico nocturno
• **evermore** (2020) - Hermano de folklore
• **Red (Taylor's Version)** - Re-grabación con canciones adicionales

**Canciones esenciales:**
• "Anti-Hero" - De Midnights
• "Cardigan" - De folklore
• "All Too Well (10 Minute Version)" - Narrativa épica
• "Shake It Off" - Pop puro de 1989
• "Love Story" - Clásico country-pop

**Por qué escucharla:**
Perfecta si buscas música con historias, letras profundas, y producción impecable. Cada álbum es una experiencia diferente. 📚`,
        
        'billie eilish': `**Billie Eilish** 🎤

**Estilo**: Pop alternativo, Electropop, Indie pop
**Características**: Producción minimalista y oscura, voces susurrantes, temas gen Z

**Álbumes recomendados:**
• **When We All Fall Asleep, Where Do We Go?** (2019) - Debut exitoso
• **Happier Than Ever** (2021) - Más maduro y diverso
• **Guitar Songs** (2022) - EP acústico

**Canciones esenciales:**
• "bad guy" - Su hit debut
• "Happier Than Ever" - Título del segundo álbum
• "Ocean Eyes" - La canción que la descubrió
• "Everything I Wanted" - Personal y emotiva
• "What Was I Made For?" - De la película "Barbie"

**Por qué escucharla:**
Si te gusta el pop alternativo con un toque oscuro y minimalista. Perfecta para jóvenes y no tan jóvenes que buscan algo diferente. 🌊`,
        
        'arctic monkeys': `**Arctic Monkeys** 🎤

**Estilo**: Indie rock, Garage rock, Rock alternativo
**Características**: Letras británicas ingeniosas, riffs de guitarra distintivos

**Álbumes recomendados:**
• **AM** (2013) - Su álbum más exitoso
• **Whatever People Say I Am, That's What I'm Not** (2006) - Debut
• **Tranquility Base Hotel & Casino** (2018) - Experimentación

**Canciones esenciales:**
• "Do I Wanna Know?" - Su canción más reconocida
• "505" - Una de las más populares
• "R U Mine?" - Rock característico
• "Fluorescent Adolescent" - Clásico indie

**Por qué escucharlos:**
Perfecto para rock alternativo con actitud británica. Ideal si te gusta la guitarra y letras inteligentes. 🎸`
    };
    
    const info = infoArtistas[artista.toLowerCase()];
    
    if (info) {
        return info;
    }
    
    // Respuesta genérica si no hay info específica
    return `¡Gran artista! ${artista} es una excelente elección. 🎵\n\n¿Te gustaría que te recomiende canciones específicas de este artista o álbumes para empezar? También puedo sugerirte artistas similares. 💙`;
}

function generarRespuestaDeportes(mensaje) {
    // Detectar deportes específicos
    if (mensaje.includes('fútbol') || mensaje.includes('futbol') || mensaje.includes('soccer')) {
        return `**Fútbol ⚽**
        
**Equipos destacados:**
• Real Madrid, Barcelona, Manchester United, Bayern Munich

**Ligas principales:**
• La Liga (España), Premier League (Inglaterra), Serie A (Italia), Bundesliga (Alemania)

**Torneos importantes:**
• Copa Mundial de la FIFA
• Champions League
• Copa América, Eurocopa

**Jugadores icónicos:**
• Messi, Cristiano Ronaldo, Pelé, Maradona

¿Quieres información sobre algún equipo, liga o jugador específico? ⚽`;

    } else if (mensaje.includes('basketball') || mensaje.includes('baloncesto') || mensaje.includes('basquet')) {
        return `**Baloncesto/Basketball 🏀**

**Ligas principales:**
• NBA (Estados Unidos) - La liga más importante
• ACB (España), EuroLeague (Europa)

**Equipos destacados:**
• Lakers, Warriors, Celtics, Bulls, Heat

**Jugadores legendarios:**
• Michael Jordan, LeBron James, Kobe Bryant, Magic Johnson

**Aspectos del juego:**
• Posiciones: base, escolta, alero, ala-pívot, pívot
• Estrategias: ofensiva, defensa, juego rápido

¿Sobre qué aspecto del baloncesto quieres saber más? 🏀`;

    } else if (mensaje.includes('tenis')) {
        return `**Tenis 🎾**

**Torneos Grand Slam:**
• Australian Open (Enero)
• Roland Garros/French Open (Mayo-Junio)
• Wimbledon (Junio-Julio)
• US Open (Agosto-Septiembre)

**Jugadores destacados:**
• Djokovic, Nadal, Federer, Serena Williams

**Superficies:**
• Césped (Wimbledon)
• Arcilla (Roland Garros)
• Hard court (US Open, Australian Open)

¿Quieres información sobre algún torneo o jugador específico? 🎾`;

    } else if (mensaje.includes('fitness') || mensaje.includes('gym') || mensaje.includes('gimnasio') || mensaje.includes('ejercicio')) {
        return `**Fitness y Ejercicio 💪**

**Rutinas recomendadas:**
• **Principiante**: 3 veces por semana, ejercicios básicos
• **Intermedio**: 4-5 veces por semana, mayor intensidad
• **Avanzado**: 5-6 veces por semana, entrenamiento especializado

**Tipos de entrenamiento:**
• Cardio (correr, ciclismo, natación)
• Fuerza (pesas, resistencia)
• Flexibilidad (yoga, estiramientos)
• HIIT (entrenamiento de alta intensidad)

**Consejos importantes:**
• Calentamiento antes del ejercicio
• Hidratación constante
• Descanso adecuado entre sesiones
• Alimentación balanceada
• Progresión gradual

¿Quieres una rutina específica o consejos para empezar? 🏋️`;

    } else if (mensaje.includes('yoga') || mensaje.includes('pilates')) {
        return `**Yoga y Pilates 🧘**

**Yoga:**
• Vinyasa, Hatha, Ashtanga, Bikram
• Mejora flexibilidad, equilibrio y relajación
• Beneficios: reduce estrés, mejora postura

**Pilates:**
• Fortalece core (abdomen, espalda baja)
• Mejora postura y coordinación
• Bajo impacto, ideal para rehabilitación

**Para principiantes:**
• Empieza con clases básicas
• Practica regularmente 2-3 veces por semana
• Usa accesorios (mat, bloques, correas)

¿Buscas información sobre alguna práctica específica? 🧘`;

    }
    
    // Respuesta genérica sobre deportes
    return `**Deportes 🏃**

Puedo ayudarte con información sobre:

⚽ **Fútbol/Soccer**
🏀 **Baloncesto/Basketball**
🎾 **Tenis**
💪 **Fitness y Ejercicio**
🧘 **Yoga y Pilates**
🏊 **Natación**
🚴 **Ciclismo**
🥊 **Boxeo y Artes Marciales**
⚾ **Béisbol**
🏐 **Voleibol**

**Beneficios del deporte:**
• Mejora la salud cardiovascular
• Fortalece músculos y huesos
• Reduce estrés y ansiedad
• Aumenta energía
• Mejora el sueño

¿Sobre qué deporte o actividad física te gustaría saber más? 🏅`;
}

function generarRespuestaComidaBebida(mensaje) {
    // Detectar comidas específicas
    if (mensaje.includes('receta') || mensaje.includes('cocinar') || mensaje.includes('cómo cocinar') || mensaje.includes('como cocinar')) {
        return `**Recetas y Cocina 👨‍🍳**

**Recetas populares:**

**1. Pasta Carbonara**
• Pasta, bacon, huevos, parmesano, pimienta negra
• Cocinar pasta al dente, dorar bacon, mezclar con huevos y queso

**2. Pollo al Curry**
• Pollo, cebolla, ajo, curry, leche de coco
• Sofreír cebolla, añadir curry, cocinar pollo, agregar leche de coco

**3. Ensalada César**
• Lechuga romana, pollo, crutones, parmesano, aderezo César
• Mezclar ingredientes frescos con aderezo

**4. Tacos de Pollo**
• Tortillas, pollo, cilantro, cebolla, limón
• Cocinar pollo con especias, servir en tortillas calientes

**Tips de cocina:**
• Siempre prueba la comida mientras cocinas
• Usa ingredientes frescos cuando sea posible
• No tengas miedo de experimentar con especias
• Prepara todo antes de empezar a cocinar (mise en place)

¿Quieres alguna receta específica o consejos de cocina? 🍳`;

    } else if (mensaje.includes('restaurante') || mensaje.includes('lugar para comer') || mensaje.includes('donde comer')) {
        return `**Recomendaciones de Restaurantes 🍽️**

**Tipos de restaurantes según ocasión:**

**Cena romántica:**
• Restaurantes con ambiente íntimo
• Cocina de autor o francesa
• Buena carta de vinos

**Comida rápida/casual:**
• Hamburgueserías gourmet
• Comida mexicana, italiana
• Food trucks y mercados gastronómicos

**Comida saludable:**
• Restaurantes vegetarianos/veganos
• Opciones con ingredientes orgánicos
• Ensaladas y bowls nutritivos

**Brunch/Desayuno:**
• Cafeterías con menú completo
• Panaderías artesanales
• Lugares con opciones dulces y saladas

**Consejos para elegir:**
• Lee reseñas actuales
• Revisa el menú online
• Considera el precio y la ubicación
• Verifica horarios de apertura

¿Buscas algún tipo específico de restaurante o comida? 🍕`;

    } else if (mensaje.includes('bebida') || mensaje.includes('beber') || mensaje.includes('qué beber') || mensaje.includes('que beber')) {
        return `**Bebidas Recomendadas 🥤**

**Bebidas sin alcohol:**
• **Agua**: Fundamental, 8 vasos al día
• **Té verde**: Antioxidantes, saludable
• **Smoothies**: Frutas y verduras, nutritivos
• **Jugos naturales**: Vitamina C, energía
• **Agua con limón**: Hidratante, refrescante

**Bebidas con alcohol (moderación):**
• **Vino tinto**: Antioxidantes, mejor con comida
• **Cerveza artesanal**: Variedad de sabores
• **Cócteles**: Mojito, Margarita, Old Fashioned
• **Vino espumoso**: Para celebraciones

**Bebidas calientes:**
• **Café**: Espresso, cappuccino, americano
• **Té**: Verde, negro, herbal, chai
• **Chocolate caliente**: Confort, invierno

**Bebidas para deportistas:**
• Bebidas isotónicas
• Agua de coco
• Smoothies proteicos

¿Qué tipo de bebida buscas o necesitas? ☕`;

    } else if (mensaje.includes('saludable') || mensaje.includes('nutrición') || mensaje.includes('nutricion') || mensaje.includes('dieta')) {
        return `**Comida Saludable y Nutrición 🥗**

**Principios de alimentación saludable:**
• Variedad de frutas y verduras
• Proteínas magras (pollo, pescado, legumbres)
• Carbohidratos complejos (arroz integral, quinoa)
• Grasas saludables (aguacate, nueces, aceite de oliva)

**Comidas nutritivas:**
• Ensaladas con proteína
• Bowls de quinoa o arroz
• Pescado al horno con verduras
• Smoothies verdes

**Consejos nutricionales:**
• Come 5 veces al día (3 comidas + 2 snacks)
• Hidrátate bien (agua)
• Evita alimentos ultra procesados
• Lee etiquetas nutricionales
• Planifica tus comidas

¿Quieres recetas saludables específicas o consejos nutricionales? 🥑`;

    }
    
    // Respuesta genérica sobre comida y bebida
    return `**Comidas y Bebidas 🍴**

Puedo ayudarte con:

👨‍🍳 **Recetas de cocina**
🍽️ **Recomendaciones de restaurantes**
🥤 **Bebidas y cócteles**
🥗 **Comida saludable y nutrición**
🍕 **Platos populares** (pizza, pasta, sushi, tacos)
🍰 **Postres y dulces**
☕ **Café y té**
🍷 **Vino y cerveza**

**Consejos gastronómicos:**
• Experimenta con nuevos sabores
• Usa ingredientes frescos
• Cocina con pasión y paciencia
• Disfruta las comidas en compañía

¿Sobre qué aspecto de comida o bebida te gustaría saber más? 🍽️`;
}

function generarRespuestaTrabajo(mensaje) {
    // Detectar CV específicamente
    if (mensaje.includes('cv') || mensaje.includes('curriculum') || mensaje.includes('currículum') || mensaje.includes('hoja de vida')) {
        return `**Cómo Hacer un CV Efectivo 📄**

**Estructura básica de un CV:**

**1. Información personal**
• Nombre completo
• Teléfono y email profesional
• LinkedIn (opcional pero recomendado)
• Ubicación (ciudad, país)

**2. Perfil profesional / Resumen ejecutivo**
• 2-3 líneas destacando experiencia y habilidades clave
• Adapta según el puesto

**3. Experiencia laboral**
• Empresa, puesto, fechas (mes/año)
• 3-5 logros con números/resultados
• Formato: verbo en pasado (dirigí, desarrollé, aumenté)

**Ejemplo:**
"Desarrollé una estrategia de marketing que aumentó las ventas en un 30%"

**4. Educación**
• Título, institución, año de graduación
• Cursos relevantes, certificaciones

**5. Habilidades**
• Técnicas (software, herramientas)
• Blandas (comunicación, liderazgo)
• Idiomas con nivel

**Consejos importantes:**
• Máximo 2 páginas
• Formato limpio y profesional
• Palabras clave del puesto
• Sin errores ortográficos
• PDF para enviar
• Actualiza regularmente

¿Necesitas ayuda con alguna sección específica del CV? 📝`;

    } else if (mensaje.includes('carta de presentación') || mensaje.includes('carta de presentacion') || mensaje.includes('cover letter')) {
        return `**Carta de Presentación 📧**

**Estructura de una carta de presentación:**

**Encabezado:**
• Tu información de contacto
• Fecha
• Datos de la empresa/empleador

**Saludo:**
• "Estimado/a [Nombre]" o "A quien corresponda"

**Párrafo 1: Introducción**
• Menciona el puesto al que aplicas
• Cómo te enteraste de la oferta
• Por qué estás interesado

**Párrafo 2: Tu valor**
• Experiencia relevante (2-3 puntos clave)
• Logros que conecten con el puesto
• Por qué eres la persona indicada

**Párrafo 3: Cierre**
• Reafirma tu interés
• Menciona tu CV adjunto
• Propón seguimiento

**Despedida:**
• "Quedo atento/a a su respuesta"
• "Cordialmente," o "Atentamente,"
• Tu firma

**Ejemplo de frase:**
"Con mi experiencia de 5 años en marketing digital y mi habilidad para aumentar el engagement en un 40%, estoy seguro de que puedo aportar valor significativo a su equipo."

¿Necesitas ayuda redactando alguna parte específica? ✍️`;

    } else if (mensaje.includes('entrevista') || mensaje.includes('entrevista de trabajo')) {
        return `**Preparación para Entrevistas de Trabajo 💼**

**Antes de la entrevista:**
• Investiga la empresa (historia, valores, productos)
• Revisa el perfil del puesto detalladamente
• Prepara preguntas para el entrevistador
• Practica respuestas comunes
• Prepara ejemplos de logros (STAR: Situación, Tarea, Acción, Resultado)

**Preguntas comunes y cómo responderlas:**

**1. "Háblame de ti"**
• Resumen profesional (1-2 minutos)
• Enfócate en experiencia relevante
• Destaca logros clave

**2. "¿Por qué quieres este puesto?"**
• Menciona aspectos específicos de la empresa/puesto
• Conecta con tus objetivos profesionales
• Muestra entusiasmo genuino

**3. "¿Cuáles son tus fortalezas?"**
• 2-3 fortalezas con ejemplos concretos
• Conecta con requerimientos del puesto

**4. "¿Cuáles son tus debilidades?"**
• Menciona algo real pero que estés trabajando
• Muestra proactividad para mejorar

**Durante la entrevista:**
• Llega 10 minutos antes
• Viste apropiadamente (business casual/profesional)
• Mantén contacto visual
• Escucha activamente
• Sé auténtico y positivo
• Haz preguntas inteligentes

**Después:**
• Envía email de agradecimiento (24 horas)
• Sé paciente con la respuesta

¿Necesitas ayuda con alguna pregunta específica de entrevista? 🎤`;

    } else if (mensaje.includes('frase') || mensaje.includes('escrito') || mensaje.includes('texto') || mensaje.includes('redactar')) {
        return `**Frases y Textos para Trabajos 📝**

**Frases útiles para CV:**
• "Responsable de [función] que resultó en [logro medible]"
• "Gestioné un equipo de [número] personas"
• "Implementé estrategias que aumentaron [métrica] en [%]"
• "Colaboré en proyectos que generaron [resultado]"

**Frases para carta de presentación:**
• "Me dirijo a usted para expresar mi interés en el puesto de..."
• "Con mi experiencia en [área] y mi pasión por [campo], considero que..."
• "Estoy seguro de que mis habilidades en [habilidad] serían valiosas para..."
• "Agradezco la oportunidad de poder contribuir a [objetivo de la empresa]"

**Frases para entrevistas:**
• "Una de mis mayores fortalezas es..."
• "En mi experiencia anterior, logré..."
• "Lo que más me motiva es..."
• "Me destaco por mi capacidad de..."

**Textos para emails profesionales:**
• "Agradezco su tiempo y consideración"
• "Quedo atento/a a su respuesta"
• "Espero tener la oportunidad de discutir cómo puedo contribuir"

¿Necesitas ayuda redactando algo específico para tu búsqueda de trabajo? ✍️`;

    }
    
    // Respuesta genérica sobre trabajo
    return `**Consejos para Trabajos y Carrera Profesional 💼**

Puedo ayudarte con:

📄 **Cómo hacer un CV efectivo**
📧 **Cartas de presentación**
💼 **Preparación para entrevistas**
📝 **Frases y textos profesionales**
🔍 **Búsqueda de empleo**
💬 **Redacción profesional**
📊 **Portafolio y LinkedIn**
🎯 **Preparación de aplicaciones**

**Consejos generales:**
• Personaliza cada aplicación
• Destaca logros con números
• Muestra pasión por el trabajo
• Sé profesional en todas las interacciones
• Actualiza tu CV regularmente
• Construye tu red profesional

¿En qué aspecto de tu búsqueda de trabajo necesitas ayuda? 🚀`;
}

function generarRespuestaProgramacion(mensaje) {
    // Detectar Frontend
    if (mensaje.includes('frontend') || mensaje.includes('front-end') || mensaje.includes('front end')) {
        return `**Desarrollo Frontend 💻**

**¿Qué es Frontend?**
El frontend es la parte visible de una aplicación web que los usuarios interactúan directamente.

**Tecnologías principales:**

**1. HTML, CSS, JavaScript**
• HTML: Estructura del contenido
• CSS: Estilos y diseño visual
• JavaScript: Interactividad y lógica

**2. Frameworks y librerías:**
• **React** (más popular) - Componentes reutilizables
• **Vue.js** - Progresivo y fácil de aprender
• **Angular** - Framework completo de Google
• **Svelte** - Compilador moderno

**3. Herramientas y build tools:**
• Webpack, Vite, Parcel (bundlers)
• Sass, Less (preprocesadores CSS)
• TypeScript (JavaScript tipado)

**4. Conceptos importantes:**
• Responsive Design (diseño adaptable)
• Single Page Applications (SPA)
• Component-Based Architecture
• State Management (Redux, Vuex, Zustand)

**Ruta de aprendizaje Frontend:**
1. HTML/CSS básico → 2 semanas
2. JavaScript fundamentos → 1 mes
3. Framework (React/Vue) → 2-3 meses
4. Herramientas avanzadas → continuo

¿Quieres profundizar en algún framework o concepto específico? 🎨`;

    } else if (mensaje.includes('backend') || mensaje.includes('back-end') || mensaje.includes('back end')) {
        return `**Desarrollo Backend 💻**

**¿Qué es Backend?**
El backend es la parte del servidor que maneja la lógica, bases de datos y APIs que el frontend consume.

**Lenguajes y Frameworks:**

**1. Node.js (JavaScript)**
• Express.js - Framework minimalista
• Nest.js - Framework empresarial con TypeScript
• Fastify - Alto rendimiento

**2. Python**
• Django - Framework completo y robusto
• Flask - Framework ligero y flexible
• FastAPI - Moderno, rápido, para APIs

**3. Java**
• Spring Boot - Framework empresarial
• Muy usado en grandes empresas

**4. PHP**
• Laravel - Framework moderno y elegante
• Symfony - Componentes reutilizables

**5. Otros lenguajes:**
• Go (Golang) - Alto rendimiento
• Ruby (Ruby on Rails) - Desarrollo rápido
• C# (.NET) - Ecosistema Microsoft

**Bases de datos:**
• **SQL**: PostgreSQL, MySQL, SQL Server
• **NoSQL**: MongoDB, Redis, Cassandra
• **ORM**: Sequelize, Prisma, TypeORM

**APIs y Servicios:**
• REST API - Estándar más común
• GraphQL - Consultas flexibles
• WebSockets - Comunicación en tiempo real
• Microservicios - Arquitectura distribuida

**Ruta de aprendizaje Backend:**
1. Elegir lenguaje → Node.js o Python (más fácil)
2. Aprender bases de datos → SQL primero
3. Framework del lenguaje → Express o Django
4. APIs y autenticación → JWT, OAuth
5. Deployment → Docker, AWS, Heroku

¿Quieres información sobre algún lenguaje o framework específico? ⚙️`;

    } else if (mensaje.includes('fullstack') || mensaje.includes('full-stack') || mensaje.includes('full stack')) {
        return `**Desarrollo Fullstack 🚀**

**¿Qué es Fullstack?**
Un desarrollador fullstack domina tanto frontend como backend, pudiendo crear aplicaciones completas.

**Stack tecnológico Fullstack:**

**1. MERN Stack (Popular)**
• **M**ongoDB - Base de datos NoSQL
• **E**xpress.js - Framework backend Node.js
• **R**eact - Framework frontend
• **N**ode.js - Runtime de JavaScript

**2. MEAN Stack**
• **M**ongoDB
• **E**xpress.js
• **A**ngular - Framework frontend
• **N**ode.js

**3. LAMP Stack (Tradicional)**
• **L**inux - Sistema operativo
• **A**pache - Servidor web
• **M**ySQL - Base de datos
• **P**HP - Lenguaje backend

**4. Django + React**
• Django (Python) - Backend robusto
• React - Frontend moderno
• Combinación muy poderosa

**Ventajas de ser Fullstack:**
✅ Puedes crear proyectos completos solo
✅ Mayor flexibilidad laboral
✅ Entiendes todo el flujo de la aplicación
✅ Mejor comunicación entre equipos

**Desafíos:**
⚠️ Requiere aprender muchas tecnologías
⚠️ Debes mantenerte actualizado en ambas áreas
⚠️ Puede ser abrumador al principio

**Ruta de aprendizaje Fullstack:**
1. **Frontend básico** (HTML, CSS, JS) → 1 mes
2. **Framework frontend** (React/Vue) → 2 meses
3. **Backend básico** (Node.js + Express) → 2 meses
4. **Base de datos** (MongoDB/PostgreSQL) → 1 mes
5. **Proyecto completo** → Práctica continua

**Recomendación:**
Empieza con JavaScript (puedes usarlo en frontend y backend con Node.js)

¿Quieres un roadmap más detallado o información sobre algún stack específico? 🎯`;

    } else if (mensaje.includes('react') || mensaje.includes('vue') || mensaje.includes('angular')) {
        let framework = '';
        let info = '';
        
        if (mensaje.includes('react')) {
            framework = 'React';
            info = `**React** ⚛️

**Características:**
• Librería de JavaScript para construir UIs
• Componentes reutilizables
• Virtual DOM para mejor rendimiento
• Ecosistema enorme

**Concepts clave:**
• JSX - Sintaxis que parece HTML
• Props - Pasar datos a componentes
• State - Estado de componentes
• Hooks - useState, useEffect, useContext
• Components - Funcionales y de clase

**Instalación:**
\`\`\`
npx create-react-app mi-app
\`\`\`

**Ejemplo básico:**
\`\`\`jsx
import React from 'react';

function App() {
  return <h1>Hola Mundo!</h1>;
}

export default App;
\`\`\`

**Recursos:**
• Documentación oficial: reactjs.org
• Next.js - Framework de React
• React Router - Navegación`;
        } else if (mensaje.includes('vue')) {
            framework = 'Vue.js';
            info = `**Vue.js** 🌿

**Características:**
• Framework progresivo y fácil de aprender
• Sintaxis clara y simple
• Buena documentación
• Excelente para principiantes

**Concepts clave:**
• Template syntax - HTML con directivas
• Data binding - v-model, v-bind
• Directivas - v-if, v-for, v-show
• Components - Reutilizables
• Vuex - State management

**Instalaci贸n:**
\`\`\`
npm create vue@latest mi-app
\`\`\`

**Ejemplo b谩sico:**
\`\`\`vue
<template>
  <div>{{ mensaje }}</div>
</template>

<script>
export default {
  data() {
    return {
      mensaje: 'Hola Vue!'
    }
  }
}
</script>
\`\`\`

**Recursos:**
• Documentación: vuejs.org
• Nuxt.js - Framework de Vue`;
        } else if (mensaje.includes('angular')) {
            framework = 'Angular';
            info = `**Angular** 🅰️

**Características:**
• Framework completo de Google
• TypeScript por defecto
• Arquitectura robusta
• Ideal para aplicaciones grandes

**Concepts clave:**
• Components - Bloques de construcción
• Services - Lógica de negocio
• Modules - Organización del código
• Dependency Injection
• RxJS - Programación reactiva

**Instalación:**
\`\`\`
npm install -g @angular/cli
ng new mi-app
\`\`\`

**Estructura típica:**
• Componentes con TypeScript
• Templates con directivas
• Servicios para lógica
• Módulos para organización

**Recursos:**
• Documentación: angular.io`;
        }
        
        return info + `\n\n¿Quieres más información sobre ${framework} o algún concepto específico? 💻`;
    }
    
    // Respuesta genérica sobre programación
    return `**Programación y Desarrollo de Software 💻**

Puedo ayudarte con información sobre:

**Frontend 💨**
• React, Vue, Angular
• HTML, CSS, JavaScript
• Diseño responsive
• Frameworks y librerías

**Backend ⚙️**
• Node.js, Python, Java, PHP
• Bases de datos (SQL, NoSQL)
• APIs (REST, GraphQL)
• Autenticación y seguridad

**Fullstack 🚀**
• MERN Stack, MEAN Stack
• Desarrollo completo de apps
• Arquitectura de software

**Lenguajes de Programación:**
• JavaScript/TypeScript
• Python
• Java
• PHP
• Go, Ruby, C#

**Concepts Importantes:**
• Algoritmos y estructuras de datos
• Clean Code (código limpio)
• Patrones de diseño
• Git y control de versiones
• Testing y debugging
• DevOps y deployment

**Rutas de Aprendizaje:**
• Frontend Developer
• Backend Developer
• Fullstack Developer
• Mobile Developer

¿Sobre qué aspecto de la programación quieres saber más? 🔧`;
}

// Auto-focus en el input
userInput.focus();
