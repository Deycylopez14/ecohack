import React, { useState, useEffect } from 'react';
import { FiDownload, FiX, FiSmartphone, FiMonitor, FiInstagram } from 'react-icons/fi';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showManualButton, setShowManualButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Detectar si ya está instalada
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Mostrar botón manual después de 3 segundos si no hay prompt automático
    const manualTimer = setTimeout(() => {
      if (!deferredPrompt && !standalone) {
        setShowManualButton(true);
      }
    }, 3000);

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Mostrar prompt después de un delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      clearTimeout(manualTimer);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuario aceptó la instalación');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
    setShowManualButton(false);
  };

  const handleManualInstall = () => {
    // Mostrar instrucciones manuales
    alert(`Para instalar EcoHack:

🔹 CHROME/EDGE:
1. Busca el ícono ⚙️ en la barra de direcciones
2. O ve al Menú (⋮) → "Instalar EcoHack"

🔹 FIREFOX:
1. Menú (☰) → "Instalar aplicación"

🔹 MÓVIL - ANDROID:
1. Menú de Chrome → "Añadir a pantalla de inicio"

🔹 MÓVIL - IPHONE:
1. Safari → Compartir → "Añadir a pantalla de inicio"

🔹 ALTERNATIVA:
Visita /install para ver guía completa`);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowManualButton(false);
    localStorage.setItem('installPromptDismissed', Date.now().toString());
  };

  // No mostrar si ya está instalada
  if (isStandalone) return null;

  // Verificar si fue rechazada en las últimas 24 horas
  const dismissedTime = localStorage.getItem('installPromptDismissed');
  if (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
    return null;
  }

  // Mostrar prompt automático si está disponible
  if (showPrompt && deferredPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <FiDownload className="w-5 h-5 text-green-600" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                ¡Instala EcoHack!
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Accede rápido desde tu pantalla de inicio
              </p>
              
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleInstallClick}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-md font-medium transition-colors"
                >
                  Instalar
                </button>
                
                <button
                  onClick={handleDismiss}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-md font-medium transition-colors"
                >
                  Ahora no
                </button>
              </div>
            </div>
            
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <FiX className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar botón manual si no hay prompt automático
  if (showManualButton) {
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <button
          onClick={handleManualInstall}
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
          title="Instalar EcoHack como app"
        >
          <FiDownload className="w-5 h-5" />
        </button>
        
        <div className="absolute bottom-full right-0 mb-2 w-48 bg-black text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          ¡Instala EcoHack en tu dispositivo!
        </div>
      </div>
    );
  }

  return null;
};

export default InstallPrompt;