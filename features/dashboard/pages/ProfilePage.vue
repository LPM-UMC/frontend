<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue'
import { useAuthStore } from '#stores/auth'
import { useUser } from '#features/manajemen-user/composables/useUser'
import { useToast, useRuntimeConfig } from '#imports'
import { useI18n } from 'vue-i18n'
import { getAvatar } from '#utils/util'

const authStore = useAuthStore()
const { updateProfile, updateProfileImage, loading } = useUser()
const toast = useToast()
const { locale, t } = useI18n()

// ================= STATE =================
const isEditModalOpen = ref(false)
const uploadingPhoto = ref(false)
const submitting = ref(false)
const isRoleDropdownOpen = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const editForm = reactive({
  nama: '',
  email: '',
  instagram: '',
  linkedin: '',
})

// ================= COMPUTED =================
const user = computed(() => authStore.user)
const activeRole = computed(() => authStore.activeRole)
const userRoles = computed(() => authStore.roles ?? [])

const avatarUrl = computed(() => {
  return getAvatar(user.value?.nama, user.value?.picture)
})

const userNidnOrNim = computed(() => {
  if (user.value?.nidn) {
    return `NIDN: ${user.value.nidn}`
  } else if (user.value?.nim) {
    return `NIM: ${user.value.nim}`
  }
  return 'NIDN/NIM: -'
})

// ================= METHODS =================
function formatDate(dateStr?: string) {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString(
      locale.value === 'ar' ? 'ar-SA'
        : locale.value === 'ja' ? 'ja-JP'
          : locale.value === 'en' ? 'en-US'
            : 'id-ID',
      { day: '2-digit', month: 'long', year: 'numeric' },
    )
  } catch {
    return dateStr
  }
}

function openEditModal() {
  editForm.nama = user.value?.nama || ''
  editForm.email = user.value?.email || ''
  editForm.instagram = user.value?.instagram || ''
  editForm.linkedin = user.value?.linkedin || ''
  isEditModalOpen.value = true
}

function triggerFileInput() {
  fileInput.value?.click()
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Check file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    toast.add({
      title: t('util.gagal'),
      description: 'Ukuran gambar maksimal 2 MB',
      color: 'error',
    })
    return
  }

  const formData = new FormData()
  formData.append('picture', file)

  uploadingPhoto.value = true
  try {
    const response = await updateProfileImage(formData)
    if (response) {
      await authStore.fetchMe()
      toast.add({
        title: t('util.berhasil'),
        description: t('manajemenUser.updateProfileImage.validasi.berhasil'),
        color: 'success',
      })
    } else {
      toast.add({
        title: t('util.gagal'),
        description: 'Gagal mengunggah foto profil',
        color: 'error',
      })
    }
  } catch (err) {
    toast.add({
      title: t('util.gagal'),
      description: 'Terjadi kesalahan saat mengunggah foto',
      color: 'error',
    })
  } finally {
    uploadingPhoto.value = false
  }
}

async function handleSaveProfile() {
  if (!editForm.nama || !editForm.email) {
    toast.add({
      title: t('util.gagal'),
      description: 'Nama dan Email tidak boleh kosong',
      color: 'error',
    })
    return
  }

  submitting.value = true
  try {
    const result = await updateProfile({
      nama: editForm.nama,
      email: editForm.email,
      instagram: editForm.instagram,
      linkedin: editForm.linkedin,
    })

    if (result) {
      await authStore.fetchMe()
      toast.add({
        title: t('util.berhasil'),
        description: t('profil.edit.berhasil'),
        color: 'success',
      })
      isEditModalOpen.value = false
    } else {
      toast.add({
        title: t('util.gagal'),
        description: t('profil.edit.gagal'),
        color: 'error',
      })
    }
  } catch (err) {
    toast.add({
      title: t('util.gagal'),
      description: t('profil.edit.gagal'),
      color: 'error',
    })
  } finally {
    submitting.value = false
  }
}

function toggleRoleDropdown() {
  if (userRoles.value.length > 1) {
    isRoleDropdownOpen.value = !isRoleDropdownOpen.value
  }
}

function selectActiveRole(role: any) {
  authStore.setActiveRole(role)
  isRoleDropdownOpen.value = false
  toast.add({
    title: t('util.berhasil'),
    description: `Berhasil mengganti peran aktif menjadi ${role.nama}`,
    color: 'success',
  })
}

onMounted(async () => {
  await authStore.initAuth()
})
</script>

<template>
  <section class="mx-auto w-full max-w-[850px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
    <!-- HERO HEADER -->
    <div
      class="rounded-2xl border border-[#dadde3] bg-white px-5 py-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] sm:px-6 md:px-8"
    >
      <h1 class="text-xl font-bold text-[#11141b] sm:text-2xl lg:text-2.5xl">
        {{ $t('profil.header.title') }}
      </h1>
      <p class="mt-2 text-[13px] leading-relaxed text-[#556173] sm:text-[14px]">
        {{ $t('profil.header.description') }}
      </p>
    </div>

    <!-- PROFILE CARD -->
    <div
      class="mt-6 rounded-2xl border border-[#dadde3] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] sm:p-6 md:p-8"
    >
      <h2 class="text-[16px] font-bold text-[#151922] sm:text-[18px]">
        {{ $t('profil.card.title') }}
      </h2>

      <!-- Inner layout: Image on the left, fields on the right -->
      <div class="mt-6 flex flex-col items-center gap-8 md:flex-row md:items-start">
        
        <!-- Left Side: Profile Photo -->
        <div class="relative w-full max-w-[240px] shrink-0">
          <div class="overflow-hidden rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)] aspect-[3/4] bg-gray-50">
            <img
              :src="avatarUrl"
              :alt="user?.nama"
              class="h-full w-full object-cover"
            >
          </div>

          <!-- Overlaid Social Icons at Bottom Left -->
          <div class="absolute bottom-4 left-4 flex items-center gap-3">
            <a
              :href="user?.instagram ? `https://instagram.com/${user.instagram}` : '#'"
              target="_blank"
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
              :class="!user?.instagram ? 'opacity-40 pointer-events-none' : ''"
              aria-label="Instagram Profile"
            >
              <UIcon name="i-lucide-instagram" class="h-4.5 w-4.5" />
            </a>
            <a
              :href="user?.linkedin ? (user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`) : '#'"
              target="_blank"
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
              :class="!user?.linkedin ? 'opacity-40 pointer-events-none' : ''"
              aria-label="LinkedIn Profile"
            >
              <UIcon name="i-lucide-linkedin" class="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        <!-- Right Side: User Details -->
        <div class="w-full flex-1">
          <!-- Top Row: Name + Edit Button -->
          <div class="flex items-start justify-between">
            <div class="min-w-0">
              <h3 class="truncate text-[22px] font-bold leading-tight text-[#151922] sm:text-[24px]">
                {{ user?.nama || '-' }}
              </h3>
              <p class="mt-1 text-[13.5px] font-bold text-red-600 sm:text-[14.5px]">
                {{ userNidnOrNim }}
              </p>
            </div>

            <!-- Settings/Edit Cog Button -->
            <button
              type="button"
              class="cursor-pointer flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-gray-50 hover:text-gray-700"
              aria-label="Edit Profile"
              @click="openEditModal"
            >
              <UIcon name="i-lucide-settings" class="h-4.5 w-4.5" />
            </button>
          </div>

          <!-- Fields Section -->
          <div class="mt-6 space-y-4">
            <!-- Email -->
            <div>
              <p class="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
                {{ $t('profil.card.email') }}
              </p>
              <div class="mt-1.5 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3">
                <UIcon name="i-lucide-mail" class="h-4.5 w-4.5 text-red-500 shrink-0" />
                <span class="text-[14px] text-gray-700 truncate">
                  {{ user?.email || '-' }}
                </span>
              </div>
            </div>

            <!-- Peran Utama (Dropdown role switcher) -->
            <div class="relative">
              <!-- Overlay to close dropdown on click outside -->
              <div v-if="isRoleDropdownOpen" class="fixed inset-0 z-20 cursor-default" @click="isRoleDropdownOpen = false" />

              <p class="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
                {{ $t('profil.card.peranUtama') }}
              </p>
              <button
                type="button"
                class="relative z-10 mt-1.5 flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                :class="userRoles.length > 1 ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default bg-gray-50/50'"
                @click="toggleRoleDropdown"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <UIcon name="i-lucide-user" class="h-4.5 w-4.5 text-red-500 shrink-0" />
                  <span class="text-[14px] font-medium text-gray-700 truncate">
                    {{ activeRole?.nama || '-' }}
                  </span>
                </div>
                <UIcon
                  v-if="userRoles.length > 1"
                  name="i-lucide-chevron-down"
                  class="h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200"
                  :class="isRoleDropdownOpen ? 'rotate-180' : ''"
                />
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="isRoleDropdownOpen && userRoles.length > 1"
                class="absolute left-0 right-0 z-30 mt-1 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg"
              >
                <button
                  v-for="role in userRoles"
                  :key="role.id"
                  type="button"
                  class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[14px] text-gray-700 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                  :class="activeRole?.id === role.id ? 'bg-red-50/50 text-red-600 font-semibold' : ''"
                  @click="selectActiveRole(role)"
                >
                  <UIcon
                    name="i-lucide-check"
                    class="h-4 w-4 shrink-0 text-red-600"
                    :class="activeRole?.id === role.id ? 'opacity-100' : 'opacity-0'"
                  />
                  <span>{{ role.nama }}</span>
                </button>
              </div>
            </div>

            <!-- Red Status Banner (Peran Saat Ini) -->
            <div class="rounded-xl bg-red-600 px-4 py-3.5 text-center text-white shadow-sm">
              <span class="text-[12px] font-bold uppercase tracking-wider">
                {{ $t('profil.card.peranSaatIni') }}: {{ activeRole?.nama || '-' }}
              </span>
            </div>

            <!-- Joined Date & Status -->
            <div class="flex flex-col gap-3 sm:flex-row">
              <!-- Joined Date -->
              <div class="flex flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3">
                <UIcon name="i-lucide-calendar" class="h-4.5 w-4.5 text-green-600 shrink-0" />
                <span class="text-[13.5px] text-gray-600">
                  {{ $t('profil.card.bergabungSejak') }} {{ formatDate(user?.created_at) }}
                </span>
              </div>

              <!-- Status -->
              <div class="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 shrink-0">
                <span class="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                <span class="text-[11px] font-bold uppercase tracking-wider text-green-700">
                  {{ $t('profil.card.statusAktif') }}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>

  <!-- EDIT PROFIL MODAL -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isEditModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
        @click.self="isEditModalOpen = false"
      >
        <div
          class="relative w-full max-w-[450px] rounded-2xl bg-white p-6 shadow-2xl transition-all"
        >
          <!-- Close Modal Button -->
          <button
            type="button"
            class="absolute cursor-pointer right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close edit profile modal"
            @click="isEditModalOpen = false"
          >
            <UIcon name="i-lucide-x" class="h-5 w-5" />
          </button>

          <!-- Modal Header -->
          <div>
            <h3 class="text-[18px] font-bold text-red-600 sm:text-[20px]">
              {{ $t('profil.edit.title') }}
            </h3>
            <p class="mt-1 text-[13px] text-gray-500">
              {{ $t('profil.edit.description') }}
            </p>
          </div>

          <!-- Edit Photo Upload Section -->
          <div class="mt-6 flex flex-col items-center">
            <div
              class="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-full border-4 border-gray-100 shadow-inner"
              @click="triggerFileInput"
            >
              <img
                :src="avatarUrl"
                class="h-full w-full object-cover transition duration-300 group-hover:brightness-75"
              >
              <div
                class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition duration-300 group-hover:opacity-100"
              >
                <UIcon name="i-lucide-camera" class="h-6 w-6 text-white" />
              </div>

              <!-- Upload Loader -->
              <div
                v-if="uploadingPhoto"
                class="absolute inset-0 flex items-center justify-center bg-black/60 text-white"
              >
                <UIcon name="i-lucide-loader-2" class="h-6 w-6 animate-spin" />
              </div>
            </div>

            <!-- Hidden File Input -->
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileChange"
            >

            <button
              type="button"
              class="mt-2 text-[12px] font-medium text-gray-500 hover:text-red-600 transition"
              @click="triggerFileInput"
            >
              <p class="mt-3 text-[13px] text-gray-500">
                {{ $t('profil.edit.fotoClick') }}
                <br>
                <span class="text-[12px] text-gray-400">{{ $t('profil.edit.fotoMaxSize') }}</span>
              </p>
            </button>
          </div>

          <!-- Form Fields -->
          <form class="mt-6 space-y-4.5" @submit.prevent="handleSaveProfile">
            <!-- Nama Lengkap -->
            <div>
              <label class="mb-1.5 block text-[13px] font-bold text-[#4a515d]">
                {{ $t('profil.edit.namaLengkap') }}
              </label>
              <div class="mt-1.5 relative">
                <div class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
                  <UIcon name="i-lucide-user" class="h-4.5 w-4.5" />
                </div>
                <input
                  v-model="editForm.nama"
                  type="text"
                  placeholder="Nama"
                  class="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-[14px] text-gray-800 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                  required
                >
              </div>
            </div>

            <!-- Email -->
            <div>
              <label class="mb-1.5 block text-[13px] font-bold text-[#4a515d]">
                {{ $t('profil.edit.email') }}
              </label>
              <div class="mt-1.5 relative">
                <div class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
                  <UIcon name="i-lucide-mail" class="h-4.5 w-4.5" />
                </div>
                <input
                  v-model="editForm.email"
                  type="email"
                  placeholder="lpm.umc.dev@gmail.com"
                  disabled
                  class="h-11 w-full rounded-xl border border-gray-200 bg-gray-100 cursor-not-allowed pl-10 pr-4 text-[14px] text-gray-500 outline-none transition"
                  required
                >
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <!-- Instagram -->
              <div>
                <label class="mb-1.5 block text-[13px] font-bold text-[#4a515d]">
                  {{ $t('profil.edit.instagram') }}
                </label>
                <div class="mt-1.5 relative">
                  <div class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
                    <UIcon name="i-lucide-instagram" class="h-4.5 w-4.5" />
                  </div>
                  <input
                    v-model="editForm.instagram"
                    type="text"
                    placeholder="@username"
                    class="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-[14px] text-gray-800 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                  >
                </div>
              </div>

              <!-- LinkedIn -->
              <div>
                <label class="mb-1.5 block text-[13px] font-bold text-[#4a515d]">
                  {{ $t('profil.edit.linkedin') }}
                </label>
                <div class="mt-1.5 relative">
                  <div class="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400">
                    <UIcon name="i-lucide-linkedin" class="h-4.5 w-4.5" />
                  </div>
                  <input
                    v-model="editForm.linkedin"
                    type="text"
                    placeholder="LinkedIn.com/in/user"
                    class="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-[14px] text-gray-800 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                  >
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                class="cursor-pointer rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-[14px] font-semibold text-gray-600 transition hover:bg-gray-50"
                @click="isEditModalOpen = false"
              >
                {{ $t('util.batal') }}
              </button>
              <button
                type="submit"
                class="cursor-pointer rounded-xl bg-red-600 px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-red-700"
                :disabled="submitting"
              >
                <span v-if="submitting" class="flex items-center gap-2">
                  <UIcon name="i-lucide-loader-2" class="h-4 w-4 animate-spin" />
                  Menyimpan...
                </span>
                <span v-else>{{ $t('profil.edit.simpan') }}</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>
