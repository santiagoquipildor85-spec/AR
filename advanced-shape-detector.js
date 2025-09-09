// Sistema Avanzado de Detección Múltiple con Tracking Perfecto
class AdvancedShapeDetector {
    constructor() {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.arOverlay = document.getElementById('arOverlay');
        
        // Sistema de tracking avanzado
        this.trackedShapes = new Map(); // ID -> datos de forma
        this.shapeIdCounter = 0;
        this.trackingHistory = new Map(); // ID -> historial de posiciones
        
        // Configuración de sensibilidad
        this.sensitivity = {
            contrastThreshold: 80,    // Umbral de contraste
            areaMinSize: 1000,        // Área mínima de forma
            areaMaxSize: 50000,       // Área máxima de forma
            confidenceThreshold: 0.7, // Confianza mínima
            trackingTolerance: 50     // Tolerancia para tracking
        };
        
        // Templates de formas personalizadas
        this.customShapes = {};
        this.loadCustomShapes();
        
        this.init();
    }
    
    init() {
        console.log('Sistema avanzado de detección inicializado');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Eventos del sistema principal
        const statusIndicator = document.getElementById('statusIndicator');
        const backBtn = document.getElementById('backBtn');
        
        if (statusIndicator) {
            statusIndicator.addEventListener('click', () => this.toggleDetection());
        }
        if (backBtn) {
            backBtn.addEventListener('click', () => this.goBack());
        }
    }
    
    // Cargar formas personalizadas
    loadCustomShapes() {
        this.customShapes = {
            "forma_L": {
                name: "Forma L",
                emoji: "🔲",
                color: "#e74c3c",
                text: "Forma L detectada",
                pattern: this.createLPattern(),
                sensitivity: 0.8
            },
            "forma_T": {
                name: "Forma T", 
                emoji: "🔳",
                color: "#3498db",
                text: "Forma T detectada",
                pattern: this.createTPattern(),
                sensitivity: 0.8
            },
            "forma_cruz": {
                name: "Cruz",
                emoji: "✚",
                color: "#2ecc71", 
                text: "Cruz detectada",
                pattern: this.createCrossPattern(),
                sensitivity: 0.8
            }
        };
        
        console.log(`${Object.keys(this.customShapes).length} formas personalizadas cargadas`);
    }
    
    // Crear patrones de formas (representación simplificada)
    createLPattern() {
        return {
            type: 'L_shape',
            description: 'Forma L con dos rectángulos perpendiculares',
            detectFunction: (contours) => this.detectLShape(contours)
        };
    }
    
    createTPattern() {
        return {
            type: 'T_shape', 
            description: 'Forma T con rectángulo horizontal y vertical',
            detectFunction: (contours) => this.detectTShape(contours)
        };
    }
    
    createCrossPattern() {
        return {
            type: 'cross_shape',
            description: 'Cruz con dos rectángulos que se cruzan',
            detectFunction: (contours) => this.detectCrossShape(contours)
        };
    }
    
    // Detección principal
    async toggleDetection() {
        if (this.isRunning) {
            this.stopDetection();
        } else {
            await this.startDetection();
        }
    }
    
    async startDetection() {
        try {
            this.updateStatus('Iniciando detección avanzada...', 'detecting');
            
            // Configuración optimizada de cámara
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    frameRate: { ideal: 30 }
                }
            });
            
            this.video.srcObject = this.stream;
            this.video.play();
            
            this.video.addEventListener('loadedmetadata', () => {
                setTimeout(() => {
                    this.setupAdvancedCanvas();
                    this.isRunning = true;
                    this.detectShapesLoop();
                    this.updateStatus('Detectando formas múltiples...', 'active');
                }, 500);
            });
            
        } catch (error) {
            console.error('Error iniciando detección:', error);
            this.updateStatus('Error: ' + error.message, 'ready');
        }
    }
    
    setupAdvancedCanvas() {
        this.canvas.width = this.video.videoWidth || 1280;
        this.canvas.height = this.video.videoHeight || 720;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
    }
    
    // Loop principal de detección
    detectShapesLoop() {
        if (!this.isRunning) return;
        
        try {
            // Capturar frame
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            
            // Detectar todas las formas
            const detectedShapes = this.detectAllShapes(imageData);
            
            // Actualizar tracking
            this.updateTracking(detectedShapes);
            
            // Mostrar resultados
            this.renderTrackedShapes();
            
            // Actualizar estado
            const count = this.trackedShapes.size;
            if (count > 0) {
                this.updateStatus(`${count} forma(s) rastreada(s)`, 'detecting');
            } else {
                this.updateStatus('Buscando formas...', 'active');
            }
            
        } catch (error) {
            console.error('Error en detección:', error);
        }
        
        // Continuar loop
        if (this.isRunning) {
            this.animationId = requestAnimationFrame(() => this.detectShapesLoop());
        }
    }
    
    // Detectar todas las formas en paralelo
    detectAllShapes(imageData) {
        const detections = [];
        
        // Preprocesamiento de imagen
        const processedData = this.preprocessImage(imageData);
        
        // Detectar cada tipo de forma
        Object.entries(this.customShapes).forEach(([shapeId, shapeConfig]) => {
            const shapeDetections = this.detectSpecificShape(processedData, shapeId, shapeConfig);
            detections.push(...shapeDetections);
        });
        
        return detections;
    }
    
    // Preprocesamiento para mejor detección
    preprocessImage(imageData) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        // Convertir a escala de grises y aplicar umbral
        const processed = new Uint8Array(width * height);
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1]; 
            const b = data[i + 2];
            
            // Escala de grises
            const gray = (r + g + b) / 3;
            
            // Umbral binario
            const pixelIndex = i / 4;
            processed[pixelIndex] = gray > this.sensitivity.contrastThreshold ? 255 : 0;
        }
        
        return {
            data: processed,
            width: width,
            height: height
        };
    }
    
    // Detectar forma específica
    detectSpecificShape(processedData, shapeId, shapeConfig) {
        const detections = [];
        
        try {
            // Buscar contornos candidatos
            const contours = this.findContours(processedData);
            
            // Aplicar función de detección específica
            const matches = shapeConfig.pattern.detectFunction(contours);
            
            matches.forEach(match => {
                if (match.confidence >= shapeConfig.sensitivity) {
                    detections.push({
                        id: `${shapeId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        type: shapeId,
                        config: shapeConfig,
                        x: match.x,
                        y: match.y,
                        width: match.width,
                        height: match.height,
                        confidence: match.confidence,
                        timestamp: Date.now()
                    });
                }
            });
            
        } catch (error) {
            console.error(`Error detectando ${shapeId}:`, error);
        }
        
        return detections;
    }
