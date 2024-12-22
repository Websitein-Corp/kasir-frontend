<template>
  <div v-if="!page.loading">
    <PageContainer title="Transaksi" subtitle="Daftar transaksi masuk...">
      <CustomAlert type="info" title="Keterangan" class="mb-4">
        <div class="ml-3">
          <ul class="list-disc">
            <li>
              Warna
              <span class="font-helvetica text-green-600">Hijau</span>
              menandakan transaksi yang sukses
            </li>
            <li>
              Warna
              <span class="font-helvetica text-yellow-600">Kuning</span>
              menandakan transaksi yang sedang proses/pending
            </li>
            <li>
              Warna
              <span class="font-helvetica text-red-600">Merah</span> menandakan
              transaksi yang gagal
            </li>
            <li>
              Warna
              <span class="font-helvetica text-orange-600">Oranye</span>
              menandakan transaksi yang kedaluwarsa
            </li>
            <li>
              Warna
              <span class="font-helvetica text-purple-600">Ungu</span>
              menandakan transaksi yang di-refund
            </li>
          </ul>
        </div>
      </CustomAlert>
      <DataTable :column-count="4">
        <template v-slot:action-2>
          <div
            class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2"
          >
            <DatetimeInput
              v-model="table.filters.date"
              :max-date="new Date().toISOString()"
              no-clear-button
              only-date
              range
            ></DatetimeInput>
            <SearchInput
              v-model="table.filters.keyword"
              placeholder="Cari transaksi..."
            ></SearchInput>
          </div>
        </template>
        <template v-slot:action-3>
          <div>
            <CustomButton
              size="mobile"
              label="Export"
              :icon="Download"
              class="bg-primary-700 hover:bg-primary-800"
              @click="exportTransactions"
            />
          </div>
        </template>
        <template v-slot:thead>
          <tr>
            <th>Nomor Invoice</th>
            <th>Tanggal Transaksi</th>
            <th>Jenis Pembayaran</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </template>
        <template v-slot:tbody>
          <tr
            v-for="(item, index) in table.items"
            :key="index"
            class="border-b-[1px] border-white"
            :class="{
              'bg-green-100': item.status === 'SUCCESS',
              'bg-yellow-100': item.status === 'PENDING',
              'bg-red-100': item.status === 'FAILED',
              'bg-orange-200': item.status === 'EXPIRED',
              'bg-purple-100': item.status === 'REFUNDED',
            }"
          >
            <td class="!py-4">
              <button
                class="text-blue-600 hover:text-blue-800 underline"
                @click="showBill(item.invoice_number)"
              >
                {{ item.invoice_number || "-" }}
              </button>
            </td>
            <td class="!py-4">{{ item.tr_datetime || "-" }}</td>
            <td class="!py-4">
              {{ (item.payment_method && item.payment_method.name) || "-" }}
            </td>
            <td class="!py-4">
              {{ $helpers.money(item.total_price) || "-" }}
            </td>
            <td class="!py-4">
              <div class="flex justify-center items-center gap-2">
                <CircleEllipsis v-if="item.status === 'PENDING'" />
                <CircleCheck v-else-if="item.status === 'SUCCESS'" />
                <CircleX v-else-if="item.status === 'FAILED'" />
                <CircleX v-else-if="item.status === 'EXPIRED'" />
                <CircleAlert v-else-if="item.status === 'REFUNDED'" />
                <span class="mt-1">{{ item.status }}</span>
              </div>
            </td>
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
import SearchInput from "@/components/Input/SearchInput.vue";
import { axios } from "@/sdk/axios";
import useTable from "@/stores/useTable";
import CustomButton from "@/components/Button/CustomButton.vue";
import router from "@/router";
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

  fetchTransactions();
});

watch(table.filters, () => {
  table.page.current = 1;

  if (debounce) {
    clearTimeout(debounce);
  }
  debounce = setTimeout(() => fetchTransactions(), 500);
});

watch(
  () => table.page.current,
  () => {
    fetchTransactions();
  }
);

const fetchTransactions = () => {
  if (table.filters.date.start && table.filters.date.end) {
    axios
      .get(
        `${process.env.VUE_APP_API_BASE_URL}/api/transactions?shop_id=${auth.shopId}&date_start=${table.filters.date.start}&date_end=${table.filters.date.end}&keyword=${table.filters.keyword}&page=${table.page.current}`,
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

const exportTransactions = async () => {
  await axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/transactions?shop_id=${auth.shopId}&date_start=${table.filters.date.start}&date_end=${table.filters.date.end}&keyword=${table.filters.keyword}&download=1`,
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
        "transaction_" +
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

const showBill = async (refId) => {
  await router.push({
    path: `/bill/${refId}`,
  });
};
</script>
