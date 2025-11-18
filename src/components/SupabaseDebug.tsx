import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function SupabaseDebug() {
  const [status, setStatus] = useState<{
    connected: boolean
    user: any
    tables: string[]
    error: string | null
  }>({
    connected: false,
    user: null,
    tables: [],
    error: null
  })

  useEffect(() => {
    checkSupabaseConnection()
  }, [])

  const checkSupabaseConnection = async () => {
    try {
      // Test 1: Verificar conexión básica
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      // Test 2: Intentar hacer una query simple
      const { data: tablesData, error: tablesError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)

      setStatus({
        connected: !tablesError,
        user: user,
        tables: tablesError ? [] : ['profiles'],
        error: tablesError?.message || userError?.message || null
      })
    } catch (error: any) {
      setStatus({
        connected: false,
        user: null,
        tables: [],
        error: error.message || 'Error de conexión'
      })
    }
  }

  return (
    <div className="p-4 rounded-lg border" style={{ background: 'var(--color-surface)' }}>
      <h3 className="font-bold mb-4">🔍 Estado de Supabase</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${status.connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>Conexión: {status.connected ? 'Conectado ✅' : 'Desconectado ❌'}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${status.user ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
          <span>Usuario: {status.user ? `Logueado (${status.user.email})` : 'No logueado (modo demo)'}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${status.tables.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
          <span>Tablas: {status.tables.length > 0 ? 'Disponibles' : 'No configuradas (usando datos demo)'}</span>
        </div>

        {status.error && (
          <div className="mt-3 p-2 bg-yellow-100 text-yellow-800 rounded text-xs">
            <strong>Info:</strong> {status.error}
            <br />
            <em>La app funciona en modo demo mientras configuras Supabase.</em>
          </div>
        )}

        {!status.connected && (
          <div className="mt-3 p-3 bg-blue-50 text-blue-800 rounded text-xs">
            <strong>💡 Para conectar Supabase:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Ve a <a href="https://supabase.com" target="_blank" className="underline">supabase.com</a></li>
              <li>Crea un proyecto gratuito</li>
              <li>Ve a Settings → API</li>
              <li>Copia URL y Key al archivo .env</li>
              <li>Ejecuta el SQL del archivo docs/setup-comunidad-completo.sql</li>
            </ol>
          </div>
        )}
      </div>

      <button 
        onClick={checkSupabaseConnection}
        className="mt-3 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
      >
        🔄 Verificar de nuevo
      </button>
    </div>
  )
}