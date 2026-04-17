├── components
│   ├── base                     # buat komponen kecil reusable (tanpa bisnis)
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   ├── BaseSelect.vue
│   │   └── BaseModal.vue
│   ├── ui                       # buat komponen generik (table, pagination)
│   │   ├── UiTable.vue
│   │   ├── UiPagination.vue
│   │   └── UiEmptyState.vue
│   └── layout                   # layout blocks (bukan per-role)
│       ├── AppHeader.vue
│       ├── AppSidebar.vue
│       └── PageHeader.vue