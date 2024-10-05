'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLenis } from 'lenis/react'

export function ScrollToTop() {
  const pathname = usePathname()
  const lenis = useLenis()

  useEffect(() => {
    // Asegurarse de que lenis está disponible
    if (lenis) {
      // Scroll hasta arriba con una animación suave
      lenis.scrollTo(0, { immediate: true })
    }
  }, [pathname, lenis])

  // Este componente no renderiza nada visualmente
  return null
}