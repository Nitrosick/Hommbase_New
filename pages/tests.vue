<template>
  <div
    v-if="data && data.length"
    class="tests single-page"
  >
    <div class="tests-content">
      <div
        v-if="step === 1"
        class="tests-list"
      >
        <h2 class="tests-title">
          {{ $t('menu.tests') }}
        </h2>
        <div
          class="tests-description"
          v-html="$t('info.tests')"
        />
        <div class="tests-control">
          <div
            v-for="test in data"
            :key="test.id"
            class="tests-control-row"
          >
            <Button
              :text="firstUpper(test['name_' + locale])"
              :disabled="test.attempts > 2"
              class="tests-control-button"
              @btn-click="getQuestions(test)"
              @mouseover="bluredTest = test"
              @mouseleave="bluredTest = {}"
            />
            <span class="tests-control-attempts">
              {{ getAttempts(test.attempts) }}
            </span>
          </div>
        </div>
      </div>
      <div
        v-else-if="step === 2 && currentTest"
        class="tests-question"
      >
        <div class="tests-question-header">
          <span>
            {{ firstUpper(currentTest['name_' + locale]) }}
          </span>
          <span
            class="tests-question-theme"
            v-html="firstUpper(questions[currentQuestion]['theme_' + locale])"
          />
        </div>
        <Scales
          :time="scaleTime"
          :questions="questions.length"
          :answers="answers"
        />
        <Question
          :data="questions[currentQuestion]"
          :number="currentQuestion + 1"
          @approve="setAnswer"
        />
      </div>
      <div
        v-else-if="step === 3"
        class="tests-result"
      >
        <span>
          {{ firstUpper(currentTest['name_' + locale]) }}
        </span>
        <Result
          v-if="result"
          :data="result"
          :questions="questions"
          :time="finishTime - startTime"
        />
        <Spinner v-else />
        <div class="tests-control">
          <Button
            :text="$t('menu.statistics')"
            to="/statistics"
            class="tests-control-button"
          />
          <Button
            :text="$t('label.totests')"
            class="tests-control-button"
            @btn-click="step = 1"
          />
        </div>
      </div>
    </div>

    <Banner
      :image="bannerImage"
      :blured="bluredTest"
    />
  </div>
</template>

<script setup>
import { firstUpper } from '@/utils/string'
import Spinner from '@/components/app/Spinner.vue'
import Banner from '@/components/page/tests/Banner.vue'
import Scales from '@/components/page/tests/Scales.vue'
import Question from '@/components/page/tests/Question.vue'
import Result from '@/components/page/tests/Result.vue'

definePageMeta({ middleware: ['03-auth'] })

const { $api } = useNuxtApp()
const { me, setBalance } = useUserStore()

const { data, pending } = await useAsyncData('tests',
  async () => {
    const [res, err] = await $api('tests', { token: me.token })
    if (err) {
      console.error(err)
      throw showError(err)
    }
    return res || null
  }
)

const { projectTitle } = useRuntimeConfig().public
const { t, locale } = useI18n()

const step = ref(1)
const currentTest = ref(null)
const bluredTest = ref({})
const currentQuestion = ref(null)
const questions = ref([])
const answers = ref([])
const timer = ref(null)

const result = ref(null)
const startTime = ref(null)
const finishTime = ref(null)

const attempts = {
  0: { en: '3 attempts', ru: '3 попытки' },
  1: { en: '2 attempts', ru: '2 попытки' },
  2: { en: '1 attempt', ru: '1 попытка' },
  3: { en: 'Unavailable', ru: 'Недоступен' }
}

const timers = {
  easy: 120,
  medium: 180,
  hard: 240
}

useHead({ title: () => `${t('menu.tests')} | ${projectTitle}` })

onBeforeUnmount(() => { if (step.value === 2) finishTest() })
onUnmounted(() => { clearTimeout(timer.value) })

const bannerImage = computed(() => {
  const image = currentQuestion.value === null ? 'main' : questions.value[currentQuestion.value].theme_img
  return `/images/poster/test/${image}.webp`
})

const scaleTime = computed(() => +timers[currentTest.value.difficult] ?? timers.easy)

const getAttempts = (value) => {
  if (!value) return attempts[0][locale.value]
  return attempts[value][locale.value]
}

const getQuestions = async (test) => {
  if (!confirm(t('confirm.teststart'))) return

  const [res, err] = await $api('tests/questions', {
    test: test.id, token: me.token
  })

  if (err) console.error(err)
  else {
    currentTest.value = test
    questions.value = res ?? []
    startTest()

    for (const item of data.value) {
      if (item.id === test.id) return item.attempts++
    }
  }
}

const startTest = () => {
  if (!questions.value.length) return

  currentQuestion.value = 0
  step.value++
  startTime.value = new Date().getTime()

  timer.value = setTimeout(() => {
    finishTest()
  }, (timers[currentTest.value.difficult] ?? timers.easy) * 1000)
}

const finishTest = async () => {
  finishTime.value = new Date().getTime()
  step.value++
  currentQuestion.value = null
  clearTimeout(timer.value)

  for (let i = 0; i < questions.value.length; i++) {
    if (!answers.value[i]) answers.value[i] = 0
  }

  const newTime = Math.round((finishTime.value - startTime.value) / 1000)

  const [res, err] = await $api('tests/result', {
    test: currentTest.value.id,
    difficult: currentTest.value.difficult,
    questions: questions.value.map(item => item.id),
    answers: answers.value,
    time: newTime,
    token: me.token
  })

  if (err) console.error(err)
  else {
    result.value = res ?? null
    answers.value = []
    setBalance(+me.balance + +res.reward)

    for (const item of data.value) {
      if (item.id === currentTest.value.id) {
        if (res.score < item.result) return
        if (res.score === item.result && newTime >= item.time) return
        item.result = res.score
        item.time = newTime
        return
      }
    }

    currentTest.value = null
  }
}

const setAnswer = (i) => {
  answers.value.push(i)
  if (answers.value.length >= questions.value.length) return finishTest()
  currentQuestion.value++
}
</script>

<style lang="scss" scoped>
.tests {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  min-height: calc(100vh - $height-header);
  padding: calc($height-header + 1.5rem) 8rem 1.5rem 8rem;

  &-content {
    height: 100%;
    max-width: 41rem;
    flex-grow: 1;

    @include breakpoint-md {
      max-width: initial;
    }
  }

  &-list,
  &-question,
  &-result {
    position: relative;
    height: 100%;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
    padding-right: 1.5rem;
    overflow-y: auto;

    @include breakpoint-md {
      padding-right: 0;
    }
  }

  &-question-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    @include breakpoint-sm {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }

  &-question-theme {
    font-size: $font-size-sm;
    color: var(--color-grey-1);
    font-weight: 600;
  }

  &-title {
    text-align: center;
    line-height: 1;
    padding-bottom: 1.5rem;
    border-bottom: $border-main;
  }

  &-description {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    text-indent: 2rem;
    line-height: 1.7;
    text-align: justify;
  }

  &-control {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    width: 100%;
    padding-left: $width-border;

    &-row {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;

      @include breakpoint-sm {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }

    &-button {
      min-width: 20rem;

      @include breakpoint-sm {
        width: 100%;
        min-width: initial;
      }
    }

    &-attempts {
      font-weight: 600;
    }

    @include breakpoint-sm {
      gap: 1rem;
    }
  }

  @include breakpoint-xl {
    padding: calc($height-header + 1.5rem) 1.5rem 1.5rem 1.5rem;
  }

  @include breakpoint-lg {
    gap: 0;
  }

  @include breakpoint-md {
    height: auto;
    flex-direction: column;
    gap: 1.5rem;
  }

  @include breakpoint-sm {
    height: auto;
  }
}

@include scrollbar;
</style>
