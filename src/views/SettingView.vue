<template>
  <div v-if="!page.loading">
    <PageContainer
      title="Konfigurasi"
      subtitle="Mengatur konfigurasi website..."
    >
      <div class="grid grid-cols-3 gap-4">
        <FormCard title="Konfigurasi" :icon="Users" class="col-span-3">
          <div class="space-y-8">
            <div class="flex space-x-4 mt-6">
              <div class="flex-col space-y-4">
                <div
                  class="h-7"
                  v-for="setting in settingsData"
                  v-bind:key="setting.name"
                >
                  <SwitchInput
                    :label="parseSettingMessage(setting.name)"
                    :is-active="setting.value"
                    @switch="
                      (newVal) => {
                        handleSettingChange(setting.name, newVal);
                      }
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </FormCard>
      </div>
    </PageContainer>
  </div>
  <div v-else>
    <DefaultSkeleton class="mb-2" />
    <DefaultSkeleton class="mb-2" />
    <DefaultSkeleton class="mb-2" />
  </div>
</template>

<script setup>
import { Users } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import PageContainer from "@/views/PageContainer.vue";
import { axios } from "@/sdk/axios";
import FormCard from "@/components/Card/FormCard.vue";
import SwitchInput from "@/components/Input/SwitchInput.vue";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import DefaultSkeleton from "@/components/Skeleton/DefaultSkeleton.vue";
import usePage from "@/stores/usePage";
import { useRoute } from "vue-router";

const settingsData = ref();

const auth = useAuth();
const toast = useToast();
const page = usePage();
const route = useRoute();

onMounted(() => {
  page.loading = true;

  // await fetchSettings();
});

const handleSettingChange = (name, value) => {
  axios
    .put(
      `${process.env.VUE_APP_API_BASE_URL}/api/settings`,
      {
        shop_id: auth.shopId,
        name: name,
        value: value,
      },
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
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
        toast.message = "Sukses";
        toast.description = response.data.message;
        toast.type = "SUCCESS";
        toast.trigger();
      }
    });
};

const fetchSettings = () => {
  axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/settings?shop_id=${auth.shopId}`,
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
    )
    .then(({ data }) => {
      settingsData.value = data.data.map((item) => {
        switch (item.name) {
          case "enable-tax":
            settingsData.value.enableTax = true;
            break;
          case "enable-open-bill":
            settingsData.value.enableOpenBill = false;
            break;
          case "enable-input-customer":
            settingsData.value.enableInputCustomer = true;
            break;
          case "enable-input-table-number":
            settingsData.value.enableInputTableNumber = true;
            break;
        }
      });
    });
};

const parseSettingMessage = (name) => {
  switch (name) {
    case "enable-tax":
      return "Aktifkan pajak ketika melakukan checkout pesanan";
    case "enable-open-bill":
      return "Aktifkan open bill ketika melakukan checkout pesanan";
    case "enable-input-customer":
      return "Tambah input nama customer ketika checkout pesanan";
    case "enable-input-table-number":
      return "Tambah input nomor meja ketika checkout pesanan";
  }
};
</script>
