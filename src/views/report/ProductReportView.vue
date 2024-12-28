<template>
  <div v-if="!page.loading">
    <PageContainer
      title="Laporan Riwayat Produk"
      subtitle="Daftar Pergerakan Stok Produk"
    >
      <DataTable :column-count="4">
        <template v-slot:action-2>
          <DatetimeInput
            v-model="table.filters.date"
            :max-date="new Date().toISOString()"
            range
          ></DatetimeInput>
          <SearchInput v-model="table.filters.keyword"></SearchInput>
          <CustomButton
            size="mobile"
            label="Download"
            :icon="Download"
            class="bg-primary-700 hover:bg-primary-800"
            @click="handleDownload"
          />
        </template>
        <template v-slot:thead>
          <tr>
            <th>Name</th>
            <th>Jumlah</th>
            <th>Stok Terakhir</th>
            <th>Tipe</th>
            <th>Kategori</th>
            <th>Tanggal Dibuat</th>
          </tr>
        </template>
        <template v-slot:tbody>
          <tr v-for="(item, index) in table.items" :key="index">
            <td>{{ item.name }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.lastStock }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.createdAt }}</td>
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
import { onMounted, ref, watch } from "vue";

import DataTable from "@/components/Table/DataTable.vue";
import DatetimeInput from "@/components/Input/DatetimeInput.vue";
import PageContainer from "@/views/PageContainer.vue";
import SearchInput from "@/components/Input/SearchInput.vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import { axios } from "@/sdk/axios";
import useTable from "@/stores/useTable";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import DefaultSkeleton from "@/components/Skeleton/DefaultSkeleton.vue";
import { useRoute } from "vue-router";
import usePage from "@/stores/usePage";
import { Download } from "lucide-vue-next";

const auth = useAuth();
const table = useTable();
const toast = useToast();
const page = usePage();
const route = useRoute();

let debounce;

onMounted(async () => {
  table.resetPage();

  await processData();
});

watch(table.filters, () => {
  table.page.current = 1;

  if (debounce) {
    clearTimeout(debounce);
  }

  debounce = setTimeout(() => processData(), 500);
});

watch(
  () => table.page.current,
  async () => {
    await processData();
  }
);

const processData = async () => {
  if (table.filters.date.start && table.filters.date.end) {
    const { data } = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/products/history?shop_id=${auth.shopId}&date_start=${table.filters.date.start}&date_end=${table.filters.date.end}&keyword=${table.filters.keyword}&page=${table.page.current}&download=0`,
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
    );

    table.items = data.data.map((item) => {
      return {
        name: item.name,
        amount: item.amount,
        lastStock: item.last_stock,
        type: item.type.toLowerCase(),
        category: item.category ? item.category.name : "",
        createdAt: item.created_at,
      };
    });

    if (data.meta) {
      table.page.current = data.meta.current_page || 1;
      table.page.last = data.meta.last_page || 1;
      table.page.per = data.meta.per_page || 10;
      table.page.total = data.meta.total || table.items.length;
    }
  }
};

const handleDownload = async () => {
  await axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/products/history?shop_id=${auth.shopId}&date_start=${table.filters.date.start}&date_end=${table.filters.date.end}&keyword=${table.filters.keyword}&page=${table.page.current}&download=1`,
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
        "product_report_" +
        table.filters.date.start +
        "_" +
        table.filters.date.end;

      link.href = href;
      link.setAttribute("download", `${fileName}.xlsx`);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
};
</script>
