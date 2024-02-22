<template>
  <div class="params-list">
    <div class="params-list-row no-line">
      <NuxtLink
        :to="left ? `/mobs?alias=${left.name_en}` : '#'"
        class="params-list-name"
        :class="{ 'params-list-empty': !left }"
      >
        {{ left ? firstUpper(left['name_' + locale]) : $t('label.empty') }}
      </NuxtLink>
      <NuxtLink
        :to="right ? `/mobs?alias=${right.name_en}` : '#'"
        class="params-list-name params-list-name-right"
        :class="{ 'params-list-empty': !right }"
      >
        {{ right ? firstUpper(right['name_' + locale]) : $t('label.empty') }}
      </NuxtLink>
    </div>
    <div
      v-for="p in parameters"
      :key="p.id"
      class="params-list-row"
    >
      <div
        class="params-list-value"
        :class="{ 'params-list-winner': compare('left', p) > 0 }"
        v-html="getParameterValue('left', p) ?? '·'"
      />
      <div class="params-list-title">
        {{ $t('parameters.' + p.name) }}
      </div>
      <div
        class="params-list-value"
        :class="{ 'params-list-winner': compare('right', p) > 0 }"
        v-html="getParameterValue('right', p) ?? '·'"
      />
    </div>
  </div>
</template>

<script setup>
import { firstUpper, makeCostString } from '@/utils/string'

const props = defineProps({
  left: { type: [Object, null], required: true },
  right: { type: [Object, null], required: true }
})

const { locale } = useI18n()

const compare = (side, param) => {
  const { left, right } = props
  if (!left || !right) return 0

  switch (param.name) {
    case 'attack':
    case 'defense':
    case 'health':
    case 'speed':
    case 'value':
    case 'growth':
      return side === 'left' ? left[param.name] - right[param.name] : right[param.name] - left[param.name]
    case 'damage':
      const avgL = (left.min_damage + left.max_damage) / 2
      const avgR = (right.min_damage + right.max_damage) / 2
      return side === 'left' ? avgL - avgR : avgR - avgL
    case 'shoots':
      const shootsL = left.shoots === '-' ? 0 : left.shoots
      const shootsR = right.shoots === '-' ? 0 : right.shoots
      return side === 'left' ? shootsL - shootsR : shootsR - shootsL
    case 'cost':
      const costL = JSON.parse(left.cost)[0]
      const costR = JSON.parse(right.cost)[0]
      return side === 'left' ? costR - costL : costL - costR
    default: return 0
  }
}

const getParameterValue = (side, param) => {
  const target = side === 'left' ? props.left : props.right
  if (!target) return null
  if (param.func) return param.func(target, param.value)
  return target[param.value] ?? null
}

const translatable = (target, value) => firstUpper(target[`${value}_${locale.value}`]) ?? null
const getDamage = (target) => `${target.min_damage}-${target.max_damage}`
const getCostString = (target) => makeCostString(target.cost)

const parameters = [
  { id: 1, name: 'attack', value: 'attack' },
  { id: 2, name: 'defense', value: 'defense' },
  { id: 3, name: 'damage', func: getDamage, value: '' },
  { id: 4, name: 'shoots', value: 'shoots' },
  { id: 5, name: 'health', value: 'health' },
  { id: 6, name: 'speed', value: 'speed' },
  { id: 7, name: 'movement', func: translatable, value: 'move' },
  { id: 8, name: 'value', value: 'value' },
  { id: 9, name: 'cost', func: getCostString, value: '' },
  { id: 10, name: 'growth', value: 'growth' },
  { id: 11, name: 'status', func: translatable, value: 'status' },
  { id: 12, name: 'land', func: translatable, value: 'land' },
  { id: 13, name: 'size', value: 'size' }
]
</script>

<style lang="scss" scoped>
.params-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 1.5rem;

  &-row {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    &::before {
      position: absolute;
      content: '';
      top: calc(50% - 1px);
      left: 2rem;
      right: 2rem;
      height: 2px;
      background-color: var(--color-grey-1);
      z-index: 0;
    }

    &.no-line {
      &::before {
        display: none;
      }
    }
  }

  &-title,
  &-value,
  &-name {
    position: relative;
    background-color: $color-background;
    padding: 0 0.15rem;
    z-index: 1;
  }

  &-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-weight: 600;
    text-align: center;
    font-size: $font-size-sm;
    white-space: nowrap;
    color: var(--color-grey-1);

    @include breakpoint-sm {
      font-size: $font-size-xsm;
    }
  }

  &-name {
    margin-bottom: 0.5rem;
    font-family: $font-title;
    font-size: $font-size-lg;

    @include breakpoint-sm {
      font-family: $font-main;
      font-size: $font-size-md;
      font-weight: 600;
    }
  }

  &-name-right {
    text-align: right;
  }

  &-empty {
    color: var(--color-grey-1);
  }

  &-winner {
    font-weight: 600;
    color: $color-primary;
    text-shadow: 1px 1px 0 var(--color-gold-3);
  }

  @include breakpoint-sm {
    padding: 1rem 0.5rem;
  }
}
</style>
