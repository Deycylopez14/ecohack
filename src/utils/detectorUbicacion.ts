// Detector de ubicación mejorado con APIs oficiales
export interface UbicacionDetectada {
  estado: string;
  ciudad: string;
  latitud: number;
  longitud: number;
  precision: 'alta' | 'media' | 'baja';
  fuente: 'gps' | 'ip' | 'manual';
}

export class DetectorUbicacionMejorado {
  private readonly APIs_GEOCODIFICACION = [
    {
      nombre: 'BigDataCloud',
      url: (lat: number, lon: number) => 
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`,
      procesarRespuesta: (data: any) => ({
        estado: this.normalizarEstado(data.principalSubdivision),
        ciudad: data.city || data.locality,
        precision: 'alta' as const
      })
    },
    {
      nombre: 'Nominatim',
      url: (lat: number, lon: number) => 
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=es`,
      procesarRespuesta: (data: any) => ({
        estado: this.normalizarEstado(data.address?.state),
        ciudad: data.address?.city || data.address?.town || data.address?.village,
        precision: 'media' as const
      })
    }
  ];

  // Mapeo mejorado de coordenadas a estados con polígonos más precisos
  private readonly LIMITES_ESTADOS = {
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
    "Nuevo León": { 
      latMin: 23.1, latMax: 27.8, 
      lonMin: -101.2, lonMax: -98.8 
    },
    "Veracruz": { 
      latMin: 17.1, latMax: 22.5, 
      lonMin: -98.6, lonMax: -93.6 
    },
    "Puebla": { 
      latMin: 17.9, latMax: 20.8, 
      lonMin: -99.0, lonMax: -96.4 
    },
    "Guanajuato": { 
      latMin: 19.9, latMax: 21.7, 
      lonMin: -102.1, lonMax: -99.6 
    },
    "Oaxaca": { 
      latMin: 15.6, latMax: 18.7, 
      lonMin: -98.6, lonMax: -93.9 
    },
    "Michoacán": { 
      latMin: 18.1, latMax: 20.4, 
      lonMin: -103.8, lonMax: -100.0 
    },
    "Chihuahua": { 
      latMin: 25.4, latMax: 31.8, 
      lonMin: -109.1, lonMax: -103.2 
    },
    "Guerrero": { 
      latMin: 16.2, latMax: 18.9, 
      lonMin: -102.2, lonMax: -98.0 
    },
    "Tamaulipas": { 
      latMin: 22.2, latMax: 27.7, 
      lonMin: -100.1, lonMax: -97.1 
    },
    "Coahuila": { 
      latMin: 24.5, latMax: 29.9, 
      lonMin: -103.4, lonMax: -99.9 
    },
    "Sonora": { 
      latMin: 26.0, latMax: 32.5, 
      lonMin: -115.0, lonMax: -108.4 
    },
    "San Luis Potosí": { 
      latMin: 21.2, latMax: 24.5, 
      lonMin: -102.2, lonMax: -98.3 
    },
    "Sinaloa": { 
      latMin: 22.5, latMax: 26.9, 
      lonMin: -109.5, lonMax: -105.4 
    },
    "Hidalgo": { 
      latMin: 19.8, latMax: 21.4, 
      lonMin: -99.9, lonMax: -97.9 
    },
    "Estado de México": { 
      latMin: 18.4, latMax: 20.4, 
      lonMin: -100.5, lonMax: -98.6 
    },
    "Tabasco": { 
      latMin: 17.2, latMax: 18.7, 
      lonMin: -94.7, lonMax: -91.0 
    },
    "Nayarit": { 
      latMin: 20.6, latMax: 23.1, 
      lonMin: -106.0, lonMax: -103.7 
    },
    "Querétaro": { 
      latMin: 20.0, latMax: 21.7, 
      lonMin: -100.5, lonMax: -99.0 
    },
    "Morelos": { 
      latMin: 18.3, latMax: 19.1, 
      lonMin: -99.6, lonMax: -98.6 
    },
    "Aguascalientes": { 
      latMin: 21.4, latMax: 22.4, 
      lonMin: -102.9, lonMax: -101.9 
    },
    "Zacatecas": { 
      latMin: 21.0, latMax: 25.1, 
      lonMin: -104.4, lonMax: -101.0 
    },
    "Durango": { 
      latMin: 22.3, latMax: 26.9, 
      lonMin: -107.7, lonMax: -102.5 
    },
    "Tlaxcala": { 
      latMin: 19.1, latMax: 19.8, 
      lonMin: -98.8, lonMax: -97.6 
    },
    "Baja California Sur": { 
      latMin: 22.9, latMax: 28.0, 
      lonMin: -115.8, lonMax: -109.4 
    },
    "Campeche": { 
      latMin: 17.8, latMax: 20.9, 
      lonMin: -92.5, lonMax: -89.1 
    },
    "Colima": { 
      latMin: 18.7, latMax: 19.6, 
      lonMin: -104.7, lonMax: -103.5 
    },
    "Quintana Roo": { 
      latMin: 17.8, latMax: 21.6, 
      lonMin: -89.4, lonMax: -86.7 
    }
  };

  // Ciudades principales por estado para detección más precisa
  private readonly CIUDADES_PRINCIPALES = {
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
    ],
    "Ciudad de México": [
      { nombre: 'Ciudad de México', coords: [19.4326, -99.1332], radio: 0.5 }
    ],
    "Nuevo León": [
      { nombre: 'Monterrey', coords: [25.6866, -100.3161], radio: 0.4 },
      { nombre: 'Guadalupe', coords: [25.6785, -100.2597], radio: 0.2 },
      { nombre: 'San Nicolás', coords: [25.7481, -100.2997], radio: 0.2 }
    ],
    "Yucatán": [
      { nombre: 'Mérida', coords: [20.9674, -89.5926], radio: 0.4 },
      { nombre: 'Valladolid', coords: [20.6906, -88.2025], radio: 0.15 }
    ]
  };

  /**
   * Detectar ubicación usando GPS del dispositivo
   */
  async detectarUbicacionGPS(): Promise<UbicacionDetectada | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.log('Geolocalización no disponible');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          console.log(`📍 GPS detectado: ${lat}, ${lon}`);
          
          // Intentar con APIs de geocodificación
          const ubicacion = await this.geocodificarCoordenadas(lat, lon);
          if (ubicacion) {
            resolve({
              ...ubicacion,
              latitud: lat,
              longitud: lon,
              fuente: 'gps'
            });
          } else {
            // Fallback con mapeo de coordenadas
            const ubicacionFallback = this.mapearCoordenadasAEstado(lat, lon);
            resolve(ubicacionFallback);
          }
        },
        (error) => {
          console.log('Error GPS:', error.message);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        }
      );
    });
  }

  /**
   * Geocodificar coordenadas usando múltiples APIs
   */
  private async geocodificarCoordenadas(lat: number, lon: number): Promise<{
    estado: string;
    ciudad: string;
    precision: 'alta' | 'media';
  } | null> {
    for (const api of this.APIs_GEOCODIFICACION) {
      try {
        console.log(`🌐 Probando API: ${api.nombre}`);
        const response = await fetch(api.url(lat, lon));
        
        if (!response.ok) continue;
        
        const data = await response.json();
        const resultado = api.procesarRespuesta(data);
        
        if (resultado.estado && resultado.ciudad) {
          console.log(`✅ ${api.nombre}: ${resultado.ciudad}, ${resultado.estado}`);
          return resultado;
        }
      } catch (error) {
        console.log(`❌ Error en ${api.nombre}:`, error);
      }
    }
    
    return null;
  }

  /**
   * Mapear coordenadas a estado usando límites geográficos
   */
  private mapearCoordenadasAEstado(lat: number, lon: number): UbicacionDetectada {
    for (const [estado, limites] of Object.entries(this.LIMITES_ESTADOS)) {
      if (lat >= limites.latMin && lat <= limites.latMax && 
          lon >= limites.lonMin && lon <= limites.lonMax) {
        
        // Intentar detectar ciudad específica
        const ciudad = this.detectarCiudad(lat, lon, estado);
        
        return {
          estado,
          ciudad: ciudad || `${estado} (ubicación aproximada)`,
          latitud: lat,
          longitud: lon,
          precision: ciudad ? 'media' : 'baja',
          fuente: 'gps'
        };
      }
    }
    
    return {
      estado: 'No detectado',
      ciudad: 'Ubicación desconocida',
      latitud: lat,
      longitud: lon,
      precision: 'baja',
      fuente: 'gps'
    };
  }

  /**
   * Detectar ciudad específica dentro del estado
   */
  private detectarCiudad(lat: number, lon: number, estado: string): string | null {
    const ciudades = this.CIUDADES_PRINCIPALES[estado as keyof typeof this.CIUDADES_PRINCIPALES] || [];
    
    for (const ciudad of ciudades) {
      const distancia = this.calcularDistancia(lat, lon, ciudad.coords[0], ciudad.coords[1]);
      if (distancia <= ciudad.radio) {
        return ciudad.nombre;
      }
    }
    
    return null;
  }

  /**
   * Calcular distancia entre dos puntos en grados (aproximada)
   */
  private calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dlat = lat2 - lat1;
    const dlon = lon2 - lon1;
    return Math.sqrt(dlat * dlat + dlon * dlon);
  }

  /**
   * Normalizar nombres de estados
   */
  private normalizarEstado(estado: string | undefined): string {
    if (!estado) return '';
    
    const normalizaciones: { [key: string]: string } = {
      'cdmx': 'Ciudad de México',
      'df': 'Ciudad de México',
      'distrito federal': 'Ciudad de México',
      'edomex': 'Estado de México',
      'estado de mexico': 'Estado de México',
      'bc': 'Baja California',
      'bcs': 'Baja California Sur',
      'nl': 'Nuevo León',
      'nuevo leon': 'Nuevo León',
      'san luis potosi': 'San Luis Potosí',
      'queretaro': 'Querétaro',
      'michoacan': 'Michoacán',
      'yucatan': 'Yucatán'
    };
    
    const estadoLower = estado.toLowerCase().trim();
    return normalizaciones[estadoLower] || 
           estado.split(' ').map(word => 
             word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
           ).join(' ');
  }

  /**
   * Detectar ubicación por IP como fallback
   */
  async detectarUbicacionPorIP(): Promise<UbicacionDetectada | null> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.country_code === 'MX' && data.region) {
        const estado = this.normalizarEstado(data.region);
        return {
          estado,
          ciudad: data.city || `${estado} (detectado por IP)`,
          latitud: data.latitude,
          longitud: data.longitude,
          precision: 'baja',
          fuente: 'ip'
        };
      }
    } catch (error) {
      console.log('Error detectando por IP:', error);
    }
    
    return null;
  }

  /**
   * Función principal para detectar ubicación
   */
  async detectarUbicacion(): Promise<UbicacionDetectada> {
    console.log('🔍 Iniciando detección de ubicación...');
    
    // Intentar GPS primero
    const ubicacionGPS = await this.detectarUbicacionGPS();
    if (ubicacionGPS && ubicacionGPS.estado !== 'No detectado') {
      console.log('✅ Ubicación detectada por GPS');
      return ubicacionGPS;
    }
    
    // Fallback a IP
    console.log('📡 Intentando detectar por IP...');
    const ubicacionIP = await this.detectarUbicacionPorIP();
    if (ubicacionIP) {
      console.log('✅ Ubicación detectada por IP');
      return ubicacionIP;
    }
    
    // Ubicación por defecto
    console.log('❌ No se pudo detectar ubicación, usando por defecto');
    return {
      estado: 'Ciudad de México',
      ciudad: 'Ciudad de México',
      latitud: 19.4326,
      longitud: -99.1332,
      precision: 'baja',
      fuente: 'manual'
    };
  }
}

// Instancia singleton del detector
export const detectorUbicacion = new DetectorUbicacionMejorado();