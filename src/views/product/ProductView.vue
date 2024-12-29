<template>
  <div v-if="isShowingForm">
    <ProductFormView
      :product-data="selectedProduct"
      :is-edit="!!selectedProduct"
      @form-back="resetForm"
      @submit-success="(item, isAdd) => handleProductSuccess(item, isAdd)"
    />
  </div>
  <div v-else-if="!page.loading">
    <PageContainer title="Produk" subtitle="Daftar produk...">
      <DataTable :column-count="11">
        <template v-slot:action-2>
          <div class="flex space-x-2">
            <SearchInput
              v-model="table.filters.keyword"
              placeholder="Cari produk..."
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
            <th>Nama</th>
            <th>SKU</th>
            <th>Tipe</th>
            <th>Kategori</th>
            <th>Stok</th>
            <th>Harga Modal</th>
            <th>Harga Retail</th>
            <th>Harga Jual</th>
            <th>Diskon</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </template>
        <template v-slot:tbody>
          <tr v-for="(item, index) in table.items" :key="index">
            <td>{{ item.name || "-" }}</td>
            <td>{{ item.sku || "-" }}</td>
            <td>{{ item.type || "-" }}</td>
            <td>{{ (item.category && item.category.name) || "-" }}</td>
            <td>{{ item.stock || "-" }}</td>
            <td>{{ item.capitalPrice || "-" }}</td>
            <td>{{ item.sellingRetailPrice || "-" }}</td>
            <td>{{ item.sellingPrice || "-" }}</td>
            <td>{{ item.discountPrice || "-" }}</td>
            <td>{{ (item.isActive ? "Active" : "Inactive") || "-" }}</td>
            <td class="flex justify-center space-x-2">
              <CustomButton
                size="fit"
                :icon="Trash2"
                class="bg-red-700 hover:bg-red-800 !shadow-none"
                @click="confirmDeleteProduct(item.sku)"
              />
              <CustomButton
                size="fit"
                :icon="Pencil"
                class="bg-primary-500 hover:bg-primary-600 text-primary-950 !shadow-none"
                @click="editProduct(item)"
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
import ProductFormView from "@/views/product/ProductFormView.vue";
import { Trash2, Pencil, MessageCircleQuestion, Plus } from "lucide-vue-next";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import DefaultSkeleton from "@/components/Skeleton/DefaultSkeleton.vue";
import { useRoute } from "vue-router";
import usePage from "@/stores/usePage";
import useModal from "@/stores/useModal";
import DeleteBody from "@/components/Modal/Body/DeleteBody.vue";

const auth = useAuth();
const table = useTable();
const toast = useToast();
const page = usePage();
const modal = useModal();
const route = useRoute();

let debounce;

const isShowingForm = ref(false);
const selectedProduct = ref(null);

onMounted(async () => {
  page.loading = true;
  table.resetPage();

  fetchProducts();
});

watch(table.filters, () => {
  table.page.current = 1;

  if (debounce) {
    clearTimeout(debounce);
  }
  debounce = setTimeout(() => fetchProducts(), 500);
});

watch(
  () => table.page.current,
  () => {
    fetchProducts();
  }
);

const fetchProducts = () => {
  axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/products?shop_id=${
        auth.shopId
      }&page=${table.page.current}${
        table.filters.keyword ? "&keyword=" + table.filters.keyword : ""
      }`,
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
          sku: item.sku,
          name: item.name,
          capitalPrice: item.capital_price,
          sellingRetailPrice: item.selling_retail_price,
          sellingPrice: item.selling_price,
          discountPrice: item.discount_price,
          stock: item.stock,
          imageUrl: item.image_url,
          type: item.type,
          category: item.category,
          ingredients: item.ingredients,
          barcode: item.barcode,
          isActive: item.is_active,
        };
      });

      table.page.current = data.meta.current_page;
      table.page.last = data.meta.last_page;
      table.page.per = data.meta.per_page;
      table.page.total = data.meta.total;
    });
};

const editProduct = (item) => {
  isShowingForm.value = true;
  selectedProduct.value = {
    sku: item.sku,
    name: item.name,
    capitalPrice: item.capitalPrice,
    sellingRetailPrice: item.sellingRetailPrice,
    sellingPrice: item.sellingPrice,
    discountPrice: item.discountPrice,
    stock: item.stock,
    imageUrl: item.imageUrl,
    type: item.type,
    category: item.category,
    ingredients: item.ingredients,
    barcode: item.barcode,
    isActive: item.isActive,
  };
};

const confirmDeleteProduct = (sku) => {
  modal.title = "Konfirmasi Hapus";
  modal.icon = MessageCircleQuestion;
  modal.props = {
    label: "Apakah Anda yakin ingin menghapus produk ini?",
    buttonLabel: "Hapus",
    endpoint: `${process.env.VUE_APP_API_BASE_URL}/api/products/delete?shop_id=${auth.shopId}&sku=${sku}`,
  };
  modal.callback = fetchProducts;
  modal.body = DeleteBody;
  modal.open();
};

const handleProductSuccess = (item, isAdd) => {
  resetForm();

  if (isAdd) {
    editProduct(item);
    modal.open();
  }
};

const resetForm = () => {
  isShowingForm.value = false;
  selectedProduct.value = null;

  fetchProducts();
};
</script>
