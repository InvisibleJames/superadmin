export interface PatientRow {
  id: number
  code: string
  hn: string
  name: string
  gender: 'Male' | 'Female' | null
  age: number | null
  phone: string | null
  status: 'active' | 'inactive'
  last_visit_at: string | null
  clinic?: { id: number; name: string } | null
  branch?: { id: number; name: string } | null
  created_at: string | null
}

export interface PatientStats {
  total: number
  active: number
  inactive: number
  new_this_month: number
}

interface PatientMeta {
  clinics: { id: number; name: string }[]
  branches: { id: number; name: string }[]
  genders: { value: string; label: string }[]
  statuses: { value: string; label: string }[]
}

const PER_PAGE_OPTIONS = [10, 25, 50, 100]

export function usePatients() {
  const api = useApi()

  const filters = reactive({ q: '', status: 'all', gender: 'all', branch_id: '' as string | number })
  const sort = ref<'name' | 'status' | 'created' | 'last_visit'>('created')
  const dir = ref<'asc' | 'desc'>('desc')
  const page = ref(1)
  const perPage = ref(10)

  const rows = ref<PatientRow[]>([])
  const total = ref(0)
  const lastPage = ref(1)
  const loading = ref(false)
  const stats = ref<PatientStats | null>(null)
  const meta = ref<PatientMeta | null>(null)
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
    if (filters.gender && filters.gender !== 'all') q.gender = filters.gender
    if (filters.branch_id) q.branch_id = filters.branch_id
    return q
  }

  async function fetchPatients() {
    loading.value = true
    try {
      const res = await api<{ data: PatientRow[]; meta: { total: number; last_page: number } }>('/patients', {
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
    if (filters.gender && filters.gender !== 'all') q.gender = filters.gender
    if (filters.branch_id) q.branch_id = filters.branch_id
    stats.value = await api<PatientStats>('/patients/stats', { query: q })
  }

  async function fetchMeta() {
    const full = await api<{
      clinics: PatientMeta['clinics']
      branches: PatientMeta['branches']
      genders: PatientMeta['genders']
      statuses: PatientMeta['statuses']
    }>('/meta')
    meta.value = { clinics: full.clinics, branches: full.branches, genders: full.genders, statuses: full.statuses }
  }

  async function refresh() {
    await Promise.all([fetchPatients(), fetchStats()])
  }

  function toggleSort(column: 'name' | 'status' | 'created' | 'last_visit') {
    if (sort.value === column) {
      dir.value = dir.value === 'asc' ? 'desc' : 'asc'
    } else {
      sort.value = column
      dir.value = 'asc'
    }
    page.value = 1
    fetchPatients()
  }

  function resetFilters() {
    filters.q = ''
    filters.status = 'all'
    filters.gender = 'all'
    filters.branch_id = ''
    page.value = 1
    refresh()
  }

  function setPage(p: number) {
    if (p < 1 || p > lastPage.value || p === page.value) return
    page.value = p
    fetchPatients()
  }
  function setPerPage(n: number) {
    perPage.value = n
    page.value = 1
    fetchPatients()
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
    await api('/patients/bulk', { method: 'POST', body: { action, ids } })
    clearSelection()
    await refresh()
  }

  async function deletePatient(id: number) {
    await api(`/patients/${id}`, { method: 'DELETE' })
    await refresh()
  }

  async function toggleStatus(row: PatientRow) {
    await api(`/patients/${row.id}`, {
      method: 'PUT',
      body: {
        hn: row.hn,
        name: row.name,
        gender: row.gender,
        age: row.age,
        clinic_id: row.clinic?.id ?? null,
        branch_id: row.branch?.id ?? null,
        phone: row.phone,
        last_visit_at: row.last_visit_at,
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
    () => [filters.status, filters.gender, filters.branch_id],
    () => {
      page.value = 1
      refresh()
    },
  )


  async function save(payload: Record<string, unknown>, id?: number) {
    if (id) await api(`/patients/${id}`, { method: 'PUT', body: payload })
    else await api('/patients', { method: 'POST', body: payload })
    await refresh()
  }

  async function bulkDeleteWithProgress(onProgress: (done: number, total: number) => void) {
    const ids = [...selected.value]
    const total = ids.length
    let done = 0
    for (const id of ids) {
      try {
        await api(`/patients/${id}`, { method: 'DELETE' })
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
    deletePatient,
    toggleStatus,
    save,
    bulkDeleteWithProgress,
  }
}
