# 🌟 Realidad Aumentada con Detector de Formas

Una aplicación web de realidad aumentada que permite escanear códigos QR y detectar formas geométricas en tiempo real desde el navegador.

## 🚀 Características

- **Escáner QR**: Escanea códigos QR para acceder a la experiencia AR
- **Detección de Formas**: Reconoce círculos, cuadrados, triángulos y rectángulos
- **Información Flotante**: Muestra datos interactivos sobre cada forma detectada
- **Responsive**: Funciona en dispositivos móviles y de escritorio
- **Sin Instalación**: Funciona directamente desde el navegador

## 🎯 Cómo Usar

1. **Escanear QR**: 
   - Abre la página principal
   - Presiona "Iniciar Escáner"
   - Escanea el código QR proporcionado

2. **Realidad Aumentada**:
   - Serás dirigido automáticamente a la experiencia AR
   - Presiona "Iniciar Cámara AR"
   - Apunta hacia objetos con formas geométricas
   - Observa la información flotante que aparece

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura de la aplicación
- **CSS3**: Estilos modernos y responsive
- **JavaScript ES6+**: Lógica de la aplicación
- **WebRTC**: Acceso a la cámara
- **ZXing**: Biblioteca para escaneo QR
- **OpenCV.js**: Procesamiento de imágenes (opcional)
- **GitHub Pages**: Hosting gratuito

## 📱 Compatibilidad

- ✅ Chrome (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Dispositivos móviles Android/iOS

## 🔧 Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/realidad-aumentada.git

# Navegar al directorio
cd realidad-aumentada

# Abrir con un servidor local
# Opción 1: Python
python -m http.server 8000

# Opción 2: Node.js
npx serve .

# Abrir en el navegador
http://localhost:8000
```

## 🌐 Demo en Vivo

Visita: [https://tu-usuario.github.io/realidad-aumentada/](https://tu-usuario.github.io/realidad-aumentada/)

## 📸 Capturas de Pantalla

### Escáner QR
![Escáner QR](screenshots/qr-scanner.png)

### Realidad Aumentada
![AR Detector](screenshots/ar-detector.png)

## 🔒 Permisos Requeridos

- **Cámara**: Para escanear QR y detectar formas
- **Micrófono**: No requerido (se puede denegar)

## 🚨 Solución de Problemas

### La cámara no funciona
- Verifica que el navegador tenga permisos para acceder a la cámara
- Usa HTTPS (requerido para WebRTC)
- Prueba con un navegador diferente

### No se detectan formas
- Asegúrate de que haya buena iluminación
- Mantén la cámara estable
- Prueba con objetos de formas simples y bien definidas

### El escáner QR no funciona
- Verifica que el código QR esté bien enfocado
- Prueba con mejor iluminación
- Asegúrate de que el QR no esté dañado

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu función (`git checkout -b nueva-funcion`)
3. Commit tus cambios (`git commit -am 'Agregar nueva función'`)
4. Push a la rama (`git push origin nueva-funcion`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

Creado con ❤️ para demostrar las capacidades de la realidad aumentada en el navegador.

## 🙏 Agradecimientos

- [ZXing](https://github.com/zxing-js/library) - Biblioteca de escaneo QR
- [OpenCV.js](https://opencv.org/opencv-js/) - Procesamiento de imágenes
- [QRCode.js](https://github.com/davidshimjs/qrcodejs) - Generación de códigos QR

---

⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub!
