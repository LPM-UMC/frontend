project-root/
├── app/
│   ├── app.vue
│   ├── assets/
│   │   └── css/
│   │       └── main.css
│   ├── layouts/
│   │   ├── default.vue
│   │   ├── auth.vue
│   │   └── dashboard.vue
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── guest.ts
│   │   └── permission.ts
│   └── pages/
│       ├── index.vue
│       ├── auth/
│       │   ├── login.vue
│       │   └── google-callback.vue
│       └── dashboard/
│           ├── index.vue
│           │
│           ├── manajemen-user/
│           │   ├── index.vue
│           │   ├── create.vue
│           │   └── [user_id]/
│           │       ├── index.vue
│           │       └── edit.vue
│           │
│           ├── modul/
│           │   ├── index.vue
│           │   ├── create.vue
│           │   └── [modul_id]/
│           │       ├── index.vue
│           │       ├── edit.vue
│           │       └── aspek/
│           │           ├── create.vue
│           │           └── [aspek_id]/
│           │               ├── index.vue
│           │               └── edit.vue
│           │
│           ├── lingkup/
│           │   ├── index.vue
│           │   ├── create.vue
│           │   └── [lingkup_id]/
│           │       ├── index.vue
│           │       ├── edit.vue
│           │       ├── unit/
│           │       │   ├── create.vue
│           │       │   └── [unit_id]/
│           │       │       ├── index.vue
│           │       │       ├── edit.vue
│           │       │       └── objek/
│           │       │           ├── create.vue
│           │       │           └── [objek_id]/
│           │       │               ├── index.vue
│           │       │               └── edit.vue
│           │       └── objek/
│           │           ├── create.vue
│           │           └── [objek_id]/
│           │               ├── index.vue
│           │               └── edit.vue
│           │
│           └── periode-modul/
│               ├── index.vue
│               ├── create.vue
│               └── [periode_modul_id]/
│                   ├── index.vue
│                   ├── edit.vue
│                   └── unit/
│                       └── [unit_id]/
│                           ├── fm1/
│                           │   ├── index.vue
│                           │   ├── bukti.vue
│                           │   └── aspek/
│                           │       └── [aspek_id].vue
│                           ├── fm2/
│                           │   ├── index.vue
│                           │   ├── bukti.vue
│                           │   └── aspek/
│                           │       └── [aspek_id].vue
│                           ├── fm3/
│                           │   ├── index.vue
│                           │   ├── bukti.vue
│                           │   └── aspek/
│                           │       └── [aspek_id].vue
│                           ├── fm4/
│                           │   ├── index.vue
│                           │   ├── bukti.vue
│                           │   └── aspek/
│                           │       └── [aspek_id].vue
│                           ├── fm5/
│                           │   ├── index.vue
│                           │   ├── bukti.vue
│                           │   └── aspek/
│                           │       └── [aspek_id].vue
│                           ├── fm6/
│                           │   ├── index.vue
│                           │   ├── bukti.vue
│                           │   └── aspek/
│                           │       └── [aspek_id].vue
│                           └── fm7/
│                               ├── index.vue
│                               ├── bukti.vue
│                               └── aspek/
│                                   └── [aspek_id].vue
│
├── features/
│   │
│   ├── auth/
│   │   ├── components/
│   │   │   └── LoginForm.vue
│   │   ├── composables/
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   └── auth.api.ts
│   │   └── types/
│   │       └── auth.ts
│   │
│   ├── manajemen-user/
│   │   ├── components/
│   │   │   ├── UserTable.vue
│   │   │   └── UserForm.vue
│   │   ├── composables/
│   │   │   └── useUser.ts
│   │   ├── pages/
│   │   │   ├── UserListPage.vue
│   │   │   ├── UserCreatePage.vue
│   │   │   ├── UserDetailPage.vue
│   │   │   └── UserEditPage.vue
│   │   ├── services/
│   │   │   └── user.api.ts
│   │   └── types/
│   │       └── user.ts
│   │
│   ├── modul/
│   │   ├── components/
│   │   │   ├── ModulTable.vue
│   │   │   ├── ModulForm.vue
│   │   │   ├── AspekTable.vue
│   │   │   └── AspekForm.vue
│   │   ├── composables/
│   │   │   ├── useModul.ts
│   │   │   └── useAspek.ts
│   │   ├── pages/
│   │   │   ├── ModulListPage.vue
│   │   │   ├── ModulCreatePage.vue
│   │   │   ├── ModulDetailPage.vue
│   │   │   ├── ModulEditPage.vue
│   │   │   ├── ModulAspekCreatePage.vue
│   │   │   ├── ModulAspekDetailPage.vue
│   │   │   └── ModulAspekEditPage.vue
│   │   ├── services/
│   │   │   ├── modul.api.ts
│   │   │   └── aspek.api.ts
│   │   └── types/
│   │       ├── modul.ts
│   │       └── aspek.ts
│   │
│   ├── lingkup/
│   │   ├── components/
│   │   │   ├── LingkupTable.vue
│   │   │   ├── LingkupForm.vue
│   │   │   ├── UnitTable.vue
│   │   │   ├── UnitForm.vue
│   │   │   ├── ObjekTable.vue
│   │   │   └── ObjekForm.vue
│   │   ├── composables/
│   │   │   ├── useLingkup.ts
│   │   │   ├── useUnit.ts
│   │   │   └── useObjek.ts
│   │   ├── pages/
│   │   │   ├── LingkupListPage.vue
│   │   │   ├── LingkupCreatePage.vue
│   │   │   ├── LingkupDetailPage.vue
│   │   │   ├── LingkupEditPage.vue
│   │   │   ├── LingkupUnitCreatePage.vue
│   │   │   ├── LingkupUnitDetailPage.vue
│   │   │   ├── LingkupUnitEditPage.vue
│   │   │   ├── LingkupObjekCreatePage.vue
│   │   │   ├── LingkupObjekDetailPage.vue
│   │   │   ├── LingkupObjekEditPage.vue
│   │   │   ├── LingkupUnitObjekCreatePage.vue
│   │   │   ├── LingkupUnitObjekDetailPage.vue
│   │   │   └── LingkupUnitObjekEditPage.vue
│   │   ├── services/
│   │   │   ├── lingkup.api.ts
│   │   │   ├── unit.api.ts
│   │   │   └── objek.api.ts
│   │   └── types/
│   │       ├── lingkup.ts
│   │       ├── unit.ts
│   │       └── objek.ts
│   │
│   ├── periode-modul/
│   │   ├── components/
│   │   │   ├── PeriodeModulTable.vue
│   │   │   ├── PeriodeModulForm.vue
│   │   │   ├── fm1/
│   │   │   │   ├── Fm1AspekTable.vue
│   │   │   │   └── Fm1BuktiList.vue
│   │   │   ├── fm2/
│   │   │   │   ├── Fm2AspekTable.vue
│   │   │   │   └── Fm2BuktiList.vue
│   │   │   ├── fm3/
│   │   │   │   ├── Fm3AspekTable.vue
│   │   │   │   └── Fm3BuktiList.vue
│   │   │   ├── fm4/
│   │   │   │   ├── Fm4AspekTable.vue
│   │   │   │   └── Fm4BuktiList.vue
│   │   │   ├── fm5/
│   │   │   │   ├── Fm5AspekTable.vue
│   │   │   │   └── Fm5BuktiList.vue
│   │   │   ├── fm6/
│   │   │   │   ├── Fm6AspekTable.vue
│   │   │   │   └── Fm6BuktiList.vue
│   │   │   └── fm7/
│   │   │       ├── Fm7AspekTable.vue
│   │   │       └── Fm7BuktiList.vue
│   │   ├── composables/
│   │   │   ├── usePeriodeModul.ts
│   │   │   ├── useFormSubmission.ts
│   │   │   └── useFormPermissions.ts
│   │   ├── pages/
│   │   │   ├── PeriodeModulListPage.vue
│   │   │   ├── PeriodeModulCreatePage.vue
│   │   │   ├── PeriodeModulDetailPage.vue
│   │   │   ├── PeriodeModulEditPage.vue
│   │   │   ├── fm1/
│   │   │   │   ├── Fm1DashboardPage.vue
│   │   │   │   ├── Fm1AspekPage.vue
│   │   │   │   └── Fm1BuktiPage.vue
│   │   │   ├── fm2/
│   │   │   │   ├── Fm2DashboardPage.vue
│   │   │   │   ├── Fm2AspekPage.vue
│   │   │   │   └── Fm2BuktiPage.vue
│   │   │   ├── fm3/
│   │   │   │   ├── Fm3DashboardPage.vue
│   │   │   │   ├── Fm3AspekPage.vue
│   │   │   │   └── Fm3BuktiPage.vue
│   │   │   ├── fm4/
│   │   │   │   ├── Fm4DashboardPage.vue
│   │   │   │   ├── Fm4AspekPage.vue
│   │   │   │   └── Fm4BuktiPage.vue
│   │   │   ├── fm5/
│   │   │   │   ├── Fm5DashboardPage.vue
│   │   │   │   ├── Fm5AspekPage.vue
│   │   │   │   └── Fm5BuktiPage.vue
│   │   │   ├── fm6/
│   │   │   │   ├── Fm6DashboardPage.vue
│   │   │   │   ├── Fm6AspekPage.vue
│   │   │   │   └── Fm6BuktiPage.vue
│   │   │   └── fm7/
│   │   │       ├── Fm7DashboardPage.vue
│   │   │       ├── Fm7AspekPage.vue
│   │   │       └── Fm7BuktiPage.vue
│   │   ├── services/
│   │   │   ├── periode-modul.api.ts
│   │   │   ├── bukti.api.ts
│   │   │   └── submission.api.ts
│   │   └── types/
│   │       ├── periode-modul.ts
│   │       └── form.ts
│   │
│   └── shared/
│       └── ui/
│           ├── base/
│           │   ├── BaseButton.vue
│           │   ├── BaseInput.vue
│           │   ├── BaseModal.vue
│           │   └── BaseSelect.vue
│           └── layout/
│               ├── AppHeader.vue
│               ├── AppSidebar.vue
│               └── PageHeader.vue
│
├── composables/
│   ├── useApi.ts
│   ├── usePagination.ts
│   └── usePermission.ts
│
├── config/
│   ├── navigation.ts
│   ├── permissions.ts
│   └── roles.ts
│
├── plugins/
│   ├── axios.ts
│   └── persistedState.client.ts
│
├── server/
│   └── api/
│       └── dashboard/
│           │
│           ├── manajemen-user/
│           │   ├── index.get.ts
│           │   ├── create.post.ts
│           │   └── [user_id]/
│           │       ├── index.get.ts
│           │       ├── update.put.ts
│           │       └── delete.delete.ts
│           │
│           ├── modul/
│           │   ├── index.get.ts
│           │   ├── create.post.ts
│           │   └── [modul_id]/
│           │       ├── index.get.ts
│           │       ├── update.put.ts
│           │       ├── delete.delete.ts
│           │       └── aspek/
│           │           ├── create.post.ts
│           │           └── [aspek_id]/
│           │               ├── index.get.ts
│           │               ├── update.put.ts
│           │               └── delete.delete.ts
│           │
│           ├── lingkup/
│           │   ├── index.get.ts
│           │   ├── create.post.ts
│           │   └── [lingkup_id]/
│           │       ├── index.get.ts
│           │       ├── update.put.ts
│           │       ├── delete.delete.ts
│           │       ├── unit/
│           │       │   ├── create.post.ts
│           │       │   └── [unit_id]/
│           │       │       ├── index.get.ts
│           │       │       ├── update.put.ts
│           │       │       ├── delete.delete.ts
│           │       │       └── objek/
│           │       │           ├── create.post.ts
│           │       │           └── [objek_id]/
│           │       │               ├── index.get.ts
│           │       │               ├── update.put.ts
│           │       │               └── delete.delete.ts
│           │       └── objek/
│           │           ├── create.post.ts
│           │           └── [objek_id]/
│           │               ├── index.get.ts
│           │               ├── update.put.ts
│           │               └── delete.delete.ts
│           │
│           └── periode-modul/
│               ├── index.get.ts
│               ├── create.post.ts
│               └── [periode_modul_id]/
│                   ├── index.get.ts
│                   ├── update.put.ts
│                   ├── delete.delete.ts
│                   └── unit/
│                       └── [unit_id]/
│                           ├── fm1/
│                           │   ├── index.get.ts
│                           │   ├── bukti.get.ts
│                           │   └── aspek/
│                           │       └── [aspek_id].get.ts
│                           ├── fm2/
│                           │   ├── index.get.ts
│                           │   ├── bukti.get.ts
│                           │   └── aspek/
│                           │       └── [aspek_id].get.ts
│                           ├── fm3/
│                           │   ├── index.get.ts
│                           │   ├── bukti.get.ts
│                           │   └── aspek/
│                           │       └── [aspek_id].get.ts
│                           ├── fm4/
│                           │   ├── index.get.ts
│                           │   ├── bukti.get.ts
│                           │   └── aspek/
│                           │       └── [aspek_id].get.ts
│                           ├── fm5/
│                           │   ├── index.get.ts
│                           │   ├── bukti.get.ts
│                           │   └── aspek/
│                           │       └── [aspek_id].get.ts
│                           ├── fm6/
│                           │   ├── index.get.ts
│                           │   ├── bukti.get.ts
│                           │   └── aspek/
│                           │       └── [aspek_id].get.ts
│                           └── fm7/L
│                               ├── index.get.ts
│                               ├── bukti.get.ts
│                               └── aspek/
│                                   └── [aspek_id].get.ts
│
├── stores/
│   └── auth.ts
│
├── types/
│   ├── auth.ts
│   ├── user.ts
│   ├── period.ts
│   └── nuxt.d.ts
│
├── i18n/
│   └── locales/
│       ├── en.json
│       └── id.json
│
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── img/
│       ├── logo-umc.jpg
│       ├── gedung-umc.jpg
│       ├── batik.png
│       ├── profil.jpg
│       ├── icons/
│       ├── struktur-organisasi/
│       └── admin/
│           └── icon/
│               └── dashboard/
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── PERMISSIONS.md
│   └── ROUTES.md
│
├── nuxt.config.ts
├── tsconfig.json
├── package.json
└── eslint.config.mjs