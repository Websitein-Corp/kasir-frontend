<template>
  <div v-if="isShowingForm">
    <CategoryFormView
      :category-data="selectedCategory"
      :is-edit="!!selectedCategory"
      @form-back="resetForm"
      @submit-success="resetForm"
    />
  </div>
  <div v-else-if="!page.loading">
    <PageContainer title="Produk Kategori" subtitle="Daftar kategori produk...">
      <DataTable :column-count="3">
        <template v-slot:action-2>
          <div class="flex space-x-2">
            <SearchInput
              v-model="table.filters.keyword"
              placeholder="Cari kategori..."
            ></SearchInput>
          </div>
        </template>
        <template v-slot:action-3>
          <div class="flex space-x-2">
            <CustomButton
              size="mobile"
              label="Add"
              :icon="Plus"
              class="bg-primary-700 hover:bg-primary-800"
              @click="isShowingForm = true"
            />
          </div>
        </template>
        <template v-slot:thead>
          <tr>
            <th>Kode</th>
            <th>Nama</th>
            <th>Actions</th>
          </tr>
        </template>
        <template v-slot:tbody>
          <tr v-for="(item, index) in table.items" :key="index">
            <td>{{ item.code || "-" }}</td>
            <td>{{ item.name || "-" }}</td>
            <td class="flex justify-center space-x-2">
              <CustomButton
                size="fit"
                :icon="Trash2"
                class="bg-red-700 hover:bg-red-800 !shadow-none"
                @click="confirmDeleteCategory(item.id)"
              />
              <CustomButton
                size="fit"
                :icon="Pencil"
                class="bg-primary-500 hover:bg-primary-600 text-primary-950 !shadow-none"
                @click="editCategory(item)"
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
import { Trash2, Pencil, MessageCircleQuestion, Plus } from "lucide-vue-next";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import CategoryFormView from "@/views/category/CategoryFormView.vue";
import DefaultSkeleton from "@/components/Skeleton/DefaultSkeleton.vue";
import { useRoute } from "vue-router";
import usePage from "@/stores/usePage";
import DeleteBody from "@/components/Modal/Body/DeleteBody.vue";
import useModal from "@/stores/useModal";

const auth = useAuth();
const table = useTable();
const toast = useToast();
const page = usePage();
const modal = useModal();
const route = useRoute();

let debounce;

const isShowingForm = ref(false);
const selectedCategory = ref(null);

onMounted(async () => {
  page.loading = true;
  table.resetPage();

  await fetchCategories();
});

watch(table.filters, () => {
  table.page.current = 1;

  if (debounce) {
    clearTimeout(debounce);
  }
  debounce = setTimeout(() => fetchCategories(), 500);
});

watch(
  () => table.page.current,
  () => {
    fetchCategories();
  }
);

const fetchCategories = () => {
  axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/categories?shop_id=${auth.shopId}&keyword=${table.filters.keyword}&page=${table.page.current}`,
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
};

const editCategory = (item) => {
  isShowingForm.value = true;
  selectedCategory.value = item;
};

const confirmDeleteCategory = (id) => {
  modal.title = "Konfirmasi Hapus";
  modal.icon = MessageCircleQuestion;
  modal.props = {
    label: "Apakah Anda yakin ingin menghapus kategori ini?",
    buttonLabel: "Hapus",
    endpoint: `${process.env.VUE_APP_API_BASE_URL}/api/categories/${id}`,
  };
  modal.callback = fetchCategories;
  modal.body = DeleteBody;
  modal.open();
};

const resetForm = () => {
  isShowingForm.value = false;
  selectedCategory.value = null;

  fetchCategories();
};
</script>
