'use client'

import { useEffect } from 'react'

export default function LastPassCleanup() {
  useEffect(() => {
    // Remove LastPass injected elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeType === 1 &&
            (node as Element).hasAttribute?.('data-lastpass-icon-root')
          ) {
            (node as Element).remove()
          }
        })
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })

    // Clean up on initial load
    document.querySelectorAll('[data-lastpass-icon-root]').forEach((el) => el.remove())

    // Cleanup observer on unmount
    return () => observer.disconnect()
  }, [])

  return null
}