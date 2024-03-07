<template>
  <div class="question">
    <div
      class="question-value"
      :class="{
        'appearance': appearance,
        'disappearance': disappearance
      }"
      v-html="number + '. ' + data['question_' + locale]"
    />
    <div class="question-variants">
      <button
        v-for="i in shuffled"
        :key="i"
        class="question-variants-item"
        :class="{ 'question-variants-item-selected': i === selected }"
        @click.prevent="selected = i"
      >
        <div
          :class="{
            'appearance': appearance,
            'disappearance': disappearance
          }"
          v-html="data['var_' + i + '_' + locale]"
        />
      </button>
    </div>
  </div>
  <div class="question-control">
    <Button
      :text="$t('label.approve')"
      class="question-control-button"
      :disabled="!selected || disappearance"
      @btn-click="approve(selected)"
    />
    <Button
      :text="$t('label.skip')"
      class="question-control-button"
      :disabled="disappearance"
      @btn-click="approve(0)"
    />
  </div>
</template>

<script setup>
const emit = defineEmits(['approve'])
const props = defineProps({
  data: { type: Object, required: true },
  number: { type: Number, required: true }
})

const { locale } = useI18n()
const selected = ref(null)
const disappearance = ref(false)
const appearance = ref(false)
const variants = [1,2,3,4]

const getShuffled = () => variants.sort((a, b) => 0.5 - Math.random())

const shuffled = ref(getShuffled())

watch(() => props.number, () => { shuffled.value = getShuffled() })

const handleSwitch = (e) => {
  if (variants.includes(+e.key)) selected.value = +e.key
  else if (e.key === 'Enter' && selected.value) {
    e.preventDefault()
    approve(selected.value)
  }
}

onMounted(() => { window.addEventListener('keydown', handleSwitch) })
onUnmounted(() => { window.removeEventListener('keydown', handleSwitch) })

const approve = (value) => {
  disappearance.value = true
  setTimeout(() => {
    emit('approve', value)
    selected.value = null
    appearance.value = true
    disappearance.value = false
  }, 300);
}
</script>

<style lang="scss" scoped>
.question {
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: $border-main;

  &-value {
    padding: 1.5rem;
    font-weight: 600;
    text-align: center;
  }

  &-variants {
    &-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      border-top: $border-main;
      padding: 1.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;

      &:hover,
      &:focus:not(.question-variants-item-selected) {
        background-color: var(--color-grey-2);
      }
    }

    &-item-selected {
      pointer-events: none;
      outline: $width-border solid $color-text;
      background-color: var(--color-grey-1);
    }
  }
}

.question-control {
  width: 100%;
  display: flex;
  gap: 0.5rem;
  padding-left: $width-border;

  &-button {
    flex-grow: 1;
  }

  @include breakpoint-sm {
    flex-direction: column;
    gap: 1rem;
  }
}

.appearance {
  animation: appearance 0.3s linear;
}

.disappearance {
  animation: disappearance 0.3s linear;
}

@keyframes appearance {
  0% {
    transform: translateX(1.5rem);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes disappearance {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-1.5rem);
    opacity: 0;
  }
}
</style>
