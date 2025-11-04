// Base de datos completa de todos los estados de México
const ESTADOS_MEXICO_COMPLETO = {
  // Estados actuales (ya tienes)
  "Chiapas": [], 
  "Ciudad de México": [],
  "Jalisco": [],
  "Nuevo León": [],
  "Yucatán": [],
  "Veracruz": [],
  "Puebla": [],

  // Estados que faltan (25 más)
  "Aguascalientes": [
    {
      id: 701,
      name: 'Centro de Reciclaje Aguascalientes',
      coords: [21.8818, -102.2916],
      type: 'Público',
      materials: ['Papel', 'Cartón', 'Plástico', 'Vidrio'],
      address: 'Av. López Mateos 123, Aguascalientes',
      hours: 'Lun-Vie: 8:00-17:00',
      phone: '449-123-4567',
      description: 'Centro municipal de Aguascalientes',
      ciudad: 'Aguascalientes'
    }
  ],

  "Baja California": [
    {
      id: 801,
      name: 'EcoTijuana',
      coords: [32.5149, -117.0382],
      type: 'Comercial',
      materials: ['Electrónicos', 'Metal', 'Plástico'],
      address: 'Av. Revolución 456, Tijuana',
      hours: 'Lun-Sab: 8:00-18:00',
      phone: '664-987-6543',
      description: 'Centro fronterizo especializado',
      ciudad: 'Tijuana'
    },
    {
      id: 802,
      name: 'Recicladora Mexicali',
      coords: [32.6519, -115.4683],
      type: 'Público',
      materials: ['Metal', 'Aluminio', 'Cobre'],
      address: 'Calzada Independencia 789, Mexicali',
      hours: 'Lun-Vie: 7:00-16:00',
      phone: '686-123-4567',
      description: 'Centro público de Mexicali',
      ciudad: 'Mexicali'
    }
  ],

  "Baja California Sur": [
    {
      id: 901,
      name: 'Centro Verde La Paz',
      coords: [24.1426, -110.3128],
      type: 'Centro',
      materials: ['Papel', 'Cartón', 'Vidrio', 'Orgánicos'],
      address: 'Av. Álvaro Obregón 234, La Paz',
      hours: 'Mar-Sab: 9:00-17:00',
      phone: '612-345-6789',
      description: 'Centro ecológico de La Paz',
      ciudad: 'La Paz'
    }
  ],

  "Campeche": [
    {
      id: 1001,
      name: 'Reciclaje Campeche',
      coords: [19.8301, -90.5349],
      type: 'Público',
      materials: ['Papel', 'Cartón', 'Plástico'],
      address: 'Calle 59 x 16, Centro, Campeche',
      hours: 'Lun-Vie: 8:00-16:00',
      phone: '981-234-5678',
      description: 'Centro histórico de Campeche',
      ciudad: 'Campeche'
    }
  ],

  "Coahuila": [
    {
      id: 1101,
      name: 'EcoSaltillo',
      coords: [25.4232, -101.0053],
      type: 'Centro',
      materials: ['Metal', 'Aluminio', 'Acero', 'Fierro'],
      address: 'Blvd. Venustiano Carranza 567, Saltillo',
      hours: 'Lun-Sab: 7:00-17:00',
      phone: '844-567-8901',
      description: 'Centro industrial de Saltillo',
      ciudad: 'Saltillo'
    },
    {
      id: 1102,
      name: 'Recicladora Torreón',
      coords: [25.5428, -103.4068],
      type: 'Comercial',
      materials: ['Metal', 'Chatarra', 'Aluminio'],
      address: 'Av. Matamoros 890, Torreón',
      hours: 'Lun-Vie: 8:00-17:00',
      phone: '871-234-5678',
      description: 'Recicladora comercial de La Laguna',
      ciudad: 'Torreón'
    }
  ],

  "Colima": [
    {
      id: 1201,
      name: 'Centro Verde Colima',
      coords: [19.2433, -103.7240],
      type: 'Público',
      materials: ['Papel', 'Cartón', 'Plástico', 'Vidrio'],
      address: 'Av. Gonzalitos 123, Colima',
      hours: 'Lun-Vie: 8:00-17:00',
      phone: '312-345-6789',
      description: 'Centro estatal de Colima',
      ciudad: 'Colima'
    }
  ],

  // ... continuar con los 25 estados restantes
  "Durango": [],
  "Guanajuato": [],
  "Guerrero": [],
  "Hidalgo": [],
  "Estado de México": [],
  "Michoacán": [],
  "Morelos": [],
  "Nayarit": [],
  "Oaxaca": [],
  "Querétaro": [],
  "Quintana Roo": [],
  "San Luis Potosí": [],
  "Sinaloa": [],
  "Sonora": [],
  "Tabasco": [],
  "Tamaulipas": [],
  "Tlaxcala": [],
  "Zacatecas": []
}