<template>
  <div v-if="isShowingForm">
    <ShopFormView
      :shop-data="selectedShop"
      :is-edit="!!selectedShop"
      @form-back="resetForm"
      @submit-success="resetForm"
    />
  </div>
  <div v-else-if="!page.loading">
    <PageContainer title="Toko" subtitle="Daftar toko terdaftar...">
      <DataTable :column-count="4">
        <template v-slot:action-2> </template>
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
            <th>Alamat</th>
            <th>Saldo</th>
            <th>Actions</th>
          </tr>
        </template>
        <template v-slot:tbody>
          <tr v-for="(item, index) in table.items" :key="index">
            <td>{{ item.name || "-" }}</td>
            <td>{{ item.address || "-" }}</td>
            <td>{{ $helpers.money(item.balance) || "-" }}</td>
            <td class="flex justify-center space-x-2">
              <CustomButton
                size="fit"
                :icon="Trash2"
                class="bg-red-700 hover:bg-red-800 !shadow-none"
                @click="confirmDeleteShop(item.id)"
              />
              <CustomButton
                size="fit"
                :icon="Pencil"
                class="bg-primary-500 hover:bg-primary-600 text-primary-950 !shadow-none"
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
import { axios } from "@/sdk/axios";
import useTable from "@/stores/useTable";
import CustomButton from "@/components/Button/CustomButton.vue";
import { Trash2, Pencil, MessageCircleQuestion, Plus } from "lucide-vue-next";
import useToast from "@/stores/useToast";
import { useRoute } from "vue-router";
import DefaultSkeleton from "@/components/Skeleton/DefaultSkeleton.vue";
import usePage from "@/stores/usePage";
import ShopFormView from "@/views/shop/ShopFormView.vue";
import useAuth from "@/stores/useAuth";
import DeleteBody from "@/components/Modal/Body/DeleteBody.vue";
import useModal from "@/stores/useModal";

const table = useTable();
const toast = useToast();
const page = usePage();
const auth = useAuth();
const modal = useModal();
const route = useRoute();

let debounce;

const isShowingForm = ref(false);
const selectedShop = ref(null);

onMounted(async () => {
  page.loading = true;
  table.resetPage();

  await fetchShops();
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

const fetchShops = () => {
  axios
    .get(`${process.env.VUE_APP_API_BASE_URL}/api/shops`, {
      headers: {
        Authorization: `Bearer ${auth.authToken}`,
      },
      withCredentials: true,
    })
    .then(({ data }) => {
      table.items = data.data.map((item) => {
        return {
          id: item.id,
          address: item.address,
          name: item.name,
          balance: item.balance,
          settings: item.settings.map((setting) => ({
            name: setting.name,
            label: setting.label,
            value: setting.value ? 1 : 0,
          })),
          imageUrl: item.image_url,
        };
      });

      table.page.current = data.meta.current_page || 1;
      table.page.last = data.meta.last_page || 1;
      table.page.per = data.meta.per_page || 10;
      table.page.total = data.meta.total || table.items.length;
    });
};

const editShop = (item) => {
  isShowingForm.value = true;
  selectedShop.value = {
    id: item.id,
    name: item.name,
    address: item.address,
    balance: item.balance,
    settings: item.settings,
    imageUrl: item.imageUrl,
  };
};

const confirmDeleteShop = (id) => {
  modal.title = "Konfirmasi Hapus";
  modal.icon = MessageCircleQuestion;
  modal.props = {
    label: "Apakah Anda yakin ingin menghapus toko ini?",
    buttonLabel: "Hapus",
    endpoint: `${process.env.VUE_APP_API_BASE_URL}/api/shops/${id}`,
  };
  modal.callback = fetchShops;
  modal.body = DeleteBody;
  modal.open();
};

const resetForm = () => {
  isShowingForm.value = false;
  selectedShop.value = null;

  fetchShops();
};
</script>
