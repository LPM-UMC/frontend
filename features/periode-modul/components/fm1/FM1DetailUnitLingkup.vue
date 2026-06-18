<template>
  <aside class="space-y-3.5">
    <article class="rounded-[16px] border border-[#d9dde4] bg-[#f6f7f8] p-3 sm:p-3.5">
      <p class="text-[12px] font-semibold tracking-wide text-[#96a0b1] sm:text-[13px]">
      {{ $t('periodeModul.lingkupEvaluasi') }}
      </p>
      <div class="mt-1 flex flex-wrap items-center gap-2">
        <h3 class="text-[15px] font-semibold text-[#121b2f] sm:text-[17px]">
          {{ fm1Store.informasi?.unit_lingkup?.lingkup?.nama || '-' }}
        </h3>
      </div>
      <p class="mt-2 text-[12px] leading-normal text-[#5f6a7c] sm:text-[13px]">
        {{ fm1Store.informasi?.unit_lingkup?.lingkup?.deskripsi || '-' }}
      </p>

      <div class="my-4 border-t border-[#d8dde5]" />

      <p class="text-[12px] font-semibold tracking-wide text-[#96a0b1] sm:text-[13px]">
      {{ $t('periodeModul.unitLingkupEvaluasi') }}
      </p>
      <h4 class="mt-1 text-[15px] font-semibold text-[#121b2f] sm:text-[17px]">
        {{ fm1Store.informasi?.unit_lingkup?.nama || '-' }}
      </h4>
      <p class="mt-2 text-[12px] leading-normal text-[#5f6a7c] sm:text-[13px]">
        {{ fm1Store.informasi?.unit_lingkup?.deskripsi || '-' }}
      </p>
    </article>

    <article class="rounded-[16px] border border-[#d9dde4] bg-[#f6f7f8] p-3 sm:p-3.5">
      <p class="text-[12px] font-semibold tracking-wide text-[#96a0b1] sm:text-[13px]">
        {{ $t('periodeModul.pihakTerkait') }}
      </p>

      <div class="mt-3 space-y-2.5">
        <article
          v-for="person in stakeholders"
          :key="person.id"
          class="rounded-[14px] border border-[#d6dce6] bg-[#f7f8fa] px-3.5 py-2.5"
        >
          <div class="flex items-center gap-3">
            <img :src="person.avatar" class="h-9 w-9 rounded-lg object-cover border border-black/5">
            <div class="min-w-0">
              <span class="inline-flex rounded-[8px] bg-[#d8e6ff] px-2 py-0.5 text-[11px] font-medium text-[#2864dd] sm:text-[12px]">
                {{ person.roleTag }}
              </span>
              <p class="mt-1 truncate text-[13px] font-semibold text-[#131d31] sm:text-[14px]">
                {{ person.name }}
              </p>
              <p class="truncate text-[11px] text-[#657084] sm:text-[12px]">
                {{ person.email }}
              </p>
            </div>
          </div>
        </article>
      </div>
    </article>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFm1Store } from '#stores/fm1'
import { useI18n } from 'vue-i18n'

const fm1Store = useFm1Store()
const { t } = useI18n()

const stakeholders = computed(() => {
  const ul = fm1Store.informasi?.unit_lingkup
  if (!ul) return []
  
  const list = []
  
  if (ul.auditee) {
    list.push({
      id: ul.auditee.id,
      avatar: ul.auditee.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(ul.auditee.nama),
      name: ul.auditee.nama,
      email: ul.auditee.email,
      roleTag: t('periodeModul.roles.auditee'),
    })
  }
  
  if (ul.evaluator) {
    list.push({
      id: ul.evaluator.id,
      avatar: ul.evaluator.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(ul.evaluator.nama),
      name: ul.evaluator.nama,
      email: ul.evaluator.email,
      roleTag: t('periodeModul.roles.evaluator'),
    })
  }
  
  if (ul.reviewer) {
    list.push({
      id: ul.reviewer.id,
      avatar: ul.reviewer.photo || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(ul.reviewer.nama),
      name: ul.reviewer.nama,
      email: ul.reviewer.email,
      roleTag: t('periodeModul.roles.reviewer'),
    })
  }
  
  return list
})
</script>
