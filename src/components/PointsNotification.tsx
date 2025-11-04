import React from 'react'
import { useGamification } from '../contexts/GamificationContext'

export default function PointsNotification() {
  const { recentPointsGained } = useGamification()

  if (recentPointsGained.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {recentPointsGained.map((notification) => (
        <div
          key={notification.timestamp}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg animate-bounce transform transition-all duration-500"
          style={{
            animation: 'slideInRight 0.5s ease-out, fadeOut 0.5s ease-in 4.5s forwards'
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🎉</span>
            <div>
              <p className="font-bold text-sm">¡Puntos ganados!</p>
              <p className="text-sm">+{notification.points} puntos en {notification.source}</p>
            </div>
            <span className="text-2xl">💎</span>
          </div>
        </div>
      ))}
      
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}