<template>
  <div v-if="isShowingForm">
    <SupplierFormView
      :supplierData="selectedSupplier"
      :isEdit="!!selectedSupplier"
      @cancel="handleCancel"
      @save="fetchSupplier"
    />
  </div>
  <div v-else-if="auth.isAuthenticated">
    <DataTable :column-count="6">
      <template v-slot:action-2>
        <DatetimeInput
          v-model="table.filters.date"
          :max-date="new Date()"
          range
        ></DatetimeInput>
        <SearchInput class="mx-4" v-model="table.filters.keyword"></SearchInput>
        <div class="flex gap-5">
          <DashboardButton @click="handleAddSupplier"
            >Add Supplier</DashboardButton
          >
        </div>
      </template>
      <template v-slot:thead>
        <tr>
          <th>ID</th>
          <th>Status</th>
          <th>Transaction Date</th>
          <th>Due Date</th>
          <th>Total Price</th>
          <th>Actions</th>
        </tr>
      </template>
      <template v-slot:tbody>
        <tr v-for="(item, index) in table.items" :key="index">
          <td>{{ item.id }}</td>
          <td>
            <span v-if="item.status === 'NOT_PAID'">Belum Dibayar</span>
            <span v-if="item.status === 'PAID'">Sudah Dibayar</span>
          </td>
          <td>{{ item.tr_datetime }}</td>
          <!-- Use tr_datetime field -->
          <td>{{ item.due_date }}</td>
          <!-- Use due_date field -->
          <td>{{ item.total_price }}</td>
          <!-- Use total_price field -->
          <td>
            <div class="flex flex-row space-x-4">
              <CustomButton
                size="full"
                height="lg"
                iconSide="right"
                label="EDIT"
                align="center"
                :icon="mdiContentSave"
                @click="handleEditSupplier(item)"
                class="bg-primary-600"
              />
              <CustomButton
                size="full"
                height="lg"
                iconSide="right"
                label="DELETE"
                align="center"
                :icon="mdiDelete"
                @click="deleteItem(item, index)"
                class="bg-red-600"
              />
            </div>
          </td>
        </tr>
      </template>
    </DataTable>
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
import DatetimeInput from "@/components/Input/DatetimeInput.vue";
import SearchInput from "@/components/Input/SearchInput.vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import DashboardButton from "@/components/Button/DashboardButton.vue";
import SupplierFormView from "./SupplierFormView.vue";
import axios from "axios";
import useTable from "@/stores/useTable";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import DefaultSkeleton from "@/components/Skeleton/DefaultSkeleton.vue";

const auth = useAuth();
const table = useTable();
const toast = useToast();
const isShowingForm = ref(false);
const selectedSupplier = ref(null);

let debounce;

onMounted(async () => {
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
    `${process.env.VUE_APP_API_BASE_URL}/api/supplier/supply/list?shop_id=${auth.shopId}&date_start=${formattedDate[0]}&date_end=${formattedDate[1]}&keyword=${table.filters.keyword}&page=${table.page.current}`,
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
      status: item.status,
      tr_datetime: item.tr_datetime,
      due_date: item.due_date,
      total_price: item.total_price,
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

// Function to handle edit supplier action
const handleEditSupplier = (item) => {
  selectedSupplier.value = { ...item };
  isShowingForm.value = true;
};

const handleCancel = () => {
  isShowingForm.value = false;
};

const deleteItem = async (item, index) => {
  try {
    const response = await axios.delete(
      `${process.env.VUE_APP_API_BASE_URL}/api/ingredients/${item.id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        withCredentials: true,
      }
    );

    table.items.splice(index, 1);
    toast.message = "Sukses";
    toast.description = "Berhasil Menghapus Item!";
    toast.type = "SUCCESS";
    toast.trigger();
    console.log("Item deleted successfully:", response.data);
  } catch (error) {
    console.error("Error deleting item:", error);
    toast.message = "Gagal";
    toast.description =
      error.response?.data?.message || "An error occurred while deleting.";
    toast.type = "FAILED";
    toast.trigger();
  }
};
</script>
