export interface SaUserRow {
  id: number
  code: string
  name: string
  email: string
  admin_role: string
  admin_role_tone: 'neutral' | 'teal' | 'blue' | 'violet' | 'amber' | 'success' | 'danger'
  two_fa: boolean
  status: 'active' | 'inactive'
  last_active_at: string | null
  created_at: string | null
}

export interface SaUserStats {
  total: number
  active: number
  super_admins: number
  two_fa: number
}

interface SaMeta {
  admin_roles: { value: string; label: string }[]
  statuses: { value: string; label: string }[]
}

const PER_PAGE_OPTIONS = [10, 25, 50, 100]

export function useSaUsers() {
  const api = useApi()

  const filters = reactive({ q: '', status: 'all', admin_role: 'all' })
  const sort = ref<'name' | 'status' | 'created' | 'last_active'>('created')
  const dir = ref<'asc' | 'desc'>('desc')
  const page = ref(1)
  const perPage = ref(10)

  const rows = ref<SaUserRow[]>([])
  const total = ref(0)
  const lastPage = ref(1)
  const loading = ref(false)
  const stats = ref<SaUserStats | null>(null)
  const meta = ref<SaMeta | null>(null)
  const selected = ref<Set<number>>(new Set())

  function buildQuery() {
    const q: Record<string, string | number> = {
      page: page.value,
      per_page: perPage.value,
      sort: sort.value,
      dir: dir.value,
    }
    if (filters.q) q.q = filters.q
    if (filters.status && filters.status !== 'all') q.status = filters.status
    if (filters.admin_role && filters.admin_role !== 'all') q.admin_role = filters.admin_role
    return q
  }

  async function fetchRows() {
    loading.value = true
    try {
      const res = await api<{ data: SaUserRow[]; meta: { total: number; last_page: number } }>('/sa-users', {
        query: buildQuery(),
      })
      rows.value = res.data
      total.value = res.meta.total
      lastPage.value = res.meta.last_page
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    const q: Record<string, string | number> = {}
    if (filters.q) q.q = filters.q
    if (filters.admin_role && filters.admin_role !== 'all') q.admin_role = filters.admin_role
    stats.value = await api<SaUserStats>('/sa-users/stats', { query: q })
  }

  async function fetchMeta() {
    const full = await api<{ admin_roles: SaMeta['admin_roles']; statuses: SaMeta['statuses'] }>('/meta')
    meta.value = { admin_roles: full.admin_roles, statuses: full.statuses }
  }

  async function refresh() {
    await Promise.all([fetchRows(), fetchStats()])
  }

  function toggleSort(column: 'name' | 'status' | 'created' | 'last_active') {
    if (sort.value === column) {
      dir.value = dir.value === 'asc' ? 'desc' : 'asc'
    } else {
      sort.value = column
      dir.value = 'asc'
    }
    page.value = 1
    fetchRows()
  }

  function resetFilters() {
    filters.q = ''
    filters.status = 'all'
    filters.admin_role = 'all'
    page.value = 1
    refresh()
  }

  function setPage(p: number) {
    if (p < 1 || p > lastPage.value || p === page.value) return
    page.value = p
    fetchRows()
  }
  function setPerPage(n: number) {
    perPage.value = n
    page.value = 1
    fetchRows()
  }

  function toggleRow(id: number) {
    const s = new Set(selected.value)
    s.has(id) ? s.delete(id) : s.add(id)
    selected.value = s
  }
  function clearSelection() {
    selected.value = new Set()
  }
  const allChecked = computed(() => rows.value.length > 0 && rows.value.every((r) => selected.value.has(r.id)))
  const someChecked = computed(() => rows.value.some((r) => selected.value.has(r.id)) && !allChecked.value)
  function toggleAll() {
    allChecked.value ? clearSelection() : (selected.value = new Set(rows.value.map((r) => r.id)))
  }

  async function bulk(action: 'activate' | 'deactivate' | 'delete') {
    const ids = [...selected.value]
    if (!ids.length) return
    await api('/sa-users/bulk', { method: 'POST', body: { action, ids } })
    clearSelection()
    await refresh()
  }

  async function deleteSaUser(id: number) {
    await api(`/sa-users/${id}`, { method: 'DELETE' })
    await refresh()
  }

  async function toggleStatus(row: SaUserRow) {
    await api(`/sa-users/${row.id}`, {
      method: 'PUT',
      body: {
        name: row.name,
        email: row.email,
        admin_role: row.admin_role,
        two_fa: row.two_fa,
        status: row.status === 'active' ? 'inactive' : 'active',
      },
    })
    await refresh()
  }

  let searchTimer: ReturnType<typeof setTimeout> | null = null
  watch(
    () => filters.q,
    () => {
      if (searchTimer) clearTimeout(searchTimer)
      searchTimer = setTimeout(() => {
        page.value = 1
        refresh()
      }, 300)
    },
  )
  watch(
    () => [filters.status, filters.admin_role],
    () => {
      page.value = 1
      refresh()
    },
  )


  async function save(payload: Record<string, unknown>, id?: number) {
    if (id) await api(`/sa-users/${id}`, { method: 'PUT', body: payload })
    else await api('/sa-users', { method: 'POST', body: payload })
    await refresh()
  }

  async function bulkDeleteWithProgress(onProgress: (done: number, total: number) => void) {
    const ids = [...selected.value]
    const total = ids.length
    let done = 0
    for (const id of ids) {
      try {
        await api(`/sa-users/${id}`, { method: 'DELETE' })
      } catch {
        // skip records the API refuses (e.g. a protected super admin)
      }
      onProgress(++done, total)
    }
    clearSelection()
    await refresh()
  }

  return {
    filters,
    sort,
    dir,
    page,
    perPage,
    perPageOptions: PER_PAGE_OPTIONS,
    rows,
    total,
    lastPage,
    loading,
    stats,
    meta,
    selected,
    allChecked,
    someChecked,
    fetchMeta,
    refresh,
    toggleSort,
    resetFilters,
    setPage,
    setPerPage,
    toggleRow,
    toggleAll,
    clearSelection,
    bulk,
    deleteSaUser,
    toggleStatus,
    save,
    bulkDeleteWithProgress,
  }
}
