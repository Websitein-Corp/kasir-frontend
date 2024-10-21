<template>
  <div v-if="auth.isAuthenticated">
    <PageContainer
      title="Recon"
      subtitle="Daftar stok barang pada akhir hari..."
    >
      <DataTable :column-count="4">
        <template v-slot:action-2>
          <SearchInput v-model="table.filters.keyword"></SearchInput>
        </template>
        <template v-slot:thead>
          <tr>
            <th>Name</th>
            <th>Stock</th>
            <th>Unit</th>
            <th>Actions</th>
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
            <td>{{ item.unitName }}</td>
            <td>
              <CustomButton
                size="full"
                height="lg"
                label="SAVE"
                align="center"
                @click="saveStock(item, index)"
                class="bg-primary-600"
              />
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
import { onMounted, ref, watch, reactive } from "vue";

import DashboardCard from "@/components/Card/DashboardCard.vue";
import DataTable from "@/components/Table/DataTable.vue";
import PageContainer from "@/views/PageContainer.vue";
import SearchInput from "@/components/Input/SearchInput.vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import axios from "axios";
import useTable from "@/stores/useTable";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import DefaultSkeleton from "@/components/Skeleton/DefaultSkeleton.vue";

const auth = useAuth();
const table = useTable();
const toast = useToast();

let debounce;

onMounted(async () => {
  table.resetPage();
  await fetchRecon();
});

watch(table.filters, () => {
  table.page.current = 1;

  if (debounce) {
    clearTimeout(debounce);
  }

  debounce = setTimeout(() => fetchRecon(), 500);
});

watch(
  () => table.page.current,
  async () => {
    await fetchRecon();
  }
);

const fetchRecon = async () => {
  const { data } = await axios.get(
    `${process.env.VUE_APP_API_BASE_URL}/api/ingredients?shop_id=${auth.shopId}&keyword=${table.filters.keyword}&page=${table.page.current}`,
    {
      headers: {
        Authorization: `Bearer ${auth.authToken}`,
      },
      withCredentials: true,
    }
  );

  table.items = data.data.map((item) => {
    return {
      id: item.id,
      name: item.name,
      stock: item.stock,
      unitName: item.unit_name,
    };
  });

  if (data.meta) {
    table.page.current = data.meta.current_page || 1;
    table.page.last = data.meta.last_page || 1;
    table.page.per = data.meta.per_page || 10;
    table.page.total = data.meta.total || table.items.length;
  }
};

const handleStockChange = (item, index) => {
  console.log(`Stock for item ${item.name} changed to: ${item.stock}`);
};

const saveStock = async (item, index) => {
  try {
    const response = await axios.put(
      `${process.env.VUE_APP_API_BASE_URL}/api/ingredients/recon`,
      {
        id: item.id,
        end_stock: item.stock,
        shop_id: auth.shopId,
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
