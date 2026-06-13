<script setup lang="ts">
import type { BranchRow } from '~/composables/useBranches'

const props = defineProps<{
  modelValue: boolean
  record: BranchRow | null
  clinics: { id: number; name: string }[]
  save: (payload: Record<string, unknown>, id?: number) => Promise<void>
}>()
const emit = defineEmits<{ 'update:modelValue': [v: boolean] }>()

const isEdit = computed(() => !!props.record)
const saving = ref(false)
const errors = ref<string[]>([])

const form = reactive({ name: '', code: '', clinic_id: '' as string | number, province: '', phone: '', status: 'active' })

const clinicOptions = computed(() => [
  { value: '', label: '— เลือกคลินิก —' },
  ...props.clinics.map((c) => ({ value: c.id, label: c.name })),
])

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    errors.value = []
    const r = props.record
    form.name = r?.name ?? ''
    form.code = r?.code ?? ''
    form.clinic_id = r?.clinic?.id ?? ''
    form.province = r?.province ?? ''
    form.phone = r?.phone ?? ''
    form.status = r?.status ?? 'active'
  },
)

async function onSave() {
  saving.value = true
  errors.value = []
  try {
    await props.save(
      {
        name: form.name,
        code: form.code,
        clinic_id: form.clinic_id === '' ? null : form.clinic_id,
        province: form.province || null,
        phone: form.phone || null,
        status: form.status,
      },
      props.record?.id,
    )
    emit('update:modelValue', false)
  } catch (e: any) {
    const errs = e?.data?.errors
    errors.value = errs ? (Object.values(errs).flat() as string[]) : [e?.data?.message || 'Could not save branch.']
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <MModal
    :model-value="modelValue"
    :busy="saving"
    :width="560"
    :title="isEdit ? 'Edit Branch' : 'Add Branch'"
    subtitle="กรอกข้อมูลสาขาแล้วกดบันทึก"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="med-form-grid">
      <div class="med-field med-field--full">
        <label>ชื่อสาขา</label>
        <MInput v-model="form.name" full placeholder="เช่น Riverside Branch" />
      </div>
      <div class="med-field">
        <label>คลินิกแม่ (Parent Clinic)</label>
        <MSelect v-model="form.clinic_id" :options="clinicOptions" />
      </div>
      <div class="med-field">
        <label>รหัส (Code)</label>
        <MInput v-model="form.code" full placeholder="BR100" />
      </div>
      <div class="med-field">
        <label>จังหวัด</label>
        <MInput v-model="form.province" full placeholder="Bangkok" />
      </div>
      <div class="med-field">
        <label>โทรศัพท์</label>
        <MInput v-model="form.phone" full placeholder="+66 2-xxx-xxxx" />
      </div>
      <div class="med-field">
        <label>สถานะ</label>
        <MSelect v-model="form.status" :options="[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]" />
      </div>
    </div>

    <ul v-if="errors.length" class="med-form-errors">
      <li v-for="(e, i) in errors" :key="i">{{ e }}</li>
    </ul>

    <template #footer>
      <MButton variant="ghost" :disabled="saving" @click="emit('update:modelValue', false)">Cancel</MButton>
      <MButton variant="primary" :disabled="saving" @click="onSave">
        <MIcon v-if="!saving" name="check" :size="16" :stroke-width="2.2" />{{ saving ? 'Saving…' : 'Save' }}
      </MButton>
    </template>
  </MModal>
</template>
