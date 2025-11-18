# 🚀 Guía de Deployment HTTPS para EcoHack PWA

## 🌟 Opciones de deployment gratuitas con HTTPS:

### 1. 📱 **Netlify** (Más fácil)
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Build tu app
npm run build:pwa

# Deploy
netlify deploy --prod --dir=dist
```

**Ventajas:**
✅ HTTPS automático
✅ PWA funciona perfectamente  
✅ URL personalizable
✅ Actualizaciones automáticas con Git

### 2. ⚡ **Vercel**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Build y deploy
npm run build:pwa
vercel --prod
```

### 3. 🐙 **GitHub Pages**
1. Sube tu código a GitHub
2. Ve a Settings → Pages
3. Selecciona source: GitHub Actions
4. Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy PWA to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm install
    - run: npm run build:pwa
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 4. 🌐 **Railway**
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway link
railway up
```

### 5. 🔄 **Firebase Hosting**
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Configurar
firebase login
firebase init hosting

# Deploy
npm run build:pwa
firebase deploy
```

## 🎯 **Para desarrollo local con HTTPS:**

### Método 1: ngrok (Recomendado)
1. Descarga: https://ngrok.com/download
2. Instala y autentica
3. `npm run serve`
4. En otra terminal: `ngrok http 3000`
5. ¡Usa la URL https que te da!

### Método 2: mkcert
```bash
# Instala mkcert: https://github.com/FiloSottile/mkcert
# Luego:
mkcert -install
mkcert localhost 127.0.0.1 ::1
# Configura Vite para usar los certificados
```

## 📱 **Test de PWA:**
Una vez con HTTPS, verifica en:
- Chrome DevTools → Application → Manifest
- Chrome DevTools → Application → Service Workers
- Lighthouse → PWA audit

## 💡 **Tip:**
Para pruebas rápidas, `localhost` también permite PWA en la mayoría de navegadores, aunque sin algunas funciones avanzadas.