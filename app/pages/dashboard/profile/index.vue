<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '#stores/auth'
import type { UserResponse } from '#types/user'

definePageMeta({
  layout: 'dashboard',
  requiresAuth: true,
})

const authStore = useAuthStore()
const config = useRuntimeConfig()
const { locale } = useI18n()

useHead({
  title: 'Profil - SI IMOET',
})

const isEditing = ref(false)
const isSaving = ref(false)
const saveError = ref<string | null>(null)
const pictureInput = ref<HTMLInputElement | null>(null)
const selectedPicture = ref<File | null>(null)
const picturePreview = ref<string | null>(null)

const form = reactive({
  nama: '',
  email: '',
  instagram: '',
  linkedin: '',
})

function goBack() {
  if (import.meta.client && window.history.length > 1) {
    window.history.back()
    return
  }

  navigateTo('/dashboard')
}

const user = computed(() => authStore.user)
const roles = computed(() => authStore.roles.length
  ? authStore.roles
  : (user.value?.roles ?? []))
const activeRole = computed(() => authStore.activeRole ?? roles.value[0] ?? null)
const avatar = computed(() =>
  picturePreview.value
  || user.value?.picture
  || '/img/profile-user-dummy.png')
const identifier = computed(() => user.value?.nidn || user.value?.nim || '-')
const identifierLabel = computed(() => user.value?.nidn ? 'NIDN' : user.value?.nim ? 'NIM' : 'ID')
const joinedAt = computed(() => {
  if (!user.value?.created_at) {
    return '-'
  }

  const date = new Date(user.value.created_at)

  if (Number.isNaN(date.getTime())) {
    return user.value.created_at
  }

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
})

const instagramUrl = computed(() => {
  const value = user.value?.instagram?.trim()
  if (!value) return '#'
  if (value.startsWith('http')) return value
  return `https://instagram.com/${value.replace(/^@/, '')}`
})

const linkedinUrl = computed(() => {
  const value = user.value?.linkedin?.trim()
  if (!value) return '#'
  if (value.startsWith('http')) return value
  return `https://${value}`
})

function populateForm() {
  form.nama = user.value?.nama ?? ''
  form.email = user.value?.email ?? ''
  form.instagram = user.value?.instagram ?? ''
  form.linkedin = user.value?.linkedin ?? ''
  selectedPicture.value = null
  picturePreview.value = null
  saveError.value = null
}

function openEdit() {
  populateForm()
  isEditing.value = true
}

function closeEdit() {
  isEditing.value = false
  populateForm()
}

function selectRole(event: Event) {
  const selectedRoleId = (event.target as HTMLSelectElement).value
  const role = roles.value.find((item) => item.id === selectedRoleId)

  if (role) {
    authStore.setActiveRole(role)
  }
}

function openPicturePicker() {
  pictureInput.value?.click()
}

function handlePictureChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  selectedPicture.value = file

  const reader = new FileReader()
  reader.addEventListener('load', () => {
    picturePreview.value = typeof reader.result === 'string'
      ? reader.result
      : null
  })
  reader.readAsDataURL(file)
}

function updateSessionUser(nextUser: UserResponse) {
  authStore.user = {
    ...(authStore.user ?? {}),
    ...nextUser,
  } as UserResponse
  authStore.roles = authStore.user.roles ?? authStore.roles

  if (!authStore.activeRole && authStore.roles[0]) {
    authStore.activeRole = authStore.roles[0]
  }
}

async function saveProfile() {
  if (!authStore.accessToken || !authStore.user) {
    await navigateTo('/login?error=unauthorized')
    return
  }

  isSaving.value = true
  saveError.value = null

  try {
    const updated = await $fetch<{ data: UserResponse }>(
      `${config.public.apiBase}/api/${locale.value}/users/profile`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
        body: {
          nama: form.nama,
          email: form.email,
          instagram: form.instagram,
          linkedin: form.linkedin,
        },
      },
    )
    updateSessionUser(updated.data)

    if (selectedPicture.value) {
      const formData = new FormData()
      formData.append('picture', selectedPicture.value)

      const updatedPicture = await $fetch<{ data: UserResponse }>(
        `${config.public.apiBase}/api/${locale.value}/users/profile/picture`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${authStore.accessToken}`,
          },
          body: formData,
        },
      )
      updateSessionUser(updatedPicture.data)
    }

    isEditing.value = false
    selectedPicture.value = null
    picturePreview.value = null
  } catch {
    saveError.value = 'Perubahan profil belum dapat disimpan. Silakan coba kembali.'
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  if (!authStore.isInitialized) {
    await authStore.initAuth()
  }

  if (!authStore.isAuthenticated) {
    await navigateTo('/login?error=unauthorized')
    return
  }

  populateForm()
})
</script>

<template>
  <div dir="ltr" class="profile-page">
    <div class="batik-strip" aria-hidden="true" />

    <main class="profile-content">
      <div class="profile-content__inner">
        <button type="button" class="back-button" @click="goBack">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span>Kembali</span>
        </button>

        <section class="intro-card">
          <h1>{{ isEditing ? 'Edit Profil' : 'Detail Profile Role' }}</h1>
          <p>
            Halaman profil ini menampilkan informasi detail akun Anda, termasuk peran aktif,
            email, dan media sosial. Anda dapat mengedit data profil serta memilih peran utama
            yang digunakan di dalam sistem.
          </p>
        </section>

        <section class="workspace-card">
          <h2>{{ isEditing ? 'Edit Profil' : 'Profile' }}</h2>

          <div class="workspace-card__stage">
            <form v-if="isEditing" class="edit-card" @submit.prevent="saveProfile">
              <div class="edit-card__header">
                <div>
                  <h3>Edit Profil</h3>
                  <p>Perbarui informasi publik Anda</p>
                </div>
                <button type="button" aria-label="Tutup edit profil" @click="closeEdit">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 6 18 18M18 6 6 18" />
                  </svg>
                </button>
              </div>

              <div class="edit-card__body">
                <div class="portrait-picker">
                  <input
                    ref="pictureInput"
                    type="file"
                    accept="image/*"
                    hidden
                    @change="handlePictureChange"
                  >
                  <button type="button" aria-label="Ganti foto profil" @click="openPicturePicker">
                    <img :src="avatar" :alt="user?.nama || 'Profile'">
                  </button>
                  <p>Klik foto untuk mengganti<br>portrait</p>
                  <span>(Rekomendasi 3:4)</span>
                </div>

                <div class="edit-grid">
                  <label>
                    <span>Nama Lengkap</span>
                    <div class="edit-input">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="8" r="3.5" />
                        <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
                      </svg>
                      <input v-model="form.nama" type="text" placeholder="Nama" required>
                    </div>
                  </label>

                  <label>
                    <span>Email</span>
                    <div class="edit-input">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m4 7 8 6 8-6" />
                      </svg>
                      <input v-model="form.email" type="email" placeholder="nama@umc.ac.id" required>
                    </div>
                  </label>

                  <label>
                    <span>Username Instagram</span>
                    <div class="edit-input">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                        <circle cx="12" cy="12" r="4" />
                        <circle cx="17.4" cy="6.7" r="0.8" class="fill-current" />
                      </svg>
                      <input v-model="form.instagram" type="text" placeholder="@username" required>
                    </div>
                  </label>

                  <label>
                    <span>URL LinkedIn</span>
                    <div class="edit-input">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M6 9v10M6 5.5v.1M10.5 19v-5.7a4 4 0 0 1 8 0V19M10.5 9v10" />
                      </svg>
                      <input v-model="form.linkedin" type="text" placeholder="linkedin.com/in/user" required>
                    </div>
                  </label>
                </div>

                <p v-if="saveError" class="save-error">{{ saveError }}</p>

                <div class="edit-actions">
                  <button type="button" class="cancel-button" :disabled="isSaving" @click="closeEdit">
                    Batal
                  </button>
                  <button type="submit" class="save-button" :disabled="isSaving">
                    {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
                  </button>
                </div>
              </div>
            </form>

            <article v-else-if="user" class="detail-card">
              <div class="detail-card__visual">
                <img :src="avatar" :alt="user.nama" class="detail-card__photo">
                <div class="social-links">
                  <a
                    :href="instagramUrl"
                    :aria-disabled="instagramUrl === '#'"
                    aria-label="Instagram"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.4" cy="6.7" r="0.8" class="fill-current" />
                    </svg>
                  </a>
                  <a
                    :href="linkedinUrl"
                    :aria-disabled="linkedinUrl === '#'"
                    aria-label="LinkedIn"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M6 9v10M6 5.5v.1M10.5 19v-5.7a4 4 0 0 1 8 0V19M10.5 9v10" />
                    </svg>
                  </a>
                </div>
              </div>

              <div class="detail-card__body">
                <button type="button" class="settings-button" aria-label="Edit profil" @click="openEdit">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 15.25A3.25 3.25 0 1 0 12 8.75a3.25 3.25 0 0 0 0 6.5Z" />
                    <path d="m19.4 15 .08.05a2 2 0 0 1 .73 2.73l-.1.17a2 2 0 0 1-2.73.73l-.08-.05a2 2 0 0 0-3 1.73v.1a2 2 0 0 1-2 2h-.2a2 2 0 0 1-2-2v-.1a2 2 0 0 0-3-1.73l-.08.05a2 2 0 0 1-2.73-.73l-.1-.17a2 2 0 0 1 .73-2.73L4 15a2 2 0 0 0 0-3.46l-.08-.05a2 2 0 0 1-.73-2.73l.1-.17a2 2 0 0 1 2.73-.73l.08.05a2 2 0 0 0 3-1.73v-.1a2 2 0 0 1 2-2h.2a2 2 0 0 1 2 2v.1a2 2 0 0 0 3 1.73l.08-.05a2 2 0 0 1 2.73.73l.1.17a2 2 0 0 1-.73 2.73l-.08.05a2 2 0 0 0 0 3.46Z" />
                  </svg>
                </button>

                <div class="identity">
                  <h3>{{ user.nama }}</h3>
                  <p>{{ identifierLabel }}: {{ identifier }}</p>
                </div>

                <div class="detail-field">
                  <span class="detail-field__label">Email</span>
                  <div class="detail-field__value">
                    <span class="field-icon field-icon--red">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m4 7 8 6 8-6" />
                      </svg>
                    </span>
                    <span>{{ user.email || '-' }}</span>
                  </div>
                </div>

                <div class="detail-field">
                  <span class="detail-field__label">Pilih Peran Utama</span>
                  <div class="role-field">
                    <span class="field-icon field-icon--red">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="12" cy="8" r="3.5" />
                        <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
                      </svg>
                    </span>
                    <select
                      :value="activeRole?.id"
                      aria-label="Pilih peran utama"
                      @change="selectRole"
                    >
                      <option v-for="role in roles" :key="role.id" :value="role.id">
                        {{ role.nama }}
                      </option>
                    </select>
                    <svg class="role-chevron" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="m7 10 5 5 5-5" />
                    </svg>
                  </div>
                </div>

                <div class="current-role">
                  Current Role: {{ activeRole?.nama || '-' }}
                </div>

                <div class="detail-field">
                  <span class="detail-field__label">Rasa Bakti</span>
                  <div class="detail-field__value">
                    <span class="field-icon field-icon--green">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <rect x="4" y="5.5" width="16" height="14" rx="2" />
                        <path d="M8 3v5M16 3v5M4 10h16" />
                      </svg>
                    </span>
                    <span>Bergabung sejak {{ joinedAt }}</span>
                  </div>
                </div>

                <div class="active-status">
                  <span />
                  Active Status
                </div>
              </div>
            </article>

            <div v-else class="profile-loading" aria-label="Memuat profil">
              <span />
            </div>
          </div>
        </section>
      </div>
    </main>

  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  min-height: calc(100vh - 4.125rem);
  flex-direction: column;
  color: #172033;
  background: #f7f8fa;
}

.edit-card svg,
.detail-card svg {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.batik-strip {
  height: 132px;
  flex: 0 0 auto;
  background-image: url('/img/batik.png');
  background-repeat: repeat-x;
  background-position: center top;
  background-size: auto 132px;
}

.profile-content {
  flex: 1;
  padding: 48px 24px 74px;
  background: #f7f8fa;
}

.profile-content__inner {
  width: min(100%, 1280px);
  margin: 0 auto;
}

.back-button {
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  cursor: pointer;
  border: 1px solid #d6dbe2;
  border-radius: 11px;
  padding: 8px 16px 8px 12px;
  color: #455268;
  background: #fff;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
  transition: color 160ms ease, border-color 160ms ease, background 160ms ease;
}

.back-button:hover {
  border-color: #f2a7aa;
  color: #df1018;
  background: #fff8f8;
}

.back-button svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.intro-card,
.workspace-card {
  border: 1px solid #e2e4e7;
  background: #fff;
  box-shadow: 0 2px 2px rgba(15, 23, 42, 0.09);
}

.intro-card {
  min-height: 151px;
  padding: 35px 36px 30px;
  border-radius: 12px;
}

.intro-card h1,
.workspace-card h2 {
  margin: 0;
  color: #121212;
  font-size: 28px;
  font-weight: 500;
  line-height: 1.2;
}

.intro-card p {
  max-width: 1200px;
  margin: 10px 0 0;
  color: #536075;
  font-size: 18px;
  line-height: 1.5;
}

.workspace-card {
  min-height: 731px;
  margin-top: 47px;
  padding: 36px;
  border-radius: 12px;
}

.workspace-card__stage {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-top: 40px;
}

.detail-card {
  display: grid;
  grid-template-columns: 298px minmax(0, 446px);
  width: min(100%, 744px);
  min-height: 548px;
  overflow: hidden;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 28px 45px rgba(15, 23, 42, 0.18);
}

.detail-card__visual {
  position: relative;
  min-height: 548px;
  overflow: hidden;
  background: #d5dade;
}

.detail-card__photo {
  width: 100%;
  height: 100%;
  min-height: 548px;
  object-fit: cover;
}

.social-links {
  position: absolute;
  bottom: 29px;
  left: 34px;
  display: flex;
  gap: 23px;
}

.social-links a {
  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;
  color: #fff;
  opacity: 0.92;
}

.social-links a[aria-disabled='true'] {
  pointer-events: none;
  opacity: 0.48;
}

.social-links svg {
  width: 20px;
  height: 20px;
  stroke-width: 1.9;
}

.detail-card__body {
  position: relative;
  padding: 38px 35px 28px;
}

.settings-button {
  position: absolute;
  top: 27px;
  right: 27px;
  display: grid;
  width: 40px;
  height: 40px;
  cursor: pointer;
  place-items: center;
  border: 0;
  border-radius: 12px;
  color: #64748b;
  background: #f4f6f8;
}

.settings-button:hover {
  color: #e60000;
  background: #feeaea;
}

.settings-button svg {
  width: 20px;
  height: 20px;
  stroke-width: 1.75;
}

.identity {
  padding-right: 54px;
  margin-bottom: 28px;
}

.identity h3 {
  margin: 0;
  color: #172033;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.15;
}

.identity p {
  margin: 5px 0 0;
  color: #ef0000;
  font-size: 13px;
  font-weight: 700;
}

.detail-field {
  margin-top: 21px;
}

.detail-field__label {
  display: block;
  margin-bottom: 7px;
  color: #7d8797;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.015em;
  text-transform: uppercase;
}

.detail-field__value,
.role-field {
  display: flex;
  min-height: 62px;
  align-items: center;
  gap: 14px;
  border-radius: 12px;
  color: #526075;
  background: #f7f8fa;
  font-size: 16px;
}

.detail-field__value {
  padding: 10px 14px;
}

.role-field {
  position: relative;
  padding-left: 14px;
}

.role-field select {
  width: 100%;
  min-width: 0;
  height: 62px;
  cursor: pointer;
  appearance: none;
  border: 0;
  outline: 0;
  color: #526075;
  background: transparent;
  font: inherit;
}

.role-chevron {
  position: absolute;
  right: 16px;
  width: 17px;
  height: 17px;
  pointer-events: none;
  color: #a0aaba;
  stroke-width: 2;
}

.field-icon {
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 12px;
}

.field-icon svg {
  width: 20px;
  height: 20px;
  stroke-width: 1.85;
}

.field-icon--red {
  color: #f10a13;
  background: #fde4e6;
}

.field-icon--green {
  color: #0ebc55;
  background: #dcf9e8;
}

.current-role {
  display: grid;
  min-height: 41px;
  margin-top: 10px;
  place-items: center;
  border-radius: 12px;
  color: #fff;
  background: #ed0000;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 2px 3px rgba(237, 0, 0, 0.22);
}

.active-status {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 29px;
  color: #09aa49;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
}

.active-status span {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: #11c45b;
}

.edit-card {
  width: min(100%, 568px);
  overflow: hidden;
  border-radius: 20px;
  color: #172033;
  background: #fff;
  box-shadow: 0 28px 45px rgba(15, 23, 42, 0.18);
}

.edit-card__header {
  display: flex;
  min-height: 100px;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 28px;
  color: #fff;
  background: #ed0000;
}

.edit-card__header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.15;
}

.edit-card__header p {
  margin: 6px 0 0;
  color: #ffd8d8;
  font-size: 16px;
}

.edit-card__header button {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  cursor: pointer;
  place-items: center;
  border: 0;
  border-radius: 12px;
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
}

.edit-card__header svg {
  width: 22px;
  height: 22px;
  stroke-width: 2;
}

.edit-card__body {
  padding: 35px 36px 36px;
}

.portrait-picker {
  text-align: center;
}

.portrait-picker button {
  width: 126px;
  height: 126px;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  border: 0;
  border-radius: 22px;
  background: #edf0f3;
}

.portrait-picker img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.portrait-picker p {
  margin: 12px 0 0;
  color: #748094;
  font-size: 14px;
  line-height: 1.35;
}

.portrait-picker span {
  display: block;
  margin-top: 2px;
  color: #a1abba;
  font-size: 13px;
}

.edit-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 23px 18px;
  margin-top: 23px;
}

.edit-grid label > span {
  display: block;
  margin-bottom: 8px;
  color: #68758a;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.edit-input {
  display: flex;
  height: 48px;
  align-items: center;
  gap: 11px;
  padding: 0 13px;
  border: 1px solid #dde2e8;
  border-radius: 11px;
  color: #98a3b4;
  background: #f8f9fa;
}

.edit-input:focus-within {
  border-color: #f28b90;
  box-shadow: 0 0 0 3px rgba(237, 0, 0, 0.08);
}

.edit-input svg {
  width: 19px;
  height: 19px;
  flex: 0 0 auto;
  stroke-width: 1.75;
}

.edit-input input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  color: #526075;
  background: transparent;
  font-size: 14px;
}

.save-error {
  margin: 20px 0 0;
  border-radius: 10px;
  padding: 10px 12px;
  color: #b91c1c;
  background: #fff0f0;
  font-size: 13px;
}

.edit-actions {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 14px;
  margin-top: 34px;
}

.edit-actions button {
  min-height: 56px;
  cursor: pointer;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
}

.edit-actions button:disabled {
  cursor: wait;
  opacity: 0.7;
}

.cancel-button {
  border: 1px solid #d6dce3;
  color: #455268;
  background: #fff;
}

.save-button {
  border: 1px solid #ed0000;
  color: #fff;
  background: #ed0000;
  box-shadow: 0 3px 5px rgba(237, 0, 0, 0.18);
}

.profile-loading {
  display: grid;
  width: 80px;
  height: 80px;
  place-items: center;
}

.profile-loading span {
  width: 36px;
  height: 36px;
  border: 3px solid #e6e8eb;
  border-top-color: #ed0000;
  border-radius: 50%;
  animation: profile-spin 700ms linear infinite;
}

@keyframes profile-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .batik-strip {
    height: 78px;
    background-size: auto 78px;
  }

  .profile-content {
    padding: 30px 18px 56px;
  }

  .intro-card,
  .workspace-card {
    padding: 26px;
  }

  .intro-card p {
    font-size: 16px;
  }

  .detail-card {
    grid-template-columns: 1fr;
    max-width: 520px;
  }

  .detail-card__visual,
  .detail-card__photo {
    min-height: 370px;
  }
}

@media (max-width: 620px) {
  .profile-content {
    padding: 20px 12px 40px;
  }

  .back-button {
    width: 100%;
    justify-content: center;
    margin-bottom: 14px;
  }

  .intro-card,
  .workspace-card {
    padding: 20px 16px;
    border-radius: 10px;
  }

  .intro-card h1,
  .workspace-card h2 {
    font-size: 23px;
  }

  .intro-card p {
    font-size: 14px;
  }

  .workspace-card {
    min-height: auto;
    margin-top: 24px;
  }

  .workspace-card__stage {
    margin-top: 24px;
  }

  .detail-card {
    border-radius: 18px;
  }

  .detail-card__body {
    padding: 30px 20px 26px;
  }

  .settings-button {
    top: 20px;
    right: 20px;
  }

  .identity h3 {
    font-size: 24px;
  }

  .detail-field__value,
  .role-field {
    font-size: 14px;
  }

  .edit-card__header {
    min-height: 88px;
    padding: 20px;
  }

  .edit-card__header h3 {
    font-size: 21px;
  }

  .edit-card__header p {
    font-size: 14px;
  }

  .edit-card__body {
    padding: 28px 20px;
  }

  .edit-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .edit-actions {
    grid-template-columns: 1fr;
  }
}
</style>
