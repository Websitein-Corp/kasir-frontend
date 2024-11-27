<template>
  <div v-if="isShowingForm">
    <IngredientFormView
      :ingredient-data="selectedIngredient"
      :is-edit="!!selectedIngredient"
      @form-back="resetForm"
      @submit-success="resetForm"
    />
  </div>
  <div v-else-if="!page.loading">
    <PageContainer title="Bahan Baku" subtitle="Daftar bahan baku produk...">
      <DataTable :column-count="5">
        <template v-slot:action-2>
          <div class="flex space-x-2">
            <SearchInput
              v-model="table.filters.keyword"
              placeholder="Cari bahan baku..."
            ></SearchInput>
          </div>
        </template>
        <template v-slot:action-3>
          <div class="flex space-x-2">
            <CustomButton
              size="mobile"
              label="Add"
              class="bg-primary-700 hover:bg-primary-800"
              @click="isShowingForm = true"
            />
          </div>
        </template>
        <template v-slot:thead>
          <tr>
            <th>Nama</th>
            <th>Stok</th>
            <th>Harga</th>
            <th>Actions</th>
          </tr>
        </template>
        <template v-slot:tbody>
          <tr v-for="(item, index) in table.items" :key="index">
            <td>{{ item.name || "-" }}</td>
            <td>{{ item.stock + " " + item.unitName || "-" }}</td>
            <td>{{ $helpers.money(item.price) || "-" }}</td>
            <td class="flex justify-center space-x-2">
              <CustomButton
                size="fit"
                :icon="Trash2"
                class="bg-red-700 hover:bg-red-800"
                @click="confirmDeleteIngredient(item.id)"
              />
              <CustomButton
                size="fit"
                :icon="Pencil"
                class="bg-primary-500 hover:bg-primary-600 text-primary-950"
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
import { axios } from "@/sdk/axios";
import useTable from "@/stores/useTable";
import CustomButton from "@/components/Button/CustomButton.vue";
import { Trash2, Pencil, MessageCircleQuestion } from "lucide-vue-next";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import IngredientFormView from "@/views/ingredient/IngredientFormView.vue";
import DefaultSkeleton from "@/components/Skeleton/DefaultSkeleton.vue";
import { useRoute } from "vue-router";
import usePage from "@/stores/usePage";
import DeleteBody from "@/components/Modal/Body/DeleteBody.vue";
import useModal from "@/stores/useModal";

const auth = useAuth();
const table = useTable();
const toast = useToast();
const modal = useModal();
const page = usePage();
const route = useRoute();

let debounce;

const isShowingForm = ref(false);
const selectedIngredient = ref(null);

onMounted(() => {
  page.loading = true;
  table.resetPage();

  fetchIngredients();
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

const fetchIngredients = () => {
  axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/ingredients?shop_id=${auth.shopId}&keyword=${table.filters.keyword}&page=${table.page.current}`,
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
    )
    .then(({ data }) => {
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
    });
};

const editIngredient = (item) => {
  isShowingForm.value = true;
  selectedIngredient.value = item;
};

const confirmDeleteIngredient = (id) => {
  modal.title = "Konfirmasi Hapus";
  modal.icon = MessageCircleQuestion;
  modal.props = {
    label: "Apakah Anda yakin ingin menghapus bahan baku ini?",
    buttonLabel: "Hapus",
    endpoint: `${process.env.VUE_APP_API_BASE_URL}/api/ingredients?shop_id=${auth.shopId}&id=${id}`,
  };
  modal.callback = fetchIngredients;
  modal.body = DeleteBody;
  modal.open();
};

const resetForm = () => {
  isShowingForm.value = false;
  selectedIngredient.value = null;

  fetchIngredients();
};
</script>
