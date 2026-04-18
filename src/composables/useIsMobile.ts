import { onMounted, onUnmounted, ref, type Ref } from 'vue'

/** Alinhado a `window.innerWidth < 1024` / breakpoint `min-width: 1024px` no CSS */
const MOBILE_MEDIA_QUERY = '(max-width: 1023px)'

/**
 * Estado reativo: `true` quando a viewport é menor que 1024px.
 * Atualiza ao cruzar o breakpoint (via `matchMedia`).
 */
export function useIsMobile(): { isMobileViewport: Ref<boolean> } {
  const isMobileViewport = ref(
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_MEDIA_QUERY).matches : false,
  )

  let mql: MediaQueryList | null = null

  const onMediaChange = (event: MediaQueryListEvent) => {
    isMobileViewport.value = event.matches
  }

  onMounted(() => {
    mql = window.matchMedia(MOBILE_MEDIA_QUERY)
    isMobileViewport.value = mql.matches
    mql.addEventListener('change', onMediaChange)
  })

  onUnmounted(() => {
    mql?.removeEventListener('change', onMediaChange)
  })

  return { isMobileViewport }
}
