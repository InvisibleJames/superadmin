<script setup lang="ts">
import type { PatientRow } from '~/composables/usePatients'

const p = usePatients()
const ready = ref(false)
const rowsMenuOpen = ref(false)

const formOpen = ref(false)
const editRecord = ref<PatientRow | null>(null)
const bulkOpen = ref(false)

function openAdd() {
  editRecord.value = null
  formOpen.value = true
}
function openEdit(row: PatientRow) {
  editRecord.value = row
  formOpen.value = true
}

onMounted(async () => {
  await p.fetchMeta()
  await p.refresh()
  ready.value = true
})

const statusOptions = computed(() =>
  (p.meta.value?.statuses ?? [{ value: 'all', label: 'All' }]).map((s) => ({ value: s.value, label: s.label })),
)
const genderOptions = computed(() =>
  (p.meta.value?.genders ?? [{ value: 'all', label: 'All' }]).map((g) => ({ value: g.value, label: g.label })),
)
const branchOptions = computed(() => [
  { value: '', label: 'All' },
  ...(p.meta.value?.branches.map((br) => ({ value: br.id, label: br.name })) ?? []),
])

const selectedCount = computed(() => p.selected.value.size)
const showingText = computed(() => {
  if (p.total.value === 0) return 'No results'
  const from = (p.page.value - 1) * p.perPage.value + 1
  const to = Math.min(p.page.value * p.perPage.value, p.total.value)
  return `Showing ${groupNumber(from)}–${groupNumber(to)} of ${groupNumber(p.total.value)} patients`
})
const pages = computed(() => pageItems(p.page.value, p.lastPage.value))
const isEmpty = computed(() => ready.value && !p.loading.value && p.rows.value.length === 0)

function sortGlyph(col: 'name' | 'status' | 'created' | 'last_visit') {
  if (p.sort.value !== col) return { opacity: 0.25, transform: 'none' }
  return { opacity: 1, transform: p.dir.value === 'asc' ? 'rotate(180deg)' : 'none' }
}

function genderAge(row: PatientRow) {
  const parts: string[] = []
  if (row.gender) parts.push(row.gender)
  if (row.age != null) parts.push(`${row.age}y`)
  return parts.join(' · ') || '—'
}

async function onDelete(row: PatientRow) {
  if (confirm(`Delete ${row.name}? This cannot be undone.`)) await p.deletePatient(row.id)
}
</script>

<template>
  <div class="p-7 max-w-[1440px] mx-auto flex flex-col gap-[22px]">
    <!-- Page header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="m-0 text-[24px] font-semibold tracking-[-0.01em] text-ink">Patients</h1>
        <p class="mt-1.5 text-[13.5px] text-ink-3">Manage patient records, status and access history across clinics &amp; branches.</p>
      </div>
      <div class="flex gap-2.5 items-center">
        <MButton variant="secondary"><MIcon name="importIn" :size="16" />Import CSV</MButton>
        <MButton variant="secondary"><MIcon name="exportOut" :size="16" />Export CSV</MButton>
        <MButton variant="primary" @click="openAdd"><MIcon name="plus" :size="16" />Add Patient</MButton>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(190px, 1fr))">
      <MStatCard label="Total Patients" :value="groupNumber(p.stats.value?.total)" accent="teal" icon="patient" />
      <MStatCard label="Active Patients" :value="groupNumber(p.stats.value?.active)" accent="success" icon="activate" />
      <MStatCard label="Inactive Patients" :value="groupNumber(p.stats.value?.inactive)" accent="danger" icon="deactivate" />
      <MStatCard label="New This Month" :value="groupNumber(p.stats.value?.new_this_month)" accent="blue" icon="branch" />
    </div>

    <!-- Filters -->
    <div class="flex gap-3 items-center flex-wrap">
      <div class="flex-1 min-w-[280px]" style="flex-basis: 360px">
        <MInput v-model="p.filters.q" full size="lg" icon="search" placeholder="Search by name, HN, phone, patient ID..." />
      </div>
      <MSelect v-model="p.filters.status" label="Status" :options="statusOptions" />
      <MSelect v-model="p.filters.gender" label="Gender" :options="genderOptions" />
      <MSelect v-model="p.filters.branch_id" label="Branch" :options="branchOptions" />
      <MIconButton title="Reset filters" variant="secondary" @click="p.resetFilters()"><MIcon name="reset" :size="16" /></MIconButton>
    </div>

    <!-- Table card -->
    <div class="med-table-card">
      <div class="med-table-toolbar">
        <div v-if="selectedCount > 0" class="flex items-center gap-3 flex-wrap" style="animation: med-bulk-in 0.18s var(--ease-out)">
          <span class="inline-flex items-center gap-2 text-[13.5px] text-ink font-semibold">
            <span class="med-count-pill">{{ selectedCount }}</span>selected
          </span>
          <div class="w-px h-[22px] bg-[var(--border-default)]" />
          <MButton variant="danger" size="sm" @click="bulkOpen = true"><MIcon name="trash" :size="15" />Bulk Delete</MButton>
          <MButton variant="secondary" size="sm" @click="p.bulk('activate')"><MIcon name="activate" :size="15" />Activate</MButton>
          <MButton variant="secondary" size="sm" @click="p.bulk('deactivate')"><MIcon name="deactivate" :size="15" />Deactivate</MButton>
          <button class="med-clear" @click="p.clearSelection()"><MIcon name="x" :size="14" />Clear</button>
        </div>
        <span v-else class="text-[13.5px] text-ink-2">
          <b class="text-ink font-semibold">{{ groupNumber(p.total.value) }}</b> {{ p.total.value === 1 ? 'patient' : 'patients' }}
        </span>
      </div>

      <div class="med-scroll overflow-x-auto">
        <table class="med-table" style="min-width: 1080px">
          <thead>
            <tr>
              <th class="med-th med-th--check">
                <MCheckbox :checked="p.allChecked.value" :indeterminate="p.someChecked.value" @change="p.toggleAll()" />
              </th>
              <th class="med-th med-th--sort" @click="p.toggleSort('name')">
                <span class="inline-flex items-center gap-1.5">Patient<MIcon name="chevronDown" :size="13" :style="sortGlyph('name')" /></span>
              </th>
              <th class="med-th">Gender / Age</th>
              <th class="med-th">Clinic / Branch</th>
              <th class="med-th">Phone</th>
              <th class="med-th med-th--sort" @click="p.toggleSort('last_visit')">
                <span class="inline-flex items-center gap-1.5">Last Visit<MIcon name="chevronDown" :size="13" :style="sortGlyph('last_visit')" /></span>
              </th>
              <th class="med-th med-th--sort" @click="p.toggleSort('status')">
                <span class="inline-flex items-center gap-1.5">Status<MIcon name="chevronDown" :size="13" :style="sortGlyph('status')" /></span>
              </th>
              <th class="med-th med-th--sort" @click="p.toggleSort('created')">
                <span class="inline-flex items-center gap-1.5">Registered<MIcon name="chevronDown" :size="13" :style="sortGlyph('created')" /></span>
              </th>
              <th class="med-th med-th--right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in p.rows.value" :key="row.id" :data-selected="p.selected.value.has(row.id)">
              <td class="med-td med-td--check">
                <MCheckbox :checked="p.selected.value.has(row.id)" @change="p.toggleRow(row.id)" />
              </td>
              <td class="med-td">
                <div class="flex items-center gap-[11px]">
                  <MAvatar :name="row.name" :size="34" />
                  <div class="min-w-0">
                    <div class="text-[13.5px] font-semibold text-ink whitespace-nowrap">{{ row.name }}</div>
                    <div class="font-mono text-[11.5px] text-ink-3">{{ row.hn }}</div>
                  </div>
                </div>
              </td>
              <td class="med-td text-[13px] text-ink-2 whitespace-nowrap">{{ genderAge(row) }}</td>
              <td class="med-td">
                <div class="text-[13px] text-ink-2 whitespace-nowrap">{{ row.clinic?.name ?? '—' }}</div>
                <div class="text-[11.5px] text-ink-3">{{ row.branch?.name ?? '—' }}</div>
              </td>
              <td class="med-td font-mono text-[12.5px] text-ink-2 whitespace-nowrap">{{ row.phone ?? '—' }}</td>
              <td class="med-td text-[13px] text-ink-2 whitespace-nowrap">{{ formatDate(row.last_visit_at) }}</td>
              <td class="med-td">
                <MBadge :tone="row.status === 'active' ? 'success' : 'danger'" dot size="sm">
                  {{ row.status === 'active' ? 'Active' : 'Inactive' }}
                </MBadge>
              </td>
              <td class="med-td">
                <div class="text-[13px] text-ink-2 whitespace-nowrap">{{ formatDate(row.created_at) }}</div>
                <div class="font-mono text-[11.5px] text-ink-3">{{ formatTime(row.created_at) }}</div>
              </td>
              <td class="med-td med-td--right">
                <div class="flex gap-2 items-center justify-end">
                  <MIconButton title="Edit" size="sm" @click="openEdit(row)"><MIcon name="edit" :size="15" /></MIconButton>
                  <MIconButton :title="row.status === 'active' ? 'Deactivate' : 'Activate'" size="sm" @click="p.toggleStatus(row)">
                    <MIcon name="power" :size="15" />
                  </MIconButton>
                  <MIconButton title="Delete" size="sm" @click="onDelete(row)"><MIcon name="trash" :size="15" /></MIconButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="isEmpty" class="flex flex-col items-center gap-3 px-5 py-14 text-center">
          <div class="med-empty-icon"><MIcon name="search" :size="24" /></div>
          <div class="text-[15px] font-semibold text-ink">No patients found</div>
          <div class="text-[13px] text-ink-3 max-w-[320px]">Try adjusting your search or filters to find what you're looking for.</div>
          <div class="mt-1"><MButton variant="secondary" size="sm" @click="p.resetFilters()">Clear filters</MButton></div>
        </div>
        <div v-else-if="!ready || p.loading.value" class="px-5 py-14 text-center text-[13px] text-ink-3">Loading patients…</div>
      </div>

      <!-- Pagination -->
      <div class="med-pagination">
        <div class="flex items-center gap-4 flex-wrap">
          <div class="relative flex items-center gap-2">
            <span class="text-[13px] text-ink-3">Rows</span>
            <button class="med-rows-btn" @click="rowsMenuOpen = !rowsMenuOpen">
              {{ p.perPage.value }}<MIcon name="chevronDown" :size="13" class="text-ink-3" />
            </button>
            <div v-if="rowsMenuOpen">
              <div class="fixed inset-0 z-[49]" @click="rowsMenuOpen = false" />
              <div class="med-rows-menu">
                <button v-for="opt in p.perPageOptions" :key="opt" class="med-rows-menu__item" @click="p.setPerPage(opt); rowsMenuOpen = false">{{ opt }}</button>
              </div>
            </div>
          </div>
          <span class="text-[13px] text-ink-3">{{ showingText }}</span>
        </div>
        <div class="flex gap-1.5 items-center">
          <button class="med-pg" :disabled="p.page.value === 1" @click="p.setPage(1)">«</button>
          <button class="med-pg" :disabled="p.page.value === 1" @click="p.setPage(p.page.value - 1)">‹</button>
          <template v-for="(pi, i) in pages" :key="i">
            <button v-if="pi !== '…'" class="med-pg" :class="{ 'med-pg--active': pi === p.page.value }" @click="p.setPage(pi as number)">{{ pi }}</button>
            <span v-else class="text-ink-3 px-1">…</span>
          </template>
          <button class="med-pg" :disabled="p.page.value === p.lastPage.value" @click="p.setPage(p.page.value + 1)">›</button>
          <button class="med-pg" :disabled="p.page.value === p.lastPage.value" @click="p.setPage(p.lastPage.value)">»</button>
        </div>
      </div>
    </div>
    <PatientFormModal v-model="formOpen" :record="editRecord" :clinics="p.meta.value?.clinics ?? []" :branches="p.meta.value?.branches ?? []" :save="p.save" />
    <BulkDeleteModal v-model="bulkOpen" :count="selectedCount" noun="patient" :runner="p.bulkDeleteWithProgress" />
  </div>
</template>
