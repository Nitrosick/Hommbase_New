<template>
  <div>
    {{ $t('info.rightanswers') }}:&ensp;
    <span class="result-value result-right">
      {{ data.score }}
    </span> /
    <span class="result-value">
      {{ questions.length }}
    </span>
  </div>
  <div>
    {{ $t('label.time') }}:&ensp;
    <span class="result-value">
      {{ $dayjs(time).format('mm:ss') }}
    </span>
  </div>
  <div>
    {{ $t('label.reward') }}:&ensp;
    <div class="cost-string result-value">
      {{ data.reward }}
      <mark class="gold" />
    </div>
  </div>

  <div class="result-splitter" />

  <div class="result-mistakes">
    <span v-if="data.mistakes.length">
      {{ $t('info.mistakes') }}:
    </span>
    <ul
      v-if="data.mistakes.length"
      class="result-mistakes-list"
    >
      <li
        v-for="id in data.mistakes"
        :key="id"
        class="result-mistakes-item"
        v-html="getMistake(id)"
      />
    </ul>
    <span v-else>
      {{ $t('info.nomistakes') }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  data: { type: Object, required: true },
  questions: { type: Array, required: true },
  time: { type: Number, required: true }
})

const { locale } = useI18n()

const getMistake = (id) => {
  const { questions } = props
  const question = questions.find(item => item.id === id)
  if (!question) return ''
  return question['question_' + locale.value]
}
</script>

<style lang="scss" scoped>
.result {
  &-value {
    font-size: $font-size-lg;
    font-weight: 600;
  }

  &-right {
    color: $color-primary;
    text-shadow: 1px 1px 0 var(--color-gold-3);
  }

  &-mistakes {
    flex-grow: 1;
    width: 100%;

    &-list {
      padding: 0;
      margin: 1.5rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    &-item {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  &-splitter {
    width: 100%;
    min-height: $width-border;
    background-color: var(--color-grey-1);
  }
}
</style>
