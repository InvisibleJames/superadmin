<script setup lang="ts">
import type { ClinicRow } from '~/composables/useClinics'

const props = defineProps<{
  modelValue: boolean
  record: ClinicRow | null
  save: (payload: Record<string, unknown>, id?: number) => Promise<void>
}>()
const emit = defineEmits<{ 'update:modelValue': [v: boolean] }>()

const isEdit = computed(() => !!props.record)
const saving = ref(false)
const errors = ref<string[]>([])

const form = reactive({ name: '', code: '', no: '', province: '', district: '', subdistrict: '', status: 'active' })

const address = computed(() => ({ province: form.province || null, district: form.district || null, subdistrict: form.subdistrict || null }))
function onAddress(a: { province: string | null; district: string | null; subdistrict: string | null }) {
  form.province = a.province ?? ''
  form.district = a.district ?? ''
  form.subdistrict = a.subdistrict ?? ''
}

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    errors.value = []
    const r = props.record
    form.name = r?.name ?? ''
    form.code = r?.code ?? ''
    form.no = r?.no ?? ''
    form.province = r?.province ?? ''
    form.district = r?.district ?? ''
    form.subdistrict = r?.subdistrict ?? ''
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
        no: form.no || null,
        province: form.province || null,
        district: form.district || null,
        subdistrict: form.subdistrict || null,
        status: form.status,
      },
      props.record?.id,
    )
    emit('update:modelValue', false)
  } catch (e: any) {
    const errs = e?.data?.errors
    errors.value = errs ? (Object.values(errs).flat() as string[]) : [e?.data?.message || 'Could not save clinic.']
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
    :title="isEdit ? 'Edit Clinic' : 'Add Clinic'"
    subtitle="กรอกข้อมูลคลินิกแล้วกดบันทึก"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="med-form-grid">
      <div class="med-field med-field--full">
        <label>ชื่อคลินิก</label>
        <MInput v-model="form.name" full placeholder="เช่น MedReco Central" />
      </div>
      <div class="med-field">
        <label>รหัส (Code)</label>
        <MInput v-model="form.code" full placeholder="C101" />
      </div>
      <div class="med-field">
        <label>เลขที่ (No.)</label>
        <MInput v-model="form.no" full placeholder="100000" />
      </div>
      <ThaiAddressSelect :model-value="address" @update:model-value="onAddress" />
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
