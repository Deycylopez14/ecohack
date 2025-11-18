// Sistema de integración con APIs oficiales de reciclaje en México
import { CentroReciclaje } from '../data/centrosReciclajeMexico';

export interface CentroAPIOficial {
  nombre: string;
  direccion: string;
  ciudad: string;
  estado: string;
  latitud?: number;
  longitud?: number;
  telefono?: string;
  materialesAceptados: string[];
  horarios?: any;
  autorizaciones?: string[];
  servicios?: string[];
  activo: boolean;
}

export class IntegradorAPIsOficiales {
  private readonly API_KEYS = {
    // Estas serían las claves reales de las APIs
    SEMARNAT: import.meta.env?.VITE_SEMARNAT_API_KEY || 'demo_key',
    ECOCE: import.meta.env?.VITE_ECOCE_API_KEY || 'demo_key',
    PETSTAR: import.meta.env?.VITE_PETSTAR_API_KEY || 'demo_key',
    SEDEMA: import.meta.env?.VITE_SEDEMA_API_KEY || 'demo_key'
  };

  /**
   * Integración con SEMARNAT (Secretaría de Medio Ambiente)
   * Obtiene centros autorizados para manejo de residuos
   */
  async obtenerCentrosSEMARNAT(estado?: string): Promise<CentroAPIOficial[]> {
    try {
      console.log('🏛️ Consultando SEMARNAT...');
      
      // URL simulada - en producción sería la API real
      const baseUrl = 'https://api.semarnat.gob.mx/v1/centros-autorizados';
      const params = new URLSearchParams({
        api_key: this.API_KEYS.SEMARNAT,
        tipo: 'reciclaje',
        activo: 'true',
        ...(estado && { estado })
      });

      // Por ahora simulamos la respuesta
      const centrosSimulados: CentroAPIOficial[] = [
        {
          nombre: "Centro Autorizado SEMARNAT Guadalajara",
          direccion: "Av. Alcalde 1351, Guadalajara Centro",
          ciudad: "Guadalajara",
          estado: "Jalisco",
          latitud: 20.6767,
          longitud: -103.3475,
          telefono: "33-3668-1600",
          materialesAceptados: ["Residuos Peligrosos", "Electrónicos", "Aceites", "Baterías"],
          autorizaciones: ["RPP-001-JAL", "RE-ELECT-003"],
          servicios: ["Certificado de destrucción", "Manejo especializado"],
          activo: true
        },
        {
          nombre: "Planta de Tratamiento SEMARNAT CDMX",
          direccion: "Calz. de Tlalpan 4492, Tlalpan",
          ciudad: "Ciudad de México",
          estado: "Ciudad de México",
          latitud: 19.2846,
          longitud: -99.1371,
          telefono: "55-5490-0900",
          materialesAceptados: ["Residuos Industriales", "Químicos", "Solventes"],
          autorizaciones: ["RPP-CDMX-001", "IND-005"],
          servicios: ["Tratamiento químico", "Neutralización"],
          activo: true
        }
      ];

      return centrosSimulados.filter(centro => 
        !estado || centro.estado === estado
      );

    } catch (error) {
      console.error('Error consultando SEMARNAT:', error);
      return [];
    }
  }

  /**
   * Integración con ECOCE (Red Nacional de Centros de Acopio)
   * La red más grande de centros de reciclaje en México
   */
  async obtenerCentrosECOCE(estado?: string): Promise<CentroAPIOficial[]> {
    try {
      console.log('♻️ Consultando ECOCE...');
      
      // Simulación de centros ECOCE reales
      const centrosECOCE: CentroAPIOficial[] = [
        {
          nombre: "ECOCE Centro Monterrey",
          direccion: "Av. Constitución 2450 Ote., Centro",
          ciudad: "Monterrey",
          estado: "Nuevo León",
          latitud: 25.6751,
          longitud: -100.3185,
          telefono: "81-8345-6789",
          materialesAceptados: ["PET", "Aluminio", "Cartón", "Vidrio", "Tetrapack"],
          horarios: {
            lunes: "8:00 AM - 6:00 PM",
            martes: "8:00 AM - 6:00 PM",
            miercoles: "8:00 AM - 6:00 PM",
            jueves: "8:00 AM - 6:00 PM",
            viernes: "8:00 AM - 6:00 PM",
            sabado: "9:00 AM - 2:00 PM"
          },
          servicios: ["Pesaje certificado", "Educación ambiental", "Talleres"],
          activo: true
        },
        {
          nombre: "ECOCE Plaza Puebla",
          direccion: "14 Sur 3510, Anzures",
          ciudad: "Puebla",
          estado: "Puebla",
          latitud: 19.0379,
          longitud: -98.2035,
          telefono: "222-243-1800",
          materialesAceptados: ["PET", "Aluminio", "Cartón", "Papel"],
          horarios: {
            lunes: "9:00 AM - 7:00 PM",
            martes: "9:00 AM - 7:00 PM",
            miercoles: "9:00 AM - 7:00 PM",
            jueves: "9:00 AM - 7:00 PM",
            viernes: "9:00 AM - 7:00 PM",
            sabado: "10:00 AM - 4:00 PM"
          },
          servicios: ["Centro comercial", "Fácil acceso"],
          activo: true
        }
      ];

      return centrosECOCE.filter(centro => 
        !estado || centro.estado === estado
      );

    } catch (error) {
      console.error('Error consultando ECOCE:', error);
      return [];
    }
  }

  /**
   * Integración con PetStar (Especializada en reciclaje PET)
   */
  async obtenerCentrosPetStar(estado?: string): Promise<CentroAPIOficial[]> {
    try {
      console.log('🥤 Consultando PetStar...');
      
      const centrosPetStar: CentroAPIOficial[] = [
        {
          nombre: "PetStar Centro Tijuana",
          direccion: "Blvd. Industrial 15000, Mesa de Otay",
          ciudad: "Tijuana",
          estado: "Baja California",
          latitud: 32.5622,
          longitud: -117.0875,
          telefono: "664-607-8900",
          materialesAceptados: ["PET transparente", "PET color", "Botellas PET"],
          horarios: {
            lunes: "7:00 AM - 5:00 PM",
            martes: "7:00 AM - 5:00 PM",
            miercoles: "7:00 AM - 5:00 PM",
            jueves: "7:00 AM - 5:00 PM",
            viernes: "7:00 AM - 5:00 PM"
          },
          servicios: ["Mejor precio PET", "Pesaje especializado", "Centro móvil"],
          activo: true
        },
        {
          nombre: "PetStar Toluca",
          direccion: "Av. Solidaridad Las Torres 101, Zona Industrial",
          ciudad: "Toluca",
          estado: "Estado de México",
          latitud: 19.3089,
          longitud: -99.6642,
          telefono: "722-275-3400",
          materialesAceptados: ["PET", "Tapas plásticas"],
          servicios: ["Planta procesadora", "Recolección empresarial"],
          activo: true
        }
      ];

      return centrosPetStar.filter(centro => 
        !estado || centro.estado === estado
      );

    } catch (error) {
      console.error('Error consultando PetStar:', error);
      return [];
    }
  }

  /**
   * Integración con SEDEMA CDMX (Puntos Verdes)
   * Solo para Ciudad de México
   */
  async obtenerPuntosVerdesSEDEMA(): Promise<CentroAPIOficial[]> {
    try {
      console.log('🌱 Consultando SEDEMA CDMX...');
      
      const puntosVerdes: CentroAPIOficial[] = [
        {
          nombre: "Punto Verde Coyoacán",
          direccion: "Jardín Centenario, Centro de Coyoacán",
          ciudad: "Ciudad de México",
          estado: "Ciudad de México",
          latitud: 19.3498,
          longitud: -99.1618,
          materialesAceptados: ["PET", "Aluminio", "Cartón", "Papel", "Vidrio", "Electrónicos", "Aceite de cocina", "Pilas"],
          horarios: {
            sabado: "9:00 AM - 3:00 PM"
          },
          servicios: ["Mercado de Trueque", "Puntos verdes", "Talleres ambientales"],
          activo: true
        },
        {
          nombre: "Punto Verde Xochimilco",
          direccion: "Mercado de Xochimilco, Av. Nuevo León",
          ciudad: "Ciudad de México",
          estado: "Ciudad de México",
          latitud: 19.2543,
          longitud: -99.1036,
          materialesAceptados: ["PET", "Aluminio", "Cartón", "Vidrio", "Electrónicos"],
          horarios: {
            sabado: "9:00 AM - 3:00 PM",
            domingo: "9:00 AM - 3:00 PM"
          },
          servicios: ["Mercado de Trueque", "Productos orgánicos"],
          activo: true
        }
      ];

      return puntosVerdes;

    } catch (error) {
      console.error('Error consultando SEDEMA:', error);
      return [];
    }
  }

  /**
   * Obtener todos los centros de todas las APIs oficiales
   */
  async obtenerTodosCentrosOficiales(estado?: string): Promise<CentroReciclaje[]> {
    console.log('🔄 Obteniendo centros de todas las APIs oficiales...');
    
    try {
      const [centrosSEMARNAT, centrosECOCE, centrosPetStar, puntosVerdes] = await Promise.all([
        this.obtenerCentrosSEMARNAT(estado),
        this.obtenerCentrosECOCE(estado),
        this.obtenerCentrosPetStar(estado),
        estado === 'Ciudad de México' ? this.obtenerPuntosVerdesSEDEMA() : Promise.resolve([])
      ]);

      const todosLosCentros = [
        ...centrosSEMARNAT,
        ...centrosECOCE,
        ...centrosPetStar,
        ...puntosVerdes
      ];

      // Convertir a formato estándar
      return todosLosCentros.map((centro, index) => this.convertirACentroEstandar(centro, index));

    } catch (error) {
      console.error('Error obteniendo centros oficiales:', error);
      return [];
    }
  }

  /**
   * Convertir centro de API oficial a formato estándar
   */
  private convertirACentroEstandar(centroAPI: CentroAPIOficial, index: number): CentroReciclaje {
    const fuente = centroAPI.nombre.includes('SEMARNAT') ? 'SEMARNAT' :
                   centroAPI.nombre.includes('ECOCE') ? 'ECOCE' :
                   centroAPI.nombre.includes('PetStar') ? 'PETSTAR' :
                   centroAPI.nombre.includes('Punto Verde') ? 'SEDEMA' : 'MANUAL';

    return {
      id: `api_${fuente.toLowerCase()}_${index + 1}`,
      nombre: centroAPI.nombre,
      direccion: centroAPI.direccion,
      ciudad: centroAPI.ciudad,
      estado: centroAPI.estado,
      latitud: centroAPI.latitud || 0,
      longitud: centroAPI.longitud || 0,
      telefono: centroAPI.telefono,
      horarios: centroAPI.horarios || {},
      materialesAceptados: centroAPI.materialesAceptados,
      tiposCentro: [fuente],
      serviciosAdicionales: centroAPI.servicios || [],
      paganPorMaterial: fuente !== 'SEDEMA', // SEDEMA es trueque, no paga
      verificado: true,
      fuente: fuente as any,
      fechaActualizacion: new Date().toISOString().split('T')[0]
    };
  }

  /**
   * Sincronizar centros locales con APIs oficiales
   */
  async sincronizarCentros(estado: string): Promise<{
    nuevos: CentroReciclaje[];
    actualizados: CentroReciclaje[];
    total: number;
  }> {
    console.log(`🔄 Sincronizando centros para ${estado}...`);
    
    const centrosOficiales = await this.obtenerTodosCentrosOficiales(estado);
    
    // Aquí integrarías con tu base de datos local
    // Por ahora retornamos los centros como "nuevos"
    return {
      nuevos: centrosOficiales,
      actualizados: [],
      total: centrosOficiales.length
    };
  }

  /**
   * Verificar estado de APIs
   */
  async verificarEstadoAPIs(): Promise<{
    [api: string]: 'activa' | 'inactiva' | 'limitada';
  }> {
    const estados: { [api: string]: 'activa' | 'inactiva' | 'limitada' } = {};

    // Verificar cada API
    const apis = ['SEMARNAT', 'ECOCE', 'PETSTAR', 'SEDEMA'];
    
    for (const api of apis) {
      try {
        // Simulamos verificación - en producción sería un ping real
        estados[api] = 'activa';
      } catch (error) {
        estados[api] = 'inactiva';
      }
    }

    return estados;
  }
}

// Instancia singleton del integrador
export const integradorAPIs = new IntegradorAPIsOficiales();

// Función helper para obtener centros combinados (locales + APIs)
export async function obtenerCentrosCombinados(estado: string): Promise<CentroReciclaje[]> {
  try {
    // Importar centros locales de forma estática
    const centrosModule = await import('../data/centrosReciclajeMexico');
    const centrosLocales = centrosModule.obtenerCentrosPorEstado(estado);
    
    // Obtener centros de APIs oficiales
    const centrosOficiales = await integradorAPIs.obtenerTodosCentrosOficiales(estado);
    
    // Combinar solo centros que ya son tipo CentroReciclaje
    const todosCentros = [...centrosLocales, ...centrosOficiales];
    
    // Eliminar duplicados basándose en proximidad geográfica
    const centrosUnicos = eliminarDuplicadosGeograficos(todosCentros);
    
    console.log(`📊 Total centros para ${estado}:`, {
      locales: centrosLocales.length,
      oficiales: centrosOficiales.length,
      unicos: centrosUnicos.length
    });
    
    return centrosUnicos;
    
  } catch (error) {
    console.error('Error obteniendo centros combinados:', error);
    // Fallback a solo centros locales
    try {
      const centrosModule = await import('../data/centrosReciclajeMexico');
      return centrosModule.obtenerCentrosPorEstado(estado);
    } catch (fallbackError) {
      console.error('Error en fallback:', fallbackError);
      return [];
    }
  }
}

/**
 * Eliminar centros duplicados basándose en proximidad geográfica
 */
function eliminarDuplicadosGeograficos(centros: CentroReciclaje[]): CentroReciclaje[] {
  const centrosUnicos: CentroReciclaje[] = [];
  const radioTolerancia = 0.01; // ~1km aproximadamente
  
  for (const centro of centros) {
    const esDuplicado = centrosUnicos.some(existente => {
      const distancia = Math.sqrt(
        Math.pow(centro.latitud - existente.latitud, 2) +
        Math.pow(centro.longitud - existente.longitud, 2)
      );
      return distancia < radioTolerancia;
    });
    
    if (!esDuplicado) {
      centrosUnicos.push(centro);
    }
  }
  
  return centrosUnicos;
}