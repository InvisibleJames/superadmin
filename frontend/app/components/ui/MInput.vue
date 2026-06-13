<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    type?: string
    size?: 'md' | 'lg'
    icon?: string
    full?: boolean
  }>(),
  { modelValue: '', placeholder: '', type: 'text', size: 'md', icon: '', full: false },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const height = computed(() => (props.size === 'lg' ? 44 : 38))
</script>

<template>
  <div class="med-input" :style="{ width: full ? '100%' : undefined, height: height + 'px' }">
    <span v-if="icon" class="med-input__icon">
      <MIcon :name="icon" :size="size === 'lg' ? 18 : 16" />
    </span>
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :style="{ paddingLeft: icon ? '40px' : '12px', fontSize: size === 'lg' ? '14px' : '13px' }"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped>
.med-input {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--surface-input);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  transition:
    border-color var(--dur) var(--ease-out),
    box-shadow var(--dur) var(--ease-out);
}
.med-input:focus-within {
  border-color: var(--accent-primary);
  box-shadow: var(--ring-accent);
}
.med-input__icon {
  position: absolute;
  left: 12px;
  display: inline-flex;
  color: var(--text-tertiary);
  pointer-events: none;
}
.med-input input {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: var(--font-sans);
  padding-right: 12px;
}
.med-input input::placeholder {
  color: var(--text-tertiary);
}
</style>
