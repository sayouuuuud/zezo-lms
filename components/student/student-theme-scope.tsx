'use client'

import { useEffect } from 'react'

/**
 * The student portal uses the dashboard palette (`.theme-dashboard`) instead of
 * the public site palette that lives on `:root`. The layout wrapper already
 * carries the class for the page itself, but portalled UI (dialogs, sheets,
 * dropdowns, toasts) is rendered into <body>, so the scope has to be mirrored
 * there while a student route is mounted.
 */
export function StudentThemeScope() {
  useEffect(() => {
    document.body.classList.add('theme-dashboard')
    return () => document.body.classList.remove('theme-dashboard')
  }, [])

  return null
}
