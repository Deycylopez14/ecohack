import React from 'react'

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'surface'
  | 'outline'
  | 'ghost'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const sizeClass: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
}

const baseClass = [
  'inline-flex items-center justify-center rounded-full font-bold',
  'transition-all duration-150 focus:outline-none focus:ring',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'shadow-sm select-none',
].join(' ')

function stylesForVariant(variant: ButtonVariant): React.CSSProperties {
  switch (variant) {
    case 'primary':
      return { background: 'var(--color-primary)', color: 'var(--color-on-primary)' }
    case 'secondary':
      return { background: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }
    case 'accent':
      return { background: 'var(--color-accent)', color: 'var(--color-on-accent)' }
    case 'success':
      return { background: 'var(--color-success)', color: 'var(--color-on-success)' }
    case 'warning':
      return { background: 'var(--color-warning)', color: 'var(--color-on-warning)' }
    case 'error':
      return { background: 'var(--color-error)', color: 'var(--color-on-error)' }
    case 'info':
      return { background: 'var(--color-info)', color: 'var(--color-on-info)' }
    case 'surface':
      return {
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        borderColor: 'var(--color-border)',
        borderWidth: '1px',
        borderStyle: 'solid',
      }
    case 'outline':
      return {
        background: 'transparent',
        color: 'var(--color-primary)',
        borderColor: 'var(--color-primary)',
        borderWidth: '2px',
        borderStyle: 'solid',
      }
    case 'ghost':
      return {
        background: 'transparent',
        color: 'var(--color-primary)',
      }
    default:
      return { background: 'var(--color-primary)', color: 'var(--color-on-primary)' }
  }
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  style,
  children,
  ...rest
}: ButtonProps) {
  const variantStyle = stylesForVariant(variant)
  const widthClass = fullWidth ? 'w-full' : ''
  const hoverClass =
    variant === 'surface' || variant === 'outline' || variant === 'ghost'
      ? 'hover:opacity-80 active:opacity-90'
      : 'hover:opacity-95 active:opacity-90'

  return (
    <button
      className={[baseClass, sizeClass[size], widthClass, hoverClass, className].filter(Boolean).join(' ')}
      style={{ ...variantStyle, ...style }}
      {...rest}
    >
      {children}
    </button>
  )
}
