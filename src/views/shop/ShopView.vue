<template>
  <div v-if="isShowingForm">
    <ShopFormView
      :shop-data="selectedShop"
      :is-edit="!!selectedShop"
      @form-back="resetForm"
      @submit-success="resetForm"
    />
  </div>
  <div v-else-if="auth.isAuthenticated && !page.loading">
    <PageContainer title="Toko" subtitle="Daftar toko terdaftar...">
      <DataTable :column-count="4">
        <template v-slot:action-2> </template>
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
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </template>
        <template v-slot:tbody>
          <tr v-for="(item, index) in table.items" :key="index">
            <td>{{ item.name || "-" }}</td>
            <td>{{ item.address || "-" }}</td>
            <td class="flex justify-center space-x-2">
              <CustomButton
                size="fit"
                :icon="Trash2"
                class="bg-red-700 hover:bg-red-800"
                @click="deleteShop(item.id)"
              />
              <CustomButton
                size="fit"
                :icon="Pencil"
                class="bg-primary-200 hover:bg-primary-300 text-primary-950"
                @click="editShop(item)"
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
import axios from "axios";
import useTable from "@/stores/useTable";
import CustomButton from "@/components/Button/CustomButton.vue";
import { Trash2, Pencil } from "lucide-vue-next";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import { useRoute } from "vue-router";
import DefaultSkeleton from "@/components/Skeleton/DefaultSkeleton.vue";
import usePage from "@/stores/usePage";
import ShopFormView from "@/views/shop/ShopFormView.vue";

const auth = useAuth();
const table = useTable();
const toast = useToast();
const page = usePage();
const route = useRoute();

let debounce;

const isShowingForm = ref(false);
const selectedShop = ref(null);

onMounted(async () => {
  page.loading = true;
  table.resetPage();

  if (await auth.checkLoginSession(route)) {
    await fetchShops();
  }
});

watch(table.filters, () => {
  table.page.current = 1;

  if (debounce) {
    clearTimeout(debounce);
  }
  debounce = setTimeout(() => fetchShops(), 500);
});

watch(
  () => table.page.current,
  () => {
    fetchShops();
  }
);

const fetchShops = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/shops`,
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
        address: item.address,
        name: item.name,
        balance: item.balance,
        activeTaxFlag: item.active_tax_flag,
      };
    });

    table.page.current = data.meta.current_page || 1;
    table.page.last = data.meta.last_page || 1;
    table.page.per = data.meta.per_page || 10;
    table.page.total = data.meta.total || table.items.length;
  } catch (response) {
    auth.handleAxiosError(response);
  } finally {
    page.loading = false;
  }
};

const editShop = (item) => {
  isShowingForm.value = true;
  selectedShop.value = {
    id: item.id,
    name: item.name,
    address: item.address,
    balance: item.balance,
    activeTaxFlag: item.activeTaxFlag,
  };
};

const deleteShop = async (id) => {
  const { data } = await axios.delete(
    `${process.env.VUE_APP_API_BASE_URL}/api/shops/${id}`,
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

    await fetchShops();
  }
};

const resetForm = () => {
  isShowingForm.value = false;
  selectedShop.value = null;

  fetchShops();
};
</script>
