<template>
  <div class="defender">
    <NuxtLink
      :to="model.selected ? `/mobs?alias=${model.selected.name_en}` : '#'"
      class="defender-name"
      :class="{ 'defender-empty': !model.selected }"
    >
      {{ model.selected ? firstUpper(model.selected['name_' + locale]) : $t('label.empty') }}
    </NuxtLink>
    <div
      v-if="model.selected"
      class="defender-row"
    >
      <span class="defender-parameter">{{ $t('parameters.defense') }}</span>
      <span>{{ model.selected.defense }}</span>
      |
      <span class="defender-parameter">{{ $t('parameters.health') }}</span>
      <span>{{ model.selected.health }}</span>
    </div>
    <div v-else>-</div>
    <Input
      id="quantity-def"
      type="number"
      :label="$t('label.quantity')"
      :attrs="{ min: 1, max: 9999 }"
      :disabled="!model.selected"
      v-model="model.quantity"
    />
    <Checkbox
      id="with-hero-def"
      :label="$t('parameters.withhero')"
      :disabled="!model.selected"
      v-model="model.withHero"
    />
    <Input
      v-if="model.withHero"
      id="hero-level-def"
      type="number"
      :label="$t('parameters.herolevel')"
      :attrs="{ min: 1, max: 74 }"
      :disabled="!model.selected"
      v-model="model.heroLevel"
    />
    <Input
      v-if="model.withHero"
      id="hero-defense"
      type="number"
      :label="$t('parameters.herodefense')"
      :attrs="{ min: 1, max: 99 }"
      :disabled="!model.selected"
      v-model="model.heroDefense"
    />
    <Select
      v-if="model.withHero"
      id="armor"
      :label="$t('parameters.armor')"
      :options="{
        basic: 'базовый',
        advanced: 'продвинутый',
        expert: 'эксперт',
      }"
      :disabled="!model.selected"
      v-model="model.armor"
    />
    <Checkbox
      v-if="model.withHero"
      id="armor-spec"
      :label="$t('parameters.armorspec')"
      :disabled="!model.selected"
      v-model="model.armorSpec"
    />
    <Checkbox
      v-if="model.withHero && hasSpecialization"
      id="unit-spec-def"
      :label="$t('parameters.unitspec')"
      :disabled="!model.selected"
      v-model="model.unitSpec"
    />
    <span
      v-if="hasInfo"
      class="defender-info"
      v-html="$t('info.blackknights')"
    />
    <Checkbox
      id="native-land-def"
      :label="$t('parameters.nativelandbattle')"
      :disabled="!model.selected"
      v-model="model.nativeLand"
    />
    <Checkbox
      id="protect-stand"
      :label="$t('parameters.protectstand')"
      :disabled="!model.selected"
      v-model="model.protectStand"
    />
  </div>
</template>

<script setup>
const { locale } = useI18n()
const model = defineModel({ required: true })

watch(model.value, (val) => {
  if (val.quantity > 9999) nextTick(() => { model.value.quantity = 9999 })
  else if (val.quantity < 1) nextTick(() => { model.value.quantity = 1 })

  if (val.heroLevel > 74) nextTick(() => { model.value.heroLevel = 74 })
  else if (val.heroLevel < 1) nextTick(() => { model.value.heroLevel = 1 })

  if (val.heroDefense > 99) nextTick(() => { model.value.heroDefense = 99 })
  else if (val.heroDefense < 1) nextTick(() => { model.value.heroDefense = 1 })
})

const hasSpecialization = computed(() => {
  const { selected } = model.value
  if (!selected) return false
  const specs = JSON.parse(selected.hero_with_spec)
  if (!specs.length) model.value.unitSpec = false
  return specs.length
})

const hasInfo = computed(() => {
  const { selected } = model.value
  if (!selected || !model.value.unitSpec) return false
  return ['black knight', 'dread knight'].includes(selected.name_en)
})
</script>

<style lang="scss" scoped>
.defender {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: right;

  .defender-row {
    align-self: flex-end;

    @include breakpoint-sm {
      align-self: flex-start;
    }
  }

  &-name {
    font-family: $font-title;
    font-size: $font-size-lg;

    @include breakpoint-sm {
      font-family: $font-main;
      font-size: $font-size-md;
      font-weight: 600;
    }
  }

  &-empty {
    color: var(--color-grey-1);
  }

  &-row {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  &-parameter {
    font-size: $font-size-sm;
    font-weight: 600;
    color: var(--color-grey-1);
  }

  &-info {
    font-size: $font-size-xsm;
    color: var(--color-grey-1);
  }

  @include breakpoint-sm {
    padding: 1rem 1.5rem;
    border-top: $border-main;
    text-align: left;
  }
}
</style>
