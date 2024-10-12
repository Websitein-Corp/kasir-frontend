<template>
  <div v-if="isShowingForm">
    <IngredientFormView
      :ingredient-data="selectedIngredient"
      :is-edit="!!selectedIngredient"
      @close-form="resetForm"
    />
  </div>
  <div v-else-if="auth.isAuthenticated">
    <PageContainer title="Bahan Baku" subtitle="Daftar bahan baku produk...">
      <DataTable>
        <template v-slot:action-2>
          <div class="flex space-x-2">
            <SearchInput v-model="table.filters.keyword"></SearchInput>
          </div>
        </template>
        <template v-slot:action-3>
          <div class="flex space-x-2">
            <CustomButton
              size="sm"
              label="Add"
              class="bg-primary-700 hover:bg-primary-800"
              @click="isShowingForm = true"
            />
          </div>
        </template>
        <template v-slot:thead>
          <tr>
            <th>Kode</th>
            <th>Nama</th>
          </tr>
        </template>
        <template v-slot:tbody>
          <tr v-for="(item, index) in table.items" :key="index">
            <td>{{ item.name || "-" }}</td>
            <td>{{ item.stock || "-" }}</td>
            <td>{{ item.unitName || "-" }}</td>
            <td>{{ $helpers.money(item.price) || "-" }}</td>
            <td class="flex justify-center space-x-2">
              <CustomButton
                size="fit"
                :icon="Trash2"
                class="bg-red-700 hover:bg-red-800"
                @click="deleteIngredient(item.id)"
              />
              <CustomButton
                size="fit"
                :icon="Pencil"
                class="bg-primary-200 hover:bg-primary-300 text-primary-950"
                @click="editIngredient(item)"
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
import { onMounted, ref, watch } from "vue";

import DataTable from "@/components/Table/DataTable.vue";
import PageContainer from "@/views/PageContainer.vue";
import SearchInput from "@/components/Input/SearchInput.vue";
import axios from "axios";
import useTable from "@/stores/useTable";
import CustomButton from "@/components/Button/CustomButton.vue";
import { Trash2, Pencil } from "lucide-vue-next";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import IngredientFormView from "@/views/ingredient/IngredientFormView.vue";
import DefaultSkeleton from "@/components/Skeleton/DefaultSkeleton.vue";
import { useRoute } from "vue-router";

const auth = useAuth();
const table = useTable();
const toast = useToast();
const route = useRoute();

let debounce;

const isShowingForm = ref(false);
const selectedIngredient = ref(null);

onMounted(async () => {
  await auth.checkLoginSession(route);
  table.resetPage();
  await fetchIngredients();
});

watch(table.filters, () => {
  table.page.current = 1;

  if (debounce) {
    clearTimeout(debounce);
  }
  debounce = setTimeout(() => fetchIngredients(), 500);
});

watch(
  () => table.page.current,
  () => {
    fetchIngredients();
  }
);

const fetchIngredients = async () => {
  try {
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
        price: item.price,
      };
    });

    table.page.current = data.meta.current_page;
    table.page.last = data.meta.last_page;
    table.page.per = data.meta.per_page;
    table.page.total = data.meta.total;
  } catch (response) {
    auth.handleUnauthenticated(response);
  }
};

const editIngredient = (item) => {
  isShowingForm.value = true;
  selectedIngredient.value = item;
};

const deleteIngredient = async (id) => {
  const { data } = await axios.delete(
    `${process.env.VUE_APP_API_BASE_URL}/api/ingredients/delete?shop_id=${auth.shopId}&id=${id}`,
    {
      headers: {
        Authorization: `Bearer ${auth.authToken}`,
      },
      withCredentials: true,
    }
  );

  if (data["error_type"]) {
    toast.message = "Gagal";
    toast.description = data.message;
    toast.type = "FAILED";
    toast.trigger();
  } else {
    toast.message = "Sukses";
    toast.description = data.message;
    toast.type = "SUCCESS";
    toast.trigger();
  }
};

const resetForm = () => {
  isShowingForm.value = false;
  selectedIngredient.value = null;
};
</script>
