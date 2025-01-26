<template>
  <div v-if="!page.loading">
    <PageContainer
      title="Pergerakkan Saldo"
      subtitle="Daftar pergerakkan saldo..."
    >
      <DataTable :column-count="4">
        <template v-slot:action-2>
          <div
            class="flex flex-col lg:flex-row space-y-4 lg:space-y-0 md:space-x-2 lg:w-96"
          >
            <DatetimeInput
              v-model="table.filters.date"
              :max-date="new Date().toISOString()"
              no-clear-button
              only-date
              range
            ></DatetimeInput>
          </div>
        </template>
        <template v-slot:action-3>
          <div class="flex flex-col lg:flex-row gap-2">
            <CustomButton
              size="mobile"
              label="Export Pergerakkan Saldo"
              :icon="Download"
              class="bg-primary-700 hover:bg-primary-800"
              text-size="sm"
              :loading="page.buttonLoading"
              @click="exportCashFlow"
            />
          </div>
        </template>
        <template v-slot:thead>
          <tr>
            <th>Tanggal Pergerakkan</th>
            <th>Deskripsi</th>
            <th>Debit</th>
            <th>Kredit</th>
          </tr>
        </template>
        <template v-slot:tbody>
          <tr
            v-for="(item, index) in table.items"
            :key="index"
            class="border-b-[1px] border-white"
          >
            <td class="!py-4">{{ item.tr_datetime || "-" }}</td>
            <td class="!py-4">{{ item.name || "-" }}</td>
            <td class="!py-4">{{ $helpers.money(item.debit) || "-" }}</td>
            <td class="!py-4">{{ $helpers.money(item.kredit) || "-" }}</td>
          </tr>
        </template>
      </DataTable>
    </PageContainer>
  </div>
  <div v-else>
    <DefaultSkeleton class="mb-2" />
    <DefaultSkeleton class="mb-2" />
    <DefaultSkeleton class="mb-2" />
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue";

import DataTable from "@/components/Table/DataTable.vue";
import PageContainer from "@/views/PageContainer.vue";
import DatetimeInput from "@/components/Input/DatetimeInput.vue";
import { axios } from "@/sdk/axios";
import useTable from "@/stores/useTable";
import CustomButton from "@/components/Button/CustomButton.vue";
import useAuth from "@/stores/useAuth";
import DefaultSkeleton from "@/components/Skeleton/DefaultSkeleton.vue";
import { useRoute } from "vue-router";
import usePage from "@/stores/usePage";
import {
  Download,
  CircleEllipsis,
  CircleX,
  CircleCheck,
  CircleAlert,
} from "lucide-vue-next";
import CustomAlert from "@/components/Alert/CustomAlert.vue";

const auth = useAuth();
const table = useTable();
const page = usePage();
const route = useRoute();

let debounce;

onMounted(async () => {
  page.loading = true;
  table.resetPage();

  fetchCashFlows();
});

watch(table.filters, () => {
  table.page.current = 1;

  if (debounce) {
    clearTimeout(debounce);
  }
  debounce = setTimeout(() => fetchCashFlows(), 500);
});

watch(
  () => table.page.current,
  () => {
    fetchCashFlows();
  }
);

const fetchCashFlows = () => {
  if (table.filters.date.start && table.filters.date.end) {
    axios
      .get(
        `${process.env.VUE_APP_API_BASE_URL}/api/transactions/cashflow?shop_id=${auth.shopId}&date_start=${table.filters.date.start}&date_end=${table.filters.date.end}&page=${table.page.current}`,
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
          withCredentials: true,
        }
      )
      .then(({ data }) => {
        table.items = data.data;

        table.page.current = data.meta.current_page;
        table.page.last = data.meta.last_page;
        table.page.per = data.meta.per_page;
        table.page.total = data.meta.total;
      });
  }
};

const exportCashFlow = async () => {
  page.buttonLoading = true;

  await axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/transactions/cashflow?shop_id=${auth.shopId}&date_start=${table.filters.date.start}&date_end=${table.filters.date.end}&keyword=${table.filters.keyword}&download=1`,
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        responseType: "blob",
        withCredentials: true,
      }
    )
    .then((response) => {
      const href = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      const fileName =
        "pergerakkan_saldo_" +
        new Date()
          .toISOString()
          .slice(0, 19)
          .replace(/[T\-:]/g, "_");

      link.href = href;
      link.setAttribute("download", `${fileName}.xlsx`);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
};
</script>
