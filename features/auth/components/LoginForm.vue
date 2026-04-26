<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '#stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)

const hasCallbackError = computed(() => {
	const error = route.query.error
	if (Array.isArray(error)) {
		return error.includes('auth_failed')
	}

	return error === 'auth_failed'
})

async function handleLogin() {
	if (isSubmitting.value) {
		return
	}

	submitError.value = null
	isSubmitting.value = true

	try {
		await authStore.login()
	} catch {
		submitError.value = 'Gagal memulai proses login. Coba lagi beberapa saat lagi.'
		isSubmitting.value = false
	}
}
</script>

<template>
	<section class="w-full max-w-130 rounded-[18px] border border-[#e4e5e7] bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.08)] sm:p-8">
		<p class="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#e1121b]">
			SI IMUT
		</p>

		<h1 class="mt-2 text-[24px] font-semibold leading-tight text-[#1f2937] sm:text-[28px]">
			Login Dashboard
		</h1>

		<p class="mt-2 text-[14px] leading-[1.6] text-[#64748b]">
			Masuk menggunakan akun Google kampus untuk melanjutkan ke dashboard mutu.
		</p>

		<p
			v-if="hasCallbackError"
			class="mt-4 rounded-[10px] border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-[13px] text-[#b91c1c]"
		>
			Proses login sebelumnya gagal. Silakan coba login kembali.
		</p>

		<p
			v-if="submitError"
			class="mt-4 rounded-[10px] border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-[13px] text-[#b91c1c]"
		>
			{{ submitError }}
		</p>

		<button
			type="button"
			class="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-[#e1121b] px-4 text-[14px] font-semibold text-white transition hover:bg-[#cc0f17] disabled:cursor-not-allowed disabled:opacity-70"
			:disabled="isSubmitting"
			@click="handleLogin"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M21.35 11.1H12v2.99h5.35c-.23 1.47-1.72 4.32-5.35 4.32a5.96 5.96 0 0 1 0-11.92c2.07 0 3.45.88 4.24 1.65l2.9-2.79C17.28 3.62 14.9 2.5 12 2.5a9.5 9.5 0 0 0 0 19c5.48 0 9.11-3.85 9.11-9.28 0-.63-.07-1.11-.16-1.62Z" />
			</svg>
			<span>{{ isSubmitting ? 'Memproses...' : 'Masuk dengan Google' }}</span>
		</button>

		<NuxtLink
			to="/"
			class="mt-4 inline-flex text-[13px] font-medium text-[#475569] underline-offset-2 transition hover:text-[#1f2937] hover:underline"
		>
			Kembali ke beranda
		</NuxtLink>
	</section>
</template>
