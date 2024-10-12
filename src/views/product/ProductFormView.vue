<template>
  <PageContainer
    :title="isEdit ? 'Ubah Produk' : 'Tambah Produk'"
    :subtitle="isEdit ? 'Mengubah detail produk...' : 'Menambah produk baru...'"
    enable-back
    @back="$emit('closeForm')"
  >
    <div class="grid grid-cols-3 gap-4">
      <FormCard
        title="Informasi Produk"
        :icon="Package"
        class="col-span-3 lg:col-span-2"
      >
        <div class="space-y-8">
          <div class="grid grid-cols-2 gap-4">
            <TextInput
              v-model="form.sku"
              name="sku"
              label="SKU"
              placeholder="Masukkan SKU..."
              class="col-span-2 lg:col-span-1"
            />
            <TextInput
              v-model="form.barcode"
              name="barcode"
              label="Barcode"
              placeholder="Masukkan Barcode..."
              class="col-span-2 lg:col-span-1"
            />
            <TextInput
              v-model="form.name"
              name="name"
              label="Nama"
              placeholder="Masukkan nama..."
              class="col-span-2 lg:col-span-1"
            />
            <TextInput
              v-model="form.capitalPrice"
              name="capital_price"
              label="Harga Modal"
              type="number"
              placeholder="Masukkan harga modal..."
              class="col-span-2 lg:col-span-1"
            />
            <TextInput
              v-model="form.sellingRetailPrice"
              name="selling_retail_price"
              label="Harga Retail"
              type="number"
              placeholder="Masukkan harga retail..."
              class="col-span-2 lg:col-span-1"
            />
            <TextInput
              v-model="form.sellingPrice"
              name="selling_price"
              label="Harga"
              type="number"
              placeholder="Masukkan harga..."
              class="col-span-2 lg:col-span-1"
            />
            <TextInput
              v-model="form.discountPrice"
              name="discount_price"
              label="Diskon"
              type="number"
              placeholder="Masukkan diskon..."
              class="col-span-2 lg:col-span-1"
            />
            <TextInput
              v-model="form.stock"
              name="stock"
              label="Stok"
              type="number"
              placeholder="Masukkan stok..."
              class="col-span-2 lg:col-span-1"
            />
            <TextInput
              v-model="form.type"
              name="type"
              label="Tipe Produk"
              placeholder="Masukkan tipe produk..."
              class="col-span-2 lg:col-span-1"
            />
            <TextInput
              v-model="form.category"
              name="category"
              label="Kategori Produk"
              placeholder="Masukkan kategori produk..."
              class="col-span-2 lg:col-span-1"
            />
          </div>
          <div class="flex justify-center pt-4">
            <CustomButton
              size="xl"
              :label="isEdit ? 'Edit' : 'Add'"
              :icon="isEdit ? Pencil : Plus"
              class="bg-primary-700 hover:bg-primary-800"
              @click="submitProduct"
            />
          </div>
        </div>
      </FormCard>
      <div class="col-span-3 lg:col-span-1 flex flex-col gap-4">
        <FormCard
          title="Status Produk"
          :icon="PackageCheck"
          class="col-span-3 lg:col-span-1"
        >
          <div class="space-y-8">
            <div class="flex space-x-4 mt-4">
              <div class="h-7">
                <SwitchInput
                  :is-active="form.isActive"
                  @switch="(newVal) => (form.isActive = newVal)"
                />
              </div>
            </div>
          </div>
        </FormCard>
        <FormCard
          title="Actions"
          :icon="Gavel"
          class="col-span-3 lg:col-span-1"
        >
          <div class="space-y-8">
            <div class="flex space-x-4 mt-4">
              <div class="h-7">
                <CustomButton
                  size="xl"
                  label="Atur Bahan Baku"
                  :icon="FileBox"
                  class="bg-primary-700 hover:bg-primary-800"
                  @click="submitProduct"
                />
              </div>
            </div>
          </div>
        </FormCard>
      </div>
    </div>
  </PageContainer>
</template>

<script setup>
import {
  FileBox,
  PackageCheck,
  Package,
  Plus,
  Gavel,
  Pencil,
} from "lucide-vue-next";
import { ref, onMounted, defineAsyncComponent, reactive } from "vue";
import PageContainer from "@/views/PageContainer.vue";
import axios from "axios";
import FormCard from "@/components/Card/FormCard.vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import SwitchInput from "@/components/Input/SwitchInput.vue";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";

const TextInput = defineAsyncComponent(() =>
  import("@/components/Input/TextInput.vue")
);

const props = defineProps({
  productData: {
    type: Object,
    default: null,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["closeForm"]);

const auth = useAuth();
const toast = useToast();

const categoryList = ref([]);

const form = reactive({
  sku: props.productData ? props.productData.sku : "",
  name: props.productData ? props.productData.name : "",
  sellingRetailPrice: props.productData
    ? props.productData.sellingRetailPrice
    : 0,
  capitalPrice: props.productData ? props.productData.capitalPrice : 0,
  sellingPrice: props.productData ? props.productData.sellingPrice : 0,
  discountPrice: props.productData ? props.productData.discountPrice : 0,
  stock: props.productData ? props.productData.stock : 0,
  imageUrl: props.productData ? props.productData.imageUrl : "",
  type: props.productData ? props.productData.type : "",
  category: props.productData ? props.productData.category.code : "",
  barcode: props.productData ? props.productData.barcode : "",
  isActive: props.productData ? props.productData.isActive : false,
  image: props.productData ? props.productData.image : null,
});

onMounted(() => {
  fetchCategories();
});

const submitProduct = async () => {
  if (validateForm()) {
    let response;

    if (props.isEdit) {
      response = await axios.put(
        `${process.env.VUE_APP_API_BASE_URL}/api/products`,
        {
          shop_id: auth.shopId,
          sku: form.sku,
          name: form.name,
          selling_retail_price: form.sellingRetailPrice,
          selling_price: form.sellingPrice,
          capital_price: form.capitalPrice,
          stock: form.stock,
          type: form.type,
          category: form.category,
          barcode: form.barcode,
          is_active: form.isActive,
          image: form.image,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
          withCredentials: true,
        }
      );
    } else {
      response = await axios.post(
        `${process.env.VUE_APP_API_BASE_URL}/api/products`,
        {
          shop_id: auth.shopId,
          sku: form.sku,
          name: form.name,
          selling_retail_price: form.sellingRetailPrice,
          selling_price: form.sellingPrice,
          capital_price: form.capitalPrice,
          stock: form.stock,
          type: form.type,
          category: form.category,
          barcode: form.barcode,
          is_active: form.isActive,
          image: form.image,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
          withCredentials: true,
        }
      );
    }

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

      emit("closeForm");
    }
  }
};

const validateForm = () => {
  let isValid = true;

  Object.keys(form).forEach((field) => {
    if (!form[field]) {
      toast.message = "Gagal";
      toast.description = `Kolom ${field} harus diisi!`;
      toast.type = "FAILED";
      toast.trigger();

      isValid = false;
    }
  });

  return isValid;
};

const fetchCategories = async () => {
  const { data } = await axios.get(
    `${process.env.VUE_APP_API_BASE_URL}/api/products/categories?shop_id=${auth.shopId}`,
    {
      headers: {
        Authorization: `Bearer ${auth.authToken}`,
      },
      withCredentials: true,
    }
  );

  categoryList.value = data.data;
};
</script>
