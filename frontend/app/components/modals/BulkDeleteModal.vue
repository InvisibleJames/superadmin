<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    count: number
    noun?: string
    // Performs the deletion, reporting progress. Returns when finished.
    runner: (onProgress: (done: number, total: number) => void) => Promise<void>
  }>(),
  { noun: 'item' },
)
const emit = defineEmits<{ 'update:modelValue': [v: boolean]; done: [] }>()

type Phase = 'confirm' | 'deleting' | 'done'
const phase = ref<Phase>('confirm')
const done = ref(0)
const total = ref(0)
const error = ref('')

const pct = computed(() => (total.value ? (done.value / total.value) * 100 : 0))
const busy = computed(() => phase.value === 'deleting')
const nounPlural = computed(() => `${props.noun}${props.count === 1 ? '' : 's'}`)

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      phase.value = 'confirm'
      done.value = 0
      total.value = props.count
      error.value = ''
    }
  },
)

function cancel() {
  if (busy.value) return
  emit('update:modelValue', false)
}

async function confirm() {
  phase.value = 'deleting'
  done.value = 0
  error.value = ''
  try {
    await props.runner((d, t) => {
      done.value = d
      total.value = t
    })
    phase.value = 'done'
    setTimeout(() => {
      emit('done')
      emit('update:modelValue', false)
    }, 750)
  } catch (e: any) {
    error.value = e?.data?.message || 'Some items could not be deleted.'
    phase.value = 'confirm'
  }
}
</script>

<template>
  <MModal :model-value="modelValue" :busy="busy" :width="440" @update:model-value="cancel">
    <template #header>
      <div class="flex items-center gap-3">
        <span class="med-del-icon">
          <MIcon v-if="phase === 'done'" name="check" :size="20" :stroke-width="2.4" />
          <MIcon v-else name="trash" :size="19" />
        </span>
        <div>
          <div class="text-[17px] font-bold text-ink">
            {{ phase === 'done' ? 'Deleted' : phase === 'deleting' ? 'Deleting…' : 'Delete ' + nounPlural }}
          </div>
          <div class="text-[12.5px] text-ink-3 mt-0.5">
            {{ phase === 'done' ? 'All selected records were removed.' : count + ' ' + nounPlural + ' selected' }}
          </div>
        </div>
      </div>
    </template>

    <template v-if="phase === 'confirm'">
      <p class="text-[13.5px] text-ink-2 leading-[1.55]">
        This will permanently delete <b class="text-ink">{{ count }}</b> {{ nounPlural }}. This action cannot be undone.
      </p>
      <p v-if="error" class="mt-3 text-[12.5px] text-[var(--danger-500)]">{{ error }}</p>
    </template>

    <template v-else>
      <div class="flex flex-col gap-3">
        <MProgressBar :value="pct" tone="danger" :show-label="true" :animated="phase === 'deleting'" />
        <div class="text-[12.5px] text-ink-3 font-mono">
          {{ done }} / {{ total }} {{ nounPlural }} {{ phase === 'done' ? 'removed' : 'removed…' }}
        </div>
      </div>
    </template>

    <template #footer>
      <template v-if="phase === 'confirm'">
        <MButton variant="ghost" @click="cancel">Cancel</MButton>
        <MButton variant="danger" @click="confirm"><MIcon name="trash" :size="15" />Delete {{ nounPlural }}</MButton>
      </template>
      <MButton v-else-if="phase === 'deleting'" variant="danger" :disabled="true">Deleting…</MButton>
      <MButton v-else variant="secondary" @click="cancel">Close</MButton>
    </template>
  </MModal>
</template>

<style scoped>
.med-del-icon {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--tint-danger);
  color: var(--danger-500);
}
</style>
