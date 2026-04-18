/**
 * Persistência de nomes de lugares escolhidos pelo usuário (ex.: localStorage).
 */
export interface SavedPlacesRepository {
  loadAll(): string[]
  /** Adiciona o nome se ainda não existir (comparação case-insensitive). */
  addIfNew(name: string): void
}
