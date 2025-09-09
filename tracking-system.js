// Sistema de Tracking Avanzado para Seguimiento Perfecto
class ShapeTrackingSystem {
    
    // Actualizar sistema de tracking
    updateTracking(newDetections) {
        const currentTime = Date.now();
        
        // Marcar formas existentes como no vistas
        this.trackedShapes.forEach(shape => {
            shape.seen = false;
        });
        
        // Procesar nuevas detecciones
        newDetections.forEach(detection => {
            const existingId = this.findMatchingShape(detection);
            
            if (existingId) {
                // Actualizar forma existente
                this.updateExistingShape(existingId, detection, currentTime);
            } else {
                // Nueva forma detectada
                this.addNewShape(detection, currentTime);
            }
        });
        
        // Remover formas que no se han visto por mucho tiempo
        this.cleanupLostShapes(currentTime);
    }
    
    // Encontrar forma existente que coincida
    findMatchingShape(detection) {
        let bestMatch = null;
        let bestDistance = Infinity;
        
        this.trackedShapes.forEach((trackedShape, id) => {
            if (trackedShape.type === detection.type) {
                const distance = this.calculateDistance(trackedShape, detection);
                
                if (distance < this.sensitivity.trackingTolerance && distance < bestDistance) {
                    bestDistance = distance;
                    bestMatch = id;
                }
            }
        });
        
        return bestMatch;
    }
    
    // Calcular distancia entre formas
    calculateDistance(shape1, shape2) {
        const dx = shape1.x - shape2.x;
        const dy = shape1.y - shape2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // Actualizar forma existente con suavizado
    updateExistingShape(id, detection, currentTime) {
        const trackedShape = this.trackedShapes.get(id);
        
        // Suavizado de movimiento (filtro de Kalman simplificado)
        const smoothingFactor = 0.7;
        trackedShape.x = trackedShape.x * (1 - smoothingFactor) + detection.x * smoothingFactor;
        trackedShape.y = trackedShape.y * (1 - smoothingFactor) + detection.y * smoothingFactor;
        trackedShape.width = trackedShape.width * (1 - smoothingFactor) + detection.width * smoothingFactor;
        trackedShape.height = trackedShape.height * (1 - smoothingFactor) + detection.height * smoothingFactor;
        
        // Actualizar confianza
        trackedShape.confidence = Math.min(1.0, trackedShape.confidence * 0.9 + detection.confidence * 0.1);
        trackedShape.lastSeen = currentTime;
        trackedShape.seen = true;
        
        // Actualizar historial para predicción
        this.updateShapeHistory(id, trackedShape);
    }
    
    // Agregar nueva forma
    addNewShape(detection, currentTime) {
        const id = `shape_${this.shapeIdCounter++}`;
        
        const trackedShape = {
            ...detection,
            id: id,
            firstSeen: currentTime,
            lastSeen: currentTime,
            seen: true,
            stable: false,
            frameCount: 1
        };
        
        this.trackedShapes.set(id, trackedShape);
        this.trackingHistory.set(id, []);
        
        console.log(`Nueva forma detectada: ${detection.type} (ID: ${id})`);
    }
    
    // Actualizar historial para predicción de movimiento
    updateShapeHistory(id, shape) {
        const history = this.trackingHistory.get(id) || [];
        
        history.push({
            x: shape.x,
            y: shape.y,
            timestamp: shape.lastSeen
        });
        
        // Mantener solo últimas 10 posiciones
        if (history.length > 10) {
            history.shift();
        }
        
        this.trackingHistory.set(id, history);
        
        // Marcar como estable después de 5 frames
        if (shape.frameCount >= 5) {
            shape.stable = true;
        }
        shape.frameCount++;
    }
    
    // Limpiar formas perdidas
    cleanupLostShapes(currentTime) {
        const maxAge = 1000; // 1 segundo
        
        this.trackedShapes.forEach((shape, id) => {
            if (!shape.seen && (currentTime - shape.lastSeen) > maxAge) {
                this.removeShape(id);
            }
        });
    }
    
    // Remover forma del tracking
    removeShape(id) {
        console.log(`Forma perdida: ${id}`);
        this.trackedShapes.delete(id);
        this.trackingHistory.delete(id);
        
        // Remover elementos visuales
        const element = document.querySelector(`[data-shape-id="${id}"]`);
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }
    
    // Renderizar todas las formas rastreadas
    renderTrackedShapes() {
        // Limpiar overlay
        this.clearAROverlay();
        
        // Renderizar cada forma estable
        this.trackedShapes.forEach((shape, id) => {
            if (shape.stable && shape.confidence > this.sensitivity.confidenceThreshold) {
                this.renderShapeWithText(shape, id);
            }
        });
    }
    
    // Renderizar forma individual con texto que la sigue
    renderShapeWithText(shape, id) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = rect.width / this.canvas.width;
        const scaleY = rect.height / this.canvas.height;
        
        // Predecir posición futura para suavizado
        const predictedPos = this.predictShapePosition(id);
        const renderX = (predictedPos.x || shape.x) * scaleX;
        const renderY = (predictedPos.y || shape.y) * scaleY;
        const renderWidth = shape.width * scaleX;
        const renderHeight = shape.height * scaleY;
        
        // Crear indicador de forma
        this.createShapeIndicator(shape, renderX, renderY, renderWidth, renderHeight, id);
        
        // Crear texto que sigue la forma
        this.createFollowingText(shape, renderX, renderY, renderWidth, renderHeight, id);
    }
    
    // Predicción de movimiento para suavizado
    predictShapePosition(id) {
        const history = this.trackingHistory.get(id);
        if (!history || history.length < 2) {
            return {};
        }
        
        // Calcular velocidad promedio
        const recent = history.slice(-3);
        let avgVelX = 0, avgVelY = 0;
        
        for (let i = 1; i < recent.length; i++) {
            const dt = recent[i].timestamp - recent[i-1].timestamp;
            if (dt > 0) {
                avgVelX += (recent[i].x - recent[i-1].x) / dt;
                avgVelY += (recent[i].y - recent[i-1].y) / dt;
            }
        }
        
        avgVelX /= (recent.length - 1);
        avgVelY /= (recent.length - 1);
        
        // Predecir posición 50ms en el futuro
        const predictionTime = 50;
        const lastPos = recent[recent.length - 1];
        
        return {
            x: lastPos.x + (avgVelX * predictionTime),
            y: lastPos.y + (avgVelY * predictionTime)
        };
    }
    
    // Crear indicador visual de la forma
    createShapeIndicator(shape, x, y, width, height, id) {
        const indicator = document.createElement('div');
        indicator.className = 'shape-indicator advanced-indicator';
        indicator.setAttribute('data-shape-id', id);
        
        indicator.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${width}px;
            height: ${height}px;
            border: 2px solid ${shape.config.color};
            border-radius: 4px;
            pointer-events: none;
            z-index: 5;
            animation: pulse-glow 2s infinite;
            box-shadow: 0 0 10px ${shape.config.color}40;
        `;
        
        this.arOverlay.appendChild(indicator);
    }
    
    // Crear texto que sigue perfectamente la forma
    createFollowingText(shape, x, y, width, height, id) {
        const textElement = document.createElement('div');
        textElement.className = 'following-text';
        textElement.setAttribute('data-shape-id', `text_${id}`);
        
        // Posicionar texto encima de la forma
        const textX = x + (width / 2);
        const textY = Math.max(20, y - 10);
        
        textElement.style.cssText = `
            position: absolute;
            left: ${textX}px;
            top: ${textY}px;
            transform: translateX(-50%);
            background: ${shape.config.color}dd;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-family: 'Segoe UI', Arial, sans-serif;
            pointer-events: none;
            z-index: 10;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            transition: all 0.1s ease-out;
            white-space: nowrap;
            text-align: center;
        `;
        
        // Crear contenido con formato especial si tiene subtítulo
        let content = '';
        if (shape.config.subtitle) {
            content = `
                <div style="margin-bottom: 2px;">
                    <span style="margin-right: 6px; font-size: 16px;">${shape.config.emoji}</span>
                    <span style="font-weight: bold; font-size: 16px;">${shape.config.text}</span>
                </div>
                <div style="font-size: 12px; opacity: 0.9; font-weight: normal;">
                    ${shape.config.subtitle}
                </div>
            `;
        } else {
            content = `
                <span style="margin-right: 5px;">${shape.config.emoji}</span>
                <span style="font-weight: 600; font-size: 14px;">${shape.config.text}</span>
            `;
        }
        
        textElement.innerHTML = content;
        this.arOverlay.appendChild(textElement);
    }
}

// Extender la clase principal con el sistema de tracking
Object.assign(AdvancedShapeDetector.prototype, ShapeTrackingSystem.prototype);
