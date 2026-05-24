export type DashboardRoleSortOrder = 'a-z' | 'z-a'
export type DashboardRoleStatus = 'Aktif' | 'Non Aktif'

export interface DashboardRoleListRow {
  id: string
  name: string
  description: string
  totalUsers: number
  status: DashboardRoleStatus
  joinedAt: string
}

export interface DashboardRoleInfoCard {
  id: string
  title: string
  value: string | number
  progressPercent: number
  subtitle: string
}

export interface DashboardRoleFormData {
  name: string
  description: string
}

export interface DashboardRoleEditDetail extends DashboardRoleFormData {
  id: string
  status: DashboardRoleStatus
  lastSavedAt: string
}

interface DashboardRoleDataset {
  listRows: DashboardRoleListRow[]
  defaultLastSavedAt: string
}

function cloneRows(rows: DashboardRoleListRow[]): DashboardRoleListRow[] {
  return rows.map((row) => ({ ...row }))
}

function cloneFormData(form: DashboardRoleFormData): DashboardRoleFormData {
  return {
    name: form.name,
    description: form.description,
  }
}

function createDataset(): DashboardRoleDataset {
  return {
    defaultLastSavedAt: '15 Feb 2026, 14:30',
    listRows: [
      {
        id: 'role-lpm',
        name: 'LPM',
        description: 'Deskripsi LPM',
        totalUsers: 9,
        status: 'Aktif',
        joinedAt: '2025-08-01',
      },
      {
        id: 'role-spi',
        name: 'SPI',
        description: 'Deskripsi SPI',
        totalUsers: 2,
        status: 'Aktif',
        joinedAt: '2025-08-01',
      },
      {
        id: 'role-kaprodi',
        name: 'Kaprodi',
        description: 'Deskripsi Kaprodi',
        totalUsers: 12,
        status: 'Aktif',
        joinedAt: '2025-08-01',
      },
      {
        id: 'role-gkmf-teknik',
        name: 'GKMF Teknik',
        description: 'Deskripsi GKMF Teknik',
        totalUsers: 6,
        status: 'Non Aktif',
        joinedAt: '2025-08-01',
      },
      {
        id: 'role-gkmf-ip',
        name: 'GKMF IP',
        description: 'Deskripsi GKMF IP',
        totalUsers: 1,
        status: 'Non Aktif',
        joinedAt: '2025-08-01',
      },
      {
        id: 'role-dekan',
        name: 'Dekan',
        description: 'Deskripsi Dekan',
        totalUsers: 0,
        status: 'Aktif',
        joinedAt: '2025-08-01',
      },
      {
        id: 'role-wr-1',
        name: 'WR 1',
        description: 'Deskripsi WR 1',
        totalUsers: 0,
        status: 'Aktif',
        joinedAt: '2025-08-01',
      },
      {
        id: 'role-rektor',
        name: 'Rektor',
        description: 'Deskripsi Rektor',
        totalUsers: 0,
        status: 'Aktif',
        joinedAt: '2025-08-01',
      },
      
    ],
  }
}

const DATASET = createDataset()

export function getDashboardRoleDummyRows(): DashboardRoleListRow[] {
  return cloneRows(DATASET.listRows)
}

export function sortDashboardRoleRows(
  rows: DashboardRoleListRow[],
  sortOrder: DashboardRoleSortOrder
): DashboardRoleListRow[] {
  const cloned = cloneRows(rows)
  const multiplier = sortOrder === 'a-z' ? 1 : -1

  return cloned.sort((left, right) => left.name.localeCompare(right.name, 'id-ID') * multiplier)
}

export function getDashboardRoleInfoCards(rows: DashboardRoleListRow[]): DashboardRoleInfoCard[] {
  const totalUsers = rows.reduce((sum, row) => sum + row.totalUsers, 0)
  const totalActiveUsers = rows
    .filter((row) => row.status === 'Aktif')
    .reduce((sum, row) => sum + row.totalUsers, 0)
  const totalRoles = rows.filter((row) => row.totalUsers > 0).length

  const highestRole = rows
    .slice()
    .sort((left, right) => right.totalUsers - left.totalUsers)[0]

  const denominator = Math.max(totalUsers, 1)

  return [
    {
      id: 'total-user',
      title: 'Total User',
      value: totalUsers,
      progressPercent: Math.min(100, (totalUsers / denominator) * 100),
      subtitle: 'Diperbarui Otomatis',
    },
    {
      id: 'total-user-aktif',
      title: 'Total User Aktif',
      value: totalActiveUsers,
      progressPercent: Math.min(100, (totalActiveUsers / denominator) * 100),
      subtitle: 'Diperbarui Otomatis',
    },
    {
      id: 'total-role',
      title: 'Total Role',
      value: totalRoles,
      progressPercent: Math.min(100, (totalRoles / 5) * 100),
      subtitle: 'Diperbarui Otomatis',
    },
    {
      id: 'role-terbanyak',
      title: 'Role User Terbanyak',
      value: highestRole?.name ?? 'Kaprodi',
      progressPercent: 100,
      subtitle: 'Diperbarui Otomatis',
    },
  ]
}

export function getDashboardRoleCreateDefaultForm(): DashboardRoleFormData {
  return cloneFormData({
    name: '',
    description: '',
  })
}

export function getDashboardRoleEditDetail(roleId: string | null): DashboardRoleEditDetail {
  const fallback = DATASET.listRows[0]!
  const row = roleId
    ? DATASET.listRows.find((item) => item.id === roleId) ?? fallback
    : fallback

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status,
    lastSavedAt: DATASET.defaultLastSavedAt,
  }
}
