export interface BranchRow {
  id: number
  code: string
  name: string
  province: string | null
  district: string | null
  subdistrict: string | null
  phone: string | null
  status: 'active' | 'inactive'
  clinic?: { id: number; name: string } | null
  created_at: string | null
}

export interface BranchStats {
  total: number
  active: number
  inactive: number
  clinics: number
}

interface BranchMeta {
  clinics: { id: number; name: string }[]
  statuses: { value: string; label: string }[]
}

const PER_PAGE_OPTIONS = [10, 25, 50, 100]

export function useBranches() {
  const api = useApi()

  const filters = reactive({ q: '', status: 'all', clinic_id: '' as string | number })
  const sort = ref<'name' | 'status' | 'created'>('created')
  const dir = ref<'asc' | 'desc'>('desc')
  const page = ref(1)
  const perPage = ref(10)

  const rows = ref<BranchRow[]>([])
  const total = ref(0)
  const lastPage = ref(1)
  const loading = ref(false)
  const stats = ref<BranchStats | null>(null)
  const meta = ref<BranchMeta | null>(null)
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
    if (filters.clinic_id) q.clinic_id = filters.clinic_id
    return q
  }

  async function fetchBranches() {
    loading.value = true
    try {
      const res = await api<{ data: BranchRow[]; meta: { total: number; last_page: number } }>('/branches', {
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
    if (filters.clinic_id) q.clinic_id = filters.clinic_id
    stats.value = await api<BranchStats>('/branches/stats', { query: q })
  }

  async function fetchMeta() {
    const full = await api<{ clinics: BranchMeta['clinics']; statuses: BranchMeta['statuses'] }>('/meta')
    meta.value = { clinics: full.clinics, statuses: full.statuses }
  }

  async function refresh() {
    await Promise.all([fetchBranches(), fetchStats()])
  }

  function toggleSort(column: 'name' | 'status' | 'created') {
    if (sort.value === column) {
      dir.value = dir.value === 'asc' ? 'desc' : 'asc'
    } else {
      sort.value = column
      dir.value = 'asc'
    }
    page.value = 1
    fetchBranches()
  }

  function resetFilters() {
    filters.q = ''
    filters.status = 'all'
    filters.clinic_id = ''
    page.value = 1
    refresh()
  }

  function setPage(p: number) {
    if (p < 1 || p > lastPage.value || p === page.value) return
    page.value = p
    fetchBranches()
  }
  function setPerPage(n: number) {
    perPage.value = n
    page.value = 1
    fetchBranches()
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
    await api('/branches/bulk', { method: 'POST', body: { action, ids } })
    clearSelection()
    await refresh()
  }

  async function deleteBranch(id: number) {
    await api(`/branches/${id}`, { method: 'DELETE' })
    await refresh()
  }

  async function toggleStatus(row: BranchRow) {
    await api(`/branches/${row.id}`, {
      method: 'PUT',
      body: {
        clinic_id: row.clinic?.id,
        code: row.code,
        name: row.name,
        province: row.province,
        phone: row.phone,
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
    () => [filters.status, filters.clinic_id],
    () => {
      page.value = 1
      refresh()
    },
  )


  async function save(payload: Record<string, unknown>, id?: number) {
    if (id) await api(`/branches/${id}`, { method: 'PUT', body: payload })
    else await api('/branches', { method: 'POST', body: payload })
    await refresh()
  }

  async function bulkDeleteWithProgress(onProgress: (done: number, total: number) => void) {
    const ids = [...selected.value]
    const total = ids.length
    let done = 0
    for (const id of ids) {
      try {
        await api(`/branches/${id}`, { method: 'DELETE' })
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
    deleteBranch,
    toggleStatus,
    save,
    bulkDeleteWithProgress,
  }
}
