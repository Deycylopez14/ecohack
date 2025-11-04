import React from 'react'

interface Slide {
  title: string
  body: string
  image: string
  alt: string
}

const defaultSlides: Slide[] = [
  {
    title: 'Aprende y mejora',
    body: 'Infografías y quizzes para reciclar mejor cada día. ¡Pequeñas acciones, gran impacto!',
    image: '/illustrations/education.svg',
    alt: 'Ilustración educativa sobre reciclaje'
  },
  {
    title: 'Juega y gana',
    body: 'Diviértete con mini-juegos, suma puntos y canjea recompensas eco.',
    image: '/illustrations/games.svg',
    alt: 'Ilustración de videojuegos ecológicos'
  },
  {
    title: 'Mapa de reciclaje',
    body: 'Encuentra contenedores cercanos y elige el correcto para cada residuo.',
    image: '/illustrations/map.svg',
    alt: 'Mapa con puntos de reciclaje'
  },
  {
    title: 'Comunidad eco',
    body: 'Comparte tus logros y motívate con personas que cuidan el planeta.',
    image: '/illustrations/community.svg',
    alt: 'Personas formando una comunidad eco'
  },
]

export default function FeatureCarousel({ slides = defaultSlides }: { slides?: Slide[] }) {
  const [index, setIndex] = React.useState(0)
  const timerRef = React.useRef<number | null>(null)
  const total = slides.length

  const stop = () => { if (timerRef.current) { window.clearInterval(timerRef.current); timerRef.current = null } }
  const start = () => {
    stop()
    timerRef.current = window.setInterval(() => setIndex(i => (i + 1) % total), 5000)
  }

  React.useEffect(() => { start(); return stop }, [total])

  const go = (i: number) => setIndex((i + total) % total)

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1) }
  }

  return (
    <section
      aria-label="Descubre EcoHack"
      aria-roledescription="carousel"
      className="mt-4 mb-8"
      onMouseEnter={stop}
      onMouseLeave={start}
      onKeyDown={onKeyDown}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
  <div className="relative rounded-2xl shadow overflow-hidden h-64 sm:h-72" style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>
        {slides.map((s, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} de ${total}`}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 h-full items-center">
              <img src={s.image} alt={s.alt} className="w-full h-40 sm:h-full object-cover rounded-xl border" style={{ borderColor: 'var(--color-border)' }} />
              <div className="flex flex-col justify-center px-1 text-center sm:text-left">
                <h3 className="font-bold text-lg sm:text-xl mb-1" style={{ color: 'var(--color-primary)' }}>{s.title}</h3>
                <p className="text-sm sm:text-base leading-snug" style={{ color: 'var(--color-text-secondary)' }}>{s.body}</p>
              </div>
            </div>
          </div>
        ))}
        {/* Controles ocultos (accesibles con teclado) */}
        <button aria-label="Anterior" onClick={() => go(index - 1)} className="sr-only">Anterior</button>
        <button aria-label="Siguiente" onClick={() => go(index + 1)} className="sr-only">Siguiente</button>
        {/* Indicadores */}
        <div className="absolute left-0 right-0 bottom-2 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Ir al slide ${i + 1}`}
              onClick={() => go(i)}
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: i === index ? 'var(--color-primary)' : 'var(--color-border)' }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
