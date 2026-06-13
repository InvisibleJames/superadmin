<script setup lang="ts">
import type { SaUserRow } from '~/composables/useSaUsers'

const s = useSaUsers()
const ready = ref(false)
const rowsMenuOpen = ref(false)

const formOpen = ref(false)
const editRecord = ref<SaUserRow | null>(null)
const bulkOpen = ref(false)

function openAdd() {
  editRecord.value = null
  formOpen.value = true
}
function openEdit(row: SaUserRow) {
  editRecord.value = row
  formOpen.value = true
}

onMounted(async () => {
  await s.fetchMeta()
  await s.refresh()
  ready.value = true
})

const statusOptions = computed(() =>
  (s.meta.value?.statuses ?? [{ value: 'all', label: 'All' }]).map((o) => ({ value: o.value, label: o.label })),
)
const roleOptions = computed(() =>
  (s.meta.value?.admin_roles ?? [{ value: 'all', label: 'All' }]).map((o) => ({ value: o.value, label: o.label })),
)

const selectedCount = computed(() => s.selected.value.size)
const showingText = computed(() => {
  if (s.total.value === 0) return 'No results'
  const from = (s.page.value - 1) * s.perPage.value + 1
  const to = Math.min(s.page.value * s.perPage.value, s.total.value)
  return `Showing ${groupNumber(from)}–${groupNumber(to)} of ${groupNumber(s.total.value)} SA users`
})
const pages = computed(() => pageItems(s.page.value, s.lastPage.value))
const isEmpty = computed(() => ready.value && !s.loading.value && s.rows.value.length === 0)

function sortGlyph(col: 'name' | 'status' | 'created' | 'last_active') {
  if (s.sort.value !== col) return { opacity: 0.25, transform: 'none' }
  return { opacity: 1, transform: s.dir.value === 'asc' ? 'rotate(180deg)' : 'none' }
}

async function onDelete(row: SaUserRow) {
  if (confirm(`Delete ${row.name}? This cannot be undone.`)) await s.deleteSaUser(row.id)
}
</script>

<template>
  <div class="p-7 max-w-[1440px] mx-auto flex flex-col gap-[22px]">
    <!-- Page header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="m-0 text-[24px] font-semibold tracking-[-0.01em] text-ink">SA Users</h1>
        <p class="mt-1.5 text-[13.5px] text-ink-3">Manage internal Super Admin accounts and their platform access.</p>
      </div>
      <div class="flex gap-2.5 items-center">
        <MButton variant="secondary"><MIcon name="exportOut" :size="16" />Export CSV</MButton>
        <MButton variant="primary" @click="openAdd"><MIcon name="plus" :size="16" />Add SA User</MButton>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(190px, 1fr))">
      <MStatCard label="Total SA Users" :value="groupNumber(s.stats.value?.total)" accent="teal" icon="shieldCheck" />
      <MStatCard label="Active" :value="groupNumber(s.stats.value?.active)" accent="success" icon="activate" />
      <MStatCard label="Super Admins" :value="groupNumber(s.stats.value?.super_admins)" accent="amber" icon="shield" />
      <MStatCard label="2FA Enabled" :value="groupNumber(s.stats.value?.two_fa)" accent="blue" icon="lock" />
    </div>

    <!-- Filters -->
    <div class="flex gap-3 items-center flex-wrap">
      <div class="flex-1 min-w-[280px]" style="flex-basis: 360px">
        <MInput v-model="s.filters.q" full size="lg" icon="search" placeholder="Search by name, email, ID..." />
      </div>
      <MSelect v-model="s.filters.status" label="Status" :options="statusOptions" />
      <MSelect v-model="s.filters.admin_role" label="Role" :options="roleOptions" />
      <MIconButton title="Reset filters" variant="secondary" @click="s.resetFilters()"><MIcon name="reset" :size="16" /></MIconButton>
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
          <MButton variant="secondary" size="sm" @click="s.bulk('activate')"><MIcon name="activate" :size="15" />Activate</MButton>
          <MButton variant="secondary" size="sm" @click="s.bulk('deactivate')"><MIcon name="deactivate" :size="15" />Deactivate</MButton>
          <button class="med-clear" @click="s.clearSelection()"><MIcon name="x" :size="14" />Clear</button>
        </div>
        <span v-else class="text-[13.5px] text-ink-2">
          <b class="text-ink font-semibold">{{ groupNumber(s.total.value) }}</b> {{ s.total.value === 1 ? 'SA user' : 'SA users' }}
        </span>
      </div>

      <div class="med-scroll overflow-x-auto">
        <table class="med-table" style="min-width: 1060px">
          <thead>
            <tr>
              <th class="med-th med-th--check">
                <MCheckbox :checked="s.allChecked.value" :indeterminate="s.someChecked.value" @change="s.toggleAll()" />
              </th>
              <th class="med-th med-th--sort" @click="s.toggleSort('name')">
                <span class="inline-flex items-center gap-1.5">SA User<MIcon name="chevronDown" :size="13" :style="sortGlyph('name')" /></span>
              </th>
              <th class="med-th">Email</th>
              <th class="med-th">Admin Role</th>
              <th class="med-th">2FA</th>
              <th class="med-th med-th--sort" @click="s.toggleSort('last_active')">
                <span class="inline-flex items-center gap-1.5">Last Active<MIcon name="chevronDown" :size="13" :style="sortGlyph('last_active')" /></span>
              </th>
              <th class="med-th med-th--sort" @click="s.toggleSort('status')">
                <span class="inline-flex items-center gap-1.5">Status<MIcon name="chevronDown" :size="13" :style="sortGlyph('status')" /></span>
              </th>
              <th class="med-th med-th--right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in s.rows.value" :key="row.id" :data-selected="s.selected.value.has(row.id)">
              <td class="med-td med-td--check">
                <MCheckbox :checked="s.selected.value.has(row.id)" @change="s.toggleRow(row.id)" />
              </td>
              <td class="med-td">
                <div class="flex items-center gap-[11px]">
                  <MAvatar :name="row.name" :size="34" />
                  <div class="min-w-0">
                    <div class="text-[13.5px] font-semibold text-ink whitespace-nowrap">{{ row.name }}</div>
                    <div class="font-mono text-[11.5px] text-ink-3">{{ row.code }}</div>
                  </div>
                </div>
              </td>
              <td class="med-td text-[13px] text-ink-2 whitespace-nowrap">{{ row.email }}</td>
              <td class="med-td">
                <MBadge :tone="row.admin_role_tone" size="sm">{{ row.admin_role }}</MBadge>
              </td>
              <td class="med-td">
                <MBadge :tone="row.two_fa ? 'success' : 'neutral'" dot size="sm">
                  {{ row.two_fa ? 'Enabled' : 'Disabled' }}
                </MBadge>
              </td>
              <td class="med-td font-mono text-[12.5px] whitespace-nowrap" :style="{ color: row.last_active_at ? 'var(--text-secondary)' : 'var(--text-tertiary)' }">
                {{ formatLastLogin(row.last_active_at) }}
              </td>
              <td class="med-td">
                <MBadge :tone="row.status === 'active' ? 'success' : 'danger'" dot size="sm">
                  {{ row.status === 'active' ? 'Active' : 'Inactive' }}
                </MBadge>
              </td>
              <td class="med-td med-td--right">
                <div class="flex gap-2 items-center justify-end">
                  <MIconButton title="Edit" size="sm" @click="openEdit(row)"><MIcon name="edit" :size="15" /></MIconButton>
                  <MIconButton :title="row.status === 'active' ? 'Deactivate' : 'Activate'" size="sm" @click="s.toggleStatus(row)">
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
          <div class="text-[15px] font-semibold text-ink">No SA users found</div>
          <div class="text-[13px] text-ink-3 max-w-[320px]">Try adjusting your search or filters.</div>
          <div class="mt-1"><MButton variant="secondary" size="sm" @click="s.resetFilters()">Clear filters</MButton></div>
        </div>
        <div v-else-if="!ready || s.loading.value" class="px-5 py-14 text-center text-[13px] text-ink-3">Loading SA users…</div>
      </div>

      <!-- Pagination -->
      <div class="med-pagination">
        <div class="flex items-center gap-4 flex-wrap">
          <div class="relative flex items-center gap-2">
            <span class="text-[13px] text-ink-3">Rows</span>
            <button class="med-rows-btn" @click="rowsMenuOpen = !rowsMenuOpen">
              {{ s.perPage.value }}<MIcon name="chevronDown" :size="13" class="text-ink-3" />
            </button>
            <div v-if="rowsMenuOpen">
              <div class="fixed inset-0 z-[49]" @click="rowsMenuOpen = false" />
              <div class="med-rows-menu">
                <button v-for="opt in s.perPageOptions" :key="opt" class="med-rows-menu__item" @click="s.setPerPage(opt); rowsMenuOpen = false">{{ opt }}</button>
              </div>
            </div>
          </div>
          <span class="text-[13px] text-ink-3">{{ showingText }}</span>
        </div>
        <div class="flex gap-1.5 items-center">
          <button class="med-pg" :disabled="s.page.value === 1" @click="s.setPage(1)">«</button>
          <button class="med-pg" :disabled="s.page.value === 1" @click="s.setPage(s.page.value - 1)">‹</button>
          <template v-for="(pi, i) in pages" :key="i">
            <button v-if="pi !== '…'" class="med-pg" :class="{ 'med-pg--active': pi === s.page.value }" @click="s.setPage(pi as number)">{{ pi }}</button>
            <span v-else class="text-ink-3 px-1">…</span>
          </template>
          <button class="med-pg" :disabled="s.page.value === s.lastPage.value" @click="s.setPage(s.page.value + 1)">›</button>
          <button class="med-pg" :disabled="s.page.value === s.lastPage.value" @click="s.setPage(s.lastPage.value)">»</button>
        </div>
      </div>
    </div>
    <SaUserFormModal v-model="formOpen" :record="editRecord" :roles="s.meta.value?.admin_roles ?? []" :save="s.save" />
    <BulkDeleteModal v-model="bulkOpen" :count="selectedCount" noun="SA user" :runner="s.bulkDeleteWithProgress" />
  </div>
</template>
