<script setup lang="ts">
import type { UserRow } from '~/composables/useUsers'

const u = useUsers()
const ready = ref(false)
const rowsMenuOpen = ref(false)

onMounted(async () => {
  await u.fetchMeta()
  await u.refresh()
  ready.value = true
})

const roleOptions = computed(() => [
  { value: '', label: 'All' },
  ...(u.meta.value?.roles.map((r) => ({ value: r.id, label: r.name })) ?? []),
])
const statusOptions = computed(() =>
  (u.meta.value?.statuses ?? [{ value: 'all', label: 'All' }]).map((s) => ({ value: s.value, label: s.label })),
)
const clinicOptions = computed(() => [
  { value: '', label: 'All' },
  ...(u.meta.value?.clinics.map((c) => ({ value: c.id, label: c.name })) ?? []),
])
const branchOptions = computed(() => [
  { value: '', label: 'All' },
  ...(u.meta.value?.branches.map((b) => ({ value: b.id, label: b.name })) ?? []),
])

const selectedCount = computed(() => u.selected.value.size)
const showingText = computed(() => {
  if (u.total.value === 0) return 'No results'
  const from = (u.page.value - 1) * u.perPage.value + 1
  const to = Math.min(u.page.value * u.perPage.value, u.total.value)
  return `Showing ${groupNumber(from)}–${groupNumber(to)} of ${groupNumber(u.total.value)} users`
})
const pages = computed(() => pageItems(u.page.value, u.lastPage.value))

const isEmpty = computed(() => ready.value && !u.loading.value && u.rows.value.length === 0)

function sortGlyph(col: 'name' | 'status' | 'created') {
  if (u.sort.value !== col) return { opacity: 0.25, transform: 'none' }
  return { opacity: 1, transform: u.dir.value === 'asc' ? 'rotate(180deg)' : 'none' }
}

async function onToggleStatus(row: UserRow) {
  if (row.is_super_admin) return
  await u.toggleStatus(row)
}
async function onDelete(row: UserRow) {
  if (row.is_super_admin) return
  if (confirm(`Delete ${row.name}? This cannot be undone.`)) await u.deleteUser(row.id)
}
</script>

<template>
  <div class="p-7 max-w-[1440px] mx-auto flex flex-col gap-[22px]">
    <!-- Page header -->
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="m-0 text-[24px] font-semibold tracking-[-0.01em] text-ink">Users Management</h1>
        <p class="mt-1.5 text-[13.5px] text-ink-3">Manage system users, roles, and access across all clinics &amp; branches.</p>
      </div>
      <div class="flex gap-2.5 items-center">
        <MButton variant="secondary"><MIcon name="importIn" :size="16" />Import CSV</MButton>
        <MButton variant="secondary"><MIcon name="exportOut" :size="16" />Export CSV</MButton>
        <MButton variant="primary"><MIcon name="plus" :size="16" />Add User</MButton>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid gap-4" style="grid-template-columns: repeat(auto-fit, minmax(190px, 1fr))">
      <MStatCard label="Total Users" :value="groupNumber(u.stats.value?.total)" accent="teal" icon="users" sublabel="across all clinics" />
      <MStatCard label="Active Users" :value="groupNumber(u.stats.value?.active)" accent="success" icon="activate" />
      <MStatCard label="Inactive Users" :value="groupNumber(u.stats.value?.inactive)" accent="danger" icon="deactivate" />
      <MStatCard label="Total Roles" :value="u.stats.value?.roles ?? 0" accent="blue" icon="roles" sublabel="Owner → Staff" />
      <MStatCard label="Last Import" :value="formatDate(u.stats.value?.last_import ?? null)" accent="amber" icon="importIn" :sublabel="formatTime(u.stats.value?.last_import ?? null)" />
    </div>

    <!-- Filters -->
    <div class="flex gap-3 items-center flex-wrap">
      <div class="flex-1 min-w-[280px]" style="flex-basis: 360px">
        <MInput v-model="u.filters.q" full size="lg" icon="search" placeholder="Search by name, email, phone, username..." />
      </div>
      <MSelect v-model="u.filters.role_id" label="Role" :options="roleOptions" />
      <MSelect v-model="u.filters.status" label="Status" :options="statusOptions" />
      <MSelect v-model="u.filters.clinic_id" label="Clinic" :options="clinicOptions" />
      <MSelect v-model="u.filters.branch_id" label="Branch" :options="branchOptions" />
      <MIconButton title="Reset filters" variant="secondary" @click="u.resetFilters()"><MIcon name="reset" :size="16" /></MIconButton>
    </div>

    <!-- Table card -->
    <div class="med-table-card">
      <!-- Toolbar -->
      <div class="med-table-toolbar">
        <div v-if="selectedCount > 0" class="flex items-center gap-3 flex-wrap" style="animation: med-bulk-in 0.18s var(--ease-out)">
          <span class="inline-flex items-center gap-2 text-[13.5px] text-ink font-semibold">
            <span class="med-count-pill">{{ selectedCount }}</span>selected
          </span>
          <div class="w-px h-[22px] bg-[var(--border-default)]" />
          <MButton variant="danger" size="sm" @click="u.bulk('delete')"><MIcon name="trash" :size="15" />Bulk Delete</MButton>
          <MButton variant="secondary" size="sm" @click="u.bulk('activate')"><MIcon name="activate" :size="15" />Activate</MButton>
          <MButton variant="secondary" size="sm" @click="u.bulk('deactivate')"><MIcon name="deactivate" :size="15" />Deactivate</MButton>
          <button class="med-clear" @click="u.clearSelection()"><MIcon name="x" :size="14" />Clear</button>
        </div>
        <span v-else class="text-[13.5px] text-ink-2">
          <b class="text-ink font-semibold">{{ groupNumber(u.total.value) }}</b> {{ u.total.value === 1 ? 'user' : 'users' }}
        </span>
      </div>

      <!-- Table -->
      <div class="med-scroll overflow-x-auto">
        <table class="med-table">
          <thead>
            <tr>
              <th class="med-th med-th--check">
                <MCheckbox :checked="u.allChecked.value" :indeterminate="u.someChecked.value" @change="u.toggleAll()" />
              </th>
              <th class="med-th med-th--sort" @click="u.toggleSort('name')">
                <span class="inline-flex items-center gap-1.5">Name<MIcon name="chevronDown" :size="13" :style="sortGlyph('name')" /></span>
              </th>
              <th class="med-th">Role</th>
              <th class="med-th">Clinic / Branch</th>
              <th class="med-th">Email</th>
              <th class="med-th med-th--sort" @click="u.toggleSort('status')">
                <span class="inline-flex items-center gap-1.5">Status<MIcon name="chevronDown" :size="13" :style="sortGlyph('status')" /></span>
              </th>
              <th class="med-th med-th--sort" @click="u.toggleSort('created')">
                <span class="inline-flex items-center gap-1.5">Created<MIcon name="chevronDown" :size="13" :style="sortGlyph('created')" /></span>
              </th>
              <th class="med-th">Last Login</th>
              <th class="med-th med-th--right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in u.rows.value" :key="row.id" :data-selected="u.selected.value.has(row.id)">
              <td class="med-td med-td--check">
                <MCheckbox :checked="u.selected.value.has(row.id)" @change="u.toggleRow(row.id)" />
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
              <td class="med-td">
                <MBadge v-if="row.role" :role="row.role.name" size="sm" />
                <span v-else class="text-ink-3 text-[13px]">—</span>
              </td>
              <td class="med-td">
                <div class="text-[13px] text-ink-2 whitespace-nowrap">{{ row.clinic?.name ?? '—' }}</div>
                <div class="text-[11.5px] text-ink-3">{{ row.branch?.name ?? '—' }}</div>
              </td>
              <td class="med-td text-[13px] text-ink-2 whitespace-nowrap">{{ row.email }}</td>
              <td class="med-td">
                <MBadge :tone="row.status === 'active' ? 'success' : 'danger'" dot size="sm">
                  {{ row.status === 'active' ? 'Active' : 'Inactive' }}
                </MBadge>
              </td>
              <td class="med-td">
                <div class="text-[13px] text-ink-2 whitespace-nowrap">{{ formatDate(row.created_at) }}</div>
                <div class="font-mono text-[11.5px] text-ink-3">{{ formatTime(row.created_at) }}</div>
              </td>
              <td class="med-td font-mono text-[12.5px] whitespace-nowrap" :style="{ color: row.last_login_at ? 'var(--text-secondary)' : 'var(--text-tertiary)' }">
                {{ formatLastLogin(row.last_login_at) }}
              </td>
              <td class="med-td med-td--right">
                <div class="flex gap-2 items-center justify-end">
                  <MIconButton title="Edit" size="sm"><MIcon name="edit" :size="15" /></MIconButton>
                  <MIconButton title="Time Table" size="sm"><MIcon name="timetable" :size="15" /></MIconButton>
                  <MIconButton
                    :title="row.status === 'active' ? 'Deactivate' : 'Activate'"
                    size="sm"
                    @click="onToggleStatus(row)"
                  >
                    <MIcon name="power" :size="15" />
                  </MIconButton>
                  <MIconButton title="Delete" size="sm" @click="onDelete(row)"><MIcon name="trash" :size="15" /></MIconButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty state -->
        <div v-if="isEmpty" class="flex flex-col items-center gap-3 px-5 py-14 text-center">
          <div class="med-empty-icon"><MIcon name="search" :size="24" /></div>
          <div class="text-[15px] font-semibold text-ink">No users found</div>
          <div class="text-[13px] text-ink-3 max-w-[320px]">Try adjusting your search or filters to find what you're looking for.</div>
          <div class="mt-1"><MButton variant="secondary" size="sm" @click="u.resetFilters()">Clear filters</MButton></div>
        </div>

        <!-- Loading state -->
        <div v-else-if="!ready || u.loading.value" class="px-5 py-14 text-center text-[13px] text-ink-3">Loading users…</div>
      </div>

      <!-- Pagination -->
      <div class="med-pagination">
        <div class="flex items-center gap-4 flex-wrap">
          <div class="relative flex items-center gap-2">
            <span class="text-[13px] text-ink-3">Rows</span>
            <button class="med-rows-btn" @click="rowsMenuOpen = !rowsMenuOpen">
              {{ u.perPage.value }}<MIcon name="chevronDown" :size="13" class="text-ink-3" />
            </button>
            <div v-if="rowsMenuOpen">
              <div class="fixed inset-0 z-[49]" @click="rowsMenuOpen = false" />
              <div class="med-rows-menu">
                <button
                  v-for="opt in u.perPageOptions"
                  :key="opt"
                  class="med-rows-menu__item"
                  @click="u.setPerPage(opt); rowsMenuOpen = false"
                >
                  {{ opt }}
                </button>
              </div>
            </div>
          </div>
          <span class="text-[13px] text-ink-3">{{ showingText }}</span>
        </div>
        <div class="flex gap-1.5 items-center">
          <button class="med-pg" :disabled="u.page.value === 1" @click="u.setPage(1)">«</button>
          <button class="med-pg" :disabled="u.page.value === 1" @click="u.setPage(u.page.value - 1)">‹</button>
          <template v-for="(pi, i) in pages" :key="i">
            <button v-if="pi !== '…'" class="med-pg" :class="{ 'med-pg--active': pi === u.page.value }" @click="u.setPage(pi as number)">{{ pi }}</button>
            <span v-else class="text-ink-3 px-1">…</span>
          </template>
          <button class="med-pg" :disabled="u.page.value === u.lastPage.value" @click="u.setPage(u.page.value + 1)">›</button>
          <button class="med-pg" :disabled="u.page.value === u.lastPage.value" @click="u.setPage(u.lastPage.value)">»</button>
        </div>
      </div>
    </div>
  </div>
</template>
