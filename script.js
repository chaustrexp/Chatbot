/**
 * ========================================
 * SCRIPT PRINCIPAL DEL PORTAFOLIO
 * ========================================
 * Este archivo contiene toda la funcionalidad JavaScript
 * para hacer el portafolio interactivo.
 */

/**
 * Espera a que el DOM esté completamente cargado antes de ejecutar el código
 * Esto asegura que todos los elementos HTML existan cuando intentamos acceder a ellos
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // MENÚ HAMBURGUESA PARA MÓVIL
    // ========================================
    
    // Obtener los elementos del menú hamburguesa y del menú de navegación
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Si el menú hamburguesa existe (para evitar errores)
    if (hamburger && navMenu) {
        // Agregar un evento de clic al menú hamburguesa
        hamburger.addEventListener('click', function() {
            // Alternar la clase 'active' en el menú de navegación
            // Esto mostrará/ocultará el menú en dispositivos móviles
            navMenu.classList.toggle('active');
        });
        
        // Cerrar el menú cuando se hace clic en un enlace
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Quitar la clase 'active' para cerrar el menú
                navMenu.classList.remove('active');
            });
        });
    }
    
    // ========================================
    // EFECTO DE SCROLL EN LA BARRA DE NAVEGACIÓN
    // ========================================
    
    const navbar = document.querySelector('.navbar');
    
    // Función que se ejecuta cuando el usuario hace scroll
    function handleScroll() {
        if (window.scrollY > 100) {
            // Si el scroll es mayor a 100px, agregar sombra a la barra
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            // Si está en la parte superior, quitar la sombra
            navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
        }
    }
    
    // Escuchar el evento de scroll en la ventana
    window.addEventListener('scroll', handleScroll);
    
    // ========================================
    // MANEJO DEL FORMULARIO DE CONTACTO
    // ========================================
    
    // Obtener el formulario de contacto por su ID
    const contactForm = document.getElementById('contactForm');
    
    // Si el formulario existe, agregar un evento para cuando se envíe
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // Prevenir el comportamiento por defecto (recargar la página)
            event.preventDefault();
            
            // Obtener los valores de los campos del formulario
            const nombre = document.getElementById('nombre').value;
            const correo = document.getElementById('correo').value;
            const mensaje = document.getElementById('mensaje').value;
            
            // Validar que todos los campos estén llenos
            // (La validación HTML5 con 'required' también lo hace, pero esta es una validación extra)
            if (nombre && correo && mensaje) {
                // Mostrar mensaje en la consola del navegador
                console.log('Formulario enviado correctamente');
                
                // También podemos mostrar información del formulario (opcional, para debugging)
                console.log('Datos del formulario:', {
                    nombre: nombre,
                    correo: correo,
                    mensaje: mensaje
                });
                
                // Aquí normalmente enviarías los datos a un servidor
                // Ejemplo con fetch (comentado porque no hay servidor):
                /*
                fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nombre: nombre,
                        correo: correo,
                        mensaje: mensaje
                    })
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Respuesta del servidor:', data);
                    alert('Mensaje enviado con éxito!');
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Hubo un error al enviar el mensaje');
                });
                */
                
                // Limpiar el formulario después de enviar
                contactForm.reset();
                
                // Mostrar un mensaje de éxito al usuario (opcional)
                // Puedes descomentar esta línea si quieres mostrar una alerta
                // alert('¡Mensaje enviado correctamente!');
                
            } else {
                // Si algún campo está vacío, mostrar mensaje de error
                console.error('Por favor, completa todos los campos');
                alert('Por favor, completa todos los campos del formulario');
            }
        });
    }
    
    // ========================================
    // ANIMACIÓN DE BARRAS DE HABILIDADES AL SCROLL
    // ========================================
    
    // Función para animar las barras de habilidades cuando son visibles
    function animateSkills() {
        // Obtener todas las barras de progreso
        const skillBars = document.querySelectorAll('.skill-progress');
        
        // Crear un observador que detecta cuando un elemento entra en la vista
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                // Si el elemento es visible en la pantalla
                if (entry.isIntersecting) {
                    // Obtener el ancho que está definido en el atributo style
                    const width = entry.target.style.width;
                    // Reiniciar el ancho para que la animación funcione
                    entry.target.style.width = '0';
                    // Usar setTimeout para aplicar el ancho después de un pequeño delay
                    setTimeout(() => {
                        entry.target.style.width = width;
                    }, 100);
                    // Dejar de observar este elemento una vez que se animó
                    observer.unobserve(entry.target);
                }
            });
        }, {
            // Opciones: el elemento debe estar 50% visible para activar la animación
            threshold: 0.5
        });
        
        // Observar cada barra de habilidades
        skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }
    
    // Llamar a la función cuando el DOM esté listo
    animateSkills();
    
    // ========================================
    // SCROLL SUAVE A SECCIONES
    // ========================================
    
    // Obtener todos los enlaces del menú de navegación
    const menuLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    // Agregar evento a cada enlace
    menuLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Prevenir el comportamiento por defecto del enlace
            event.preventDefault();
            
            // Obtener el ID de la sección desde el atributo href
            const targetId = this.getAttribute('href');
            
            // Obtener el elemento de destino
            const targetSection = document.querySelector(targetId);
            
            // Si la sección existe, hacer scroll suave hasta ella
            if (targetSection) {
                // Calcular la posición, restando la altura de la barra de navegación
                const offsetTop = targetSection.offsetTop - 80;
                
                // Hacer scroll suave
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========================================
    // EFECTO DE PARALLAX EN EL HERO (OPCIONAL)
    // ========================================
    
    // Crear un efecto sutil de movimiento en el fondo del hero al hacer scroll
    const hero = document.querySelector('.hero');
    
    if (hero) {
        window.addEventListener('scroll', function() {
            // Calcular la posición del scroll
            const scrolled = window.pageYOffset;
            
            // Aplicar un efecto de parallax muy sutil
            // Dividimos por un número grande para que el efecto sea suave
            const parallax = scrolled * 0.5;
            
            // Aplicar la transformación al hero
            hero.style.transform = `translateY(${parallax}px)`;
        });
    }
    
    // ========================================
    // VALIDACIÓN EN TIEMPO REAL DEL FORMULARIO (OPCIONAL)
    // ========================================
    
    // Obtener los campos del formulario
    const nombreInput = document.getElementById('nombre');
    const correoInput = document.getElementById('correo');
    const mensajeInput = document.getElementById('mensaje');
    
    // Validar el campo de correo mientras el usuario escribe
    if (correoInput) {
        correoInput.addEventListener('blur', function() {
            // Expresión regular para validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            // Si el email no es válido, mostrar un mensaje
            if (!emailRegex.test(this.value)) {
                this.style.borderColor = '#ef4444'; // Rojo para error
                console.warn('El formato del correo electrónico no es válido');
            } else {
                this.style.borderColor = 'rgba(56, 189, 248, 0.2)'; // Color normal
            }
        });
    }
    
    // ========================================
    // MENSAJE DE CONSOLA DE BIENVENIDA
    // ========================================
    
    console.log('%c🚀 Bienvenido al portafolio de Welinton Suarez', 'color: #38bdf8; font-size: 16px; font-weight: bold;');
    console.log('%c💻 Ingeniero de Sistemas', 'color: #f97316; font-size: 14px;');
    console.log('%c📧 Siéntete libre de contactarme a través del formulario', 'color: #6366f1; font-size: 12px;');
    
});

