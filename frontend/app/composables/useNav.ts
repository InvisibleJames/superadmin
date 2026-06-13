export interface NavItem {
  id: string
  label: string
  icon: string
  to: string
}

export interface NavGroup {
  section: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    section: 'Master Data',
    items: [
      { id: 'clinics', label: 'Clinics', icon: 'clinic', to: '/clinics' },
      { id: 'branches', label: 'Clinic Branches', icon: 'branch', to: '/branches' },
      { id: 'users', label: 'Users', icon: 'users', to: '/users' },
      { id: 'patients', label: 'Patients', icon: 'patient', to: '/patients' },
    ],
  },
  {
    section: 'Timetable',
    items: [
      { id: 'boarding-time', label: 'Boarding Time', icon: 'clock', to: '/boarding-time' },
      { id: 'user-logs', label: 'User Logs', icon: 'userLog', to: '/user-logs' },
    ],
  },
  {
    section: 'System',
    items: [
      { id: 'settings', label: 'Settings', icon: 'settings', to: '/settings' },
      { id: 'roles', label: 'Roles & Permissions', icon: 'roles', to: '/roles' },
      { id: 'sa-users', label: 'SA Users', icon: 'shieldCheck', to: '/sa-users' },
      { id: 'audit-logs', label: 'Audit Logs', icon: 'audit', to: '/audit-logs' },
      { id: 'maintenance', label: 'Maintenance', icon: 'maintenance', to: '/maintenance' },
    ],
  },
]

/** Look up a nav item's label by its route path (for breadcrumb / titles). */
export function navLabelForPath(path: string): string {
  for (const g of navGroups) {
    for (const it of g.items) {
      if (it.to === path) return it.label
    }
  }
  return 'Dashboard'
}
