# 🎯 Cómo Configurar Formas Personalizadas

## 📝 **Instrucciones Rápidas**

1. **Abre el archivo:** `custom-shapes.js`
2. **Busca la sección:** `this.customShapes = {`
3. **Agrega tus formas** siguiendo el formato de ejemplo
4. **Guarda y sube** a GitHub

## 🔧 **Formato de Configuración**

```javascript
this.customShapes = {
    "nombre_unico": {
        name: "Nombre que aparece",
        emoji: "🎯", 
        color: "#ff6b6b",
        info: "Información opcional"
    },
    "otra_forma": {
        name: "Segunda Forma",
        emoji: "⭐",
        color: "#4ecdc4"
    }
};
```

## 🎨 **Ejemplos de Formas Personalizadas**

### **Para una Empresa:**
```javascript
"logo_empresa": {
    name: "Logo Empresa",
    emoji: "🏢",
    color: "#2ecc71",
    info: "¡Logo detectado!"
},
"producto": {
    name: "Mi Producto", 
    emoji: "📱",
    color: "#e74c3c"
}
```

### **Para Educación:**
```javascript
"libro": {
    name: "Libro",
    emoji: "📚",
    color: "#3498db"
},
"formula": {
    name: "Fórmula",
    emoji: "🧮", 
    color: "#9b59b6"
}
```

### **Para Arte/Diseño:**
```javascript
"pintura": {
    name: "Obra de Arte",
    emoji: "🎨",
    color: "#f39c12"
},
"escultura": {
    name: "Escultura",
    emoji: "🗿",
    color: "#95a5a6"
}
```

## 🌈 **Colores Disponibles**

- **Rojo:** `#e74c3c`
- **Verde:** `#2ecc71` 
- **Azul:** `#3498db`
- **Amarillo:** `#f1c40f`
- **Morado:** `#9b59b6`
- **Naranja:** `#e67e22`
- **Rosa:** `#e91e63`
- **Cyan:** `#1abc9c`

## 📱 **Emojis Recomendados**

- **Objetos:** 📱📺💻⌚🎮🎯🎪
- **Formas:** ⭐🔷🔶🔸🔹⬛⬜🟩🟦🟪🟨
- **Símbolos:** 🚀⚡💡🔥💎🏆🎨🎭
- **Naturaleza:** 🌟🌙☀️🌈🍃🌺🦋

## 🔄 **Cómo Actualizar**

1. **Edita** `custom-shapes.js`
2. **Guarda** los cambios
3. **Sube a GitHub:**
   ```bash
   git add .
   git commit -m "Agregadas formas personalizadas"
   git push
   ```
4. **¡La app se actualiza automáticamente!**

## 🎯 **Ejemplo Completo**

```javascript
this.customShapes = {
    "mi_logo": {
        name: "Mi Logo",
        emoji: "🚀",
        color: "#e74c3c",
        info: "¡Genial! Logo detectado"
    },
    "codigo_qr": {
        name: "Código QR",
        emoji: "📱",
        color: "#2ecc71",
        info: "QR Code encontrado"
    },
    "tarjeta": {
        name: "Tarjeta",
        emoji: "💳",
        color: "#3498db"
    }
};
```

## ⚠️ **Importante**

- Usa **nombres únicos** para cada forma
- Los emojis son **opcionales** (se usa 🔸 por defecto)
- Los colores deben estar en formato **hexadecimal** (#rrggbb)
- **No olvides las comas** entre elementos

## 🆘 **¿Necesitas Ayuda?**

Si tienes problemas:
1. Revisa que la sintaxis sea correcta
2. Verifica que no falten comas
3. Asegúrate de que los nombres sean únicos
4. Comprueba que los colores estén en formato correcto

¡Tu aplicación AR ahora puede detectar cualquier forma que configures! 🎉
