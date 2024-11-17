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
            <DashboardButton @click="handleAddSupplier"
              >Add Supplier</DashboardButton
            >
          </div>
        </template>
        <template v-slot:thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>
              <div class="flex flex-row items-center justify-center">
                Transaction Date
                <span
                  @click="setBasedOn('SUPPLY_DATE')"
                  class="cursor-pointer ml-1"
                >
                  <span v-if="basedOn === 'SUPPLY_DATE'" aria-label="Selected">
                    <!-- Check SVG for active state -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M9 16.2l-3.5-3.5c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l4.2 4.2c.4.4 1 .4 1.4 0l8.3-8.3c.4-.4.4-1 0-1.4s-1-.4-1.4 0L9 16.2z"
                      />
                    </svg>
                  </span>
                  <span v-else aria-label="Sort">
                    <!-- Sort SVG for inactive state -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                      />
                    </svg>
                  </span>
                </span>
              </div>
            </th>
            <th>
              <div class="flex flex-row items-center justify-center">
                Due Date
                <span
                  @click="setBasedOn('DUE_DATE')"
                  class="cursor-pointer ml-1"
                >
                  <span v-if="basedOn === 'DUE_DATE'" aria-label="Selected">
                    <!-- Check SVG for active state -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M9 16.2l-3.5-3.5c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l4.2 4.2c.4.4 1 .4 1.4 0l8.3-8.3c.4-.4.4-1 0-1.4s-1-.4-1.4 0L9 16.2z"
                      />
                    </svg>
                  </span>
                  <span v-else aria-label="Sort">
                    <!-- Sort SVG for inactive state -->
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                      />
                    </svg>
                  </span>
                </span>
              </div>
            </th>
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
import DatetimeInput from "@/components/Input/DatetimeInput.vue";
import SearchInput from "@/components/Input/SearchInput.vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import DashboardButton from "@/components/Button/DashboardButton.vue";
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
    `${process.env.VUE_APP_API_BASE_URL}/api/supplier/supply/?shop_id=${auth.shopId}&date_start=${formattedDate[0]}&date_end=${formattedDate[1]}&keyword=${table.filters.keyword}&page=${table.page.current}&based_on=${basedOn.value}`,
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

const deleteItem = async (item, index) => {
  try {
    await axios.delete(
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
  } catch (error) {
    toast.message = "Gagal";
    toast.description =
      error.response?.data?.message || "An error occurred while deleting.";
    toast.type = "FAILED";
    toast.trigger();
  }
};

const setBasedOn = (value) => {
  if (basedOn.value !== value) {
    basedOn.value = value;
    fetchSupplier();
  }
};
</script>
