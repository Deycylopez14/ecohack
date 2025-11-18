import React from 'react'
import { FiSmartphone, FiMonitor, FiDownload, FiShare, FiPlus } from 'react-icons/fi'

const InstallInstructions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <FiDownload className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Instala EcoHack en tu dispositivo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Accede rápidamente a EcoHack desde tu pantalla de inicio. Sin descargas de tiendas de apps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Móvil Android/Chrome */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <FiSmartphone className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Android / Chrome
              </h2>
            </div>
            
            <ol className="space-y-4 text-gray-700 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 text-green-600 rounded-full text-sm font-medium flex items-center justify-center">1</span>
                <span>Abre EcoHack en <strong>Chrome</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 text-green-600 rounded-full text-sm font-medium flex items-center justify-center">2</span>
                <span>Aparecerá un banner que dice <strong>"Instalar app"</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 text-green-600 rounded-full text-sm font-medium flex items-center justify-center">3</span>
                <span>Toca <strong>"Instalar"</strong> o el ícono <FiDownload className="inline w-4 h-4" /> en la barra de direcciones</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 text-green-600 rounded-full text-sm font-medium flex items-center justify-center">4</span>
                <span>¡Listo! EcoHack aparecerá en tu pantalla de inicio</span>
              </li>
            </ol>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Alternativa:</strong> Menú (⋮) → "Instalar aplicación" o "Añadir a pantalla de inicio"
              </p>
            </div>
          </div>

          {/* iPhone/Safari */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <FiSmartphone className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                iPhone / Safari
              </h2>
            </div>
            
            <ol className="space-y-4 text-gray-700 dark:text-gray-300">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 rounded-full text-sm font-medium flex items-center justify-center">1</span>
                <span>Abre EcoHack en <strong>Safari</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 rounded-full text-sm font-medium flex items-center justify-center">2</span>
                <span>Toca el botón <strong>Compartir</strong> <FiShare className="inline w-4 h-4" /> en la barra inferior</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 rounded-full text-sm font-medium flex items-center justify-center">3</span>
                <span>Desplázate y selecciona <strong>"Añadir a pantalla de inicio"</strong> <FiPlus className="inline w-4 h-4" /></span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 rounded-full text-sm font-medium flex items-center justify-center">4</span>
                <span>Confirma tocando <strong>"Añadir"</strong> en la esquina superior derecha</span>
              </li>
            </ol>

            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <strong>Importante:</strong> Esta función solo está disponible en Safari, no en Chrome para iOS
              </p>
            </div>
          </div>

          {/* Desktop */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <FiMonitor className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Computadora / Laptop
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Chrome</h3>
                <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>• Ícono <FiDownload className="inline w-4 h-4" /> en barra de direcciones</li>
                  <li>• Menú (⋮) → "Instalar EcoHack"</li>
                  <li>• Se abrirá como app independiente</li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Edge</h3>
                <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>• Ícono <FiPlus className="inline w-4 h-4" /> en barra de direcciones</li>
                  <li>• Menú (⋯) → "Apps" → "Instalar este sitio"</li>
                  <li>• Aparecerá en el menú de inicio</li>
                </ol>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Firefox</h3>
                <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>• Menú (☰) → "Instalar aplicación"</li>
                  <li>• O crear acceso directo manual</li>
                  <li>• Se abrirá en ventana independiente</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Beneficios */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            ¿Por qué instalar EcoHack?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Acceso rápido</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Un solo toque desde tu pantalla de inicio
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Experiencia nativa</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Se siente como una app normal del teléfono
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💾</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Funciona offline</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Accede a contenido básico sin internet
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            Volver a EcoHack
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstallInstructions