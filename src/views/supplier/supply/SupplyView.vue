<template>
  <div v-if="isShowingForm">
    <SupplyFormView
      :supplierData="selectedSupply"
      :isEdit="!!selectedSupply"
      @cancel="handleCancel"
      @save="fetchSupplier"
    />
  </div>
  <div v-else-if="!page.loading">
    <PageContainer
      title="Supply"
      subtitle="Daftar supply dari supplier yang ada"
    >
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
              size="md"
              @click="handleAddSupplier"
              class="bg-primary-600"
            >
              Add Supply
            </CustomButton>
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
                  class="bg-primary-600"
                />
                <CustomButton
                  size="full"
                  height="lg"
                  iconSide="right"
                  label="DELETE"
                  align="center"
                  :icon="mdiDelete"
                  @click="showDeleteConfirmation(item, index)"
                  class="bg-red-600"
                />
              </div>
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
        Apakah kamu yakin ingin menghapus supply <b>{{ itemToDelete.id }}</b
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
import SupplyFormView from "./SupplyFormView.vue";
import PageContainer from "@/views/PageContainer.vue";
import { axios } from "@/sdk/axios";
import useTable from "@/stores/useTable";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import { useRoute } from "vue-router";
import DefaultSkeleton from "@/components/Skeleton/DefaultSkeleton.vue";
import usePage from "@/stores/usePage";

const auth = useAuth();
const table = useTable();
const page = usePage();
const toast = useToast();
const isShowingForm = ref(false);
const selectedSupply = ref(null);
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
    `${process.env.VUE_APP_API_BASE_URL}/api/supplier/supply?shop_id=${auth.shopId}&date_start=${formattedDate[0]}&date_end=${formattedDate[1]}&keyword=${table.filters.keyword}&page=${table.page.current}&based_on=${basedOn.value}`,
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
  selectedSupply.value = null;
  isShowingForm.value = true;
};

// Function to handle edit supplier action
const handleEditSupplier = (item) => {
  selectedSupply.value = { ...item };
  console.log(selectedSupply.value);
  isShowingForm.value = true;
};

const handleCancel = () => {
  isShowingForm.value = false;
};

const showDeleteConfirmation = (item, index) => {
  itemToDelete.value = item;
  itemIndexToDelete.value = index;
  showModal.value = true; // Show the modal
};

const cancelDelete = () => {
  showModal.value = false; // Hide the modal without deleting
  itemToDelete.value = null;
  itemIndexToDelete.value = null;
};

const confirmDelete = () => {
  // Proceed with deletion
  axios
    .delete(
      `${process.env.VUE_APP_API_BASE_URL}/api/ingredients/${itemToDelete.value.id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        withCredentials: true,
      }
    )
    .then(({ data }) => {
      if (data["error_type"]) {
        toast.message = "Gagal";
        toast.description = data.message;
        toast.type = "FAILED";
        toast.trigger();
      } else {
        table.items.splice(itemIndexToDelete.value, 1);

        toast.message = "Sukses";
        toast.description = data.message;
        toast.type = "SUCCESS";
        toast.trigger();
      }
    })
    .catch(() => {
      toast.message = "Gagal";
      toast.description = "An error occurred while deleting.";
      toast.type = "FAILED";
      toast.trigger();
    })
    .finally(() => {
      showModal.value = false;
      itemToDelete.value = null;
      itemIndexToDelete.value = null;
    });
};

const setBasedOn = (value) => {
  if (basedOn.value !== value) {
    basedOn.value = value;
    fetchSupplier();
  }
};
</script>
