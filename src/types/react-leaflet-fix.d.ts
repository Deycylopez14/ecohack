// Tipos de compatibilidad para silenciar falsos positivos en el analizador del editor
// Mantiene las props usadas en el proyecto y no afecta el runtime.
declare module 'react-leaflet' {
  import * as React from 'react'

  export interface MapContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    center?: any
    zoom?: number
    scrollWheelZoom?: boolean
    className?: string
    children?: React.ReactNode
  }
  export const MapContainer: React.FC<MapContainerProps>

  export interface TileLayerProps {
    url: string
    attribution?: string
  }
  export const TileLayer: React.FC<TileLayerProps>

  export interface CircleMarkerProps {
    center: any
    radius?: number
    pathOptions?: any
    children?: React.ReactNode
  }
  export const CircleMarker: React.FC<CircleMarkerProps>

  export const Popup: React.FC<{ children?: React.ReactNode }>
  export function useMap(): any
}
