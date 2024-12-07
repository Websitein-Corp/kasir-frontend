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
            :max-date="new Date().toISOString()"
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
              :icon="Plus"
              class="bg-primary-700 hover:bg-primary-800"
              @click="handleAddSupplier"
            />
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
            <td class="flex justify-center space-x-2">
              <CustomButton
                size="fit"
                :icon="Trash2"
                class="bg-red-700 hover:bg-red-800 !shadow-none"
                @click="confirmDeleteSupply(item)"
              />
              <CustomButton
                size="fit"
                :icon="Pencil"
                class="bg-primary-500 hover:bg-primary-600 text-primary-950 !shadow-none"
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
import { MessageCircleQuestion, Pencil, Plus, Trash2 } from "lucide-vue-next";
import DeleteBody from "@/components/Modal/Body/DeleteBody.vue";
import useModal from "@/stores/useModal";

const auth = useAuth();
const table = useTable();
const page = usePage();
const toast = useToast();
const modal = useModal();

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
  if (table.filters.date.start && table.filters.date.end) {
    const { data } = await axios.get(
      `${process.env.VUE_APP_API_BASE_URL}/api/supplier/supply?shop_id=${auth.shopId}&date_start=${table.filters.date.start}&date_end=${table.filters.date.end}&keyword=${table.filters.keyword}&page=${table.page.current}&based_on=${basedOn.value}`,
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
  }
};

const handleAddSupplier = () => {
  selectedSupply.value = null;
  isShowingForm.value = true;
};

const handleEditSupplier = (item) => {
  selectedSupply.value = { ...item };
  console.log(selectedSupply.value);
  isShowingForm.value = true;
};

const confirmDeleteSupply = (item) => {
  modal.title = "Konfirmasi Hapus";
  modal.icon = MessageCircleQuestion;
  modal.props = {
    label: "Apakah Anda yakin ingin menghapus supply ini?",
    buttonLabel: "Hapus",
    endpoint: `${process.env.VUE_APP_API_BASE_URL}/api/ingredients/${item.id}`,
  };
  modal.callback = fetchSupplier;
  modal.body = DeleteBody;
  modal.open();
};

const setBasedOn = (value) => {
  if (basedOn.value !== value) {
    basedOn.value = value;
    fetchSupplier();
  }
};
</script>
