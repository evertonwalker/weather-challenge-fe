<template>
  <article class="small-card-weather">
    <p class="small-card-weather__time">{{ time }}</p>

    <div class="small-card-weather__icon-wrapper" :style="{ backgroundColor }">
      <img class="small-card-weather__icon" :src="iconUrl" :alt="time" />
    </div>

    <p class="small-card-weather__temp">
      {{ Math.round(temperatureC) }}<span>°C</span>
    </p>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  time: string
  iconUrl: string
  backgroundColor: string
  temperatureC: number
}>()
</script>

<style scoped>
.small-card-weather {
  /* Parent is a flex row with overflow-x: auto — without this, flex shrinks items below width */
  box-sizing: border-box;
  flex: 0 0 auto;
  /* Altere width/min-width — com flex: 0 0 auto o valor passa a ser respeitado */
  width: 125px;
  height: 160px;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  ;
}

.small-card-weather__time {
  font-size: 1.2rem;
  font-weight: var(--font-weight-medium);
  color: var(--color-primary);
  opacity: 0.75;
}

.small-card-weather__icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.small-card-weather__icon {
  height: 50px;
}

.small-card-weather__temp {
  display: flex;
  gap: 0.25rem;
  font-size: 1.3rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  line-height: 1;
}
</style>
