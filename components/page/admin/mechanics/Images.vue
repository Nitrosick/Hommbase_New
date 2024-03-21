<template>
  <div class="images">
    <div
      v-for="(value, key) in data"
      :key="key"
      class="images-group"
    >
      <button
        v-for="item in value"
        :key="item"
        class="images-item"
        @click.prevent="copy(key, item)"
      >
        <img
          :src="`/images/titles/${key}/${item}`"
          alt="picture"
          loading="lazy"
          class="images-item-img"
        >
        <div class="images-copy">
          <Icon name="copied" />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: { type: Object, required: true }
})

const copy = (group, name) => {
  if (!group || !name) return
  navigator.clipboard.writeText(`/images/titles/${group}/${name}`)
}
</script>

<style lang="scss" scoped>
.images {
  border-top: 1px solid var(--color-grey-1);
  background-color: $color-outcontent;
  padding: 1px;

  &-group {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: 1px;
  }

  &-item {
    position: relative;
    height: 7rem;
    clip-path: $clip-path-tile;
    filter: brightness(0.9);
    cursor: pointer;
    transition: filter 0.3s;

    &:hover {
      filter: brightness(1.1);
    }

    &-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &-copy {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--color-black-o-1);
    opacity: 0;
    transition: opacity 0.1s;

    &:active,
    &:focus {
      opacity: 1;
    }
  }
}
</style>
