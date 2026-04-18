import { describe, it, expect, beforeEach } from 'vitest'

import { SavedPlacesLocalStorageRepository } from '@/infrastructure/persistence/SavedPlacesLocalStorageRepository'

const KEY = 'weather-challenge-saved-places'

describe('SavedPlacesLocalStorageRepository', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loadAll returns empty when storage is empty', () => {
    const repo = new SavedPlacesLocalStorageRepository()
    expect(repo.loadAll()).toEqual([])
  })

  it('loadAll parses valid JSON array of strings', () => {
    localStorage.setItem(KEY, JSON.stringify(['A', 'B']))
    const repo = new SavedPlacesLocalStorageRepository()
    expect(repo.loadAll()).toEqual(['A', 'B'])
  })

  it('loadAll ignores non-string entries and empty strings', () => {
    localStorage.setItem(KEY, JSON.stringify(['Ok', '', '  ', 99, null]))
    const repo = new SavedPlacesLocalStorageRepository()
    expect(repo.loadAll()).toEqual(['Ok'])
  })

  it('loadAll returns empty on invalid JSON', () => {
    localStorage.setItem(KEY, 'not-json')
    const repo = new SavedPlacesLocalStorageRepository()
    expect(repo.loadAll()).toEqual([])
  })

  it('addIfNew appends trimmed name', () => {
    const repo = new SavedPlacesLocalStorageRepository()
    repo.addIfNew('  Paris  ')
    expect(repo.loadAll()).toEqual(['Paris'])
  })

  it('addIfNew does nothing for blank name', () => {
    const repo = new SavedPlacesLocalStorageRepository()
    repo.addIfNew('   ')
    expect(repo.loadAll()).toEqual([])
  })

  it('addIfNew skips duplicate case-insensitively', () => {
    const repo = new SavedPlacesLocalStorageRepository()
    repo.addIfNew('Lisbon')
    repo.addIfNew('lisbon')
    repo.addIfNew('LISBON')
    expect(repo.loadAll()).toEqual(['Lisbon'])
  })
})
