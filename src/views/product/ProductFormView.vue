<template>
  <PageContainer
    :title="isEdit ? 'Ubah Produk' : 'Tambah Produk'"
    :subtitle="isEdit ? 'Mengubah detail produk...' : 'Menambah produk baru...'"
    enable-back
    @back="$emit('formBack')"
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
              type="text"
              currency
              placeholder="Masukkan harga modal..."
              class="col-span-2 lg:col-span-1"
            />
            <TextInput
              v-model="form.sellingRetailPrice"
              name="selling_retail_price"
              label="Harga Retail"
              type="text"
              currency
              placeholder="Masukkan harga retail..."
              class="col-span-2 lg:col-span-1"
            />
            <TextInput
              v-model="form.sellingPrice"
              name="selling_price"
              label="Harga Jual"
              type="text"
              currency
              placeholder="Masukkan harga jual..."
              class="col-span-2 lg:col-span-1"
            />
            <TextInput
              v-model="form.discountPrice"
              name="discount_price"
              label="Diskon"
              type="text"
              currency
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
            <SelectInput
              v-model="form.type"
              name="type"
              label="Tipe Produk"
              :list="typeList"
              class="col-span-2 lg:col-span-1"
            />
            <SelectInput
              v-model="form.category"
              name="category"
              label="Kategori Produk"
              :list="categoryList"
              class="col-span-2 lg:col-span-1"
            />
            <div class="col-span-2 flex justify-center">
              <FileInput
                label="Gambar"
                :acceptedFiles="['png', 'jpg', 'jpeg']"
                :clickable="true"
                dropzoneMessageClassName="dropzone-message"
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
              :label="isEdit ? 'Edit' : 'Add'"
              :icon="isEdit ? Pencil : Plus"
              class="bg-primary-700 hover:bg-primary-800"
              :disabled="loading"
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
                  :is-active="form.isActive === 1"
                  @switch="(newVal) => (form.isActive = newVal ? 1 : 0)"
                />
              </div>
            </div>
          </div>
        </FormCard>
        <FormCard
          title="Gambar Produk"
          :icon="PackageCheck"
          class="col-span-3 lg:col-span-1"
        >
          <div class="space-y-8">
            <div class="flex space-x-4">
              <div class="w-40 h-40 lg:w-64 lg:h-64 border-2 rounded-xl">
                <img
                  class="w-full h-full"
                  v-lazy="{
                    src: props.productData.imageUrl,
                    loading: './img/imageLoading.svg',
                    error: './img/imageLoading.svg',
                  }"
                />
              </div>
            </div>
          </div>
        </FormCard>
        <FormCard
          v-if="productData && productData.type === 'FOODS'"
          title="Actions"
          :icon="Gavel"
          class="col-span-3 lg:col-span-1"
        >
          <div class="space-y-8">
            <div class="flex space-x-4 mt-4">
              <div class="h-7">
                <CustomButton
                  size="full"
                  label="Atur Bahan Baku"
                  :icon="FileBox"
                  class="bg-primary-700 hover:bg-primary-800"
                  @click="modal.open()"
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
  Receipt,
} from "lucide-vue-next";
import { ref, onMounted, defineAsyncComponent, reactive } from "vue";
import PageContainer from "@/views/PageContainer.vue";
import { axios } from "@/sdk/axios";
import FormCard from "@/components/Card/FormCard.vue";
import CustomButton from "@/components/Button/CustomButton.vue";
import SwitchInput from "@/components/Input/SwitchInput.vue";
import useToast from "@/stores/useToast";
import useAuth from "@/stores/useAuth";
import useModal from "@/stores/useModal";
import IngredientBody from "@/components/Modal/Body/IngredientBody.vue";
import useIngredient from "@/stores/useIngredient";
import FileInput from "@/components/Input/File/FileInput.vue";
import SelectInput from "@/components/Input/SelectInput.vue";
import helpers from "@/helpers";

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

const emit = defineEmits(["formBack", "submitSuccess"]);

const auth = useAuth();
const toast = useToast();
const modal = useModal();
const ingredient = useIngredient();

const typeList = [
  {
    label: "Makanan",
    code: "FOODS",
  },
  {
    label: "Barang",
    code: "GOODS",
  },
  {
    label: "Jasa (jumlah)",
    code: "SERVICE",
  },
  {
    label: "Jasa (waktu)",
    code: "SERVICE TIME",
  },
];

const loading = ref(false);
const categoryList = ref([]);

const form = reactive({
  sku: props.productData ? props.productData.sku : "",
  name: props.productData ? props.productData.name : "",
  sellingRetailPrice: props.productData
    ? helpers.parseRupiah(props.productData.sellingRetailPrice)
    : 0,
  capitalPrice: props.productData
    ? helpers.parseRupiah(props.productData.capitalPrice)
    : 0,
  sellingPrice: props.productData
    ? helpers.parseRupiah(props.productData.sellingPrice)
    : 0,
  discountPrice: props.productData
    ? helpers.parseRupiah(props.productData.discountPrice)
    : 0,
  stock: props.productData ? props.productData.stock : 0,
  type: props.productData ? props.productData.type : "",
  category: props.productData ? props.productData.category.code : "",
  barcode: props.productData ? props.productData.barcode : "",
  isActive: props.productData ? (props.productData.isActive ? 1 : 0) : 0,
  image: props.productData ? props.productData.image : null,
});

onMounted(() => {
  fetchCategories();

  modal.title = "Atur Bahan Baku";
  modal.icon = Receipt;
  modal.body = IngredientBody;

  ingredient.sku = props.productData ? props.productData.sku : "";
  ingredient.used = props.productData ? props.productData.ingredients : [];
});

const submitProduct = async () => {
  if (validateForm()) {
    loading.value = true;

    if (props.isEdit) {
      axios
        .put(
          `${process.env.VUE_APP_API_BASE_URL}/api/products`,
          {
            shop_id: auth.shopId,
            sku: form.sku,
            name: form.name,
            selling_retail_price: form.sellingRetailPrice,
            selling_price: form.sellingPrice,
            capital_price: form.capitalPrice,
            type: form.type,
            stock: form.stock,
            category: form.category,
            barcode: form.barcode,
            status: form.isActive,
            image: form.image,
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
        })
        .finally(() => {
          loading.value = false;
        });
    } else {
      axios
        .post(
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
            status: form.isActive,
            image: form.image,
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
        })
        .finally(() => {
          loading.value = false;
        });
    }
  }
};

const validateForm = () => {
  let isValid = true;
  const notRequired = ["image"];

  const filteredForm = Object.keys(form).filter(
    (item) => notRequired.indexOf(item) === -1
  );

  filteredForm.forEach((field) => {
    if (form[field] === null) {
      toast.message = "Gagal";
      toast.description = `Kolom ${field} harus diisi!`;
      toast.type = "FAILED";
      toast.trigger();

      isValid = false;
    }
  });

  return isValid;
};

const fetchCategories = () => {
  axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/products/categories?shop_id=${auth.shopId}`,
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
    )
    .then(({ data }) => {
      categoryList.value = data.data.map((category) => ({
        code: category.code,
        label: category.name,
      }));
    });
};
</script>

<style>
.dropzone-message {
  @apply flex-grow text-center mt-3;
}

.dropzone-message::after {
  content: " or click (.png, .jpg, .jpeg)";
}

.dropzone__progress {
  display: none;
}
</style>
