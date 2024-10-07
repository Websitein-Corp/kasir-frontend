<template>
  <div v-if="isShowingForm">
    <SubuserFormView
      :subuser-data="selectedSubuser"
      :is-edit="!!selectedSubuser"
      @close-form="resetForm"
    />
  </div>
  <div v-else>
    <PageContainer title="Karyawan" subtitle="Daftar karyawan...">
      <DataTable>
        <template v-slot:action-2>
          <div class="flex space-x-2">
            <SearchInput v-model="table.filters.keyword"></SearchInput>
          </div>
        </template>
        <template v-slot:action-3>
          <div class="flex space-x-2">
            <CustomButton
              size="sm"
              label="Add"
              class="bg-primary-700 hover:bg-primary-800"
              @click="isShowingForm = true"
            />
          </div>
        </template>
        <template v-slot:thead>
          <tr>
            <th>Email</th>
            <th>Nama</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </template>
        <template v-slot:tbody>
          <tr v-for="(item, index) in table.items" :key="index">
            <td>{{ item.email || "-" }}</td>
            <td>{{ item.name || "-" }}</td>
            <td>{{ item.lastLogin || "-" }}</td>
            <td class="flex justify-center space-x-2">
              <CustomButton
                size="fit"
                :icon="Trash2"
                class="bg-red-700 hover:bg-red-800"
                @click="deleteSubuser(item.id)"
              />
              <CustomButton
                size="fit"
                :icon="Pencil"
                class="bg-primary-200 hover:bg-primary-300 text-primary-950"
                @click="editSubuser(item)"
              />
            </td>
          </tr>
        </template>
      </DataTable>
    </PageContainer>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

import DataTable from "@/components/Table/DataTable.vue";
import PageContainer from "@/views/PageContainer.vue";
import SearchInput from "@/components/Input/SearchInput.vue";
import axios from "axios";
import useTable from "@/stores/useTable";
import CustomButton from "@/components/Button/CustomButton.vue";
import SubuserFormView from "@/views/subuser/SubuserFormView.vue";
import { Trash2, Pencil } from "lucide-vue-next";
import useToast from "@/stores/useToast";

const table = useTable();
const toast = useToast();

let debounce;

const isShowingForm = ref(false);
const selectedSubuser = ref(null);

onMounted(async () => {
  await fetchSubusers();
});

watch(table.filters, () => {
  table.page.current = 1;

  if (debounce) {
    clearTimeout(debounce);
  }
  debounce = setTimeout(() => fetchSubusers(), 500);
});

watch(
  () => table.page.current,
  () => {
    fetchSubusers();
  }
);

const fetchSubusers = async () => {
  const { data } = await axios.get(
    `${process.env.VUE_APP_API_BASE_URL}/api/subusers?shop_id=76L1?keyword=${table.filters.keyword}&page=${table.page.current}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
      withCredentials: true,
    }
  );

  console.log(data);

  table.items = data.data.map((item) => {
    return {
      id: item.id,
      email: item.email,
      name: item.name,
      permissions: item.permissions,
      lastLogin: item.last_login,
    };
  });

  table.page.current = data.meta.current_page;
  table.page.last = data.meta.last_page;
  table.page.per = data.meta.per_page;
  table.page.total = data.meta.total;
};

const editSubuser = (item) => {
  isShowingForm.value = true;
  selectedSubuser.value = {
    id: item.id,
    email: item.email,
    password: item.password,
    name: item.name,
    permissions: item.permissions,
  };
};

const deleteSubuser = async (id) => {
  const { data } = await axios.post(
    `${process.env.VUE_APP_API_BASE_URL}/api/subusers`,
    {
      id: id,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
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
  }
};

const resetForm = () => {
  isShowingForm.value = false;
  selectedSubuser.value = null;
};
</script>
