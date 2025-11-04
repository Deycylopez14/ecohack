// Detector de ubicación mejorado para toda México
const DetectorUbicacionMejorado = {
  // API mejorada de geocodificación
  detectarUbicacionPrecisa: async (lat, lon) => {
    try {
      // Usar múltiples APIs para mayor precisión
      const apis = [
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`,
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=es`,
        // Backup con API de México específica
        `https://api.copomex.com/query/info_cp/${lat},${lon}?token=YOUR_TOKEN`
      ]

      for (const apiUrl of apis) {
        try {
          const response = await fetch(apiUrl)
          const data = await response.json()
          const resultado = this.procesarRespuestaAPI(data)
          if (resultado) return resultado
        } catch (e) {
          console.log('API fallida, probando siguiente...')
        }
      }
    } catch (error) {
      return this.usarFallbackPorCoordenadas(lat, lon)
    }
  },

  // Mapeo mejorado de coordenadas a estados
  mapearCoordenadas: (lat, lon) => {
    const boundingBoxes = {
      "Chiapas": { 
        latMin: 14.5, latMax: 17.9, 
        lonMin: -94.1, lonMax: -90.2 
      },
      "Ciudad de México": { 
        latMin: 19.0, latMax: 19.7, 
        lonMin: -99.4, lonMax: -98.9 
      },
      "Jalisco": { 
        latMin: 19.2, latMax: 22.8, 
        lonMin: -105.7, lonMax: -101.4 
      },
      "Yucatán": { 
        latMin: 19.5, latMax: 21.6, 
        lonMin: -90.4, lonMax: -87.5 
      },
      "Baja California": { 
        latMin: 28.0, latMax: 32.7, 
        lonMin: -117.1, lonMax: -109.4 
      },
      "Quintana Roo": { 
        latMin: 17.8, latMax: 21.6, 
        lonMin: -89.4, lonMax: -86.7 
      }
      // ... todos los 32 estados con sus coordenadas precisas
    }

    for (const [estado, bounds] of Object.entries(boundingBoxes)) {
      if (lat >= bounds.latMin && lat <= bounds.latMax && 
          lon >= bounds.lonMin && lon <= bounds.lonMax) {
        return estado
      }
    }
    
    return 'Estado no detectado'
  },

  // Detectar ciudad específica dentro del estado
  detectarCiudad: (lat, lon, estado) => {
    const ciudadesPorEstado = {
      "Chiapas": [
        { nombre: 'Tuxtla Gutiérrez', coords: [16.7569, -93.1292], radio: 0.3 },
        { nombre: 'San Cristóbal de las Casas', coords: [16.7370, -92.6376], radio: 0.2 },
        { nombre: 'Tapachula', coords: [14.9067, -92.2627], radio: 0.25 },
        { nombre: 'Comitán', coords: [16.2439, -92.1364], radio: 0.15 }
      ],
      "Jalisco": [
        { nombre: 'Guadalajara', coords: [20.6597, -103.3496], radio: 0.4 },
        { nombre: 'Zapopan', coords: [20.7167, -103.3667], radio: 0.3 },
        { nombre: 'Tlaquepaque', coords: [20.6397, -103.3136], radio: 0.2 },
        { nombre: 'Puerto Vallarta', coords: [20.6534, -105.2253], radio: 0.3 }
      ]
      // ... más ciudades
    }

    const ciudades = ciudadesPorEstado[estado] || []
    for (const ciudad of ciudades) {
      const distancia = this.calcularDistancia(lat, lon, ciudad.coords[0], ciudad.coords[1])
      if (distancia <= ciudad.radio) {
        return ciudad.nombre
      }
    }
    
    return null // Ciudad no específica detectada
  }
}