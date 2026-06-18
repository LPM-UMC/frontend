import { computed } from 'vue'

interface FormPermissionOptions {
  canRead?: boolean
  canWrite?: boolean
  canValidate?: boolean
  isOwner?: boolean
  status?: 'draft' | 'submitted' | 'validated' | 'locked'
}

export function useFormPermissions(options: FormPermissionOptions) {
  const normalized = computed<FormPermissionOptions>(() => {
    return {
      canRead: options.canRead ?? true,
      canWrite: options.canWrite ?? false,
      canValidate: options.canValidate ?? false,
      isOwner: options.isOwner ?? false,
      status: options.status ?? 'draft',
    }
  })

  const isLocked = computed(() => normalized.value.status === 'locked')
  const canEdit = computed(() => Boolean(normalized.value.canWrite && !isLocked.value))
  const canSubmit = computed(() => Boolean(normalized.value.isOwner && normalized.value.canWrite && normalized.value.status === 'draft'))
  const canApprove = computed(() => Boolean(normalized.value.canValidate && normalized.value.status === 'submitted'))

  return {
    canRead: computed(() => Boolean(normalized.value.canRead)),
    canEdit,
    canSubmit,
    canApprove,
    isLocked,
  }
}
