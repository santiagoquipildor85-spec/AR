// Sistema de Detección por Templates de Imagen
class ImageTemplateDetector {
    constructor() {
        this.templates = new Map();
        this.loadTemplates();
    }
    
    // Cargar plantillas de imagen
    async loadTemplates() {
        const customShapes = window.CustomShapeManager ? 
            new CustomShapeManager().customShapes : {};
        
        for (const [shapeId, config] of Object.entries(customShapes)) {
            if (config.imageFile) {
                try {
                    const template = await this.loadImageTemplate(config.imageFile);
                    this.templates.set(shapeId, {
                        template: template,
                        config: config
                    });
                    console.log(`Template cargado: ${shapeId}`);
                } catch (error) {
                    console.warn(`Error cargando template ${shapeId}:`, error);
                }
            }
        }
    }
    
    // Cargar imagen como template
    async loadImageTemplate(imagePath) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            
            img.onload = () => {
                // Crear canvas para procesar la imagen
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                // Obtener datos de la imagen
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                resolve({
                    width: canvas.width,
                    height: canvas.height,
                    data: imageData,
                    processed: this.preprocessTemplate(imageData)
                });
            };
            
            img.onerror = () => reject(new Error(`No se pudo cargar: ${imagePath}`));
            img.src = imagePath;
        });
    }
    
    // Preprocesar template para mejor matching
    preprocessTemplate(imageData) {
        const { data, width, height } = imageData;
        const processed = new Uint8Array(width * height);
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Convertir a escala de grises
            const gray = (r + g + b) / 3;
            
            // Aplicar umbral
            processed[i / 4] = gray > 128 ? 255 : 0;
        }
        
        return {
            data: processed,
            width: width,
            height: height
        };
    }
    
    // Detectar templates en imagen
    detectTemplates(sourceImageData) {
        const detections = [];
        
        this.templates.forEach((templateData, shapeId) => {
            const matches = this.templateMatch(sourceImageData, templateData);
            
            matches.forEach(match => {
                detections.push({
                    id: `${shapeId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    type: shapeId,
                    config: templateData.config,
                    x: match.x,
                    y: match.y,
                    width: match.width,
                    height: match.height,
                    confidence: match.confidence,
                    timestamp: Date.now()
                });
            });
        });
        
        return detections;
    }
    
    // Template matching simplificado
    templateMatch(sourceData, templateData) {
        const matches = [];
        const template = templateData.template.processed;
        const config = templateData.config;
        
        const sourceProcessed = this.preprocessTemplate(sourceData);
        
        // Buscar template en diferentes escalas
        const scales = [0.5, 0.75, 1.0, 1.25, 1.5];
        
        scales.forEach(scale => {
            const scaledWidth = Math.round(template.width * scale);
            const scaledHeight = Math.round(template.height * scale);
            
            if (scaledWidth > sourceProcessed.width || scaledHeight > sourceProcessed.height) {
                return;
            }
            
            // Sliding window
            const stepSize = Math.max(10, Math.min(scaledWidth, scaledHeight) / 4);
            
            for (let y = 0; y <= sourceProcessed.height - scaledHeight; y += stepSize) {
                for (let x = 0; x <= sourceProcessed.width - scaledWidth; x += stepSize) {
                    const confidence = this.calculateMatchConfidence(
                        sourceProcessed, template, x, y, scaledWidth, scaledHeight, scale
                    );
                    
                    if (confidence > config.sensitivity) {
                        // Verificar que no sea muy similar a detecciones existentes
                        const isDuplicate = matches.some(existing => 
                            Math.abs(existing.x - x) < scaledWidth * 0.5 && 
                            Math.abs(existing.y - y) < scaledHeight * 0.5
                        );
                        
                        if (!isDuplicate) {
                            matches.push({
                                x: x,
                                y: y,
                                width: scaledWidth,
                                height: scaledHeight,
                                confidence: confidence,
                                scale: scale
                            });
                        }
                    }
                }
            }
        });
        
        // Retornar solo las mejores coincidencias
        return matches
            .sort((a, b) => b.confidence - a.confidence)
            .slice(0, 3); // Máximo 3 coincidencias por template
    }
    
    // Calcular confianza de coincidencia
    calculateMatchConfidence(sourceData, templateData, startX, startY, width, height, scale) {
        let matchingPixels = 0;
        let totalPixels = 0;
        
        const sampleStep = Math.max(1, Math.round(1 / scale)); // Muestreo adaptativo
        
        for (let ty = 0; ty < templateData.height; ty += sampleStep) {
            for (let tx = 0; tx < templateData.width; tx += sampleStep) {
                const sx = startX + Math.round(tx * scale);
                const sy = startY + Math.round(ty * scale);
                
                if (sx >= 0 && sx < sourceData.width && sy >= 0 && sy < sourceData.height) {
                    const sourceIndex = sy * sourceData.width + sx;
                    const templateIndex = ty * templateData.width + tx;
                    
                    const sourcePixel = sourceData.data[sourceIndex];
                    const templatePixel = templateData.data[templateIndex];
                    
                    totalPixels++;
                    
                    // Coincidencia binaria
                    if (sourcePixel === templatePixel) {
                        matchingPixels++;
                    }
                }
            }
        }
        
        return totalPixels > 0 ? (matchingPixels / totalPixels) : 0;
    }
}

// Integrar con el sistema principal
if (typeof AdvancedShapeDetector !== 'undefined') {
    // Extender detectAllShapes para incluir detección por templates
    const originalDetectAllShapes = AdvancedShapeDetector.prototype.detectAllShapes;
    
    AdvancedShapeDetector.prototype.detectAllShapes = function(imageData) {
        // Detecciones originales (formas geométricas)
        const geometricDetections = originalDetectAllShapes.call(this, imageData);
        
        // Detecciones por template (imágenes personalizadas)
        let templateDetections = [];
        if (this.templateDetector) {
            templateDetections = this.templateDetector.detectTemplates(imageData);
        }
        
        return [...geometricDetections, ...templateDetections];
    };
    
    // Inicializar detector de templates cuando se cargue el sistema principal
    const originalInit = AdvancedShapeDetector.prototype.init;
    AdvancedShapeDetector.prototype.init = function() {
        originalInit.call(this);
        
        // Inicializar detector de templates
        this.templateDetector = new ImageTemplateDetector();
        
        console.log('Sistema de detección por templates inicializado');
    };
}

// Exportar para uso global
window.ImageTemplateDetector = ImageTemplateDetector;
