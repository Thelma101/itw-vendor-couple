import { Link } from 'react-router-dom'

export type LogoVariant = 'default' | 'white' | 'dark' | 'icon'

interface LogoProps {
  width?: number | string
  height?: number | string
  variant?: LogoVariant
  className?: string
  /** When true, wraps logo in a link to `/` */
  linkToHome?: boolean
}

const LOGO_SRC: Record<LogoVariant, string> = {
  default: '/brand/logo.svg',
  dark: '/brand/logo.svg',
  white: '/brand/logo-white.svg',
  icon: '/brand/icon.svg',
}

export default function Logo({
  width,
  height = 40,
  variant = 'default',
  className = '',
  linkToHome = false,
}: LogoProps) {
  const img = (
    <img
      src={LOGO_SRC[variant]}
      alt="iTheeWed"
      width={width}
      height={height}
      className={className}
      style={{
        display: 'block',
        height: typeof height === 'number' ? `${height}px` : height,
        width: width ? (typeof width === 'number' ? `${width}px` : width) : 'auto',
        objectFit: 'contain',
      }}
    />
  )

  if (linkToHome) {
    return (
      <Link to="/" aria-label="iTheeWed home" className="inline-flex items-center">
        {img}
      </Link>
    )
  }

  return img
}
