<template>
  <div class="scales">
    <div class="scales-row">
      <Icon name="time" />
      <div class="scales-ruler time-ruler">
        <div
          class="time-ruler-line"
          :style="{ '--time': `${time}s` }"
        />
      </div>
    </div>
    <div class="scales-row">
      <Icon name="question" />
      <div
        class="scales-ruler questions-ruler"
        :style="{ '--questions': questions }"
      >
        <div
          v-for="i in questions"
          :key="i"
          class="questions-ruler-item"
          :class="{
            'questions-ruler-item-approved': answers[i-1],
            'questions-ruler-item-skipped': answers[i-1] === 0
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  time: { type: Number, required: true },
  questions: { type: Number, required: true },
  answers: { type: Array, required: true }
})
</script>

<style lang="scss" scoped>
.scales {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;

  &-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &-ruler {
    position: relative;
    flex-grow: 1;
    border: $border-main;
    height: 2rem;
  }
}

.time-ruler {
  background-color: $color-outcontent;

  &-line {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    transform-origin: 0 0;
    animation: timer var(--time) linear;
  }
}

.questions-ruler {
  background-color: var(--color-grey-1);
  display: grid;
  grid-template-columns: repeat(var(--questions), 1fr);
  gap: 1px;

  &-item {
    background-color: $color-outcontent;
  }

  &-item-approved {
    background-color: $color-primary;
  }

  &-item-skipped {
    background-color: var(--color-gold-3);
  }
}

@keyframes timer {
  0% {
    transform: scaleX(1);
    background-color: $color-primary;
  }
  100% {
    transform: scaleX(0);
    background-color: $color-alarm;
  }
}
</style>
