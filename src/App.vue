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
        <template v-else-if="weather">
          <div class="weather-container-loaded-data-container">
            <CardWeather :day-weather="currentDayWeather" />
            <div class="small-card-weather-list-and-next-days-weather-list-container">
              <div class="small-card-weather-list">
                <SmallCardWeather v-for="(card, index) in smallCardWeatherList"
                  :key="`${card.time}-${card.iconUrl}-${index}`" :time="card.time" :icon-url="card.iconUrl"
                  :background-color="card.backgroundColor" :temperature-c="card.temperatureC" />
              </div>
              <div class="next-days-weather-list">
                <CardWeather v-for="day in nextDaysWeather" :key="day.name" :day-weather="day" :small-card="true" />
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TitlePage from '@/presentation/components/TitlePage.vue'
import ButtonPlace from '@/presentation/components/ButtonPlace.vue'
import CardWeather from '@/presentation/components/CardWeather.vue'
import SmallCardWeather from '@/presentation/components/SmallCardWeather.vue'
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
const { weather, currentDayWeather, nextDaysWeather, isLoading, errorMessage, selectedPlace, smallCardWeatherList } = storeToRefs(weatherStore)
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


  @media (min-width: 768px) {
    width: 80%;
    padding: 2rem;
    margin: 0 auto;
  }

  @media (min-width: 1024px) {
    width: 80%;
    padding: 4rem;
  }
}

.weather-container-loaded-data-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;



  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    height: 400px;
    flex-direction: row;
    gap: 2rem;
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

.small-card-weather-list-and-next-days-weather-list-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;

  /* Each direct child uses half of the container along the main axis */
  >.small-card-weather-list,
  >.next-days-weather-list {
    box-sizing: border-box;
    min-width: 0;
    min-height: 0;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;

    >.small-card-weather-list,
    >.next-days-weather-list {
      flex: 1 1 50%;
      max-width: 50%;
    }
  }

  @media (min-width: 1024px) {
    flex: 1;
    flex-direction: column;
    gap: 2rem;
    min-height: 0;

    >.small-card-weather-list,
    >.next-days-weather-list {
      flex: 1 1 50%;
      max-width: none;
      width: 100%;
      max-height: 50%;
    }
  }
}

.next-days-weather-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    flex-direction: row;
    gap: 2rem;
  }
}

.feedback {
  color: var(--color-primary);
}

.feedback--error {
  color: #d7263d;
}

.small-card-weather-list {
  width: 100%;
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.small-card-weather-list::-webkit-scrollbar {
  display: none;
}
</style>
