<script setup lang="ts">
import type { BranchRow } from '~/composables/useBranches'

const b = useBranches()
const ready = ref(false)
const rowsMenuOpen = ref(false)

const formOpen = ref(false)
const editRecord = ref<BranchRow | null>(null)
const bulkOpen = ref(false)

function openAdd() {
  editRecord.value = null
  formOpen.value = true
}
function openEdit(row: BranchRow) {
  editRecord.value = row
  formOpen.value = true
}

onMounted(async () => {
  await b.fetchMeta()
  await b.refresh()
  ready.value = true
})

const statusOptions = computed(() =>
  (b.meta.value?.statuses ?? [{ value: 'all', label: 'All' }]).map((s) => ({ value: s.value, label: s.label })),
)
const clinicOptions = computed(() => [
  { value: '', label: 'All' },
  ...(b.meta.value?.clinics.map((c) => ({ value: c.id, label: c.name })) ?? []),
])

const selectedCount = computed(() => b.selected.value.size)
const showingText = computed(() => {
  if (b.total.value === 0) return 'No results'
  const from = (b.page.value - 1) * b.perPage.value + 1
  const to = Math.min(b.page.value * b.perPage.value, b.total.value)
  return `Showing ${groupNumber(from)}–${groupNumber(to)} of ${groupNumber(b.total.value)} branches`
})
const pages = computed(() => pageItems(b.page.value, b.lastPage.value))
const isEmpty = computed(() => ready.value && !b.loading.value && b.rows.value.length === 0)

function sortGlyph(col: 'name' | 'status' | 'created') {
  if (b.sort.value !== col) return { opacity: 0.25, transform: 'none' }
  return { opacity: 1, transform: b.dir.value === 'asc' ? 'rotate(180deg)' : 'none' }
}

async function onDelete(row: BranchRow) {
  if (confirm(`Delete ${row.name}? This cannot be undone.`)) await b.deleteBranch(row.id)
}
</script>

<template>
  <div class="p-7 max-w-[1440px] mx-auto flex flex-col gap-[22px]">
    <!-- Page header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="m-0 text-[24px] font-semibold tracking-[-0.01em] text-ink">Clinic Branches</h1>
        <p class="mt-1.5 text-[13.5px] text-ink-3">Manage branches under each clinic, with location, contact and status.</p>
      </div>
      <div class="flex gap-2.5 items-center">
        <MButton variant="secondary"><MIcon name="exportOut" :size="16" />Export CSV</MButton>
        <MButton variant="primary" @click="openAdd"><MIcon name="plus" :size="16" />Add Branch</MButton>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(190px, 1fr))">
      <MStatCard label="Total Branches" :value="groupNumber(b.stats.value?.total)" accent="blue" icon="branch" />
      <MStatCard label="Active Branches" :value="groupNumber(b.stats.value?.active)" accent="success" icon="activate" />
      <MStatCard label="Inactive Branches" :value="groupNumber(b.stats.value?.inactive)" accent="danger" icon="deactivate" />
      <MStatCard label="Clinics Covered" :value="groupNumber(b.stats.value?.clinics)" accent="teal" icon="clinic" />
    </div>

    <!-- Filters -->
    <div class="flex gap-3 items-center flex-wrap">
      <div class="flex-1 min-w-[280px]" style="flex-basis: 360px">
        <MInput v-model="b.filters.q" full size="lg" icon="search" placeholder="Search by branch name, clinic, code, province..." />
      </div>
      <MSelect v-model="b.filters.status" label="Status" :options="statusOptions" />
      <MSelect v-model="b.filters.clinic_id" label="Clinic" :options="clinicOptions" />
      <MIconButton title="Reset filters" variant="secondary" @click="b.resetFilters()"><MIcon name="reset" :size="16" /></MIconButton>
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
          <MButton variant="secondary" size="sm" @click="b.bulk('activate')"><MIcon name="activate" :size="15" />Activate</MButton>
          <MButton variant="secondary" size="sm" @click="b.bulk('deactivate')"><MIcon name="deactivate" :size="15" />Deactivate</MButton>
          <button class="med-clear" @click="b.clearSelection()"><MIcon name="x" :size="14" />Clear</button>
        </div>
        <span v-else class="text-[13.5px] text-ink-2">
          <b class="text-ink font-semibold">{{ groupNumber(b.total.value) }}</b> {{ b.total.value === 1 ? 'branch' : 'branches' }}
        </span>
      </div>

      <div class="med-scroll overflow-x-auto">
        <table class="med-table" style="min-width: 1040px">
          <thead>
            <tr>
              <th class="med-th med-th--check">
                <MCheckbox :checked="b.allChecked.value" :indeterminate="b.someChecked.value" @change="b.toggleAll()" />
              </th>
              <th class="med-th med-th--sort" @click="b.toggleSort('name')">
                <span class="inline-flex items-center gap-1.5">Branch<MIcon name="chevronDown" :size="13" :style="sortGlyph('name')" /></span>
              </th>
              <th class="med-th">Parent Clinic</th>
              <th class="med-th">Code</th>
              <th class="med-th">Province</th>
              <th class="med-th">Phone</th>
              <th class="med-th med-th--sort" @click="b.toggleSort('status')">
                <span class="inline-flex items-center gap-1.5">Status<MIcon name="chevronDown" :size="13" :style="sortGlyph('status')" /></span>
              </th>
              <th class="med-th med-th--sort" @click="b.toggleSort('created')">
                <span class="inline-flex items-center gap-1.5">Created<MIcon name="chevronDown" :size="13" :style="sortGlyph('created')" /></span>
              </th>
              <th class="med-th med-th--right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in b.rows.value" :key="row.id" :data-selected="b.selected.value.has(row.id)">
              <td class="med-td med-td--check">
                <MCheckbox :checked="b.selected.value.has(row.id)" @change="b.toggleRow(row.id)" />
              </td>
              <td class="med-td">
                <div class="flex items-center gap-[11px]">
                  <span class="med-branch-icon"><MIcon name="branch" :size="17" /></span>
                  <div class="text-[13.5px] font-semibold text-ink whitespace-nowrap">{{ row.name }}</div>
                </div>
              </td>
              <td class="med-td text-[13px] text-ink-2 whitespace-nowrap">{{ row.clinic?.name ?? '—' }}</td>
              <td class="med-td font-mono text-[12.5px] text-ink-2">{{ row.code }}</td>
              <td class="med-td text-[13px] text-ink-2 whitespace-nowrap">{{ row.province ?? '—' }}</td>
              <td class="med-td font-mono text-[12.5px] text-ink-2 whitespace-nowrap">{{ row.phone ?? '—' }}</td>
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
                  <MIconButton :title="row.status === 'active' ? 'Deactivate' : 'Activate'" size="sm" @click="b.toggleStatus(row)">
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
          <div class="text-[15px] font-semibold text-ink">No branches found</div>
          <div class="text-[13px] text-ink-3 max-w-[320px]">Try adjusting your search or filters to find what you're looking for.</div>
          <div class="mt-1"><MButton variant="secondary" size="sm" @click="b.resetFilters()">Clear filters</MButton></div>
        </div>
        <div v-else-if="!ready || b.loading.value" class="px-5 py-14 text-center text-[13px] text-ink-3">Loading branches…</div>
      </div>

      <!-- Pagination -->
      <div class="med-pagination">
        <div class="flex items-center gap-4 flex-wrap">
          <div class="relative flex items-center gap-2">
            <span class="text-[13px] text-ink-3">Rows</span>
            <button class="med-rows-btn" @click="rowsMenuOpen = !rowsMenuOpen">
              {{ b.perPage.value }}<MIcon name="chevronDown" :size="13" class="text-ink-3" />
            </button>
            <div v-if="rowsMenuOpen">
              <div class="fixed inset-0 z-[49]" @click="rowsMenuOpen = false" />
              <div class="med-rows-menu">
                <button v-for="opt in b.perPageOptions" :key="opt" class="med-rows-menu__item" @click="b.setPerPage(opt); rowsMenuOpen = false">{{ opt }}</button>
              </div>
            </div>
          </div>
          <span class="text-[13px] text-ink-3">{{ showingText }}</span>
        </div>
        <div class="flex gap-1.5 items-center">
          <button class="med-pg" :disabled="b.page.value === 1" @click="b.setPage(1)">«</button>
          <button class="med-pg" :disabled="b.page.value === 1" @click="b.setPage(b.page.value - 1)">‹</button>
          <template v-for="(pi, i) in pages" :key="i">
            <button v-if="pi !== '…'" class="med-pg" :class="{ 'med-pg--active': pi === b.page.value }" @click="b.setPage(pi as number)">{{ pi }}</button>
            <span v-else class="text-ink-3 px-1">…</span>
          </template>
          <button class="med-pg" :disabled="b.page.value === b.lastPage.value" @click="b.setPage(b.page.value + 1)">›</button>
          <button class="med-pg" :disabled="b.page.value === b.lastPage.value" @click="b.setPage(b.lastPage.value)">»</button>
        </div>
      </div>
    </div>
    <BranchFormModal v-model="formOpen" :record="editRecord" :clinics="b.meta.value?.clinics ?? []" :save="b.save" />
    <BulkDeleteModal v-model="bulkOpen" :count="selectedCount" noun="branch" :runner="b.bulkDeleteWithProgress" />
  </div>
</template>

<style scoped>
.med-branch-icon {
  width: 32px;
  height: 32px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: var(--tint-blue);
  color: var(--blue-400);
}
</style>
