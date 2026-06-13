<script setup lang="ts">
import type { UserRow } from '~/composables/useUsers'

const props = defineProps<{
  modelValue: boolean
  record: UserRow | null
  roles: { id: number; name: string }[]
  clinics: { id: number; name: string }[]
  branches: { id: number; name: string }[]
  save: (payload: Record<string, unknown>, id?: number) => Promise<void>
}>()
const emit = defineEmits<{ 'update:modelValue': [v: boolean] }>()

const isEdit = computed(() => !!props.record)
const saving = ref(false)
const errors = ref<string[]>([])

const form = reactive({
  name: '',
  email: '',
  username: '',
  phone: '',
  role_id: '' as string | number,
  clinic_id: '' as string | number,
  branch_id: '' as string | number,
  status: 'active',
  password: '',
})

const pick = (v: string | number) => (v === '' ? null : v)
const sel = (items: { id: number; name: string }[], ph: string) => [
  { value: '', label: ph },
  ...items.map((i) => ({ value: i.id, label: i.name })),
]

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    errors.value = []
    const r = props.record
    form.name = r?.name ?? ''
    form.email = r?.email ?? ''
    form.username = r?.username ?? ''
    form.phone = r?.phone ?? ''
    form.role_id = r?.role?.id ?? ''
    form.clinic_id = r?.clinic?.id ?? ''
    form.branch_id = r?.branch?.id ?? ''
    form.status = r?.status ?? 'active'
    form.password = ''
  },
)

async function onSave() {
  saving.value = true
  errors.value = []
  try {
    const payload: Record<string, unknown> = {
      name: form.name,
      email: form.email,
      username: form.username || null,
      phone: form.phone || null,
      role_id: pick(form.role_id),
      clinic_id: pick(form.clinic_id),
      branch_id: pick(form.branch_id),
      status: form.status,
    }
    if (form.password) payload.password = form.password
    await props.save(payload, props.record?.id)
    emit('update:modelValue', false)
  } catch (e: any) {
    const errs = e?.data?.errors
    errors.value = errs ? Object.values(errs).flat() as string[] : [e?.data?.message || 'Could not save user.']
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
    :title="isEdit ? 'Edit User' : 'Add User'"
    subtitle="กรอกข้อมูลผู้ใช้งานให้ครบถ้วน แล้วกดบันทึก"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="med-form-grid">
      <div class="med-field">
        <label>ชื่อ-นามสกุล</label>
        <MInput v-model="form.name" full placeholder="เช่น นพ. สมชาย ใจดี" />
      </div>
      <div class="med-field">
        <label>อีเมล</label>
        <MInput v-model="form.email" full type="email" placeholder="name@medreco.com" />
      </div>
      <div class="med-field">
        <label>Username</label>
        <MInput v-model="form.username" full placeholder="somchai.j" />
      </div>
      <div class="med-field">
        <label>หมายเลขโทรศัพท์</label>
        <MInput v-model="form.phone" full placeholder="08x-xxx-xxxx" />
      </div>
      <div class="med-field">
        <label>บทบาท (Role)</label>
        <MSelect v-model="form.role_id" :options="sel(roles, '— เลือกบทบาท —')" />
      </div>
      <div class="med-field">
        <label>สถานะ</label>
        <MSelect v-model="form.status" :options="[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]" />
      </div>
      <div class="med-field">
        <label>คลินิก</label>
        <MSelect v-model="form.clinic_id" :options="sel(clinics, '— เลือกคลินิก —')" />
      </div>
      <div class="med-field">
        <label>สาขา</label>
        <MSelect v-model="form.branch_id" :options="sel(branches, '— เลือกสาขา —')" />
      </div>
      <div class="med-field med-field--full">
        <label>{{ isEdit ? 'รหัสผ่านใหม่ (เว้นว่างถ้าไม่เปลี่ยน)' : 'รหัสผ่าน' }}</label>
        <MInput v-model="form.password" full type="password" placeholder="••••••••" />
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
