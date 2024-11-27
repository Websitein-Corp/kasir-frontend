<template>
  <div v-if="!page.loading">
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
                class="border border-primary-600 rounded-md p-1"
              />
            </td>
            <td>{{ item.unitName }}</td>
            <td class="flex justify-center space-x-2">
              <CustomButton
                size="fit"
                :icon="Save"
                class="bg-primary-500 hover:bg-primary-600 text-primary-950"
                @click="saveStock(item)"
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
import { onMounted, watch } from "vue";

import DataTable from "@/components/Table/DataTable.vue";
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
import { Pencil, Save } from "lucide-vue-next";

const auth = useAuth();
const table = useTable();
const toast = useToast();
const page = usePage();
const route = useRoute();

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

const saveStock = async (item) => {
  axios
    .put(
      `${process.env.VUE_APP_API_BASE_URL}/api/ingredients/recon`,
      {
        id: String(item.id),
        end_stock: item.stock,
        shop_id: auth.shopId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        withCredentials: true,
      }
    )
    .then((response) => {
      if (response.data["error_type"]) {
        toast.message = "Gagal";
        toast.description = response.data.message;
        toast.type = "FAILED";
        toast.trigger();
      } else {
        toast.message = "Sukses";
        toast.description = response.data.message;
        toast.type = "SUCCESS";
        toast.trigger();
      }
    });
};
</script>
