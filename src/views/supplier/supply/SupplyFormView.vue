<template>
  <PageContainer title="Supplier Detail" subtitle="Daftar supplier yang ada...">
    <!-- Apply a max-height to the form and enable scrolling -->
    <form @submit.prevent="handleSubmit" class="max-h-[95vh] overflow-y-auto">
      <!-- Supplier Detail -->
      <DashboardCard class="form-section">
        <!-- If not editing, show input field for supplier name -->
        <div v-if="!isEdit">
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
          <div class="flex flex-row justify-between space-x-4 mt-4">
            <TextInput
              v-model="supplierDetail.due_date"
              name="due_date"
              type="date"
              label="Tenggat Waktu"
              required
              class="w-1/2"
            />
            <TextInput
              :value="totalPrice"
              v-model="supplierDetail.total_price"
              name="total_price"
              label="Total Harga"
              placeholder="Enter total price"
              readonly
              class="w-1/2"
            />
          </div>
        </div>

        <div v-else class="flex flex-col space-y-2">
          <p><strong>Supplier:</strong> {{ supplierDetail.id }}</p>
          <div class="flex flex-row justify-between space-x-4 mt-4">
            <TextInput
              v-model="statusLabel"
              name="status"
              type="text"
              label="Status Pembayaran"
              readonly
              class="w-1/2"
            />
            <TextInput
              v-model="supplierDetail.tr_datetime"
              name="tr_datetime"
              label="Tanggal Transaksi"
              type="text"
              readonly
              class="w-1/2"
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
            />
            <TextInput
              v-model="supplierDetail.total_price"
              name="total_price"
              label="Total Harga"
              type="text"
              readonly
              class="w-1/2"
            />
          </div>
        </div>

        <CustomButton
          class="w-1/4 mt-4 bg-primary-600"
          type="submit"
          v-if="isEdit"
        >
          Update Status
        </CustomButton>
      </DashboardCard>

      <!-- Product/Ingredient Detail -->
      <DashboardCard
        v-for="(product, index) in productDetails"
        :key="index"
        class="form-section mt-8"
      >
        <h2>Product/Ingredient Detail</h2>
        <hr />
        <div v-if="isEdit">
          <div class="flex flex-row justify-between space-x-4 mt-4">
            <TextInput
              v-model="product.type"
              name="type"
              type="text"
              label="Tipe Produk"
              readonly
              class="w-1/2"
            />
            <TextInput
              v-model="product.sku"
              name="sku"
              label="SKU"
              type="text"
              readonly
              class="w-1/2"
            />
          </div>
          <div class="flex flex-row justify-between space-x-4 mt-4">
            <TextInput
              v-model="product.amount"
              name="amount"
              type="text"
              label="Amount"
              readonly
              class="w-1/2"
            />
            <TextInput
              v-model="product.capital_price"
              name="capital_price"
              label="Capital Price"
              type="text"
              readonly
              class="w-1/2"
            />
          </div>
          <TextInput
            v-model="product.total_price"
            name="total_price"
            label="Total Harga"
            type="text"
            readonly
            class="w-1/2"
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
                <option value="PRODUCT">Product</option>
                <option value="INGREDIENT">Ingredient</option>
              </select>
            </div>
            <div class="w-1/2">
              <label
                for="sku"
                class="pb-2 text-primary-600 peer-focus:ml-1 peer-focus:-translate-y-3 peer-focus:px-1 peer-focus:text-sm"
                >SKU</label
              >
              <select
                v-model="product.sku"
                name="sku"
                required
                class="peer w-full border-b rounded-lg placeholder:text-transparent p-4 focus:outline-none focus:ring-2 ring-primary-600 transition-all"
                :class="{
                  'ring-2': modelValue,
                  'cursor-not-allowed !bg-white !ring-slate-500 !text-slate-500':
                    disabled,
                }"
              >
                <option value="" disabled>Pilih SKU</option>
                <option
                  v-for="ingredient in ingredientsList"
                  :key="ingredient.name"
                  :value="ingredient.name"
                >
                  {{ ingredient.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="flex flex-row justify-between space-x-4">
            <TextInput
              v-model="product.amount"
              name="amount"
              label="Amount"
              type="number"
              placeholder="Enter amount"
              required
              class="w-1/2"
            />
            <TextInput
              v-model="product.capital_price"
              name="capital_price"
              label="Capital Price"
              type="number"
              placeholder="Enter capital price"
              required
              class="w-1/2"
            />
          </div>
        </div>
      </DashboardCard>

      <div
        class="flex flex-col space-y-4 w-full items-center justify-center mt-8"
      >
        <CustomButton
          v-if="!isEdit"
          class="w-1/4 bg-primary-600"
          @click="addProduct"
        >
          Tambah Produk/Ingredient
        </CustomButton>
        <CustomButton class="w-1/4 bg-primary-600" type="submit">
          Submit
        </CustomButton>
        <CustomButton class="w-1/4 bg-red-600" @click="cancelForm">
          Cancel
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
import DashboardCard from "@/components/Card/DashboardCard.vue";
import useAuth from "@/stores/useAuth";
import PageContainer from "@/views/PageContainer.vue";
import useToast from "@/stores/useToast";

const toast = useToast();
const auth = useAuth();
const supplierList = ref([]);
const ingredientsList = ref([]);

const TextInput = defineAsyncComponent(() =>
  import("@/components/Input/TextInput.vue")
);

const props = defineProps({
  isEdit: Boolean,
  supplierData: Object,
});

const emit = defineEmits(["cancel", "save"]);

const totalPrice = computed(() => {
  return productDetails.value.reduce((sum, product) => {
    // Ensure capital_price is treated as a number
    const price = parseFloat(product.capital_price) || 0;
    return sum + price;
  }, 0);
});

const supplierDetail = ref({
  id: props.supplierData ? props.supplierData.id : "",
  status: props.supplierData ? props.supplierData.status : "",
  tr_datetime: props.supplierData ? props.supplierData.tr_datetime : "",
  due_date: props.supplierData ? props.supplierData.due_date : "",
  total_price: props.supplierData ? props.supplierData.total_price : "",
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
};

const handleSubmit = () => {
  if (props.isEdit) {
    updateStatus();
  } else {
    const requestBody = {
      shop_id: auth.shopId,
      supplier: supplierDetail.value.id,
      supply_id: supplierDetail.value.supply_id,
      due_date: supplierDetail.value.due_date,
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

const fetchIngredients = () => {
  axios
    .get(
      `${process.env.VUE_APP_API_BASE_URL}/api/ingredients?shop_id=${auth.shopId}`,
      {
        headers: {
          Authorization: `Bearer ${auth.authToken}`,
        },
        withCredentials: true,
      }
    )
    .then(({ data }) => {
      ingredientsList.value = data.data.map((item) => {
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
  fetchIngredients();
  if (props.isEdit) {
    loadExistingData();
  }
});
</script>
