export interface UserRow {
  id: number
  code: string
  name: string
  username: string | null
  email: string
  phone: string | null
  status: 'active' | 'inactive'
  is_super_admin: boolean
  role?: { id: number; name: string; hue: string } | null
  clinic?: { id: number; name: string } | null
  branch?: { id: number; name: string } | null
  created_at: string | null
  last_login_at: string | null
}

export interface UserStats {
  total: number
  active: number
  inactive: number
  roles: number
  last_import: string | null
}

interface Option {
  value: string | number
  label: string
}

export interface Meta {
  roles: { id: number; name: string; hue: string }[]
  clinics: { id: number; name: string }[]
  branches: { id: number; name: string; clinic_id: number }[]
  statuses: { value: string; label: string }[]
}

const PER_PAGE_OPTIONS = [10, 25, 50, 100]

export function useUsers() {
  const api = useApi()

  const filters = reactive({
    q: '',
    role_id: '' as string | number,
    status: 'all',
    clinic_id: '' as string | number,
    branch_id: '' as string | number,
  })

  const sort = ref<'name' | 'status' | 'created'>('created')
  const dir = ref<'asc' | 'desc'>('desc')
  const page = ref(1)
  const perPage = ref(10)

  const rows = ref<UserRow[]>([])
  const total = ref(0)
  const lastPage = ref(1)
  const loading = ref(false)
  const stats = ref<UserStats | null>(null)
  const meta = ref<Meta | null>(null)
  const selected = ref<Set<number>>(new Set())

  function buildQuery() {
    const q: Record<string, string | number> = {
      page: page.value,
      per_page: perPage.value,
      sort: sort.value,
      dir: dir.value,
    }
    if (filters.q) q.q = filters.q
    if (filters.role_id) q.role_id = filters.role_id
    if (filters.status && filters.status !== 'all') q.status = filters.status
    if (filters.clinic_id) q.clinic_id = filters.clinic_id
    if (filters.branch_id) q.branch_id = filters.branch_id
    return q
  }

  async function fetchUsers() {
    loading.value = true
    try {
      const res = await api<{ data: UserRow[]; meta: { total: number; last_page: number } }>('/users', {
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
    if (filters.role_id) q.role_id = filters.role_id
    if (filters.clinic_id) q.clinic_id = filters.clinic_id
    if (filters.branch_id) q.branch_id = filters.branch_id
    stats.value = await api<UserStats>('/users/stats', { query: q })
  }

  async function fetchMeta() {
    if (meta.value) return
    meta.value = await api<Meta>('/meta')
  }

  async function refresh() {
    await Promise.all([fetchUsers(), fetchStats()])
  }

  function toggleSort(column: 'name' | 'status' | 'created') {
    if (sort.value === column) {
      dir.value = dir.value === 'asc' ? 'desc' : 'asc'
    } else {
      sort.value = column
      dir.value = 'asc'
    }
    page.value = 1
    fetchUsers()
  }

  function resetFilters() {
    filters.q = ''
    filters.role_id = ''
    filters.status = 'all'
    filters.clinic_id = ''
    filters.branch_id = ''
    page.value = 1
    refresh()
  }

  function setPage(p: number) {
    if (p < 1 || p > lastPage.value || p === page.value) return
    page.value = p
    fetchUsers()
  }

  function setPerPage(n: number) {
    perPage.value = n
    page.value = 1
    fetchUsers()
  }

  // Selection helpers
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
    if (allChecked.value) {
      clearSelection()
    } else {
      selected.value = new Set(rows.value.map((r) => r.id))
    }
  }

  async function bulk(action: 'activate' | 'deactivate' | 'delete') {
    const ids = [...selected.value]
    if (!ids.length) return
    await api('/users/bulk', { method: 'POST', body: { action, ids } })
    clearSelection()
    await refresh()
  }

  async function deleteUser(id: number) {
    await api(`/users/${id}`, { method: 'DELETE' })
    await refresh()
  }

  async function toggleStatus(row: UserRow) {
    await api(`/users/${row.id}`, {
      method: 'PUT',
      body: {
        name: row.name,
        username: row.username,
        email: row.email,
        phone: row.phone,
        role_id: row.role?.id ?? null,
        clinic_id: row.clinic?.id ?? null,
        branch_id: row.branch?.id ?? null,
        status: row.status === 'active' ? 'inactive' : 'active',
      },
    })
    await refresh()
  }

  // Debounced search
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
    () => [filters.role_id, filters.status, filters.clinic_id, filters.branch_id],
    () => {
      page.value = 1
      refresh()
    },
  )


  async function save(payload: Record<string, unknown>, id?: number) {
    if (id) await api(`/users/${id}`, { method: 'PUT', body: payload })
    else await api('/users', { method: 'POST', body: payload })
    await refresh()
  }

  async function bulkDeleteWithProgress(onProgress: (done: number, total: number) => void) {
    const ids = [...selected.value]
    const total = ids.length
    let done = 0
    for (const id of ids) {
      try {
        await api(`/users/${id}`, { method: 'DELETE' })
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
    deleteUser,
    toggleStatus,
    save,
    bulkDeleteWithProgress,
  }
}
