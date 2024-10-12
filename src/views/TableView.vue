<template>
  <DashboardCard pageTitle="Product List" pageSubTitle="Set items to sell...">
    <DataTable :pageLength="10" v-model:activePage="currentPage">
      <template v-slot:action-2>
        <SearchInput @change="doSearch"></SearchInput>
      </template>
      <template v-slot:action-3>
        <div class="flex gap-5">
          <DashboardButton color="danger" @click="handleClickBtn"
            >Delete Items</DashboardButton
          >
          <DashboardButton @click="handleClickBtn">Add Item</DashboardButton>
        </div>
      </template>
      <template v-slot:thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Category</th>
          <th>Stock</th>
          <th>Price</th>
        </tr>
      </template>
      <template v-slot:tbody>
        <tr v-for="(item, index) in items" :key="index">
          <td>{{ item.name }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.stock }}</td>
          <td>{{ item.price }}</td>
        </tr>
      </template>
    </DataTable>
  </DashboardCard>
</template>

<script setup>
import { ref, watch } from "vue";

import DashboardCard from "@/components/Card/DashboardCard.vue";
import DataTable from "@/components/Table/DataTable.vue";
import DashboardButton from "@/components/Button/DashboardButton.vue";
import SearchInput from "@/components/Input/SearchInput.vue";

const items = Array(10).fill({
  name: "Burger Double Super",
  type: "Food",
  category: "Burger",
  stock: 110,
  price: "Rp. 30.000",
});

const count = ref(0);

const handleClickBtn = () => {
  count.value++;
  console.log(count.value);
};

const doSearch = (event) => {
  console.log(event.target.value);
};

const currentPage = ref(1);

watch(currentPage, (newPage) => {
  console.log("current page:", newPage);
});
</script>
