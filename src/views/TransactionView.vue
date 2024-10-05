<template>
  <PageContainer title="Transactions" subtitle="Daftar transaksi yang masuk...">
    <DashboardTable>
      <template v-slot:action-2>
        <SearchInput v-model="table.filters.keyword"></SearchInput>
      </template>
      <template v-slot:action-3>
        <div>
          <DatetimeInput v-model="table.filters.date" range></DatetimeInput>
        </div>
      </template>
      <template v-slot:thead>
        <tr>
          <th>Invoice Number</th>
          <th>Datetime</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </template>
      <template v-slot:tbody>
        <tr v-for="(item, index) in table.items" :key="index">
          <td>{{ item.invoiceNumber }}</td>
          <td>{{ item.trDatetime }}</td>
          <td>{{ item.totalPrice }}</td>
          <td>{{ item.status }}</td>
        </tr>
      </template>
    </DashboardTable>
  </PageContainer>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

import DashboardTable from "@/components/Table/DashboardTable.vue";
import PageContainer from "@/views/PageContainer.vue";
import DatetimeInput from "@/components/Input/DatetimeInput.vue";
import SearchInput from "@/components/Input/SearchInput.vue";
import axios from "axios";
import useTable from "@/stores/useTable";

const table = useTable();

let debounce;

const doSearch = (event) => {
  console.log(event.target.value);
};

onMounted(async () => {
  await fetchTransactions();
});

watch(table.filters, () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => fetchTransactions(), 500);
});

const fetchTransactions = async () => {
  const response = await axios.get(
    `${process.env.VUE_APP_API_BASE_URL}/api/transactions?shop_id=76L1&date_start=${table.filters.date[0]}&date_end=${table.filters.date[1]}&keyword=`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      withCredentials: true,
    }
  );

  table.items = response.data.data.map((item) => {
    return {
      invoiceNumber: item["invoice_number"],
      trDatetime: item["tr_datetime"],
      totalPrice: item["total_price"],
      status: item["status"],
    };
  });
};
</script>
