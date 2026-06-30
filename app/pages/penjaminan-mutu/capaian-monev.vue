<template>
  <div class="min-h-screen bg-gray-50 font-sans">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-[#e30613] to-[#b1040f] py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center shadow-inner">
      <p class="text-sm font-bold text-red-200 tracking-widest uppercase mb-2">
        MONITORING & EVALUASI
      </p>
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
        Capaian Monev UMC
      </h1>
      <p class="text-red-100 max-w-2xl text-sm md:text-base opacity-90">
        Ringkasan hasil monitoring dan evaluasi per periode, modul, unit, dan FM — dapat diakses publik
      </p>
      <div class="w-12 h-1 bg-white/40 mt-6 rounded-full"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filter Periode -->
      <div class="flex items-center flex-wrap gap-3 mb-8 pb-6 border-b border-gray-200">
        <span class="text-sm font-medium text-gray-600 mr-2">Periode:</span>
        <button
          v-for="period in periods"
          :key="period"
          @click="activePeriod = period"
          :class="[
            'px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
            activePeriod === period
              ? 'bg-red-50 text-[#e30613] border-[#e30613]'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          ]"
        >
          {{ period }}
        </button>
      </div>

      <!-- Ringkasan Statistik -->
      <div class="mb-4">
        <h2 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">RINGKASAN STATISTIK</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Card 1 -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
            <div class="text-3xl font-bold text-gray-900 mb-1">87%</div>
            <div class="text-xs text-gray-500 mb-2">Rata-rata capaian</div>
            <div class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
              <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              3.2%
            </div>
          </div>
          <!-- Card 2 -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
            <div class="text-3xl font-bold text-gray-900 mb-1">24</div>
            <div class="text-xs text-gray-500">Total unit dinilai</div>
          </div>
          <!-- Card 3 -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
            <div class="text-3xl font-bold text-gray-900 mb-1">7</div>
            <div class="text-xs text-gray-500">FM dimonitoring</div>
          </div>
          <!-- Card 4 -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
            <div class="text-3xl font-bold text-gray-900 mb-1">6</div>
            <div class="text-xs text-gray-500">Modul aktif</div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Line Chart -->
        <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-base font-bold text-gray-900">Tren capaian per periode</h3>
            <div class="flex bg-gray-100 rounded-full p-1">
              <button class="px-3 py-1 rounded-full text-xs font-medium bg-white shadow-sm text-[#e30613] border border-red-100">Modul</button>
              <button class="px-3 py-1 rounded-full text-xs font-medium text-gray-500 hover:text-gray-700">Unit</button>
              <button class="px-3 py-1 rounded-full text-xs font-medium text-gray-500 hover:text-gray-700">FM</button>
            </div>
          </div>
          <div class="h-64 relative w-full">
            <canvas id="trendChart"></canvas>
          </div>
        </div>
        
        <!-- Doughnut Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-base font-bold text-gray-900 mb-6">Distribusi capaian</h3>
          <div class="h-64 relative w-full flex items-center justify-center">
            <canvas id="distributionChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Lists Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- List Unit -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h3 class="text-base font-bold text-gray-900 mb-4">Capaian per Unit</h3>
          <div class="space-y-0 flex-1">
            <div v-for="(unit, index) in unitCapaian" :key="index" class="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
              <span class="text-sm font-medium text-gray-700">{{ unit.name }}</span>
              <span :class="[
                'text-xs font-bold px-2 py-1 rounded',
                unit.score >= 85 ? 'bg-green-50 text-green-700' :
                unit.score >= 75 ? 'bg-yellow-50 text-yellow-700' :
                'bg-red-50 text-red-700'
              ]">{{ unit.score }}%</span>
            </div>
          </div>
          <div class="mt-4 pt-4 flex justify-center border-t border-gray-50">
            <button class="text-sm font-medium text-[#e30613] hover:text-red-700 inline-flex items-center">
              Lihat semua unit
              <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

        <!-- List FM -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h3 class="text-base font-bold text-gray-900 mb-4">Capaian per FM (FM1-FM7)</h3>
          <div class="space-y-0 flex-1">
            <div v-for="(fm, index) in fmCapaian" :key="index" class="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
              <span class="text-sm font-medium text-gray-700">{{ fm.name }}</span>
              <span :class="[
                'text-xs font-bold px-2 py-1 rounded',
                fm.score >= 85 ? 'bg-green-50 text-green-700' :
                fm.score >= 75 ? 'bg-yellow-50 text-yellow-700' :
                'bg-red-50 text-red-700'
              ]">{{ fm.score }}%</span>
            </div>
          </div>
          <div class="mt-4 pt-4 flex justify-center border-t border-gray-50">
            <button class="text-sm font-medium text-[#e30613] hover:text-red-700 inline-flex items-center">
              FM 5 - FM 7
              <svg class="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

useHead({
  title: 'Capaian Monev - LPM UMC',
})

const periods = ['Semua Periode', '2023/2024', '2024/2025', '2025/2026']
const activePeriod = ref('Semua Periode')

const unitCapaian = ref([
  { name: 'Fakultas Teknik', score: 92 },
  { name: 'Fakultas Ekonomi', score: 88 },
  { name: 'Fakultas Hukum', score: 71 },
  { name: 'Fakultas Kesehatan', score: 85 },
])

const fmCapaian = ref([
  { name: 'FM 1 — Tata Pamong', score: 95 },
  { name: 'FM 2 — Mahasiswa', score: 89 },
  { name: 'FM 3 — SDM', score: 68 },
  { name: 'FM 4 — Keuangan', score: 80 },
])

let trendChartInstance: Chart | null = null
let distributionChartInstance: Chart | null = null

onMounted(() => {
  initTrendChart()
  initDistributionChart()
})

onUnmounted(() => {
  if (trendChartInstance) trendChartInstance.destroy()
  if (distributionChartInstance) distributionChartInstance.destroy()
})

const initTrendChart = () => {
  const canvas = document.getElementById('trendChart') as HTMLCanvasElement
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 300)
  gradient.addColorStop(0, 'rgba(227, 6, 19, 0.2)')
  gradient.addColorStop(1, 'rgba(227, 6, 19, 0)')

  trendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
      datasets: [{
        label: 'Rata-rata Capaian',
        data: [72, 75, 78, 82, 85, 87],
        borderColor: '#e30613',
        backgroundColor: gradient,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#e30613',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1f2937',
          padding: 10,
          titleFont: { size: 13 },
          bodyFont: { size: 13 },
          displayColors: false,
          callbacks: {
            label: (context) => `${context.parsed.y}%`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 60,
          max: 100,
          grid: {
            color: '#f3f4f6',
          },
          border: { display: false },
          ticks: {
            color: '#9ca3af',
            font: { size: 11 },
            callback: (value) => `${value}%`
          }
        },
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            color: '#9ca3af',
            font: { size: 11 }
          }
        }
      }
    }
  })
}

const initDistributionChart = () => {
  const canvas = document.getElementById('distributionChart') as HTMLCanvasElement
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  distributionChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Sangat Baik (≥85%)', 'Baik (75-84%)', 'Kurang (<75%)'],
      datasets: [{
        data: [65, 25, 10],
        backgroundColor: [
          '#10b981', // green
          '#f59e0b', // yellow
          '#ef4444'  // red
        ],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 20,
            color: '#4b5563',
            font: { size: 12 }
          }
        },
        tooltip: {
          backgroundColor: '#1f2937',
          padding: 10,
          callbacks: {
            label: (context) => ` ${context.label}: ${context.parsed}%`
          }
        }
      }
    }
  })
}
</script>

<style scoped>
/* You can add custom styles here if needed */
</style>
