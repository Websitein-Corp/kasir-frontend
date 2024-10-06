<template>
  <PageContainer
    title="Recon"
    subtitle="Daftar stock barang pada akhir hari..."
  >
    <DashboardTable>
      <template v-slot:action-2>
        <SearchInput v-model="table.filters.keyword"></SearchInput>
      </template>
      <template v-slot:thead>
        <tr>
          <th>Name</th>
          <th>Stock</th>
          <th>Unit</th>
          <th>Action</th>
        </tr>
      </template>
      <template v-slot:tbody>
        <tr v-for="(item, index) in table.items" :key="index">
          <td>{{ item.name }}</td>
          <td>
            <input
              type="text"
              v-model="item.stock"
              @input="handleStockChange(item, index)"
              class="border border-primary-600 rounded-md p-1"
            />
          </td>
          <td>{{ item.unit }}</td>
          <td>
            <CustomButton
              size="full"
              height="lg"
              iconSide="right"
              label="SAVE"
              align="center"
              :icon="mdi - content - save"
              @click="saveStock(item, index)"
            />
          </td>
        </tr>
      </template>
    </DashboardTable>
  </PageContainer>
</template>

<script setup>
import { onMounted, ref, watch, reactive } from "vue";

import DashboardTable from "@/components/Table/DashboardTable.vue";
import PageContainer from "@/views/PageContainer.vue";
import SearchInput from "@/components/Input/SearchInput.vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import axios from "axios";
import useTable from "@/stores/useTable";
import useToast from "@/stores/useToast";

const table = reactive(useTable());
const toast = useToast();

let debounce;

const doSearch = (event) => {
  console.log(event.target.value);
};

onMounted(async () => {
  await fetchRecon();
});

watch(table.filters, () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => fetchRecon(), 500);
});

const fetchRecon = async () => {
  const data = {
    items: [
      {
        name: "Roti Tawar",
        stock: "111",
        unit: "Pack",
      },
      {
        name: "Beras",
        stock: "321",
        unit: "Kg",
      },
    ],
    filters: {
      keyword: "",
      date: [
        new Date().toISOString().slice(0, 10),
        new Date().toISOString().slice(0, 10),
      ],
    },
    page: {
      current: 1,
      last: 1,
      per: 10,
      total: 0,
      links: [],
    },
  };
  table.items = data.items;
};

const handleStockChange = (item, index) => {
  console.log(`Stock for item ${item.name} changed to: ${item.stock}`);
};

const saveStock = async (item, index) => {
  try {
    const response = await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}/api/ingredients/recon`,
      {
        id: item.name.toLowerCase(),
        end_stock: item.stock,
        shop_id: "76L1",
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        withCredentials: true,
      }
    );
    toast.message = "Sukses";
    toast.description = "Berhasil Update Stock!";
    toast.type = "SUCCESS";
    toast.trigger();
    console.log("Stock updated successfully:", response.data);
  } catch (error) {
    console.error("Error updating stock:", error);
    toast.message = "Gagal";
    toast.description = error.response.data.message;
    toast.type = "FAILED";
    toast.trigger();
  }
};
</script>
