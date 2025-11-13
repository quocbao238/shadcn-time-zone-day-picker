'use client'

import { useEffect } from 'react'
import { useTimezoneStore } from '@/hooks/use-timezone'

/**
 * Component to ensure timezone store is hydrated on mount
 * This ensures that persisted timezone is loaded before any page renders
 */
export function TimezoneHydration() {
  useEffect(() => {
    // Zustand persist automatically rehydrates on mount
    // Mark as hydrated after component mounts (client-side only)
    const timer = setTimeout(() => {
      useTimezoneStore.getState().setHasHydrated(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return null
}
