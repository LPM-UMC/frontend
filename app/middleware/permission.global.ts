import { useAuthStore } from '#stores/auth'
import { navigateTo } from '#imports'

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  const roleCode = auth.activeRole?.kode

  const restrictedPaths = ['/dashboard/manajemen-user', '/dashboard/manajemen-role']
  const isRestricted = restrictedPaths.some(path => to.path.startsWith(path))

  if (isRestricted) {
    if (roleCode !== 'admin-lpm' && roleCode !== 'admin-spi' && roleCode !== 'ketua-lpm' && roleCode !== 'ketua-spi') {
      return navigateTo('/dashboard')
    }
  }

  const periodeRestrictedPaths = ['/dashboard/manajemen-periode']
  const isPeriodeRestricted = periodeRestrictedPaths.some(path => to.path.startsWith(path))

  if (isPeriodeRestricted) {
    if (roleCode !== 'admin-lpm' && roleCode !== 'admin-spi' && roleCode !== 'ketua-lpm' && roleCode !== 'ketua-spi') {
      return navigateTo('/dashboard')
    }
  }
})
