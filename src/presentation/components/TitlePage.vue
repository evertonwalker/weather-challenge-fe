<template>
    <div class="title-container">
        <h1>
            Good afternoon, {{ name }}
        </h1>
        <img class="title__icon" :src="sunnyIcon" alt="" width="48" height="48" />
    </div>
</template>

<script setup lang="ts">
import sunnyIcon from '@/assets/icons/sunny.svg'

defineProps<{
    name: string
}>()
</script>

<style scoped>
.title-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 0.5rem;

    & h1 {
        font-size: 1.3rem;
        color: var(--color-primary);
        font-weight: var(--font-weight-semibold);
        line-height: 1.2;

        @media (min-width: 768px) {
            font-size: 2rem;
        }

        @media (min-width: 1024px) {
            font-size: 3rem;
        }
    }


}

.title__icon {
    flex-shrink: 0;
}
</style>
