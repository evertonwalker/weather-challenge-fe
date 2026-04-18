import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './styles/reset.css'
import './styles/colors.css'
import './styles/base.css'
import App from './App.vue'
import router from './router'
import { createWeatherDependencies } from '@/application/bootstrap/dependencies'
import { getWeatherByPlaceUseCaseKey, savedPlacesRepositoryKey } from '@/core/di/injectionKeys'

const app = createApp(App)

const { getWeatherByPlaceUseCase, savedPlacesRepository } = createWeatherDependencies()
app.provide(getWeatherByPlaceUseCaseKey, getWeatherByPlaceUseCase)
app.provide(savedPlacesRepositoryKey, savedPlacesRepository)

app.use(createPinia())
app.use(router)

app.mount('#app')
