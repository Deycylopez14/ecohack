import React from 'react'
import Button from '../components/Button'
import { addPoints, ensureProfile } from '../lib/gamification'

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
      await addPoints(score)
      setFeedback(`¡Juego terminado! Ganaste ${score} puntos.`)
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

          <div className="space-y-3">
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
  }, [score])

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

  // Render game
  const render = React.useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#87CEEB'
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw ground
    ctx.fillStyle = '#228B22'
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 50)

    // Draw player
    ctx.fillStyle = '#FFD700'
    ctx.fillRect(player.x, player.y, 40, 40)
    ctx.fillStyle = '#000'
    ctx.font = '20px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('🚶', player.x + 20, player.y + 25)

    // Draw bottles
    bottles.forEach(bottle => {
      if (!bottle.collected) {
        ctx.fillStyle = '#00CED1'
        ctx.fillRect(bottle.x, bottle.y, 25, 25)
        ctx.fillStyle = '#000'
        ctx.font = '16px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('🍼', bottle.x + 12, bottle.y + 18)
      }
    })

    // Draw obstacles
    obstacles.forEach(obstacle => {
      ctx.fillStyle = '#8B4513'
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
      ctx.fillStyle = '#000'
      ctx.font = '16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('🗑️', obstacle.x + 15, obstacle.y + 25)
    })

    // Draw UI
    ctx.fillStyle = '#000'
    ctx.font = 'bold 20px Arial'
    ctx.textAlign = 'left'
    ctx.fillText(`Puntos: ${score}`, 10, 30)
    
    if (!isMobile) {
      ctx.fillText('Usa ←→ para moverte, ESPACIO para saltar', 10, CANVAS_HEIGHT - 10)
    }
  }, [player, bottles, obstacles, score, isMobile])

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

      <div className="border-2 rounded-lg overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="block max-w-full h-auto"
          style={{ background: '#87CEEB' }}
        />
      </div>

      {/* CONTROLES MÓVILES */}
      {isMobile && gameActive && (
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          <button
            onTouchStart={moveLeft}
            onMouseDown={moveLeft}
            className="bg-blue-500 text-white p-4 rounded-lg text-2xl font-bold active:scale-95 transition-transform"
            style={{ touchAction: 'manipulation' }}
          >
            ⬅️
          </button>
          <button
            onTouchStart={jump}
            onMouseDown={jump}
            className="bg-green-500 text-white p-4 rounded-lg text-2xl font-bold active:scale-95 transition-transform"
            style={{ touchAction: 'manipulation' }}
          >
            ⬆️ SALTO
          </button>
          <button
            onTouchStart={moveRight}
            onMouseDown={moveRight}
            className="bg-blue-500 text-white p-4 rounded-lg text-2xl font-bold active:scale-95 transition-transform"
            style={{ touchAction: 'manipulation' }}
          >
            ➡️
          </button>
        </div>
      )}

      <div className="text-sm space-y-2" style={{ color: 'var(--color-text-secondary)' }}>
        <p className="font-semibold">🎮 Cómo jugar:</p>
        <p>• 🍼 Recoge botellas para ganar 5 puntos cada una</p>
        <p>• 🗑️ Evita los obstáculos de basura</p>
        
        <div className="grid md:grid-cols-2 gap-4 mt-3">
          <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface)' }}>
            <p className="font-semibold text-blue-600">📱 En móvil/tablet:</p>
            <p>• Usa los botones táctiles grandes</p>
            <p>• ⬅️ ➡️ para moverte</p>
            <p>• ⬆️ SALTO para saltar obstáculos</p>
          </div>
          
          <div className="p-3 rounded-lg" style={{ background: 'var(--color-surface)' }}>
            <p className="font-semibold text-green-600">💻 En computadora:</p>
            <p>• Usa las flechas del teclado ←→</p>
            <p>• Presiona ESPACIO para saltar</p>
            <p>• También funciona con WASD</p>
          </div>
        </div>
      </div>
    </div>
  )
}

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