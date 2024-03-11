<template>
  <div
    v-if="list && list.length"
    class="factions"
  >
    <span v-html="firstUpper(title)" />
    <div class="factions-list">
      <div
        v-for="item in sortedList"
        :key="item.id"
        class="factions-list-item"
        :style="{ '--town-color': `#${item.color}` }"
      >
        <div
          class="factions-list-percent"
          :style="{ width: `${diagramPercent(item.users_count)}%` }"
        />
        <span class="factions-list-value">
          {{ item.users_count }}
        </span>
        <span class="factions-list-town">
          {{ item['name_' + locale] }}
        </span>
      </div>
      <div class="factions-ruler">
        <span>0</span>
        <span>{{ Math.round(sortedList[0].users_count / 2) }}</span>
        <span>{{ sortedList[0].users_count }}</span>
      </div>
    </div>
    <div
      v-if="total"
      class="factions-total"
    >
      <div class="factions-total-row">
        <span class="factions-total-title">
          {{ $t('label.withfaction') }}:
        </span>
        <span v-html="total.factioned ?? '-'" />
      </div>
      <div class="factions-total-row">
        <span class="factions-total-title">
          {{ $t('label.nofaction') }}:
        </span>
        <span v-html="(total.total - total.factioned) ?? '-'" />
      </div>
      <div class="factions-total-row">
        <span class="factions-total-title">
          {{ $t('label.total') }}:
        </span>
        <span v-html="total.total ?? '-'" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  list: { type: Array, required: true },
  total: { type: Object, required: true }
})

const { locale } = useI18n()

const sortedList = computed(() => [...props.list].sort((a, b) => b.users_count - a.users_count))
const diagramPercent = (value) => (100 / sortedList.value[0].users_count) * value
</script>

<style lang="scss" scoped>
.factions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  border-right: $border-main;
  overflow-y: auto;

  &-list {
    display: flex;
    flex-direction: column;
    gap: 1px;

    &-item {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 3rem;
      padding: 0 1rem;
      border-left: $width-border solid var(--town-color);
      text-transform: capitalize;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--town-color);
        opacity: 0.05;
      }
    }

    &-percent {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      background-color: var(--town-color);
      opacity: 0.4;
    }

    &-value {
      font-weight: 600;
      z-index: 1;
    }

    &-town {
      font-size: $font-size-sm;
      z-index: 1;
    }
  }

  &-ruler {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid var(--color-grey-1);
    color: var(--color-grey-1);
    font-weight: 600;
    font-size: $font-size-xsm;
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }

  &-total {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    &-title {
      color: var(--color-grey-1);
      font-weight: 600;
      font-size: $font-size-sm;
    }
  }

  @include breakpoint-xl {
    border-right: none;
    border-bottom: $border-main;
  }
}

@include scrollbar;
</style>
