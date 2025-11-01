"""
ChefBot - Chatbot Temático Especializado en Gastronomía Colombiana
Implementación usando un prompt estructurado
"""

import os
import sys

# Configuración del sistema de prompt
SYSTEM_PROMPT = """Eres ChefBot, un asistente experto en gastronomía colombiana con conocimientos profundos sobre recetas tradicionales, ingredientes locales, técnicas culinarias y cultura gastronómica de Colombia.

PERSONALIDAD:
- Entusiasta y apasionado por la comida colombiana
- Lenguaje amigable y cercano
- Compartes anécdotas culinarias cuando es relevante
- Tono profesional pero accesible
- Recomendaciones prácticas y adaptables

ÁREAS DE EXPERTISE:
1. Recetas Tradicionales: Bandeja paisa, Ajiaco, Sancocho, Lechona, Empanadas, Arepas, etc.
2. Ingredientes Locales: Plátano, yuca, maíz, frutas tropicales, especias colombianas
3. Técnicas Culinarias: Preparación de arepas, tamales, amasijos, frituras
4. Cultura Gastronómica: Orígenes de platos, variaciones regionales, tradiciones
5. Adaptaciones y Variaciones: Versiones vegetarianas, saludables, rápidas

INSTRUCCIONES DE COMPORTAMIENTO:

Cuando la pregunta ES sobre gastronomía colombiana:
- Proporciona respuestas detalladas y precisas
- Incluye ingredientes con cantidades cuando sea apropiado
- Comparte tips y secretos culinarios
- Sugiere variaciones o adaptaciones si aplica
- Menciona técnicas específicas cuando sean relevantes
- Si no conoces un plato específico, sé honesto pero ofrece alternativas relacionadas

Cuando la pregunta NO es sobre gastronomía:
- Reconoce educadamente que está fuera de tu área de expertise
- Sé creativo y temático en tu respuesta de rechazo
- Sugiere redirigir la conversación hacia gastronomía colombiana
- Ejemplos de respuestas creativas:
  * "¡Ay, disculpa! Soy ChefBot y solo sé cocinar, no sé de [tema]. Pero si quieres, puedo compartirte una receta de empanadas para disfrutar con eso 😊"
  * "Hmm, ese tema está fuera de mi menú. Yo solo conozco sobre la cocina colombiana. ¿Qué tal si te enseño a hacer un delicioso ajiaco santafereño?"

REGLAS:
- NUNCA inventes recetas o información que no sea precisa sobre gastronomía colombiana
- SIEMPRE mantén el tema de gastronomía colombiana como tu enfoque principal
- USA emojis culinarios moderadamente (🍳🥘🌶️) para mantener un tono amigable
- ADAPTA el nivel de detalle según la complejidad de la pregunta

Responde siempre en español y mantén tu rol como ChefBot."""

def cargar_prompt():
    """Carga el prompt del sistema"""
    return SYSTEM_PROMPT

def imprimir_bienvenida():
    """Imprime el mensaje de bienvenida de ChefBot"""
    print("\n" + "="*60)
    print("👨‍🍳 ¡BIENVENIDO A CHEFBOT! 👨‍🍳")
    print("="*60)
    print("Soy tu asistente experto en gastronomía colombiana.")
    print("Pregúntame sobre recetas, ingredientes, técnicas y más.")
    print("¡Estoy aquí para ayudarte a cocinar deliciosamente! 🍽️")
    print("="*60)
    print("\n💡 Tip: Prueba preguntarme sobre algo fuera de gastronomía")
    print("   para ver cómo manejo temas fuera de mi expertise.\n")
    print("Escribe 'salir' para terminar la conversación.\n")

def simular_respuesta_ia(mensaje_usuario):
    """
    Simula una respuesta de IA basada en el prompt estructurado.
    En una implementación real, aquí conectarías con una API de IA (OpenAI, etc.)
    """
    mensaje_lower = mensaje_usuario.lower()
    
    # Detectar si el mensaje es sobre gastronomía colombiana
    palabras_gastronomia = [
        'receta', 'cocinar', 'comida', 'plato', 'arepa', 'ajiaco', 
        'sancocho', 'empanada', 'bandeja paisa', 'lechona', 'tamal',
        'ingrediente', 'sabor', 'gastronomía', 'colombiano', 'colombiana',
        'chef', 'cocina', 'comer', 'almuerzo', 'cena', 'desayuno'
    ]
    
    es_gastronomia = any(palabra in mensaje_lower for palabra in palabras_gastronomia)
    
    # Detectar si es pregunta fuera de tema
    palabras_fuera_tema = [
        'fútbol', 'futbol', 'mundial', 'deporte', 'programación', 'código',
        'python', 'javascript', 'videojuego', 'película', 'cine', 'música'
    ]
    
    es_fuera_tema = any(palabra in mensaje_lower for palabra in palabras_fuera_tema)
    
    # Generar respuesta según el prompt
    if es_gastronomia:
        return generar_respuesta_gastronomia(mensaje_lower)
    elif es_fuera_tema:
        return generar_respuesta_fuera_tema(mensaje_lower)
    else:
        # Pregunta genérica - intentar redirigir a gastronomía
        return "¡Hola! Soy ChefBot, experto en gastronomía colombiana. ¿En qué puedo ayudarte hoy? ¿Te gustaría aprender una receta tradicional o conocer más sobre ingredientes colombianos? 🍳"

def generar_respuesta_gastronomia(mensaje):
    """Genera respuestas sobre gastronomía colombiana"""
    if 'arepa' in mensaje:
        return """¡Excelente pregunta! Las arepas son el alma de la cocina colombiana 🥘

**RECETA BÁSICA DE AREPAS:**

**Ingredientes:**
- 2 tazas de harina de maíz precocida (tipo PAN)
- 2 tazas de agua tibia
- 1 cucharadita de sal
- 1 cucharada de mantequilla (opcional)

**Procedimiento:**
1. Mezcla la harina con la sal en un bowl
2. Agrega el agua tibia gradualmente hasta formar una masa suave
3. Amasa por 5 minutos hasta que esté uniforme y sin grumos
4. Forma bolitas del tamaño que prefieras
5. Aplana cada bolita en forma circular (aproximadamente 1 cm de grosor)
6. Cocina en una sartén con un poco de mantequilla a fuego medio
7. Dorar por ambos lados (3-4 minutos cada lado hasta que estén doradas)

**🌶️ Tips Secretos:**
- Si añades queso rallado a la masa, tendrás unas deliciosas arepas de queso
- Para arepas rellenas, puedes cortarlas por la mitad y rellenarlas con lo que quieras
- La temperatura del agua es clave: debe estar tibia, no caliente ni fría

¿Quieres que te enseñe alguna variación específica o relleno tradicional?"""
    
    elif 'ajiaco' in mensaje:
        return """¡El ajiaco santafereño! Uno de los platos más representativos de Bogotá 🇨🇴

**RECETA DE AJIACO SANTAFEREÑO:**

**Ingredientes (para 6 personas):**
- 1 kg de pechuga de pollo
- 1 kg de papa sabanera (papa amarilla)
- 1 kg de papa pastusa
- 500 g de papa criolla
- 3 mazorcas de maíz tierno
- 3 ramas de guascas frescas
- 1/2 taza de crema de leche
- 1/4 taza de alcaparras
- Sal y pimienta al gusto
- Agua suficiente

**Procedimiento:**
1. Cocina el pollo en agua con sal hasta que esté tierno
2. Desmecha el pollo y reserva el caldo
3. Pela y corta las papas en rodajas gruesas
4. En el caldo del pollo, agrega las papas y cocina hasta que se deshagan un poco
5. Agrega las mazorcas de maíz cortadas en trozos
6. Incorpora las guascas frescas picadas
7. Agrega el pollo desmechado
8. Deja cocinar a fuego lento por 30-40 minutos
9. Sazona con sal y pimienta
10. Sirve caliente con crema de leche, alcaparras y aguacate

**🥘 Tip Cultural:** El ajiaco es tradicional de Bogotá y se sirve especialmente en días lluviosos y fríos. Las guascas son el ingrediente secreto que le da su sabor único.

¿Te gustaría conocer variaciones o adaptaciones de esta receta?"""
    
    elif 'bandeja paisa' in mensaje or 'bandeja' in mensaje:
        return """¡La bandeja paisa! El plato más representativo de Antioquia 🍽️

**RECETA DE BANDEJA PAISA:**

**Ingredientes (para 2 personas):**
- 2 porciones de frijoles rojos cocidos
- 2 porciones de arroz blanco
- 2 porciones de carne molida guisada
- 2 chorizos antioqueños
- 2 porciones de chicharrón
- 2 huevos fritos
- 2 tajadas de plátano maduro frito
- Aguacate
- Arepa de maíz
- Hogao (tomate, cebolla, cilantro)

**Preparación:**
Cada componente se prepara por separado y luego se sirve todo junto en una bandeja grande.

**🌶️ Tips:**
- Los frijoles deben cocinarse desde la noche anterior para que queden suaves
- El chicharrón debe quedar crujiente por fuera y tierno por dentro
- La arepa debe estar doradita y caliente al momento de servir

**Variación saludable:** Puedes reducir las porciones de grasa y aumentar las verduras, o hacer una versión vegetariana.

¿Quieres la receta detallada de algún componente específico?"""
    
    elif 'receta' in mensaje or 'cocinar' in mensaje or 'comida' in mensaje:
        return """¡Me encanta que quieras cocinar comida colombiana! 🇨🇴🍳

Puedo ayudarte con recetas de:
- **Arepas** (básicas, de queso, rellenas)
- **Ajiaco santafereño**
- **Bandeja paisa**
- **Sancocho** (de gallina, de res, de pescado)
- **Empanadas colombianas**
- **Tamales**
- **Lechona**
- **Postres colombianos** (tres leches, natilla, etc.)

¿Cuál te gustaría preparar? O si tienes algún plato específico en mente, solo dime cuál y te doy la receta completa con todos los tips 🥘"""
    
    else:
        return """¡Excelente pregunta sobre gastronomía colombiana! 🍽️

Puedo ayudarte con:
- Recetas tradicionales paso a paso
- Ingredientes locales y dónde encontrarlos
- Técnicas culinarias colombianas
- Historia y cultura gastronómica
- Adaptaciones saludables o vegetarianas

¿Sobre qué específicamente te gustaría saber más?"""

def generar_respuesta_fuera_tema(mensaje):
    """Genera respuestas creativas cuando el tema está fuera de gastronomía"""
    if 'fútbol' in mensaje or 'futbol' in mensaje or 'mundial' in mensaje:
        return """¡Ups! Disculpa, pero yo solo sé de comida colombiana, no de fútbol ⚽

Pero si quieres celebrar un triunfo con buena comida, puedo enseñarte a preparar una deliciosa bandeja paisa o unas empanadas para compartir con tus amigos mientras ves el partido. ¿Te interesa? 🍽️"""
    
    elif 'programación' in mensaje or 'código' in mensaje or 'python' in mensaje:
        return """Hmm, ese tema está fuera de mi menú. Yo solo conozco sobre la cocina colombiana 🍳

Aunque no sé de programación, sí sé programar deliciosos sabores. ¿Qué tal si te enseño a preparar un delicioso ajiaco santafereño? O si prefieres algo más rápido, puedo compartirte una receta de arepas que estarán listas en minutos 🌶️"""
    
    elif 'videojuego' in mensaje or 'película' in mensaje or 'cine' in mensaje:
        return """¡Ay, disculpa! Soy ChefBot y solo sé cocinar, no sé de entretenimiento 😊

Pero si quieres disfrutar de una buena película o videojuego con una excelente comida, puedo compartirte recetas de snacks colombianos como empanadas, papas criollas o arepas de huevo. ¿Te interesa algo para picar mientras te entretienes? 🍿"""
    
    else:
        return """Disculpa, ese tema está fuera de mi área de expertise. Soy ChefBot, especialista en gastronomía colombiana 🍳

¿Qué tal si cambiamos el tema? Puedo ayudarte con:
- Recetas tradicionales colombianas
- Técnicas culinarias
- Ingredientes locales
- Cultura gastronómica colombiana

¿Hay algo específico sobre comida colombiana que te gustaría aprender? 🥘"""

def main():
    """Función principal del chatbot"""
    imprimir_bienvenida()
    
    # Cargar el prompt del sistema (para referencia)
    prompt_sistema = cargar_prompt()
    
    print("ChefBot: ¡Hola! Soy ChefBot, tu asistente experto en gastronomía colombiana. ¿En qué puedo ayudarte hoy? 🍳\n")
    
    while True:
        try:
            # Obtener input del usuario
            mensaje_usuario = input("Tú: ").strip()
            
            if not mensaje_usuario:
                continue
            
            # Comando de salida
            if mensaje_usuario.lower() in ['salir', 'exit', 'quit', 'adios', 'adiós']:
                print("\nChefBot: ¡Fue un placer ayudarte! Que disfrutes de tus recetas colombianas 🍽️ ¡Hasta luego! 👨‍🍳\n")
                break
            
            # Generar y mostrar respuesta
            respuesta = simular_respuesta_ia(mensaje_usuario)
            print(f"\nChefBot: {respuesta}\n")
            
        except KeyboardInterrupt:
            print("\n\nChefBot: ¡Hasta luego! Que disfrutes cocinando 👨‍🍳\n")
            break
        except Exception as e:
            print(f"\nError: {e}\n")

if __name__ == "__main__":
    main()



