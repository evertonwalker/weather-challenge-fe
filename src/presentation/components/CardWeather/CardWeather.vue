<template>
  <article class="card-weather" :data-is-mobile="isMobileViewport"
    :style="{ backgroundColor: dayWeather.backgroundColor, padding: articlePadding }">

    <div class="card-weather__left">
      <div class="card-weather__icon-wrapper" :style="iconWrapperStyle">
        <img class="card-weather__icon" :src="dayWeather.iconUrl" :alt="dayWeather.conditionText" />
      </div>
      <div class="card-weather__content">
        <h2 class="card-weather__title" :style="titleStyle">{{ dayWeather.name }}
        </h2>
        <p class="card-weather__condition">{{ dayWeather.conditionText }}</p>
      </div>
    </div>

    <div class="card-weather__temperature-container">
      <p class="card-weather__temperature" :style="temperatureTextStyle">{{
        Math.round(dayWeather.temperatureC) }}</p><span class="card-weather__temperature-unit"
        :style="temperatureUnitStyle">°C</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Day } from '@/domain/models/Day'
import { useIsMobile } from '@/composables/useIsMobile'
import { computed } from 'vue'

const props = defineProps<{
  dayWeather: Day
  smallCard?: boolean
}>()

const { isMobileViewport } = useIsMobile()

const articlePadding = computed(() => {
  const mobile = isMobileViewport.value
  const small = props.smallCard

  if (mobile && small) return '2rem 1rem'
  if (mobile && !small) return '3rem 1rem'
  if (!mobile && small) return '0.5rem 1rem'
  return '3rem'
})

const iconWrapperStyle = computed(() => {
  const mobile = isMobileViewport.value
  const small = props.smallCard

  if (mobile && small) {
    return { height: '60px', width: '60px', backgroundColor: 'transparent' }
  }
  if (mobile && !small) {
    return { height: '60px', width: '60px', backgroundColor: 'white' }
  }
  if (!mobile && small) {
    return { height: '60px', width: '60px', backgroundColor: 'transparent' }
  }
  return { height: '80px', width: '80px', backgroundColor: 'white' }
})

const titleStyle = computed(() => {
  const mobile = isMobileViewport.value
  const small = props.smallCard

  if (mobile && small) return { fontSize: '1rem' }
  if (mobile && !small) return { fontSize: '1.5rem' }
  if (!mobile && small) return { fontSize: '1.2rem' }
  return { fontSize: '2rem' }
})

const temperatureTextStyle = computed(() => {
  const mobile = isMobileViewport.value
  const small = props.smallCard

  if (mobile && small) return { fontSize: '1.5rem' }
  if (mobile && !small) return { fontSize: '3rem' }
  if (!mobile && small) return { fontSize: '2rem' }
  return { fontSize: '3rem' }
})

const temperatureUnitStyle = computed(() => {
  const mobile = isMobileViewport.value
  const small = props.smallCard

  if (mobile && small) return { fontSize: '1rem' }
  if (mobile && !small) return { fontSize: '1.5rem' }
  if (!mobile && small) return { fontSize: '1rem' }
  return { fontSize: '1.5rem' }
})
</script>

<style scoped>
.card-weather {
  width: 100%;
  height: 70px;
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  @media (min-width: 1024px) {
    border-radius: 24px;
    width: 220px;
    height: auto;
    flex-direction: column;
    align-items: center;
    padding: 3rem;
  }
}

.card-weather__left {
  display: flex;
  align-items: center;
  gap: 8px;


  @media (min-width: 1024px) {
    flex-direction: column;
    align-items: center;
  }
}

.card-weather__icon-wrapper {
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-weather__icon {
  width: 60px;
  height: 60px;
}

.card-weather__title {
  color: var(--color-primary);
  font-size: 1.2rem;
  font-weight: var(--font-weight-semibold);
  line-height: 1.1;
}

.card-weather__condition {
  margin-top: 0.25rem;
  color: rgba(0, 17, 51, 0.42);
  font-size: 1rem;
  font-weight: var(--font-weight-medium);
  line-height: 1;
}

.card-weather__content {
  text-align: left;

  @media (min-width: 1024px) {
    text-align: center;
  }
}

.card-weather__temperature-container {
  display: flex;
  align-items: normal;
  justify-content: center;
  gap: 0.25rem;

  .card-weather__temperature {
    color: var(--color-primary);
    font-size: 3rem;
    font-weight: var(--font-weight-semibold);
    line-height: 1;

    @media (min-width: 1024px) {
      font-size: 5rem;
    }
  }

  .card-weather__temperature-unit {
    font-size: 1.5rem;
  }
}
</style>
