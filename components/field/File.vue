<template>
  <div class="file">
    <div
      class="file-label"
      :for="id"
    >
      <span
        v-if="label"
        v-html="label"
      />
      <span class="file-label-limits">
        {{ accept.replaceAll(',', '') }} |
        {{ exceededValue }}
        {{ resolution ? `| ${resolution}` : '' }}
      </span>
    </div>
    <label class="file-field">
      <input
        ref="input"
        :key="key"
        type="file"
        class="file-input"
        :name="id"
        :required="required"
        :disabled="disabled"
        :accept="accept"
        v-bind="attrs"
        @input="update($event.target.files)"
      >
      <div
        v-if="sizeLimitExceeded"
        class="file-info"
        v-html="exceededText"
      />
      <div
        v-else-if="!value"
        class="file-info"
        v-html="$t('label.selectfile')"
      />
      <div
        v-else
        class="file-info"
        v-html="value.name"
      />
      <img
        v-if="preview"
        :src="preview"
        alt="preview"
        class="file-preview"
        loading="lazy"
      >
      <button
        v-if="value"
        class="file-clear"
        @click.prevent="clear"
      >
        <Icon
          name="close"
          size="s"
        />
      </button>
    </label>
  </div>
</template>

<script setup>
const emit = defineEmits(['input'])

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, default: null },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  accept: { type: String, default: null },
  sizeLimit: { type: Number, default: null },
  resolution: { type: String, default: null },
  error: { type: String, default: null },
  attrs: { type: Object, default: () => {} }
})

const { t } = useI18n()
const key = ref(1)
const value = ref(null)
const preview = ref(null)
const sizeLimitExceeded = ref(false)
const mb = 1024

const exceededValue = computed(() => {
  const { sizeLimit } = props
  const measure = sizeLimit < mb ? 'Kb' : 'Mb'
  const val = sizeLimit < mb ? sizeLimit : (sizeLimit / mb).toFixed(1)
  return val + measure
})

const exceededText = computed(() => `${t('error.filesize')}: ${exceededValue.value}`)

const update = (files) => {
  if (!files || files.length === 0) return

  const file = files[0]
  const { sizeLimit } = props

  if (sizeLimit && file.size / mb > sizeLimit) {
    sizeLimitExceeded.value = true
    value.value = null
    preview.value = null
    return
  }

  const reader = new FileReader()
  reader.addEventListener('load', () => { preview.value = reader.result }, false)
  reader.readAsDataURL(file)

  value.value = file
  sizeLimitExceeded.value = false
  emit('input', file)
}

const clear = () => {
  sizeLimitExceeded.value = false
  value.value = null
  preview.value = null
  emit('input', null)
  key.value++
}

defineExpose({ clear })
</script>

<style lang="scss" scoped>
.file {
  &-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    font-size: $font-size-sm;
    margin-bottom: 0.3rem;

    &-limits {
      font-weight: 600;
      color: var(--color-grey-1);
    }
  }

  &-field {
    display: block;
    position: relative;
    height: 20rem;
    border: $width-border dashed var(--color-grey-1);
    cursor: pointer;
  }

  &-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  &-info {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    max-width: 80%;
    text-align: center;
    z-index: 1;
  }

  &-preview {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.3);
  }

  &-clear {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 1rem;
    z-index: 1;
  }
}
</style>
