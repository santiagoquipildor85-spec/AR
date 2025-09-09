// Sistema de Realidad Aumentada con Detección de Formas
class ARShapeDetector {
    constructor() {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.arOverlay = document.getElementById('arOverlay');
        
        this.startBtn = document.getElementById('startAR');
        this.stopBtn = document.getElementById('stopAR');
        this.backBtn = document.getElementById('backBtn');
        this.shapeSelect = document.getElementById('shapeSelect');
        this.detectionInfo = document.getElementById('detectionInfo');
        
        this.stream = null;
        this.isRunning = false;
        this.animationId = null;
        this.lastDetections = [];
        
        this.shapeData = {
            circle: {
                name: 'Círculo',
                color: '#007bff',
                emoji: '🔵'
            },
            square: {
                name: 'Cuadrado', 
                color: '#28a745',
                emoji: '🟩'
            },
            triangle: {
                name: 'Triángulo',
                color: '#ffc107',
                emoji: '🔺'
            },
            rectangle: {
                name: 'Rectángulo',
                color: '#6f42c1',
                emoji: '🟦'
            }
        };
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.startBtn.addEventListener('click', () => this.startAR());
        this.stopBtn.addEventListener('click', () => this.stopAR());
        this.backBtn.addEventListener('click', () => this.goBack());
        this.shapeSelect.addEventListener('change', () => this.updateTargetShape());
        
        // Configurar canvas
        this.setupCanvas();
        
        console.log('AR Shape Detector inicializado');
        
        // Verificar si OpenCV está cargado
        this.waitForOpenCV();
    }
    
    waitForOpenCV() {
        if (typeof cv !== 'undefined' && cv.Mat) {
            console.log('OpenCV cargado correctamente');
            this.isOpenCVReady = true;
        } else {
            console.log('Esperando a que OpenCV se cargue...');
            setTimeout(() => this.waitForOpenCV(), 500);
        }
    }
    
    setupCanvas() {
        // Ajustar canvas al contenedor
        const container = this.canvas.parentElement;
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
    }
    
    async startAR() {
        try {
            this.startBtn.style.display = 'none';
            this.stopBtn.style.display = 'inline-block';
            
            // Obtener acceso a la cámara
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Cámara trasera
                    width: { ideal: 800 },
                    height: { ideal: 400 }
                }
            });
            
            this.video.srcObject = this.stream;
            this.video.play();
            
            // Esperar a que el video esté listo
            this.video.addEventListener('loadedmetadata', () => {
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
                this.isRunning = true;
                this.detectShapes();
                this.updateDetectionInfo('Cámara AR iniciada. Buscando formas...');
            });
            
            console.log('AR iniciado');
            
        } catch (error) {
            console.error('Error al iniciar AR:', error);
            this.showError('Error al acceder a la cámara: ' + error.message);
            this.resetUI();
        }
    }
    
    stopAR() {
        this.isRunning = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        if (this.video.srcObject) {
            this.video.srcObject = null;
        }
        
        // Limpiar canvas y overlay
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.clearAROverlay();
        
        this.resetUI();
        this.updateDetectionInfo('AR detenido');
        console.log('AR detenido');
    }
    
    detectShapes() {
        if (!this.isRunning || !this.video.videoWidth) {
            return;
        }
        
        try {
            // Dibujar frame del video en canvas
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
            
            // Obtener datos de imagen
            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            
            // Detectar formas usando análisis simple de contornos
            const detections = this.detectShapesInImage(imageData);
            
            // Limpiar detecciones anteriores
            this.clearAROverlay();
            
            // Mostrar nuevas detecciones
            if (detections.length > 0) {
                this.displayDetections(detections);
                this.lastDetections = detections;
                this.updateDetectionInfo(`${detections.length} forma(s) detectada(s)`);
            } else {
                this.updateDetectionInfo('Buscando formas...');
            }
            
        } catch (error) {
            console.error('Error en detección:', error);
        }
        
        // Continuar detección
        if (this.isRunning) {
            this.animationId = requestAnimationFrame(() => this.detectShapes());
        }
    }
    
    detectShapesInImage(imageData) {
        const detections = [];
        const targetShape = this.shapeSelect.value;
        
        try {
            // Simulación de detección de formas
            // En una implementación real, aquí usarías OpenCV o algoritmos de visión por computadora
            
            // Para esta demo, generamos detecciones simuladas en posiciones aleatorias
            if (Math.random() > 0.7) { // 30% de probabilidad de detección
                const detection = this.generateSimulatedDetection(targetShape);
                if (detection) {
                    detections.push(detection);
                }
            }
            
            // Detección básica de contornos usando análisis de píxeles
            const basicDetections = this.basicShapeDetection(imageData, targetShape);
            detections.push(...basicDetections);
            
        } catch (error) {
            console.error('Error en algoritmo de detección:', error);
        }
        
        return detections;
    }
    
    basicShapeDetection(imageData, targetShape) {
        const detections = [];
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        // Análisis simple de regiones oscuras que podrían ser formas
        const threshold = 100;
        const regions = [];
        
        for (let y = 50; y < height - 50; y += 30) {
            for (let x = 50; x < width - 50; x += 30) {
                const index = (y * width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                
                // Detectar regiones oscuras (posibles objetos)
                const brightness = (r + g + b) / 3;
                if (brightness < threshold) {
                    // Verificar si hay suficiente contraste alrededor
                    const hasContrast = this.checkContrast(data, x, y, width, height);
                    if (hasContrast && Math.random() > 0.95) { // Reducir falsas detecciones
                        regions.push({ x, y, type: targetShape });
                    }
                }
            }
        }
        
        // Procesar regiones encontradas
        regions.forEach(region => {
            const detection = {
                type: region.type,
                x: region.x,
                y: region.y,
                width: 60 + Math.random() * 40,
                height: 60 + Math.random() * 40,
                confidence: 0.7 + Math.random() * 0.3
            };
            
            detections.push(detection);
        });
        
        return detections.slice(0, 2); // Limitar a 2 detecciones máximo
    }
    
    checkContrast(data, x, y, width, height) {
        // Verificar contraste en un área pequeña alrededor del punto
        let darkPixels = 0;
        let lightPixels = 0;
        
        for (let dy = -10; dy <= 10; dy += 5) {
            for (let dx = -10; dx <= 10; dx += 5) {
                const nx = x + dx;
                const ny = y + dy;
                
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const index = (ny * width + nx) * 4;
                    const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
                    
                    if (brightness < 100) darkPixels++;
                    else if (brightness > 150) lightPixels++;
                }
            }
        }
        
        return darkPixels > 2 && lightPixels > 2;
    }
    
    generateSimulatedDetection(targetShape) {
        // Generar detección simulada para demostración
        const x = 100 + Math.random() * (this.canvas.width - 200);
        const y = 100 + Math.random() * (this.canvas.height - 200);
        const size = 50 + Math.random() * 100;
        
        return {
            type: targetShape,
            x: x,
            y: y,
            width: size,
            height: size,
            confidence: 0.8 + Math.random() * 0.2,
            simulated: true
        };
    }
    
    displayDetections(detections) {
        detections.forEach((detection, index) => {
            this.drawDetectionIndicator(detection);
            this.showARInfo(detection, index);
        });
    }
    
    drawDetectionIndicator(detection) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = rect.width / this.canvas.width;
        const scaleY = rect.height / this.canvas.height;
        
        // Crear indicador visual
        const indicator = document.createElement('div');
        indicator.className = `detection-indicator ${detection.type}`;
        indicator.style.left = (detection.x * scaleX) + 'px';
        indicator.style.top = (detection.y * scaleY) + 'px';
        indicator.style.width = (detection.width * scaleX) + 'px';
        indicator.style.height = (detection.height * scaleY) + 'px';
        
        this.arOverlay.appendChild(indicator);
        
        // Remover después de 2 segundos
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
            }
        }, 2000);
    }
    
    showARInfo(detection, index) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = rect.width / this.canvas.width;
        const scaleY = rect.height / this.canvas.height;
        
        // Obtener template de información
        const template = document.getElementById(detection.type + 'Info');
        if (!template) return;
        
        const infoCard = template.content.cloneNode(true);
        const cardElement = infoCard.querySelector('.ar-info-card');
        
        // Calcular métricas de la forma
        const area = Math.round(detection.width * detection.height);
        const radius = Math.round(Math.sqrt(area / Math.PI));
        const side = Math.round(Math.sqrt(area));
        const perimeter = Math.round(2 * Math.PI * radius);
        
        // Rellenar información específica
        switch(detection.type) {
            case 'circle':
                cardElement.querySelector('.area-value').textContent = area + ' px²';
                cardElement.querySelector('.radius-value').textContent = radius + ' px';
                break;
            case 'square':
                cardElement.querySelector('.area-value').textContent = area + ' px²';
                cardElement.querySelector('.side-value').textContent = side + ' px';
                break;
            case 'triangle':
                cardElement.querySelector('.area-value').textContent = area + ' px²';
                cardElement.querySelector('.perimeter-value').textContent = perimeter + ' px';
                break;
            case 'rectangle':
                cardElement.querySelector('.area-value').textContent = area + ' px²';
                cardElement.querySelector('.dimensions-value').textContent = 
                    Math.round(detection.width) + ' × ' + Math.round(detection.height) + ' px';
                break;
        }
        
        // Posicionar la tarjeta
        const cardX = (detection.x + detection.width + 10) * scaleX;
        const cardY = detection.y * scaleY;
        
        cardElement.style.left = Math.min(cardX, rect.width - 250) + 'px';
        cardElement.style.top = Math.max(10, cardY) + 'px';
        
        // Añadir al overlay
        this.arOverlay.appendChild(cardElement);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            if (cardElement.parentNode) {
                cardElement.parentNode.removeChild(cardElement);
            }
        }, 3000);
    }
    
    clearAROverlay() {
        while (this.arOverlay.firstChild) {
            this.arOverlay.removeChild(this.arOverlay.firstChild);
        }
    }
    
    updateTargetShape() {
        const shape = this.shapeSelect.value;
        const shapeInfo = this.shapeData[shape];
        this.updateDetectionInfo(`Buscando: ${shapeInfo.emoji} ${shapeInfo.name}`);
    }
    
    updateDetectionInfo(message) {
        this.detectionInfo.innerHTML = `<p>${message}</p>`;
    }
    
    resetUI() {
        this.startBtn.style.display = 'inline-block';
        this.stopBtn.style.display = 'none';
    }
    
    goBack() {
        this.stopAR();
        window.location.href = 'index.html';
    }
    
    showError(message) {
        this.updateDetectionInfo(`❌ ${message}`);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ARShapeDetector();
});

// Manejar cambios de orientación
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        const detector = window.arDetector;
        if (detector && detector.isRunning) {
            detector.setupCanvas();
        }
    }, 500);
});

// Prevenir que la pantalla se apague durante AR
let wakeLock = null;
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Screen wake lock activado');
        }
    } catch (err) {
        console.log('Wake lock no disponible:', err);
    }
}

// Activar wake lock cuando se inicie AR
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('startAR');
    if (startBtn) {
        startBtn.addEventListener('click', requestWakeLock);
    }
});
