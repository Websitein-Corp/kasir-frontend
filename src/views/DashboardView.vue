<template>
  <div class="dashboard ms-4 mt-8">
    <h1 class="text-xl md:text-2xl font-bold">Dashboard</h1>
    <div class="mt-4">
      <div class="flex">
        <button
          v-for="frequency in frequencies"
          :key="frequency"
          :class="['px-4 py-2 rounded-md']"
          @click="selectFrequency(frequency)"
        >
          <span
            :class="[
              selectedFrequency === frequency
                ? 'text-primary-300'
                : 'text-primary-700',
            ]"
            >{{ frequency }}</span
          >
          <span v-if="frequency != 'Tahunan'" class="ps-8">|</span>
        </button>
      </div>
    </div>
    <div class="flex space-x-2 mt-2">
      <StatsCard value="Rp5.000.000" label="Total Pendapatan">
        <template #icon>
          <svg
            width="24"
            height="20"
            viewBox="0 0 24 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_270_7331)">
              <path
                d="M10 1V19.3333"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.1667 4H7.91667C7.14312 4 6.40125 4.30729 5.85427 4.85427C5.30729 5.40125 5 6.14312 5 6.91667C5 7.69022 5.30729 8.43208 5.85427 8.97906C6.40125 9.52604 7.14312 9.83333 7.91667 9.83333H12.0833C12.8569 9.83333 13.5987 10.1406 14.1457 10.6876C14.6927 11.2346 15 11.9765 15 12.75C15 13.5235 14.6927 14.2654 14.1457 14.8124C13.5987 15.3594 12.8569 15.6667 12.0833 15.6667H5"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_270_7331">
                <rect width="24" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </template>
      </StatsCard>
      <StatsCard value="1234" label="Total Pesanan">
        <template #icon>
          <svg
            width="24"
            height="20"
            viewBox="0 0 24 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_270_7322)">
              <g clip-path="url(#clip1_270_7322)">
                <path
                  d="M8.16797 8.30676H16.293"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.16797 10.8068H16.293"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.73047 16.4318V4.55676C4.73047 4.391 4.79632 4.23203 4.91353 4.11482C5.03074 3.99761 5.18971 3.93176 5.35547 3.93176H19.1055C19.2712 3.93176 19.4302 3.99761 19.5474 4.11482C19.6646 4.23203 19.7305 4.391 19.7305 4.55676V16.4318L17.2305 15.1818L14.7305 16.4318L12.2305 15.1818L9.73047 16.4318L7.23047 15.1818L4.73047 16.4318Z"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </g>
            <defs>
              <clipPath id="clip0_270_7322">
                <rect width="24" height="20" fill="white" />
              </clipPath>
              <clipPath id="clip1_270_7322">
                <rect
                  width="20"
                  height="20"
                  fill="white"
                  transform="translate(2.23047 0.181763)"
                />
              </clipPath>
            </defs>
          </svg>
        </template>
      </StatsCard>
      <StatsCard value="2222" label="Total Pengunjung">
        <template #icon>
          <svg
            width="24"
            height="20"
            viewBox="0 0 24 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_270_11306)">
              <g clip-path="url(#clip1_270_11306)">
                <path
                  d="M16.3968 17.6818V16.0151C16.3968 15.131 16.0456 14.2832 15.4205 13.6581C14.7954 13.033 13.9475 12.6818 13.0635 12.6818H6.39681C5.51275 12.6818 4.66491 13.033 4.03979 13.6581C3.41467 14.2832 3.06348 15.131 3.06348 16.0151V17.6818"
                  stroke="white"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.73079 9.34843C11.5717 9.34843 13.0641 7.85605 13.0641 6.0151C13.0641 4.17415 11.5717 2.68176 9.73079 2.68176C7.88985 2.68176 6.39746 4.17415 6.39746 6.0151C6.39746 7.85605 7.88985 9.34843 9.73079 9.34843Z"
                  stroke="white"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M21.3975 17.6817V16.015C21.3969 15.2765 21.1511 14.559 20.6986 13.9753C20.2461 13.3916 19.6126 12.9747 18.8975 12.79"
                  stroke="white"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15.5635 2.79004C16.2805 2.97362 16.916 3.39062 17.3698 3.9753C17.8237 4.55997 18.07 5.27906 18.07 6.01921C18.07 6.75935 17.8237 7.47844 17.3698 8.06311C16.916 8.64779 16.2805 9.06479 15.5635 9.24837"
                  stroke="white"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
            </g>
            <defs>
              <clipPath id="clip0_270_11306">
                <rect width="24" height="20" fill="white" />
              </clipPath>
              <clipPath id="clip1_270_11306">
                <rect
                  width="20"
                  height="20"
                  fill="white"
                  transform="translate(2.23047 0.181763)"
                />
              </clipPath>
            </defs>
          </svg>
        </template>
      </StatsCard>
    </div>
    <div class="flex space-x-2 mt-8">
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
          :chart-data="doughnutChart"
          :options="doughbutChartOptions"
        />
      </div>
    </div>
    <DashboardCard
      pageTitle="Order History"
      pageSubTitle="Orders that have been done recently"
      class="mt-8"
    >
      <DashboardTable
        :pageLength="10"
        :need-pagination="false"
        v-model:activePage="currentPage"
      >
        <template v-slot:thead>
          <tr>
            <th>Order Number</th>
            <th>Type</th>
            <th>Revenue</th>
          </tr>
        </template>
        <template v-slot:tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>{{ item.orderNumber }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.revenue }}</td>
          </tr>
        </template>
      </DashboardTable>
    </DashboardCard>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { DoughnutChart, LineChart } from "vue-chart-3";
import StatsCard from "@/components/Dashboard/StatsCard.vue";
import DashboardCard from "@/components/Card/DashboardCard.vue";
import DashboardTable from "@/components/Table/DashboardTable.vue";

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

const frequencies = ref(["Harian", "Mingguan", "Bulanan", "Tahunan"]);
const selectedFrequency = ref("Harian");

const data = ref([30, 40, 60, 70, 5]);
const doughnutRef = ref();
const lineRef = ref();

const items = Array(10).fill({
  orderNumber: "12345789",
  type: "Food",
  revenue: "Rp. 30.000",
});

const doughbutChartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Doughnut Chart",
      font: {
        size: 16,
      },
    },
  },
});

const doughnutChart = computed(() => ({
  labels: ["Paris", "Nîmes", "Toulon", "Perpignan", "Autre"],
  datasets: [
    {
      data: data.value,
      backgroundColor: ["#77CEFF", "#0079AF", "#123E6B", "#97B0C4", "#A5C8ED"],
    },
  ],
}));

const lineChartData = ref({
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Orders Over Time",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: true,
    },
    {
      label: "Revenue Over Time",
      backgroundColor: "rgba(153, 102, 255, 0.2)",
      borderColor: "rgba(153, 102, 255, 1)",
      data: [80, 70, 90, 100, 60, 50, 75],
      fill: true,
    },
  ],
});
const lineChartOptions = ref({
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: {
      display: true,
      text: "Orders and Revenue Over Time",
      font: {
        size: 16,
      },
    },
  },
  scales: {
    x: {
      title: { display: true, text: "Months" },
    },
    y: {
      title: { display: true, text: "Values" },
      beginAtZero: true,
    },
  },
});

const selectFrequency = (frequency) => {
  selectedFrequency.value = frequency;
};

watch(data, () => {
  if (doughnutRef.value) {
    doughnutRef.value.update();
  }
  if (lineRef.value) {
    lineRef.value.update();
  }
});
</script>
