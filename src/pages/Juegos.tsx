import React from 'react'
import Button from '../components/Button'
import { ensureProfile } from '../lib/gamification'
import { useGamification } from '../contexts/GamificationContext'

type WasteItem = {
  id: string
  name: string
  type: 'organico' | 'plastico' | 'papel' | 'vidrio'
  emoji: string
}

type Bin = {
  type: 'organico' | 'plastico' | 'papel' | 'vidrio'
  name: string
  color: string
  emoji: string
}

const WASTE_ITEMS: WasteItem[] = [
  { id: '1', name: 'Botella de plástico', type: 'plastico', emoji: '🍶' },
  { id: '2', name: 'Cáscara de manzana', type: 'organico', emoji: '🍎' },
  { id: '3', name: 'Periódico', type: 'papel', emoji: '📰' },
  { id: '4', name: 'Frasco de vidrio', type: 'vidrio', emoji: '🫙' },
  { id: '5', name: 'Envase yogurt', type: 'plastico', emoji: '🥛' },
  { id: '6', name: 'Cáscara de plátano', type: 'organico', emoji: '🍌' },
  { id: '7', name: 'Cartón', type: 'papel', emoji: '📦' },
  { id: '8', name: 'Botella de vino', type: 'vidrio', emoji: '🍷' }
]

const BINS: Bin[] = [
  { type: 'organico', name: 'Orgánico', color: '#84cc16', emoji: '🗑️' },
  { type: 'plastico', name: 'Plástico', color: '#eab308', emoji: '♻️' },
  { type: 'papel', name: 'Papel', color: '#3b82f6', emoji: '📄' },
  { type: 'vidrio', name: 'Vidrio', color: '#10b981', emoji: '🥃' }
]

function ClasificadorGame() {
  const [items, setItems] = React.useState<WasteItem[]>([])
  const [score, setScore] = React.useState(0)
  const [timeLeft, setTimeLeft] = React.useState(60)
  const [gameActive, setGameActive] = React.useState(false)
  const [feedback, setFeedback] = React.useState<string>('')
  const [selectedItem, setSelectedItem] = React.useState<WasteItem | null>(null)
  const [isMobile, setIsMobile] = React.useState(false)
  const { addPoints } = useGamification()

  React.useEffect(() => { 
    ensureProfile()
    // Detectar dispositivo móvil
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  React.useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      endGame()
    }
  }, [gameActive, timeLeft])

  const startGame = () => {
    setItems(WASTE_ITEMS.sort(() => Math.random() - 0.5).slice(0, 5))
    setScore(0)
    setTimeLeft(60)
    setGameActive(true)
    setFeedback('')
    setSelectedItem(null)
  }

  const endGame = async () => {
    setGameActive(false)
    if (score > 0) {
      const success = await addPoints(score)
      if (success) {
        setFeedback(`¡Juego terminado! Ganaste ${score} puntos.`)
      } else {
        setFeedback('¡Juego terminado! Error al guardar puntos.')
      }
    } else {
      setFeedback('¡Inténtalo de nuevo!')
    }
  }

  // === EVENTOS DRAG & DROP PARA DESKTOP ===
  const onDragStart = (e: React.DragEvent, item: WasteItem) => {
    e.dataTransfer.setData('text/plain', item.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const onDrop = (e: React.DragEvent, binType: string) => {
    e.preventDefault()
    const itemId = e.dataTransfer.getData('text/plain')
    const item = items.find(i => i.id === itemId)
    if (item) {
      handleItemPlacement(item, binType)
    }
  }

  // === EVENTOS TÁCTILES PARA MÓVIL ===
  const onItemTouchStart = (item: WasteItem) => {
    if (!gameActive) return
    setSelectedItem(item)
    setFeedback(`${item.name} seleccionado. Toca un contenedor.`)
  }

  const onBinTouch = (binType: string) => {
    if (!gameActive || !selectedItem) return
    handleItemPlacement(selectedItem, binType)
  }

  // === LÓGICA COMÚN DE CLASIFICACIÓN ===
  const handleItemPlacement = (item: WasteItem, binType: string) => {
    const correct = item.type === binType
    if (correct) {
      setScore(score + 10)
      setItems(items.filter(i => i.id !== item.id))
      setFeedback('¡Correcto! +10 puntos 🎉')
      if (items.length === 1) endGame()
    } else {
      setFeedback('¡Incorrecto! Inténtalo de nuevo ❌')
    }
    setSelectedItem(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <span className="font-bold">Puntos: {score}</span>
          <span className="font-bold">Tiempo: {timeLeft}s</span>
        </div>
        {!gameActive && (
          <Button onClick={startGame} size="md">
            {score > 0 ? 'Jugar de nuevo' : 'Iniciar juego'}
          </Button>
        )}
      </div>

      {/* INSTRUCCIONES AL INICIO */}
      <div className="p-4 rounded-lg" style={{ background: 'var(--color-surface)' }}>
        <h4 className="font-bold text-lg mb-2">🎮 Cómo jugar el Clasificador de Basura:</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg border-l-4 border-blue-500" style={{ background: 'var(--color-background)' }}>
            <p className="font-semibold text-blue-600">📱 En móvil/tablet:</p>
            <p className="text-sm">1. Toca el residuo que quieres clasificar</p>
            <p className="text-sm">2. Se marcará con ✓ verde</p>
            <p className="text-sm">3. Toca el contenedor correcto</p>
            <p className="text-sm">4. ¡Ganas puntos por clasificar bien!</p>
          </div>
          
          <div className="p-3 rounded-lg border-l-4 border-green-500" style={{ background: 'var(--color-background)' }}>
            <p className="font-semibold text-green-600">💻 En computadora:</p>
            <p className="text-sm">1. Arrastra el residuo con el mouse</p>
            <p className="text-sm">2. Suéltalo en el contenedor correcto</p>
            <p className="text-sm">3. También puedes hacer clic + clic</p>
            <p className="text-sm">4. ¡Ganas puntos por clasificar bien!</p>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3 rounded-lg text-center font-bold" style={{ background: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }}>
          {feedback}
        </div>
      )}

      {isMobile && gameActive && (
        <div className="p-3 rounded-lg bg-blue-100 text-blue-800 text-sm text-center">
          📱 Modo táctil: Toca un residuo para seleccionarlo, luego toca el contenedor correcto
        </div>
      )}

      {gameActive && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BINS.map(bin => (
              <div
                key={bin.type}
                className={`p-4 rounded-xl border-2 text-center min-h-24 flex flex-col items-center justify-center transition-all cursor-pointer ${
                  selectedItem ? 'border-dashed hover:scale-105' : 'border-solid'
                }`}
                style={{ 
                  borderColor: bin.color, 
                  background: selectedItem ? `${bin.color}40` : `${bin.color}20`,
                  transform: selectedItem ? 'scale(1.02)' : 'scale(1)'
                }}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, bin.type)}
                onClick={() => onBinTouch(bin.type)}
                role="button"
                tabIndex={0}
                aria-label={`Contenedor ${bin.name}`}
              >
                <span className="text-2xl mb-1">{bin.emoji}</span>
                <span className="font-bold text-sm">{bin.name}</span>
                {selectedItem && (
                  <span className="text-xs mt-1 text-gray-600">👆 Toca aquí</span>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="font-bold">
              {isMobile ? 'Selecciona un residuo y luego su contenedor:' : 'Arrastra cada residuo al contenedor correcto:'}
            </h3>
            <div className="flex flex-wrap gap-3">
              {items.map(item => (
                <div
                  key={item.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isMobile ? 'cursor-pointer active:scale-95' : 'cursor-move hover:scale-105'
                  } ${
                    selectedItem?.id === item.id ? 'border-green-500 bg-green-100 shadow-lg' : ''
                  }`}
                  style={{ 
                    background: selectedItem?.id === item.id ? '#dcfce7' : 'var(--color-surface)', 
                    borderColor: selectedItem?.id === item.id ? '#22c55e' : 'var(--color-border)',
                    borderWidth: selectedItem?.id === item.id ? '2px' : '1px'
                  }}
                  draggable={!isMobile}
                  onDragStart={(e) => onDragStart(e, item)}
                  onClick={() => onItemTouchStart(item)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${item.name} - Toca para seleccionar`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.emoji}</span>
                    <span className="font-medium">{item.name}</span>
                    {selectedItem?.id === item.id && (
                      <span className="text-green-600 text-sm">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// === AVENTURA ECO GAME CON CONTROLES MÓVILES ===
interface AventuraPlayer {
  x: number
  y: number
  velocityY: number
  isJumping: boolean
}

interface Bottle {
  id: number
  x: number
  y: number
  collected: boolean
}

interface Obstacle {
  id: number
  x: number
  y: number
  width: number
  height: number
}

function AventuraGame() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const gameLoopRef = React.useRef<number>()
  const [score, setScore] = React.useState(0)
  const [gameActive, setGameActive] = React.useState(false)
  const [gameOver, setGameOver] = React.useState(false)
  const [player, setPlayer] = React.useState<AventuraPlayer>({ x: 50, y: 300, velocityY: 0, isJumping: false })
  const [bottles, setBottles] = React.useState<Bottle[]>([])
  const [obstacles, setObstacles] = React.useState<Obstacle[]>([])
  const [keys, setKeys] = React.useState<Set<string>>(new Set())
  const [isMobile, setIsMobile] = React.useState(false)
  const { addPoints } = useGamification()
  
  // Estados para gestos táctiles modernos
  const [touchStart, setTouchStart] = React.useState<{x: number, y: number, time: number} | null>(null)
  const [lastTap, setLastTap] = React.useState<number>(0)
  const [moveDirection, setMoveDirection] = React.useState<'left' | 'right' | null>(null)

  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 400
  const GRAVITY = 0.8
  const JUMP_FORCE = -15
  const PLAYER_SPEED = 5
  const GROUND_Y = CANVAS_HEIGHT - 50

  React.useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const generateBottle = React.useCallback(() => {
    return {
      id: Math.random(),
      x: CANVAS_WIDTH + Math.random() * 200,
      y: GROUND_Y - 30 - Math.random() * 100,
      collected: false
    }
  }, [])

  const generateObstacle = React.useCallback(() => {
    return {
      id: Math.random(),
      x: CANVAS_WIDTH + Math.random() * 300,
      y: GROUND_Y - 40,
      width: 30,
      height: 40
    }
  }, [])

  const startGame = React.useCallback(() => {
    setGameActive(true)
    setGameOver(false)
    setScore(0)
    setPlayer({ x: 50, y: GROUND_Y - 40, velocityY: 0, isJumping: false })
    setBottles([generateBottle(), generateBottle()])
    setObstacles([generateObstacle()])
  }, [generateBottle, generateObstacle])

  const endGame = React.useCallback(async () => {
    setGameActive(false)
    setGameOver(true)
    if (score > 0) {
      try {
        await addPoints(score)
      } catch (error) {
        console.error('Error al añadir puntos:', error)
      }
    }
  }, [score, addPoints])

  // === CONTROLES MÓVILES ===
  const moveLeft = () => {
    setKeys(prev => new Set(prev).add('ArrowLeft'))
    setTimeout(() => setKeys(prev => {
      const newKeys = new Set(prev)
      newKeys.delete('ArrowLeft')
      return newKeys
    }), 100)
  }

  const moveRight = () => {
    setKeys(prev => new Set(prev).add('ArrowRight'))
    setTimeout(() => setKeys(prev => {
      const newKeys = new Set(prev)
      newKeys.delete('ArrowRight')
      return newKeys
    }), 100)
  }

  const jump = () => {
    setKeys(prev => new Set(prev).add(' '))
    setTimeout(() => setKeys(prev => {
      const newKeys = new Set(prev)
      newKeys.delete(' ')
      return newKeys
    }), 200)
  }

  // === GESTOS TÁCTILES MODERNOS ===
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    const currentTime = Date.now()
    
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: currentTime
    })

    // Detectar doble tap para salto súper alto
    if (currentTime - lastTap < 300) {
      // Salto súper alto en doble tap
      setKeys(prev => new Set(prev).add('SuperJump'))
      setTimeout(() => setKeys(prev => {
        const newKeys = new Set(prev)
        newKeys.delete('SuperJump')
        return newKeys
      }), 200)
      setLastTap(0)
    } else {
      // Tap simple para salto normal
      setTimeout(() => {
        if (Date.now() - currentTime > 300) { // Solo si no fue doble tap
          jump()
        }
      }, 300)
      setLastTap(currentTime)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    if (!touchStart || !gameActive) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    
    // Solo procesar swipes significativos (más de 50px)
    if (distance > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0 && moveDirection !== 'right') {
        setMoveDirection('right')
        setKeys(prev => {
          const newKeys = new Set(prev)
          newKeys.delete('ArrowLeft')
          newKeys.add('ArrowRight')
          return newKeys
        })
      } else if (deltaX < 0 && moveDirection !== 'left') {
        setMoveDirection('left')
        setKeys(prev => {
          const newKeys = new Set(prev)
          newKeys.delete('ArrowRight')
          newKeys.add('ArrowLeft')
          return newKeys
        })
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    setTouchStart(null)
    setMoveDirection(null)
    
    // Detener movimiento
    setKeys(prev => {
      const newKeys = new Set(prev)
      newKeys.delete('ArrowLeft')
      newKeys.delete('ArrowRight')
      return newKeys
    })
  }

  // Game physics and update
  const updateGame = React.useCallback(() => {
    if (!gameActive || gameOver) return

    setPlayer(prevPlayer => {
      let newPlayer = { ...prevPlayer }
      
      // Movement
      if (keys.has('ArrowLeft') && newPlayer.x > 0) {
        newPlayer.x -= PLAYER_SPEED
      }
      if (keys.has('ArrowRight') && newPlayer.x < CANVAS_WIDTH - 40) {
        newPlayer.x += PLAYER_SPEED
      }
      if (keys.has(' ') && !newPlayer.isJumping) {
        newPlayer.velocityY = JUMP_FORCE
        newPlayer.isJumping = true
      }
      
      // Super salto para doble tap
      if (keys.has('SuperJump') && !newPlayer.isJumping) {
        newPlayer.velocityY = JUMP_FORCE * 1.5 // Salto más alto
        newPlayer.isJumping = true
      }

      // Gravity
      newPlayer.velocityY += GRAVITY
      newPlayer.y += newPlayer.velocityY

      // Ground collision
      if (newPlayer.y >= GROUND_Y - 40) {
        newPlayer.y = GROUND_Y - 40
        newPlayer.velocityY = 0
        newPlayer.isJumping = false
      }

      return newPlayer
    })

    // Update bottles
    setBottles(prevBottles => {
      return prevBottles.map(bottle => {
        const newBottle = { ...bottle, x: bottle.x - 3 }
        
        // Check collision with player
        if (!newBottle.collected && 
            player.x < newBottle.x + 25 && player.x + 40 > newBottle.x &&
            player.y < newBottle.y + 25 && player.y + 40 > newBottle.y) {
          newBottle.collected = true
          setScore(prev => prev + 5)
        }

        return newBottle
      }).filter(bottle => bottle.x > -50 && !bottle.collected)
    })

    // Update obstacles
    setObstacles(prevObstacles => {
      return prevObstacles.map(obstacle => ({
        ...obstacle,
        x: obstacle.x - 4
      })).filter(obstacle => obstacle.x > -100)
    })

    // Check obstacle collisions
    obstacles.forEach(obstacle => {
      if (player.x < obstacle.x + obstacle.width && player.x + 40 > obstacle.x &&
          player.y < obstacle.y + obstacle.height && player.y + 40 > obstacle.y) {
        endGame()
      }
    })

    // Spawn new items
    if (Math.random() < 0.02) {
      setBottles(prev => [...prev, generateBottle()])
    }
    if (Math.random() < 0.01) {
      setObstacles(prev => [...prev, generateObstacle()])
    }
  }, [gameActive, gameOver, keys, player, obstacles, endGame, generateBottle, generateObstacle])

  // Render game - Versión mejorada y más bonita
  const render = React.useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Gradient sky background animado
    const time = Date.now() * 0.001
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
    gradient.addColorStop(0, `hsl(${200 + Math.sin(time) * 20}, 80%, 85%)`)
    gradient.addColorStop(0.7, `hsl(${220 + Math.sin(time) * 15}, 70%, 90%)`)
    gradient.addColorStop(1, `hsl(${240 + Math.sin(time) * 10}, 60%, 95%)`)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Nubes animadas y más detalladas
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    for (let i = 0; i < 5; i++) {
      const x = (time * 20 + i * 150) % (CANVAS_WIDTH + 100) - 50
      const y = 60 + i * 30 + Math.sin(time + i) * 10
      const size = 20 + i * 5
      
      // Crear nubes más realistas
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.arc(x + size * 0.8, y, size * 1.2, 0, Math.PI * 2)
      ctx.arc(x + size * 1.6, y, size, 0, Math.PI * 2)
      ctx.arc(x + size * 0.8, y - size * 0.5, size * 0.8, 0, Math.PI * 2)
      ctx.fill()
    }

    // Suelo con textura de césped mejorada
    const groundGradient = ctx.createLinearGradient(0, GROUND_Y, 0, GROUND_Y + 50)
    groundGradient.addColorStop(0, '#2E8B57')
    groundGradient.addColorStop(0.3, '#32CD32')
    groundGradient.addColorStop(1, '#228B22')
    ctx.fillStyle = groundGradient
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 50)

    // Detalles de césped más elaborados
    ctx.fillStyle = '#90EE90'
    for (let i = 0; i < CANVAS_WIDTH; i += 15) {
      const grassHeight = 8 + Math.sin(i * 0.1 + time * 2) * 3
      ctx.fillRect(i, GROUND_Y - grassHeight, 3, grassHeight)
      ctx.fillRect(i + 7, GROUND_Y - grassHeight * 0.7, 2, grassHeight * 0.7)
    }

    // Flores ocasionales en el suelo
    if (Math.sin(time * 0.5) > 0.8) {
      for (let i = 0; i < 3; i++) {
        const flowerX = (time * 10 + i * 200) % CANVAS_WIDTH
        ctx.fillStyle = ['#FF69B4', '#FFB6C1', '#FFA500'][i]
        ctx.font = '12px Arial'
        ctx.fillText('🌸', flowerX, GROUND_Y - 5)
      }
    }

    // Sombra del jugador más realista
    const playerShadow = ctx.createRadialGradient(player.x + 20, GROUND_Y, 0, player.x + 20, GROUND_Y, 30)
    playerShadow.addColorStop(0, 'rgba(0, 0, 0, 0.4)')
    playerShadow.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = playerShadow
    ctx.fillRect(player.x - 10, GROUND_Y - 3, 60, 8)

    // Jugador con animación de caminar
    const walkCycle = Math.sin(time * 8) * 2
    
    // Cuerpo del jugador con gradiente
    const bodyGradient = ctx.createLinearGradient(player.x, player.y, player.x, player.y + 40)
    bodyGradient.addColorStop(0, '#4169E1')
    bodyGradient.addColorStop(1, '#1E3A8A')
    ctx.fillStyle = bodyGradient
    ctx.fillRect(player.x + 8, player.y + 15, 24, 25)
    
    // Brazos con movimiento
    ctx.fillStyle = '#FFE4B5'
    ctx.fillRect(player.x + 2 + walkCycle, player.y + 18, 8, 15)
    ctx.fillRect(player.x + 30 - walkCycle, player.y + 18, 8, 15)
    
    // Piernas con animación de caminar
    ctx.fillStyle = '#000080'
    ctx.fillRect(player.x + 10 + walkCycle, player.y + 32, 6, 12)
    ctx.fillRect(player.x + 24 - walkCycle, player.y + 32, 6, 12)
    
    // Cabeza con mejor sombreado
    const headGradient = ctx.createRadialGradient(player.x + 20, player.y + 10, 0, player.x + 20, player.y + 10, 15)
    headGradient.addColorStop(0, '#FFDBAC')
    headGradient.addColorStop(1, '#FFE4B5')
    ctx.fillStyle = headGradient
    ctx.beginPath()
    ctx.arc(player.x + 20, player.y + 10, 12, 0, Math.PI * 2)
    ctx.fill()
    
    // Cara más expresiva
    ctx.font = 'bold 18px Arial'
    ctx.textAlign = 'center'
    ctx.fillStyle = '#000'
    if (keys.has('ArrowLeft') || keys.has('ArrowRight')) {
      ctx.fillText('😄', player.x + 20, player.y + 16) // Feliz corriendo
    } else if (player.isJumping) {
      ctx.fillText('😮', player.x + 20, player.y + 16) // Sorprendido saltando
    } else {
      ctx.fillText('😊', player.x + 20, player.y + 16) // Normal
    }

    // Botellas con efectos brillantes y animación
    bottles.forEach(bottle => {
      if (!bottle.collected) {
        // Efecto de brillo pulsante
        const pulseSize = 5 + Math.sin(time * 4) * 3
        const glowGradient = ctx.createRadialGradient(bottle.x + 15, bottle.y + 15, 0, bottle.x + 15, bottle.y + 15, 25 + pulseSize)
        glowGradient.addColorStop(0, 'rgba(0, 255, 255, 0.6)')
        glowGradient.addColorStop(0.5, 'rgba(0, 200, 255, 0.3)')
        glowGradient.addColorStop(1, 'rgba(0, 255, 255, 0)')
        ctx.fillStyle = glowGradient
        ctx.fillRect(bottle.x - 15, bottle.y - 15, 60, 60)
        
        // Botella con gradiente y rotación
        ctx.save()
        ctx.translate(bottle.x + 15, bottle.y + 15)
        ctx.rotate(Math.sin(time * 2 + bottle.x * 0.01) * 0.1)
        
        const bottleGradient = ctx.createLinearGradient(0, -15, 0, 15)
        bottleGradient.addColorStop(0, '#40E0D0')
        bottleGradient.addColorStop(0.5, '#00CED1')
        bottleGradient.addColorStop(1, '#008B8B')
        ctx.fillStyle = bottleGradient
        ctx.fillRect(-15, -15, 30, 30)
        
        // Etiqueta de la botella
        ctx.fillStyle = '#FFF'
        ctx.fillRect(-12, -8, 24, 6)
        
        ctx.font = 'bold 24px Arial'
        ctx.fillStyle = '#FFF'
        ctx.textAlign = 'center'
        ctx.fillText('♻️', 0, 8)
        ctx.restore()
        
        // Partículas alrededor de la botella
        for (let i = 0; i < 3; i++) {
          const angle = time * 2 + i * (Math.PI * 2 / 3)
          const particleX = bottle.x + 15 + Math.cos(angle) * 20
          const particleY = bottle.y + 15 + Math.sin(angle) * 15
          ctx.fillStyle = `rgba(0, 255, 255, ${0.7 - Math.sin(time * 3 + i) * 0.3})`
          ctx.beginPath()
          ctx.arc(particleX, particleY, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    })

    // Obstáculos con mejor diseño y sombras
    obstacles.forEach(obstacle => {
      // Sombra del obstáculo
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.fillRect(obstacle.x + 8, GROUND_Y + 2, obstacle.width, 8)
      
      // Obstáculo con gradiente y textura
      const obstacleGradient = ctx.createLinearGradient(obstacle.x, obstacle.y, obstacle.x, obstacle.y + obstacle.height)
      obstacleGradient.addColorStop(0, '#8B4513')
      obstacleGradient.addColorStop(0.5, '#A0522D')
      obstacleGradient.addColorStop(1, '#654321')
      ctx.fillStyle = obstacleGradient
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
      
      // Detalles del obstáculo
      ctx.fillStyle = '#8B4513'
      ctx.fillRect(obstacle.x + 2, obstacle.y + 5, obstacle.width - 4, 3)
      ctx.fillRect(obstacle.x + 2, obstacle.y + obstacle.height - 8, obstacle.width - 4, 3)
      
      // Emoji de basura más grande y con sombra
      ctx.font = 'bold 32px Arial'
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
      ctx.textAlign = 'center'
      ctx.fillText('🗑️', obstacle.x + obstacle.width/2 + 2, obstacle.y + obstacle.height/2 + 12)
      
      ctx.fillStyle = '#333'
      ctx.fillText('🗑️', obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2 + 10)
    })

    // Puntuación con efectos visuales mejorados
    if (gameActive) {
      ctx.font = 'bold 28px Arial'
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 4
      ctx.textAlign = 'left'
      
      // Sombra del texto
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillText(`💎 ${score}`, 22, 42)
      
      // Texto principal con gradiente
      const scoreGradient = ctx.createLinearGradient(20, 20, 20, 50)
      scoreGradient.addColorStop(0, '#FFD700')
      scoreGradient.addColorStop(1, '#FFA500')
      ctx.fillStyle = scoreGradient
      ctx.strokeText(`💎 ${score}`, 20, 40)
      ctx.fillText(`💎 ${score}`, 20, 40)
    }
    
    // Indicador visual para móvil
    if (isMobile && gameActive) {
      ctx.font = 'bold 16px Arial'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.lineWidth = 2
      ctx.textAlign = 'center'
      
      // Instrucciones con fondo semitransparente
      const instructionText = 'Tap=Saltar | DoubleTap=SuperSalto | Swipe←→=Mover'
      const textWidth = ctx.measureText(instructionText).width
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillRect(CANVAS_WIDTH/2 - textWidth/2 - 10, CANVAS_HEIGHT - 35, textWidth + 20, 25)
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.strokeText(instructionText, CANVAS_WIDTH/2, CANVAS_HEIGHT - 20)
      ctx.fillText(instructionText, CANVAS_WIDTH/2, CANVAS_HEIGHT - 20)
    }
  }, [player, bottles, obstacles, score, gameActive, isMobile, keys])

  // Keyboard handlers para desktop
  React.useEffect(() => {
    if (isMobile) return

    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(e.code === 'Space' ? ' ' : e.key))
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev)
        newKeys.delete(e.code === 'Space' ? ' ' : e.key)
        return newKeys
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isMobile])

  // Game loop
  React.useEffect(() => {
    if (gameActive && !gameOver) {
      gameLoopRef.current = setInterval(() => {
        updateGame()
        render()
      }, 1000 / 60) // 60 FPS

      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current)
        }
      }
    }
  }, [gameActive, gameOver, updateGame, render])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <span className="font-bold">Puntos: {score}</span>
          {gameOver && <span className="font-bold text-red-500">¡Juego terminado!</span>}
        </div>
        {!gameActive && (
          <Button onClick={startGame} size="md">
            {gameOver ? 'Jugar de nuevo' : 'Iniciar aventura'}
          </Button>
        )}
      </div>

      {/* INSTRUCCIONES AL INICIO */}
      <div className="text-sm space-y-2" style={{ color: 'var(--color-text-secondary)' }}>
        <p className="font-semibold">🎮 Cómo jugar:</p>
        <p>• 🍼 Recoge botellas para ganar 5 puntos cada una</p>
        <p>• 🗑️ Evita los obstáculos de basura</p>
        
        <div className="grid md:grid-cols-2 gap-4 mt-3">
          <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface)' }}>
            <p className="font-semibold text-blue-600">📱 Controles modernos móvil:</p>
            <p>• 👆 <strong>Tap simple</strong> en pantalla para saltar</p>
            <p>• 👆👆 <strong>Doble tap</strong> para salto súper alto</p>
            <p>• 👈 <strong>Swipe izquierda</strong> para moverte a la izquierda</p>
            <p>• 👉 <strong>Swipe derecha</strong> para moverte a la derecha</p>
            <p>• 🎮 ¡Totalmente intuitivo como juegos modernos!</p>
          </div>
          
          <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface)' }}>
            <p className="font-semibold text-green-600">💻 En computadora:</p>
            <p>• Usa las flechas del teclado ←→</p>
            <p>• Presiona ESPACIO para saltar</p>
            <p>• También funciona con WASD</p>
          </div>
        </div>
      </div>

      <div className="relative border-4 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-sky-400 to-sky-200" style={{ borderColor: 'var(--color-primary)' }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block max-w-full h-auto cursor-pointer transition-all hover:scale-[1.02]"
          style={{ 
            background: 'linear-gradient(to bottom, #87CEEB, #98E4FF)',
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={isMobile ? jump : undefined}
        />
        
        {/* Overlay de efectos para móvil */}
        {isMobile && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Indicadores visuales de las zonas de swipe */}
            <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-blue-500/10 to-transparent"></div>
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-500/10 to-transparent"></div>
            <div className="absolute top-0 left-1/3 w-1/3 h-full bg-green-500/5"></div>
          </div>
        )}
      </div>

      {/* INDICADOR DE GESTOS PARA MÓVIL */}
      {isMobile && gameActive && (
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white p-4 rounded-xl text-center shadow-lg animate-pulse">
          <p className="font-bold text-lg">🎮 ¡Controles Súper Modernos Activos!</p>
          <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
            <div className="bg-white/20 rounded-lg p-2">
              <p>👈 <strong>Swipe ←</strong></p>
              <p>Ir izquierda</p>
            </div>
            <div className="bg-white/20 rounded-lg p-2">
              <p>👆 <strong>Tap / DoubleTap</strong></p>
              <p>Salto / SuperSalto</p>
            </div>
            <div className="bg-white/20 rounded-lg p-2">
              <p>👉 <strong>Swipe →</strong></p>
              <p>Ir derecha</p>
            </div>
          </div>
        </div>
      )}

      {/* CONTROLES MÓVILES ALTERNATIVOS */}
      {isMobile && gameActive && (
        <div className="space-y-3">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">🎮 Controles Alternativos (opcional)</p>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            <button
              onTouchStart={moveLeft}
              onMouseDown={moveLeft}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl text-2xl font-bold active:scale-95 transition-all shadow-lg hover:shadow-xl"
              style={{ touchAction: 'manipulation' }}
            >
              <div className="flex flex-col items-center">
                <span>⬅️</span>
                <span className="text-xs mt-1">IZQUIERDA</span>
              </div>
            </button>
            <button
              onTouchStart={jump}
              onMouseDown={jump}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl text-2xl font-bold active:scale-95 transition-all shadow-lg hover:shadow-xl"
              style={{ touchAction: 'manipulation' }}
            >
              <div className="flex flex-col items-center">
                <span>🚀</span>
                <span className="text-xs mt-1">SALTO</span>
              </div>
            </button>
            <button
              onTouchStart={moveRight}
              onMouseDown={moveRight}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl text-2xl font-bold active:scale-95 transition-all shadow-lg hover:shadow-xl"
              style={{ touchAction: 'manipulation' }}
            >
              <div className="flex flex-col items-center">
                <span>➡️</span>
                <span className="text-xs mt-1">DERECHA</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// === COMPONENTE PRINCIPAL JUEGOS ===
export default function Juegos() {
  const [currentGame, setCurrentGame] = React.useState<'menu' | 'clasificador' | 'aventura'>('menu')

  if (currentGame === 'clasificador') {
    return (
      <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <header className="flex items-center gap-2 p-4 border-b" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <button onClick={() => setCurrentGame('menu')} className="text-2xl">⬅️</button>
          <img src="/icons/ecohack.png" alt="Logo EcoHack" className="w-10 h-10" />
          <span className="font-bold text-xl">Clasificador de Basura</span>
        </header>
        <main className="p-4">
          <ClasificadorGame />
        </main>
      </div>
    )
  }

  if (currentGame === 'aventura') {
    return (
      <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }}>
        <header className="flex items-center gap-2 p-4 border-b" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <button onClick={() => setCurrentGame('menu')} className="text-2xl">⬅️</button>
          <img src="/icons/ecohack.png" alt="Logo EcoHack" className="w-10 h-10" />
          <span className="font-bold text-xl">Aventura Eco</span>
        </header>
        <main className="p-4">
          <AventuraGame />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }} role="main">
      <header className="flex items-center gap-2 p-4 border-b" role="banner" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <img src="/icons/ecohack.png" alt="Logo EcoHack" className="w-10 h-10" />
        <span className="font-bold text-xl" style={{letterSpacing: '1px'}}>EcoHack</span>
      </header>
      <main className="p-4" tabIndex={0} aria-label="Mini-Juegos">
        <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Mini-Juegos</h1>
        <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>Diviértete y gana puntos con nuestros juegos, podrías recibir varias recompensas.</p>
        <div className="space-y-4">
          <div className="rounded-xl p-4 shadow" tabIndex={0} aria-label="Clasificador de basura" style={{ background: 'var(--color-surface)' }}>
            <h2 className="font-bold text-lg mb-1">Clasificador de basura</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>Arrastra los residuos al bote correcto antes de que se acabe el tiempo.</p>
            <Button className="mt-2" size="md" tabIndex={0} onClick={() => setCurrentGame('clasificador')}>Jugar ahora</Button>
          </div>
          <div className="rounded-xl p-4 shadow" tabIndex={0} aria-label="Aventura Eco" style={{ background: 'var(--color-surface)' }}>
            <h2 className="font-bold text-lg mb-1">Aventura Eco</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>Un juego de plataformas donde recoges botellas y esquivas obstáculos.</p>
            <Button className="mt-2" size="md" tabIndex={0} onClick={() => setCurrentGame('aventura')}>Jugar ahora</Button>
          </div>
        </div>
      </main>
    </div>
  )
}