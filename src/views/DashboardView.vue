<template>
  <div v-if="!page.loading">
    <PageContainer title="Dashboard" subtitle="">
      <div class="mt-4">
        <div class="flex">
          <button
            v-for="frequency in frequencies"
            :key="frequency"
            :class="['px-2 md:px-4 py-2 rounded-md']"
            @click="selectFrequency(frequency.value)"
          >
            <span
              :class="[
                selectedFrequency === frequency.value
                  ? 'text-primary-300'
                  : 'text-primary-700',
              ]"
            >
              {{ frequency.label }}
            </span>
            <span v-if="frequency.value !== 'Yearly'" class="ps-2 md:ps-8"
              >|</span
            >
          </button>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="flex space-x-2 mt-2">
        <StatsCard :value="selectedRevenue" label="Total Pendapatan">
          <!-- SVG Icon -->
        </StatsCard>
        <StatsCard :value="selectedOrders" label="Total Pesanan">
          <!-- SVG Icon -->
        </StatsCard>
      </div>

      <!-- Charts -->
      <div class="flex space-2 flex-col md:flex-row mt-8">
        <div class="w-full">
          <LineChart
            ref="lineRef"
            :chart-data="lineChartData"
            :options="lineChartOptions"
          />
        </div>
        <div class="w-full">
          <DoughnutChart
            ref="doughnutRef"
            :chart-data="doughnutChartData"
            :options="doughnutChartOptions"
          />
        </div>
      </div>
    </PageContainer>
  </div>
  <div v-else>
    <DefaultSkeleton class="mb-2" />
    <DefaultSkeleton class="mb-2" />
    <DefaultSkeleton class="mb-2" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { DoughnutChart, LineChart } from "vue-chart-3";
import { axios } from "@/sdk/axios";
import StatsCard from "@/components/Dashboard/StatsCard.vue";
import PageContainer from "@/views/PageContainer.vue";
import useAuth from "@/stores/useAuth";
import {
  Chart,
  DoughnutController,
  ArcElement,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
} from "chart.js";
import { useRoute } from "vue-router";
import DefaultSkeleton from "@/components/Skeleton/DefaultSkeleton.vue";
import usePage from "@/stores/usePage";

Chart.register(
  DoughnutController,
  ArcElement,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title
);

const auth = useAuth();
const page = usePage();
const route = useRoute();
const frequencies = ref([
  { label: "Harian", value: "Daily" },
  { label: "Mingguan", value: "Weekly" },
  { label: "Bulanan", value: "Monthly" },
  { label: "Tahunan", value: "Yearly" },
]);

const selectedFrequency = ref("Daily");

const doughnutRef = ref();
const lineRef = ref();

const dashboardData = ref({
  summary: {
    revenue: {
      daily: null,
      weekly: null,
      monthly: null,
      yearly: null,
    },
    orders: {
      daily: null,
      weekly: null,
      monthly: null,
      yearly: null,
    },
  },
  chart: {
    orders: {
      data: [],
    },
    revenue: {
      daily: { data: [] },
      weekly: { data: [] },
      monthly: { data: [] },
      yearly: { data: [] },
    },
  },
});

const selectedRevenue = computed(() => {
  const revenue =
    dashboardData.value?.summary?.revenue?.[
      selectedFrequency.value.toLowerCase()
    ];
  return revenue || "Rp0";
});

const selectedOrders = computed(() => {
  const orders =
    dashboardData.value?.summary?.orders?.[
      selectedFrequency.value.toLowerCase()
    ];
  return orders || 0;
});

const lineChartData = ref({
  labels: [],
  datasets: [
    {
      label: "Keuntungan",
      backgroundColor: "rgba(153, 102, 255, 0.2)",
      borderColor: "rgba(153, 102, 255, 1)",
      data: [],
    },
  ],
});

const lineChartOptions = ref({
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: {
      display: true,
      text: "Keuntungan dari Waktu ke Waktu",
    },
  },
  scales: {
    x: { title: { display: true, text: "Tanggal" } },
    y: { beginAtZero: true },
  },
});

const doughnutChartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Pesan Berdasarkan Kategori",
      font: {
        size: 16,
      },
    },
  },
});

const doughnutChartData = ref({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: ["#77CEFF", "#0079AF", "#123E6B", "#97B0C4", "#A5C8ED"],
    },
  ],
});

onMounted(() => {
  page.loading = true;

  showData("Daily");
});

const showData = (frequency) => {
  axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/dashboard?duration=${frequency}&shop_id=${auth.shopId}`,
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
    )
    .then(({ data }) => {
      dashboardData.value = data.data;

      updateLineChart();
      updateDoughnutChart();
    });
};

const updateLineChart = () => {
  const selectedRevenueData =
    dashboardData.value?.chart?.revenue?.[selectedFrequency.value.toLowerCase()]
      ?.data || [];

  lineChartData.value.labels = selectedRevenueData.map((item) => item.date);
  lineChartData.value.datasets[0].data = selectedRevenueData.map(
    (item) => item.total_revenue
  );
};

const updateDoughnutChart = () => {
  const orderData = dashboardData.value?.chart?.orders?.data || [];

  doughnutChartData.value.labels = orderData.map((item) => item.name);
  doughnutChartData.value.datasets[0].data = orderData.map(
    (item) => item.transactions
  );
};

const selectFrequency = (frequency) => {
  selectedFrequency.value = frequency;
  showData(frequency);
};

watch([doughnutRef, lineRef], () => {
  if (doughnutRef.value) {
    doughnutRef.value.update();
  }
  if (lineRef.value) {
    lineRef.value.update();
  }
});
</script>
