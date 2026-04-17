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
│           └── periode-modul/
│               ├── index.vue
│               ├── create.vue
│               └── [periode_modul_id]/
│                   ├── index.vue
│                   ├── edit.vue
│                   └── unit/
│                       └── [unit_id]/
│                           └── [form_code]/
│                               ├── index.vue
│                               ├── aspek/
│                               │   └── [aspek_id].vue
│                               ├── bukti/
│                               │   └── index.vue
│                               └── objek/
│                                   ├── index.vue
│                                   ├── create.vue
│                                   └── [objek_id]/
│                                       ├── index.vue
│                                       └── edit.vue
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── modul/
│   │   ├── pages/
│   │   │   ├── ModulListPage.vue
│   │   │   ├── ModulCreatePage.vue
│   │   │   ├── ModulDetailPage.vue
│   │   │   ├── ModulEditPage.vue
│   │   │   ├── ModulAspekCreatePage.vue
│   │   │   ├── ModulAspekDetailPage.vue
│   │   │   └── ModulAspekEditPage.vue
│   │   ├── components/
│   │   ├── composables/
│   │   ├── services/
│   │   │   ├── modul.api.ts
│   │   │   └── aspek.api.ts
│   │   ├── types/
│   │   │   ├── modul.ts
│   │   │   └── aspek.ts
│   │   └── utils/
│   │
│   ├── lingkup/
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
│   │   ├── components/
│   │   ├── composables/
│   │   ├── services/
│   │   │   ├── lingkup.api.ts
│   │   │   ├── unit.api.ts
│   │   │   └── objek.api.ts
│   │   ├── types/
│   │   │   ├── lingkup.ts
│   │   │   ├── unit.ts
│   │   │   └── objek.ts
│   │   └── utils/
│   │
│   ├── periode-modul/
│   │   ├── pages/
│   │   │   ├── PeriodeModulListPage.vue
│   │   │   ├── PeriodeModulCreatePage.vue
│   │   │   ├── PeriodeModulDetailPage.vue
│   │   │   ├── PeriodeModulEditPage.vue
│   │   │   ├── FormDashboardPage.vue
│   │   │   ├── FormAspekPage.vue
│   │   │   ├── FormBuktiPage.vue
│   │   │   ├── FormObjekListPage.vue
│   │   │   ├── FormObjekCreatePage.vue
│   │   │   ├── FormObjekDetailPage.vue
│   │   │   └── FormObjekEditPage.vue
│   │   ├── components/
│   │   ├── composables/
│   │   │   ├── usePeriodeModul.ts
│   │   │   ├── useFormRuntime.ts
│   │   │   ├── useFormPermissions.ts
│   │   │   └── useFormSubmission.ts
│   │   ├── services/
│   │   │   ├── periode-modul.api.ts
│   │   │   ├── form-runtime.api.ts
│   │   │   ├── bukti.api.ts
│   │   │   └── submission.api.ts
│   │   ├── registry/
│   │   │   └── form.registry.ts
│   │   ├── definitions/
│   │   │   ├── fm1.ts
│   │   │   ├── fm2.ts
│   │   │   ├── fm3.ts
│   │   │   ├── fm4.ts
│   │   │   ├── fm5.ts
│   │   │   ├── fm6.ts
│   │   │   └── fm7.ts
│   │   ├── overrides/
│   │   │   ├── fm1/
│   │   │   ├── fm2/
│   │   │   ├── fm3/
│   │   │   ├── fm4/
│   │   │   ├── fm5/
│   │   │   ├── fm6/
│   │   │   └── fm7/
│   │   ├── types/
│   │   │   ├── periode-modul.ts
│   │   │   ├── form.ts
│   │   │   └── submission.ts
│   │   └── utils/
│   │       ├── resolve-form-definition.ts
│   │       └── resolve-form-override.ts
│   │
│   └── shared/
│       ├── workflow/
│       │   ├── components/
│       │   ├── composables/
│       │   ├── types/
│       │   └── utils/
│       ├── form-engine/
│       │   ├── components/
│       │   ├── composables/
│       │   ├── types/
│       │   └── utils/
│       └── ui/
│           ├── base/
│           └── layout/
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
├── server/
│   └── api/
│       └── dashboard/
│           ├── modul/
│           │   ├── index.get.ts
│           │   ├── create.post.ts
│           │   └── [modul_id]/
│           │       ├── index.get.ts
│           │       ├── update.put.ts
│           │       └── aspek/
│           │           ├── create.post.ts
│           │           └── [aspek_id]/
│           │               ├── index.get.ts
│           │               └── update.put.ts
│           ├── lingkup/
│           │   ├── index.get.ts
│           │   ├── create.post.ts
│           │   └── [lingkup_id]/
│           │       ├── index.get.ts
│           │       ├── update.put.ts
│           │       ├── unit/
│           │       │   ├── create.post.ts
│           │       │   └── [unit_id]/
│           │       │       ├── index.get.ts
│           │       │       ├── update.put.ts
│           │       │       └── objek/
│           │       │           ├── create.post.ts
│           │       │           └── [objek_id]/
│           │       │               ├── index.get.ts
│           │       │               └── update.put.ts
│           │       └── objek/
│           │           ├── create.post.ts
│           │           └── [objek_id]/
│           │               ├── index.get.ts
│           │               └── update.put.ts
│           └── periode-modul/
│               ├── index.get.ts
│               ├── create.post.ts
│               └── [periode_modul_id]/
│                   ├── index.get.ts
│                   ├── update.put.ts
│                   └── unit/
│                       └── [unit_id]/
│                           └── [form_code]/
│                               ├── index.get.ts
│                               ├── aspek/
│                               │   └── [aspek_id].get.ts
│                               ├── bukti.get.ts
│                               └── objek/
│                                   ├── index.get.ts
│                                   ├── create.post.ts
│                                   └── [objek_id]/
│                                       ├── index.get.ts
│                                       └── update.put.ts
│
├── stores/
├── types/
└── docs/