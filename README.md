# Chatbot Temático - ChefBot 🍳

Este proyecto implementa un **chatbot especializado en gastronomía colombiana** usando un prompt inteligente estructurado, cumpliendo con los requisitos del reto de diseño de chatbots temáticos.

## 📋 Descripción

**ChefBot** es un asistente experto en gastronomía colombiana que:
- ✅ Tiene un rol claro y definido: "Soy ChefBot, un asistente experto en gastronomía colombiana"
- ✅ Responde coherentemente dentro de su tema (recetas, ingredientes, técnicas culinarias)
- ✅ Muestra respuestas creativas cuando se le hacen preguntas fuera de su campo

## 🎯 Características

### Especialización en Gastronomía Colombiana
- Recetas tradicionales (Bandeja paisa, Ajiaco, Sancocho, Arepas, etc.)
- Ingredientes locales y técnicas culinarias
- Cultura gastronómica colombiana
- Adaptaciones saludables y variaciones

### Manejo Creativo de Temas Fuera de Campo
El chatbot reconoce cuando se le pregunta algo fuera de su expertise y responde de manera temática y creativa, sugiriendo redirigir la conversación hacia gastronomía.

**Ejemplo:**
```
Usuario: "¿Quién ganó el Mundial de Fútbol?"
ChefBot: "¡Ups! Disculpa, pero yo solo sé de comida colombiana, no de fútbol ⚽. 
         Pero si quieres celebrar un triunfo con buena comida, puedo enseñarte a 
         preparar una deliciosa bandeja paisa para compartir con tus amigos mientras 
         ves el partido. ¿Te interesa? 🍽️"
```

## 📁 Estructura del Proyecto

```
Chatbots/
├── chefbot_prompt.md    # Prompt estructurado completo (documentación)
├── chefbot.py          # Implementación del chatbot en Python (CLI)
├── index.html          # Interfaz web del chatbot
├── styles.css          # Estilos CSS para la interfaz web
├── script.js           # Lógica del chatbot en JavaScript
├── README.md           # Este archivo
├── ejemplo_uso.md      # Ejemplos de interacción
└── plantilla_chatbot_tematico.md  # Plantilla para crear otros chatbots
```

## 🚀 Uso

### Versión Web (Recomendada) 🌐

La versión web ofrece una interfaz moderna y visual para interactuar con ChefBot.

#### Opción 1: Abrir directamente
Simplemente abre el archivo `index.html` en tu navegador web:
```bash
# Windows
start index.html

# Mac
open index.html

# Linux
xdg-open index.html
```

#### Opción 2: Usar un servidor local (Recomendado)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (si tienes http-server instalado)
npx http-server
```

Luego abre tu navegador en: `http://localhost:8000`

#### Características de la Versión Web:
- ✅ Interfaz visual moderna y responsive
- ✅ Animaciones suaves
- ✅ Indicador de escritura
- ✅ Sugerencias rápidas de preguntas
- ✅ Diseño adaptado para móviles
- ✅ Sin necesidad de instalar dependencias

### Versión Python (CLI) 🐍

Para usar la versión de línea de comandos:

#### Requisitos
- Python 3.6 o superior
- No se requieren librerías externas (implementación básica)

#### Ejecutar el Chatbot
```bash
python chefbot.py
```

### Ejemplos de Preguntas

**Preguntas dentro del tema:**
- "¿Cómo hago arepas?"
- "Dame la receta del ajiaco santafereño"
- "¿Qué ingredientes necesito para una bandeja paisa?"
- "Explícame sobre la gastronomía colombiana"

**Preguntas fuera del tema (para probar el manejo creativo):**
- "¿Quién ganó el Mundial de Fútbol?"
- "Enséñame a programar en Python"
- "¿Qué película me recomiendas?"
- "Háblame de videojuegos"

## 📝 Prompt Estructurado

El archivo `chefbot_prompt.md` contiene el prompt completo y estructurado que define:
- **Rol del Chatbot**: Identidad y personalidad
- **Personalidad y Estilo**: Cómo se comunica
- **Conocimiento Especializado**: Áreas de expertise
- **Instrucciones de Comportamiento**: Qué hacer cuando la pregunta está dentro/fuera del tema
- **Ejemplos de Interacción**: Casos de uso
- **Formato de Respuestas**: Estructura esperada

### Adaptar para Otros Temas

Este mismo enfoque puede ser adaptado para crear chatbots sobre otros temas:
- **FutbolBot**: Expert en fútbol colombiano
- **CodeBot**: Expert en programación
- **GameBot**: Expert en videojuegos
- **PsychBot**: Expert en psicología

Solo necesitas modificar el prompt en `chefbot_prompt.md` con:
1. Cambiar el rol y personalidad
2. Actualizar las áreas de expertise
3. Ajustar las respuestas creativas fuera de tema
4. Modificar ejemplos de interacción

## 🔧 Implementación Técnica

### Versión Actual
La implementación actual (`chefbot.py`) usa respuestas pre-programadas basadas en palabras clave. Esto demuestra el concepto del prompt estructurado.

### Integración con IA Real
Para usar con una API de IA (OpenAI, Anthropic, etc.), simplemente envía el `SYSTEM_PROMPT` como contexto del sistema y los mensajes del usuario como mensajes de usuario. Ejemplo:

```python
# Ejemplo con OpenAI API
import openai

response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": mensaje_usuario}
    ]
)
```

## ✨ Evaluación del Reto

### Criterios Cumplidos:
- ✅ **Rol claro y definido**: ChefBot se presenta como experto en gastronomía colombiana
- ✅ **Respuestas coherentes**: Proporciona información detallada y precisa sobre su tema
- ✅ **Manejo creativo fuera de tema**: Respuestas temáticas y sugerencias para redirigir la conversación

## 📚 Documentación Adicional

- Ver `chefbot_prompt.md` para el prompt completo y detallado
- Ver `ejemplo_uso.md` para ejemplos de interacción

## 🎓 Notas para Estudiantes

Este proyecto demuestra:
1. **Diseño de prompts estructurados**: Cómo organizar un prompt para definir claramente el comportamiento de un chatbot
2. **Especialización temática**: Cómo crear un asistente experto en un área específica
3. **Manejo de contexto fuera de tema**: Estrategias creativas para responder preguntas fuera del expertise
4. **Implementación práctica**: Cómo llevar un prompt a código funcional

## 📄 Licencia

Este proyecto es educativo y está disponible para uso académico.

---

**Creado como ejemplo de Chatbot Temático con Prompt Inteligente** 🎯

