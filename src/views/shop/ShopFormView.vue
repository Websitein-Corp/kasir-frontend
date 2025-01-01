<template>
  <PageContainer
    :title="isEdit ? 'Ubah Toko' : 'Tambah Toko'"
    :subtitle="isEdit ? 'Mengubah detail toko...' : 'Menambah toko baru...'"
    enable-back
    @back="$emit('formBack')"
  >
    <div class="grid grid-cols-3 gap-4">
      <div class="col-span-3 lg:col-span-2 flex flex-col gap-4">
        <FormCard title="Informasi Toko" :icon="Store">
          <div class="space-y-8">
            <div class="grid grid-cols-2 gap-4">
              <TextInput
                v-model="form.name"
                name="name"
                label="Nama"
                placeholder="Masukkan nama..."
                class="col-span-2 lg:col-span-1"
              />
              <TextInput
                v-model="form.address"
                name="address"
                label="Alamat"
                placeholder="Masukkan alamat..."
                class="col-span-2 lg:col-span-1"
              />
              <TextInput
                v-model="form.balance"
                type="text"
                name="balance"
                label="Saldo"
                currency
                disabled
                placeholder="Rp 0,00"
                class="col-span-2 lg:col-span-1"
              />
              <div class="col-span-2 flex justify-center">
                <FileInput
                  label="Gambar"
                  :acceptedFiles="['png', 'jpg', 'jpeg']"
                  :clickable="true"
                  @addedFile="
                    (file) => {
                      form.image = file.file;
                    }
                  "
                />
              </div>
            </div>
            <div class="flex justify-center pt-4">
              <CustomButton
                size="xl"
                :label="isEdit ? 'Save' : 'Add'"
                :icon="isEdit ? Save : Plus"
                class="bg-primary-700 hover:bg-primary-800"
                :loading="page.buttonLoading"
                @click="submitShop"
              />
            </div>
          </div>
        </FormCard>
        <FormCard title="Konfigurasi Toko" :icon="ShoppingBag">
          <div class="space-y-8">
            <div class="flex space-x-4 mt-6">
              <div class="flex-col space-y-4">
                <template
                  v-for="(setting, index) in form.settings"
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
                          (newVal) => (form.settings[index].value = newVal)
                        "
                      />
                      <span>Pajak Pelanggan</span>
                    </div>
                    <SwitchInput
                      v-else
                      :label="setting.label"
                      :is-active="form.settings[index].value === 1"
                      @switch="
                        (newVal) =>
                          (form.settings[index].value = newVal ? 1 : 0)
                      "
                    />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </FormCard>
      </div>
      <FormCard
        title="Logo Toko"
        :icon="Image"
        v-if="props.shopData"
        class="col-span-3 lg:col-span-1"
      >
        <div class="space-y-8">
          <div class="flex justify-center space-x-4">
            <div
              class="m-10 w-fit h-fit lg:w-fit lg:h-fit rounded-xl"
              :class="{
                '!m-0 !w-40 !h-40 lg:!w-64 lg:!h-64': !props.shopData.imageUrl,
              }"
            >
              <img
                class="w-full h-full object-cover"
                v-lazy="{
                  src: props.shopData.imageUrl,
                  loading: './img/imageLoading.svg',
                  error: './img/imageLoading.svg',
                  log: false,
                }"
              />
            </div>
          </div>
          <CustomButton
            v-if="isEdit && props.shopData.imageUrl"
            size="full"
            label="Hapus"
            :icon="Trash"
            class="bg-red-700 hover:bg-red-800"
            @click="deleteImage"
          />
        </div>
      </FormCard>
    </div>
  </PageContainer>
</template>

<script setup>
import { Plus, ShoppingBag, Store, Save, Image, Trash } from "lucide-vue-next";
import { defineAsyncComponent, reactive, ref } from "vue";
import PageContainer from "@/views/PageContainer.vue";
import { axios } from "@/sdk/axios";
import FormCard from "@/components/Card/FormCard.vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import SwitchInput from "@/components/Input/SwitchInput.vue";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import usePage from "@/stores/usePage";
import NumberInput from "@/components/Input/NumberInput.vue";
import FileInput from "@/components/Input/File/FileInput.vue";
import Compressor from "compressorjs";

const TextInput = defineAsyncComponent(() =>
  import("@/components/Input/TextInput.vue")
);

const props = defineProps({
  shopData: {
    type: Object,
    default: null,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["formBack", "submitSuccess"]);

const auth = useAuth();
const toast = useToast();
const page = usePage();

const shopData = ref(props.shopData);

const form = reactive({
  shop_id: shopData.value ? shopData.value.id : "",
  name: shopData.value ? shopData.value.name : "",
  address: shopData.value ? shopData.value.address : "",
  balance: shopData.value ? shopData.value.balance : 0,
  settings: shopData.value
    ? shopData.value.settings
    : [
        {
          name: "tax_amount",
          label: "Aktifkan Pajak untuk Customer",
          value: 0.0,
        },
        {
          name: "open_bill",
          label: "Fitur Open Bill",
          value: 0,
        },
        {
          name: "customer_input",
          label: "Fitur Nama Customer pada Transaksi",
          value: 0,
        },
        {
          name: "table_number_input",
          label: "Fitur Nomor Meja pada Transaksi",
          value: 0,
        },
        {
          name: "shop_payment_fee",
          label: "Biaya Metode Pembayaran oleh Toko",
          value: 0,
        },
      ],
  image: shopData.value ? shopData.value.image : null,
});

const submitShop = async () => {
  if (validateForm()) {
    page.buttonLoading = true;

    if (props.isEdit) {
      const data = {
        shop_id: form.shop_id,
        address: form.address,
        name: form.name,
        tax_amount: form.settings[0].value,
        open_bill: form.settings[1].value,
        customer_input: form.settings[2].value,
        table_number_input: form.settings[3].value,
        shop_payment_fee: form.settings[4].value,
        delete_image_flag: 0,
      };

      if (form.image) {
        new Compressor(form.image, {
          quality: 0.6,
          success(compressedImage) {
            data["image"] = compressedImage;

            axios
              .post(
                `${process.env.VUE_APP_API_BASE_URL}/api/shops/edit`,
                data,
                {
                  headers: {
                    Authorization: `Bearer ${auth.authToken}`,
                    "Content-Type": "multipart/form-data",
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

                  if (response.data.data.name === auth.shopName) {
                    const shopData = response.data.data;
                    const shopImageReceipt = shopData.settings.find(
                      (item) => item.name === "shop_image_receipt"
                    ).value;
                    console.log(shopImageReceipt);

                    auth.setShopId(
                      auth.shopId,
                      shopData.name,
                      shopData.address,
                      shopData.image_url,
                      shopImageReceipt
                    );
                  }

                  emit("submitSuccess");
                }
              });
          },
          error() {
            toast.message = "Gagal";
            toast.description = "Gagal mengunduh gambar!";
            toast.type = "FAILED";
            toast.trigger();

            page.buttonLoading = false;
          },
        });
      } else {
        axios
          .post(`${process.env.VUE_APP_API_BASE_URL}/api/shops/edit`, data, {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          })
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

              emit("submitSuccess");
            }
          });
      }
    } else {
      const data = {
        address: form.address,
        name: form.name,
        balance: form.balance,
        settings: form.settings,
        delete_image_flag: 0,
      };

      if (form.image) {
        new Compressor(form.image, {
          quality: 0.6,
          success(compressedImage) {
            data["image"] = compressedImage;

            axios
              .post(
                `${process.env.VUE_APP_API_BASE_URL}/api/shops`,
                {
                  address: form.address,
                  name: form.name,
                  balance: form.balance,
                  settings: form.settings,
                },
                {
                  headers: {
                    Authorization: `Bearer ${auth.authToken}`,
                    "Content-Type": "multipart/form-data",
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

                  emit("submitSuccess");
                }
              });
          },
          error() {
            toast.message = "Gagal";
            toast.description = "Gagal mengunduh gambar!";
            toast.type = "FAILED";
            toast.trigger();

            page.buttonLoading = false;
          },
        });
      } else {
        if (form.image) {
          new Compressor(form.image, {
            quality: 0.6,
            success(compressedImage) {
              data["image"] = compressedImage;

              axios
                .post(
                  `${process.env.VUE_APP_API_BASE_URL}/api/shops`,
                  {
                    address: form.address,
                    name: form.name,
                    balance: form.balance,
                    settings: form.settings,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${auth.authToken}`,
                      "Content-Type": "multipart/form-data",
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

                    emit("submitSuccess");
                  }
                });
            },
            error() {
              toast.message = "Gagal";
              toast.description = "Gagal mengunduh gambar!";
              toast.type = "FAILED";
              toast.trigger();

              page.buttonLoading = false;
            },
          });
        } else {
          axios
            .post(
              `${process.env.VUE_APP_API_BASE_URL}/api/shops`,
              {
                address: form.address,
                name: form.name,
                balance: form.balance,
                settings: form.settings,
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

                emit("submitSuccess");
              }
            });
        }
      }
    }
  }
};

const validateForm = () => {
  let isValid = true;
  const notRequired = ["balance", "image"];

  const filteredForm = Object.keys(form).filter(
    (item) => notRequired.indexOf(item) === -1
  );

  filteredForm.forEach((field) => {
    if (!form[field] && field !== "shop_id") {
      if (!props.isEdit) {
        toast.message = "Gagal";
        toast.description = `Kolom ${field} harus diisi!`;
        toast.type = "FAILED";
        toast.trigger();

        isValid = false;
      }
    }
  });

  return isValid;
};

const deleteImage = () => {
  const data = {
    shop_id: form.shop_id,
    address: form.address,
    name: form.name,
    tax_amount: form.settings[0].value,
    open_bill: form.settings[1].value,
    customer_input: form.settings[2].value,
    table_number_input: form.settings[3].value,
    shop_payment_fee: form.settings[4].value,
    delete_image_flag: 1,
  };

  axios
    .post(`${process.env.VUE_APP_API_BASE_URL}/api/shops/edit`, data, {
      headers: {
        Authorization: `Bearer ${auth.authToken}`,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
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

        if (response.data.data.name === auth.shopName) {
          const shopData = response.data.data;
          const shopImageReceipt = shopData.settings.find(
            (item) => item.name === "shop_image_receipt"
          ).value;

          auth.setShopId(
            auth.shopId,
            shopData.name,
            shopData.address,
            shopData.image_url,
            shopImageReceipt
          );
        }

        shopData.value.imageUrl = null;
      }
    });
};
</script>
