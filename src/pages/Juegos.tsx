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
  const [draggedItem, setDraggedItem] = React.useState<WasteItem | null>(null)

  React.useEffect(() => { ensureProfile() }, [])

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

  const onDragStart = (e: React.DragEvent, item: WasteItem) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const onDrop = (e: React.DragEvent, binType: string) => {
    e.preventDefault()
    if (!draggedItem || !gameActive) return

    const correct = draggedItem.type === binType
    if (correct) {
      setScore(score + 10)
      setItems(items.filter(item => item.id !== draggedItem.id))
      setFeedback('¡Correcto! +10 puntos')
      if (items.length === 1) endGame()
    } else {
      setFeedback('¡Incorrecto! Inténtalo de nuevo')
    }
    setDraggedItem(null)
  }

  React.useEffect(() => {
    // Inicializar el juego cuando el componente se monta
  }, [])

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

      {gameActive && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BINS.map(bin => (
              <div
                key={bin.type}
                className="p-4 rounded-xl border-2 border-dashed text-center min-h-24 flex flex-col items-center justify-center transition-all"
                style={{ borderColor: bin.color, background: `${bin.color}20` }}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, bin.type)}
              >
                <span className="text-2xl mb-1">{bin.emoji}</span>
                <span className="font-bold text-sm">{bin.name}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="font-bold">Arrastra cada residuo al contenedor correcto:</h3>
            <div className="flex flex-wrap gap-3">
              {items.map(item => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border cursor-move flex items-center gap-2 transition-all hover:scale-105"
                  style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                  draggable
                  onDragStart={(e) => onDragStart(e, item)}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Aventura Eco Game
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

  const CANVAS_WIDTH = 800
  const CANVAS_HEIGHT = 400
  const GRAVITY = 0.8
  const JUMP_FORCE = -15
  const PLAYER_SPEED = 5
  const GROUND_Y = CANVAS_HEIGHT - 50

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
    ctx.fillText('Usa ←→ para moverte, ESPACIO para saltar', 10, CANVAS_HEIGHT - 10)
  }, [player, bottles, obstacles, score])

  // Keyboard handlers
  React.useEffect(() => {
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
  }, [])

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

      <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        <p>• Recoge botellas para ganar 5 puntos cada una</p>
        <p>• Evita los obstáculos de basura</p>
        <p>• Usa las flechas ←→ para moverte y ESPACIO para saltar</p>
      </div>
    </div>
  )
}

export default function Juegos() {
  const [currentGame, setCurrentGame] = React.useState<'menu' | 'clasificador' | 'aventura'>('menu')

  if (currentGame === 'clasificador') {
    return (
      <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }} role="main">
        <header className="flex items-center gap-2 p-4 border-b" role="banner" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <button onClick={() => setCurrentGame('menu')} className="mr-2" aria-label="Volver">
            <span className="material-icons" style={{ color: 'var(--color-primary)' }}>arrow_back</span>
          </button>
          <img src="/icons/ecohack.png" alt="Logo EcoHack" className="w-10 h-10" />
          <span className="font-bold text-xl" style={{letterSpacing: '1px'}}>EcoHack</span>
        </header>
        <main className="p-4">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-primary)' }}>Clasificador de Basura</h1>
          <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>Arrastra los residuos al contenedor correcto. ¡10 puntos por acierto!</p>
          <ClasificadorGame />
        </main>
      </div>
    )
  }

  if (currentGame === 'aventura') {
    return (
      <div className="min-h-screen pb-16" style={{ background: 'var(--color-bg)', color: 'var(--color-text)' }} role="main">
        <header className="flex items-center gap-2 p-4 border-b" role="banner" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <button onClick={() => setCurrentGame('menu')} className="mr-2" aria-label="Volver">
            <span className="material-icons" style={{ color: 'var(--color-primary)' }}>arrow_back</span>
          </button>
          <img src="/icons/ecohack.png" alt="Logo EcoHack" className="w-10 h-10" />
          <span className="font-bold text-xl" style={{letterSpacing: '1px'}}>EcoHack</span>
        </header>
        <main className="p-4">
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-secondary)' }}>Aventura Eco</h1>
          <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>Recoge botellas y evita obstáculos. ¡5 puntos por botella!</p>
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