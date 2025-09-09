// Escáner QR con ZXing
class QRScanner {
    constructor() {
        this.video = document.getElementById('video');
        this.startBtn = document.getElementById('startScan');
        this.stopBtn = document.getElementById('stopScan');
        this.resultDiv = document.getElementById('result');
        this.qrDataElement = document.getElementById('qr-data');
        this.goToARBtn = document.getElementById('goToAR');
        
        this.codeReader = null;
        this.stream = null;
        this.isScanning = false;
        
        this.init();
        this.generateTestQR();
    }
    
    init() {
        // Inicializar ZXing
        this.codeReader = new ZXing.BrowserQRCodeReader();
        
        // Event listeners
        this.startBtn.addEventListener('click', () => this.startScanning());
        this.stopBtn.addEventListener('click', () => this.stopScanning());
        this.goToARBtn.addEventListener('click', () => this.goToAR());
        
        console.log('QR Scanner inicializado');
    }
    
    async startScanning() {
        try {
            this.startBtn.style.display = 'none';
            this.stopBtn.style.display = 'inline-block';
            this.resultDiv.style.display = 'none';
            
            // Obtener lista de dispositivos de video
            const videoInputDevices = await this.codeReader.listVideoInputDevices();
            
            if (videoInputDevices.length === 0) {
                throw new Error('No se encontraron cámaras disponibles');
            }
            
            // Usar la primera cámara disponible (generalmente la trasera en móviles)
            const selectedDeviceId = videoInputDevices[0].deviceId;
            
            console.log('Iniciando escáner con dispositivo:', selectedDeviceId);
            
            // Configurar el video
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: selectedDeviceId,
                    facingMode: 'environment', // Preferir cámara trasera
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            });
            
            this.video.srcObject = this.stream;
            this.video.play();
            
            this.isScanning = true;
            this.scanForQR();
            
        } catch (error) {
            console.error('Error al iniciar el escáner:', error);
            this.showError('Error al acceder a la cámara: ' + error.message);
            this.resetUI();
        }
    }
    
    async scanForQR() {
        if (!this.isScanning) return;
        
        try {
            const result = await this.codeReader.decodeOnceFromVideoDevice(undefined, this.video);
            
            if (result) {
                console.log('QR detectado:', result.text);
                this.onQRDetected(result.text);
                return;
            }
        } catch (error) {
            // Si no se detecta QR, continuar escaneando
            if (this.isScanning) {
                setTimeout(() => this.scanForQR(), 100);
            }
        }
        
        // Continuar escaneando si no se encontró código
        if (this.isScanning) {
            setTimeout(() => this.scanForQR(), 100);
        }
    }
    
    onQRDetected(qrData) {
        console.log('Código QR detectado:', qrData);
        
        // Mostrar resultado
        this.qrDataElement.textContent = qrData;
        this.resultDiv.style.display = 'block';
        
        // Detener escáner
        this.stopScanning();
        
        // Si el QR contiene la URL de AR, habilitar el botón
        if (qrData.includes('ar.html') || qrData.includes('realidad-aumentada')) {
            this.goToARBtn.style.display = 'inline-block';
        }
        
        // Vibración en dispositivos móviles
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }
        
        // Auto-redirección después de 3 segundos
        setTimeout(() => {
            if (qrData.includes('ar.html') || qrData.includes('realidad-aumentada')) {
                this.goToAR();
            }
        }, 3000);
    }
    
    stopScanning() {
        this.isScanning = false;
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        if (this.video.srcObject) {
            this.video.srcObject = null;
        }
        
        this.resetUI();
        console.log('Escáner detenido');
    }
    
    resetUI() {
        this.startBtn.style.display = 'inline-block';
        this.stopBtn.style.display = 'none';
    }
    
    goToAR() {
        // Redireccionar a la página de AR
        window.location.href = 'ar.html';
    }
    
    showError(message) {
        this.resultDiv.style.display = 'block';
        this.resultDiv.innerHTML = `
            <h3>❌ Error</h3>
            <p>${message}</p>
            <button onclick="location.reload()" class="btn-primary">Reintentar</button>
        `;
    }
    
    generateTestQR() {
        // Generar QR de prueba que apunte a la página AR
        const qrContainer = document.getElementById('qrcode');
        const currentDomain = window.location.origin + window.location.pathname.replace('index.html', '');
        const arUrl = currentDomain + 'ar.html';
        
        if (window.QRCode && qrContainer) {
            QRCode.toCanvas(qrContainer, arUrl, {
                width: 200,
                height: 200,
                colorDark: '#333',
                colorLight: '#fff',
                margin: 2,
                errorCorrectionLevel: 'M'
            }, function (error) {
                if (error) {
                    console.error('Error generando QR:', error);
                    qrContainer.innerHTML = '<p>Error generando código QR</p>';
                } else {
                    console.log('QR generado exitosamente para:', arUrl);
                }
            });
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new QRScanner();
});

// Manejar errores globales
window.addEventListener('error', (event) => {
    console.error('Error global:', event.error);
});

// Manejar cambios de orientación en móviles
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        // Reajustar el video si está activo
        const video = document.getElementById('video');
        if (video && video.srcObject) {
            video.style.height = window.innerHeight < window.innerWidth ? '250px' : '300px';
        }
    }, 500);
});
