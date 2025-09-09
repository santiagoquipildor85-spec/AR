# 📥 Guía para Instalar Git en Windows

## Método 1: Descarga Directa

1. **Abre tu navegador web**
2. **Ve a:** https://git-scm.com/download/win
3. **Se descargará automáticamente** un archivo llamado algo como: `Git-2.42.0.2-64-bit.exe`
4. **Ejecuta el archivo descargado**
5. **Instala con configuración por defecto:**
   - Clic en "Next" en todas las pantallas
   - Clic en "Install"
   - Clic en "Finish"

## Método 2: GitHub Desktop (Más Fácil)

1. **Ve a:** https://desktop.github.com/
2. **Descarga GitHub Desktop**
3. **Instala y abre la aplicación**
4. **Inicia sesión con tu cuenta de GitHub**
5. **Agrega tu repositorio local:**
   - File → Add Local Repository
   - Selecciona: `C:\Users\Administrador\Desktop\git hub`

## Después de la Instalación

### Si instalaste Git:
```bash
# Abre una nueva ventana de CMD y ejecuta:
cd "C:\Users\Administrador\Desktop\git hub"
git init
git add .
git commit -m "Initial commit: Realidad Aumentada"
git remote add origin https://github.com/TU-USUARIO/realidad-aumentada.git
git push -u origin main
```

### Si usas GitHub Desktop:
1. Selecciona todos los archivos en la app
2. Escribe mensaje: "Initial commit: Realidad Aumentada"
3. Clic en "Commit to main"
4. Clic en "Push origin"

## ✅ Verificar que funciona

Después de cualquier método, ve a tu repositorio en GitHub y deberías ver todos tus archivos listados.
