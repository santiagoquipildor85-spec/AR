// Sistema de formas personalizadas para AR
class CustomShapeManager {
    constructor() {
        this.customShapes = {};
        this.loadCustomShapes();
    }
    
    // Cargar formas personalizadas del usuario
    loadCustomShapes() {
        // El usuario puede agregar sus formas personalizadas aquí
        // Formato: nombre, emoji, color, información
        
        this.customShapes = {
            // Ejemplo de formas personalizadas:
            /*
            "mi_forma": {
                name: "Mi Forma",
                emoji: "⭐", 
                color: "#ff6b6b",
                info: "Información personalizada sobre mi forma"
            },
            "logo_empresa": {
                name: "Logo Empresa",
                emoji: "🏢",
                color: "#4ecdc4", 
                info: "Logo de mi empresa detectado"
            }
            */
        };
        
        console.log('Formas personalizadas cargadas:', Object.keys(this.customShapes).length);
    }
    
    // Agregar nueva forma personalizada
    addCustomShape(id, config) {
        this.customShapes[id] = {
            name: config.name || "Forma Personalizada",
            emoji: config.emoji || "🔸",
            color: config.color || "#333",
            info: config.info || "Forma detectada"
        };
        
        console.log(`Forma personalizada agregada: ${id}`);
        return true;
    }
    
    // Obtener todas las formas (básicas + personalizadas)
    getAllShapes() {
        const basicShapes = {
            circle: { name: 'Círculo', emoji: '🔵', color: '#007bff' },
            square: { name: 'Cuadrado', emoji: '🟩', color: '#28a745' },
            triangle: { name: 'Triángulo', emoji: '🔺', color: '#ffc107' },
            rectangle: { name: 'Rectángulo', emoji: '🟦', color: '#6f42c1' }
        };
        
        return { ...basicShapes, ...this.customShapes };
    }
    
    // Crear template HTML para forma personalizada
    createShapeTemplate(shapeId, shapeData) {
        const template = document.createElement('template');
        template.id = shapeId + 'Info';
        template.innerHTML = `
            <div class="ar-info-card ${shapeId}-info">
                <h4>${shapeData.emoji} ${shapeData.name}</h4>
            </div>
        `;
        
        // Agregar estilos CSS dinámicos
        const style = document.createElement('style');
        style.textContent = `
            .${shapeId}-info {
                border-color: ${shapeData.color} !important;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(template);
        
        return template;
    }
    
    // Método para que el usuario configure sus formas
    configureUserShapes() {
        /*
        INSTRUCCIONES PARA EL USUARIO:
        
        Para agregar tus propias formas, modifica el objeto customShapes arriba con este formato:
        
        "nombre_unico": {
            name: "Nombre que aparece en pantalla",
            emoji: "🔸", // Emoji que quieres mostrar
            color: "#ff6b6b", // Color del borde de detección
            info: "Información que quieres mostrar" // Opcional
        }
        
        Ejemplo:
        "mi_logo": {
            name: "Mi Logo",
            emoji: "🚀",
            color: "#e74c3c",
            info: "¡Logo de mi empresa detectado!"
        }
        
        También puedes usar el método addCustomShape() desde el código:
        shapeManager.addCustomShape("forma1", {
            name: "Mi Forma",
            emoji: "⭐",
            color: "#9b59b6"
        });
        */
        
        console.log('Para configurar formas personalizadas, edita el archivo custom-shapes.js');
    }
}

// Exportar para uso en ar-detector.js
window.CustomShapeManager = CustomShapeManager;
