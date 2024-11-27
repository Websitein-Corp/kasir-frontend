<template>
  <div v-if="!page.loading">
    <PageContainer
      title="Konfigurasi"
      subtitle="Mengatur konfigurasi website..."
    >
      <div class="grid grid-cols-3 gap-4">
        <FormCard
          title="Konfigurasi"
          :icon="Cog"
          class="col-span-3 lg:col-span-2"
        >
          <div class="space-y-8">
            <div class="flex space-x-4 mt-6">
              <div class="flex-col space-y-4">
                <div
                  class="h-7"
                  v-for="setting in settingsData"
                  v-bind:key="setting.name"
                >
                  <SwitchInput
                    :label="setting.label"
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
        <FormCard
          title="Aplikasi"
          :icon="Smartphone"
          class="col-span-3 lg:col-span-1"
        >
          <div class="space-y-6 p-4">
            <div>
              Sudah punya aplikasi Mobile Kasirin? Jika belum Anda dapat
              mengunduhnya dengan menekan tombol di bawah!
            </div>
            <CustomButton
              size="full"
              iconSide="left"
              label="Unduh"
              class="bg-transparent hover:bg-slate-100 !text-primary-800 border-2 border-primary-700 hover:border-primary-800"
              :icon="Download"
              @click="installPwa"
            />
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
import { Cog, Download, Smartphone, Users } from "lucide-vue-next";
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
import usePwa from "@/stores/usePwa";
import CustomButton from "@/components/Button/CustomButton.vue";

const settingsData = ref();

const auth = useAuth();
const toast = useToast();
const page = usePage();
const pwa = usePwa();
const route = useRoute();

onMounted(() => {
  page.loading = true;

  fetchSettings();
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
      settingsData.value = data.data;
    });
};

const installPwa = () => {
  if (pwa.deferredPrompt) {
    pwa.deferredPrompt.prompt();
    pwa.deferredPrompt.userChoice.then(() => {
      pwa.deferredPrompt = null;
      pwa.isInstallable = false;
    });
  }
};
</script>
