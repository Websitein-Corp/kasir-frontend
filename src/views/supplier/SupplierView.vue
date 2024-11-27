<template>
  <div v-if="isShowingForm">
    <SupplierFormView
      :supplierData="selectedSupplier"
      :isEdit="!!selectedSupplier"
      @cancel="handleCancel"
      @save="fetchSupplier"
    />
  </div>
  <div v-else-if="!page.loading">
    <PageContainer title="Supplier" subtitle="Daftar supplier yang ada">
      <DataTable :column-count="6">
        <template v-slot:action-2>
          <DatetimeInput
            v-model="table.filters.date"
            :max-date="new Date()"
            range
          ></DatetimeInput>
          <SearchInput
            class="mx-4"
            v-model="table.filters.keyword"
          ></SearchInput>
          <div class="flex gap-5">
            <CustomButton
              size="mobile"
              label="Add"
              class="bg-primary-700 hover:bg-primary-800"
              @click="handleAddSupplier"
            />
          </div>
        </template>
        <template v-slot:thead>
          <tr>
            <th>Nama Supplier</th>
            <th>Nomor Telepon</th>
            <th>Alamat</th>
            <th>Actions</th>
          </tr>
        </template>
        <template v-slot:tbody>
          <tr v-for="(item, index) in table.items" :key="index">
            <td>{{ item.name }}</td>
            <td>{{ item.phone_number }}</td>
            <td>{{ item.address }}</td>
            <td class="flex justify-center space-x-2">
              <CustomButton
                size="fit"
                :icon="Trash2"
                class="bg-red-700 hover:bg-red-800"
                @click="deleteItem(item, index)"
              />
              <CustomButton
                size="fit"
                :icon="Pencil"
                class="bg-primary-500 hover:bg-primary-600 text-primary-950"
                @click="handleEditSupplier(item)"
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

  <!-- Confirmation Modal -->
  <div
    v-if="showModal"
    class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white p-6 rounded-lg w-2/3">
      <h2 class="text-lg font-semibold">Confirm Deletion</h2>
      <p>
        Apakah kamu yakin ingin menghapus supplier <b>{{ itemToDelete.name }}</b
        >?
      </p>
      <div class="flex justify-end mt-4 space-x-4">
        <CustomButton class="bg-gray-400" @click="cancelDelete"
          >Cancel</CustomButton
        >
        <CustomButton class="bg-red-600" @click="confirmDelete"
          >Delete</CustomButton
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

import DataTable from "@/components/Table/DataTable.vue";
import DatetimeInput from "@/components/Input/DatetimeInput.vue";
import SearchInput from "@/components/Input/SearchInput.vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import SupplierFormView from "./SupplierFormView.vue";
import PageContainer from "@/views/PageContainer.vue";
import { axios } from "@/sdk/axios";
import useTable from "@/stores/useTable";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import DefaultSkeleton from "@/components/Skeleton/DefaultSkeleton.vue";
import { useRoute } from "vue-router";
import usePage from "@/stores/usePage";
import { Pencil, Trash2 } from "lucide-vue-next";

const auth = useAuth();
const table = useTable();
const page = usePage();
const toast = useToast();
const isShowingForm = ref(false);
const selectedSupplier = ref(null);
const route = useRoute();
const basedOn = ref("SUPPLY_DATE");
const showModal = ref(false);
const itemToDelete = ref(null);
const itemIndexToDelete = ref(null);

let debounce;

onMounted(async () => {
  table.resetPage();

  await fetchSupplier();
});

watch(table.filters, () => {
  table.page.current = 1;

  if (debounce) {
    clearTimeout(debounce);
  }
  debounce = setTimeout(() => fetchSupplier(), 500);
});

watch(
  () => table.page.current,
  () => {
    fetchSupplier();
  }
);

const fetchSupplier = async () => {
  const formattedDate = table.filters.date.map((rawDate) =>
    new Date(rawDate).toISOString().slice(0, 10)
  );

  const { data } = await axios.get(
    `${process.env.VUE_APP_API_BASE_URL}/api/supplier?shop_id=${auth.shopId}&date_start=${formattedDate[0]}&date_end=${formattedDate[1]}&keyword=${table.filters.keyword}&page=${table.page.current}`,
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
      phone_number: item.phone_number,
      address: item.address,
    };
  });

  table.page.current = data.meta.current_page;
  table.page.last = data.meta.last_page;
  table.page.per = data.meta.per_page;
  table.page.total = data.meta.total;
  isShowingForm.value = false;
};

const handleAddSupplier = () => {
  selectedSupplier.value = null;
  isShowingForm.value = true;
};

const handleEditSupplier = (item) => {
  selectedSupplier.value = { ...item };
  isShowingForm.value = true;
};

const handleCancel = () => {
  isShowingForm.value = false;
};

// Show the delete confirmation modal
const showDeleteConfirmation = (item, index) => {
  itemToDelete.value = item;
  itemIndexToDelete.value = index;
  showModal.value = true;
};

// Cancel the delete action
const cancelDelete = () => {
  showModal.value = false;
  itemToDelete.value = null;
  itemIndexToDelete.value = null;
};

// Confirm and proceed with the delete action
const confirmDelete = () => {
  const requestBody = {
    shop_id: auth.shopId,
    name: itemToDelete.value.name,
  };

  axios
    .delete(
      `${process.env.VUE_APP_API_BASE_URL}/api/supplier?shop_id=${auth.shopId}`,
      {
        data: requestBody,
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
        table.items.splice(itemIndexToDelete.value, 1);

        toast.message = "Sukses";
        toast.description = response.data.message;
        toast.type = "SUCCESS";
        toast.trigger();
      }
    })
    .catch(() => {
      toast.message = "Gagal";
      toast.description = "An error occurred while deleting the supplier.";
      toast.type = "FAILED";
      toast.trigger();
    })
    .finally(() => {
      showModal.value = false;
      itemToDelete.value = null;
      itemIndexToDelete.value = null;
    });
};
</script>
