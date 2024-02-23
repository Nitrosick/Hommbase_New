<template>
  <div class="attacker">
    <NuxtLink
      :to="model.selected ? `/mobs?alias=${model.selected.name_en}` : '#'"
      class="attacker-name"
      :class="{ 'attacker-empty': !model.selected }"
    >
      {{ model.selected ? firstUpper(model.selected['name_' + locale]) : $t('label.empty') }}
    </NuxtLink>
    <div
      v-if="model.selected"
      class="attacker-row"
    >
      <span class="attacker-parameter">{{ $t('parameters.attack') }}</span>
      <span>{{ model.selected.attack }}</span>
      |
      <span class="attacker-parameter">{{ $t('parameters.damage') }}</span>
      <span>{{ model.selected.min_damage }}-{{ model.selected.max_damage }}</span>
    </div>
    <div v-else>-</div>
    <Input
      id="quantity-atk"
      type="number"
      :label="$t('label.quantity')"
      :attrs="{ min: 1, max: 9999 }"
      :disabled="!model.selected"
      v-model="model.quantity"
    />
    <Checkbox
      id="with-hero-atk"
      :label="$t('parameters.withhero')"
      :disabled="!model.selected"
      v-model="model.withHero"
    />
    <Input
      v-if="model.withHero"
      id="hero-level-atk"
      type="number"
      :label="$t('parameters.herolevel')"
      :attrs="{ min: 1, max: 74 }"
      :disabled="!model.selected"
      v-model="model.heroLevel"
    />
    <Input
      v-if="model.withHero"
      id="hero-attack"
      type="number"
      :label="$t('parameters.heroattack')"
      :attrs="{ min: 1, max: 99 }"
      :disabled="!model.selected"
      v-model="model.heroAttack"
    />
    <Select
      v-if="model.withHero && !isArcher"
      id="offense"
      :label="$t('parameters.offense')"
      :options="{
        basic: 'базовый',
        advanced: 'продвинутый',
        expert: 'эксперт',
      }"
      :disabled="!model.selected"
      v-model="model.offense"
    />
    <Checkbox
      v-if="model.withHero && !isArcher"
      id="offense-spec"
      :label="$t('parameters.offensespec')"
      :disabled="!model.selected"
      v-model="model.offenseSpec"
    />
    <Select
      v-if="model.withHero && isArcher"
      id="archery"
      :label="$t('parameters.archery')"
      :options="{
        basic: 'базовый',
        advanced: 'продвинутый',
        expert: 'эксперт',
      }"
      :disabled="!model.selected"
      v-model="model.archery"
    />
    <Checkbox
      v-if="model.withHero && isArcher"
      id="archery-spec"
      :label="$t('parameters.archeryspec')"
      :disabled="!model.selected"
      v-model="model.archerySpec"
    />
    <Checkbox
      v-if="model.withHero && hasSpecialization"
      id="unit-spec-atk"
      :label="$t('parameters.unitspec')"
      :disabled="!model.selected"
      v-model="model.unitSpec"
    />
    <span
      v-if="hasInfo"
      class="attacker-info"
      v-html="$t('info.blackknights')"
    />
    <Checkbox
      id="native-land-atk"
      :label="$t('parameters.nativelandbattle')"
      :disabled="!model.selected"
      v-model="model.nativeLand"
    />
    <Select
      v-if="isArcher"
      id="fines"
      :label="$t('parameters.fines')"
      :options="finesOptions"
      :disabled="!model.selected"
      v-model="model.fines"
    />
  </div>
</template>

<script setup>
const { locale } = useI18n()
const model = defineModel({ required: true })

const noMeleeFines = [
  'zealot', 'evil eye', 'beholder',
  'medusa', 'medusa queen',
  'pirate', 'corsair', 'sea dog',
  'mage', 'arch mage', 'enchanter'
]
const noDistanceFines = [
  'sharpshooter'
]
const noWallFines = [
  'mage', 'arch mage',
  'enchanter', 'sharpshooter'
]

watch(model.value, (val) => {
  if (val.quantity > 9999) nextTick(() => { model.value.quantity = 9999 })
  if (val.heroLevel > 74) nextTick(() => { model.value.heroLevel = 74 })
  if (val.heroAttack > 99) nextTick(() => { model.value.heroAttack = 99 })
})

const isArcher = computed(() => {
  const { selected } = model.value
  if (!selected) return false
  return isFinite(selected.shoots)
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

const finesOptions = computed(() => {
  const { selected } = model.value
  if (!selected) return {}
  const result = {}

  if (!noMeleeFines.includes(selected.name_en)) result.melee = 'ближний бой'
  if (!noDistanceFines.includes(selected.name_en)) result.distance = 'большая дистанция'
  if (!noWallFines.includes(selected.name_en)) {
    result['town walls'] = 'крепостные стены'
    result['distance + walls'] = 'дистанция + стены'
  }

  if (
    noMeleeFines.includes(selected.name_en) ||
    noDistanceFines.includes(selected.name_en) ||
    noWallFines.includes(selected.name_en)
  ) model.value.fines = null

  return result
})
</script>

<style lang="scss" scoped>
.attacker {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

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
  }
}
</style>
