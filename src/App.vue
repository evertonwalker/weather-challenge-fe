<template>
  <div class="main-container">
    <TitlePage name="Samantha" />
    <div class="places-and-weather-container">
      <div class="places-container">
        <ButtonPlace v-for="place in placesAvailables" :key="place.name" :name="place.name"
          :color="isActivePlace(place.name) ? '#C3E0FB' : 'transparent'" :is-active="isActivePlace(place.name)"
          @click="selectPlace(place.name)" />
      </div>
      <div class="weather-container">
        <p v-if="isLoading" class="feedback">Loading weather for {{ selectedPlace }}...</p>
        <p v-else-if="errorMessage" class="feedback feedback--error">{{ errorMessage }}</p>
        <CardWeather v-else-if="weather" :card-weather="cardWeather" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TitlePage from '@/presentation/components/TitlePage.vue'
import ButtonPlace from '@/presentation/components/ButtonPlace.vue'
import CardWeather from '@/presentation/components/CardWeather.vue'
import { storeToRefs } from 'pinia'
import { useWeatherStore } from '@/application/stores/weatherStore'
import { onMounted } from 'vue'

const placesAvailables = [
  {
    name: 'Denver',
  },
  {
    name: 'Rio de Janeiro',
  },
  {
    name: 'Madrid',

  }, {
    name: 'Japan',
  },
  {
    name: ' Australia',
  },
]

const selectPlace = (place: string) => {
  weatherStore.fetchWeatherByPlace(place)
}

const weatherStore = useWeatherStore()
const { weather, cardWeather, isLoading, errorMessage, selectedPlace } = storeToRefs(weatherStore)
const isActivePlace = (place: string) => {
  return selectedPlace.value === place
}

onMounted(() => {
  selectPlace('Denver')
})
</script>

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
</style>
