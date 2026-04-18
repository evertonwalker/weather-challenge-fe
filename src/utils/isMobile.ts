/** Viewport width strictly below 1024px (matches common `min-width: 1024px` breakpoints). */
export function isMobile(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return window.innerWidth < 1024
}
