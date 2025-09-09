# 🚀 Configuración de GitHub Pages

## Pasos para configurar tu proyecto en GitHub Pages

### 1. Crear Repositorio en GitHub

1. Ve a [GitHub.com](https://github.com) e inicia sesión
2. Haz clic en "New repository" (Nuevo repositorio)
3. Nombra tu repositorio: `realidad-aumentada` (o el nombre que prefieras)
4. Asegúrate de que sea **público**
5. **NO inicialices** con README, .gitignore o licencia (ya los tenemos)
6. Haz clic en "Create repository"

### 2. Subir el Proyecto

**IMPORTANTE:** Estos comandos se ejecutan en la carpeta donde están todos tus archivos AR.

#### **2.1 Abrir Terminal/Línea de Comandos**
- **Windows:** Presiona `Win + R`, escribe `cmd` y presiona Enter
- **Mac:** Presiona `Cmd + Espacio`, escribe `Terminal` y presiona Enter
- **Alternativa:** Abre tu explorador de archivos, ve a la carpeta del proyecto, clic derecho y "Abrir terminal aquí"

#### **2.2 Navegar a tu carpeta del proyecto**
```bash
# Si no estás en la carpeta correcta, navega hasta ella
cd "C:\Users\Administrador\Desktop\git hub"
```

#### **2.3 Ejecutar comandos uno por uno**

**Comando 1:** Preparar Git en tu carpeta
```bash
git init
```
*Esto convierte tu carpeta en un repositorio Git local*

**Comando 2:** Agregar todos los archivos
```bash
git add .
```
*Esto prepara todos tus archivos para ser subidos*

**Comando 3:** Crear el primer "commit" (guardar cambios)
```bash
git commit -m "Initial commit: Realidad Aumentada con QR y detección de formas"
```
*Esto guarda todos los archivos con un mensaje descriptivo*

**Comando 4:** Conectar con GitHub (IMPORTANTE: cambia TU-USUARIO)
```bash
git remote add origin https://github.com/TU-USUARIO/realidad-aumentada.git
```
*Ejemplo real: `git remote add origin https://github.com/juanperez/realidad-aumentada.git`*

**Comando 5:** Subir todo a GitHub
```bash
git push -u origin main
```
*Esto sube todos tus archivos al repositorio en GitHub*

#### **2.4 ¿Qué esperar?**
- Te pedirá tu usuario y contraseña de GitHub
- Verás mensajes indicando que se están subiendo archivos
- Al final dirá algo como "100% complete" o "done"

### 3. Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** (Configuración)
3. Desplázate hacia abajo hasta la sección **Pages**
4. En "Source", selecciona **Deploy from a branch**
5. En "Branch", selecciona **main**
6. En "Folder", deja **/ (root)**
7. Haz clic en **Save**

### 4. Configurar el Dominio (Opcional)

Si tienes un dominio personalizado:

1. En la sección Pages, agrega tu dominio en "Custom domain"
2. Habilita "Enforce HTTPS"

### 5. URLs de Acceso

Una vez configurado, tu aplicación estará disponible en:

- **URL principal**: `https://TU-USUARIO.github.io/realidad-aumentada/`
- **Escáner QR**: `https://TU-USUARIO.github.io/realidad-aumentada/index.html`
- **Realidad Aumentada**: `https://TU-USUARIO.github.io/realidad-aumentada/ar.html`

### 6. Verificar Funcionamiento

1. **Espera 5-10 minutos** para que GitHub Pages se active
2. Visita la URL de tu aplicación
3. Prueba el escáner QR desde un dispositivo móvil
4. Verifica que la realidad aumentada funcione correctamente

### 7. Actualizaciones Futuras

Para hacer cambios:

```bash
# Hacer cambios en tu código
# Agregar cambios
git add .

# Commit
git commit -m "Descripción de los cambios"

# Subir
git push
```

Los cambios se reflejarán automáticamente en GitHub Pages en 1-2 minutos.

## 🔧 Solución de Problemas

### La página no carga
- Verifica que GitHub Pages esté activado en Settings > Pages
- Asegúrate de que el repositorio sea público
- Espera unos minutos para la propagación

### Los permisos de cámara no funcionan
- GitHub Pages requiere HTTPS (que se activa automáticamente)
- Algunos navegadores pueden requerir permisos adicionales

### El QR Scanner no funciona
- Verifica que las bibliotecas externas se carguen correctamente
- Prueba en diferentes navegadores

## 📱 Compartir tu Aplicación

Una vez funcionando, puedes:

1. **Generar código QR** apuntando a tu URL de GitHub Pages
2. **Compartir el enlace** directo
3. **Embedar** en otras páginas web
4. **Promocionar** en redes sociales

## 🎉 ¡Listo!

Tu aplicación de realidad aumentada ya está en línea y funcionando. ¡Compártela con el mundo!
