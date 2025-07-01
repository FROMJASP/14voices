'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

interface UseSmoothScrollOptions {
  offset?: number
  duration?: number
  activeClass?: string
}

export function useSmoothScroll({
  offset = 80,
  duration = 800
}: UseSmoothScrollOptions = {}) {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const pathname = usePathname()

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  const scrollToElement = useCallback((elementId: string) => {
    const element = document.getElementById(elementId)
    if (!element) return

    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset
    const startPosition = window.pageYOffset
    const distance = targetPosition - startPosition
    const startTime = performance.now()

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = easeInOutCubic(progress)
      
      window.scrollTo(0, startPosition + distance * ease)

      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      } else {
        // Update URL without triggering navigation
        if (pathname === '/') {
          window.history.replaceState(null, '', `#${elementId}`)
        }
      }
    }

    requestAnimationFrame(animateScroll)
  }, [offset, duration, pathname])

  const handleAnchorClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href')
    if (!href || !href.startsWith('/#')) return

    e.preventDefault()
    const elementId = href.substring(2)
    scrollToElement(elementId)
  }, [scrollToElement])

  // Scroll spy functionality
  useEffect(() => {
    if (pathname !== '/') return

    const observerOptions = {
      rootMargin: `-${offset}px 0px -50% 0px`,
      threshold: [0, 0.25, 0.5, 0.75, 1]
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection, observerOptions)

    // Observe all sections with IDs
    const sections = document.querySelectorAll('section[id]')
    sections.forEach((section) => observer.observe(section))

    return () => {
      sections.forEach((section) => observer.unobserve(section))
    }
  }, [pathname, offset])

  // Handle initial hash on page load
  useEffect(() => {
    if (pathname === '/' && window.location.hash) {
      const elementId = window.location.hash.substring(1)
      setTimeout(() => scrollToElement(elementId), 100)
    }
  }, [pathname, scrollToElement])

  return {
    activeSection,
    scrollToElement,
    handleAnchorClick,
    isActive: (sectionId: string) => activeSection === sectionId
  }
}