import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  href?: string
  width?: number
  height?: number
  className?: string
  showLink?: boolean
}

export default function Logo({
  href = "/",
  width = 120,
  height = 40,
  className = "",
  showLink = true,
}: LogoProps) {
  const image = (
    <Image
      src="/logo.png"
      alt="Miranda - Collège Mvong"
      width={width}
      height={height}
      className={`object-contain ${className}`}
      priority
    />
  )

  if (!showLink) return image

  return (
    <Link
      href={href}
      className="inline-flex items-center hover:opacity-80 transition-opacity duration-200"
    >
      {image}
    </Link>
  )
}
