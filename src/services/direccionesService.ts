// Servicio para obtener direcciones usando Google Maps
export interface DireccionCompleta {
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  distancia?: number;
  tiempoEstimado?: string;
}

export class DireccionesService {
  private static readonly GOOGLE_MAPS_API = 'https://maps.googleapis.com/maps/api';
  
  static async obtenerDireccion(lat: number, lng: number): Promise<string> {
    try {
      // Usar Nominatim como alternativa gratuita a Google Maps
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=es`
      );
      
      if (!response.ok) {
        throw new Error('Error al obtener la dirección');
      }
      
      const data = await response.json();
      
      // Construir dirección legible
      const direccion = [
        data.address?.road,
        data.address?.house_number,
        data.address?.suburb || data.address?.neighbourhood,
        data.address?.city || data.address?.town || data.address?.village,
        data.address?.state,
        data.address?.country
      ].filter(Boolean).join(', ');
      
      return direccion || 'Dirección no disponible';
    } catch (error) {
      console.error('Error obteniendo dirección:', error);
      return `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
    }
  }
  
  static async buscarLugares(query: string, centro?: { lat: number; lng: number }): Promise<DireccionCompleta[]> {
    try {
      const lat = centro?.lat || 19.4326; // CDMX por defecto
      const lng = centro?.lng || -99.1332;
      
      // Usar Nominatim para búsqueda
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=mx&accept-language=es&viewbox=${lng-0.1},${lat+0.1},${lng+0.1},${lat-0.1}&bounded=1`
      );
      
      if (!response.ok) {
        throw new Error('Error en la búsqueda');
      }
      
      const data = await response.json();
      
      return data.map((item: any) => ({
        nombre: item.display_name.split(',')[0],
        direccion: item.display_name,
        latitud: parseFloat(item.lat),
        longitud: parseFloat(item.lon),
        distancia: this.calcularDistancia(lat, lng, parseFloat(item.lat), parseFloat(item.lon))
      }));
    } catch (error) {
      console.error('Error buscando lugares:', error);
      return [];
    }
  }
  
  static calcularDistancia(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLng = this.degreesToRadians(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  private static degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
  
  static obtenerUrlGoogleMaps(destino: { lat: number; lng: number }, origen?: { lat: number; lng: number }): string {
    const destinoStr = `${destino.lat},${destino.lng}`;
    
    if (origen) {
      const origenStr = `${origen.lat},${origen.lng}`;
      return `https://www.google.com/maps/dir/${origenStr}/${destinoStr}`;
    }
    
    return `https://www.google.com/maps/search/?api=1&query=${destinoStr}`;
  }
}

export default DireccionesService;