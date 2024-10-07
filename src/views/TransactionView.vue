<template>
  <PageContainer title="Transaksi" subtitle="Daftar transaksi masuk...">
    <DataTable>
      <template v-slot:action-2>
        <div class="flex space-x-2">
          <DatetimeInput v-model="table.filters.date" range></DatetimeInput>
          <SearchInput v-model="table.filters.keyword"></SearchInput>
        </div>
      </template>
      <template v-slot:action-3>
        <div>
          <CustomButton
            size="md"
            label="Export"
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
        </tr>
      </template>
      <template v-slot:tbody>
        <tr v-for="(item, index) in table.items" :key="index">
          <td>
            <button
              class="text-blue-600 hover:text-blue-800 underline"
              @click="showBill(item.invoiceNumber)"
            >
              {{ item.invoiceNumber || "-" }}
            </button>
          </td>
          <td>{{ item.trDatetime || "-" }}</td>
          <td>{{ item.paymentMethod || "-" }}</td>
          <td>{{ $helpers.money(item.totalPrice) || "-" }}</td>
        </tr>
      </template>
    </DataTable>
  </PageContainer>
</template>

<script setup>
import { onMounted, watch } from "vue";

import DataTable from "@/components/Table/DataTable.vue";
import PageContainer from "@/views/PageContainer.vue";
import DatetimeInput from "@/components/Input/DatetimeInput.vue";
import SearchInput from "@/components/Input/SearchInput.vue";
import axios from "axios";
import useTable from "@/stores/useTable";
import CustomButton from "@/components/Button/CustomButton.vue";
import router from "@/router";

const table = useTable();

let debounce;

onMounted(async () => {
  await fetchTransactions();
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

const fetchTransactions = async () => {
  const formattedDate = table.filters.date.map((rawDate) =>
    new Date(rawDate).toISOString().slice(0, 10)
  );

  const { data } = await axios.get(
    `${process.env.VUE_APP_API_BASE_URL}/api/transactions?shop_id=76L1&date_start=${formattedDate[0]}&date_end=${formattedDate[1]}&keyword=${table.filters.keyword}&page=${table.page.current}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      withCredentials: true,
    }
  );

  table.items = data.data.map((item) => {
    return {
      invoiceNumber: item.invoice_number,
      trDatetime: item.tr_datetime,
      paymentMethod: item.payment_method.name,
      totalPrice: item.total_price,
    };
  });

  table.page.current = data.meta.current_page;
  table.page.last = data.meta.last_page;
  table.page.per = data.meta.per_page;
  table.page.total = data.meta.total;
};

const exportTransactions = async () => {
  const response = await axios.get(
    `${process.env.VUE_APP_API_BASE_URL}/api/transactions?shop_id=76L1&date_start=${table.filters.date[0]}&date_end=${table.filters.date[1]}&keyword=`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      withCredentials: true,
    }
  );
};

const showBill = async (refId) => {
  await router.push({
    path: `/bill/${refId}`,
  });
};
</script>
