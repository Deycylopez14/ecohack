import React from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Importar la nueva base de datos completa y servicios
import { 
  CENTROS_RECICLAJE_MEXICO, 
  ESTADOS_MEXICO, 
  COORDENADAS_ESTADOS,
  obtenerCentrosPorEstado,
  buscarCentros
} from '../data/centrosReciclajeMexico'
import { detectorUbicacion, UbicacionDetectada } from '../utils/detectorUbicacion'
import { obtenerCentrosCombinados } from '../services/apisOficiales'

// Base de datos expandida de centros por estado/ciudad (mantenemos la anterior como fallback)
const centrosPorEstadoLegacy: { [key: string]: any[] } = {
  // Chiapas - Tuxtla Gutiérrez y otras ciudades
  "Chiapas": [
    {
      id: 101,
      name: 'Recicladora Juanjo',
      coords: [16.7569, -93.1292] as [number, number],
      type: 'Comercial',
      materials: ['Metal', 'Aluminio', 'Cobre', 'Fierro', 'Chatarra'],
      address: 'Calz. Emiliano Zapata 238, Tuxtla Gutiérrez',
      hours: 'Lun-Sab: 8:00-17:00',
      phone: '961 349 0981',
      description: 'Centro especializado en compra y reciclaje de metales',
      ciudad: 'Tuxtla Gutiérrez'
    },
    {
      id: 102,
      name: 'Reciclaje Innovacion Y Transformacion De Polimeros',
      coords: [16.7489, -93.1402] as [number, number],
      type: 'Centro',
      materials: ['Plásticos', 'Polímeros', 'PET', 'HDPE'],
      address: 'Av. Gardenias 576, Tuxtla Gutiérrez',
      hours: 'Lun-Vie: 9:00-18:00',
      phone: '961 XXX XXXX',
      description: 'Especialistas en transformación y reciclaje de polímeros',
      ciudad: 'Tuxtla Gutiérrez'
    },
    {
      id: 103,
      name: 'PACSUR Centro Reciclaje',
      coords: [16.7319, -93.1189] as [number, number],
      type: 'Público',
      materials: ['Papel', 'Cartón', 'Plástico', 'Vidrio'],
      address: 'Libramiento Sur Ote 4445, Tuxtla Gutiérrez',
      hours: 'Lun-Sab: 7:00-16:00',
      phone: '961 347 7998',
      description: 'Centro de acopio con múltiples tipos de materiales',
      ciudad: 'Tuxtla Gutiérrez'
    },
    {
      id: 104,
      name: 'Reciclaje de Plásticos Chiapas',
      coords: [16.7429, -93.1352] as [number, number],
      type: 'Comercial',
      materials: ['Plástico PET', 'Bolsas', 'Envases', 'Tapas'],
      address: 'Zona Industrial, Tuxtla Gutiérrez',
      hours: 'Lun-Vie: 8:00-17:00',
      phone: '961 XXX XXXX',
      description: 'Especializado en reciclaje de todo tipo de plásticos',
      ciudad: 'Tuxtla Gutiérrez'
    },
    {
      id: 105,
      name: 'Centro Verde Chiapas',
      coords: [16.7569, -93.1092] as [number, number],
      type: 'Público',
      materials: ['Orgánicos', 'Compostaje', 'Papel', 'Cartón'],
      address: 'Blvd. Belisario Domínguez 1234, Tuxtla Gutiérrez',
      hours: 'Mar-Dom: 8:00-16:00',
      phone: '961 123 4567',
      description: 'Centro público con programa de compostaje',
      ciudad: 'Tuxtla Gutiérrez'
    },
    // Tapachula, Chiapas
    {
      id: 106,
      name: 'Recicladora Fronteriza',
      coords: [14.9067, -92.2627] as [number, number],
      type: 'Comercial',
      materials: ['Metal', 'Cobre', 'Aluminio', 'Fierro'],
      address: 'Av. Central Norte 567, Tapachula',
      hours: 'Lun-Sab: 7:00-17:00',
      phone: '962 XXX XXXX',
      description: 'Recicladora especializada en metales',
      ciudad: 'Tapachula'
    },
    // San Cristóbal de las Casas
    {
      id: 107,
      name: 'EcoCentro San Cristóbal',
      coords: [16.7370, -92.6376] as [number, number],
      type: 'Centro',
      materials: ['Papel', 'Cartón', 'Vidrio', 'Plástico', 'Textiles'],
      address: 'Real de Guadalupe 234, San Cristóbal de las Casas',
      hours: 'Lun-Vie: 9:00-17:00',
      phone: '967 XXX XXXX',
      description: 'Centro ecológico con enfoque turístico',
      ciudad: 'San Cristóbal de las Casas'
    }
  ],

  // Ciudad de México - Expandida
  "Ciudad de México": [
    {
      id: 1,
      name: 'Centro de Reciclaje Municipal Centro',
      coords: [19.4326, -99.1332] as [number, number],
      type: 'Público',
      materials: ['Papel', 'Cartón', 'Plástico', 'Vidrio', 'Metal'],
      address: 'Av. Juárez #123, Centro Histórico',
      hours: 'Lun-Vie: 8:00-18:00, Sab: 9:00-14:00',
      phone: '55-1234-5678',
      description: 'Centro municipal con todas las facilidades para reciclaje',
      ciudad: 'Ciudad de México'
    },
    {
      id: 2,
      name: 'ECOCE - Centro de Acopio Santa Fe',
      coords: [19.3910, -99.2837] as [number, number],
      type: 'Verificado',
      materials: ['Plástico PET', 'HDPE', 'LDPE'],
      address: 'Av. Santa Fe 495, Lomas de Santa Fe',
      hours: 'Lun-Vie: 9:00-17:00',
      phone: '55-5292-7832',
      description: 'Centro oficial de ECOCE para reciclaje de plásticos',
      ciudad: 'Ciudad de México'
    },
    {
      id: 3,
      name: 'EcoPunto Roma Norte',
      coords: [19.4170, -99.1677] as [number, number],
      type: 'Comercial',
      materials: ['Electrónicos', 'Pilas', 'Plástico', 'Papel'],
      address: 'Álvaro Obregón #45, Roma Norte',
      hours: 'Lun-Dom: 10:00-20:00',
      phone: '55-9876-5432',
      description: 'Especializado en residuos electrónicos y pilas',
      ciudad: 'Ciudad de México'
    },
    {
      id: 4,
      name: 'Centro Verde Polanco',
      coords: [19.4370, -99.1920] as [number, number],
      type: 'Centro',
      materials: ['Orgánicos', 'Cartón', 'Vidrio', 'Textiles'],
      address: 'Masaryk #280, Polanco',
      hours: 'Mar-Dom: 9:00-19:00',
      phone: '55-5555-1234',
      description: 'Centro especializado en compostaje y textiles',
      ciudad: 'Ciudad de México'
    },
    {
      id: 5,
      name: 'SEDEMA - Mercado de Trueque Zócalo',
      coords: [19.4326, -99.1332] as [number, number],
      type: 'Verificado',
      materials: ['Papel', 'Cartón', 'Vidrio', 'Plástico', 'Metal'],
      address: 'Zócalo, Centro Histórico',
      hours: 'Sab: 8:00-14:00',
      phone: '55-1111-2222',
      description: 'Mercado de trueque oficial del gobierno de la CDMX',
      ciudad: 'Ciudad de México'
    },
    {
      id: 6,
      name: 'Recicladora Iztapalapa',
      coords: [19.3467, -99.0667] as [number, number],
      type: 'Público',
      materials: ['Metal', 'Aluminio', 'Fierro', 'Cobre'],
      address: 'Av. Tláhuac 1234, Iztapalapa',
      hours: 'Lun-Sab: 7:00-16:00',
      phone: '55-2222-3333',
      description: 'Centro de acopio público especializado en metales',
      ciudad: 'Ciudad de México'
    }
  ],

  // Jalisco - Guadalajara y zona metropolitana
  "Jalisco": [
    {
      id: 201,
      name: 'Centro de Acopio Guadalajara',
      coords: [20.6597, -103.3496] as [number, number],
      type: 'Público',
      materials: ['Papel', 'Cartón', 'Plástico', 'Vidrio', 'Metal'],
      address: 'Av. Revolución 1234, Guadalajara',
      hours: 'Lun-Vie: 8:00-17:00',
      phone: '33-1234-5678',
      description: 'Centro municipal de reciclaje de Guadalajara',
      ciudad: 'Guadalajara'
    },
    {
      id: 202,
      name: 'EcoParque Zapopan',
      coords: [20.7167, -103.3667] as [number, number],
      type: 'Centro',
      materials: ['Electrónicos', 'Pilas', 'Aceite', 'Llantas'],
      address: 'Av. López Mateos Norte 567, Zapopan',
      hours: 'Mar-Dom: 9:00-18:00',
      phone: '33-8765-4321',
      description: 'Centro especializado en residuos especiales',
      ciudad: 'Zapopan'
    },
    {
      id: 203,
      name: 'Recicladora Tlaquepaque',
      coords: [20.6397, -103.3136] as [number, number],
      type: 'Comercial',
      materials: ['Vidrio', 'Cerámica', 'Papel', 'Cartón'],
      address: 'Av. Niños Héroes 890, Tlaquepaque',
      hours: 'Lun-Sab: 8:00-17:00',
      phone: '33-4567-8901',
      description: 'Especializada en vidrio y materiales cerámicos',
      ciudad: 'Tlaquepaque'
    }
  ],

  // Nuevo León - Monterrey y área metropolitana
  "Nuevo León": [
    {
      id: 301,
      name: 'EcoParque Monterrey',
      coords: [25.6866, -100.3161] as [number, number],
      type: 'Centro',
      materials: ['Electrónicos', 'Pilas', 'Aceite', 'Llantas'],
      address: 'Av. Constitución 567, Monterrey',
      hours: 'Mar-Dom: 9:00-18:00',
      phone: '81-8765-4321',
      description: 'Centro especializado en residuos especiales',
      ciudad: 'Monterrey'
    },
    {
      id: 302,
      name: 'Recicladora San Nicolás',
      coords: [25.7488, -100.2967] as [number, number],
      type: 'Comercial',
      materials: ['Metal', 'Aluminio', 'Acero', 'Cobre'],
      address: 'Av. Universidad 1234, San Nicolás de los Garza',
      hours: 'Lun-Sab: 7:00-17:00',
      phone: '81-1234-5678',
      description: 'Centro industrial especializado en metales',
      ciudad: 'San Nicolás de los Garza'
    },
    {
      id: 303,
      name: 'Centro Verde Apodaca',
      coords: [25.7772, -100.1872] as [number, number],
      type: 'Público',
      materials: ['Papel', 'Cartón', 'Plástico', 'Vidrio'],
      address: 'Carretera a Laredo Km 15, Apodaca',
      hours: 'Lun-Vie: 8:00-16:00',
      phone: '81-9876-5432',
      description: 'Centro público con programa de separación',
      ciudad: 'Apodaca'
    }
  ],

  // Yucatán - Mérida
  "Yucatán": [
    {
      id: 401,
      name: 'Centro de Reciclaje Mérida',
      coords: [20.9674, -89.5926] as [number, number],
      type: 'Público',
      materials: ['Papel', 'Cartón', 'Plástico', 'Vidrio', 'Metal'],
      address: 'Calle 60 x 47, Centro, Mérida',
      hours: 'Lun-Vie: 8:00-17:00',
      phone: '999-123-4567',
      description: 'Centro municipal de Mérida',
      ciudad: 'Mérida'
    },
    {
      id: 402,
      name: 'EcoYucatán',
      coords: [20.9559, -89.6169] as [number, number],
      type: 'Centro',
      materials: ['Orgánicos', 'Compostaje', 'Papel', 'Cartón'],
      address: 'Periférico Norte 567, Mérida',
      hours: 'Mar-Sab: 9:00-17:00',
      phone: '999-987-6543',
      description: 'Centro especializado en residuos orgánicos',
      ciudad: 'Mérida'
    }
  ],

  // Veracruz
  "Veracruz": [
    {
      id: 501,
      name: 'Centro Portuario de Reciclaje',
      coords: [19.1738, -96.1342] as [number, number],
      type: 'Comercial',
      materials: ['Metal', 'Aluminio', 'Fierro', 'Cobre'],
      address: 'Av. Independencia 234, Veracruz',
      hours: 'Lun-Sab: 7:00-17:00',
      phone: '229-123-4567',
      description: 'Recicladora del puerto de Veracruz',
      ciudad: 'Veracruz'
    },
    {
      id: 502,
      name: 'EcoXalapa',
      coords: [19.5389, -96.9178] as [number, number],
      type: 'Público',
      materials: ['Papel', 'Cartón', 'Plástico', 'Vidrio'],
      address: 'Av. Lázaro Cárdenas 567, Xalapa',
      hours: 'Lun-Vie: 8:00-16:00',
      phone: '228-987-6543',
      description: 'Centro público de la capital veracruzana',
      ciudad: 'Xalapa'
    }
  ],

  // Puebla
  "Puebla": [
    {
      id: 601,
      name: 'Centro de Acopio Puebla',
      coords: [19.0414, -98.2063] as [number, number],
      type: 'Público',
      materials: ['Papel', 'Cartón', 'Plástico', 'Vidrio', 'Metal'],
      address: 'Av. Juárez 1234, Centro, Puebla',
      hours: 'Lun-Vie: 8:00-17:00',
      phone: '222-123-4567',
      description: 'Centro municipal de Puebla',
      ciudad: 'Puebla'
    },
    {
      id: 602,
      name: 'Recicladora Angelópolis',
      coords: [19.0126, -98.2863] as [number, number],
      type: 'Comercial',
      materials: ['Plástico PET', 'HDPE', 'Polímeros'],
      address: 'Vía Atlixcáyotl 567, Puebla',
      hours: 'Lun-Sab: 8:00-18:00',
      phone: '222-987-6543',
      description: 'Centro comercial especializado en plásticos',
      ciudad: 'Puebla'
    }
  ]
}

// Nueva función de detección mejorada
const detectarUbicacionCompleta = async (): Promise<UbicacionDetectada> => {
  try {
    console.log('🔍 Iniciando detección de ubicación mejorada...')
    const ubicacion = await detectorUbicacion.detectarUbicacion()
    console.log('✅ Ubicación detectada:', ubicacion)
    return ubicacion
  } catch (error) {
    console.error('❌ Error en detección:', error)
    return {
      estado: 'Ciudad de México',
      ciudad: 'Ciudad de México',
      latitud: 19.4326,
      longitud: -99.1332,
      precision: 'baja',
      fuente: 'manual'
    }
  }
}

function SetMapView({ center }: { center: [number, number] }) {
  const map = useMap()
  React.useEffect(() => {
    if (map && center) {
      map.setView(center, 11)
    }
  }, [center, map])
  return null
}

// Componente para manejar clics en el mapa como Google Maps
function MapClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  const map = useMap()
  
  React.useEffect(() => {
    const handleClick = (e: any) => {
      const { lat, lng } = e.latlng
      console.log(`🗺️ Click en mapa: [${lat}, ${lng}]`)
      onLocationChange(lat, lng)
    }
    
    map.on('click', handleClick)
    
    return () => {
      map.off('click', handleClick)
    }
  }, [map, onLocationChange])
  
  return null
}

// Calcular distancia entre dos puntos
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Componente Modal de Valoración
const RatingModal: React.FC<{
  center: any;
  onSave: (rating: number, comment: string) => void;
  onClose: () => void;
}> = ({ center, onSave, onClose }) => {
  const [rating, setRating] = React.useState(5)
  const [comment, setComment] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(rating, comment)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Selector de Estrellas */}
      <div>
        <label className="block text-sm font-medium mb-2">
          ¿Cómo calificas este centro? *
        </label>
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Calificación de 1 a 5 estrellas">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 rounded ${
                star <= rating ? 'text-yellow-500' : 'text-gray-300'
              }`}
              aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
              role="radio"
              aria-checked={rating === star}
            >
              ★
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {rating === 1 && 'Muy malo'}
            {rating === 2 && 'Malo'}
            {rating === 3 && 'Regular'}
            {rating === 4 && 'Bueno'}
            {rating === 5 && 'Excelente'}
          </span>
        </div>
      </div>

      {/* Comentario */}
      <div>
        <label htmlFor="rating-comment" className="block text-sm font-medium mb-2">
          Comparte tu experiencia (opcional)
        </label>
        <textarea
          id="rating-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="¿Cómo fue tu experiencia en este centro? ¿El personal fue amable? ¿Fue fácil encontrar el lugar?"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          rows={4}
          maxLength={500}
        />
        <div className="text-xs text-gray-500 mt-1">
          {comment.length}/500 caracteres
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
        >
          Guardar Reseña
        </button>
      </div>
    </form>
  )
}

export default function MapaInteligente() {
  const [position, setPosition] = React.useState<[number, number]>([19.4326, -99.1332])
  const [loading, setLoading] = React.useState(true)
  const [selectedFilter, setSelectedFilter] = React.useState<string>('todos')
  const [regionDetectada, setRegionDetectada] = React.useState<string>('Ciudad de México')
  const [centrosLocales, setCentrosLocales] = React.useState<any[]>([])

  // NUEVOS ESTADOS - Sistema de Valoraciones y Funcionalidades Sociales
  const [showRatingModal, setShowRatingModal] = React.useState(false)
  const [selectedCenterForRating, setSelectedCenterForRating] = React.useState<any>(null)
  const [userRatings, setUserRatings] = React.useState<{[key: string]: {rating: number, comment: string}}>({})
  const [showAccessibilityMode, setShowAccessibilityMode] = React.useState(false)

  // FUNCIONES UTILITARIAS - Iconos Personalizados y Sistema Social

  // Obtener icono según tipo de material
  const getIconoMaterial = (materiales: string[]): string => {
    if (!materiales || materiales.length === 0) return '♻️'
    
    const material = materiales[0].toLowerCase()
    if (material.includes('orgánico') || material.includes('compost')) return '🌱'
    if (material.includes('papel') || material.includes('cartón')) return '📄'
    if (material.includes('plástico') || material.includes('pet')) return '🥤'
    if (material.includes('vidrio')) return '🍶'
    if (material.includes('metal') || material.includes('aluminio')) return '🔧'
    if (material.includes('electrón') || material.includes('batería')) return '🔋'
    if (material.includes('textil') || material.includes('ropa')) return '👕'
    return '♻️'
  }

  // Verificar si el centro tiene beneficios especiales
  const getTipoCentro = (centro: any): {icon: string, badge: string, color: string} => {
    const description = centro.description?.toLowerCase() || ''
    const type = centro.type?.toLowerCase() || ''
    
    if (description.includes('paga') || description.includes('compra')) {
      return {icon: '💰', badge: 'Paga por material', color: 'bg-yellow-500'}
    }
    if (description.includes('taller') || description.includes('educación')) {
      return {icon: '🎓', badge: 'Talleres educativos', color: 'bg-blue-500'}
    }
    if (type.includes('público') || description.includes('gobierno')) {
      return {icon: '🏛️', badge: 'Centro oficial', color: 'bg-green-500'}
    }
    if (description.includes('certificado') || description.includes('norma')) {
      return {icon: '✅', badge: 'Certificado', color: 'bg-purple-500'}
    }
    return {icon: '🏢', badge: 'Centro comercial', color: 'bg-gray-500'}
  }

  // Calcular rating promedio (simulado por ahora)
  const getCentroRating = (centroId: string): {rating: number, reviews: number} => {
    const userRating = userRatings[centroId]
    if (userRating) {
      return {rating: userRating.rating, reviews: 1}
    }
    // Simular ratings basados en el tipo de centro
    const mockRating = 3.5 + (parseInt(centroId) % 3) * 0.5
    const mockReviews = 5 + (parseInt(centroId) % 15)
    return {rating: Math.min(mockRating, 5), reviews: mockReviews}
  }

  // Renderizar estrellas de rating
  const renderEstrellas = (rating: number): string => {
    const estrellas = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))
    return estrellas
  }

  // Función para abrir modal de valoración
  const abrirModalRating = (centro: any) => {
    setSelectedCenterForRating(centro)
    setShowRatingModal(true)
  }

  // Función para guardar valoración
  const guardarValoracion = (rating: number, comment: string) => {
    if (selectedCenterForRating) {
      setUserRatings(prev => ({
        ...prev,
        [selectedCenterForRating.id]: {rating, comment}
      }))
      setShowRatingModal(false)
      setSelectedCenterForRating(null)
    }
  }
  React.useEffect(() => {
    console.log(`🏠 centrosLocales actualizado: ${centrosLocales.length} centros`);
    if (centrosLocales.length > 0) {
      console.log(`📋 Ejemplos de centrosLocales:`, centrosLocales.slice(0, 3).map(c => ({ 
        name: c.name, 
        ciudad: c.ciudad,
        materials: c.materials 
      })));
    }
  }, [centrosLocales]);
  const [detectandoUbicacion, setDetectandoUbicacion] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [showLocationSearch, setShowLocationSearch] = React.useState(false)
  const [allCentros, setAllCentros] = React.useState<any[]>([])
  const [ubicacionCompleta, setUbicacionCompleta] = React.useState<UbicacionDetectada | null>(null)
  const [centrosAPIs, setCentrosAPIs] = React.useState<any[]>([])
  const [loadingAPIs, setLoadingAPIs] = React.useState(false)

  // Cargar todos los centros al inicio
  React.useEffect(() => {
    const cargarTodosLosCentros = async () => {
      console.log('🚀 Iniciando carga de centros...');
      
      try {
        // Combinar centros locales con legacy
        const centrosNuevos = Object.values(CENTROS_RECICLAJE_MEXICO).flat()
        const centrosLegacy = Object.values(centrosPorEstadoLegacy).flat()
        
        console.log(`📊 Centros nuevos encontrados: ${centrosNuevos.length}`);
        console.log(`📊 Centros legacy encontrados: ${centrosLegacy.length}`);
        
        // Convertir centros nuevos al formato legacy para compatibilidad
        const centrosNuevosConvertidos = centrosNuevos.map(centro => {
          const centroConvertido = {
            id: centro.id,
            name: centro.nombre,
            coords: [centro.latitud, centro.longitud] as [number, number],
            type: centro.fuente === 'ECOCE' ? 'Verificado' : 
                  centro.fuente === 'SEMARNAT' ? 'Verificado' :
                  centro.fuente === 'SEDEMA' ? 'Verificado' : 'Centro',
            materials: centro.materialesAceptados,
            address: centro.direccion,
            hours: typeof centro.horarios === 'string' ? centro.horarios : 
                   Object.entries(centro.horarios).map(([dia, hora]) => `${dia}: ${hora}`).join(', '),
            phone: centro.telefono || 'No disponible',
            description: `${centro.serviciosAdicionales.join(', ')} - Fuente: ${centro.fuente}`,
            ciudad: centro.ciudad,
            fuente: centro.fuente,
            paganPorMaterial: centro.paganPorMaterial
          };
          return centroConvertido;
        });
        
        const todosCentros = [...centrosLegacy, ...centrosNuevosConvertidos]
        setAllCentros(todosCentros)
        console.log(`✅ Total centros cargados: ${todosCentros.length}`)
        console.log(`📋 Ejemplos de centros:`, todosCentros.slice(0, 3).map(c => ({ 
          name: c.name, 
          ciudad: c.ciudad, 
          materials: c.materials?.slice(0, 2) 
        })));
        
      } catch (error) {
        console.error('❌ Error cargando centros:', error)
        // Fallback a solo legacy
        const todosLosCentros = Object.values(centrosPorEstadoLegacy).flat()
        setAllCentros(todosLosCentros)
        console.log(`⚠️ Usando solo centros legacy: ${todosLosCentros.length}`);
      }
    }
    
    cargarTodosLosCentros()
  }, [])

  // Función para manejar clics en el mapa (como Google Maps)
  const handleMapClick = async (lat: number, lng: number) => {
    console.log(`🗺️ Manejando clic en mapa: [${lat}, ${lng}]`)
    
    try {
      // Actualizar posición del mapa
      setPosition([lat, lng])
      
      // Detectar estado/región por coordenadas
      const ubicacion = await detectarUbicacionCompleta()
      
      if (ubicacion.estado !== 'No detectado') {
        // Cambiar región automáticamente
        console.log(`🎯 Detectado estado: ${ubicacion.estado}`)
        await cambiarRegion(ubicacion.estado)
        setUbicacionCompleta(ubicacion)
      } else {
        // Buscar centros cercanos en un radio
        const centrosCercanos = allCentros.filter(centro => {
          const distancia = calculateDistance(lat, lng, centro.coords[0], centro.coords[1])
          return distancia <= 50 // 50km de radio
        }).sort((a, b) => {
          const distA = calculateDistance(lat, lng, a.coords[0], a.coords[1])
          const distB = calculateDistance(lat, lng, b.coords[0], b.coords[1])
          return distA - distB
        })
        
        setCentrosLocales(centrosCercanos)
        setRegionDetectada(`Área seleccionada (${centrosCercanos.length} centros)`)
        console.log(`📍 Centros cercanos encontrados: ${centrosCercanos.length}`)
      }
      
    } catch (error) {
      console.error('❌ Error manejando clic en mapa:', error)
    }
  }
  const cambiarRegion = async (nuevaRegion: string) => {
    console.log(`🌍 Cambiando región a: ${nuevaRegion}`);
    setLoadingAPIs(true)
    setRegionDetectada(nuevaRegion)
    
    try {
      let centrosRegion: any[] = [];

      if (nuevaRegion === 'Todos los Estados') {
        // Mostrar todos los centros disponibles
        centrosRegion = [...allCentros, ...centrosAPIs];
        console.log(`🌍 Mostrando todos los centros: ${centrosRegion.length}`);
      } else {
        // Filtrar centros por región específica
        const centrosLocales = allCentros.filter(centro => {
          const matchesCiudad = centro.ciudad?.toLowerCase().includes(nuevaRegion.toLowerCase());
          const matchesName = centro.name?.toLowerCase().includes(nuevaRegion.toLowerCase());
          const matchesAddress = centro.address?.toLowerCase().includes(nuevaRegion.toLowerCase());
          return matchesCiudad || matchesName || matchesAddress;
        });

        console.log(`🏠 Centros locales encontrados para ${nuevaRegion}: ${centrosLocales.length}`);
        
        // Intentar obtener centros de APIs oficiales
        let centrosComplementarios: any[] = []
        try {
          const centrosOficiales = await obtenerCentrosCombinados(nuevaRegion)
          centrosComplementarios = centrosOficiales.map(centro => ({
            id: centro.id,
            name: centro.nombre,
            coords: [centro.latitud, centro.longitud] as [number, number],
            type: 'Verificado',
            materials: centro.materialesAceptados,
            address: centro.direccion,
            hours: typeof centro.horarios === 'string' ? centro.horarios : 
                   Object.entries(centro.horarios).map(([dia, hora]) => `${dia}: ${hora}`).join(', '),
            phone: centro.telefono || 'No disponible',
            description: `${centro.serviciosAdicionales.join(', ')} - Fuente oficial: ${centro.fuente}`,
            ciudad: centro.ciudad,
            fuente: centro.fuente,
            oficial: true
          }))
          setCentrosAPIs(centrosComplementarios)
          console.log(`🏛️ Centros de APIs oficiales para ${nuevaRegion}: ${centrosComplementarios.length}`)
        } catch (error) {
          console.log('⚠️ APIs oficiales no disponibles, usando solo datos locales')
          setCentrosAPIs([])
        }
        
        // Combinar centros locales y oficiales
        centrosRegion = [...centrosLocales, ...centrosComplementarios];
      }

      setCentrosLocales(centrosRegion)
      
      // Cambiar el centro del mapa usando las coordenadas oficiales
      const coordsEstado = COORDENADAS_ESTADOS[nuevaRegion as keyof typeof COORDENADAS_ESTADOS]
      if (coordsEstado) {
        setPosition([coordsEstado.lat, coordsEstado.lng])
        console.log(`📍 Centrando mapa en coordenadas de ${nuevaRegion}: [${coordsEstado.lat}, ${coordsEstado.lng}]`);
      } else if (centrosRegion.length > 0) {
        setPosition(centrosRegion[0].coords)
        console.log(`📍 Centrando mapa en primer centro: [${centrosRegion[0].coords}]`);
      }
      
      console.log(`� Total centros para ${nuevaRegion}: ${centrosRegion.length}`)
      
    } catch (error) {
      console.error('❌ Error cambiando región:', error)
      // Fallback a método anterior
      const centros = centrosPorEstadoLegacy[nuevaRegion] || []
      setCentrosLocales(centros)
      if (centros.length > 0) {
        setPosition(centros[0].coords)
      }
    }
    
    setLoadingAPIs(false)
    setShowLocationSearch(false)
    setSearchQuery('') // Limpiar búsqueda al cambiar región
  }

  // Función para buscar centros por nombre o ciudad - ARREGLADA
  const buscarCentros = (query: string) => {
    console.log(`🔍 Iniciando búsqueda con query: "${query}"`);
    console.log(`📊 Datos disponibles:`, {
      allCentros: allCentros.length,
      centrosAPIs: centrosAPIs.length,
      regionDetectada
    });

    if (!query.trim()) {
      // Restaurar centros de la región actual cuando no hay búsqueda
      if (regionDetectada === 'Todos los Estados') {
        const todosCentros = [...allCentros, ...centrosAPIs];
        setCentrosLocales(todosCentros);
        console.log(`📍 Mostrando todos los centros: ${todosCentros.length}`);
      } else {
        // Filtrar por región actual
        const centrosRegion = allCentros.filter(centro => {
          const matchesCiudad = centro.ciudad?.toLowerCase().includes(regionDetectada.toLowerCase());
          const matchesName = centro.name?.toLowerCase().includes(regionDetectada.toLowerCase());
          const matchesAddress = centro.address?.toLowerCase().includes(regionDetectada.toLowerCase());
          return matchesCiudad || matchesName || matchesAddress;
        });
        
        const centrosAPIRegion = centrosAPIs.filter(centro => {
          const matchesCiudad = centro.ciudad?.toLowerCase().includes(regionDetectada.toLowerCase());
          return matchesCiudad;
        });
        
        const todosCentrosRegion = [...centrosRegion, ...centrosAPIRegion];
        setCentrosLocales(todosCentrosRegion);
        console.log(`📍 Centros para ${regionDetectada}: ${todosCentrosRegion.length}`);
      }
      return;
    }

    // Buscar en todos los centros disponibles
    const queryLower = query.toLowerCase();
    const todosCentros = [...allCentros, ...centrosAPIs];
    
    const resultados = todosCentros.filter(centro => {
      try {
        // Buscar en nombre
        const matchName = centro.name?.toLowerCase().includes(queryLower);
        
        // Buscar en dirección
        const matchAddress = centro.address?.toLowerCase().includes(queryLower);
        
        // Buscar en ciudad
        const matchCity = centro.ciudad?.toLowerCase().includes(queryLower);
        
        // Buscar en materiales (verificar que materials existe y es array)
        const matchMaterials = centro.materials && Array.isArray(centro.materials) ? 
          centro.materials.some((material: string) => 
            material.toLowerCase().includes(queryLower)
          ) : false;
        
        // Buscar en descripción
        const matchDescription = centro.description?.toLowerCase().includes(queryLower);
        
        // Buscar en fuente
        const matchFuente = centro.fuente?.toLowerCase().includes(queryLower);
        
        return matchName || matchAddress || matchCity || matchMaterials || matchDescription || matchFuente;
      } catch (error) {
        console.error('Error filtrando centro:', centro, error);
        return false;
      }
    });

    setCentrosLocales(resultados);
    console.log(`🔍 Búsqueda "${query}": ${resultados.length} resultados encontrados`);
    console.log('📋 Primeros 3 resultados:', resultados.slice(0, 3).map(c => ({ name: c.name, ciudad: c.ciudad })));
  }

  // Manejar búsqueda en tiempo real - MEJORADO
  React.useEffect(() => {
    console.log(`🔄 Effect de búsqueda disparado:`, {
      searchQuery,
      allCentrosLength: allCentros.length,
      centrosAPIsLength: centrosAPIs.length,
      regionDetectada
    });
    
    // Solo buscar si tenemos datos cargados
    if (allCentros.length > 0) {
      buscarCentros(searchQuery);
    }
  }, [searchQuery, allCentros, centrosAPIs, regionDetectada])

  // Lista de estados disponibles - TODOS LOS 32 ESTADOS
  const estadosDisponibles = ESTADOS_MEXICO

  // Detectar ubicación y región - VERSIÓN MEJORADA
  React.useEffect(() => {
    const inicializarMapa = async () => {
      setDetectandoUbicacion(true)
      setLoading(true)
      
      try {
        // Usar el nuevo detector de ubicación
        const ubicacion = await detectarUbicacionCompleta()
        setUbicacionCompleta(ubicacion)
        
        console.log('🎯 Ubicación detectada:', ubicacion)
        
        // Establecer posición en el mapa
        setPosition([ubicacion.latitud, ubicacion.longitud])
        setRegionDetectada(ubicacion.estado)
        
        // Cargar centros de la región detectada
        await cambiarRegion(ubicacion.estado)
        
      } catch (error) {
        console.error('❌ Error en inicialización:', error)
        // Fallback a Ciudad de México
        setRegionDetectada('Ciudad de México')
        await cambiarRegion('Ciudad de México')
      }
      
      setLoading(false)
      setDetectandoUbicacion(false)
    }
    
    inicializarMapa()
  }, [])

  // Filtrar centros por material
  const filteredCentros = React.useMemo(() => {
    console.log(`🔍 Calculando filteredCentros:`, {
      selectedFilter,
      centrosLocalesLength: centrosLocales.length,
      centrosLocalesEjemplos: centrosLocales.slice(0, 2).map(c => ({ name: c.name, materials: c.materials }))
    });

    if (selectedFilter === 'todos') {
      console.log(`✅ Mostrando todos los centros: ${centrosLocales.length}`);
      return centrosLocales;
    }

    const filtered = centrosLocales.filter(centro => {
      const hasMaterials = centro.materials && Array.isArray(centro.materials);
      if (!hasMaterials) {
        console.warn(`⚠️ Centro sin materials válidos:`, centro.name, centro.materials);
        return false;
      }

      const matches = centro.materials.some((material: string) => 
        material.toLowerCase().includes(selectedFilter.toLowerCase())
      );
      
      return matches;
    });

    console.log(`🔍 Filtrado por "${selectedFilter}": ${filtered.length} centros encontrados`);
    return filtered;
  }, [selectedFilter, centrosLocales])

  // Calcular centros con distancia
  const centrosConDistancia = React.useMemo(() => {
    console.log(`📏 Calculando distancias para ${filteredCentros.length} centros`);
    
    const result = filteredCentros.map(centro => ({
      ...centro,
      distance: calculateDistance(position[0], position[1], centro.coords[0], centro.coords[1])
    })).sort((a, b) => a.distance - b.distance);

    console.log(`📊 Centros con distancia calculada: ${result.length}`);
    console.log(`📋 Primeros 3 centros más cercanos:`, result.slice(0, 3).map(c => ({ 
      name: c.name, 
      distance: c.distance?.toFixed(2) + ' km' 
    })));

    return result;
  }, [filteredCentros, position])

  const getPointColor = (type: string, fuente?: string) => {
    // Priorizar por fuente oficial
    if (fuente === 'SEMARNAT') return '#7c3aed' // Morado para SEMARNAT
    if (fuente === 'ECOCE') return '#059669' // Verde para ECOCE
    if (fuente === 'SEDEMA') return '#0ea5e9' // Azul para SEDEMA
    if (fuente === 'PETSTAR') return '#f59e0b' // Naranja para PetStar
    
    // Fallback por tipo
    switch (type) {
      case 'Público': return '#059669'
      case 'Centro': return '#0e7490'
      case 'Comercial': return '#dc2626'
      case 'Verificado': return '#7c3aed'
      default: return '#6b7280'
    }
  }

  // Función para abrir en Google Maps
  const abrirEnGoogleMaps = (centro: any) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(centro.name + ' ' + centro.address)}`
    window.open(url, '_blank')
  }

  // Función para obtener direcciones
  const obtenerDirecciones = (centro: any) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${centro.coords[0]},${centro.coords[1]}`
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="mb-2">🔍 Detectando tu ubicación...</p>
          {detectandoUbicacion && (
            <p className="text-sm text-gray-600">🗺️ Buscando centros de reciclaje en tu área</p>
          )}
          {loadingAPIs && (
            <p className="text-sm text-blue-600">🏛️ Consultando APIs oficiales (SEMARNAT, ECOCE)...</p>
          )}
          {ubicacionCompleta && (
            <div className="mt-2 text-sm">
              <p>📍 {ubicacionCompleta.ciudad}, {ubicacionCompleta.estado}</p>
              <p className="text-xs text-gray-500">Precisión: {ubicacionCompleta.precision} | Fuente: {ubicacionCompleta.fuente}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <header className="flex items-center gap-2 p-4 border-b" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <img src="/icons/ecohack.png" alt="Logo EcoHack" className="w-10 h-10" />
        <span className="font-bold text-xl">EcoHack</span>
      </header>
      
      <main className="p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
            🗺️ Centros de Reciclaje
          </h1>
          
          {/* Región detectada y buscador de ubicación - MEJORADO */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                📍 Región actual:
              </span>
              <button
                onClick={() => setShowLocationSearch(!showLocationSearch)}
                className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-bold hover:bg-green-200 transition-colors"
              >
                {regionDetectada} ▼
              </button>
              {ubicacionCompleta && (
                <div className="flex items-center gap-1 text-xs">
                  <span className={`w-2 h-2 rounded-full ${
                    ubicacionCompleta.precision === 'alta' ? 'bg-green-500' :
                    ubicacionCompleta.precision === 'media' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    {ubicacionCompleta.ciudad} ({ubicacionCompleta.fuente})
                  </span>
                </div>
              )}
              {loadingAPIs && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>APIs oficiales...</span>
                </div>
              )}
            </div>
            
            {/* Buscador de centros - MEJORADO CON ACCESIBILIDAD */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <label htmlFor="search-centers" className="sr-only">
                  Buscar centros de reciclaje, ciudades y materiales
                </label>
                <input
                  id="search-centers"
                  type="text"
                  placeholder="Buscar centros, ciudades, materiales, APIs oficiales..."
                  value={searchQuery}
                  onChange={(e) => {
                    console.log(`🔍 Usuario escribió: "${e.target.value}"`);
                    setSearchQuery(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  style={{ 
                    background: 'var(--color-surface)', 
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)'
                  }}
                  aria-describedby="search-help"
                  aria-label="Campo de búsqueda para centros de reciclaje"
                />
                <div 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  aria-hidden="true"
                >
                  🔍
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                    aria-label="Limpiar búsqueda"
                    title="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                )}
                <div id="search-help" className="sr-only">
                  Escriba para buscar centros de reciclaje por nombre, ciudad o tipo de material
                </div>
              </div>
            </div>
          </div>

          {/* Selector de ubicación desplegable - TODOS LOS ESTADOS */}
          {showLocationSearch && (
            <div className="mb-4 p-4 rounded-lg border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <h3 className="font-bold mb-3">📍 Seleccionar Estado/Región (32 Estados de México):</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {estadosDisponibles.map(estado => {
                  // Contar centros locales + APIs
                  const centrosLocales = allCentros.filter(c => c.ciudad?.includes(estado) || c.name?.includes(estado)).length
                  const centrosOficiales = centrosAPIs.filter(c => c.ciudad?.includes(estado)).length
                  const totalCentros = centrosLocales + centrosOficiales
                  
                  return (
                    <button
                      key={estado}
                      onClick={() => cambiarRegion(estado)}
                      className={`p-3 rounded-lg text-left transition-colors ${
                        regionDetectada === estado 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <div className="font-bold text-sm">{estado}</div>
                      <div className="text-xs opacity-75">
                        {totalCentros > 0 ? `${totalCentros} centros` : 'Próximamente'}
                        {centrosOficiales > 0 && (
                          <span className="block text-blue-600">🏛️ {centrosOficiales} oficiales</span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setCentrosLocales([...allCentros, ...centrosAPIs])
                      setRegionDetectada('Todos los Estados')
                      setShowLocationSearch(false)
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    🌍 Ver todos los centros de México
                  </button>
                  <button
                    onClick={async () => {
                      const ubicacion = await detectarUbicacionCompleta()
                      setUbicacionCompleta(ubicacion)
                      await cambiarRegion(ubicacion.estado)
                    }}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    🎯 Detectar mi ubicación actual
                  </button>
                </div>
                <div className="mt-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  <p>🏛️ <strong>APIs Oficiales integradas:</strong> SEMARNAT, ECOCE, PetStar, SEDEMA (CDMX)</p>
                  <p>🔄 Los datos se actualizan automáticamente desde fuentes oficiales</p>
                </div>
              </div>
            </div>
          )}
          
          <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            {searchQuery ? (
              <>Resultados de búsqueda para "<strong>{searchQuery}</strong>"</>
            ) : (
              <>Centros de reciclaje disponibles en {regionDetectada}. Haz clic para ver en Google Maps.</>
            )}
          </p>
        </div>
        
        {/* PANEL DE ACCESIBILIDAD */}
        <div className="mb-4 p-3 rounded-lg border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg" aria-hidden="true">♿</span>
              <div>
                <span className="font-medium">Modo Accesibilidad</span>
                <p className="text-xs text-gray-600">Mejora contraste y tamaños de texto</p>
              </div>
            </div>
            <button
              onClick={() => setShowAccessibilityMode(!showAccessibilityMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 ${
                showAccessibilityMode ? 'bg-green-500' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={showAccessibilityMode}
              aria-label="Activar modo de alta accesibilidad"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showAccessibilityMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Filtros por material */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedFilter('todos')}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedFilter === 'todos' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📋 Todos
          </button>
          {['Papel', 'Plástico', 'Vidrio', 'Metal', 'Electrónicos', 'Orgánicos'].map(material => (
            <button
              key={material}
              onClick={() => setSelectedFilter(material)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedFilter === material 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {material === 'Papel' && '📄'} 
              {material === 'Plástico' && '🥤'} 
              {material === 'Vidrio' && '🍶'} 
              {material === 'Metal' && '🔧'} 
              {material === 'Electrónicos' && '📱'} 
              {material === 'Orgánicos' && '🥬'} 
              {material}
            </button>
          ))}
        </div>
        
        {/* Mapa */}
        <div className="rounded-xl overflow-hidden shadow mb-6" style={{ background: 'var(--color-surface)', height: '40vh' }}>
          <MapContainer center={position} zoom={11} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <SetMapView center={position} />
            <MapClickHandler onLocationChange={handleMapClick} />
            
            {/* Tu ubicación */}
            <CircleMarker 
              center={position} 
              radius={12} 
              pathOptions={{ 
                color: '#fff', 
                fillColor: '#047857', 
                fillOpacity: 1,
                weight: 3
              }}
            >
              <Popup>
                <div className="text-center">
                  <div className="text-lg">📍</div>
                  <strong>Tu ubicación</strong>
                  <br />
                  <span className="text-sm">{regionDetectada}</span>
                </div>
              </Popup>
            </CircleMarker>
            
            {/* Centros de reciclaje */}
            {filteredCentros.map((centro) => (
              <CircleMarker 
                key={centro.id} 
                center={centro.coords} 
                radius={centro.oficial ? 12 : 10} 
                pathOptions={{ 
                  color: '#fff', 
                  fillColor: getPointColor(centro.type, centro.fuente), 
                  fillOpacity: centro.oficial ? 0.9 : 0.8,
                  weight: centro.oficial ? 3 : 2
                }}
              >
                <Popup>
                  <div className="min-w-64 max-w-80">
                    {/* Header con icono y rating */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl" aria-hidden="true">
                          {getIconoMaterial(centro.materials || [])}
                        </span>
                        <div>
                          <h3 className="font-bold text-lg">{centro.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-500 text-sm">
                              {renderEstrellas(getCentroRating(centro.id).rating)}
                            </span>
                            <span className="text-xs text-gray-600">
                              ({getCentroRating(centro.id).reviews} reseñas)
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Badge de tipo de centro */}
                      <div className="flex flex-col items-end gap-1">
                        {centro.oficial && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            🏛️ {centro.fuente}
                          </span>
                        )}
                        <span className={`px-2 py-1 text-white text-xs rounded-full ${getTipoCentro(centro).color}`}>
                          {getTipoCentro(centro).icon} {getTipoCentro(centro).badge}
                        </span>
                      </div>
                    </div>

                    {/* Información básica */}
                    <div className="space-y-2 mb-3">
                      <p className="text-sm flex items-center gap-2">
                        <span aria-hidden="true">📍</span> {centro.address}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <span aria-hidden="true">🕒</span> {centro.hours}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <span aria-hidden="true">📞</span> {centro.phone}
                      </p>
                      {centro.paganPorMaterial !== undefined && (
                        <p className="text-sm flex items-center gap-2">
                          <span aria-hidden="true">💰</span> 
                          {centro.paganPorMaterial ? 'Pagan por material' : 'No pagan (trueque/donación)'}
                        </p>
                      )}
                    </div>

                    {/* Materiales aceptados */}
                    <div className="mb-3">
                      <strong className="text-sm">Materiales aceptados:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {centro.materials?.map((material: string) => (
                          <span 
                            key={material}
                            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center gap-1"
                          >
                            <span aria-hidden="true">{getIconoMaterial([material])}</span>
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Comentario del usuario si existe */}
                    {userRatings[centro.id] && (
                      <div className="mb-3 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                        <p className="text-sm font-medium">Tu reseña:</p>
                        <p className="text-sm">{userRatings[centro.id].comment}</p>
                      </div>
                    )}

                    {/* Botones de acción MEJORADOS */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => abrirEnGoogleMaps(centro)}
                        className="bg-blue-500 text-white text-sm py-2 px-3 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        aria-label={`Ver ${centro.name} en Google Maps`}
                      >
                        🗺️ Maps
                      </button>
                      <button
                        onClick={() => obtenerDirecciones(centro)}
                        className="bg-green-500 text-white text-sm py-2 px-3 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                        aria-label={`Obtener direcciones a ${centro.name}`}
                      >
                        🧭 Ir
                      </button>
                      <button
                        onClick={() => abrirModalRating(centro)}
                        className="bg-yellow-500 text-white text-sm py-2 px-3 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors"
                        aria-label={`Calificar ${centro.name}`}
                      >
                        ⭐ Calificar
                      </button>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>

        {/* Lista de centros cercanos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
              📍 {searchQuery ? 'Resultados de búsqueda' : `Centros en ${regionDetectada}`}
            </h2>
            <div className="text-right">
              <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {centrosConDistancia.length} encontrados
              </span>
              {centrosAPIs.length > 0 && (
                <div className="text-xs text-blue-600">
                  🏛️ {centrosAPIs.length} de APIs oficiales
                </div>
              )}
            </div>
          </div>
          
          {centrosConDistancia.length === 0 ? (
            <div className="text-center py-8 rounded-lg" style={{ background: 'var(--color-surface)' }}>
              <div className="text-4xl mb-2">🔍</div>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                {searchQuery ? 
                  `No se encontraron centros que coincidan con "${searchQuery}"` :
                  'No se encontraron centros con el filtro seleccionado'
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Ver todos los centros
                </button>
              )}
            </div>
          ) : (
            centrosConDistancia.map((centro) => (
              <div 
                key={centro.id}
                className={`p-4 rounded-lg border cursor-pointer hover:shadow-lg transition-all ${
                  showAccessibilityMode ? 'border-2 border-gray-800' : ''
                }`}
                style={{ 
                  background: 'var(--color-surface)', 
                  borderColor: showAccessibilityMode ? '#1f2937' : 'var(--color-border)'
                }}
                onClick={() => abrirEnGoogleMaps(centro)}
                role="button"
                tabIndex={0}
                aria-label={`Ver detalles de ${centro.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    abrirEnGoogleMaps(centro)
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header mejorado con icono y rating */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl" aria-hidden="true">
                        {getIconoMaterial(centro.materials || [])}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-bold ${showAccessibilityMode ? 'text-xl' : 'text-lg'}`}>
                            {centro.name}
                          </h3>
                          <span className={`px-2 py-1 text-white text-xs rounded-full ${getTipoCentro(centro).color}`}>
                            {getTipoCentro(centro).icon} {getTipoCentro(centro).badge}
                          </span>
                        </div>
                        
                        {/* Rating y badges */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500 text-sm">
                              {renderEstrellas(getCentroRating(centro.id).rating)}
                            </span>
                            <span className="text-xs text-gray-600">
                              ({getCentroRating(centro.id).reviews})
                            </span>
                          </div>
                          
                          {centro.oficial && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              🏛️ Oficial
                            </span>
                          )}
                          {centro.paganPorMaterial && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              💰 Pagan
                            </span>
                          )}
                          {centro.ciudad && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              📍 {centro.ciudad}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className={`mb-3 ${showAccessibilityMode ? 'text-lg' : 'text-sm'}`} 
                       style={{ color: 'var(--color-text-secondary)' }}>
                      {centro.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {centro.materials.map((material: string) => (
                        <span 
                          key={material}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <span>📍</span>
                        <span style={{ color: 'var(--color-text-secondary)' }}>{centro.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>🕒</span>
                        <span style={{ color: 'var(--color-text-secondary)' }}>{centro.hours}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>📞</span>
                        <span style={{ color: 'var(--color-text-secondary)' }}>{centro.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>📏</span>
                        <span style={{ color: 'var(--color-text-secondary)' }}>
                          {centro.distance.toFixed(1)} km
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        abrirEnGoogleMaps(centro)
                      }}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="Ver en Google Maps"
                      aria-label={`Ver ${centro.name} en Google Maps`}
                    >
                      🗺️ Maps
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        obtenerDirecciones(centro)
                      }}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                      title="Obtener direcciones"
                      aria-label={`Obtener direcciones a ${centro.name}`}
                    >
                      🧭 Ir
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        abrirModalRating(centro)
                      }}
                      className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      title="Calificar centro"
                      aria-label={`Calificar ${centro.name}`}
                    >
                      ⭐ Calificar
                    </button>
                    <button
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        window.open(`tel:${centro.phone}`, '_self')
                      }}
                      className="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors"
                      title="Llamar al centro"
                    >
                      📞 Call
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* MODAL DE VALORACIÓN */}
      {showRatingModal && selectedCenterForRating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="rating-modal-title">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 id="rating-modal-title" className="text-xl font-bold">
                Calificar Centro
              </h2>
              <button
                onClick={() => setShowRatingModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                aria-label="Cerrar modal"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{getIconoMaterial(selectedCenterForRating.materials || [])}</span>
                <div>
                  <h3 className="font-semibold">{selectedCenterForRating.name}</h3>
                  <p className="text-sm text-gray-600">{selectedCenterForRating.address}</p>
                </div>
              </div>
            </div>

            <RatingModal 
              center={selectedCenterForRating}
              onSave={guardarValoracion}
              onClose={() => setShowRatingModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}