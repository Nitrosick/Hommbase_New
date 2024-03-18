<template>
  <div class="content">
    <div class="content-elements">
      <button
        class="content-button"
        :title="$t('editor.paragraph')"
        @click.prevent="copy('paragraph')"
      >
        <Icon name="paragraph" />
      </button>
      <button
        class="content-button"
        :title="$t('editor.bold')"
        @click.prevent="copy('bold')"
      >
        <b>Aа</b>
      </button>
      <button
        class="content-button"
        :title="$t('editor.color')"
        @click.prevent="copy('color')"
      >
        <mark>Aа</mark>
      </button>
      <button
        class="content-button"
        :title="$t('editor.picture')"
        @click.prevent="copy('picture')"
      >
        <Icon name="picture" />
      </button>
      <button
        class="content-button"
        :title="$t('editor.icon')"
        @click.prevent="copy('icon')"
      >
        <Icon name="icon-in-text" />
      </button>
      <button
        class="content-button"
        :title="$t('editor.list')"
        @click.prevent="copy('list')"
      >
        <Icon name="list" />
      </button>
      <button
        class="content-button"
        :title="$t('editor.table')"
        @click.prevent="copy('table')"
      >
        <Icon name="table" />
      </button>

      <div class="plug" />

      <div
        class="content-copied"
        :class="{ 'content-copied-showed': copied }"
      >
        <Icon name="copied" />
      </div>
    </div>
    <Textarea
      id="content"
      :placeholder="$t('label.content')"
      :required="true"
      :disabled="disabled"
      :attrs="{ rows: 20 }"
      v-model="model"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  disabled: { type: Boolean, default: false}
})

const copied = ref(false)
const model = defineModel({ required: true })

const copy = (el) => {
  let result = ''

  switch (el) {
    case 'paragraph':
      result = '<p>\n\n</p>'
      break
    case 'bold':
      result = '[s][/s]'
      break
    case 'color':
      result = '[m][/m]'
      break
    case 'picture':
      result = "<div class='img-slider'>\n<img height='_' src='_' alt='_'>\n</div>"
      break
    case 'icon':
      result = "<img class='img-inner-_' src='_' alt='_' height='_'>"
      break
    case 'list':
      result = '<ul>\n<li></li>\n<li></li>\n<li></li>\n</ul>'
      break
    case 'table':
      result = "<div class='table-wrapper'>\n<table>\n<tr> <th></th> <th></th> </tr>\n<tr> <td></td> <td></td> </tr>\n</table>\n</div>"
      break
  }

  navigator.clipboard.writeText(result)
  copied.value = true
  setTimeout(() => { copied.value = false }, 500)
}
</script>

<style lang="scss" scoped>
.content {
  padding: 1.5rem;
  padding-top: 0;

  &-elements {
    display: flex;
    flex-wrap: wrap;
    border: $border-main;
    border-bottom: none;
  }

  &-button,
  &-copied {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.5rem;
    height: 3.5rem;
    font-size: $font-size-lg;
    transition: background-color 0.3s;

    &:hover:not(&:disabled),
    &:focus:not(&:disabled) {
      background-color: var(--color-grey-2);
    }
  }

  &-copied {
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &-copied-showed {
    opacity: 1;
  }

  mark {
    font-weight: 600;
    color: var(--color-gold-1);
    background-color: transparent;
    text-shadow: 1px 1px 0 var(--color-gold-3);
  }
}
</style>
