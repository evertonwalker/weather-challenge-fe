<script setup lang="ts">
import TitlePage from '@/presentation/components/TitlePage.vue'
import ButtonPlace from '@/presentation/components/ButtonPlace.vue'
import { storeToRefs } from 'pinia'
import { useWeatherStore } from '@/application/stores/weatherStore'

const places = [
  {
    name: 'Denver',
    color: '#C3E0FB'
  },
  {
    name: 'Rio de Janeiro',
    color: '#C3E0FB'
  },
  {
    name: 'Madrid',
    color: '#C3E0FB'

  }, {
    name: 'Japan',
    color: '#C3E0FB'
  },
  {
    name: ' Australia',
    color: '#C3E0FB'
  },
]

const selectPlace = (place: string) => {
  weatherStore.fetchWeatherByPlace(place)
}

const weatherStore = useWeatherStore()
const { weather, isLoading, errorMessage, selectedPlace } = storeToRefs(weatherStore)

</script>

<template>
  <div class="main-container">
    <TitlePage name="Samantha" />
    <div class="places-and-weather-container">
      <div class="places-container">
        <ButtonPlace v-for="place in places" :key="place.name" :name="place.name" :color="place.color"
          @click="selectPlace(place.name)" />
      </div>
      <div class="weather-container">
        <p v-if="isLoading" class="feedback">Loading weather for {{ selectedPlace }}...</p>
        <p v-else-if="errorMessage" class="feedback feedback--error">{{ errorMessage }}</p>
        <div v-else-if="weather" class="weather-summary">
          <h2>{{ weather.location.name }}, {{ weather.location.country }}</h2>
          <p>{{ weather.current.condition.text }} - {{ weather.current.temp_c }}C</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100vh;
  padding: 1rem;
  gap: 3rem;
  margin: 0 auto;


  @media (min-width: 768px) {
    width: 80%;
    padding: 2rem;
  }

  @media (min-width: 1024px) {
    width: 80%;
    padding: 4rem;
  }
}

.places-and-weather-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;

  .places-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .places-container::-webkit-scrollbar {
    display: none;
  }

  .places-container :deep(.button-place) {
    flex: 0 0 auto;
  }
}

.feedback {
  color: var(--color-primary);
}

.feedback--error {
  color: #d7263d;
}

.weather-summary {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: var(--color-primary);
}
</style>
