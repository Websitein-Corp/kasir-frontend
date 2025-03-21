<template>
  <div v-if="isShowingForm">
    <SupplyFormView
      :key="selectedSupply?.id || 'new'"
      :supplierData="selectedSupply"
      :isEdit="!!selectedSupply"
      @form-back="resetForm"
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
          <div
            class="peer !shadow-none !bg-white w-full placeholder:text-transparent border-1 border-gray-300 rounded focus:outline-none focus:ring-2 ring-primary-600 transition-all"
          >
            <select
              class="peer w-full border placeholder:text-transparent p-3 border-1 border-gray-300 focus:outline-none focus:ring-2 ring-primary-600 transition-all"
              :class="{
                'ring-2': modelValue,
                'cursor-not-allowed !bg-white !ring-slate-500 !text-slate-500':
                  disabled,
              }"
              @change="setBasedOn($event.target.value)"
            >
              <option
                v-for="item in typeList"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </option>
            </select>
          </div>
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
            <th>Supplier</th>
            <th>Status</th>
            <th>Tanggal Transaksi</th>
            <th>Jatuh Tempo</th>
            <th>Sisa Bayar</th>
            <th>Aksi</th>
          </tr>
        </template>
        <template v-slot:tbody>
          <tr v-for="(item, index) in table.items" :key="index">
            <td>{{ item?.id || "N/A" }}</td>
            <td>{{ item?.supplier || "N/A" }}</td>
            <td>
              <span v-if="item?.status === 'NOT_PAID'">Belum Dibayar</span>
              <span v-if="item?.status === 'PAID'">Sudah Dibayar</span>
              <span v-if="item?.status === 'PARTIALLY_PAID'"
                >Dibayar Sebagian</span
              >
            </td>
            <td>{{ item?.tr_datetime || "N/A" }}</td>
            <td>{{ item?.due_date || "N/A" }}</td>
            <td>{{ $helpers.money(item?.remaining_amount || 0) }}</td>
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
import { onMounted, ref, watch, nextTick } from "vue";

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
let debounceFetch = null;

const typeList = [
  {
    label: "Tanggal Transaksi",
    value: "SUPPLY_DATE",
  },
  {
    label: "Tanggal Jatuh Tempo",
    value: "DUE_DATE",
  },
];

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
    try {
      const { data } = await axios.get(
        `${process.env.VUE_APP_API_BASE_URL}/api/supplier/supply?shop_id=${auth.shopId}&date_start=${table.filters.date.start}&date_end=${table.filters.date.end}&keyword=${table.filters.keyword}&page=${table.page.current}&based_on=${basedOn.value}`,
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
          withCredentials: true,
        }
      );

      table.items = data.data.map((item) => ({
        id: item?.id || "Unknown ID",
        status: item?.status || "UNKNOWN",
        tr_datetime: item?.tr_datetime || "N/A",
        due_date: item?.due_date || "N/A",
        total_price: item?.total_price || 0,
        supplier: item?.supplier?.name || "Unknown Supplier",
        paid_amount: item?.paid_amount || 0,
        remaining_amount: item?.remaining_amount || 0,
        installment_batch: item?.installment_batch || 0,
      }));

      table.page.current = data.meta.current_page;
      table.page.last = data.meta.last_page;
      table.page.per = data.meta.per_page;
      table.page.total = data.meta.total;
      isShowingForm.value = false;
    } catch (error) {
      toast.message = "Error";
      toast.description = "Failed to fetch supplier data.";
      toast.type = "FAILED";
      toast.trigger();
    }
  }
};

const handleAddSupplier = async () => {
  selectedSupply.value = null;
  isShowingForm.value = true;
  await nextTick();
};

const handleEditSupplier = async (item) => {
  selectedSupply.value = { ...item };
  isShowingForm.value = true;
  await nextTick();
};

const confirmDeleteSupply = (item) => {
  modal.title = "Konfirmasi Hapus";
  modal.icon = MessageCircleQuestion;
  modal.props = {
    label: "Apakah Anda yakin ingin menghapus supply ini?",
    buttonLabel: "Hapus",
    endpoint: `${process.env.VUE_APP_API_BASE_URL}/api/supplier/supply`,
    id: item.id,
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

watch(
  [() => table.filters, () => table.page.current],
  () => {
    if (debounceFetch) {
      clearTimeout(debounceFetch);
    }

    debounceFetch = setTimeout(() => {
      fetchSupplier();
    }, 300);
  },
  { deep: true }
);

const resetForm = () => {
  isShowingForm.value = false;
  selectedSupply.value = null;

  fetchSupplier();
};
</script>
