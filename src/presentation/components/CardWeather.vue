<template>
  <article class="card-weather"
    :style="{ backgroundColor: dayWeather.backgroundColor, padding: smallCard ? '1rem' : '3rem' }">

    <div class="card-weather__left">
      <div class="card-weather__icon-wrapper"
        :style="{ backgroundColor: dayWeather.backgroundColor, height: smallCard ? '40px' : '80px' }">
        <img class="card-weather__icon" :src="dayWeather.iconUrl" :alt="dayWeather.conditionText" />
      </div>
      <div class="card-weather__content">
        <h2 class="card-weather__title" :style="{ fontSize: smallCard ? '1.3rem' : '2rem' }">{{ dayWeather.name }}
        </h2>
        <p class="card-weather__condition">{{ dayWeather.conditionText }}</p>
      </div>
    </div>

    <div class="card-weather__temperature-container">
      <p class="card-weather__temperature" :style="{ fontSize: smallCard ? '1.5rem' : '3rem' }">{{
        Math.round(dayWeather.temperatureC) }}</p><span class="card-weather__temperature-unit"
        :style="{ fontSize: smallCard ? '1rem' : '1.5rem' }">°C</span>
    </div>
  </article>
</template>

<script setup lang="ts">



import type { Day } from '@/domain/models/Day';

defineProps<{
  dayWeather: Day
  smallCard?: boolean
}>()

</script>

<style scoped>
.card-weather {
  width: 100%;
  min-height: 124px;
  border-radius: 24px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (min-width: 1024px) {
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
  gap: 16px;


  @media (min-width: 1024px) {
    flex-direction: column;
    align-items: center;
  }
}

.card-weather__icon-wrapper {
  width: 80px;
  height: 80px;
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
  line-height: 1.2;
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
