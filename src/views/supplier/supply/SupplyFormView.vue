<template>
  <PageContainer
    title="Supply Detail"
    subtitle="Daftar supply yang ada..."
    enable-back
    @back="$emit('formBack')"
  >
    <!-- Apply a max-height to the form and enable scrolling -->
    <form
      @submit.prevent="handleSubmit"
      class="h-[95vh] overflow-y-auto scrollbar-hide"
    >
      <!-- Supplier Detail -->
      <FormCard
        class="form-section scrollbar-hide"
        title="Detail Supplier"
        :icon="Truck"
      >
        <!-- If not editing, show input field for supplier name -->
        <div v-if="!isEdit">
          <div class="flex flex-row justify-between space-x-4 mt-4">
            <div class="w-1/2">
              <label
                for="supplier_id"
                class="pb-2 text-primary-600 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:text-sm"
                >Supplier</label
              >
              <select
                v-model="supplierDetail.id"
                name="supplier_id"
                required
                class="peer w-full border-b rounded-lg placeholder:text-transparent p-4 focus:outline-none focus:ring-2 ring-primary-600 transition-all"
                :class="{
                  'ring-2': modelValue,
                  'cursor-not-allowed !bg-white !ring-slate-500 !text-slate-500':
                    disabled,
                }"
              >
                <option value="" disabled>Select a supplier</option>
                <option
                  v-for="supplier in supplierList"
                  :key="supplier.id"
                  :value="supplier.id"
                >
                  {{ supplier.name }}
                </option>
              </select>
            </div>
            <TextInput
              v-model="supplierDetail.supply_id"
              type="text"
              name="supply_id"
              label="Supply ID"
              placeholder="Enter Supply ID"
              class="w-1/2"
              :pattern="generalPattern"
            />
          </div>
          <div class="flex flex-row justify-between space-x-4 mt-4">
            <div class="w-1/2">
              <label
                for="due_date"
                class="pb-2 text-primary-600 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:text-sm"
                >Tenggat Waktu</label
              >
              <DatetimeInput
                v-model="supplierDetail.due_date"
                name="due_date"
                type="date"
                label="Tenggat Waktu"
                required
              />
            </div>
            <TextInput
              :value="totalPrice"
              v-model="supplierDetail.total_price"
              name="total_price"
              currency
              label="Total Harga"
              placeholder="Enter total price"
              readonly
              class="w-1/2"
              :pattern="generalPattern"
            />
          </div>
          <div class="w-1/2 mt-4">
            <select
              v-model="paymentType"
              name="type"
              required
              class="peer w-full border-b rounded-lg placeholder:text-transparent p-4 focus:outline-none focus:ring-2 ring-primary-600 transition-all"
              :class="{
                'ring-2': modelValue,
                'cursor-not-allowed !bg-white !ring-slate-500 !text-slate-500':
                  disabled,
              }"
            >
              <option value="" disabled>Pilih Tipe Pembayaran</option>
              <option
                v-for="item in paymentTypeList"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </option>
            </select>
          </div>
        </div>

        <div v-else class="flex flex-col space-y-2">
          <p><strong>Supply ID:</strong> {{ supplierDetail.id }}</p>
          <p><strong>Supplier:</strong> {{ supplierDetail.supplier }}</p>
          <div class="flex flex-row justify-between space-x-4 mt-4">
            <TextInput
              v-model="statusLabel"
              name="status"
              type="text"
              label="Status Pembayaran"
              readonly
              class="w-1/2"
              :pattern="generalPattern"
            />
            <TextInput
              v-model="supplierDetail.tr_datetime"
              name="tr_datetime"
              label="Tanggal Transaksi"
              type="text"
              readonly
              class="w-1/2"
              :pattern="generalPattern"
            />
          </div>
          <div class="flex flex-row justify-between space-x-4 mt-4">
            <TextInput
              v-model="supplierDetail.due_date"
              name="due_date"
              type="text"
              label="Tenggat Waktu"
              readonly
              class="w-1/2"
              :pattern="generalPattern"
            />
            <TextInput
              v-model="supplierDetail.total_price"
              name="total_price"
              label="Total Harga"
              type="text"
              currency
              readonly
              class="w-1/2"
              :pattern="generalPattern"
            />
          </div>
          <div>
            <TextInput
              v-model="supplierDetail.paid_amount"
              name="paid_amount"
              label="Jumlah yang Dibayar"
              type="text"
              currency
              readonly
              :pattern="generalPattern"
            />
            <TextInput
              v-model="supplierDetail.remaining_amount"
              name="remaining_amount"
              label="Sisa Pembayaran"
              type="text"
              currency
              readonly
              :pattern="generalPattern"
            />
            <TextInput
              v-model="supplierDetail.installment_batch"
              name="installment_batch"
              label="Cicilan ke-"
              type="text"
              readonly
              :pattern="generalPattern"
            />
          </div>
        </div>

        <div
          class="flex flex-col mt-4"
          v-if="
            isEdit &&
            (supplierDetail.status === 'NOT_PAID' ||
              supplierDetail.status === 'PARTIALLY_PAID')
          "
        >
          <div class="h-1 bg-slate-300 rounded-full w-full"></div>
          <TextInput
            v-model="payAmount"
            name="payAmount"
            type="number"
            label="Jumlah Bayar"
            :pattern="generalPattern"
            currency
            class="w-full"
            @focus="resetIfDefault('payAmount', null)"
          />

          <CustomButton class="w-1/4 mt-4 bg-primary-600" type="submit">
            Update Pembayaran
          </CustomButton>
        </div>
      </FormCard>

      <!-- Product/Ingredient Detail -->
      <FormCard
        v-for="(product, index) in productDetails"
        :key="index"
        class="form-section mt-8 relative"
        title="Detail Produk/Bahan Baku"
        :icon="Box"
      >
        <button
          v-if="!isEdit"
          type="button"
          class="text-red-600 hover:text-red-800 absolute top-2 right-2 font-bold"
          @click="removeProduct(index)"
          title="Remove"
        >
          ✕
        </button>
        <div v-if="isEdit">
          <div class="flex flex-row justify-between space-x-4 mt-4">
            <TextInput
              v-model="product.type"
              name="type"
              type="text"
              label="Tipe Produk"
              readonly
              class="w-1/2"
              :pattern="generalPattern"
            />
            <TextInput
              v-model="product.sku"
              name="sku"
              label="SKU"
              type="text"
              readonly
              class="w-1/2"
              :pattern="generalPattern"
            />
          </div>
          <div class="flex flex-row justify-between space-x-4 mt-4">
            <TextInput
              v-model="product.amount"
              name="amount"
              type="number"
              label="Jumlah"
              readonly
              class="w-1/2"
              :pattern="generalPattern"
            />
            <TextInput
              v-model="product.capital_price"
              name="capital_price"
              label="Harga Modal"
              type="text"
              currency
              readonly
              class="w-1/2"
              :pattern="generalPattern"
            />
          </div>
          <TextInput
            v-model="product.total_price"
            name="total_price"
            label="Total Harga"
            type="text"
            currency
            readonly
            class="w-1/2"
            :pattern="generalPattern"
          />
        </div>
        <div v-else>
          <div class="flex flex-row justify-between space-x-4">
            <div class="w-1/2">
              <label
                for="type"
                class="pb-2 text-primary-600 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:text-sm"
                >Tipe Produk</label
              >
              <select
                v-model="product.type"
                @change="resetSku(index)"
                name="type"
                required
                class="peer w-full border-b rounded-lg placeholder:text-transparent p-4 focus:outline-none focus:ring-2 ring-primary-600 transition-all"
                :class="{
                  'ring-2': modelValue,
                  'cursor-not-allowed !bg-white !ring-slate-500 !text-slate-500':
                    disabled,
                }"
              >
                <option value="" disabled>Pilih Tipe Produk</option>
                <option
                  v-for="item in typeList"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </option>
              </select>
            </div>
            <div class="w-1/2 relative">
              <label
                for="sku"
                class="pb-2 text-primary-600 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:text-sm"
                >SKU</label
              >
              <!-- Dropdown Wrapper -->
              <div
                @click="toggleDropdown(index)"
                class="peer w-full border-b rounded-lg p-4 focus:outline-none focus:ring-2 ring-primary-600 transition-all cursor-pointer relative"
              >
                {{ product.displayText || "Pilih SKU" }}
                <span class="absolute right-4 top-4 text-gray-500">▼</span>
              </div>

              <div
                v-show="dropdownOpen === index"
                class="absolute z-10 w-full bg-white border rounded-lg shadow-md mt-1 max-h-60 overflow-auto"
              >
                <input
                  v-model="skuSearchQuery[index]"
                  type="text"
                  placeholder="Search SKU..."
                  class="w-full border-b px-4 py-2 focus:outline-none"
                />

                <ul>
                  <li
                    v-for="ingredient in getSkuOptions(product.type, index)"
                    :key="ingredient.name"
                    @click="selectSku(ingredient, index)"
                    class="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <span v-if="ingredient.sku"> {{ ingredient.sku }} - </span>
                    {{ ingredient.name }}
                  </li>
                  <li
                    v-if="getSkuOptions(product.type, index).length === 0"
                    class="p-2 text-gray-500"
                  >
                    SKU Tidak Ditemukan
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="flex flex-row justify-between space-x-4">
            <TextInput
              v-model="product.amount"
              name="amount"
              label="Jumlah"
              type="number"
              placeholder="Enter amount"
              required
              class="w-1/2"
              @focus="resetIfDefault('amount', index)"
            />
            <TextInput
              v-model="product.capital_price"
              name="capital_price"
              label="Harga Modal"
              type="number"
              placeholder="Enter capital price"
              currency
              required
              class="w-1/2"
              pattern="[0-9._%+-]+@[0-9.-]$"
              @focus="resetIfDefault('capital_price', index)"
            />
          </div>
        </div>
      </FormCard>

      <div
        v-if="!isEdit"
        class="flex flex-col lg:flex-row space-y-4 space-x-0 lg:space-y-0 lg:space-x-4 w-full items-center justify-center mt-8"
      >
        <CustomButton
          class="w-full lg:w-1/4 bg-primary-600"
          textSize="sm"
          type="button"
          @click="addProduct"
        >
          Tambah Produk/Bahan Baku
        </CustomButton>
        <CustomButton
          class="w-full lg:w-1/4 bg-primary-600"
          type="submit"
          :loading="page.buttonloading"
        >
          Submit
        </CustomButton>
      </div>
    </form>
  </PageContainer>
</template>

<script setup>
import {
  ref,
  onMounted,
  defineProps,
  defineAsyncComponent,
  defineEmits,
  computed,
  watch,
} from "vue";
import { axios } from "@/sdk/axios";
import CustomButton from "@/components/Button/CustomButton.vue";
import FormCard from "@/components/Card/FormCard.vue";
import DatetimeInput from "@/components/Input/DatetimeInput.vue";
import useAuth from "@/stores/useAuth";
import PageContainer from "@/views/PageContainer.vue";
import useToast from "@/stores/useToast";
import usePage from "@/stores/usePage";
import { Box, Truck } from "lucide-vue-next";

const toast = useToast();
const page = usePage();
const auth = useAuth();
const supplierList = ref([]);
const ingredientsList = ref({ products: [], ingredients: [] });
const payAmount = ref(0);
const paymentType = ref("");
const skuSearchQuery = ref([]);
const dropdownOpen = ref(false);
const generalPattern = "[0-9._%+-]+@[0-9.-]$";

const typeList = [
  {
    label: "Produk",
    value: "PRODUCT",
  },
  {
    label: "Bahan baku",
    value: "INGREDIENT",
  },
];

const paymentTypeList = [
  {
    label: "Tunai",
    value: "CASH",
  },
  {
    label: "Cicilan",
    value: "INSTALLMENT",
  },
];

const TextInput = defineAsyncComponent(() =>
  import("@/components/Input/TextInput.vue")
);

const props = defineProps({
  isEdit: Boolean,
  supplierData: Object,
});

const emit = defineEmits(["cancel", "save"]);

const totalPrice = computed(() => {
  const total = productDetails.value.reduce((sum, product) => {
    // Ensure capital_price is treated as a number
    const price = parseFloat(product.capital_price * product.amount) || 0;
    return sum + price;
  }, 0);

  return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
});

const generateRandomId = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const convertToMySQLDatetime = (isoDate) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const supplierDetail = ref({
  id: props.supplierData ? props.supplierData.id : "",
  status: props.supplierData ? props.supplierData.status : "",
  tr_datetime: props.supplierData ? props.supplierData.tr_datetime : "",
  due_date: props.supplierData ? props.supplierData.due_date : "",
  total_price: props.supplierData ? props.supplierData.total_price : "",
  supply_id: props.supplierData
    ? props.supplierData.supply_id
    : generateRandomId(),
  supplier: props.supplierData ? props.supplierData.supplier : "",
  paid_amount: props.supplierData ? props.supplierData.paid_amount : "",
  remaining_amount: props.supplierData
    ? props.supplierData.remaining_amount
    : "",
  installment_batch: props.supplierData
    ? props.supplierData.installment_batch
    : "",
});

const statusLabel = computed(() => {
  return supplierDetail.value.status === "PAID"
    ? "Sudah Dibayar"
    : "Belum Dibayar";
});

const productDetails = ref([]);

const loadExistingData = () => {
  if (props.isEdit && props.supplierData) {
    fetchSupplierDetails();
  }
};

const addProduct = () => {
  productDetails.value.push({
    type: "PRODUCT",
    sku: "",
    amount: 0,
    capital_price: 0,
  });
  skuSearchQuery.value.push("");
};

const handleSubmit = () => {
  page.buttonLoading = true;

  if (props.isEdit) {
    updateStatus();
  } else {
    const requestBody = {
      shop_id: auth.shopId,
      supplier: supplierDetail.value.id,
      supply_id: supplierDetail.value.supply_id,
      due_date: convertToMySQLDatetime(supplierDetail.value.due_date),
      payment_type: paymentType.value,
      data: productDetails.value.map((product) => ({
        type: product.type,
        sku: product.sku,
        capital_price: Number(product.capital_price),
        amount: Number(product.amount),
      })),
    };

    axios
      .post(
        `${process.env.VUE_APP_API_BASE_URL}/api/supplier/supply`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      )
      .then((response) => {
        toast.message = "Sukses";
        toast.description = response?.message;
        toast.type = "SUCCESS";
        toast.trigger();
        emit("save");
      });
  }
};

const updateStatus = () => {
  const requestBody = {
    shop_id: auth.shopId,
    amount: payAmount.value,
    id: supplierDetail.value.id,
  };

  axios
    .put(
      `${process.env.VUE_APP_API_BASE_URL}/api/supplier/supply/pay`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
      }
    )
    .then((response) => {
      toast.message = "Sukses";
      toast.description = response?.message;
      toast.type = "SUCCESS";
      toast.trigger();
      emit("save");
    });
};

const fetchSupplier = () => {
  axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/supplier?shop_id=${auth.shopId}`,
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
    )
    .then(({ data }) => {
      supplierList.value = data.data.map((item) => {
        return {
          id: item.id,
          name: item.name,
          phone_number: item.phone_number,
          address: item.address,
        };
      });
    });
};

const fetchProducts = () => {
  axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/supplier/supply/products?shop_id=${auth.shopId}`,
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
    )
    .then(({ data }) => {
      ingredientsList.value.products = data.data.products.map((item) => {
        return {
          id: item.id,
          name: item.name,
          stock: item.stock,
          price: item.price,
          sku: item.sku,
        };
      });

      ingredientsList.value.ingredients = data.data.ingredients.map((item) => {
        return {
          id: item.id,
          name: item.name,
          stock: item.stock,
          unitName: item.unit_name,
          price: item.price,
        };
      });
    });
};

const fetchSupplierDetails = () => {
  axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/supplier/supply/detail?shop_id=${auth.shopId}&id=${supplierDetail.value.id}`,
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
    )
    .then(({ data }) => {
      productDetails.value = data.data.map((item) => ({
        type: item.product.type,
        sku: item.product.sku,
        name: item.product.name,
        amount: item.amount,
        capital_price: item.capital_price,
        total_price: item.total_price,
      }));
    });
};

const getSkuOptions = (type, index) => {
  const list =
    type === "PRODUCT"
      ? ingredientsList.value.products || []
      : ingredientsList.value.ingredients || [];

  if (!skuSearchQuery.value[index]) return list;

  return list.filter((option) =>
    `${option.sku} ${option.name}`
      .toLowerCase()
      .includes(skuSearchQuery.value[index].toLowerCase())
  );
};

const toggleDropdown = (index) => {
  dropdownOpen.value = dropdownOpen.value === index ? null : index;
};

const selectSku = (ingredient, index) => {
  if (productDetails.value[index]) {
    productDetails.value[index].sku = ingredient.sku || ingredient.id;

    productDetails.value[index].displayText = ingredient.sku
      ? `${ingredient.sku} - ${ingredient.name}`
      : ingredient.name;

    dropdownOpen.value = null; // Close dropdown
  } else {
    console.error(`Product at index ${index} does not exist.`);
    console.error(productDetails.value);
  }
};

const resetIfDefault = (field, index) => {
  if (field === "payAmount") {
    // Reset payAmount if it is 0
    payAmount.value = payAmount.value === 0 ? "" : payAmount.value;
  } else if (index !== null && productDetails.value[index][field] === 0) {
    // Reset the specific field in productDetails if it is 0
    productDetails.value[index][field] = "";
  }
};

const resetSku = (index) => {
  productDetails.value[index].sku = "";
  productDetails.value[index].displayText = "";
  skuSearchQuery[index] = "";
};

const removeProduct = (index) => {
  productDetails.value.splice(index, 1);
  skuSearchQuery.value.splice(index, 1);
};

const cancelForm = () => {
  emit("cancel");
};

watch(
  () => supplierDetail.value.id,
  (newId) => {
    const selectedSupplier = supplierList.value.find(
      (supplier) => supplier.id === newId
    );
    if (selectedSupplier) {
      supplierDetail.value.name = selectedSupplier.name;
      supplierDetail.value.address = selectedSupplier.address;
      supplierDetail.value.phone_number = selectedSupplier.phone_number;
    } else {
      supplierDetail.value.name = "";
      supplierDetail.value.address = "";
      supplierDetail.value.phone_number = "";
    }
  }
);

onMounted(() => {
  fetchSupplier();
  fetchProducts();
  if (props.isEdit) {
    loadExistingData();
  }
});
</script>
