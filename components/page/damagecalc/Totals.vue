<template>
  <table class="totals">
    <thead>
      <tr>
        <th />
        <th>{{ $t('parameters.unluck') }}</th>
        <th>{{ $t('parameters.basic') }}</th>
        <th>{{ $t('parameters.luck') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>
          {{ $t('parameters.inflicteddamage') }}
          <span
            v-if="left.selected && +left.selected.double_strike"
            class="totals-special"
          >
            x2
          </span>
          <button
            v-else-if="hasAbility"
            class="totals-special"
            @click.prevent="showInfo"
          >
            !
          </button>
        </th>
        <td>{{ getDamage('unluck') }}</td>
        <td>{{ getDamage() }}</td>
        <td>{{ getDamage('luck') }}</td>
      </tr>
      <tr>
        <th>
          {{ $t('parameters.deaths') }}
          <span
            v-if="left.selected && +left.selected.double_strike"
            class="totals-special"
          >
            x2
          </span>
          <button
            v-else-if="hasAbility"
            class="totals-special"
            @click.prevent="showInfo"
          >
            !
          </button>
        </th>
        <td
          :class="{
            'totals-null': !getKills('unluck'),
            'totals-critical': getKills('unluck') >= quantity
          }"
        >
          {{ getKills('unluck') }}
        </td>
        <td
          :class="{
            'totals-null': !getKills(),
            'totals-critical': getKills() >= quantity
          }"
        >
          {{ getKills() }}
        </td>
        <td
          :class="{
            'totals-null': !getKills('luck'),
            'totals-critical': getKills('luck') >= quantity
          }"
        >
          {{ getKills('luck') }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
const props = defineProps({
  results: { type: Object, required: true },
  left: { type: Object, required: true },
  right: { type: Object, required: true }
})

const { t } = useI18n()
const { $toast } = useNuxtApp()

const withAbilities = [
  'cavalier', 'champion', 'ayssid'
]

const quantity = computed(() => props.right.quantity ?? 0)

const hasAbility = computed(() => {
  const { selected } = props.left
  if (!selected) return false
  return withAbilities.includes(selected.name_en)
})

const getDamage = (type = 'basic') => {
  const { min, max } = props.results
  if (!min || !max) return '-'

  let minRounded, maxRounded
  switch (type) {
    case 'basic':
      minRounded = Math.floor(min)
      maxRounded = Math.floor(max)
      break
    case 'unluck':
      minRounded = Math.floor(min / 2)
      maxRounded = Math.floor(max / 2)
      break
    case 'luck':
      minRounded = Math.floor(min * 2)
      maxRounded = Math.floor(max * 2)
      break
  }
  if (minRounded < 1) minRounded = 1
  if (maxRounded < 1) maxRounded = 1

  if (minRounded === maxRounded) return minRounded
  return `${minRounded}-${maxRounded}`
}

const getKills = (type = 'basic') => {
  const { min, max } = props.results
  if (!min || !max || !props.right.selected) return '-'
  const { health } = props.right.selected

  let minRounded, maxRounded
  switch (type) {
    case 'basic':
      minRounded = Math.floor(min / health)
      maxRounded = Math.floor(max / health)
      break
    case 'unluck':
      minRounded = Math.floor(min / 2 / health)
      maxRounded = Math.floor(max / 2 / health)
      break
    case 'luck':
      minRounded = Math.floor(min * 2 / health)
      maxRounded = Math.floor(max * 2 / health)
      break
  }
  if (minRounded > quantity.value) minRounded = quantity.value
  if (maxRounded > quantity.value) maxRounded = quantity.value

  if (minRounded === maxRounded) return minRounded
  return `${minRounded}-${maxRounded}`
}

const showInfo = () => {
  $toast(t('info.special'))
}
</script>

<style lang="scss" scoped>
.totals {
  width: 100%;

  th, td {
    border: none;
  }

  thead th {
    border-bottom: 1px solid var(--color-grey-1);
  }

  th {
    line-height: 1.2rem;
    font-size: $font-size-sm;
    font-weight: 600;
    color: var(--color-grey-1);
  }

  &-null {
    color: var(--color-grey-1);
  }

  &-critical {
    color: $color-alarm;
    text-shadow: 1px 1px 0 $color-alarm-d;
  }

  &-special {
    font-size: $font-size-md;
    color: $color-primary;
    text-shadow: 1px 1px 0 var(--color-gold-3);
    padding: 0 0.5rem;
  }
}
</style>
