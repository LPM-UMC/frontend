export type DashboardUserSortOrder = 'a-z' | 'z-a'
export type DashboardUserStatus = 'Aktif' | 'Non Aktif'

export interface DashboardUserRoleOption {
  value: string
  label: string
}

export interface DashboardUserListRow {
  id: string
  name: string
  email: string
  tableRoleLabel: string
  selectedRoleValues: string[]
  status: DashboardUserStatus
  joinedAt: string
}

export interface DashboardUserInfoCard {
  id: string
  title: string
  value: string | number
  progressPercent: number
  subtitle: string
}

export interface DashboardUserFormData {
  name: string
  email: string
  selectedRoles: string[]
}

export interface DashboardUserEditDetail {
  id: string
  name: string
  email: string
  selectedRoles: string[]
  status: DashboardUserStatus
  lastSavedAt: string
}

interface DashboardUserDataset {
  listRows: DashboardUserListRow[]
  roleOptions: DashboardUserRoleOption[]
  defaultLastSavedAt: string
}

function cloneRows(rows: DashboardUserListRow[]): DashboardUserListRow[] {
  return rows.map((row) => ({
    ...row,
    selectedRoleValues: [...row.selectedRoleValues],
  }))
}

function cloneRoleOptions(options: DashboardUserRoleOption[]): DashboardUserRoleOption[] {
  return options.map((option) => ({ ...option }))
}

function cloneFormData(form: DashboardUserFormData): DashboardUserFormData {
  return {
    name: form.name,
    email: form.email,
    selectedRoles: [...form.selectedRoles],
  }
}

function createDataset(): DashboardUserDataset {
  return {
    defaultLastSavedAt: '15 Feb 2026, 14:30',
    roleOptions: [
      { value: '716b4ecb-9d3d-41b0-bdd1-e2f530905758', label: 'LPM (Lembaga Penjaminan Mutu)' },
      { value: 'spi', label: 'SPI (Satuan Pengawas Internal)' },
      { value: 'gkmf', label: 'GKMF (Gugus Kendali Mutu Fakultas)' },
      { value: 'wr-1', label: 'WR 1 (Wakil Rektor 1)' },
      { value: 'kaprodi', label: 'Kaprodi (Kepala Program Studi)' },
      { value: 'rektor', label: 'Rektor' },
    ],
    listRows: [
      {
        id: 'user-ari-utama-1',
        name: 'Arie S Utami, M.T',
        email: 'arieutamie.umc.ac.id',
        tableRoleLabel: 'Ketua LPM UM',
        selectedRoleValues: ['lpm', 'gkmf'],
        status: 'Aktif',
        joinedAt: '2025-08-01',
      },
      {
        id: 'user-ari-utama-2',
        name: 'Arie S Utami, M.T',
        email: 'arieutamie.umc.ac.id',
        tableRoleLabel: 'Ketua LPM UM',
        selectedRoleValues: ['lpm', 'spi'],
        status: 'Aktif',
        joinedAt: '2025-08-01',
      },
      {
        id: 'user-ari-utama-3',
        name: 'Arie S Utami, M.T',
        email: 'arieutamie.umc.ac.id',
        tableRoleLabel: 'Ketua LPM UM',
        selectedRoleValues: ['lpm', 'kaprodi'],
        status: 'Aktif',
        joinedAt: '2025-08-01',
      },
      {
        id: 'user-ari-utama-4',
        name: 'Arie S Utami, M.T',
        email: 'arieutamie.umc.ac.id',
        tableRoleLabel: 'Ketua LPM UM',
        selectedRoleValues: ['lpm', 'wr-1'],
        status: 'Non Aktif',
        joinedAt: '2025-08-01',
      },
      {
        id: 'user-ari-utama-5',
        name: 'Arie S Utami, M.T',
        email: 'arieutamie.umc.ac.id',
        tableRoleLabel: 'Ketua LPM UM',
        selectedRoleValues: ['lpm'],
        status: 'Non Aktif',
        joinedAt: '2025-08-01',
      },
      {
        id: 'user-pahla-1',
        name: 'Pahla Widianti, S.Kom',
        email: 'pahlawidianti.umc.ac.id',
        tableRoleLabel: 'GKMF Teknik',
        selectedRoleValues: ['gkmf', 'kaprodi'],
        status: 'Aktif',
        joinedAt: '2025-08-04',
      },
      {
        id: 'user-sabar-1',
        name: 'Sabar Santoso, M.Kom',
        email: 'sabarsantoso.umc.ac.id',
        tableRoleLabel: 'Kaprodi TI',
        selectedRoleValues: ['kaprodi'],
        status: 'Aktif',
        joinedAt: '2025-08-09',
      },
      {
        id: 'user-rosidin-1',
        name: 'Rosidin, M.Kom',
        email: 'rosidin.umc.ac.id',
        tableRoleLabel: 'SPI Internal',
        selectedRoleValues: ['spi'],
        status: 'Aktif',
        joinedAt: '2025-08-11',
      },
      {
        id: 'user-fredyy-1',
        name: 'Fredyy Wicak, M.T',
        email: 'fredyywicak.umc.ac.id',
        tableRoleLabel: 'WR 1',
        selectedRoleValues: ['wr-1'],
        status: 'Aktif',
        joinedAt: '2025-08-16',
      },
      {
        id: 'user-rektor-1',
        name: 'Prof. Dr. Rektor UMC',
        email: 'rektor.umc.ac.id',
        tableRoleLabel: 'Rektor',
        selectedRoleValues: ['rektor'],
        status: 'Aktif',
        joinedAt: '2025-08-20',
      },
    ],
  }
}

const DATASET = createDataset()

export function getDashboardUserDummyRows(): DashboardUserListRow[] {
  return cloneRows(DATASET.listRows)
}

export function getDashboardUserRoleOptions(): DashboardUserRoleOption[] {
  return cloneRoleOptions(DATASET.roleOptions)
}

export function sortDashboardUserRows(
  rows: DashboardUserListRow[],
  sortOrder: DashboardUserSortOrder
): DashboardUserListRow[] {
  const cloned = cloneRows(rows)
  const multiplier = sortOrder === 'a-z' ? 1 : -1

  return cloned.sort((left, right) => {
    return left.name.localeCompare(right.name, 'id-ID') * multiplier
  })
}

export function getDashboardUserInfoCards(rows: DashboardUserListRow[]): DashboardUserInfoCard[] {
  const totalUsers = rows.length
  const totalActiveUsers = rows.filter((row) => row.status === 'Aktif').length
  const roleCountMap = new Map<string, number>()

  rows.forEach((row) => {
    row.selectedRoleValues.forEach((role) => {
      roleCountMap.set(role, (roleCountMap.get(role) ?? 0) + 1)
    })
  })

  const highestRole = [...roleCountMap.entries()]
    .sort((left, right) => right[1] - left[1])[0]?.[0] ?? 'lpm'
  const highestRoleLabel = DATASET.roleOptions.find((role) => role.value === highestRole)?.label ?? 'LPM'

  const maxRoleCount = DATASET.roleOptions.length
  const progressBase = Math.max(totalUsers, 1)

  return [
    {
      id: 'total-user',
      title: 'Total User',
      value: totalUsers,
      progressPercent: Math.min(100, (totalUsers / progressBase) * 100),
      subtitle: 'Diperbarui Otomatis',
    },
    {
      id: 'total-user-aktif',
      title: 'Total User Aktif',
      value: totalActiveUsers,
      progressPercent: Math.min(100, (totalActiveUsers / progressBase) * 100),
      subtitle: 'Diperbarui Otomatis',
    },
    {
      id: 'total-role',
      title: 'Total Role',
      value: maxRoleCount,
      progressPercent: Math.min(100, (maxRoleCount / 6) * 100),
      subtitle: 'Diperbarui Otomatis',
    },
    {
      id: 'role-terbanyak',
      title: 'Role User Terbanyak',
      value: highestRoleLabel.replace(/\s+\(.+\)$/, ''),
      progressPercent: 100,
      subtitle: 'Diperbarui Otomatis',
    },
  ]
}

export function getDashboardUserCreateDefaultForm(): DashboardUserFormData {
  return cloneFormData({
    name: '',
    email: '',
    selectedRoles: ['lpm', 'gkmf'],
  })
}

export function getDashboardUserEditDetail(userId: string | null): DashboardUserEditDetail {
  const fallback = DATASET.listRows[0]!
  const row = userId
    ? DATASET.listRows.find((item) => item.id === userId) ?? fallback
    : fallback

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    selectedRoles: [...row.selectedRoleValues],
    status: row.status,
    lastSavedAt: DATASET.defaultLastSavedAt,
  }
}
