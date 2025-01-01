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
          :class="{
            'lg:col-span-3': isStandalone(),
          }"
        >
          <div class="space-y-8">
            <div class="flex space-x-4 mt-6">
              <div class="flex-col space-y-4">
                <template
                  v-for="setting in settingsData"
                  v-bind:key="setting.name"
                >
                  <div
                    class="h-7"
                    :class="{
                      '!mb-6 lg:!mb-8': setting.name === 'tax_amount',
                    }"
                  >
                    <div
                      v-if="setting.name === 'tax_amount'"
                      class="flex space-x-4 items-center text-sm lg:text-base"
                    >
                      <NumberInput
                        :model-value="setting.value || 0"
                        @update:model-value="
                          (val) => {
                            setting.value = val;
                            handleSettingChange(setting.name, val);
                          }
                        "
                      />
                      <span>Pajak Pelanggan</span>
                    </div>
                    <SwitchInput
                      v-else
                      :label="setting.label"
                      :is-active="setting.value"
                      @switch="
                        (newVal) => {
                          handleSettingChange(setting.name, newVal);
                        }
                      "
                    />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </FormCard>
        <FormCard
          v-if="!isStandalone()"
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
import { Cog, Download, Smartphone } from "lucide-vue-next";
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
import NumberInput from "@/components/Input/NumberInput.vue";

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
      console.log(response);
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

        const shopImageReceipt = response.data.data.find(
          (item) => item.name === "shop_image_receipt"
        ).value;
        console.log(shopImageReceipt);

        auth.setShopId(
          auth.shopId,
          auth.shopName,
          auth.shopAddress,
          auth.shopImageUrl,
          shopImageReceipt
        );
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

const isStandalone = () => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone ||
    document.referrer.includes("android-app://")
  );
};
</script>
