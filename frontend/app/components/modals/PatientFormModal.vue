<script setup lang="ts">
import type { PatientRow } from '~/composables/usePatients'

const props = defineProps<{
  modelValue: boolean
  record: PatientRow | null
  clinics: { id: number; name: string }[]
  branches: { id: number; name: string }[]
  save: (payload: Record<string, unknown>, id?: number) => Promise<void>
}>()
const emit = defineEmits<{ 'update:modelValue': [v: boolean] }>()

const isEdit = computed(() => !!props.record)
const saving = ref(false)
const errors = ref<string[]>([])

const form = reactive({
  hn: '',
  name: '',
  gender: '' as string,
  age: '' as string | number,
  clinic_id: '' as string | number,
  branch_id: '' as string | number,
  phone: '',
  last_visit_at: '',
  status: 'active',
})

const sel = (items: { id: number; name: string }[], ph: string) => [
  { value: '', label: ph },
  ...items.map((i) => ({ value: i.id, label: i.name })),
]
const pick = (v: string | number) => (v === '' ? null : v)

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    errors.value = []
    const r = props.record
    form.hn = r?.hn ?? ''
    form.name = r?.name ?? ''
    form.gender = r?.gender ?? ''
    form.age = r?.age ?? ''
    form.clinic_id = r?.clinic?.id ?? ''
    form.branch_id = r?.branch?.id ?? ''
    form.phone = r?.phone ?? ''
    form.last_visit_at = r?.last_visit_at ? r.last_visit_at.slice(0, 10) : ''
    form.status = r?.status ?? 'active'
  },
)

async function onSave() {
  saving.value = true
  errors.value = []
  try {
    await props.save(
      {
        hn: form.hn,
        name: form.name,
        gender: form.gender || null,
        age: form.age === '' ? null : Number(form.age),
        clinic_id: pick(form.clinic_id),
        branch_id: pick(form.branch_id),
        phone: form.phone || null,
        last_visit_at: form.last_visit_at || null,
        status: form.status,
      },
      props.record?.id,
    )
    emit('update:modelValue', false)
  } catch (e: any) {
    const errs = e?.data?.errors
    errors.value = errs ? (Object.values(errs).flat() as string[]) : [e?.data?.message || 'Could not save patient.']
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <MModal
    :model-value="modelValue"
    :busy="saving"
    :width="640"
    :title="isEdit ? 'Edit Patient' : 'Add Patient'"
    subtitle="กรอกข้อมูลผู้ป่วยแล้วกดบันทึก"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="med-form-grid">
      <div class="med-field">
        <label>ชื่อ-นามสกุล</label>
        <MInput v-model="form.name" full placeholder="เช่น สมศักดิ์ พรหมมา" />
      </div>
      <div class="med-field">
        <label>HN</label>
        <MInput v-model="form.hn" full placeholder="HN-650148" />
      </div>
      <div class="med-field">
        <label>เพศ</label>
        <MSelect v-model="form.gender" :options="[{ value: '', label: '— เลือก —' }, { value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }]" />
      </div>
      <div class="med-field">
        <label>อายุ</label>
        <MInput v-model="form.age" full type="number" placeholder="35" />
      </div>
      <div class="med-field">
        <label>คลินิก</label>
        <MSelect v-model="form.clinic_id" :options="sel(clinics, '— เลือกคลินิก —')" />
      </div>
      <div class="med-field">
        <label>สาขา</label>
        <MSelect v-model="form.branch_id" :options="sel(branches, '— เลือกสาขา —')" />
      </div>
      <div class="med-field">
        <label>โทรศัพท์</label>
        <MInput v-model="form.phone" full placeholder="08x-xxx-xxxx" />
      </div>
      <div class="med-field">
        <label>มาครั้งล่าสุด (Last Visit)</label>
        <MInput v-model="form.last_visit_at" full type="date" />
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
