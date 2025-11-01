/**
 * ===================================
 * SCRIPT PRINCIPAL DEL PORTAFOLIO
 * ===================================
 * Este archivo maneja la funcionalidad interactiva del sitio web
 */

// Esperar a que el documento HTML esté completamente cargado/**
 * ===================================
 * SCRIPT PRINCIPAL DEL PORTAFOLIO
 * ===================================
 * Este archivo maneja la funcionalidad interactiva del sitio web
 */

// Esperar a que el documento HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    /**
     * ===================================
     * LOADER ÉPICO DE ENTRADA
     * ===================================
     * Controla la animación de entrada épica
     */
    
    const loader = document.getElementById('loader');
    const body = document.body;
    
    // Simular tiempo de carga y mostrar animación épica
    setTimeout(function() {
        loader.classList.add('fade-out');
        body.classList.remove('loading');
        
        // Remover el loader del DOM después de la animación
        setTimeout(function() {
            loader.style.display = 'none';
        }, 800);
    }, 2500); // 2.5 segundos de animación épica
    
    
    /**
     * ===================================
     * MANEJO DEL FORMULARIO DE CONTACTO
     * ===================================
     */
    
    // Obtener referencia al formulario de contacto por su ID
    const contactoForm = document.getElementById('contacto-form');
    
    // Agregar un "escuchador" de eventos para cuando se envíe el formulario
    contactoForm.addEventListener('submit', function(event) {
        // Prevenir el comportamiento por defecto (recargar la página)
        event.preventDefault();
        
        // Obtener los valores de los campos del formulario
        const nombre = document.getElementById('nombre').value;
        const correo = document.getElementById('correo').value;
        const mensaje = document.getElementById('mensaje').value;
        
        // Validación básica: verificar que todos los campos estén llenos
        if (nombre.trim() === '' || correo.trim() === '' || mensaje.trim() === '') {
            alert('Por favor, completa todos los campos del formulario.');
            return; // Detener la ejecución si hay campos vacíos
        }
        
        // Mostrar mensaje en la consola del navegador
        console.log('Formulario enviado correctamente');
        
        // Opcional: Mostrar un mensaje de confirmación al usuario
        alert('¡Gracias por tu mensaje! Te contactaré pronto.');
        
        // Limpiar el formulario después del envío
        contactoForm.reset();
    });
    
    
    /**
     * ===================================
     * NAVEGACIÓN SUAVE (SMOOTH SCROLL)
     ===================================
     * Hace que al hacer clic en los enlaces del menú,
     * la página se desplace suavemente hacia la sección
     */
    
    // Obtener todos los enlaces del menú de navegación
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Agregar evento de clic a cada enlace
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            // Obtener el destino del enlace (ej: #presentacion, #proyectos)
            const href = this.getAttribute('href');
            
            // Verificar que el enlace sea una sección interna (empieza con #)
            if (href.startsWith('#')) {
                event.preventDefault(); // Prevenir el salto brusco
                
                // Buscar el elemento de la sección destino
                const targetSection = document.querySelector(href);
                
                // Si la sección existe, desplazarse hacia ella suavemente
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth', // Desplazamiento suave
                        block: 'start'      // Alinear al inicio de la sección
                    });
                }
            }
        });
    });
    
    
    /**
     * ===================================
     * EFECTO DE SCROLL EN LA NAVEGACIÓN
     * ===================================
     * Cambiar el estilo de la barra de navegación cuando
     * el usuario hace scroll hacia abajo
     */
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        const navbar = document.querySelector('.navbar');
        
        // Agregar sombra más pronunciada cuando se hace scroll
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        }
        
        lastScroll = currentScroll;
    });
    
    
    /**
     * ===================================
     * FUNCIONALIDAD DE BOTONES "VER MÁS"
     * ===================================
     * Manejar los clics en los botones de proyectos
     */
    
    // Obtener todos los botones "Ver más" de los proyectos
    const verMasButtons = document.querySelectorAll('.btn-ver-mas');
    
    // Agregar evento de clic a cada botón
    verMasButtons.forEach(function(button, index) {
        button.addEventListener('click', function() {
            // Obtener el título del proyecto (está en el h3 de la tarjeta)
            const proyectoCard = this.closest('.proyecto-card');
            const proyectoTitle = proyectoCard.querySelector('h3').textContent;
            
            // Mostrar información en la consola
            console.log(`Proyecto seleccionado: ${proyectoTitle}`);
            
            // Opcional: Mostrar alerta al usuario
            // En una aplicación real, aquí podrías redirigir a una página de detalle
            alert(`Has seleccionado el proyecto: ${proyectoTitle}\n\nEn una versión real, esto te llevaría a la página de detalles del proyecto.`);
        });
    });
    
    
    /**
     * ===================================
     * EFECTO DE ANIMACIÓN AL HACER SCROLL
     * ===================================
     * Hacer que las tarjetas aparezcan con animación
     * cuando el usuario hace scroll hacia ellas
     */
    
    // Función para verificar si un elemento es visible en la pantalla
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Función para agregar animación a los elementos
    function animateOnScroll() {
        // Seleccionar todas las tarjetas
        const cards = document.querySelectorAll('.experiencia-card, .habilidad-card, .logro-card, .hobby-card, .proyecto-card');
        
        cards.forEach(function(card) {
            // Si la tarjeta está visible y no tiene la clase 'animated', agregarla
            if (isElementInViewport(card) && !card.classList.contains('animated')) {
                card.classList.add('animated');
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                
                // Animar la aparición
                setTimeout(function() {
                    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            }
        });
    }
    
    // Ejecutar la animación cuando se hace scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Ejecutar una vez al cargar la página para animar elementos ya visibles
    animateOnScroll();
    
});


document.addEventListener('DOMContentLoaded', function() {
    
    /**
     * ===================================
     * MANEJO DEL FORMULARIO DE CONTACTO
     * ===================================
     */
    
    // Obtener referencia al formulario de contacto por su ID
    const contactoForm = document.getElementById('contacto-form');
    
    // Agregar un "escuchador" de eventos para cuando se envíe el formulario
    contactoForm.addEventListener('submit', function(event) {
        // Prevenir el comportamiento por defecto (recargar la página)
        event.preventDefault();
        
        // Obtener los valores de los campos del formulario
        const nombre = document.getElementById('nombre').value;
        const correo = document.getElementById('correo').value;
        const mensaje = document.getElementById('mensaje').value;
        
        // Validación básica: verificar que todos los campos estén llenos
        if (nombre.trim() === '' || correo.trim() === '' || mensaje.trim() === '') {
            alert('Por favor, completa todos los campos del formulario.');
            return; // Detener la ejecución si hay campos vacíos
        }
        
        // Mostrar mensaje en la consola del navegador
        console.log('Formulario enviado correctamente');
        
        // Opcional: Mostrar un mensaje de confirmación al usuario
        alert('¡Gracias por tu mensaje! Te contactaré pronto.');
        
        // Limpiar el formulario después del envío
        contactoForm.reset();
    });
    
    
    /**
     * ===================================
     * NAVEGACIÓN SUAVE (SMOOTH SCROLL)
     ===================================
     * Hace que al hacer clic en los enlaces del menú,
     * la página se desplace suavemente hacia la sección
     */
    
    // Obtener todos los enlaces del menú de navegación
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Agregar evento de clic a cada enlace
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            // Obtener el destino del enlace (ej: #presentacion, #proyectos)
            const href = this.getAttribute('href');
            
            // Verificar que el enlace sea una sección interna (empieza con #)
            if (href.startsWith('#')) {
                event.preventDefault(); // Prevenir el salto brusco
                
                // Buscar el elemento de la sección destino
                const targetSection = document.querySelector(href);
                
                // Si la sección existe, desplazarse hacia ella suavemente
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth', // Desplazamiento suave
                        block: 'start'      // Alinear al inicio de la sección
                    });
                }
            }
        });
    });
    
    
    /**
     * ===================================
     * EFECTO DE SCROLL EN LA NAVEGACIÓN
     * ===================================
     * Cambiar el estilo de la barra de navegación cuando
     * el usuario hace scroll hacia abajo
     */
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        const navbar = document.querySelector('.navbar');
        
        // Agregar sombra más pronunciada cuando se hace scroll
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        }
        
        lastScroll = currentScroll;
    });
    
    
    /**
     * ===================================
     * FUNCIONALIDAD DE BOTONES "VER MÁS"
     * ===================================
     * Manejar los clics en los botones de proyectos
     */
    
    // Obtener todos los botones "Ver más" de los proyectos
    const verMasButtons = document.querySelectorAll('.btn-ver-mas');
    
    // Agregar evento de clic a cada botón
    verMasButtons.forEach(function(button, index) {
        button.addEventListener('click', function() {
            // Obtener el título del proyecto (está en el h3 de la tarjeta)
            const proyectoCard = this.closest('.proyecto-card');
            const proyectoTitle = proyectoCard.querySelector('h3').textContent;
            
            // Mostrar información en la consola
            console.log(`Proyecto seleccionado: ${proyectoTitle}`);
            
            // Opcional: Mostrar alerta al usuario
            // En una aplicación real, aquí podrías redirigir a una página de detalle
            alert(`Has seleccionado el proyecto: ${proyectoTitle}\n\nEn una versión real, esto te llevaría a la página de detalles del proyecto.`);
        });
    });
    
    
    /**
     * ===================================
     * EFECTO DE ANIMACIÓN AL HACER SCROLL
     * ===================================
     * Hacer que las tarjetas aparezcan con animación
     * cuando el usuario hace scroll hacia ellas
     */
    
    // Función para verificar si un elemento es visible en la pantalla
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Función para agregar animación a los elementos
    function animateOnScroll() {
        // Seleccionar todas las tarjetas
        const cards = document.querySelectorAll('.experiencia-card, .habilidad-card, .proyecto-card');
        
        cards.forEach(function(card) {
            // Si la tarjeta está visible y no tiene la clase 'animated', agregarla
            if (isElementInViewport(card) && !card.classList.contains('animated')) {
                card.classList.add('animated');
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                
                // Animar la aparición
                setTimeout(function() {
                    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            }
        });
    }
    
    // Ejecutar la animación cuando se hace scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Ejecutar una vez al cargar la página para animar elementos ya visibles
    animateOnScroll();
    
});


