<script setup lang="ts">
import type { ClinicRow } from '~/composables/useClinics'

const c = useClinics()
const ready = ref(false)
const rowsMenuOpen = ref(false)

const formOpen = ref(false)
const editRecord = ref<ClinicRow | null>(null)
const bulkOpen = ref(false)

function openAdd() {
  editRecord.value = null
  formOpen.value = true
}
function openEdit(row: ClinicRow) {
  editRecord.value = row
  formOpen.value = true
}

onMounted(async () => {
  await c.fetchMeta()
  await c.refresh()
  ready.value = true
})

const statusOptions = computed(() =>
  (c.meta.value?.statuses ?? [{ value: 'all', label: 'All' }]).map((s) => ({ value: s.value, label: s.label })),
)
const provinceOptions = computed(() => [
  { value: '', label: 'All' },
  ...(c.meta.value?.provinces.map((p) => ({ value: p.value, label: p.label })) ?? []),
])

const selectedCount = computed(() => c.selected.value.size)
const showingText = computed(() => {
  if (c.total.value === 0) return 'No results'
  const from = (c.page.value - 1) * c.perPage.value + 1
  const to = Math.min(c.page.value * c.perPage.value, c.total.value)
  return `Showing ${groupNumber(from)}–${groupNumber(to)} of ${groupNumber(c.total.value)} clinics`
})
const pages = computed(() => pageItems(c.page.value, c.lastPage.value))
const isEmpty = computed(() => ready.value && !c.loading.value && c.rows.value.length === 0)

function sortGlyph(col: 'name' | 'status' | 'created' | 'patients') {
  if (c.sort.value !== col) return { opacity: 0.25, transform: 'none' }
  return { opacity: 1, transform: c.dir.value === 'asc' ? 'rotate(180deg)' : 'none' }
}

async function onDelete(row: ClinicRow) {
  if (confirm(`Delete ${row.name}? This cannot be undone.`)) await c.deleteClinic(row.id)
}
</script>

<template>
  <div class="p-7 max-w-[1440px] mx-auto flex flex-col gap-[22px]">
    <!-- Page header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="m-0 text-[24px] font-semibold tracking-[-0.01em] text-ink">Clinics</h1>
        <p class="mt-1.5 text-[13.5px] text-ink-3">Manage clinics, their branches, status and coverage across MedReco.</p>
      </div>
      <div class="flex gap-2.5 items-center">
        <MButton variant="secondary"><MIcon name="exportOut" :size="16" />Export CSV</MButton>
        <MButton variant="primary" @click="openAdd"><MIcon name="plus" :size="16" />Add Clinic</MButton>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(190px, 1fr))">
      <MStatCard label="Total Clinics" :value="groupNumber(c.stats.value?.total)" accent="teal" icon="clinic" />
      <MStatCard label="Active Clinics" :value="groupNumber(c.stats.value?.active)" accent="success" icon="activate" />
      <MStatCard label="Inactive Clinics" :value="groupNumber(c.stats.value?.inactive)" accent="danger" icon="deactivate" />
      <MStatCard label="Total Branches" :value="groupNumber(c.stats.value?.branches)" accent="blue" icon="branch" />
    </div>

    <!-- Filters -->
    <div class="flex gap-3 items-center flex-wrap">
      <div class="flex-1 min-w-[280px]" style="flex-basis: 360px">
        <MInput v-model="c.filters.q" full size="lg" icon="search" placeholder="Search by clinic name, code, province..." />
      </div>
      <MSelect v-model="c.filters.status" label="Status" :options="statusOptions" />
      <MSelect v-model="c.filters.province" label="Province" :options="provinceOptions" />
      <MIconButton title="Reset filters" variant="secondary" @click="c.resetFilters()"><MIcon name="reset" :size="16" /></MIconButton>
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
          <MButton variant="secondary" size="sm" @click="c.bulk('activate')"><MIcon name="activate" :size="15" />Activate</MButton>
          <MButton variant="secondary" size="sm" @click="c.bulk('deactivate')"><MIcon name="deactivate" :size="15" />Deactivate</MButton>
          <button class="med-clear" @click="c.clearSelection()"><MIcon name="x" :size="14" />Clear</button>
        </div>
        <span v-else class="text-[13.5px] text-ink-2">
          <b class="text-ink font-semibold">{{ groupNumber(c.total.value) }}</b> {{ c.total.value === 1 ? 'clinic' : 'clinics' }}
        </span>
      </div>

      <div class="med-scroll overflow-x-auto">
        <table class="med-table" style="min-width: 980px">
          <thead>
            <tr>
              <th class="med-th med-th--check">
                <MCheckbox :checked="c.allChecked.value" :indeterminate="c.someChecked.value" @change="c.toggleAll()" />
              </th>
              <th class="med-th med-th--sort" @click="c.toggleSort('name')">
                <span class="inline-flex items-center gap-1.5">Clinic<MIcon name="chevronDown" :size="13" :style="sortGlyph('name')" /></span>
              </th>
              <th class="med-th">Code</th>
              <th class="med-th">Province</th>
              <th class="med-th">Branches</th>
              <th class="med-th med-th--sort" @click="c.toggleSort('patients')">
                <span class="inline-flex items-center gap-1.5">Patients<MIcon name="chevronDown" :size="13" :style="sortGlyph('patients')" /></span>
              </th>
              <th class="med-th med-th--sort" @click="c.toggleSort('status')">
                <span class="inline-flex items-center gap-1.5">Status<MIcon name="chevronDown" :size="13" :style="sortGlyph('status')" /></span>
              </th>
              <th class="med-th med-th--sort" @click="c.toggleSort('created')">
                <span class="inline-flex items-center gap-1.5">Created<MIcon name="chevronDown" :size="13" :style="sortGlyph('created')" /></span>
              </th>
              <th class="med-th med-th--right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in c.rows.value" :key="row.id" :data-selected="c.selected.value.has(row.id)">
              <td class="med-td med-td--check">
                <MCheckbox :checked="c.selected.value.has(row.id)" @change="c.toggleRow(row.id)" />
              </td>
              <td class="med-td">
                <div class="flex items-center gap-[11px]">
                  <span class="med-clinic-icon"><MIcon name="clinic" :size="17" /></span>
                  <div class="text-[13.5px] font-semibold text-ink whitespace-nowrap">{{ row.name }}</div>
                </div>
              </td>
              <td class="med-td font-mono text-[12.5px] text-ink-2">{{ row.code }}</td>
              <td class="med-td text-[13px] text-ink-2 whitespace-nowrap">{{ row.province ?? '—' }}</td>
              <td class="med-td font-mono text-[13px] text-ink-2">{{ groupNumber(row.branches_count) }}</td>
              <td class="med-td font-mono text-[13px] text-ink-2">{{ groupNumber(row.patients_count) }}</td>
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
                  <MIconButton :title="row.status === 'active' ? 'Deactivate' : 'Activate'" size="sm" @click="c.toggleStatus(row)">
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
          <div class="text-[15px] font-semibold text-ink">No clinics found</div>
          <div class="text-[13px] text-ink-3 max-w-[320px]">Try adjusting your search or filters to find what you're looking for.</div>
          <div class="mt-1"><MButton variant="secondary" size="sm" @click="c.resetFilters()">Clear filters</MButton></div>
        </div>
        <div v-else-if="!ready || c.loading.value" class="px-5 py-14 text-center text-[13px] text-ink-3">Loading clinics…</div>
      </div>

      <!-- Pagination -->
      <div class="med-pagination">
        <div class="flex items-center gap-4 flex-wrap">
          <div class="relative flex items-center gap-2">
            <span class="text-[13px] text-ink-3">Rows</span>
            <button class="med-rows-btn" @click="rowsMenuOpen = !rowsMenuOpen">
              {{ c.perPage.value }}<MIcon name="chevronDown" :size="13" class="text-ink-3" />
            </button>
            <div v-if="rowsMenuOpen">
              <div class="fixed inset-0 z-[49]" @click="rowsMenuOpen = false" />
              <div class="med-rows-menu">
                <button v-for="opt in c.perPageOptions" :key="opt" class="med-rows-menu__item" @click="c.setPerPage(opt); rowsMenuOpen = false">{{ opt }}</button>
              </div>
            </div>
          </div>
          <span class="text-[13px] text-ink-3">{{ showingText }}</span>
        </div>
        <div class="flex gap-1.5 items-center">
          <button class="med-pg" :disabled="c.page.value === 1" @click="c.setPage(1)">«</button>
          <button class="med-pg" :disabled="c.page.value === 1" @click="c.setPage(c.page.value - 1)">‹</button>
          <template v-for="(pi, i) in pages" :key="i">
            <button v-if="pi !== '…'" class="med-pg" :class="{ 'med-pg--active': pi === c.page.value }" @click="c.setPage(pi as number)">{{ pi }}</button>
            <span v-else class="text-ink-3 px-1">…</span>
          </template>
          <button class="med-pg" :disabled="c.page.value === c.lastPage.value" @click="c.setPage(c.page.value + 1)">›</button>
          <button class="med-pg" :disabled="c.page.value === c.lastPage.value" @click="c.setPage(c.lastPage.value)">»</button>
        </div>
      </div>
    </div>
    <ClinicFormModal v-model="formOpen" :record="editRecord" :save="c.save" />
    <BulkDeleteModal v-model="bulkOpen" :count="selectedCount" noun="clinic" :runner="c.bulkDeleteWithProgress" />
  </div>
</template>

<style scoped>
.med-clinic-icon {
  width: 32px;
  height: 32px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: var(--tint-teal);
  color: var(--teal-400);
}
</style>
