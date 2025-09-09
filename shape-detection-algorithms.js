// Algoritmos de Detección de Formas Específicas
class ShapeDetectionAlgorithms {
    
    // Encontrar contornos en imagen procesada
    findContours(processedData) {
        const { data, width, height } = processedData;
        const contours = [];
        const visited = new Set();
        
        // Buscar componentes conectados (contornos)
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const index = y * width + x;
                
                if (data[index] === 255 && !visited.has(index)) {
                    const contour = this.traceContour(data, width, height, x, y, visited);
                    
                    if (contour.length > 20) { // Filtrar contornos muy pequeños
                        contours.push(this.analyzeContour(contour));
                    }
                }
            }
        }
        
        return contours;
    }
    
    // Rastrear contorno desde punto inicial
    traceContour(data, width, height, startX, startY, visited) {
        const contour = [];
        const stack = [{ x: startX, y: startY }];
        
        while (stack.length > 0) {
            const { x, y } = stack.pop();
            const index = y * width + x;
            
            if (visited.has(index) || x < 0 || x >= width || y < 0 || y >= height) {
                continue;
            }
            
            if (data[index] === 255) {
                visited.add(index);
                contour.push({ x, y });
                
                // Agregar píxeles vecinos
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        stack.push({ x: x + dx, y: y + dy });
                    }
                }
            }
        }
        
        return contour;
    }
    
    // Analizar propiedades del contorno
    analyzeContour(contour) {
        const bounds = this.getBoundingBox(contour);
        const area = contour.length;
        const perimeter = this.calculatePerimeter(contour);
        const aspectRatio = bounds.width / bounds.height;
        
        return {
            points: contour,
            bounds: bounds,
            area: area,
            perimeter: perimeter,
            aspectRatio: aspectRatio,
            centerX: bounds.x + bounds.width / 2,
            centerY: bounds.y + bounds.height / 2
        };
    }
    
    // Calcular bounding box
    getBoundingBox(contour) {
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        
        contour.forEach(point => {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
        });
        
        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY
        };
    }
    
    // Calcular perímetro aproximado
    calculatePerimeter(contour) {
        if (contour.length < 2) return 0;
        
        let perimeter = 0;
        for (let i = 1; i < contour.length; i++) {
            const dx = contour[i].x - contour[i-1].x;
            const dy = contour[i].y - contour[i-1].y;
            perimeter += Math.sqrt(dx * dx + dy * dy);
        }
        
        return perimeter;
    }
    
    // DETECCIÓN ESPECÍFICA: Forma L
    detectLShape(contours) {
        const matches = [];
        
        contours.forEach(contour => {
            const confidence = this.analyzeLShape(contour);
            
            if (confidence > 0.6) {
                matches.push({
                    x: contour.bounds.x,
                    y: contour.bounds.y,
                    width: contour.bounds.width,
                    height: contour.bounds.height,
                    confidence: confidence,
                    type: 'L_shape'
                });
            }
        });
        
        return matches;
    }
    
    // Analizar si el contorno es una forma L
    analyzeLShape(contour) {
        const { bounds, area, aspectRatio } = contour;
        
        // Filtros básicos
        if (area < this.sensitivity.areaMinSize || area > this.sensitivity.areaMaxSize) {
            return 0;
        }
        
        // Análisis de forma L: buscar esquina característica
        const cornerScore = this.findLCorner(contour);
        const rectangularityScore = this.measureRectangularity(contour);
        const aspectScore = this.scoreAspectRatio(aspectRatio, 0.5, 2.0); // L puede ser horizontal o vertical
        
        // Puntuación combinada
        const confidence = (cornerScore * 0.5 + rectangularityScore * 0.3 + aspectScore * 0.2);
        
        return Math.min(1.0, confidence);
    }
    
    // DETECCIÓN ESPECÍFICA: Forma T
    detectTShape(contours) {
        const matches = [];
        
        contours.forEach(contour => {
            const confidence = this.analyzeTShape(contour);
            
            if (confidence > 0.6) {
                matches.push({
                    x: contour.bounds.x,
                    y: contour.bounds.y,
                    width: contour.bounds.width,
                    height: contour.bounds.height,
                    confidence: confidence,
                    type: 'T_shape'
                });
            }
        });
        
        return matches;
    }
    
    // Analizar si el contorno es una forma T
    analyzeTShape(contour) {
        const { bounds, area, aspectRatio } = contour;
        
        // Filtros básicos
        if (area < this.sensitivity.areaMinSize || area > this.sensitivity.areaMaxSize) {
            return 0;
        }
        
        // Análisis específico de T
        const tScore = this.findTJunction(contour);
        const symmetryScore = this.measureSymmetry(contour);
        const aspectScore = this.scoreAspectRatio(aspectRatio, 0.8, 1.5);
        
        const confidence = (tScore * 0.6 + symmetryScore * 0.2 + aspectScore * 0.2);
        
        return Math.min(1.0, confidence);
    }
    
    // DETECCIÓN ESPECÍFICA: Cruz
    detectCrossShape(contours) {
        const matches = [];
        
        contours.forEach(contour => {
            const confidence = this.analyzeCrossShape(contour);
            
            if (confidence > 0.6) {
                matches.push({
                    x: contour.bounds.x,
                    y: contour.bounds.y,
                    width: contour.bounds.width,
                    height: contour.bounds.height,
                    confidence: confidence,
                    type: 'cross_shape'
                });
            }
        });
        
        return matches;
    }
    
    // Analizar si el contorno es una cruz
    analyzeCrossShape(contour) {
        const { bounds, area, aspectRatio } = contour;
        
        // Filtros básicos
        if (area < this.sensitivity.areaMinSize || area > this.sensitivity.areaMaxSize) {
            return 0;
        }
        
        // Análisis específico de cruz
        const crossScore = this.findCrossIntersection(contour);
        const symmetryScore = this.measureSymmetry(contour);
        const aspectScore = this.scoreAspectRatio(aspectRatio, 0.8, 1.2); // Cruz debe ser relativamente cuadrada
        
        const confidence = (crossScore * 0.6 + symmetryScore * 0.3 + aspectScore * 0.1);
        
        return Math.min(1.0, confidence);
    }
    
    // FUNCIONES AUXILIARES DE ANÁLISIS
    
    // Encontrar esquina característica de L
    findLCorner(contour) {
        // Simplificado: buscar cambios de dirección de 90 grados
        const corners = this.findCorners(contour.points);
        
        let lCornerScore = 0;
        corners.forEach(corner => {
            if (Math.abs(corner.angle - 90) < 15) { // Tolerancia de 15 grados
                lCornerScore += 0.3;
            }
        });
        
        return Math.min(1.0, lCornerScore);
    }
    
    // Encontrar unión en T
    findTJunction(contour) {
        // Análisis de la forma para encontrar patrón T
        const { bounds } = contour;
        const centerX = bounds.x + bounds.width / 2;
        
        // Buscar distribución de píxeles característica de T
        let topDensity = 0;
        let bottomDensity = 0;
        
        contour.points.forEach(point => {
            if (point.y < bounds.y + bounds.height * 0.3) {
                topDensity++;
            } else if (point.y > bounds.y + bounds.height * 0.7) {
                bottomDensity++;
            }
        });
        
        const tRatio = topDensity / (bottomDensity + 1);
        return Math.min(1.0, tRatio > 2 ? 0.8 : tRatio * 0.4);
    }
    
    // Encontrar intersección de cruz
    findCrossIntersection(contour) {
        const { bounds } = contour;
        const centerX = bounds.x + bounds.width / 2;
        const centerY = bounds.y + bounds.height / 2;
        
        // Verificar densidad en el centro vs bordes
        let centerDensity = 0;
        let edgeDensity = 0;
        
        contour.points.forEach(point => {
            const distFromCenter = Math.sqrt(
                Math.pow(point.x - centerX, 2) + Math.pow(point.y - centerY, 2)
            );
            
            if (distFromCenter < Math.min(bounds.width, bounds.height) * 0.3) {
                centerDensity++;
            } else if (distFromCenter > Math.min(bounds.width, bounds.height) * 0.4) {
                edgeDensity++;
            }
        });
        
        const crossRatio = centerDensity / (edgeDensity + 1);
        return Math.min(1.0, crossRatio > 0.5 ? 0.8 : crossRatio * 1.6);
    }
    
    // Medir rectangularidad
    measureRectangularity(contour) {
        const { bounds, area } = contour;
        const boundingArea = bounds.width * bounds.height;
        return area / boundingArea;
    }
    
    // Medir simetría
    measureSymmetry(contour) {
        // Simplificado: comparar distribución de píxeles
        return 0.7; // Placeholder - implementación completa requiere más análisis
    }
    
    // Puntuar aspect ratio
    scoreAspectRatio(ratio, ideal, tolerance) {
        const diff = Math.abs(ratio - ideal);
        return Math.max(0, 1 - (diff / tolerance));
    }
    
    // Encontrar esquinas en contorno
    findCorners(points) {
        const corners = [];
        const windowSize = 5;
        
        for (let i = windowSize; i < points.length - windowSize; i++) {
            const prev = points[i - windowSize];
            const curr = points[i];
            const next = points[i + windowSize];
            
            const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x);
            const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x);
            
            let angleDiff = Math.abs(angle2 - angle1) * 180 / Math.PI;
            if (angleDiff > 180) angleDiff = 360 - angleDiff;
            
            if (angleDiff > 60) { // Umbral para considerar esquina
                corners.push({
                    point: curr,
                    angle: angleDiff
                });
            }
        }
        
        return corners;
    }
}

// Extender la clase principal con algoritmos de detección
Object.assign(AdvancedShapeDetector.prototype, ShapeDetectionAlgorithms.prototype);
