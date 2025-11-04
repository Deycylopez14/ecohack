// Funcionalidades premium para competir con Google Maps
const FuncionalidadesPremium = {
  // Sistema de navegación paso a paso
  navegacionPasoAPaso: {
    calcularRuta: async (origen, destino, preferencias) => {
      // Integración con múltiples APIs de navegación
      const apis = [
        {
          nombre: 'Google Directions',
          url: `https://maps.googleapis.com/maps/api/directions/json?origin=${origen}&destination=${destino}&key=YOUR_KEY`,
          prioridad: 1
        },
        {
          nombre: 'OpenRoute Service',
          url: `https://api.openrouteservice.org/v2/directions/driving-car?start=${origen}&end=${destino}`,
          prioridad: 2
        },
        {
          nombre: 'MapBox',
          url: `https://api.mapbox.com/directions/v5/mapbox/driving/${origen};${destino}?access_token=YOUR_TOKEN`,
          prioridad: 3
        }
      ]

      for (const api of apis) {
        try {
          const ruta = await this.consultarAPINavegacion(api)
          if (ruta) return this.formatearInstrucciones(ruta)
        } catch (e) {
          console.log(`API ${api.nombre} falló, probando siguiente...`)
        }
      }
    },

    instruccionesVoz: (instrucciones, idioma = 'es') => {
      // Síntesis de voz para navegación
      const utterance = new SpeechSynthesisUtterance()
      utterance.text = instrucciones
      utterance.lang = idioma === 'es' ? 'es-MX' : 'en-US'
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  },

  // Sistema de reviews y ratings
  sistemaReviews: {
    estructura: {
      reviewId: 'uuid',
      centroId: 'centro_id',
      usuarioId: 'user_id',
      rating: 5, // 1-5 estrellas
      comentario: 'Excelente centro, muy limpio y organizado',
      fotos: ['url1.jpg', 'url2.jpg'],
      fechaVisita: '2024-01-15',
      materialEntregado: ['PET', 'Cartón', 'Aluminio'],
      tiempoEspera: 10, // minutos
      atencionPersonal: 5,
      fechaCreacion: '2024-01-16T10:30:00Z',
      likes: 15,
      reportes: 0,
      verificado: true // Si el usuario realmente visitó el lugar
    },

    calcularRatingPromedio: (reviews) => {
      const total = reviews.reduce((sum, review) => sum + review.rating, 0)
      return (total / reviews.length).toFixed(1)
    },

    filtrarReviews: (reviews, filtros) => {
      return reviews.filter(review => {
        if (filtros.rating && review.rating < filtros.rating) return false
        if (filtros.material && !review.materialEntregado.includes(filtros.material)) return false
        if (filtros.fechaDesde && review.fechaVisita < filtros.fechaDesde) return false
        return true
      })
    }
  },

  // Sistema de favoritos y listas personalizadas
  sistemaFavoritos: {
    agregarFavorito: (usuarioId, centroId, lista = 'principal') => {
      const favorito = {
        id: Date.now(),
        usuarioId: usuarioId,
        centroId: centroId,
        lista: lista,
        fechaAgregado: new Date(),
        notas: '',
        recordatorios: {
          activo: false,
          frecuencia: 'semanal', // diario, semanal, mensual
          ultimaVisita: null
        }
      }
      
      this.guardarFavorito(favorito)
      return favorito
    },

    crearListaPersonalizada: (usuarioId, nombreLista, descripcion) => {
      return {
        id: Date.now(),
        usuarioId: usuarioId,
        nombre: nombreLista,
        descripcion: descripcion,
        centros: [],
        fechaCreacion: new Date(),
        publica: false,
        compartidaCon: []
      }
    },

    listasPopulares: [
      'Cerca de mi trabajo',
      'Centros con mejor atención',
      'Acepta todo tipo de materiales',
      'Abierto fines de semana',
      'Con programa de puntos',
      'Para empresas'
    ]
  },

  // Gamificación y programa de puntos
  sistemaGamificacion: {
    puntajeUsuario: {
      visitasCentros: 0,
      materialesEntregados: [],
      kgReciclados: 0,
      reviewsEscritas: 0,
      centrosDescubiertos: 0,
      streakDias: 0, // días consecutivos reciclando
      nivel: 1,
      badges: []
    },

    badges: [
      {
        id: 'primer_reciclaje',
        nombre: 'Primera Visita',
        descripcion: 'Visitaste tu primer centro de reciclaje',
        icono: '🌱',
        condicion: 'visitasCentros >= 1'
      },
      {
        id: 'eco_warrior',
        nombre: 'Eco Guerrero',
        descripcion: 'Has reciclado más de 100kg',
        icono: '♻️',
        condicion: 'kgReciclados >= 100'
      },
      {
        id: 'explorer',
        nombre: 'Explorador Verde',
        descripcion: 'Has visitado centros en 5 estados diferentes',
        icono: '🗺️',
        condicion: 'estadosVisitados >= 5'
      },
      {
        id: 'reviewer',
        nombre: 'Crítico Ecológico',
        descripcion: 'Has escrito 10 reviews',
        icono: '⭐',
        condicion: 'reviewsEscritas >= 10'
      }
    ],

    calcularNivel: (puntos) => {
      if (puntos < 100) return 1
      if (puntos < 500) return 2
      if (puntos < 1500) return 3
      if (puntos < 3000) return 4
      return 5
    }
  },

  // Sistema de notificaciones inteligentes
  notificacionesInteligentes: {
    tiposNotificacion: {
      proximidad: {
        mensaje: '¡Hey! Hay un centro de reciclaje a 500m de ti',
        condicion: 'distancia <= 500 && !visitadoHoy',
        frecuencia: 'una_vez_por_dia'
      },
      recordatorio: {
        mensaje: 'No has reciclado en 7 días. ¿Qué tal una visita hoy?',
        condicion: 'ultimaVisita >= 7',
        frecuencia: 'semanal'
      },
      nuevosCentros: {
        mensaje: 'Se agregaron 3 nuevos centros en tu área',
        condicion: 'nuevosCentrosEnArea > 0',
        frecuencia: 'inmediata'
      },
      ofertas: {
        mensaje: 'Centro XYZ ofrece 20% más por aluminio esta semana',
        condicion: 'centroFavorito && ofertaActiva',
        frecuencia: 'cuando_disponible'
      }
    },

    configuracionUsuario: {
      proximidad: true,
      recordatorios: true,
      nuevosCentros: true,
      ofertas: false,
      horarios: {
        desde: '08:00',
        hasta: '20:00'
      },
      diasSemana: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']
    }
  },

  // Modo offline con sincronización
  modoOffline: {
    datosCache: {
      centrosCercanos: [], // Últimos 20 centros consultados
      ultimaUbicacion: null,
      reviewsOffline: [], // Reviews escritas sin conexión
      favoritosOffline: [],
      busquedasRecientes: []
    },

    sincronizarCuandoOnline: async () => {
      if (navigator.onLine) {
        // Subir reviews offline
        for (const review of this.datosCache.reviewsOffline) {
          await this.subirReview(review)
        }
        
        // Sincronizar favoritos
        for (const favorito of this.datosCache.favoritosOffline) {
          await this.sincronizarFavorito(favorito)
        }
        
        // Actualizar centros con datos frescos
        await this.actualizarCentrosCercanos()
        
        // Limpiar cache offline
        this.limpiarCacheOffline()
      }
    },

    funcionesOffline: {
      verCentrosCercanos: () => this.datosCache.centrosCercanos,
      agregarReviewOffline: (review) => this.datosCache.reviewsOffline.push(review),
      navegarACentro: (centro) => {
        // Abrir app de mapas nativa del dispositivo
        const url = `geo:${centro.latitud},${centro.longitud}?q=${centro.nombre}`
        window.open(url, '_system')
      }
    }
  }
}