<template>
  <PageContainer
    :title="isEdit ? 'Ubah Toko' : 'Tambah Toko'"
    :subtitle="isEdit ? 'Mengubah detail toko...' : 'Menambah toko baru...'"
    enable-back
    @back="$emit('formBack')"
  >
    <div class="grid grid-cols-3 gap-4">
      <FormCard
        title="Informasi Toko"
        :icon="Store"
        class="col-span-3 lg:col-span-2"
      >
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
          </div>
          <div class="flex justify-center pt-4">
            <CustomButton
              size="xl"
              :label="isEdit ? 'Edit' : 'Add'"
              :icon="isEdit ? Pencil : Plus"
              class="bg-primary-700 hover:bg-primary-800"
              :loading="page.buttonLoading"
              @click="submitShop"
            />
          </div>
        </div>
      </FormCard>
      <FormCard
        title="Konfigurasi Toko"
        :icon="ShoppingBag"
        class="col-span-3 lg:col-span-1"
      >
        <div class="space-y-8">
          <div class="flex space-x-4 mt-6">
            <div class="flex-col space-y-4">
              <SwitchInput
                v-for="(setting, index) in form.settings"
                v-bind:key="setting.name"
                :label="setting.label"
                :is-active="form.settings[index].value"
                @switch="(newVal) => (form.settings[index].value = newVal)"
              />
            </div>
          </div>
        </div>
      </FormCard>
    </div>
  </PageContainer>
</template>

<script setup>
import { Plus, Pencil, ShoppingBag, Store } from "lucide-vue-next";
import { defineAsyncComponent, reactive } from "vue";
import PageContainer from "@/views/PageContainer.vue";
import { axios } from "@/sdk/axios";
import FormCard from "@/components/Card/FormCard.vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import SwitchInput from "@/components/Input/SwitchInput.vue";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import usePage from "@/stores/usePage";

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

const form = reactive({
  shop_id: props.shopData ? props.shopData.id : "",
  name: props.shopData ? props.shopData.name : "",
  address: props.shopData ? props.shopData.address : "",
  balance: props.shopData ? props.shopData.balance : 0,
  settings: props.shopData
    ? props.shopData.settings
    : [
        {
          name: "active_tax_flag",
          label: "Aktifkan Pajak untuk Customer",
          value: false,
        },
        {
          name: "open_bill",
          label: "Fitur Open Bill",
          value: false,
        },
        {
          name: "customer_input",
          label: "Fitur Nama Customer pada Transaksi",
          value: false,
        },
        {
          name: "table_number_input",
          label: "Fitur Nomor Meja pada Transaksi",
          value: false,
        },
        {
          name: "shop_payment_fee",
          label: "Biaya Metode Pembayaran oleh Toko",
          value: false,
        },
      ],
});

const submitShop = async () => {
  if (validateForm()) {
    page.buttonLoading = true;

    if (props.isEdit) {
      axios
        .put(
          `${process.env.VUE_APP_API_BASE_URL}/api/shops`,
          {
            shop_id: form.shop_id,
            address: form.address,
            name: form.name,
            active_tax_flag: form.settings[0].value,
            open_bill: form.settings[1].value,
            customer_input: form.settings[2].value,
            table_number_input: form.settings[3].value,
            shop_payment_fee: form.settings[4].value,
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
};

const validateForm = () => {
  let isValid = true;
  const notRequired = ["balance"];

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
</script>
