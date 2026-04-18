const STORAGE_KEY = 'weather-challenge-saved-places'

export function loadSavedPlaces(): string[] {
  if (typeof localStorage === 'undefined') {
    return []
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is string => typeof item === 'string' && item.trim().length > 0,
    )
  } catch {
    return []
  }
}

/** Persist a place after a successful search in the API (name resolved by the service). */
export function addSavedPlace(name: string): void {
  if (typeof localStorage === 'undefined') {
    return
  }
  const trimmed = name.trim()
  if (!trimmed) return

  const existing = loadSavedPlaces()
  if (existing.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
    return
  }

  existing.push(trimmed)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
}
