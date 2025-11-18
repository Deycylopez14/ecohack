# 🚀 Deploy EcoHack PWA en Vercel

## ✅ **Pasos para deployment:**

### **Opción A: Deploy desde terminal (si tienes Vercel CLI)**

```bash
# 1. Instalar Vercel CLI (si no lo tienes)
npm install -g vercel

# 2. Login (si no estás logueado)
vercel login

# 3. Deploy
vercel --prod
```

### **Opción B: Deploy desde GitHub (Recomendado)**

1. **📤 Subir a GitHub:**
   ```bash
   git add .
   git commit -m "Agregar funcionalidad PWA con HTTPS"
   git push origin main
   ```

2. **🔗 Conectar Vercel:**
   - Ve a: https://vercel.com/dashboard
   - Clic en "Add New Project"
   - Importa tu repositorio `ecohack`
   - Vercel detectará automáticamente que es Vite

3. **⚙️ Configuración automática:**
   - Build Command: `npm run build:pwa` ✅
   - Output Directory: `dist` ✅  
   - Install Command: `npm install` ✅

4. **🚀 Deploy:**
   - Clic "Deploy"
   - ¡Espera 2-3 minutos!

## 🌟 **Una vez deployado:**

### **✅ Tu PWA tendrá:**
- 🔒 **HTTPS automático** (ej: `https://ecohack-tu-usuario.vercel.app`)
- 📱 **Instalación en cualquier dispositivo**
- ⚡ **Carga súper rápida** (CDN global)
- 🔄 **Actualizaciones automáticas** con cada push a GitHub

### **🎯 URLs importantes:**
- **App principal:** `https://tu-proyecto.vercel.app`
- **Instrucciones:** `https://tu-proyecto.vercel.app/install`
- **Manifest:** `https://tu-proyecto.vercel.app/manifest.webmanifest`

## 📱 **Probar PWA en Vercel:**

1. **🌐 Abre tu URL de Vercel en móvil**
2. **⏱️ Espera 3 segundos** - aparecerá botón verde de instalación
3. **📲 Android:** Banner "Agregar a pantalla de inicio" 
4. **🍎 iPhone:** Safari → Compartir → "Añadir a pantalla de inicio"

## 🔧 **Configuración avanzada:**

Si necesitas variables de ambiente:
1. Ve a Vercel Dashboard → Tu Proyecto → Settings → Environment Variables
2. Agrega tus variables (ej: VITE_SUPABASE_URL)

## 🎉 **¡Listo para producción!**

Tu PWA tendrá:
- ✅ HTTPS nativo
- ✅ Funcionalidad offline  
- ✅ Instalación en todos los dispositivos
- ✅ Performance optimizada
- ✅ SEO optimizado