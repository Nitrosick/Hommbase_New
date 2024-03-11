<template>
  <div
    v-if="list && list.length"
    class="records"
  >
    <span v-html="firstUpper(title)" />
    <ol class="records-list">
      <li
        v-for="(item, i) in list"
        :key="item.user_id"
        class="records-list-item"
      >
        <span class="records-place">
          {{ i + 1 }}
        </span>
        <img
          :src="getImageUrl(item.avatar)"
          alt="user avatar"
          class="records-avatar"
          loading="lazy"
        >
        <span
          class="records-name"
          v-html="firstUpper(item.user_name)"
        />
        <span
          class="records-id"
          v-html="'id: ' + item.user_id"
        />
        <div class="plug" />
        <span
          v-if="item.result"
          class="records-value"
          v-html="item.result + ' / 12'"
        />
        <span
          v-if="item.time"
          class="records-value records-time"
          v-html="$dayjs(item.time * 1000).format('mm:ss')"
        />
        <span
          v-if="item.balance"
          class="records-value"
          v-html="item.balance"
        />
      </li>
    </ol>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  list: { type: Array, required: true }
})

const getImageUrl = (name) => {
  if (!name) return '/images/team/unknown.webp'
  const fileName = name.replaceAll(' ', '')
  return `/images/heroes/portrait/${fileName}.webp`
}
</script>

<style lang="scss" scoped>
.records {
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
    padding: 0;
    margin: 0;

    &-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      line-height: 1;
      font-size: $font-size-sm;

      &::before {
        display: none;
        position: absolute;
        content: '';
        top: calc(50% - 1px);
        left: 2rem;
        right: 2rem;
        height: 2px;
        background-color: var(--color-grey-1);
        z-index: 0;

        @include breakpoint-xl {
          display: block;
        }

        @include breakpoint-sm {
          display: none;
        }
      }
    }

    &-item:first-child {
      color: $color-primary;
    }
  }

  &-place,
  &-avatar,
  &-name,
  &-id,
  &-value {
    background-color: $color-background;
    padding: 0 0.2rem;
    z-index: 1;
  }

  &-place {
    width: 1.5rem;
  }

  &-avatar {
    width: 3rem;
    aspect-ratio: 1/1;
    clip-path: $clip-path-tile;
  }

  &-name {
    word-break: break-all;

    @include breakpoint-sm {
      font-size: $font-size-xsm;
    }
  }

  &-id {
    white-space: nowrap;
    color: var(--color-grey-1);
    font-weight: 600;

    @include breakpoint-sm {
      display: none;
    }
  }

  &-value {
    white-space: nowrap;
    font-weight: 600;
    text-align: right;
  }

  &-time {
    width: 3.5rem;
    margin-left: 0.2rem;
    border-left: 1px solid var(--color-grey-1);
  }

  @include breakpoint-xl {
    border-right: none;
    border-bottom: $border-main;
  }
}

.records:last-child {
  border: none
}

@include scrollbar;
</style>
