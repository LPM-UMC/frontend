<script setup lang="ts">
</script>

<template>
  <section class="mt-6 space-y-6">
    <article class="rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <button type="button" class="flex w-full items-center justify-between px-6 py-5 text-left"
        @click="toggleDetailSection('informasi')">
        <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">
          Informasi Lingkup Evaluasi
        </h2>
        <span
          class="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#d8dce4] bg-[#f6f7f9] text-[#697286]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform"
            :class="detailSectionOpen.informasi ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24"
            stroke="currentColor" stroke-width="1.9">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
          </svg>
        </span>
      </button>

      <div v-if="detailSectionOpen.informasi" class="border-t border-[#e3e7ee] px-6 py-6">
        <dl class="space-y-5">
          <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
            <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Nama Lingkup</dt>
            <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.name }}</dd>
          </div>
          <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
            <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Deskripsi</dt>
            <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.description }}</dd>
          </div>
          <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
            <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Penanggung Jawab</dt>
            <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.penanggungJawab }}</dd>
          </div>
          <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
            <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Evaluator</dt>
            <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.evaluator }}</dd>
          </div>
          <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
            <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Total Unit</dt>
            <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.totalUnit }}</dd>
          </div>
          <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
            <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Tanggal Dibuat</dt>
            <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.createdAt }}</dd>
          </div>
          <div class="grid gap-2 sm:grid-cols-[240px_minmax(0,1fr)]">
            <dt class="text-[1.25rem] font-semibold text-[#5b6575]">Tanggal Diperbarui</dt>
            <dd class="text-[1.25rem] text-[#2b3340]">{{ detailInfo.updatedAt }}</dd>
          </div>
        </dl>

        <div class="mt-6 flex flex-wrap gap-2 border-t border-[#e5e9f0] pt-4">
          <button type="button"
            class="rounded-full border border-[#cfd5df] px-5 py-2 text-[0.95rem] font-semibold text-[#2b3340] transition hover:bg-[#f5f7fa]">
            Edit
          </button>
          <button type="button"
            class="rounded-full border border-[#cfd5df] px-5 py-2 text-[0.95rem] font-semibold text-[#2b3340] transition hover:bg-[#f5f7fa]">
            Hapus
          </button>
          <button type="button"
            class="rounded-full border border-[#cfd5df] px-5 py-2 text-[0.95rem] font-semibold text-[#2b3340] transition hover:bg-[#f5f7fa]">
            Tambah Lingkup Evaluasi
          </button>
          <button type="button"
            class="rounded-full border border-[#cfd5df] px-5 py-2 text-[0.95rem] font-semibold text-[#2b3340] transition hover:bg-[#f5f7fa]">
            Tambah Objek Evaluasi
          </button>
        </div>
      </div>
    </article>

    <article class="rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <button type="button" class="flex w-full items-center justify-between px-6 py-5 text-left"
        @click="toggleDetailSection('lingkup')">
        <div class="flex items-center gap-3">
          <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">
            Daftar Lingkup Evaluasi
          </h2>
          <span class="rounded-full bg-[#eceff5] px-3 py-1 text-[0.95rem] font-semibold text-[#637085]">
            {{ filteredScopeRows.length }} data
          </span>
        </div>
        <span
          class="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#d8dce4] bg-[#f6f7f9] text-[#697286]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform"
            :class="detailSectionOpen.lingkup ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="1.9">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
          </svg>
        </span>
      </button>

      <div class="border-t border-[#e3e7ee] px-6 py-6">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label class="relative block w-full md:max-w-[400px]">
            <input v-model="scopeSearchQuery" type="search" placeholder="Search"
              class="h-11 w-full rounded-[16px] border border-[#d8dde4] bg-[#f7f8fa] px-5 pr-12 text-[0.95rem] text-[#2d3645] outline-none placeholder:text-[#9099a8]">
            <svg xmlns="http://www.w3.org/2000/svg"
              class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
            </svg>
          </label>

          <label class="relative block w-full md:w-[170px]">
            <select v-model="scopeSortOrder"
              class="h-11 w-full appearance-none rounded-[16px] border border-[#d8dde4] bg-[#f7f8fa] px-5 pr-12 text-[0.95rem] text-[#9099a8] outline-none">
              <option value="a-z">A - Z</option>
              <option value="z-a">Z - A</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg"
              class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </label>
        </div>

        <div class="mt-4 overflow-x-auto rounded-[16px] border border-[#dce1e8] bg-white">
          <table class="w-full min-w-[980px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th
                  class="w-[62px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">
                  No</th>
                <th
                  class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">
                  Nama</th>
                <th
                  class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">
                  Deskripsi</th>
                <th
                  class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">
                  Penanggung Jawab</th>
                <th
                  class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">
                  Evaluator</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in paginatedScopeRows" :key="row.id" class="border-t border-[#e8edf3]">
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[0.95rem] text-[#2f3744]">
                  {{ scopeShowingFrom + index }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] font-semibold text-[#3b3f46]">
                  {{ row.name }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                  {{ row.description }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                  {{ row.penanggungJawab }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                  {{ row.evaluator }}
                </td>
              </tr>

              <tr v-if="paginatedScopeRows.length === 0">
                <td colspan="5" class="px-4 py-8 text-center text-[1rem] text-[#7a8392]">
                  Data lingkup evaluasi tidak ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="mt-4 flex flex-col gap-3 border-t border-[#e3e7ee] pt-4 md:flex-row md:items-center md:justify-between">
          <p class="text-[clamp(1rem,1.1vw,1.2rem)] text-[#5d6778]">
            Menampilkan <strong>{{ scopeShowingFrom }}-{{ scopeShowingTo }}</strong> dari <strong>{{
              filteredScopeRows.length }}</strong> data
          </p>

          <div class="flex items-center gap-2">
            <button type="button"
              class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="scopeCurrentPage === 1" @click="scopeCurrentPage = Math.max(1, scopeCurrentPage - 1)">
              Previous
            </button>

            <button type="button"
              class="rounded-[14px] bg-[#e30000] px-5 py-2 text-[0.875rem] font-semibold text-white">
              {{ scopeCurrentPage }}
            </button>

            <button type="button"
              class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="scopeCurrentPage === scopeTotalPages"
              @click="scopeCurrentPage = Math.min(scopeTotalPages, scopeCurrentPage + 1)">
              Next
            </button>
          </div>
        </div>
      </div>
    </article>

    <article class="rounded-[16px] border border-[#dadde3] bg-[#f4f4f5] shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
      <button type="button" class="flex w-full items-center justify-between px-6 py-5 text-left"
        @click="toggleDetailSection('objek')">
        <div class="flex items-center gap-3">
          <h2 class="text-[clamp(1.35rem,1.8vw,1.9rem)] font-semibold text-[#1e293b]">
            Daftar Objek Evaluasi
          </h2>
          <span class="rounded-full bg-[#eceff5] px-3 py-1 text-[0.95rem] font-semibold text-[#637085]">
            {{ filteredObjekRows.length }} data
          </span>
        </div>
        <span
          class="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-[#d8dce4] bg-[#f6f7f9] text-[#697286]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform"
            :class="detailSectionOpen.objek ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="1.9">
            <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
          </svg>
        </span>
      </button>

      <div v-if="detailSectionOpen.objek" class="border-t border-[#e3e7ee] px-6 py-6">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label class="relative block w-full md:max-w-[400px]">
            <input v-model="objekSearchQuery" type="search" placeholder="Search"
              class="h-11 w-full rounded-[16px] border border-[#d8dde4] bg-[#f7f8fa] px-5 pr-12 text-[0.95rem] text-[#2d3645] outline-none placeholder:text-[#9099a8]">
            <svg xmlns="http://www.w3.org/2000/svg"
              class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
            </svg>
          </label>

          <label class="relative block w-full md:w-[170px]">
            <select v-model="objekSortOrder"
              class="h-11 w-full appearance-none rounded-[16px] border border-[#d8dde4] bg-[#f7f8fa] px-5 pr-12 text-[0.95rem] text-[#9099a8] outline-none">
              <option value="a-z">A - Z</option>
              <option value="z-a">Z - A</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg"
              class="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9ca5b5]" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </label>
        </div>

        <div class="mt-4 overflow-x-auto rounded-[16px] border border-[#dce1e8] bg-white">
          <table class="w-full min-w-[860px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th
                  class="w-[62px] border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">
                  No</th>
                <th
                  class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">
                  Nama</th>
                <th
                  class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">
                  Deskripsi</th>
                <th
                  class="border-b border-[#e3e7ee] bg-[#f1f3f6] px-4 py-3 text-left text-[1.05rem] font-semibold text-[#2f3744]">
                  Integrasi Sistem</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in paginatedObjekRows" :key="row.id" class="border-t border-[#e8edf3]">
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[0.95rem] text-[#2f3744]">
                  {{ objekShowingFrom + index }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] font-semibold text-[#3b3f46]">
                  {{ row.name }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                  {{ row.description }}
                </td>
                <td class="border-b border-[#e8edf3] px-4 py-4 text-[1rem] text-[#3f4551]">
                  {{ row.integrasiSistem }}
                </td>
              </tr>

              <tr v-if="paginatedObjekRows.length === 0">
                <td colspan="4" class="px-4 py-8 text-center text-[1rem] text-[#7a8392]">
                  Data objek evaluasi tidak ditemukan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="mt-4 flex flex-col gap-3 border-t border-[#e3e7ee] pt-4 md:flex-row md:items-center md:justify-between">
          <p class="text-[clamp(1rem,1.1vw,1.2rem)] text-[#5d6778]">
            Menampilkan <strong>{{ objekShowingFrom }}-{{ objekShowingTo }}</strong> dari <strong>{{
              filteredObjekRows.length }}</strong> data
          </p>

          <div class="flex items-center gap-2">
            <button type="button"
              class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="objekCurrentPage === 1" @click="objekCurrentPage = Math.max(1, objekCurrentPage - 1)">
              Previous
            </button>

            <button type="button"
              class="rounded-[14px] bg-[#e30000] px-5 py-2 text-[0.875rem] font-semibold text-white">
              {{ objekCurrentPage }}
            </button>

            <button type="button"
              class="rounded-[14px] border border-[#d8dde5] px-5 py-2 text-[0.875rem] text-[#9ca5b4] transition hover:bg-[#f8f9fb] disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="objekCurrentPage === objekTotalPages"
              @click="objekCurrentPage = Math.min(objekTotalPages, objekCurrentPage + 1)">
              Next
            </button>
          </div>
        </div>
      </div>
    </article>
  </section>
</template>
