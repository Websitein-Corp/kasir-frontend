<template>
  <div v-if="isShowingForm">
    <SupplierFormView
      :supplierData="selectedSupplier"
      :isEdit="!!selectedSupplier"
      @cancel="handleCancel"
      @save="fetchSupplier"
    />
  </div>
  <div v-else>
    <PageContainer title="Supplier" subtitle="Daftar supplier yang ada...">
      <DashboardTable>
        <template v-slot:action-2>
          <SearchInput v-model="table.filters.keyword"></SearchInput>
        </template>
        <template v-slot:action-3>
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
            <th>Action</th>
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
            <td>{{ item.due_date }}</td>
            <td>{{ item.total_price }}</td>
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
                />
                <CustomButton
                  size="full"
                  height="lg"
                  iconSide="right"
                  label="DELETE"
                  textColor="red"
                  align="center"
                  :icon="mdiDelete"
                  @click="deleteItem(item, index)"
                />
              </div>
            </td>
          </tr>
        </template>
      </DashboardTable>
    </PageContainer>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, reactive } from "vue";

import DashboardTable from "@/components/Table/DashboardTable.vue";
import PageContainer from "@/views/PageContainer.vue";
import SearchInput from "@/components/Input/SearchInput.vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import DashboardButton from "@/components/Button/DashboardButton.vue";
import SupplierFormView from "./SupplierFormView.vue";
import axios from "axios";
import useTable from "@/stores/useTable";
import useToast from "@/stores/useToast";

const table = reactive(useTable());
const toast = useToast();
const isShowingForm = ref(false); // State to toggle between table and form view
const selectedSupplier = ref(null); // State to hold the selected supplier for editing

let debounce;

const doSearch = (event) => {
  console.log(event.target.value);
};

onMounted(async () => {
  await fetchSupplier();
});

watch(table.filters, () => {
  clearTimeout(debounce);
  debounce = setTimeout(() => fetchSupplier(), 500);
});

// Function to fetch supplier list
const fetchSupplier = async () => {
  const data = {
    items: [
      {
        id: "supply19agt",
        status: "NOT_PAID",
        tr_datetime: "2024-08-19 12:00:00",
        due_date: "2024-09-19",
        total_price: "Rp25.000.000",
      },
      {
        id: "supply19agt-2",
        status: "PAID",
        tr_datetime: "2024-08-19 13:00:00",
        due_date: "2024-09-19",
        total_price: "Rp25.000.000",
      },
    ],
  };
  table.items = data.items;
};

// Function to handle add supplier action
const handleAddSupplier = () => {
  selectedSupplier.value = null; // Clear selected supplier data
  isShowingForm.value = true; // Show the form view
};

// Function to handle edit supplier action
const handleEditSupplier = (item) => {
  selectedSupplier.value = { ...item }; // Set the selected supplier for editing
  isShowingForm.value = true; // Show the form view
};

// Function to handle cancel action from SupplierFormView
const handleCancel = () => {
  isShowingForm.value = false; // Hide the form and show the table
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
    // Remove item from table after successful delete
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
